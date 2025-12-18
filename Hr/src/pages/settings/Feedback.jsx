import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const STORAGE_KEY = 'settings:feedback';

const Feedback = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved.rating) setRating(saved.rating);
      if (saved.comment) setComment(saved.comment);
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rating, comment }));
  }, [rating, comment]);

  const submit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setStatus({ type: 'error', text: 'Please provide a rating.' });
      return;
    }
    setStatus({ type: 'loading', text: 'Submitting...' });
    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
      const res = await fetch(`${base}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) throw new Error('Network');
      setStatus({ type: 'success', text: 'Thanks for your feedback!' });
      setRating(0); setComment('');
      localStorage.removeItem(STORAGE_KEY);
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to submit. Try again later.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Feedback</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <p className="text-gray-700 mb-4">We'd love to hear from you.</p>

        <form onSubmit={submit} className="space-y-4" aria-label="feedback-form">
          <div role="radiogroup" aria-label="rating" className="flex items-center gap-2">
            {[1,2,3,4,5].map((i) => (
              <motion.button key={i} type="button" onClick={() => setRating(i)} whileTap={{ scale: 0.95 }} className={`p-2 rounded-md ${rating >= i ? 'bg-yellow-100' : 'hover:bg-gray-50'}`} aria-pressed={rating >= i} aria-label={`${i} star`}>
                <Star className={`${rating >= i ? 'text-yellow-500' : 'text-gray-400'}`} />
              </motion.button>
            ))}
          </div>

          <div>
            <label className="sr-only">Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border px-3 py-2 rounded-md" placeholder="Optional comment" rows={4} />
          </div>

          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.98 }} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md" aria-busy={status?.type === 'loading'}>Submit</motion.button>
            <div role="status" aria-live="polite" className={`text-sm ${status?.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{status?.text}</div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Feedback;
