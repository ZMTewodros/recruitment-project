'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from "@/app/context/AuthContext";

interface Job {
  id: number;
  title: string;
  category: string;
  location: string;
  salary: number;
  description: string;
  status: string;
  company?: {
    name: string;
  };
}

export default function JobsPage() {
  const { token, hasMounted } = useAuth();
  
  const [jobs, setJobs] = useState<Job[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [locationQuery, setLocationQuery] = useState('');

  const fetchJobs = useCallback(async () => {
    // DO NOT fetch if the auth context hasn't finished loading from localStorage
    if (!hasMounted) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('title', searchQuery);
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (locationQuery) queryParams.append('location', locationQuery);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/jobs?${queryParams.toString()}`;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Ensure token is attached if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in to view jobs.");
        }
        throw new Error(`Error ${response.status}: Failed to fetch jobs`);
      }

      const result = await response.json();
      const jobData = result.data || result; // Handle both paginated and flat arrays
      setJobs(Array.isArray(jobData) ? jobData : []);
      
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, hasMounted, searchQuery, selectedCategory, locationQuery]);

  // Initial load and re-fetch logic
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  // While waiting for Auth to mount, show a simple loader to prevent 401 race condition
  if (!hasMounted) return <div className="min-h-screen flex items-center justify-center">Loading Session...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSearchSubmit} className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by job title (e.g. React, NestJS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
                  </form>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 text-lg">Category</h3>
            <div className="space-y-2">
              {['All', 'Software', 'Design', 'Marketing', 'Development'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white font-bold shadow-sm' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="space-y-4">
               {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"></div>)}
            </div>
          ) : error ? (
            <div className="p-10 text-center bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
              ⚠️ {error}
              {error.includes("Unauthorized") && (
                <Link href="/login" className="block mt-2 text-blue-600 underline">Click here to Login</Link>
              )}
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="group bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">
                      {job.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600">{job.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{job.company?.name} • {job.location}</p>
                  </div>
                  <span className="text-sm font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                    ${job.salary?.toLocaleString()}
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <Link href={`/jobs/${job.id}`} className="px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-black transition-all">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}