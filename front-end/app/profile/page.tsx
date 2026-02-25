"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Types for the arrays
interface Experience {
  company: string;
  role: string;
  duration: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
}

export default function UnifiedProfilePage() {
  const { user, token, hasMounted } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "",
    cv: "",
    skills: [] as string[],
    experience: [] as Experience[],
    education: [] as Education[],
  });

  const [company, setCompany] = useState({
    name: "",
    description: "",
    address: "",
    logo: "",
  });

  const isEmployer = user?.role?.toLowerCase().includes("employer");

  useEffect(() => {
    if (hasMounted && !user) {
      router.push("/login");
    } else if (token) {
      fetchData();
    }
  }, [token, hasMounted, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userData = await apiRequest("/profile/me", "GET", null, token);
      setProfile({
        name: userData.name || "",
        phone: userData.phoneNumber || userData.phone || "",
        location: userData.location || "",
        bio: userData.bio || "",
        avatar: userData.avatar || "",
        cv: userData.cv || "",
        skills: userData.skills || [],
        experience: userData.experience || [],
        education: userData.education || [],
      });

      if (isEmployer) {
        try {
          const companyData = await apiRequest("/profile/company", "GET", null, token);
          if (companyData) {
            setCompany({
              name: companyData.name || "",
              description: companyData.description || "",
              address: companyData.address || "",
              logo: companyData.logo || "",
            });
          }
        } catch (e) {
          console.warn("Company profile not yet created.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Dynamic Array Helpers ---
  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { company: "", role: "", duration: "" }],
    });
  };

  const removeExperience = (index: number) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { institution: "", degree: "", year: "" }],
    });
  };

  const removeEducation = (index: number) => {
    setProfile({
      ...profile,
      education: profile.education.filter((_, i) => i !== index),
    });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, type: "avatar" | "cv" | "companyLogo") => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/upload/${type}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (type === "companyLogo") setCompany(prev => ({ ...prev, logo: data.url }));
      else setProfile(prev => ({ ...prev, [type === "avatar" ? "avatar" : "cv"]: data.url }));
      alert("Uploaded successfully! 🚀");
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      await apiRequest("/profile/me", "PUT", {
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
        avatar: profile.avatar,
        cv: profile.cv
      }, token);

      if (isEmployer) {
        await apiRequest("/profile/company", "PUT", company, token);
      }
      alert("Profile updated! ✅");
    } catch (err) {
      alert("Save failed.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (!hasMounted || loading) return (
    <div className="flex justify-center items-center h-screen font-bold">Loading your profile...</div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 pb-24">
      <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Account Settings</h1>
      <p className="text-slate-500 mb-10 text-lg">Manage your identity and professional presence.</p>

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* SECTION: PERSONAL DETAILS */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3">
             <span className="w-2 h-6 bg-blue-600 rounded-full"></span> Personal Details
          </h2>
          
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="relative group mx-auto md:mx-0">
              <div className="w-36 h-36 rounded-full overflow-hidden bg-slate-100 border-8 border-slate-50 shadow-inner">
                <Image src={profile.avatar || "/default-avatar.png"} alt="Avatar" width={144} height={144} className="object-cover h-full w-full" />
              </div>
              <label className="absolute bottom-1 right-1 bg-blue-600 p-3 rounded-full cursor-pointer text-white shadow-xl hover:scale-110 transition-transform">
                <input type="file" hidden onChange={(e) => handleFileUpload(e, "avatar")} />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </label>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <input className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <input className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                <input className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Professional Bio</label>
                <textarea rows={4} className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {!isEmployer && (
          <>
            {/* SECTION: EXPERIENCE */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black flex items-center gap-3">
                  <span className="w-2 h-6 bg-emerald-500 rounded-full"></span> Work Experience
                </h2>
                <button type="button" onClick={addExperience} className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-emerald-100 transition-colors">
                  <span>+</span> Add Experience
                </button>
              </div>

              <div className="space-y-6">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="relative p-6 bg-slate-50 rounded-[32px] grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-100">
                    <button type="button" onClick={() => removeExperience(idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Company</label>
                      <input className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-emerald-500 font-bold text-sm" value={exp.company} onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[idx].company = e.target.value;
                        setProfile({...profile, experience: newExp});
                      }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Role</label>
                      <input className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-emerald-500 font-bold text-sm" value={exp.role} onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[idx].role = e.target.value;
                        setProfile({...profile, experience: newExp});
                      }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Duration</label>
                      <input className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-emerald-500 font-bold text-sm" placeholder="e.g. 2021 - Present" value={exp.duration} onChange={(e) => {
                        const newExp = [...profile.experience];
                        newExp[idx].duration = e.target.value;
                        setProfile({...profile, experience: newExp});
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION: EDUCATION */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black flex items-center gap-3">
                  <span className="w-2 h-6 bg-purple-500 rounded-full"></span> Education
                </h2>
                <button type="button" onClick={addEducation} className="bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-purple-100 transition-colors">
                  <span>+</span> Add Education
                </button>
              </div>

              <div className="space-y-6">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="relative p-6 bg-slate-50 rounded-[32px] grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-100">
                    <button type="button" onClick={() => removeEducation(idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Institution</label>
                      <input className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold text-sm" value={edu.institution} onChange={(e) => {
                        const newEdu = [...profile.education];
                        newEdu[idx].institution = e.target.value;
                        setProfile({...profile, education: newEdu});
                      }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Degree</label>
                      <input className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold text-sm" value={edu.degree} onChange={(e) => {
                        const newEdu = [...profile.education];
                        newEdu[idx].degree = e.target.value;
                        setProfile({...profile, education: newEdu});
                      }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Year</label>
                      <input className="w-full p-3 bg-white rounded-xl border border-slate-200 outline-none focus:border-purple-500 font-bold text-sm" value={edu.year} onChange={(e) => {
                        const newEdu = [...profile.education];
                        newEdu[idx].year = e.target.value;
                        setProfile({...profile, education: newEdu});
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION: SKILLS & CV */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h2 className="text-xl font-black mb-4">Skills</h2>
                <input placeholder="React, Python, Figma..." className="w-full p-5 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" value={profile.skills.join(", ")} onChange={(e) => setProfile({...profile, skills: e.target.value.split(",").map(s => s.trim())})} />
              </div>
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                <h2 className="text-xl font-black mb-4">Resume</h2>
                <div className="p-4 bg-slate-50 rounded-3xl border-2 border-dashed flex items-center justify-between">
                  <span className="font-bold text-sm">{profile.cv ? "✅ PDF Uploaded" : "No CV"}</span>
                  <label className="bg-white px-4 py-2 rounded-xl font-black text-xs border cursor-pointer hover:bg-slate-100">
                    {uploading ? "..." : "Upload"}
                    <input type="file" hidden accept=".pdf" onChange={(e) => handleFileUpload(e, "cv")} />
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* SECTION: COMPANY (Employer Only) */}
        {isEmployer && (
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl font-black flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span> Company Profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Company Name</label>
                <input className="w-full p-5 bg-slate-50 rounded-3xl font-bold" value={company.name} onChange={(e) => setCompany({...company, name: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Address</label>
                <input className="w-full p-5 bg-slate-50 rounded-3xl font-bold" value={company.address} onChange={(e) => setCompany({...company, address: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</label>
                <textarea className="w-full p-5 bg-slate-50 rounded-3xl font-bold" rows={4} value={company.description} onChange={(e) => setCompany({...company, description: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        <button type="submit" disabled={saveLoading || uploading} className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xl hover:bg-blue-600 transform active:scale-95 transition-all shadow-xl disabled:opacity-50">
          {saveLoading ? "Saving Changes..." : "Save Profile Details"}
        </button>
      </form>
    </div>
  );
}