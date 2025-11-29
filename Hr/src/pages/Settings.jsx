import React from 'react';

const Settings = () => {
  const settingsItems = [
    'Notification',
    'Dark Mode', 
    'Rate App',
    'Share Link',
    'Privacy Policy',
    'Terms and Conditions',
    'Cookies Policy',
    'Contact',
    'Feedback',
    'Logout'
  ];

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 animate-slide-down">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Settings List */}
        <div className="lg:col-span-2 space-y-6">
          {/* HRMS Card with Animation */}
          <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 animate-float">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <span className="text-white font-bold text-xl">HR</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">HRMS</h2>
                  <p className="text-white/90 text-sm">Human Resource Management System</p>
                </div>
              </div>
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                Manage
              </button>
            </div>
          </div>

          {/* Settings List with Animations */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-slide-up">
            {settingsItems.map((item, index) => (
              <div key={item} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-center justify-between px-6 py-4 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer group transition-all duration-300 transform hover:translate-x-2">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full bg-linear-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                    <span className={`text-gray-700 group-hover:text-gray-900 font-medium transition-all duration-300 ${item === 'Logout' ? 'text-red-500 group-hover:text-red-600' : ''}`}>
                      {item}
                    </span>
                  </div>
                  <span className="text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300">›</span>
                </div>
                {index < settingsItems.length - 1 && (
                  <div className="border-b border-gray-100 mx-6"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Images with Animations */}
        <div className="space-y-6">
          {/* HRMS Dashboard Image - TOP */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transform hover:scale-105 transition-all duration-500 animate-slide-right">
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>HRMS Dashboard</span>
            </h3>
            <div className="w-full h-48 bg-linear-to-br from-green-50 to-blue-50 rounded-xl border-2 border-dashed border-green-200 overflow-hidden group hover:border-green-300 transition-all duration-500">
              <img 
                src="https://amarebe.com/wp-content/uploads/2024/10/HRMS-1.jpg" 
                alt="HRMS Dashboard"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full items-center justify-center bg-linear-to-br from-green-100 to-blue-100 flex-col p-4">
                <div className="text-4xl mb-2">📊</div>
                <span className="text-green-600 font-semibold text-center">HRMS Dashboard</span>
                <span className="text-green-400 text-xs text-center mt-1">Interactive Analytics</span>
              </div>
            </div>
          </div>

          {/* Businessman Image - BOTTOM */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 transform hover:scale-105 transition-all duration-500 animate-slide-right" style={{ animationDelay: '200ms' }}>
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span>Business Illustration</span>
            </h3>
            <div className="w-full h-48 bg-linear-to-br from-orange-50 to-pink-50 rounded-xl border-2 border-dashed border-orange-200 overflow-hidden group hover:border-orange-300 transition-all duration-500">
              <img 
                src="https://www.shutterstock.com/image-vector/procrastinating-businessman-sitting-legs-on-260nw-1348362062.jpg" 
                alt="Procrastinating Businessman"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full items-center justify-center bg-linear-to-br from-orange-100 to-pink-100 flex-col p-4">
                <div className="text-4xl mb-2">💼</div>
                <span className="text-orange-600 font-semibold text-center">Business Analytics</span>
                <span className="text-orange-400 text-xs text-center mt-1">Performance Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;