"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout, hasMounted } = useAuth();
  const pathname = usePathname();
  
  // Don't render auth-dependent links until we know the auth state
  if (!hasMounted) return <nav className="h-20" />; 

  const isProfilePage = pathname.includes('/profile');
  const isDashboard = pathname.includes('/dashboard');

  const getDashboardPath = () => {
    if (!user) return "/login";
    return user.role === "jobseeker" ? "/jobseeker/dashboard" : "/employer/dashboard";
  };

  return (
    <nav className="max-w-7xl mx-auto flex justify-between items-center p-6 lg:px-12 bg-white">
      <Link href="/" className="text-2xl font-black text-blue-600 italic tracking-tighter">
        RECRUIT.ME
      </Link>

      <div className="flex items-center gap-8">
        <Link href="/jobs" className="hidden md:block text-gray-600 font-medium hover:text-blue-600 transition">
          Explore Jobs
        </Link>

        {user ? (
          <div className="flex items-center gap-5">
            {/* Show Dashboard link if we aren't already on a dashboard page */}
            {!isDashboard && (
              <Link 
                href={getDashboardPath()}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition shadow-lg"
              >
                My Dashboard
              </Link>
            )}
            
            <button 
              onClick={logout} 
              className="text-gray-500 hover:text-red-500 font-medium text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-900 font-bold">Login</Link>
            <Link href="/register" className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold">Join Now</Link>
          </div>
        )}
      </div>
    </nav>
  );
}