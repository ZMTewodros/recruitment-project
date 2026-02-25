// app/jobs/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import CandidatesPage from "@/app/(dashboards)/employer/candidates/page";

export default function JobDetailsPage() {
  const { token, user, hasMounted } = useAuth();
  const params = useParams();
  const router = useRouter();
  const jobId = Number(params.id);
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      if (!jobId || !hasMounted) return;
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`);
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId, hasMounted]);

  const handleApply = async () => {
    // 1. Check if user is logged in
    if (!token) {
      // Redirect to login and save the current path to return later
      router.push(`/login?redirect=/jobs/${jobId}`);
      return;
    }

    if (!cvFile) return;

    try {
      setApplying(true);
      const formData = new FormData();
      formData.append("file", cvFile);
      formData.append("job_id", jobId.toString());

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to apply");
      
      setApplyMessage({ text: "Application submitted successfully! 🚀", type: 'success' });
      setCvFile(null);
    } catch (err: any) {
      setApplyMessage({ text: err.message || "Failed to submit", type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  if (!hasMounted || loading) return <div className="p-20 text-center font-bold text-blue-600 animate-pulse">Loading job details...</div>;
  if (error || !job) return <div className="p-20 text-center text-red-500 font-bold">Error: {error || "Job not found"}</div>;

  const isEmployer = user && String(user.id) === String(job.company?.userId);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <button onClick={() => router.back()} className="text-slate-400 hover:text-blue-600 font-bold flex items-center gap-2">
        ← Back to Browse
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-[40px] p-10 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <span className="bg-blue-50 text-blue-600 text-xs px-4 py-1.5 rounded-full font-black uppercase mb-4 inline-block">
              {job.category || "General"}
            </span>
            <h1 className="text-4xl font-black">{job.title}</h1>
            <p className="text-xl text-slate-500 mt-2">{job.company?.name} • {job.location}</p>
          </div>
          <div className="md:text-right">
            <p className="text-2xl font-black">${job.salary?.toLocaleString()}</p>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">{job.type || "Full Time"}</p>
          </div>
        </div>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-black mb-4">Job Description</h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>
      </div>

      <div id="apply-section">
        {isEmployer ? (
          <CandidatesPage jobId={job.id} />
        ) : (
          <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl">
            <h2 className="text-3xl font-black mb-2">Ready to apply?</h2>
            {!token ? (
                <div className="mt-6">
                    <p className="text-slate-400 mb-6">You need to be logged in as a Job Seeker to apply for this position.</p>
                    <button 
                        onClick={() => router.push(`/login?redirect=/jobs/${jobId}`)}
                        className="bg-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-500 transition-all"
                    >
                        Login to Apply
                    </button>
                </div>
            ) : (
                <div className="space-y-6 max-w-md">
                    <div className="relative group">
                        <input 
                            type="file" 
                            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center bg-slate-800/50">
                            <p className="text-slate-300 font-bold">
                                {cvFile ? `✅ ${cvFile.name}` : "Click to upload your CV (PDF)"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleApply}
                        disabled={applying || !cvFile}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg disabled:opacity-50"
                    >
                        {applying ? "Submitting..." : "Submit My Application"}
                    </button>
                </div>
            )}
            
            {applyMessage && (
                <div className={`mt-4 p-4 rounded-xl font-bold text-center ${applyMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {applyMessage.text}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}