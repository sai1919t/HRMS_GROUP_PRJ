import { useState, useEffect } from 'react';
import {
    createAppreciation,
    addComment,
    getAllUsers,
    getAllAppreciations,
    getComments,
    toggleLike,
    deleteAppreciation
} from '../../services/appreciationService';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FeedPage1 = ({ onNavigateBack }) => {
    // State for the "Give Points" interaction
    const [showGivePointsModal, setShowGivePointsModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [appreciations, setAppreciations] = useState([]);
    const [givePointsData, setGivePointsData] = useState({
        recipient_id: '',
        recipient_email: '',
        title: 'Appreciation',
        category: 'Hard Work',
        message: '',
        points: 0,
        emoji: '👏'
    });

    // Helper to refresh feed
    const fetchFeed = async () => {
        try {
            const response = await getAllAppreciations();
            if (response && response.data) {
                setAppreciations(response.data);
            } else if (Array.isArray(response)) {
                setAppreciations(response);
            }
        } catch (error) {
            console.error("Failed to fetch appreciations", error);
        }
    };

    // Fetch initial data
    const [userPoints, setUserPoints] = useState(0);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                if (response && response.users) {
                    setUsers(response.users);
                } else if (Array.isArray(response)) {
                    setUsers(response);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };

        const fetchUserPoints = async () => {
            try {
                const u = JSON.parse(localStorage.getItem('user') || '{}');
                if (!u || !u.id) return;
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/users/${u.id}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
                if (!res.ok) return;
                const data = await res.json();
                setUserPoints(data.user?.points || 0);
                // update local user copy
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setIsAdmin(data.user.role === 'Admin');
                }
            } catch (err) {
                console.error('Failed to fetch user points', err);
            }
        };

        fetchUsers();
        fetchFeed();
        fetchUserPoints();

        // listen for activity updates to refresh points
        const onActivity = () => fetchUserPoints();
        window.addEventListener('activity:updated', onActivity);
        return () => window.removeEventListener('activity:updated', onActivity);
    }, []);

    const handleGivePoints = () => {
        setShowGivePointsModal(true);
    };

    const handleLike = async (id) => {
        try {
            await toggleLike(id);
            fetchFeed(); // Refresh to show updated like count and state
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this appreciation?")) return;
        try {
            await deleteAppreciation(id);
            fetchFeed(); // Refresh to remove deleted item
        } catch (error) {
            console.error("Failed to delete appreciation", error);
            alert("Failed to delete. You might not have permission.");
        }
    };

    const submitPoints = async () => {
        try {
            if (!givePointsData.recipient_id || !givePointsData.message || (givePointsData.points <= 0 && givePointsData.category !== 'Appreciation')) {
                // Relaxed validation: points can be 0 if it's just an appreciation, but frontend "Give Points" implies points.
                // If the user wants just "Appreciation", we might need a separate mode. For now, enforcing points.
                if (!givePointsData.points) {
                    alert("Please enter points amount.");
                    return;
                }
            }

            // Check balance (admins can send unlimited points)
            if (parseInt(givePointsData.points, 10) <= 0) {
                alert('Please enter a positive points amount');
                return;
            }
            if (!isAdmin && parseInt(givePointsData.points, 10) > userPoints) {
                alert('Insufficient points to send');
                return;
            }

            // Call backend API
            const resp = await createAppreciation({
                recipient_id: parseInt(givePointsData.recipient_id),
                title: givePointsData.title,
                category: givePointsData.category,
                message: givePointsData.message,
                points: parseInt(givePointsData.points),
                emoji: givePointsData.emoji
            });

            // If transfer info present, update user points
            if (resp && resp.transfer && resp.transfer.sender) {
                const newPoints = resp.transfer.sender.points || 0;
                setUserPoints(newPoints);
                const localUser = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...localUser, points: newPoints }));
            }

            alert(`Successfully sent ${givePointsData.points} points!`);
            setShowGivePointsModal(false);
            setGivePointsData({
                recipient_id: '',
                recipient_email: '',
                title: 'Appreciation',
                category: 'Hard Work',
                message: '',
                points: 0,
                emoji: '👏'
            });
            // Refresh feed to show new card
            fetchFeed();
            // Notify other pages to refresh points and leaderboard
            try { window.dispatchEvent(new CustomEvent('activity:updated')); } catch (e) {}
            // Notify other pages
            try { window.dispatchEvent(new CustomEvent('activity:updated')); } catch (e) {}
        } catch (error) {
            console.error(error);
            alert('Failed to send points: ' + (error.message || JSON.stringify(error)));
        }
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <button
                            onClick={onNavigateBack}
                            className="text-gray-600 hover:text-gray-800 mb-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-[#266ECD]">Give Points & Appreciate</h1>
                        <p className="text-gray-600">Recognize your colleagues' hard work.</p>
                    </div>
                    <button
                        onClick={handleGivePoints}
                        className="bg-[#266ECD] text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Give Points
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Feed Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Give Points Banner */}
                        <div className="flex flex-col items-center justify-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Send Appreciation</h2>
                            <p className="text-gray-500 mb-4 text-center max-w-md text-sm">
                                Share points and a message to recognize someone's contribution.
                            </p>
                            <button
                                onClick={handleGivePoints}
                                className="bg-[#266ECD] text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Give Points
                            </button>
                        </div>

                        {/* Dynamic Feed */}
                        <div className="space-y-6">
                            {appreciations.filter(a => a.points > 0).length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-500">No points awarded yet. Be the first to give points!</p>
                                </div>
                            ) : (
                                appreciations
                                    .filter(appreciation => appreciation.points > 0)
                                    .map((appreciation) => (
                                        <PointsCard
                                            key={appreciation.id}
                                            appreciation={appreciation}
                                            onLike={() => handleLike(appreciation.id)}
                                            onDelete={() => handleDelete(appreciation.id)}
                                        />
                                    ))
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar (Restored) */}
                    <div className="space-y-6">
                        {/* New Point Alert */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-bold text-[#266ECD] mb-4">Your Points</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-5xl font-bold text-[#266ECD]">{userPoints?.toLocaleString() || 0}</div>
                                <div className="w-10 h-10 rounded-full bg-[#266ECD] flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">Reward points balance</p>
                            <button className="w-full bg-[#266ECD] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
                                <Link to="/redemption">View Redemption Center</Link>
                            </button>
                        </div>

                        {/* Upcoming Training Session */}
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
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 002-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Upcoming Events
                                </h3>
                            </div>
                            <div className="space-y-4">
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

            {/* Give Points Modal */}
            {showGivePointsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowGivePointsModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Give Points</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#266ECD] outline-none"
                                    value={givePointsData.recipient_id}
                                    onChange={e => setGivePointsData({ ...givePointsData, recipient_id: e.target.value })}
                                >
                                    <option value="">Select a colleague...</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.fullname} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#266ECD] outline-none"
                                    placeholder="e.g., 100"
                                    value={givePointsData.points}
                                    onChange={e => setGivePointsData({ ...givePointsData, points: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#266ECD] outline-none h-24 resize-none"
                                    placeholder="Write your appreciation..."
                                    value={givePointsData.message}
                                    onChange={e => setGivePointsData({ ...givePointsData, message: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={submitPoints}
                                disabled={!givePointsData.recipient_id || !givePointsData.points || (!isAdmin && (parseInt(givePointsData.points || 0, 10) > userPoints))}
                                className={`w-full py-3 rounded-xl font-bold transition shadow-lg ${(!givePointsData.recipient_id || !givePointsData.points || (!isAdmin && (parseInt(givePointsData.points || 0, 10) > userPoints))) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-[#266ECD] text-white hover:bg-opacity-90'}`}
                            >
                                {(!isAdmin && parseInt(givePointsData.points || 0, 10) > userPoints) ? 'Insufficient points' : 'Send Points'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Subcomponents ---

// 1. Points Card (Visually distinct for points transactions)
const PointsCard = ({ appreciation, onLike, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-orange-100">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white flex items-center justify-center font-bold text-xl">
                            {appreciation.points}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900">
                                <span className="text-[#266ECD]">{appreciation.sender_name}</span>
                                <span className="font-normal text-gray-500 mx-2">rewarded</span>
                                <span className="text-[#266ECD]">{appreciation.recipient_name}</span>
                            </p>
                            <p className="text-sm text-gray-500">{new Date(appreciation.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {/* Delete Button */}
                    <button
                        onClick={onDelete}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Delete Post"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-gray-800 font-medium italic">"{appreciation.message}"</p>
                    <div className="mt-3 flex gap-2">
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full uppercase tracking-wide">
                            {appreciation.category}
                        </span>
                        <span>{appreciation.emoji}</span>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-orange-50">
                    <button
                        onClick={onLike}
                        className={`flex items-center gap-2 transition-colors ${appreciation.user_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                        <svg className={`w-6 h-6 ${appreciation.user_liked ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm font-medium">{appreciation.likes_count || 0} Likes</span>
                    </button>
                </div>
            </div>
            <CommentSection appreciation={appreciation} />
        </div>
    );
};

// 2. Appreciation Card (Simpler visual style for general recognition)
const AppreciationCard = ({ appreciation }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#266ECD] flex items-center justify-center font-bold">
                    {appreciation.sender_name ? appreciation.sender_name[0] : 'A'}
                </div>
                <div className="flex-1">
                    <p className="text-gray-900">
                        <span className="font-bold text-[#266ECD]">{appreciation.sender_name}</span> appreciated <span className="font-bold text-[#266ECD]">{appreciation.recipient_name}</span>
                    </p>
                    <p className="text-xs text-gray-500">{new Date(appreciation.created_at).toLocaleDateString()}</p>
                    <p className="mt-2 text-gray-800">{appreciation.message}</p>
                    <div className="mt-2 flex gap-2">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">#{appreciation.category}</span>
                        <span>{appreciation.emoji}</span>
                    </div>
                </div>
            </div>
            <CommentSection appreciation={appreciation} />
        </div>
    );
};

// Shared Comment Section
const CommentSection = ({ appreciation }) => {
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async () => {
        try {
            const response = await getComments(appreciation.id);
            if (response && response.data) setComments(response.data);
            else if (Array.isArray(response)) setComments(response);
        } catch (error) {
            console.error(error);
        }
    };

    const toggle = () => {
        if (!showComments) fetchComments();
        setShowComments(!showComments);
    };

    const post = async () => {
        if (!newComment.trim()) return;
        try {
            await addComment(appreciation.id, newComment);
            setNewComment('');
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error("Failed to post comment", error);
            alert("Failed to post comment");
        }
    };

    return (
        <div className="border-t border-gray-100 px-6 py-2">
            <div className="flex gap-4">
                <button onClick={toggle} className="text-sm text-gray-500 font-medium hover:text-[#266ECD]">
                    Comments ({appreciation.comments_count || 0})
                </button>
            </div>
            {showComments && (
                <div className="mt-4 space-y-4 pb-4">
                    {comments.map(c => (
                        <div key={c.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                            <span className="font-bold text-gray-900">{c.user_name}</span>: {c.comment}
                        </div>
                    ))}
                    <div className="flex gap-2">
                        <input
                            className="flex-1 border rounded px-3 py-1 text-sm outline-none focus:border-[#266ECD]"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                        />
                        <button onClick={post} className="text-[#266ECD] font-bold text-sm">Post</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedPage1;