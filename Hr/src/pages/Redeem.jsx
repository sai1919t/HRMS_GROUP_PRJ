import React, { useState } from 'react';
import { Gift, ShoppingCart, History, Coffee, Ticket, Heart, Home, Laptop, Calendar, Award, ExternalLink, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RedemptionPage = () => {
  const availablePoints = 2450;

  const rewards = [
    { 
      id: 1, 
      title: 'Extra Day Off', 
      points: 10000, 
      category: 'benefits',
      icon: <Calendar className="text-purple-600" size={28} />,
      color: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    },
    { 
      id: 2, 
      title: 'Charity Donation', 
      points: 1000, 
      category: 'charity',
      icon: <Heart className="text-red-600" size={28} />,
      color: 'from-red-50 to-red-100',
      borderColor: 'border-red-200'
    },
    { 
      id: 3, 
      title: 'Amazon Gift Card', 
      points: 5000, 
      category: 'shopping',
      icon: (
        <div className="text-gray-900 font-bold text-xl">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.27 21.72l-2.12-2.12.21-.19c1.13-1.13 1.71-2.69 1.71-4.23 0-1.54-.57-3.1-1.71-4.23C20.58 10.02 19.02 9.44 17.48 9.44c-1.54 0-3.1.57-4.23 1.71-1.13 1.13-1.71 2.69-1.71 4.23 0 1.54.57 3.1 1.71 4.23 1.13 1.13 2.69 1.71 4.23 1.71 1.54 0 3.1-.57 4.23-1.71l.19-.21 2.12 2.12c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41zM17.48 20c-1.38 0-2.76-.53-3.82-1.58-2.11-2.11-2.11-5.54 0-7.65 1.06-1.06 2.44-1.58 3.82-1.58 1.38 0 2.76.53 3.82 1.58 2.11 2.11 2.11 5.54 0 7.65C20.24 19.47 18.86 20 17.48 20z"/>
            <path d="M17.48 16.5c-.41 0-.75-.34-.75-.75v-3c0-.41.34-.75.75-.75s.75.34.75.75v3c0 .41-.34.75-.75.75z"/>
            <circle cx="17.48" cy="13.5" r=".75"/>
          </svg>
        </div>
      ),
      color: 'from-orange-50 to-yellow-100',
      borderColor: 'border-orange-200'
    },
    { 
      id: 4, 
      title: 'Movie Tickets', 
      points: 2000, 
      category: 'entertainment',
      icon: <Ticket className="text-blue-600" size={28} />,
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    { 
      id: 5, 
      title: 'Coffee Card', 
      points: 500, 
      category: 'dining',
      icon: <Coffee className="text-brown-600" size={28} />,
      color: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200'
    },
    { 
      id: 6, 
      title: 'Tech Gadget', 
      points: 15000, 
      category: 'tech',
      icon: <Laptop className="text-green-600" size={28} />,
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
    },
  ];

  const history = [
    { 
      id: 1, 
      name: 'Amazon Gift Card', 
      value: '$25', 
      date: 'Oct 15, 2023', 
      points: -2500,
      icon: (
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <span className="text-orange-600 font-bold text-sm">A</span>
        </div>
      )
    },
    { 
      id: 2, 
      name: 'Uber Voucher', 
      value: '$50', 
      date: 'Sep 02, 2023', 
      points: -5000,
      icon: (
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">U</span>
        </div>
      )
    },
    { 
      id: 3, 
      name: 'Company T-Shirt', 
      value: '$30', 
      date: 'Aug 21, 2023', 
      points: -1500,
      icon: (
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )
    },
  ];

  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/feed');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <button onClick={goBack} className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 mb-4">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Redemption Center</h1>
        <p className="text-gray-600">Redeem your points for amazing rewards</p>
      </div>

      {/* Points Display */}
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-6 top-6 opacity-20">
          <Award size={120} />
        </div>
        <p className="text-blue-100 mb-2 text-lg">Available Points Balance</p>
        <h2 className="text-6xl font-bold mb-4">{availablePoints.toLocaleString()}</h2>
        <div className="flex items-center gap-2">
          <div className="w-full bg-blue-500/30 rounded-full h-3">
            <div 
              className="bg-linear-to-r from-yellow-400 to-orange-400 h-full rounded-full" 
              style={{ width: `${(availablePoints / 20000) * 100}%` }}
            ></div>
          </div>
          <span className="text-blue-100 whitespace-nowrap">
            {((availablePoints / 20000) * 100).toFixed(0)}% to next tier
          </span>
        </div>
      </div>

      {/* Featured Rewards */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Rewards</h2>
            <p className="text-gray-600">Exchange your points for exclusive rewards</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Filter size={20} className="text-gray-500" />
            <select className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium">
              <option>Soft Points (Low to High)</option>
              <option>Points (High to Low)</option>
              <option>Most Popular</option>
              <option>Recently Added</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div 
              key={reward.id} 
              className={`bg-linear-to-br ${reward.color} rounded-xl p-6 border-2 ${reward.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  {reward.icon}
                </div>
                <span className="bg-linear-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                  {reward.points.toLocaleString()} pts
                </span>
              </div>
              
              <h3 className="font-bold text-gray-900 text-xl mb-2">{reward.title}</h3>
              <p className="text-sm text-gray-600 mb-6 capitalize">{reward.category}</p>
              
              <button className={`w-full text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-3 ${
                reward.category === 'benefits' ? 'bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' :
                reward.category === 'charity' ? 'bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' :
                reward.category === 'shopping' ? 'bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' :
                reward.category === 'entertainment' ? 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                reward.category === 'dining' ? 'bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800' :
                'bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              }`}>
                <ShoppingCart size={18} />
                Redeem Now
                <ExternalLink size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Redemption History */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Redemption History</h2>
              <p className="text-gray-600">Track your past redemptions</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-gray-50 to-gray-100">
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Reward</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Value</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Points</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <div>
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">Redemption ID: #{item.id}000{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-red-600">{item.points.toLocaleString()} pts</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="mt-8 w-full bg-linear-to-r from-gray-100 to-gray-200 text-gray-800 px-6 py-4 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          View Complete Transaction History
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 font-medium">Total Redeemed</p>
              <h3 className="text-3xl font-bold text-gray-900">9,000 pts</h3>
            </div>
            <Gift className="text-purple-600" size={32} />
          </div>
        </div>
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 font-medium">Avg. Monthly</p>
              <h3 className="text-3xl font-bold text-gray-900">3,000 pts</h3>
            </div>
            <Calendar className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 font-medium">Savings Value</p>
              <h3 className="text-3xl font-bold text-gray-900">$105</h3>
            </div>
            <ShoppingCart className="text-green-600" size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedemptionPage;