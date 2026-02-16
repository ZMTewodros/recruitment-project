'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';


const categories = [
  'Frontend',
  'Backend',
  'Design',
  'Product',
  'Marketing',
  'Data',
];

export default function HomePage() {

  const router = useRouter();

function handleJobSeeker() {
  const token = localStorage.getItem('token');

  if (!token) {
    router.push('/auth/register?role=jobseeker');
    return;
  }

  router.push('/jobseeker/dashboard');
}



  const [activeCategory, setActiveCategory] = useState('Frontend');

  return (
    <main className="bg-gray-50 dark:bg-gray-950">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Discover Jobs That <span className="text-indigo-600">Fit You</span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
          Explore real opportunities from growing companies — no signup
          required.
        </p>

        <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={handleJobSeeker}
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          Job Seeker
        </button>

          <Link
            href="/auth/register"
            className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* INTERACTIVE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Explore by Category
        </h2>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full border transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PREVIEW CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">
                {activeCategory} Engineer
              </h3>
              <p className="text-sm text-gray-500">Company {i}</p>

              <div className="mt-3 flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                  Remote
                </span>
                <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                  $70k–$90k
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Preview jobs related to {activeCategory.toLowerCase()} roles.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEARCH PREVIEW */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">
            Search Without Creating an Account
          </h2>
          <p className="mt-3 text-gray-500">
            Try searching — sign up only when you’re ready to apply.
          </p>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <input
              disabled
              placeholder="Job title or keyword"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            />
            <input
              disabled
              placeholder="Location"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
            />
            <button
              disabled
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white opacity-50 cursor-not-allowed"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold text-center mb-12">
          Why Job Seekers Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            ['No Spam', 'Only real jobs from verified companies'],
            ['Remote Friendly', 'Work from anywhere opportunities'],
            ['Fast Apply', 'Simple application process'],
          ].map(([title, desc]) => (
            <div key={title}>
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="text-sm text-gray-500 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center px-6 py-24 bg-indigo-600 text-white">
        <h2 className="text-3xl font-bold">
          Ready When You Are
        </h2>
        <p className="mt-3 text-indigo-100">
          Create an account only when you’re ready to apply.
        </p>

        <Link
          href="/auth/register"
          className="inline-block mt-6 px-8 py-3 rounded-lg bg-white text-indigo-600 font-medium hover:bg-gray-100"
        >
          Get Started Free
        </Link>
      </section>
    </main>
  );
}
