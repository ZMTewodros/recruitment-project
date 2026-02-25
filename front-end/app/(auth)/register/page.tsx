"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"jobseeker" | "employer">("jobseeker");
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend expects 'name', 'email', 'password', and 'role'
      await apiRequest("/auth/register", "POST", { ...form, role });
      router.push("/login?registered=true");
    } catch (err: any) {
      alert(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Back to home */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black text-blue-600 italic tracking-tighter">
            RECRUIT.ME
          </Link>
        </div>

        <div className="bg-white p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-2 text-sm">Join the network and start growing</p>
          </div>

          {/* --- The Amazing Role Toggle --- */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-8 border border-gray-200">
            <button
              type="button"
              onClick={() => setRole("jobseeker")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                role === "jobseeker" 
                  ? "bg-white shadow-md text-blue-600 scale-[1.02]" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                role === "employer" 
                  ? "bg-white shadow-md text-blue-600 scale-[1.02]" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Employer
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                <input name="name" type="text" required onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl focus:border-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                  placeholder="e.g. Alex Rivera" />
              </div>
              
              <div className="group">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <input name="email" type="email" required onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl focus:border-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                  placeholder="name@company.com" />
              </div>

              <div className="group">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Secure Password</label>
                <input name="password" type="password" required onChange={handleChange}
                  className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl focus:border-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                  placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95">
              {loading ? "Initializing..." : `Sign Up as ${role === 'jobseeker' ? 'Seeker' : 'Employer'}`}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-400 font-medium">
            Already a member? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log In Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}