"use client";

import { 
  Briefcase, Eye, X, MessageSquare,
  FileText, ExternalLink, Lock, CheckCircle2 
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";
import Image from "next/image";
import Link from "next/link";

interface Applicant {
  id: number;
  status: string;
  createdAt: string;
  user: { 
    id: number;
    name: string; 
    email: string; 
    avatar?: string;
    bio?: string;
    cv?: string;
    phone?: string;
    location?: string;
  };
  job: { title: string };
}

export default function EmployerCandidatesPage() {
  const { token, hasMounted } = useAuth();
  const [apps, setApps] = useState<Applicant[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Applicant | null>(null);

  const getImageUrl = (path?: string) => {
    if (!path || path === "null" || path === "" || path === "undefined") return null;
    if (path.startsWith("http")) return path;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const serverBase = apiBase.replace("/api", "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${serverBase}${cleanPath}`;
  };

  useEffect(() => {
    if (!hasMounted || !token) return;
    const loadAllApplicants = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/applications/employer/all`, "GET", null, token);
        setApps(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load candidates", err);
      } finally {
        setLoading(false);
      }
    };
    loadAllApplicants();
  }, [token, hasMounted]);

  const handleUpdateStatus = async (applicationId: number, newStatus: string, silent = false) => {
    if (!silent) {
      const confirmMsg = newStatus === 'accepted' ? "Approve this candidate for hire?" : `Move candidate to ${newStatus}?`;
      if (!confirm(confirmMsg)) return;
    }

    try {
      await apiRequest(`/applications/${applicationId}/status`, "PATCH", { status: newStatus }, token);
      
      setApps(prev => prev?.map(a => a.id === applicationId ? { ...a, status: newStatus } : a) || null);
      
      if(selectedCandidate?.id === applicationId) {
        setSelectedCandidate(prev => prev ? {...prev, status: newStatus} : null);
      }
    } catch (err) {
      if (!silent) alert("Update failed. The application may be finalized.");
    }
  };

  const openProfile = (app: Applicant) => {
    setSelectedCandidate(app);
    // Automatically move 'pending' to 'in_review' when opened
    if (app.status === 'pending') {
      handleUpdateStatus(app.id, 'in_review', true);
    }
  };

  const getStatusStyles = (status: string) => {
    switch(status.toLowerCase()) {
      case 'accepted': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'shortlisted': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'in_review': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-amber-100 text-amber-600 border-amber-200';
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-slate-50/30">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Candidates</h1>
        <p className="text-slate-500 font-medium">Manage your recruitment pipeline and move candidates through stages.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {apps?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-300">
               <p className="text-slate-400 font-bold">No applications found yet.</p>
            </div>
          ) : (
            apps?.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 relative">
                    {getImageUrl(app.user.avatar) ? (
                      <Image src={getImageUrl(app.user.avatar)!} alt={app.user.name} fill className="object-cover" unoptimized />
                    ) : (
                      <span className="text-slate-400 font-bold text-2xl uppercase">{app.user.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">{app.user.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                      <Briefcase size={14} className="text-slate-400" /> {app.job.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border ${getStatusStyles(app.status)}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                  
                  <button 
                    onClick={() => openProfile(app)} 
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Eye size={16} /> View Profile
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
            <button onClick={() => setSelectedCandidate(null)} className="absolute top-6 right-6 p-2 bg-white/80 hover:bg-red-100 rounded-full z-10 border border-slate-100">
              <X size={20} />
            </button>

            {/* Header */}
            <div className="bg-slate-50 p-8 border-b border-slate-100">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-28 h-28 bg-white rounded-[36px] flex items-center justify-center text-slate-300 text-4xl font-black shadow-lg overflow-hidden border-4 border-white shrink-0 relative">
                  {getImageUrl(selectedCandidate.user.avatar) ? (
                    <Image src={getImageUrl(selectedCandidate.user.avatar)!} alt="Profile" fill className="object-cover" unoptimized />
                  ) : ( <span className="uppercase">{selectedCandidate.user.name.charAt(0)}</span> )}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-black text-slate-900 leading-tight">{selectedCandidate.user.name}</h2>
                  <p className="text-blue-600 font-bold flex items-center justify-center md:justify-start gap-2">
                    <Briefcase size={16} /> {selectedCandidate.job.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Email</span>
                  <p className="font-bold truncate">{selectedCandidate.user.email}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1">Phone</span>
                  <p className="font-bold">{selectedCandidate.user.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Candidate Bio</h4>
                <div className="text-slate-600 bg-white p-6 rounded-3xl border border-slate-100 text-sm leading-relaxed">
                  {selectedCandidate.user.bio || "No summary provided."}
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[32px] text-white">
                <div className="flex items-center gap-4">
                  <FileText size={24} className="text-blue-400" />
                  <p className="font-black">CV / Resume</p>
                </div>
                {selectedCandidate.user.cv ? (
                  <a href={selectedCandidate.user.cv} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-500 flex items-center gap-2">
                    Open CV <ExternalLink size={14} />
                  </a>
                ) : <span className="text-slate-500 text-sm">Not attached</span>}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              {['pending', 'in_review', 'shortlisted'].includes(selectedCandidate.status) && (
                <button onClick={() => handleUpdateStatus(selectedCandidate.id, "rejected")} className="text-red-600 font-black uppercase text-xs hover:underline">
                  Reject Candidate
                </button>
              )}

              <div className="flex gap-3 ml-auto">
                {/* Fixed Chat Button Logic: Ensure status matches exactly */}
                
{['shortlisted', 'accepted'].includes(selectedCandidate.status) && (
  <Link 
    href={`/employer/messages?candidateId=${selectedCandidate.user.id}&name=${selectedCandidate.user.name}`}
    className="bg-white text-slate-900 border-2 border-slate-900 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
  >
    <MessageSquare size={18} /> Chat with {selectedCandidate.user.name.split(' ')[0]}
  </Link>
)}
                {selectedCandidate.status === 'in_review' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedCandidate.id, "shortlisted")} 
                    className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-purple-700"
                  >
                    Shortlist
                  </button>
                )}

                {selectedCandidate.status === 'shortlisted' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedCandidate.id, "accepted")} 
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:bg-emerald-700 flex items-center gap-2"
                  >
                    <CheckCircle2 size={18}/> Hire Candidate
                  </button>
                )}

                {['accepted', 'rejected'].includes(selectedCandidate.status) && (
                  <div className="text-slate-400 font-bold italic py-2 flex items-center gap-2">
                    <Lock size={16}/> Application Finalized
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}