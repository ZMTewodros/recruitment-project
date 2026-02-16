"use client";

import { useState } from "react";

export default function PostJobPage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form); // connect to API later
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <input
          name="title"
          placeholder="Job Title"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          required
        />

        <select
          name="type"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
        </select>

        <input
          name="salary"
          placeholder="Salary Range"
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          name="description"
          placeholder="Job Description"
          rows={5}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Publish Job
        </button>
      </form>
    </div>
  );
}
