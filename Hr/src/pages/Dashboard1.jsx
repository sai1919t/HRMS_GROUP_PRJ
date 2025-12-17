import { useState } from "react";
import EmployeesStatistics from "../components/Dashboard1/EmployeesStatistics.jsx";
import StatsCards from "../components/Dashboard1/StatsCard.jsx";
import EmpComposition from "../components/Dashboard1/Emp_Composition.jsx";
import MeetingsUI from "../components/Dashboard1/MeetingsUI.jsx";

function Dashboard1() {
  const [count, setCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-48' : 'ml-0'} min-h-screen`}>
        {currentPage === "Dashboard" && (
          <div className="p-6 sm:p-10 max-w-[1600px] mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
              <p className="text-gray-500 mt-1 text-sm">Welcome back, here's what's happening today.</p>
            </div>

            <StatsCards />

            <div className="mt-8">
              <EmployeesStatistics />
            </div>

            <div className="mt-12 grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="w-full h-full">
                <MeetingsUI />
              </div>
              <div className="w-full h-full">
                <EmpComposition />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


export default Dashboard1;