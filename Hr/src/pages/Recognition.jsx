import React, { useState, useEffect } from "react";
import coin from "../assets/coin.png";
import medal from "../assets/medal.png";
import trophy from "../assets/trophy.png";
import { createEmployeeOfMonth, getAllUsers } from "../services/employeeOfMonthService";

export default function RecognitionPage() {
  const [selectedSection, setSelectedSection] = useState("recipient");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    recipientName: "",
    department: "IT & Systems",
    employeeId: "",
    jobTitle: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = async () => {
    try {
      if (!formData.recipientName) {
        alert("Please select a recipient");
        return;
      }

      // Find user ID based on selection
      const selectedUser = users.find(u => u.fullname === formData.recipientName);
      if (!selectedUser) {
        alert("Please select a valid user from the list");
        return;
      }

      await createEmployeeOfMonth(
        selectedUser.id,
        `${formData.jobTitle} - ${formData.department}`, // Using description for title/dept
        new Date().toLocaleString('default', { month: 'long' }),
        [] // No team members for now
      );

      alert("Employee of the Month nominated successfully!");
      // Reset form
      setFormData({
        recipientName: "",
        department: "IT & Systems",
        employeeId: "",
        jobTitle: "",
      });
    } catch (error) {
      console.error("Error submitting nomination:", error);
      alert("Failed to submit nomination");
    }
  };

  const leaderboard = [
    {
      id: 1,
      name: "Alex Chen",
      points: 3245,
      rank: 1,
      isCurrentUser: false,
      avatarColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    {
      id: 2,
      name: "Lisa Park",
      points: 2987,
      rank: 2,
      isCurrentUser: false,
      avatarColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      id: 3,
      name: "You",
      points: 2847,
      rank: 3,
      isCurrentUser: true,
      avatarColor: "bg-purple-200",
      textColor: "text-purple-800",
    },
    {
      id: 4,
      name: "David Kim",
      points: 2654,
      rank: 4,
      isCurrentUser: false,
      avatarColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
    {
      id: 5,
      name: "Tom Rodriguez",
      points: 2432,
      rank: 5,
      isCurrentUser: false,
      avatarColor: "bg-green-100",
      textColor: "text-green-800",
    },
  ];

  const recognitions = [
    {
      id: 1,
      name: "Sarah Johnson",
      time: "2 hours ago",
      message:
        "Congratulations on completing the Q3 project ahead of schedule! Your dedication is inspiring.",
      points: "+50 points",
      badge: "Top Performer Badge",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      name: "Mike Davis",
      time: "1 day ago",
      message:
        "Thank you for mentoring the new team members. Your guidance has been invaluable!",
      points: "+30 points",
      badge: "Team Player Badge",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 bg-[#F6F8FA] border-b">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Appreciate Peers</h1>
          <p className="text-sm text-gray-500">
            Recognize, appreciate, reward – celebrate your exceptional peers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-700 cursor-pointer">
              HR Username ▼
            </span>
            <span className="text-xs text-gray-500">
              hr.username@example.com
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* MAIN GRID */}
        <div className="grid grid-cols-[340px_1fr] gap-8">
          {/* LEFT SIDEBAR */}
          <div className="space-y-4 min-h-screen">
            {/* Recipient */}
            {["recipient", "appreciation", "details"].map((section) => (
              <div
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`p-4 rounded-xl cursor-pointer border transition ${selectedSection === section
                    ? "border-purple-500 bg-white shadow-sm"
                    : "border-gray-200 bg-gray-50"
                  }`}
              >
                <h3
                  className={`text-sm font-semibold ${selectedSection === section
                      ? "text-purple-600"
                      : "text-gray-900"
                    }`}
                >
                  {section === "recipient"
                    ? "Recipient"
                    : section === "details"
                      ? "Other Details"
                      : "Appreciation For"}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  {section === "recipient" &&
                    "Who would you like to appreciate? Enter their name or select from colleagues."}
                  {section === "appreciation" &&
                    "What's the reason for appreciation? Mention specific achievement."}
                  {section === "details" &&
                    "Visibility, notifications, comments, and more options."}
                </p>
              </div>
            ))}

            {/* Leaderboard */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Leaderboard
              </h3>

              <div className="space-y-2">
                {leaderboard.map((user) => {
                  const rowClasses = user.isCurrentUser
                    ? "border border-purple-500 bg-purple-50"
                    : "border border-transparent bg-gray-50 hover:bg-gray-100";

                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${rowClasses}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-800">
                          {user.rank}
                        </div>

                        <div
                          className={`h-9 w-9 flex items-center justify-center rounded-full text-xs font-semibold ${user.avatarColor} ${user.textColor}`}
                        >
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-semibold ${user.isCurrentUser
                                ? "text-purple-700"
                                : "text-gray-900"
                              }`}
                          >
                            {user.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {user.points.toLocaleString()} points
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {user.rank === 1 && <span className="text-lg">👑</span>}
                        {user.isCurrentUser ? (
                          <span className="rounded-full bg-purple-600 px-2 py-1 text-[10px] font-semibold text-white">
                            You
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-500 font-medium">
                            #{user.rank}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="space-y-6">
            {/* TOP CARDS */}
            <div className="grid grid-cols-3 gap-4">
              {/* 1 — Total Points */}
              <div className="flex items-center justify-between h-24 rounded-2xl px-5 bg-linear-to-r from-blue-900 to-blue-700 text-white shadow">
                <div className="flex flex-col">
                  <span className="text-sm opacity-90">Total Points</span>
                  <span className="text-2xl font-semibold">2,847</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <img src={coin} alt="Coin Icon" className="w-12 h-12" />
                </div>
              </div>

              {/* 2 — Badges Earned */}
              <div className="flex items-center justify-between h-24 rounded-2xl px-5 bg-gray-100 text-gray-800 shadow">
                <div>
                  <span className="text-sm text-gray-600">Badges Earned</span>
                  <span className="text-2xl font-semibold block">12</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-300 flex items-center justify-center">
                  <img src={medal} alt="Medal Icon" className="w-12 h-12" />
                </div>
              </div>

              {/* 3 — Current Rank */}
              <div className="flex items-center justify-between h-24 rounded-2xl px-5 bg-gray-100 text-gray-800 shadow">
                <div>
                  <span className="text-sm text-gray-600">Current Rank</span>
                  <span className="text-2xl font-semibold block">#3</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-200 flex items-center justify-center">
                  <img src={trophy} alt="Trophy Icon" className="w-12 h-12" />
                </div>
              </div>
            </div>

            {/* FORM CARD */}
            <div className="bg-gray-100 rounded-2xl p-6 shadow">
              <h2 className="text-lg font-semibold text-purple-700">
                Select the Recipient
              </h2>
              <p className="text-gray-500 mb-6">
                Choose a colleague you'd like to appreciate
              </p>

              {/* Recipient Name */}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-1">
                  Recipient Name
                </label>
                <select
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Select Employee</option>
                  {users.map(user => (
                    <option key={user.id} value={user.fullname}>{user.fullname}</option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Department/Team
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                >
                  <option value="IT & Systems">IT & Systems</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              {/* Employee ID + Job Title */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter ID"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Job Title
                  </label>
                  <select
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="">Select</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition"
                >
                  Next step
                </button>
              </div>
            </div>

            {/* RECENT RECOGNITION */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-blue-900 mb-3">
                Recent Recognition
              </h3>

              <div className="space-y-3">
                {recognitions.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-gray-200 rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={rec.avatar}
                        alt={rec.name}
                        className="w-9 h-9 rounded-full mr-2.5 object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">
                          {rec.name}
                        </h4>
                        <span className="text-xs text-gray-500">{rec.time}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2.5">
                      {rec.message}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="bg-purple-500 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
                        {rec.points}
                      </span>
                      <span className="text-purple-600 text-sm font-medium">
                        {rec.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
