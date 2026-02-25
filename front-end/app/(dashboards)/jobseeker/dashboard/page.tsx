"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";
import { MessageSquare, Star, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function JobSeekerDashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const result = await apiRequest("/dashboard/jobseeker", "GET", null, token);
      setData(result);
    } catch (err: any) {
      console.error("Dashboard load failed", err);
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Resolves the Employer's User ID from the application object
  const findEmployerId = (app: any) => {
    return (
      app.job?.company?.user?.id || 
      app.job?.company?.userId || 
      null
    );
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="tracking-widest uppercase text-xs font-bold text-blue-600">Loading AfriHire...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className="text-center bg-white p-10 rounded-[32px] shadow-xl border border-red-100">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-black text-slate-900">Oops! Something went wrong</h2>
        <p className="text-slate-500 mt-2 mb-6">{error}</p>
        <button onClick={refreshData} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-slate-500 mt-2">Your application pipeline at a glance.</p>
      </header>

      {/* Stats Grid - Fixed precise filtering logic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Applied Jobs" 
          value={data?.appliedJobs?.length || 0} 
          color="blue" 
          icon={<Star size={24} fill="currentColor" />} 
        />
        <StatCard 
          label="Shortlisted" 
          value={
            data?.appliedJobs?.filter((app: any) => 
              app.status?.toLowerCase() === 'shortlisted'
            ).length || 0
          } 
          color="emerald" 
          icon={<Star size={24} fill="currentColor" />} 
        />
        <StatCard 
          label="Pending" 
          value={
            data?.appliedJobs?.filter((app: any) => 
              !['shortlisted', 'accepted', 'rejected'].includes(app.status?.toLowerCase())
            ).length || 0
          } 
          color="orange" 
          icon={<Clock size={24} />} 
        />
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="font-black text-slate-900 uppercase tracking-widest text-sm">Application Status</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Job Position</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Company</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data?.appliedJobs?.length > 0 ? (
              data.appliedJobs.map((app: any) => {
                const targetId = findEmployerId(app);
                const status = app.status?.toLowerCase();
                const isProcessable = ['shortlisted', 'accepted'].includes(status);
                
                return (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-bold text-slate-800">{app.job?.title || "Untitled Position"}</td>
                    <td className="p-6 text-slate-500">{app.job?.company?.name || "Company"}</td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                        status === 'shortlisted' || status === 'accepted' 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : status === 'rejected' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      {isProcessable && targetId ? (
                        <Link 
                          href={`/jobseeker/messages?employerId=${targetId}&company=${encodeURIComponent(app.job?.company?.name || "Employer")}`}
                          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all inline-flex items-center gap-2 shadow-sm hover:shadow-blue-200"
                        >
                          <MessageSquare size={16} /> Chat
                        </Link>
                      ) : (
                        <span className="text-slate-300 text-xs italic font-medium">
                          {status === 'rejected' ? 'Application Closed' : 'Awaiting Review'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <p className="text-slate-400 italic">No applications found.</p>
                  <Link href="/browse" className="text-blue-600 font-bold text-sm mt-2 inline-block underline">Browse jobs now</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: "blue" | "emerald" | "orange";
  icon: React.ReactNode;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  const colors = { 
    blue: "bg-blue-50 text-blue-600", 
    emerald: "bg-emerald-50 text-emerald-600", 
    orange: "bg-orange-50 text-orange-600" 
  };
  
  return (
    <div className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
      <div>
        <p className="text-slate-400 text-xs font-black uppercase mb-2 tracking-widest">{label}</p>
        <span className="text-5xl font-black text-slate-900 leading-none">{value}</span>
      </div>
      <div className={`${colors[color]} w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner`}>
        {icon}
      </div>
    </div>
  );
}