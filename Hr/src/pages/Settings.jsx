import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Moon, Star, Link as LinkIcon, 
  Shield, FileText, Cookie, 
  Phone, MessageSquare, LogOut,
  ChevronRight
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const settingsItems = [
    { icon: <Bell size={22} />, label: 'Notification', hasToggle: true, toggleState: notifications, onToggle: () => setNotifications(!notifications) },
    { icon: <Moon size={22} />, label: 'Dark Mode', hasToggle: true, toggleState: darkMode, onToggle: () => setDarkMode(!darkMode) },
    { icon: <Star size={22} />, label: 'Rate App', path: '/settings/rate' },
    { icon: <LinkIcon size={22} />, label: 'Share Link' },
    { icon: <Shield size={22} />, label: 'Privacy Policy', path: '/settings/privacy' },
    { icon: <FileText size={22} />, label: 'Terms and Conditions', path: '/settings/terms' },
    { icon: <Cookie size={22} />, label: 'Cookies Policy', path: '/settings/cookies' },
    { icon: <Phone size={22} />, label: 'Contact', path: '/settings/contact' },
    { icon: <MessageSquare size={22} />, label: 'Feedback', path: '/settings/feedback' },
    { icon: <LogOut size={22} />, label: 'Logout', isLogout: true },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 mt-5">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your application preferences</p>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {settingsItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-6 py-4 ${
              index !== settingsItems.length - 1 ? 'border-b border-gray-100' : ''
            } ${item.isLogout ? 'hover:bg-red-50 cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'}`}
            onClick={async (e) => {
              // prevent toggle click from bubbling
              if (item.hasToggle) return;
              if (item.onToggle) return;
              if (item.path) return navigate(item.path);

              // Handle logout
              if (item.isLogout) {
                try {
                  const { logout } = await import('../services/auth.service.js');
                  await logout();
                } catch (err) {
                  console.error('Logout failed', err);
                }
              }
            }}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-4 ${
                item.isLogout ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {item.icon}
              </div>
              <span className={`font-medium ${
                item.isLogout ? 'text-red-600' : 'text-gray-700'
              }`}>
                {item.label}
              </span>
            </div>
            
            <div className="flex items-center">
              {item.hasToggle ? (
                <div
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                    item.toggleState ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onToggle();
                  }}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      item.toggleState ? 'left-7' : 'left-1'
                    }`}
                  ></div>
                </div>
              ) : (
                <ChevronRight size={20} className="text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* App Version */}
      <div className="mt-8 text-center">
        <p className="text-gray-500">App Version 2.1.4</p>
        <p className="text-sm text-gray-400 mt-1">© 2024 Marka HRMS. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SettingsPage;