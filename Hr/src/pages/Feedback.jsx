import React, { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setStatus({ type: 'error', text: 'Please provide a rating.' });
      return;
    }
    setStatus({ type: 'loading', text: 'Submitting...' });
    setTimeout(() => {
      setStatus({ type: 'success', text: 'Thanks for your feedback!' });
      setRating(0); setComment('');
      setTimeout(() => setStatus(null), 2500);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Feedback</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <p className="text-gray-700 mb-4">We'd love to hear from you.</p>

        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map((i) => (
              <button key={i} type="button" onClick={() => setRating(i)} className={`p-2 rounded-md ${rating >= i ? 'bg-yellow-100' : 'hover:bg-gray-50'}`}>
                <Star className={`${rating >= i ? 'text-yellow-500' : 'text-gray-400'}`} />
              </button>
            ))}
          </div>

          <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border px-3 py-2 rounded-md" placeholder="Optional comment" rows={4} />

          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
            {status && <div className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{status.text}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
