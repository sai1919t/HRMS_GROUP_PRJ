
import React, { useEffect, useRef, useState } from 'react';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = ({ onCancel, onSave }) => {
    const navigate = useNavigate();
    const [storedUser, setStoredUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [designation, setDesignation] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fullname = storedUser?.fullname || '';
        const parts = fullname.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
        setEmail(storedUser?.email || '');
        setDesignation(storedUser?.designation || '');
    }, [storedUser]);

    // ensure inputs are focusable and visible (helps when overlays or layout affect focus)
    const firstNameRef = useRef(null);
    useEffect(() => {
        if (firstNameRef.current) {
            firstNameRef.current.focus();
        }
        const onStorage = (e) => {
            if (e.key === 'user') {
                try { setStoredUser(JSON.parse(e.newValue)); } catch { setStoredUser(null); }
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccess("");
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to update your profile.');
            setSaving(false);
            return;
        }
        const id = storedUser?.id;
        const fullname = `${firstName} ${lastName}`.trim();

        try {
            const res = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ fullname, email, designation })
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Update failed');
                return;
            }

            // update localStorage and navigate back to profile
            const newUser = { ...storedUser, ...data.user };
            localStorage.setItem('user', JSON.stringify(newUser));
            if (onSave) onSave(newUser);
            setSuccess('Profile updated successfully');
            // reflect change immediately
            setTimeout(() => window.location.href = '/profile', 600);
        } catch (err) {
            console.error('Update error:', err);
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto relative z-10">
            <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-900 inline-block mb-12 pb-1">Edit Profile</h1>

            <div className="flex flex-col items-center mb-12">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                        <img src={storedUser?.avatar || 'https://i.pravatar.cc/150?img=5'} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-4">{firstName} {lastName}</h2>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Details</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">First Name</label>
                        <input ref={firstNameRef} value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#266ECD] focus:border-transparent" />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                        <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#266ECD] focus:border-transparent" />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#266ECD] focus:border-transparent" />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Designation</label>
                        <select value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#266ECD] focus:border-transparent">
                            <option value="">Select designation</option>
                            <option value="HR">HR</option>
                            <option value="Developer">Developer</option>
                            <option value="Manager">Manager</option>
                            <option value="Designer">Designer</option>
                            <option value="Intern">Intern</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
                </div>
                <div className="flex justify-center gap-4 mt-6 pt-4">
                    <button onClick={onCancel} className="px-8 py-2.5 rounded-full bg-gray-400 text-white font-bold hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="px-8 py-2.5 rounded-full bg-[#0066FF] text-white font-bold hover:bg-blue-600 transition">{saving ? 'Saving...' : 'Save'}</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;