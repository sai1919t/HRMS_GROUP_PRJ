import React, { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialDeleted = [
  { id: 'd1', name: 'old_cv.pdf' },
  { id: 'd2', name: 'draft_notes.docx' },
];

const ProfileDeleted = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

  const fetchDeleted = async () => {
    const res = await fetch(`${base}/api/uploads/deleted`);
    const data = await res.json();
    setItems(data);
  };

  React.useEffect(() => { fetchDeleted(); }, []);

  const restore = async (filename) => {
    const res = await fetch(`${base}/api/uploads/restore/${encodeURIComponent(filename)}`, { method: 'POST' });
    if (res.ok) await fetchDeleted();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Recently Deleted</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {items.length === 0 ? <p className="text-gray-600">No recently deleted items.</p> : (
          items.map(it => (
            <div key={it.filename} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div className="text-gray-800">{it.filename}</div>
              <div>
                <button onClick={() => restore(it.filename)} className="px-3 py-1 bg-blue-600 text-white rounded-md">Restore</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileDeleted;
