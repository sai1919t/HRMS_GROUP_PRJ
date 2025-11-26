import { useState } from 'react'
import Ecard from '../components/Employee/Ecard';
function EmployeesPage() {
  // State to control mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#f0f2f5] min-h-screen relative">

      {/* Main Content Area */}
      {/* On Mobile: ml-0 (full width) | On Desktop (lg): ml-64 (make room for sidebar) */}
      <div className="w-full transition-all duration-300">
         
         {/* Mobile Header Bar (Hidden on Desktop) */}
         <div className="lg:hidden bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-30">
            <h1 className="text-xl font-bold text-gray-800">HRMS</h1>
            {/* Hamburger Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 text-gray-600 focus:outline-none"
            >
                <i className="fas fa-bars text-2xl"></i>
            </button>
         </div>

         {/* Content Padding */}
         <div className="p-4 sm:p-8">
            {/* Breadcrumbs & Title */}
            <div className="mb-6 sm:mb-8">
                <p className="text-gray-500 text-sm mb-1">Employee Management / <span className="text-gray-800 font-semibold">Employees</span></p>
                <h1 className="text-2xl font-bold text-gray-800">Employees Details</h1>
            </div>

            <Ecard/>
         </div>
      </div>
    </div>
  )
}

export default EmployeesPage;