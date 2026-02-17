export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* STATS */}
      <section className="grid md:grid-cols-4 gap-6">
        {[
          ['124', 'Total Jobs'],
          ['54', 'Active Jobs'],
          ['320', 'Registered Users'],
          ['12', 'Pending Approvals'],
        ].map(([value, label]) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <p className="text-2xl font-bold text-indigo-600">
              {value}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {label}
            </p>
          </div>
        ))}
      </section>

      {/* RECENT JOBS TABLE */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between">
          <h2 className="font-semibold">Recent Job Posts</h2>
          <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            + Add Job
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-left">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Frontend Developer', 'TechCorp', 'Active'],
              ['Backend Engineer', 'StartupX', 'Pending'],
              ['UI Designer', 'Designify', 'Active'],
            ].map(([title, company, status], index) => (
              <tr
                key={index}
                className="border-t border-gray-200 dark:border-gray-800"
              >
                <td className="px-6 py-4">{title}</td>
                <td className="px-6 py-4">{company}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button className="text-indigo-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* USERS PREVIEW */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold mb-4">
          Latest Registered Users
        </h2>

        <ul className="space-y-3 text-sm">
          {['john@example.com', 'mary@example.com', 'admin@portal.com'].map(
            (email) => (
              <li
                key={email}
                className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2"
              >
                <span>{email}</span>
                <span className="text-gray-500">Job Seeker</span>
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  );
}
