import React from 'react';
import {
    Heart,
    Download,
    Globe,
    MapPin,
    FileText,
    Monitor,
    Trash2,
    Clock,
    LogOut,
    Settings,
    UserPlus
} from 'lucide-react';

const ProfilePage = ({ onEditProfile }) => {
    // read user from localStorage (set by signup/login). fallback to sample
    let storedUser = null;
    try {
        storedUser = JSON.parse(localStorage.getItem("user") || "null");
    } catch (e) {
        storedUser = null;
    }
    const user = storedUser || {
        fullname: "Maria Aryan",
        email: "hrmariaaryan@example.com",
        designation: "HR",
        avatar: "https://i.pravatar.cc/150?img=5",
        bio: "Passionate HR specialist focused on people and culture.",
    };
    return (
        <div className="p-6 sm:p-10 flex flex-col lg:flex-row gap-8 bg-gray-50 rounded-lg">
             {/* Left Section */}
             <div className="flex-1">
               <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-900 inline-block mb-8 pb-1">
                   My Profile
               </h1>

               <div className="flex items-center gap-6 mb-8">
                      <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200">
                          <img src={user.avatar} alt={user.fullname} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                          <div className="flex items-center gap-3">
                              <h2 className="text-2xl font-semibold text-gray-900">{user.fullname}</h2>
                              <span className="text-xs uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{user.designation}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                          <p className="text-sm text-gray-500 mt-2 max-w-md">{user.bio}</p>
                          <div className="mt-4">
                              <button onClick={onEditProfile} className="bg-[#266ECD] text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-opacity-90 transition mr-3">Edit Profile</button>
                              <button className="border border-gray-300 px-3 py-1.5 rounded-md text-sm text-gray-700" onClick={() => { navigator.clipboard?.writeText(user.email); }}>Copy email</button>
                          </div>
                      </div>
                  </div>
 

                  <div className="space-y-6 max-w-2xl">
                     <div className="space-y-6">
                         <button className="flex items-center gap-6 w-full text-left group">
                             <Heart className="w-6 h-6 text-gray-900" />
                             <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Latest feed</span>
                         </button>
                         <button className="flex items-center gap-6 w-full text-left group">
                             <Download className="w-6 h-6 text-gray-900" />
                             <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Latest uploads</span>
                         </button>
                     </div>
 
                     <div className="border-t border-gray-300 pt-8 space-y-6">
                         <button className="flex items-center gap-6 w-full text-left group">
                             <Globe className="w-6 h-6 text-gray-900" />
                             <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Languages</span>
                         </button>
                         <button className="flex items-center gap-6 w-full text-left group">
                             <MapPin className="w-6 h-6 text-gray-900" />
                             <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Location</span>
                         </button>
                         <button className="flex items-center gap-6 w-full text-left group">
                             <FileText className="w-6 h-6 text-gray-900" />
                             <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Files and documents</span>
                         </button>
                         <button className="flex items-center gap-6 w-full text-left group">
                             <Monitor className="w-6 h-6 text-gray-900" />
                             <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Display</span>
                         </button>
                     </div>
 
                     <div className="border-t border-gray-300 pt-8 space-y-6">
                         <button className="flex items-center gap-6 w-full text-left group">
                             <Trash2 className="w-6 h-6 text-gray-900" />
                             <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Recently deleted</span>
                         </button>
                         <button className="flex items-center gap-6 w-full text-left group">
                             <Clock className="w-6 h-6 text-gray-900" />
                             <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Clear History</span>
                         </button>
                         <button className="flex items-center gap-6 w-full text-left group">
                             <LogOut className="w-6 h-6 text-gray-900 rotate-180" />
                             <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">Exit</span>
                         </button>
                     </div>
                 </div>
             </div>
 
             {/* Right Section */}
             <div className="w-full lg:w-80">
                 <div className="bg-white rounded-2xl shadow-md p-6">
                     <div className="space-y-6">
                         <button className="flex items-center gap-3 w-full text-left text-gray-500 hover:text-[#266ECD] transition">
                             <Heart className="w-5 h-5" />
                             <span className="text-sm font-medium">Appreciations</span>
                         </button>
                         <button className="flex items-center gap-3 w-full text-left text-gray-500 hover:text-[#266ECD] transition">
                             <UserPlus className="w-5 h-5" />
                             <span className="text-sm font-medium">My Referrals</span>
                         </button>
                         <button className="flex items-center gap-3 w-full text-left text-gray-500 hover:text-[#266ECD] transition">
                             <Settings className="w-5 h-5" />
                             <span className="text-sm font-medium">Settings</span>
                         </button>
 
                         <div className="pt-4">
                             <button
                                 className="w-full bg-red-50 text-red-500 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"

                                  onClick={async () => {
                                      const { logout } = await import("../../services/auth.service.js");
                                      await logout();
                                      localStorage.removeItem("token");
                                      localStorage.removeItem("user");
                                      window.location.href = "/login";
                                  }}
                             >
                                 <LogOut className="w-5 h-5" />
                                 Logout
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
     );
 };

export default ProfilePage;