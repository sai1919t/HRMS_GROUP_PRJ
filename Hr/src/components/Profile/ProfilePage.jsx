import React, { useEffect, useState } from "react";
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
  UserPlus,
} from "lucide-react";

const ProfilePage = ({ onEditProfile }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        try {
          setUser(JSON.parse(e.newValue));
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const userData = user || {
    fullname: "Maria Aryan",
    email: "hrmariaaryan@example.com",
    designation: "HR",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Passionate HR specialist focused on people and culture.",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 sm:p-10">

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-8 mb-10 border border-white/40">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          My Profile
        </h1>
        <p className="text-gray-600 mt-1">Manage your personal information & settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* LEFT SECTION */}
        <div className="flex-1 space-y-10">

          {/* PROFILE CARD */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg ring-4 ring-blue-200">
                <img
                  src={userData.avatar}
                  alt={userData.fullname}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-semibold text-gray-900">
                    {userData.fullname}
                  </h2>
                  <span className="text-xs uppercase bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow-sm">
                    {userData.designation}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
                <p className="text-sm text-gray-500 mt-2 max-w-md">{userData.bio}</p>

                <div className="mt-5 flex gap-4">
                  <button
                    onClick={onEditProfile}
                    className="bg-[#266ECD] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition"
                  >
                    Edit Profile
                  </button>

                  <button
                    className="border border-gray-300 px-5 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 active:scale-95 transition"
                    onClick={() => navigator.clipboard?.writeText(user.email)}
                  >
                    Copy email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE MENU SECTIONS */}
          <SectionCard>
            <MenuItem icon={<Heart />} label="Latest feed" />
            <MenuItem icon={<Download />} label="Latest uploads" />
          </SectionCard>

          <SectionCard>
            <MenuItem icon={<Globe />} label="Languages" />
            <MenuItem icon={<MapPin />} label="Location" />
            <MenuItem icon={<FileText />} label="Files and documents" />
            <MenuItem icon={<Monitor />} label="Display" />
          </SectionCard>

          <SectionCard>
            <MenuItem icon={<Trash2 />} label="Recently deleted" />
            <MenuItem icon={<Clock />} label="Clear History" />
            <MenuItem icon={<LogOut className="rotate-180" />} label="Exit" />
          </SectionCard>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <div className="space-y-6">
              <SidebarItem icon={<Heart />} label="Appreciations" />
              <SidebarItem icon={<UserPlus />} label="My Referrals" />
              <SidebarItem icon={<Settings />} label="Settings" />

              <div className="pt-4">
                <button
                  className="w-full bg-red-50 text-red-600 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-100 active:scale-95 transition"
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
    </div>
  );
};

/* COMPONENTS */

const SectionCard = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
    <div className="space-y-5">{children}</div>
  </div>
);

const MenuItem = ({ icon, label }) => (
  <button className="flex items-center gap-4 w-full text-left group p-3 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition">
    <span className="text-gray-700 group-hover:text-[#266ECD] transition">{icon}</span>
    <span className="text-lg font-medium text-gray-900 group-hover:text-[#266ECD] transition">
      {label}
    </span>
  </button>
);

const SidebarItem = ({ icon, label }) => (
  <button className="flex items-center gap-3 w-full text-left text-gray-600 hover:text-[#266ECD] hover:bg-gray-100 p-3 rounded-xl active:scale-[0.98] transition">
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default ProfilePage;