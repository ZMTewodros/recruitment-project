'use client';

import { useState } from 'react';
 import Link from 'next/link';

const jobs = [
  {
    id: 1,
    title: 'Build a Modern Landing Page',
    company: 'Startup Africa',
    location: 'Remote',
    budget: '$800 - $1200',
    type: 'Contract',
    skills: ['React', 'Tailwind', 'UI/UX'],
    verified: true,
  },
  {
    id: 2,
    title: 'Mobile App UI Design',
    company: 'Creative Labs',
    location: 'Nigeria',
    budget: '$500 - $900',
    type: 'Freelance',
    skills: ['Figma', 'UX Research'],
    verified: false,
  },
  {
    id: 3,
    title: 'Full Stack Developer Needed',
    company: 'Tech Solutions',
    location: 'Kenya',
    budget: '$1500 - $2500',
    type: 'Full-time',
    skills: ['Next.js', 'Node.js', 'MongoDB'],
    verified: true,
  },
];

export default function JobsPage() {
  const [search, setSearch] = useState('');

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* HEADER SEARCH */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />

          <button className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">
            Search
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        {/* SIDEBAR FILTERS */}
        <aside className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold mb-4">Job Type</h3>
            <div className="space-y-2 text-sm">
              {['All', 'Full-time', 'Freelance', 'Contract'].map((type) => (
                <button
                  key={type}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold mb-4">Budget</h3>
            <div className="space-y-2 text-sm">
              {['<$500', '$500-$1000', '$1000-$3000', '$3000+'].map(
                (range) => (
                  <button
                    key={range}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {range}
                  </button>
                )
              )}
            </div>
          </div>
        </aside>

        {/* JOB LIST */}
        <section className="md:col-span-3 space-y-6">
          {filteredJobs.length === 0 && (
            <p className="text-gray-500">No jobs found.</p>
          )}

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {job.company} • {job.location}
                  </p>
                </div>

                {job.verified && (
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Verified
                  </span>
                )}
              </div>

              {/* SKILLS */}
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* FOOTER */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-600">
                  {job.budget}
                </span>

               

            <Link
            href={`/jobs/${job.id}`}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
            View Details
            </Link>

              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
