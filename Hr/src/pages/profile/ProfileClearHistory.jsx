import React, { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileClearHistory = () => {
  const navigate = useNavigate();
  const [cleared, setCleared] = useState(false);

  const clear = () => {
    localStorage.removeItem('history');
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Clear History</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <p className="text-gray-700 mb-4">This will clear your local history (locally stored items only).</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={clear}><Trash2 /> Clear</button>
          {cleared && <div className="text-sm text-green-600">History cleared.</div>}
        </div>
      </div>
    </div>
  );
};

export default ProfileClearHistory;
