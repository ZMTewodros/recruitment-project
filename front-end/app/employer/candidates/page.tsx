"use client";

export default function CandidatesPage() {
  const candidates = [
    {
      id: 1,
      name: "John Doe",
      position: "Frontend Developer",
      status: "Pending",
    },
    {
      id: 2,
      name: "Sarah Smith",
      position: "Backend Developer",
      status: "Reviewed",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Candidates</h2>

      <div className="space-y-4">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="flex justify-between items-center border rounded-lg p-4 hover:shadow-sm transition"
          >
            <div>
              <p className="font-medium">{candidate.name}</p>
              <p className="text-sm text-gray-500">
                Applied for {candidate.position}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-xs rounded-full ${
                candidate.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {candidate.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
