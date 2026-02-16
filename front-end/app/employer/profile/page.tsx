"use client";

import { useState } from "react";
import { Pencil, Save } from "lucide-react";

export default function EmployerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    companyName: "TechNova Solutions",
    email: "contact@technova.com",
    phone: "+1 234 567 890",
    website: "https://technova.com",
    location: "New York, USA",
    about:
      "TechNova Solutions is a fast-growing software company focused on building scalable web and mobile applications.",
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
        <h2 className="text-2xl font-bold">Company Profile</h2>

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

      {/* COMPANY LOGO */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-semibold">
          TN
        </div>

        {isEditing && (
          <input
            type="file"
            className="text-sm"
          />
        )}
      </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* COMPANY NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Name
          </label>
          <input
            name="companyName"
            value={profile.companyName}
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
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
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

        {/* WEBSITE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Website
          </label>
          <input
            name="website"
            value={profile.website}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* LOCATION */}
        <div className="md:col-span-2">
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

        {/* ABOUT */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            About Company
          </label>
          <textarea
            name="about"
            value={profile.about}
            onChange={handleChange}
            disabled={!isEditing}
            rows={5}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

      </div>
    </div>
  );
}
