"use client";

import { useState } from "react";
import { Pencil, Save } from "lucide-react";

export default function JobseekerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@email.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    title: "Frontend Developer",
    skills: "React, Next.js, TypeScript, TailwindCSS",
    experience:
      "3+ years experience building modern web applications with React and Node.js.",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log(profile); // connect to API later
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">My Profile</h2>

        {isEditing ? (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Save size={16} />
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <Pencil size={16} />
            Edit
          </button>
        )}
      </div>

      {/* PROFILE IMAGE */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-semibold">
          JD
        </div>

        {isEditing && (
          <input type="file" className="text-sm" />
        )}
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* FULL NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            name="email"
            value={profile.email}
            disabled
            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone
          </label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            name="location"
            value={profile.location}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* PROFESSIONAL TITLE */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Professional Title
          </label>
          <input
            name="title"
            value={profile.title}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* SKILLS */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Skills (comma separated)
          </label>
          <input
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* EXPERIENCE */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Experience Summary
          </label>
          <textarea
            name="experience"
            rows={4}
            value={profile.experience}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* RESUME UPLOAD */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Resume
          </label>

          {isEditing ? (
            <input type="file" className="text-sm" />
          ) : (
            <div className="text-sm text-indigo-600">
              Uploaded Resume.pdf
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
