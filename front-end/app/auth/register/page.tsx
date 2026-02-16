'use client';

import { useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRouter } from 'next/navigation';  

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError('');
  setSuccess('');

  try {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });

    // backend returns the created user object directly (not { user })
    const userRole = data?.role ?? data?.user?.role;

    if (!userRole) {
      throw new Error('Invalid server response');
    }

    // Optional: short success message before redirect
    setSuccess('Account created successfully 🎉');

    setTimeout(() => {
      if (userRole === 'jobseeker') {
        router.replace('/jobseeker/dashboard');
      }

      if (userRole === 'employer') {
        router.replace('/employer/dashboard');
      }

      if (userRole === 'admin') {
        router.replace('/admin/dashboard');
      }
    }, 800);

  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message || 'Registration failed');
    } else {
      setError('Registration failed');
    }
  }
}


//   async function handleSubmit(e: React.FormEvent) {
//   e.preventDefault();
//   setError('');
//   setSuccess('');

//   try {
//     // 🔹 example API call
//     const data = await apiFetch('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify({ name, email, password, role }),
//     });

//     // ✅ SUCCESS
//     setSuccess('Account created successfully 🎉');

//     // reset form
//     // setName('');
//     // setEmail('');
//     // setPassword('');
//     // setRole('jobseeker');

//     // auto-hide toast after 3s
//     setTimeout(() => setSuccess(''), 3000);
//     // Redirect based on role
//       if (data.user.role === "jobseeker") {
//         router.push("/jobseeker/dashboard");
//       }

//       if (data.user.role === "employer") {
//         router.push("/employer/dashboard");
//       }
  
//   } 
  
   
//   catch (err: unknown) {
//     if (err instanceof Error) {
//       setError(err.message || 'Registration failed');
//     } else {
//       setError('Registration failed');
//     }
//   }
// }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">

     <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {/* HEADER */}
        <div className="text-center mb-8">
             {success && (
  <div className="fixed top-6 right-6 z-50">
    <div className="flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg animate-slide-in">
      <span className="text-lg">✅</span>
      <p className="font-medium">{success}</p>
    </div>
  </div>
)}
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join us and start your journey 
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
              {error}
            </p>
          )}

{/* ROLE */}
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Role
  </label>

  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="jobseeker">jobseeker</option>
    <option value="employer">employer</option>
    <option value="admin">admin</option>
  </select>
</div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <a
            href="/auth/login"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

