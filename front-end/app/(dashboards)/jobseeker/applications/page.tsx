"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";
import Link from "next/link";

interface Application {
  id: number;
  status: string;
  applied_at: string;
  cv_file: string;
  job: {
    id: number;
    title: string;
    location: string;
    company: {
      name: string;
    };
  };
}

export default function MyApplicationsPage() {
  const { token, hasMounted } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token || !hasMounted) return;
      try {
        setLoading(true);
        // This calls your @Get('my') endpoint in NestJS
        const result = await apiRequest("/applications/my", "GET", null, token);
        setApplications(result);
      } catch (err: any) {
        setError(err.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token, hasMounted]);

  if (!hasMounted || loading) return (
    <div className="flex h-96 items-center justify-center font-bold text-blue-600 animate-pulse">
      Fetching your application history...
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">My Applications</h1>
        <p className="text-slate-500 mt-2">Track the status of your journey with AfriHire.</p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div 
              key={app.id} 
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800">{app.job.title}</h3>
                <p className="text-slate-500 font-medium">
                  {app.job.company.name} • {app.job.location}
                </p>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                  <span>ID: #{app.id}</span>
                  <Link 
                    href={app.cv_file} 
                    target="_blank" 
                    className="text-blue-600 hover:underline"
                  >
                    View Submitted CV
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</p>
                  <StatusBadge status={app.status} />
                </div>
                
                <Link 
                  href={`/jobseeker/jobs/${app.job.id}`}
                  className="bg-slate-50 text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-colors"
                >
                  View Job
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-slate-400 font-bold text-xl">You haven't applied to any jobs yet.</p>
            <Link 
              href="/jobseeker/jobs" 
              className="text-blue-600 font-black mt-4 inline-block hover:underline"
            >
              Browse Jobs Now →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    PENDING: "bg-orange-50 text-orange-600 border-orange-100",
    SHORTLISTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100",
    ACCEPTED: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-black border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}