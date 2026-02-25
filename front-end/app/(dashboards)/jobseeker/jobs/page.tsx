"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";
import Link from "next/link";

export default function BrowseJobsPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await apiRequest("/jobs?limit=20", "GET", null, token);
        // Ensure we extract the array correctly regardless of API structure
        const jobData = result?.data || result || [];
        setJobs(Array.isArray(jobData) ? jobData : []);
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchJobs();
  }, [token]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center font-bold text-blue-600 animate-pulse">
      Loading opportunities...
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Browse Jobs</h1>
        <p className="text-slate-500 mt-2">Find your next big break in Africa's tech ecosystem.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length > 0 ? jobs.map(job => (
          <div key={job.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-50 text-blue-600 text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-wider">
                {job.category || "General"}
              </span>
              <span className="font-bold text-slate-900">
                {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
              </span>
            </div>
            
            <h3 className="text-2xl font-black mb-1 text-slate-800 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-slate-500 mb-6">{job.company?.name} • {job.location}</p>
            
            <Link 
              href={`/jobseeker/jobs/${job.id}`}
              className="block w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all hover:scale-[1.02]"
            >
              View Details
            </Link>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No jobs found. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}