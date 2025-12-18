import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const sections = [
  { title: 'Acceptance', content: 'By using this service you agree to the terms.' },
  { title: 'Usage', content: 'You may use the product according to these rules.' },
  { title: 'Limitations', content: 'Limitations and liabilities are described here.' },
];

const Terms = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Terms and Conditions</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <p className="text-gray-700 mb-4">Below are the main sections of our terms. Click a section to expand.</p>

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

export default Terms;
