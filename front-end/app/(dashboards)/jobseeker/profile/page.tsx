// "use client";
// import { useState, useEffect, ChangeEvent } from "react";
// import Image from "next/image";
// import { useAuth } from "@/app/context/AuthContext";
// import { apiRequest } from "@/app/lib/api";

// // Define the shape of our Profile for TypeScript safety
// interface ProfileState {
//   name: string;
//   phoneNumber: string;
//   avatar: string;
//   cv: string;
// }

// export default function JobSeekerProfilePage() {
//   const { token, hasMounted } = useAuth();
  
//   // State Management
//   const [loading, setLoading] = useState<boolean>(false);
//   const [fileUploading, setFileUploading] = useState<boolean>(false);
//   const [profile, setProfile] = useState<ProfileState>({
//     name: "",
//     phoneNumber: "",
//     avatar: "",
//     cv: "",
//   });

//   // 1. Fetch Profile Data on Mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!token) return;
//       try {
//         // Calls your NestJS @Get('me') endpoint
//         const data = await apiRequest("/profile/me", "GET", null, token);
//         setProfile({
//           name: data.name || "",
//           phoneNumber: data.phoneNumber || "",
//           avatar: data.avatar || "",
//           cv: data.cv || "",
//         });
//       } catch (err) {
//         console.error("Failed to load profile", err);
//       }
//     };
//     fetchProfile();
//   }, [token]);

//   // 2. Handle File Uploads (Avatar & CV)
//   const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cv') => {
//     const file = e.target.files?.[0];
//     if (!file || !token) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setFileUploading(true);
      
//       // Matches your NestJS @Post('upload/avatar') and @Post('upload/cv')
//       const endpoint = `/profile/upload/${type}`;
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Upload failed");

//       const data = await res.json();
      
//       // Update local state with the new Google Drive URL returned from NestJS
//       setProfile((prev) => ({ ...prev, [type]: data.url }));
//       alert(`${type.toUpperCase()} uploaded successfully! 🚀`);
//     } catch (err) {
//       console.error(err);
//       alert(`Failed to upload ${type}.`);
//     } finally {
//       setFileUploading(false);
//     }
//   };

//   // 3. Handle Saving Text Information
//   const handleSaveInfo = async () => {
//     try {
//       setLoading(true);
//       // Matches your NestJS @Put('me')
//       await apiRequest("/profile/me", "PUT", {
//         name: profile.name,
//         phoneNumber: profile.phoneNumber,
//       }, token);
      
//       alert("Information saved successfully! ✅");
//     } catch (err) {
//       alert("Save failed. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Prevent hydration mismatch
//   if (!hasMounted) return null;

//   return (
//     <div className="max-w-4xl mx-auto py-10 space-y-10 px-4">
//       {/* Page Header */}
//       <header className="space-y-2">
//         <h1 className="text-4xl font-black text-slate-800 tracking-tight">My Profile</h1>
//         <p className="text-slate-500 text-lg">
//           Update your personal details and resume to attract top employers.
//         </p>
//       </header>

//       <div className="bg-white p-6 md:p-12 rounded-[40px] border border-slate-100 shadow-sm space-y-12">
        
//         {/* Personal Details Section */}
//         <section className="space-y-8">
//           <h2 className="text-xl font-black flex items-center gap-3 text-slate-800">
//             <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
//             Personal Information
//           </h2>

//           <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
//             {/* Avatar Upload Container */}
//             <div className="relative group">
//               <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-slate-50 shadow-inner bg-slate-100 relative">
//                 <Image 
//                   src={profile.avatar || "/default-avatar.png"} 
//                   alt="User Avatar"
//                   fill
//                   style={{ objectFit: 'cover' }}
//                   priority
//                 />
//               </div>
//               <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-slate-900 shadow-lg transition-all z-10">
//                 <input 
//                   type="file" 
//                   className="hidden" 
//                   onChange={(e) => handleFileUpload(e, 'avatar')} 
//                   accept="image/*" 
//                 />
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                 </svg>
//               </label>
//             </div>

//             {/* Input Fields */}
//             <div className="flex-1 grid grid-cols-1 gap-6 w-full">
//               <div className="space-y-2">
//                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
//                 <input 
//                   type="text"
//                   value={profile.name}
//                   onChange={(e) => setProfile({...profile, name: e.target.value})}
//                   className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 outline-none"
//                   placeholder="e.g. Abebe Bikila"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
//                 <input 
//                   type="text"
//                   value={profile.phoneNumber}
//                   onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
//                   className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-700 outline-none"
//                   placeholder="e.g. +251 911..."
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         <hr className="border-slate-100" />

//         {/* Resume/CV Section */}
//         <section className="space-y-6">
//           <h2 className="text-xl font-black flex items-center gap-3 text-slate-800">
//             <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
//             Professional Resume
//           </h2>
          
//           <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl">
//                 {profile.cv ? "📄" : "📁"}
//               </div>
//               <div>
//                 <p className="font-black text-slate-800 tracking-tight">
//                   {profile.cv ? "Resume is Uploaded" : "No Resume Found"}
//                 </p>
//                 {profile.cv && (
//                   <a 
//                     href={profile.cv} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-sm text-blue-600 font-bold hover:underline"
//                   >
//                     View Current CV
//                   </a>
//                 )}
//               </div>
//             </div>

//             <label className="bg-white px-8 py-4 rounded-2xl font-black text-sm border-2 border-slate-100 hover:border-blue-600 cursor-pointer transition-all shadow-sm">
//               {fileUploading ? "Uploading..." : profile.cv ? "Replace CV" : "Upload CV"}
//               <input 
//                 type="file" 
//                 className="hidden" 
//                 onChange={(e) => handleFileUpload(e, 'cv')} 
//                 accept=".pdf,.doc,.docx" 
//               />
//             </label>
//           </div>
//         </section>

//         {/* Save Button */}
//         <button
//           onClick={handleSaveInfo}
//           disabled={loading || fileUploading}
//           className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-xl hover:bg-blue-600 transform active:scale-[0.98] transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
//         >
//           {loading ? "Saving Changes..." : "Save Profile Details"}
//         </button>
//       </div>
//     </div>
//   );
// }