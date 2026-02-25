"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  UserCircle, 
  LogOut,
  Search,
  FileText
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, hasMounted } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hasMounted && !user) router.push("/login");
  }, [user, router, hasMounted]);

  if (!hasMounted || !user) return null;

  const isActive = (path: string) =>
    pathname === path 
      ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
      : "text-slate-400 hover:bg-slate-50 hover:text-slate-800";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r flex flex-col p-8 fixed h-full z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">AfriHire</h2>
        </div>

        <nav className="flex-1 space-y-2">
          {user.role === "employer" ? (
            <>
              <SidebarLink href="/employer/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" active={isActive("/employer/dashboard")} />
              <SidebarLink href="/employer/jobs" icon={<Briefcase size={20}/>} label="Jobs" active={isActive("/employer/jobs")} />
              <SidebarLink href="/employer/candidates" icon={<Users size={20}/>} label="Candidates" active={isActive("/employer/candidates")} />
              <SidebarLink href="/employer/messages" icon={<MessageSquare size={20}/>} label="Messages" active={isActive("/employer/messages")} />
            </>
          ) : (
            <>
              <SidebarLink href="/jobseeker/dashboard" icon={<LayoutDashboard size={20}/>} label="My Dashboard" active={isActive("/jobseeker/dashboard")} />
              <SidebarLink href="/jobseeker/jobs" icon={<Search size={20}/>} label="Browse Jobs" active={isActive("/jobseeker/jobs")} />
              <SidebarLink href="/jobseeker/applications" icon={<FileText size={20}/>} label="Applications" active={isActive("/jobseeker/applications")} />
              <SidebarLink href="/jobseeker/messages" icon={<MessageSquare size={20}/>} label="Messages" active={isActive("/jobseeker/messages")} />
            </>
          )}
          <hr className="my-4 border-slate-100" />
          <SidebarLink href="/profile" icon={<UserCircle size={20}/>} label="Profile" active={isActive("/profile")} />
        </nav>

        <button onClick={logout} className="mt-auto p-4 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors text-left flex items-center gap-3">
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: string }) {
  return (
    <Link href={href} className={`flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${active}`}>
      {icon}
      {label}
    </Link>
  );
}