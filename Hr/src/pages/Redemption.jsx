import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Redemption = () => {
  const navigate = useNavigate();

  const goBack = () => {
    // If there is a history entry, go back; otherwise fallback to /feed
    if (window.history.length > 1) navigate(-1);
    else navigate('/feed');
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Redemption Center</h1>
          <p className="text-gray-600 mb-4">Browse rewards and redeem your points here.</p>

          {/* Placeholder content - replace with real redemption UI later */}
          <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-500">
            Redemption features coming soon — you can add reward items and a redemption flow here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Redemption;
