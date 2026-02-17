"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Users,
  PlusCircle,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // 🔒 If not logged in
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  // 🔒 Profile completion guard
  useEffect(() => {
    if (!user) return;

    if (!user.profileCompleted && !pathname.includes("/profile")) {
      router.replace(`/${user.role}/profile`);
    }
  }, [user, pathname, router]);

  if (!user) return null;

  // 🎯 ROLE BASED MENU
  const roleMenus: Record<string, any[]> = {
    jobseeker: [
      {
        name: "Dashboard",
        href: "/jobseeker/dashboard",
        icon: <LayoutDashboard size={18} />,
      },
      {
        name: "Browse Jobs",
        href: "/jobseeker/jobs",
        icon: <Briefcase size={18} />,
      },
      {
        name: "Applications",
        href: "/jobseeker/applications",
        icon: <FileText size={18} />,
      },
      {
        name: "Profile",
        href: "/jobseeker/profile",
        icon: <User size={18} />,
      },
    ],

    employer: [
      {
        name: "Dashboard",
        href: "/employer/dashboard",
        icon: <LayoutDashboard size={18} />,
      },
      {
        name: "Post Job",
        href: "/employer/post-jobs",
        icon: <PlusCircle size={18} />,
      },
      {
        name: "My Jobs",
        href: "/employer/jobs",
        icon: <Briefcase size={18} />,
      },
      {
        name: "Candidates",
        href: "/employer/candidates",
        icon: <Users size={18} />,
      },
      {
        name: "Profile",
        href: "/employer/profile",
        icon: <User size={18} />,
      },
    ],

    admin: [
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboard size={18} />,
      },
      {
        name: "Manage Users",
        href: "/admin/users",
        icon: <Users size={18} />,
      },
      {
        name: "Manage Jobs",
        href: "/admin/jobs",
        icon: <Briefcase size={18} />,
      },
      {
        name: "Profile",
        href: "/admin/profile",
        icon: <User size={18} />,
      },
    ],
  };

  const menuItems = roleMenus[user.role] || [];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white border-r transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="p-6 text-xl font-bold border-b flex justify-between items-center">
          Recruitment Panel
          <button
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              logout();
              localStorage.removeItem("token");
              router.replace("/login");
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h1 className="font-semibold text-lg">
              Welcome back 👋
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
