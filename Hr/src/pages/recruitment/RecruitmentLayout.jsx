import { NavLink, Routes, Route } from "react-router-dom";
import Jobs from "./Jobs";
import Applications from "./Applications";
import Interviews from "./Interviews";
import Offers from "./Offers";

export default function RecruitmentLayout() {
  const getLinkClass = ({ isActive }) =>
    `pb-3 px-1 font-semibold text-sm uppercase tracking-wide border-b-2 transition-all duration-300
     ${isActive
        ? "border-[#020839] text-[#020839]"
        : "border-transparent text-gray-400 hover:text-[#020839] hover:border-gray-300"
     }`;

  return (
    <div className="h-full">
      
      {/* STICKY HEADER */}
      <div className="sticky top-0 bg-white z-20 border-b shadow-sm">
        <div className="px-8 pt-6">
          <h1 className="text-2xl font-bold text-[#020839] mb-4">
            Recruitment
          </h1>

          <div className="flex gap-8">
            <NavLink to="" end className={getLinkClass}>Jobs</NavLink>
            <NavLink to="applications" className={getLinkClass}>Applications</NavLink>
            <NavLink to="interviews" className={getLinkClass}>Interviews</NavLink>
            <NavLink to="offers" className={getLinkClass}>Offers</NavLink>
          </div>
        </div>
      </div>

      {/* INNER CONTENT ONLY CHANGES */}
      <div className="px-8 py-6 animate-fadeIn">
        <Routes>
          <Route index element={<Jobs />} />
          <Route path="applications" element={<Applications />} />
          <Route path="interviews" element={<Interviews />} />
          <Route path="offers" element={<Offers />} />
        </Routes>
      </div>
    </div>
  );
}
