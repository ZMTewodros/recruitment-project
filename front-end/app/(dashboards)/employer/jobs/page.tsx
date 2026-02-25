"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";

export default function JobsPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary: 0,
    deadline: "",
  });

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const load = async () => {
      try {
        const company = await apiRequest("/company/me", "GET", null, token);
        setCompanyId(company.id);

        const myJobs = await apiRequest("/jobs/my", "GET", null, token);
        setJobs(myJobs);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      }
    };

    if (token) load();
  }, [token]);

  // ---------------- CREATE OR UPDATE ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    try {
      if (isEditing) {
        const updatedJob = await apiRequest(
          `/jobs/${isEditing}`,
          "PATCH",
          { ...form, salary: Number(form.salary) },
          token
        );
        setJobs((prev) =>
          prev.map((job) => (job.id === isEditing ? updatedJob : job))
        );
        alert("Job updated successfully!");
      } else {
        const newJob = await apiRequest(
          "/jobs",
          "POST",
          { ...form, salary: Number(form.salary), companyId },
          token
        );
        setJobs((prev) => [...prev, newJob]);
        alert("Job posted successfully!");
      }

      setForm({ title: "", description: "", category: "", location: "", salary: 0, deadline: "" });
      setIsEditing(null);
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  // ---------------- DELETE ----------------
  const deleteJob = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await apiRequest(`/jobs/${id}`, "DELETE", null, token);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ---------------- STATUS CHANGE (FIXED) ----------------
  const changeStatus = async (id: number, currentStatus: string) => {
    try {
      // FIX: Ensure values match Backend JobStatus Enum (UPPERCASE)
      const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";

      const updatedJob = await apiRequest(
        `/jobs/${id}/status`,
        "PATCH",
        { status: newStatus },
        token
      );

      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status: updatedJob.status } : job))
      );
    } catch (err) {
      console.error(err);
      alert("Status update failed. Verify the backend Enum uses 'OPEN'/'CLOSED'.");
    }
  };

  // ---------------- PREPARE EDIT ----------------
  const startEdit = (job: any) => {
    setIsEditing(job.id);
    setForm({
      title: job.title,
      description: job.description,
      category: job.category,
      location: job.location,
      salary: job.salary,
      deadline: job.deadline ? job.deadline.split("T")[0] : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-10">
      {/* Form Section */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "✏️ Edit Job Posting" : "➕ Post a New Job"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Job Title"
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              placeholder="Category (e.g. IT, Design)"
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
            <input
              placeholder="Location"
              className="input"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Salary"
              className="input"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1 ml-1">Application Deadline</label>
            <input
              type="date"
              className="input"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          <textarea
            placeholder="Detailed Job Description"
            className="input min-h-[120px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div className="flex gap-2">
            <button type="submit" className="btn flex-1 bg-black text-white hover:bg-gray-800 transition-colors">
              {isEditing ? "Update Job" : "Post Job"}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { setIsEditing(null); setForm({ title: "", description: "", category: "", location: "", salary: 0, deadline: "" }); }}
                className="btn bg-gray-200 text-black hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Job List Section */}
      <div>
        <h2 className="text-xl font-bold mb-6">Manage Your Jobs</h2>
        <div className="grid grid-cols-1 gap-4">
          {jobs.length === 0 ? (
            <p className="text-gray-500 italic">No jobs posted yet.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="card flex flex-col md:flex-row justify-between items-start md:items-center border border-transparent hover:border-gray-200 transition-all">
                <div>
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary ? `$${job.salary.toLocaleString()}` : "N/A"}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <button className="btn-outline" onClick={() => startEdit(job)}>
                    Edit
                  </button>
                  <button 
                    className="btn-outline" 
                    onClick={() => changeStatus(job.id, job.status)}
                  >
                    {job.status === "OPEN" ? "Close Job" : "Reopen Job"}
                  </button>
                  <button className="btn bg-red-500 text-white hover:bg-red-600" onClick={() => deleteJob(job.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .card { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e5e7eb; font-size: 0.95rem; transition: border 0.2s; }
        .input:focus { outline: none; border-color: #000; }
        .btn { padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-outline { padding: 8px 16px; border-radius: 8px; border: 1px solid #e5e7eb; background: white; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { background: #f9fafb; border-color: #d1d5db; }
      `}</style>
    </div>
  ); 
}