"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { Send, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";

export default function JobSeekerMessagesPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>}>
      <ChatContent />
    </Suspense>
  );
}

function ChatContent() {
  const { token, user, hasMounted } = useAuth();
  const searchParams = useSearchParams();
  
  const rawId = searchParams.get("employerId");
  const employerId = (rawId && rawId !== "undefined" && rawId !== "null") ? rawId : null;
  const companyName = searchParams.get("company") || "Employer";

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMounted || !token || !employerId) { 
      setLoading(false); 
      return; 
    }

    const fetchMessages = async () => {
      try {
        const data = await apiRequest(`/messages/${employerId}`, "GET", null, token);
        setChatHistory(Array.isArray(data) ? data : []);
      } catch (err) { 
        console.error("Fetch error", err); 
      } finally { 
        setLoading(false); 
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); 
    return () => clearInterval(interval);
  }, [token, hasMounted, employerId]);

  useEffect(() => { 
    scrollRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !token || !employerId) return;

    const temp = message; 
    setMessage("");
    try {
      const savedMsg = await apiRequest("/messages", "POST", { 
        content: temp, 
        receiverId: parseInt(employerId) 
      }, token);
      setChatHistory(prev => [...prev, savedMsg]);
    } catch (err) { 
      alert("Failed to send message."); 
      setMessage(temp); 
    }
  };

  if (!hasMounted) return null;

  if (!employerId && !loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center">
      <AlertCircle size={64} className="text-orange-400 mb-4 opacity-50" />
      <h2 className="text-xl font-bold">Invalid Connection</h2>
      <p className="text-slate-500 mt-2">Could not find a valid Employer ID.</p>
      <Link href="/jobseeker/dashboard" className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">
        Back to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto h-[88vh] flex flex-col bg-white shadow-2xl rounded-[40px] mt-4 border border-slate-100 overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/jobseeker/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black">
            {companyName[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-black text-slate-900">{companyName}</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Chatting with Hiring Manager</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.senderId == user?.id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] p-4 rounded-[22px] shadow-sm font-medium ${
              msg.senderId == user?.id 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white text-slate-800 rounded-tl-none border"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-6 bg-white border-t flex gap-3">
        <input 
          type="text" 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          placeholder="Type your message..." 
          className="flex-1 bg-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600" 
        />
        <button 
          disabled={!message.trim()} 
          className="bg-blue-600 text-white p-4 rounded-2xl disabled:bg-slate-300"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
}