"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Send, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EmployerMessagesPage() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const candidateName = searchParams.get("name") || "Candidate";
  
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: "system", text: `You are now chatting with ${candidateName}` }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add your message to the UI
    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: message
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage("");
    
    // NOTE: This is where you would later add your "apiRequest" 
    // to save the message to your database!
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-4">
        <Link href="/employer/candidates" className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft size={20} />
        </Link>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {candidateName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-slate-900">{candidateName}</h2>
          <p className="text-xs text-emerald-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {chatHistory.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[70%] p-4 rounded-[24px] ${
              msg.sender === "me" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : msg.sender === "system"
                ? "bg-slate-200 text-slate-500 text-xs italic mx-auto"
                : "bg-white border border-slate-200 text-slate-900 rounded-tl-none"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex gap-2">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}