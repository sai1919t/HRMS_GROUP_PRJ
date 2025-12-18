import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus({ type: 'error', text: 'Please fill all fields.' });
      return;
    }
    // Mock submit
    setStatus({ type: 'loading', text: 'Sending...' });
    setTimeout(() => {
      setStatus({ type: 'success', text: 'Message sent — we will get back to you soon.' });
      setName(''); setEmail(''); setMessage('');
      setTimeout(() => setStatus(null), 3000);
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Contact</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <p className="text-gray-700 mb-4">Got a question? Send us a message and we'll respond as soon as possible.</p>

        <form onSubmit={submit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded-md" placeholder="Your name" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded-md" placeholder="Your email" />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border px-3 py-2 rounded-md" placeholder="Your message" rows={5} />

          <div className="flex items-center gap-3">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Send</button>
            {status && <div className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{status.text}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
