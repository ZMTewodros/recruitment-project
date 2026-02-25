"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";
import Link from "next/link";

export default function EmployerDashboardPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await apiRequest("/company/stats", "GET", null, token);
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-pulse text-xl font-black text-blue-600">
          Updating AfriHire Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "Employer"}! 👋
        </h1>
        <p className="text-slate-500 font-medium">Manage your hiring pipeline at a glance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Jobs Posted" value={stats?.totalJobs || 0} color="blue" />
        <StatCard label="Total Applicants" value={stats?.totalApplicants || 0} color="emerald" />
        <StatCard label="Shortlisted" value={stats?.shortlisted || 0} color="purple" />
      </div>

      {/* Recent Activity Section */}
      <section className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-800">Recent Applications</h2>
          <Link href="/employer/candidates" className="text-blue-600 font-bold hover:underline">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs font-black uppercase tracking-widest border-b border-slate-50">
                <th className="pb-4">Candidate</th>
                <th className="pb-4">Applied For</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.recentApplications?.length > 0 ? (
                stats.recentApplications.map((app: any) => (
                  <tr key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-700">{app.user.name}</td>
                    <td className="py-4 text-slate-500 font-medium">{app.job.title}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        app.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' :
                        app.status === 'shortlisted' ? 'bg-purple-100 text-purple-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link 
                        href="/employer/candidates" 
                        className="opacity-0 group-hover:opacity-100 bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400 font-medium italic">
                    No recent applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const themes: any = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
  };

  const bgClass = themes[color] || themes.blue;

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-5xl font-black text-slate-800">{value}</span>
        <div className={`${bgClass} w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl`}>+</div>
      </div>
    </div>
  );
}