import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Edit2, MoreVertical, Mail, Phone, Filter, Download } from 'lucide-react';
import AddEmployeeModal from '../components/Employee/AddEmployeeModal';
import { useNavigate } from 'react-router-dom';

function EmployeesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get Current User Logic
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAdded = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const filteredUsers = users.filter(u =>
    u.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <div className="flex bg-[#f9fafb] min-h-screen relative font-inter">
      <div className="w-full transition-all duration-300">

        {/* Mobile Header */}
        <div className="lg:hidden bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-30 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">HRMS</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>

        <div className="p-6 sm:p-10 max-w-[1600px] mx-auto">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <span className="text-sm font-medium text-gray-500">Employee Management</span>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="mx-2 text-gray-400">/</span>
                      <span className="text-sm font-medium text-gray-900">Employees</span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Employees Directory</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and view all employee profiles</p>
            </div>

            <div className="flex gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  Add Employee
                </button>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">

            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Filters (Visual Only for now) */}
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
                <Filter size={16} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Role & Dept</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading directory...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No employees found.</td></tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={user.profile_picture ? (user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:3000${user.profile_picture}`) : "/pexels-olly-927022.jpg"}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <div className="font-bold text-gray-900">{user.fullname}</div>
                              <div className="text-xs text-gray-500">{user.employee_id || `#EMP-${user.id}`}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-800">{user.designation || "N/A"}</div>
                          <div className="text-xs text-gray-500">{user.department || "General"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Mail size={12} className="text-gray-400" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Phone size={12} className="text-gray-400" />
                              {user.phone || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${user.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border border-green-100' :
                              user.status === 'INACTIVE' ? 'bg-red-50 text-red-700 border border-red-100' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'ACTIVE' ? 'bg-green-500' :
                                user.status === 'INACTIVE' ? 'bg-red-500' : 'bg-gray-400'
                              }`}></span>
                            {user.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.date_of_joining ? new Date(user.date_of_joining).toLocaleDateString() : (user.created_at ? new Date(user.created_at).toLocaleDateString() : '-')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => navigate(`/profile/${user.id}`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Profile">
                              <MoreVertical size={16} />
                            </button>
                            {/* Admin Actions */}
                            {isAdmin && (
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (Static for now) */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <span className="text-sm text-gray-500">Showing {filteredUsers.length} employees</span>
              <div className="flex gap-2">
                <button disabled className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-400 cursor-not-allowed">Previous</button>
                <button disabled className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-400 cursor-not-allowed">Next</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  )
}

export default EmployeesPage;