import React, { useState } from "react";
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import infoIcon from "../assets/info.png";
import eligibilityIcon from "../assets/eligibility.png";
import calendarIcon from "../assets/calendar.png";
import paymentIcon from "../assets/payment.png";
import certificateIcon from "../assets/certificate.png";

const Terms = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

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

      <div className="min-h-screen flex flex-col items-center">
            {/* Header */}
            <header className="w-full max-w-5xl mb-2 px-2">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                Terms & conditions
              </h1>
              <p className="text-sm text-[#A0A0A0]">Updated December 2025</p>
            </header>

            {/* Main Card Container */}
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
              <div className="flex flex-col gap-4">
                {/* Section Box Reusable Style */}
                {[
                  {
                    icon: infoIcon,
                    title: "1. Acceptance of Terms",
                    desc: "By participating in the UpSkill Internship Program, you agree to follow all rules, policies, and guidelines. If you do not agree, you should not continue.",
                  },
                  {
                    icon: eligibilityIcon,
                    title: "2. Eligibility",
                    desc: "You must be a student or recent graduate. All provided information must be accurate. The company may verify your details.",
                  },
                  {
                    icon: calendarIcon,
                    title: "3. Internship Duration",
                    desc: "The internship duration is mentioned in the offer letter. The company may extend or reduce it based on performance or requirements.",
                  },
                  {
                    icon: paymentIcon,
                    title: "4. Stipend / Payment",
                    desc: "Stipend (if applicable) will be based on the internship category. Not all internships include payment, and this will be clearly stated.",
                  },
                  {
                    icon: certificateIcon,
                    title: "5. Certificate",
                    desc: "A certificate will be issued only after successful completion of tasks, attendance, and evaluation criteria defined by the company.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 rounded-xl border border-gray-200 bg-[#F9FBFC] w-full min-h-[120px]"
                  >
                    <div className="w-14 h-14 bg-[#0EA5E9] rounded-full flex items-center justify-center shrink-0">
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="w-12 h-12 object-contain"
                      />
                    </div>

                    <div className="ml-6 flex-1">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <footer className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-500">
                    I Confirm that I have read and accept the terms and conditions
                  </span>
                </label>

                <div className="flex sm:w-auto gap-2 flex-col md:flex-row">
                  <button className="w-full sm:w-auto px-8 py-2.5 bg-[#AAB8C6] text-white rounded-full font-bold">
                    Cancel
                  </button>
                  <button className={`w-full sm:w-auto px-8 py-2.5 rounded-full font-bold shadow-md
                  ${
                    isChecked
                      ? "bg-[#3B82F6] text-white"
                      : "bg-[#AAB8C6] text-white cursor-not-allowed"
                  }`}
                  disabled={!isChecked}>
                    Accept
                  </button>
                </div>
              </footer>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Terms;
