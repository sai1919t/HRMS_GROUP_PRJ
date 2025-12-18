import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const STORAGE_PREFIX = 'settings:contact:';

const Contact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setName(localStorage.getItem(STORAGE_PREFIX + 'name') || '');
    setEmail(localStorage.getItem(STORAGE_PREFIX + 'email') || '');
    setMessage(localStorage.getItem(STORAGE_PREFIX + 'message') || '');
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'name', name);
  }, [name]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'email', email);
  }, [email]);
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'message', message);
  }, [message]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus({ type: 'error', text: 'Please fill all fields.' });
      return;
    }

    setStatus({ type: 'loading', text: 'Sending...' });

    try {
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
      const res = await fetch(`${base}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error('Network error');

      setStatus({ type: 'success', text: 'Message sent — we will get back to you soon.' });
      setName(''); setEmail(''); setMessage('');
      localStorage.removeItem(STORAGE_PREFIX + 'name');
      localStorage.removeItem(STORAGE_PREFIX + 'email');
      localStorage.removeItem(STORAGE_PREFIX + 'message');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to send. Please try again later.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Contact</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <p className="text-gray-700 mb-4">Got a question? Send us a message and we'll respond as soon as possible.</p>

        <form onSubmit={submit} className="space-y-4" aria-labelledby="contact-form">
          <label className="sr-only" id="contact-form">Contact form</label>

          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded-md" placeholder="Your name" aria-required="true" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded-md" placeholder="Your email" type="email" aria-required="true" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border px-3 py-2 rounded-md" placeholder="Your message" rows={5} aria-required="true" />
          </div>

          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.98 }} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md" aria-busy={status?.type === 'loading'}>
              Send
            </motion.button>
            <div role="status" aria-live="polite" className={`text-sm ${status?.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
              {status?.text}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
