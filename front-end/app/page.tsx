"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* --- Navbar --- */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-6 lg:px-12">
        <Link href="/" className="text-2xl font-black text-blue-600 italic tracking-tighter">
          RECRUIT.ME
        </Link>
        
        <div className="flex items-center gap-8">
          <Link href="/jobs" className="text-gray-600 font-bold hover:text-blue-600 transition">
            Explore Jobs
          </Link>
          
          {/* REPLACED: Dashboard logic removed. Now shows Profile if logged in, otherwise Login. */}
          {user ? (
            <div className="flex items-center gap-6">
               <Link href="/profile" className="text-gray-900 font-black hover:text-blue-600 transition">
                My Profile
              </Link>
              <button 
                onClick={logout}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-gray-900 font-black hover:text-blue-600 transition">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
            Next-Gen Recruitment
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] tracking-tight">
            WORK <br /><span className="text-blue-600">REDEFINED.</span>
          </h1>
          <p className="mt-8 text-xl text-gray-500 max-w-lg leading-relaxed">
            The modern standard for recruitment. Seamlessly connecting high-growth companies with the world&apos;s best talent.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <Link href="/register" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:translate-y-[-4px] transition-all shadow-2xl shadow-blue-300 text-center">
              Find a Job
            </Link>
            <Link href="/register" className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all text-center">
              Hire Talent
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 shadow-sm overflow-hidden relative">
                   <Image 
                    src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} 
                    fill 
                    alt="Trusted User" 
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 font-medium italic">
              Trusted by <span className="text-gray-900 font-bold">10,000+</span> professionals
            </p>
          </div>
        </div>

        {/* --- Hero Visual Card --- */}
        <div className="relative group">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-400 w-full aspect-square rounded-[60px] rotate-3 absolute inset-0 -z-10 opacity-10 group-hover:rotate-6 transition-transform duration-700"></div>
          <div className="bg-white border border-gray-100 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 relative overflow-hidden">
             <div className="flex justify-between items-center mb-10">
                <div className="space-y-3">
                  <div className="h-4 w-40 bg-gray-100 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-50 rounded-full"></div>
                </div>
                <div className="h-14 w-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center">
                  <span className="text-white font-bold text-xs uppercase tracking-tighter">App</span>
                </div>
             </div>
             
             <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`flex gap-5 items-center ${i === 1 ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-3.5 w-full bg-gray-100 rounded-full"></div>
                      <div className="h-3.5 w-2/3 bg-gray-50 rounded-full"></div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto p-12 text-center border-t border-gray-50 mt-10">
        <p className="text-gray-400 font-bold tracking-widest text-[10px] uppercase">
          Built with NestJS • Next.js 14 • TailwindCSS
        </p>
      </footer>
    </div>
  );
}