import { useState, useEffect } from 'react';
import * as employeeOfMonthService from '../../services/employeeOfMonthService';

const FeedPage3 = ({ onNavigateBack }) => {
    const [employeeData, setEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        userId: '',
        description: '',
        month: '',
        teamMembers: [{ userId: '', role: '' }]
    });

    useEffect(() => {
        fetchEmployeeOfMonth();
    }, []);

    const fetchEmployeeOfMonth = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await employeeOfMonthService.getCurrentEmployeeOfMonth();
            if (response.success) {
                setEmployeeData(response.data);
            }
        } catch (error) {
            console.error('Error fetching employee of the month:', error);
            setError('Failed to load employee of the month');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setError(null);
            console.log('Fetching users...');
            const response = await employeeOfMonthService.getAllUsers();
            console.log('Users response:', response);
            if (response.success) {
                // Backend returns { success: true, users: [...] }
                setUsers(response.users || []);
                console.log('Users loaded:', response.users);
            } else {
                console.warn('Failed to fetch users:', response);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
            setUsers([]);
        }
    };

    const handleOpenModal = async () => {
        console.log('Opening modal...');
        setShowModal(true);
        // Fetch users after opening modal to prevent blocking
        await fetchUsers();
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            userId: '',
            description: '',
            month: '',
            teamMembers: [{ userId: '', role: '' }]
        });
    };

    const handleAddTeamMember = () => {
        setFormData({
            ...formData,
            teamMembers: [...formData.teamMembers, { userId: '', role: '' }]
        });
    };

    const handleRemoveTeamMember = (index) => {
        const newTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            teamMembers: newTeamMembers
        });
    };

    const handleTeamMemberChange = (index, field, value) => {
        const newTeamMembers = [...formData.teamMembers];
        newTeamMembers[index][field] = value;
        setFormData({
            ...formData,
            teamMembers: newTeamMembers
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const teamMembers = formData.teamMembers.filter(
                member => member.userId && member.role
            );

            await employeeOfMonthService.createEmployeeOfMonth(
                parseInt(formData.userId),
                formData.description,
                formData.month,
                teamMembers.map(member => ({
                    userId: parseInt(member.userId),
                    role: member.role
                }))
            );

            handleCloseModal();
            fetchEmployeeOfMonth();
        } catch (error) {
            console.error('Error creating employee of the month:', error);
            alert('Failed to create employee of the month');
        }
    };

    const handleDeleteTeamMember = async (teamMemberId) => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            try {
                await employeeOfMonthService.deleteTeamMember(teamMemberId);
                fetchEmployeeOfMonth();
            } catch (error) {
                console.error('Error deleting team member:', error);
                alert('Failed to delete team member');
            }
        }
    };

    const handleDeleteEmployeeOfMonth = async () => {
        if (window.confirm('Are you sure you want to delete the Employee of the Month? This will remove the entire entry and team.')) {
            try {
                await employeeOfMonthService.deleteEmployeeOfMonth(employeeData.id);
                setEmployeeData(null);
            } catch (error) {
                console.error('Error deleting employee of the month:', error);
                alert('Failed to delete employee of the month');
            }
        }
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onNavigateBack}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-[#266ECD]">Feed</h1>
                            <p className="text-sm text-gray-500 mt-1">Stay Connected and Informed</p>
                        </div>
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="bg-[#266ECD] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
                    >
                        Add New
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
                                <p className="text-gray-500">Loading...</p>
                            </div>
                        ) : employeeData ? (
                            <>
                                {/* Employee of the Month Card */}
                                <div className="bg-white rounded-3xl shadow-md p-8">
                                    {/* Header */}
                                    <div className="text-center mb-8 relative">
                                        <h2 className="text-sm font-bold text-gray-700 tracking-widest uppercase">
                                            Employee of the Month
                                        </h2>
                                        <button
                                            onClick={handleDeleteEmployeeOfMonth}
                                            className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                            title="Delete Employee of the Month"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Featured Employee */}
                                    <div className="text-center mb-8">
                                        <div className="inline-block mb-6">
                                            <div className="w-40 h-40 rounded-3xl overflow-hidden bg-white border border-gray-200 p-1">
                                                <div className="w-full h-full rounded-3xl overflow-hidden">
                                                    <img
                                                        src={`https://i.pravatar.cc/200?u=${employeeData.user_email}`}
                                                        alt={employeeData.user_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{employeeData.user_name}</h3>
                                        <p className="text-sm text-gray-500">{employeeData.month}</p>
                                    </div>

                                    {/* Description */}
                                    <div className="max-w-2xl mx-auto mb-8">
                                        <p className="text-gray-700 text-center leading-relaxed">
                                            {employeeData.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Team Section */}
                                {employeeData.team && employeeData.team.length > 0 && (
                                    <div className="bg-white rounded-3xl shadow-md p-8">
                                        <h3 className="text-lg font-bold text-gray-800 mb-6">Team</h3>

                                        <div className="grid grid-cols-3 gap-6">
                                            {employeeData.team.map((member) => (
                                                <div key={member.id} className="text-center relative group">
                                                    <button
                                                        onClick={() => handleDeleteTeamMember(member.id)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Remove team member"
                                                    >
                                                        ×
                                                    </button>
                                                    <div className="mb-4">
                                                        <div className="w-28 h-28 mx-auto rounded-3xl overflow-hidden bg-white border border-gray-200 p-1">
                                                            <div className="w-full h-full rounded-3xl overflow-hidden">
                                                                <img
                                                                    src={`https://i.pravatar.cc/150?u=${member.user_email}`}
                                                                    alt={member.user_name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 text-sm mb-1">{member.user_name}</h4>
                                                    <p className="text-gray-500 text-xs">{member.role}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-3xl shadow-md p-8 text-center">
                                <p className="text-gray-500 mb-4">No employee of the month selected yet</p>
                                <button
                                    onClick={handleOpenModal}
                                    className="bg-[#266ECD] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
                                >
                                    Add Employee of the Month
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Same as before */}
                    <div className="space-y-6">
                        {/* New Point Alert */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-[#266ECD] mb-4">New Point Alert!</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-5xl font-bold text-[#266ECD]">250</div>
                                <div className="w-10 h-10 rounded-full bg-[#266ECD] flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">Reward points with Manager</p>
                            <button className="w-full bg-[#266ECD] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
                                Attempt
                            </button>
                        </div>

                        {/* Don't Miss Out! Training Session */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-[#266ECD] mb-4">Don't Miss Out! Upcoming Training Session</h3>
                            <div className="space-y-2 mb-5">
                                <p className="text-sm text-gray-700">
                                    <span className="font-bold">Date:</span> 29 Oct
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-bold">Time:</span> 9:00 AM - 12:00 PM
                                </p>
                            </div>
                            <button className="w-full bg-[#266ECD] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
                                Register
                            </button>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Upcoming Events
                                </h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Team Building Workshop</p>
                                        <p className="text-xs text-gray-500">10:00 AM - 1:00 PM</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">13 Oct</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Employee of the Month Award</p>
                                        <p className="text-xs text-gray-500">4:00 PM - 4:30 PM</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">20 Oct</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Diversity and Inclusion Seminar</p>
                                        <p className="text-xs text-gray-500">9:30 AM - 12:30 PM</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">5 Nov</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Town Hall Meeting</p>
                                        <p className="text-xs text-gray-500">2:00 PM - 3:30 PM</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">10 Nov</span>
                                </div>
                                <button className="text-[#266ECD] text-sm font-semibold hover:underline">More...</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Add Employee of the Month</h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Employee Selection */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Employee Information</h3>

                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Select Employee *
                                        </label>
                                        <select
                                            value={formData.userId}
                                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#266ECD]"
                                            required
                                        >
                                            <option value="">Choose an employee</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.fullname} ({user.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Month *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.month}
                                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                            placeholder="e.g., December 2025"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#266ECD]"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Write a description about why this employee deserves the recognition..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#266ECD] min-h-[120px]"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-800">Team Members</h3>
                                        <button
                                            type="button"
                                            onClick={handleAddTeamMember}
                                            className="text-[#266ECD] font-semibold hover:underline"
                                        >
                                            + Add Team Member
                                        </button>
                                    </div>

                                    {formData.teamMembers.map((member, index) => (
                                        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-xl">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-semibold text-gray-700">Team Member {index + 1}</span>
                                                {formData.teamMembers.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTeamMember(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        Employee
                                                    </label>
                                                    <select
                                                        value={member.userId}
                                                        onChange={(e) => handleTeamMemberChange(index, 'userId', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#266ECD] text-sm"
                                                    >
                                                        <option value="">Select employee</option>
                                                        {users.map((user) => (
                                                            <option key={user.id} value={user.id}>
                                                                {user.fullname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        Role
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={member.role}
                                                        onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                                                        placeholder="e.g., Project Manager"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#266ECD] text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-[#266ECD] text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedPage3;