

import { notFound } from 'next/navigation';

const jobs = [
  {
    id: 1,
    title: 'Build a Modern Landing Page',
    company: 'Startup Africa',
    location: 'Remote',
    budget: '$800 - $1200',
    type: 'Contract',
    skills: ['React', 'Tailwind', 'UI/UX'],
    description:
      'We are looking for a frontend developer to build a responsive landing page using modern frameworks. The project includes UI implementation and performance optimization.',
  },
  {
    id: 2,
    title: 'Mobile App UI Design',
    company: 'Creative Labs',
    location: 'Nigeria',
    budget: '$500 - $900',
    type: 'Freelance',
    skills: ['Figma', 'UX Research'],
    description:
      'Design intuitive and clean UI for a fintech mobile application. The role involves wireframing and interactive prototypes.',
  },
  {
    id: 3,
    title: 'Full Stack Developer Needed',
    company: 'Tech Solutions',
    location: 'Kenya',
    budget: '$1500 - $2500',
    type: 'Full-time',
    skills: ['Next.js', 'Node.js', 'MongoDB'],
    description:
      'Looking for a full stack engineer to develop scalable web applications with modern architecture and clean code practices.',
  },
];
export default async function JobDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = jobs.find((j) => j.id === Number(id));

  if (!job) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800">
          {/* TITLE */}
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {job.company} • {job.location}
          </p>

          {/* META */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              {job.type}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              {job.budget}
            </span>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-8">
            <h2 className="font-semibold text-lg mb-2">
              Job Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* SKILLS */}
          <div className="mt-8">
            <h2 className="font-semibold text-lg mb-2">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* APPLY */}
          <div className="mt-10">
            <button className="w-full md:w-auto px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
