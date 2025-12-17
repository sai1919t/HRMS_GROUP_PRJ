import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react"; // Added Trash2 icon
import { motion } from "framer-motion";
import MeetingModal from "./AddMeetingModal";

export default function MeetingsUI() {
  const [meetings, setMeetings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMeetings([]);
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/api/meetings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMeetings(data);
        } else {
          setMeetings([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleOpenAdd = () => {
    setSelectedMeeting(null);
    setShowModal(true);
  };

  const handleOpenEdit = (meeting) => {
    setSelectedMeeting(meeting);
    setShowModal(true);
  };

  // ✅ New: Handle Delete directly from the list
  const handleDeleteDirectly = async (id, e) => {
    e.stopPropagation(); // Prevent the row click (Edit) from firing
    
    if (!window.confirm("Are you sure you want to cancel this meeting?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/meetings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMeetings((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete meeting");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMeetingSaved = (savedMeeting) => {
    setMeetings((prev) => {
      const exists = prev.find((m) => m.id === savedMeeting.id);
      if (exists) {
        return prev.map((m) => (m.id === savedMeeting.id ? savedMeeting : m));
      } else {
        return [...prev, savedMeeting];
      }
    });
  };

  const handleMeetingDeleted = (deletedId) => {
    setMeetings((prev) => prev.filter((m) => m.id !== deletedId));
  };

  const formatMeeting = (m) => {
    const dateObj = new Date(m.meeting_date);
    return {
      ...m,
      dayShort: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
      date: dateObj.getDate(),
      timeDisplay: `From ${m.start_time} to ${m.end_time}`,
      color: "bg-blue-500",
    };
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full h-full flex flex-col min-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-blue-600">Meetings</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Meeting
        </button>
      </div>

      {/* Meetings List */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {loading && <p className="text-sm text-gray-400">Loading meetings...</p>}
        {!loading && meetings.length === 0 && (
          <p className="text-sm text-gray-400">No meetings scheduled</p>
        )}

        {!loading &&
          meetings.map((raw, idx) => {
            const m = formatMeeting(raw);
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="group flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                onClick={() => handleOpenEdit(raw)}
              >
                {/* Date Box */}
                <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white ${m.color} shadow-sm shrink-0`}>
                  <span className="text-[10px] font-bold uppercase">{m.dayShort}</span>
                  <span className="text-lg font-bold leading-none">{m.date}</span>
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-bold text-sm capitalize truncate">{m.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">{m.timeDisplay}</p>
                </div>

                {/* Actions: Edit & Delete (Visible on Hover) */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenEdit(raw); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteDirectly(m.id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-400">Last synced just now</div>
        <button onClick={fetchMeetings} className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700">
          Sync
        </button>
      </div>

      <MeetingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        meetingToEdit={selectedMeeting}
        onMeetingSaved={handleMeetingSaved}
        onMeetingDeleted={handleMeetingDeleted}
      />
    </div>
  );
}