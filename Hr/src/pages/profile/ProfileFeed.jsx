import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockFeed = [
  { id: 1, text: 'Shared a new appreciation for the promo team.' },
  { id: 2, text: 'Completed onboarding for 3 new hires.' },
  { id: 3, text: 'Published the October HR newsletter.' },
];

const ProfileFeed = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Latest Feed</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {mockFeed.map(item => (
          <div key={item.id} className="border-b last:border-b-0 py-3">
            <p className="text-gray-800">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileFeed;
