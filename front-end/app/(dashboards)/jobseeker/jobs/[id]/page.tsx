"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import CandidatesPage from "@/app/(dashboards)/employer/candidates/page";

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  salary?: string;
  category?: string;
  company: { id: number; name: string; userId: number | string };
}

export default function JobDetailsPage() {
  const { token, user, hasMounted } = useAuth();
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id ? Number(params.id) : null;
  
  const [job, setJob] = useState<Job | null>(null);
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        if (!res.ok) throw new Error("Job not found or API error");
        
        const data = await res.json();
        setJob(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId, token, hasMounted]);

  const handleApply = async () => {
    if (!cvFile || !token || !jobId) return;
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

  if (!hasMounted || loading) return (
    <div className="p-20 text-center font-bold text-blue-600 animate-pulse">
      Loading job details...
    </div>
  );

  if (error || !job) return (
    <div className="p-20 text-center space-y-4">
      <p className="text-red-500 font-bold">Error: {error || "Job not found"}</p>
      <button onClick={() => router.back()} className="text-blue-600 underline">Go Back</button>
    </div>
  );

  const isEmployer = user && String(user.id) === String(job.company?.userId);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* NAVIGATION */}
      <button 
        onClick={() => router.push('/jobseeker/jobs')} 
        className="text-slate-400 hover:text-blue-600 font-bold transition-colors flex items-center gap-2"
      >
        ← Back to Browse
      </button>

      {/* JOB DESCRIPTION SECTION */}
      <div className="bg-white dark:bg-gray-900 rounded-[40px] p-10 border border-slate-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-4 py-1.5 rounded-full font-black uppercase mb-4 inline-block">
              {job.category || "General"}
            </span>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white">{job.title}</h1>
            <p className="text-xl text-slate-500 font-medium mt-2">{job.company?.name} • {job.location}</p>
          </div>
          <div className="md:text-right">
            <p className="text-2xl font-black text-slate-900 dark:text-white">${job.salary?.toLocaleString()}</p>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">{job.type || "Full Time"}</p>
          </div>
        </div>

        <hr className="border-slate-50 dark:border-gray-800 mb-8" />

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Job Description</h2>
          <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg whitespace-pre-line">
            {job.description}
          </p>
        </div>
      </div>

      {/* APPLY AT BOTTOM SECTION */}
      <div id="apply-section">
        {isEmployer ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white px-4">Current Candidates</h2>
            <CandidatesPage jobId={job.id} />
          </div>
        ) : (
          <div className="bg-slate-900 dark:bg-blue-950 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-2">Ready to apply?</h2>
              <p className="text-slate-400 mb-8 max-w-md">Upload your CV below to get noticed by {job.company.name}.</p>
              
              <div className="space-y-6 max-w-md">
                <div className="relative group">
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="border-2 border-dashed border-slate-700 group-hover:border-blue-500 rounded-2xl p-6 text-center transition-all bg-slate-800/50">
                    <p className="text-slate-300 font-bold">
                      {cvFile ? `✅ ${cvFile.name}` : "Click to upload your CV (PDF)"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  disabled={applying || !cvFile}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-500 transition-all disabled:opacity-50 shadow-xl"
                >
                  {applying ? "Submitting..." : "Submit My Application"}
                </button>

                {applyMessage && (
                  <div className={`p-4 rounded-xl font-bold text-center mt-4 ${applyMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {applyMessage.text}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}