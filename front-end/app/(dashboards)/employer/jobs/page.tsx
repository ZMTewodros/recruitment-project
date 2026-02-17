"use client";

export default function MyJobsPage() {
  const jobs = [
    { id: 1, title: "Frontend Developer", status: "Active", applicants: 32 },
    { id: 2, title: "Backend Developer", status: "Closed", applicants: 21 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">My Jobs</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600 text-sm">
              <th className="pb-3">Job Title</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Applicants</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b hover:bg-gray-50">
                <td className="py-4">{job.title}</td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      job.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="py-4">{job.applicants}</td>
                <td className="py-4 space-x-2">
                  <button className="text-indigo-600 hover:underline text-sm">
                    View
                  </button>
                  <button className="text-red-600 hover:underline text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
