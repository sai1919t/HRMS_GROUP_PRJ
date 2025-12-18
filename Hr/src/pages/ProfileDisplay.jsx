import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileDisplay = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [font, setFont] = useState('md');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Display</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-sm text-gray-500">Toggle dark theme for the app</p>
          </div>
          <div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={dark} onChange={() => setDark(!dark)} />
              <div className={`w-12 h-6 rounded-full transition-colors ${dark ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${dark ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-600">Font size</label>
          <select value={font} onChange={(e)=>setFont(e.target.value)} className="border mt-1 p-2 rounded-md">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;