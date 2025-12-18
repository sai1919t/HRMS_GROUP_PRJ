import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileLocation = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('Bengaluru');
  const [country, setCountry] = useState('India');
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Location</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600">City</label>
            <input value={city} onChange={e => setCity(e.target.value)} className="border px-3 py-2 rounded-md w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Country</label>
            <input value={country} onChange={e => setCountry(e.target.value)} className="border px-3 py-2 rounded-md w-full" />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
            {saved && <div className="text-sm text-green-600">Saved.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLocation;
