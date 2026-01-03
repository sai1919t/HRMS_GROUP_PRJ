import React, { useState } from "react";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'settings:feedback';
const defaultValues = {
  name: "",
  email: "",
  type: "",
  message: "",
};

const Feedback = ({
  title = "Feedback",
  description = "We’d love your feedback. Help us improve by sharing your thoughts, suggestions, or reporting issues.",
  initialValues = {},
  onSubmit,
  submitLabel = "Submit Feedback",
  className = "",
}) => {
  // Merge defaults with provided initial values
  const [formData, setFormData] = useState({
    ...defaultValues,
    ...initialValues,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Feedback submitted:", formData);
    }
  };
const navigate = useNavigate();


  // const submit = async (e) => {
  //   e.preventDefault();
  //   if (rating === 0) {
  //     setStatus({ type: 'error', text: 'Please provide a rating.' });
  //     return;
  //   }
  //   setStatus({ type: 'loading', text: 'Submitting...' });
  //   try {
  //     const base = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
  //     const res = await fetch(`${base}/api/feedback`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ rating, comment }),
  //     });
  //     if (!res.ok) throw new Error('Network');
  //     setStatus({ type: 'success', text: 'Thanks for your feedback!' });
  //     setRating(0); setComment('');
  //     localStorage.removeItem(STORAGE_KEY);
  //     setTimeout(() => setStatus(null), 2500);
  //   } catch (err) {
  //     setStatus({ type: 'error', text: 'Failed to submit. Try again later.' });
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} aria-label="Go back" className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Feedback</h1>
      </div>

      {/* 👇 This wrapper puts the form in the middle of the page */}
      <div
        className={
          "w-full max-w-3xl bg-white rounded-3xl shadow-sm px-6 sm:px-10 py-8 sm:py-10 " +
          className
        }
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {description && (
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              {description}
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name:
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Recipient Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-2.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                placeholder:text-slate-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="abc@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-2.5 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                placeholder:text-slate-400"
            />
          </div>

          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Feedback Type:
            </label>
            <div className="relative">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full appearance-none rounded-md border border-slate-200 
                  px-3 sm:px-4 py-2.5 text-sm sm:text-base bg-white pr-10
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="bug">Bug / Issue</option>
                <option value="feature">Feature Request</option>
                <option value="general">General Feedback</option>
              </select>

              {/* Dropdown Arrow */}
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                ▾
              </span>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message:
            </label>
            <textarea
              name="message"
              rows={6}
              placeholder="Share your thoughts with us..."
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-200 px-4 py-3 text-sm
                resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                placeholder:text-slate-400"
            />
          </div>

          {/* Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-md bg-[#0056FF] py-3 text-sm font-semibold 
                text-white shadow-sm hover:bg-[#0044cc] active:scale-[0.99] 
                transition"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
