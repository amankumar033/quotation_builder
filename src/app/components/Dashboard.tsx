// pages/index.js (or app/page.js for Next.js 13+)
import { useState } from 'react';

export default function Dashboard() {
  const [quotations, setQuotations] = useState([
    { id: 1, client: 'Rajesh Kumar', destination: 'Goa', date: '12 Nov 2023', amount: '₹24,800', status: 'Won' },
    { id: 2, client: 'Meera Singh', destination: 'Darjeeling', date: '10 Nov 2023', amount: '₹18,500', status: 'Pending' },
    { id: 3, client: 'Arun Patel', destination: 'Kerala', date: '08 Nov 2023', amount: '₹32,400', status: 'Sent' },
    { id: 4, client: 'Sunita Iyer', destination: 'Rajasthan', date: '05 Nov 2023', amount: '₹41,200', status: 'Lost' },
    { id: 5, client: 'Vikram Malhotra', destination: 'Shimla', date: '02 Nov 2023', amount: '₹15,700', status: 'Won' },
  ]);

  const stats = [
    { title: 'TOTAL QUOTATIONS', value: '42', change: '+12% from last month', icon: '📄', color: 'green' },
    { title: 'CONVERSION RATE', value: '68%', change: '14 won / 28 sent', icon: '📈', color: 'blue' },
    { title: 'ACTIVE CLIENTS', value: '28', change: '+3 today', icon: '👥', color: 'indigo' },
    { title: 'REVENUE ESTIMATE', value: '₹2,48,500', change: 'From won quotations', icon: '💰', color: 'yellow' },
  ];

  const statusColors = {
    Won: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Sent: 'bg-blue-100 text-blue-800',
    Lost: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-xs mt-2 ${
                  stat.color === 'green' ? 'text-green-600' : 
                  stat.color === 'blue' ? 'text-blue-600' : 
                  stat.color === 'yellow' ? 'text-yellow-600' : 'text-indigo-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center">
          <span className="mr-2">+</span> Create New Quotation
        </button>
        <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg flex items-center">
          <span className="mr-2">🏨</span> Add Hotel
        </button>
        <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg flex items-center">
          <span className="mr-2">🚗</span> Add Car
        </button>
        <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg flex items-center">
          <span className="mr-2">🍽️</span> Add Meal
        </button>
        <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg flex items-center">
          <span className="mr-2">⛰️</span> Add Activity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotations Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Quotations</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotations.map((quote) => (
                  <tr key={quote.id}>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{quote.client}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{quote.destination}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{quote.date}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{quote.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full `}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700 p-1 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 p-1 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar - Charts and Activity */}
        <div className="space-y-6">
          {/* Status Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quotation Status</h2>
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#e5e7eb" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#10b981" strokeWidth="10" strokeDasharray="70 30" strokeDashoffset="25" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#f59e0b" strokeWidth="10" strokeDasharray="50 50" strokeDashoffset="95" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#3b82f6" strokeWidth="10" strokeDasharray="40 60" strokeDashoffset="145" transform="rotate(-90 50 50)" />
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#ef4444" strokeWidth="10" strokeDasharray="30 70" strokeDashoffset="185" transform="rotate(-90 50 50)" />
                  
                  <text x="50" y="50" textAnchor="middle" alignmentBaseline="middle" fontSize="12" fontWeight="bold">42 Total</text>
                </svg>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Won (14)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Pending (10)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Sent (12)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Lost (6)</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-4">
                <div className="flex">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 mr-4">
                    <span className="text-blue-600">📄</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New quotation created for Rajesh Kumar</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 mr-4">
                    <span className="text-green-600">✅</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quotation #QT-0042 marked as Won</p>
                    <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-2 mr-4">
                    <span className="text-indigo-600">👤</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New client Meera Singh added</p>
                    <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}