import React, { useState } from 'react';
import { X, Upload, User, Mail, Lock, Briefcase, Phone, Calendar } from 'lucide-react';

const AddEmployeeModal = ({ isOpen, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        designation: '',
        job_title: '',
        department: '',
        phone: '',
        date_of_joining: '',
        role: 'Employee',
        employee_id: '',
        status: 'ACTIVE'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3000/api/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to add employee');

            onUserAdded(data.user);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Add New Employee
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            ["Full Name", "fullname", "text", <User />],
                            ["Email", "email", "email", <Mail />],
                            ["Password", "password", "password", <Lock />],
                            ["Designation", "designation", "text", <Briefcase />],
                            ["Department", "department", "text", null],
                            ["Employee ID", "employee_id", "text", null],
                            ["Phone", "phone", "tel", <Phone />],
                        ].map(([label, name, type, Icon]) => (
                            <div key={name} className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {label}
                                </label>
                                <div className="relative">
                                    {Icon && (
                                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    )}
                                    <input
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl
                                        bg-gray-50 dark:bg-gray-700
                                        border border-gray-200 dark:border-gray-600
                                        text-gray-900 dark:text-white
                                        focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        ))}

                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full mt-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
                        >
                            {loading ? 'Adding...' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
