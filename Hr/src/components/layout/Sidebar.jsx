import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "null");
        setUser(u);
      } catch (e) {
        setUser(null);
      }
    };
    loadUser();

    window.addEventListener("user-updated", loadUser);
    return () => window.removeEventListener("user-updated", loadUser);
  }, []);

  const fullname = user?.fullname || "Mariya";
  const designation = user?.designation || "HR Manager";
  const email = user?.email || "";
  const avatarSrc = user?.profile_picture;

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Chat", path: "/chat" },
    { name: "Employees", path: "/employees" },
    { name: "Feed", path: "/feed" },
    { name: "Recognition", path: "/recognition" },
    { name: "Event", path: "/event" },
    { name: "Recruitment", path: "/recruitment" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },

  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#020839] text-white p-6">

      {/* LOGO */}
      <h1 className="text-3xl font-bold mb-8 tracking-wide">HRMS</h1>

      {/* PROFILE */}
      <div className="flex items-center gap-3 mb-10">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            className="w-14 h-14 rounded-full object-cover border-2 border-white/20"
            alt={fullname}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/80 border-2 border-white/20">
            <User size={24} />
          </div>
        )}

        <div className="min-w-0">
          <p className="font-semibold truncate max-w-[140px]">{fullname}</p>
          <p className="text-sm opacity-70 capitalize truncate max-w-[140px]">{designation}</p>
        </div>
      </div>

      {/* MENU */}
      <ul className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded-lg font-medium ${isActive
                  ? "bg-white text-[#020839]"
                  : "text-white hover:bg-[#1e276d]"
                  }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
