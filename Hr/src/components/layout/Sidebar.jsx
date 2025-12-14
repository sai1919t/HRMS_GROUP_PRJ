import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

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
        <img
          src="https://i.pravatar.cc/150?img=47"
          className="w-14 h-14 rounded-full"
        />
        <div>
          <p className="font-semibold">Mariya</p>
          <p className="text-sm opacity-70">HR Manager</p>
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
                className={`block px-4 py-2 rounded-lg font-medium ${
                  isActive
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
