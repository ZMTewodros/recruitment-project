"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered");

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = await apiRequest("/auth/login", "POST", form);

    login({ user: data.user, token: data.access_token });

    if (data.user.profileCompleted) {
      router.push(
        data.user.role === "jobseeker"
          ? "/jobseeker/dashboard"
          : "/employer/dashboard"
      );
    } else {
      router.push("/profile");
    }

  } catch (err: any) {
    alert(err.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-black text-blue-600 italic tracking-tighter">
            RECRUIT.ME
          </Link>
        </div>

        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-10">
          {registered && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100 text-center animate-bounce">
              Welcome aboard! Please sign in.
            </div>
          )}
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-400 font-medium mb-8">Sign in to continue your journey.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Email</label>
              <input name="email" type="email" required onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl focus:border-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                placeholder="name@company.com" />
            </div>

            <div>
              <div className="flex justify-between mb-2 px-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password</a>
              </div>
              <input name="password" type="password" required onChange={handleChange}
                className="w-full px-5 py-4 border-2 border-gray-50 rounded-2xl focus:border-blue-500 bg-gray-50 focus:bg-white outline-none transition-all"
                placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95">
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-400 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                Sign Up for Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}