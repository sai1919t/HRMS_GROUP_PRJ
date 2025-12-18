import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const defaultPrefs = { necessary: true, analytics: false, marketing: false };

const CookiesPolicy = () => {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookies_prefs');
    if (savedPrefs) setPrefs(JSON.parse(savedPrefs));
  }, []);

  const toggle = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  const save = (acceptAll = false) => {
    const newPrefs = acceptAll
      ? { necessary: true, analytics: true, marketing: true }
      : prefs;
    localStorage.setItem('cookies_prefs', JSON.stringify(newPrefs));
    setPrefs(newPrefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6 mt-5">
        <button onClick={() => navigate(-1)} className="p-2 mr-4 rounded-md hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold">Cookies Policy</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <p className="text-gray-700 mb-4">We use cookies to improve your experience. Choose which cookies you allow below.</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Necessary</h3>
              <p className="text-sm text-gray-500">Required for site functionality</p>
            </div>
            <div className="text-gray-500">Required</div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Analytics</h3>
              <p className="text-sm text-gray-500">Helps us understand usage</p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" checked={prefs.analytics} onChange={() => toggle('analytics')} />
                <div className={`w-12 h-6 rounded-full transition-colors ${prefs.analytics ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${prefs.analytics ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing</h3>
              <p className="text-sm text-gray-500">Used for personalized ads</p>
            </div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" checked={prefs.marketing} onChange={() => toggle('marketing')} />
                <div className={`w-12 h-6 rounded-full transition-colors ${prefs.marketing ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${prefs.marketing ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={() => save(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Accept all</button>
            <button onClick={() => { setPrefs({ necessary: true, analytics: false, marketing: false }); save(false); }} className="px-4 py-2 border rounded-md">Reject all</button>
            <button onClick={() => save(false)} className="px-4 py-2 border rounded-md">Save</button>
          </div>

          {saved && <div className="text-sm text-green-600 mt-3">Preferences saved.</div>}
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;
