import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sections = [
  { title: 'Data we collect', content: 'We collect basic profile and usage data to improve the service.' },
  { title: 'How we use data', content: 'Data is used for analytics, personalization and to operate the service.' },
  { title: 'Your choices', content: 'You can request deletion or export of your data; contact support.' },
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(-1);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <p className="text-gray-700 mb-4">We care about your privacy. Expand sections below to learn more.</p>

        <div className="space-y-3">
          {sections.map((s, i) => (
            <div key={i} className="border rounded-md">
              <button className="w-full px-4 py-3 flex items-center justify-between" onClick={() => setOpen(open === i ? -1 : i)}>
                <div>
                  <h3 className="font-medium">{s.title}</h3>
                </div>
                <ChevronDown className={`transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <div className="px-4 pb-4 text-gray-700">{s.content}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
