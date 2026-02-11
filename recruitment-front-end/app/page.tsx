import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="bg-gray-50 dark:bg-gray-950">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Find Your Next <span className="text-indigo-600">Dream Job</span>
        </h1>

        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse thousands of jobs from top companies. Apply fast, track easily,
          and get hired with confidence.
        </p>

        {/* SEARCH
        <div className="mt-8 flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="Job title or keyword"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          />
          <input
            type="text"
            placeholder="Location or Remote"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          />
          <Link
            href="/jobs"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Search
          </Link>
        </div> */}
      </section>

      {/* STATS */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ['10k+', 'Jobs Posted'],
            ['2k+', 'Companies'],
            ['50k+', 'Candidates'],
            ['95%', 'Success Rate'],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-indigo-600">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Featured Jobs</h2>
          <Link href="/jobs" className="text-indigo-600 font-medium">
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Frontend Developer',
              company: 'TechCorp',
              location: 'Remote',
              salary: '$70k–$90k',
            },
            {
              title: 'Backend Engineer',
              company: 'StartupX',
              location: 'Berlin',
              salary: '$80k–$100k',
            },
            {
              title: 'Product Designer',
              company: 'Designify',
              location: 'London',
              salary: '$60k–$85k',
            },
          ].map((job) => (
            <div
              key={job.title}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.company}</p>

              <div className="mt-3 flex gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                  {job.location}
                </span>
                <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                  {job.salary}
                </span>
              </div>

              <Link
                href="/jobs"
                className="mt-4 inline-block text-sm font-medium text-indigo-600"
              >
                View details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              ['Create Profile', 'Sign up and build your professional profile'],
              ['Find Jobs', 'Search and filter jobs that fit your skills'],
              ['Get Hired', 'Apply and connect directly with employers'],
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
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold">
          Ready to take the next step?
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Join thousands of professionals finding better opportunities.
        </p>

        <Link
          href="/register"
          className="inline-block mt-6 px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}
