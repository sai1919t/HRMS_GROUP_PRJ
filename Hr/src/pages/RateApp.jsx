import React, { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RateApp = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState(null);

  const submit = () => {
    if (rating === 0) {
      setStatus({ type: 'error', text: 'Please choose a rating.' });
      return;
    }
    setStatus({ type: 'success', text: 'Thanks for rating the app!' });
    setTimeout(() => setStatus(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Rate App</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <p className="text-gray-700 mb-4">If you enjoy the app, please leave a rating — it helps us a lot!</p>

        <div className="flex items-center gap-2 mb-4">
          {[1,2,3,4,5].map((i) => (
            <button key={i} type="button" onClick={() => setRating(i)} className={`p-2 rounded-md ${rating >= i ? 'bg-yellow-100' : 'hover:bg-gray-50'}`}>
              <Star className={`${rating >= i ? 'text-yellow-500' : 'text-gray-400'}`} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
          <a href="#" onClick={(e)=>{e.preventDefault(); setStatus({type:'info', text:'Open store link placeholder'})}} className="text-sm text-blue-600">Open in Store</a>
          {status && <div className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{status.text}</div>}
        </div>
      </div>
    </div>
  );
};

export default RateApp;
