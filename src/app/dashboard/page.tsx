// app/page.tsx (Next.js 13+ with TypeScript)
"use client";

import { useState } from "react";
import { TrendingUp,UserPlus, Plus, Hotel } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type QuoteStatus = "Won" | "Pending" | "Sent" | "Lost";

interface Quotation {
  id: number;
  client: string;
  destination: string;
  date: string;
  amount: string;
  status: QuoteStatus;
}

export default function Dashboard() {
  const [quotations] = useState<Quotation[]>([
    {
      id: 1,
      client: "Rajesh Kumar",
      destination: "Goa",
      date: "12 Nov 2023",
      amount: "₹24,800",
      status: "Won",
    },
    {
      id: 2,
      client: "Meera Singh",
      destination: "Darjeeling",
      date: "10 Nov 2023",
      amount: "₹18,500",
      status: "Pending",
    },
    {
      id: 3,
      client: "Arun Patel",
      destination: "Kerala",
      date: "08 Nov 2023",
      amount: "₹32,400",
      status: "Sent",
    },
    {
      id: 4,
      client: "Sunita Iyer",
      destination: "Rajasthan",
      date: "05 Nov 2023",
      amount: "₹41,200",
      status: "Lost",
    },
    {
      id: 5,
      client: "Vikram Malhotra",
      destination: "Shimla",
      date: "02 Nov 2023",
      amount: "₹15,700",
      status: "Won",
    },
  ]);

  // Status colors
  const statusColors: Record<QuoteStatus, string> = {
    Won: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Sent: "bg-blue-100 text-blue-800",
    Lost: "bg-red-100 text-red-800",
  };

  // Chart Data
  const chartData = [
    { name: "Won", value: 14, color: "#10b981" },
    { name: "Pending", value: 10, color: "#f59e0b" },
    { name: "Sent", value: 12, color: "#3b82f6" },
    { name: "Lost", value: 6, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[15px] font-semibold text-gray-600">
                TOTAL QUOTATIONS
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">42</p>
              <p className="text-sm mt-2 text-green-600">
                +12% from last month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-400 transition-transform duration-300 hover:scale-110">
              <img src="/document.png" alt="" className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[15px] font-semibold text-gray-600">
                CONVERSION RATE
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">68%</p>
              <p className="text-sm mt-2 text-blue-600 flex"><TrendingUp size={19} className="mr-2"/> 14 won / 28 sent</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500 transition-transform duration-300 hover:scale-110">
              <img src="/uptrend.png" alt="" className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[15px] font-semibold text-gray-600">
                ACTIVE CLIENTS
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">28</p>
              <p className="text-sm mt-2 text-orange-600 flex"><UserPlus size={19} className="mr-2"/> 3 today</p>
            </div>
            <div className="p-3 rounded-lg bg-indigo-500 transition-transform duration-300 hover:scale-110">
              <img src="/groups.png" alt="" className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Card 4 */}
      <div className="bg-white rounded-xl shadow-sm p-6 
     transition-all duration-300 ease-out 
     hover:scale-105 hover:shadow-2xl hover:-translate-y-2">
  <div className="flex justify-between items-start">
    <div>
      <p className="text-[15px] font-semibold text-gray-600">
        REVENUE ESTIMATE
      </p>
      <p className="text-3xl font-bold text-gray-800 mt-2">₹2,48,500</p>
      <p className="text-sm mt-2 text-yellow-600">
        ₹ From won quotations
      </p>
    </div>
    <div className="p-3 rounded-lg bg-yellow-400 transition-transform duration-300 hover:scale-110">
      <img src="/rupee-indian.png" alt="" className="h-7 w-7" />
    </div>
  </div>
</div>

      </div>

      {/* Quick Actions */}
    <div className="flex flex-wrap gap-3 mb-8">
  {/* Primary Button */}
  <button className="bg-blue-600 flex items-center hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-md 
    transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-lg active:scale-95">
    <span className="mr-2 text-2xl"> <Plus size={26}/></span> Create New Quotation
  </button>

  {/* Secondary Buttons */}
  <button className="bg-white border border-gray-200 text-gray-700 font-medium py-2.5 px-5 rounded-lg shadow-sm 
    transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md hover:border-blue-300 hover:text-blue-600 active:scale-95 flex items-center ">
   <img src="/hotels.png" alt="" className="w-5 h-5 mr-2" /> Add Hotel
  </button>

  <button className="bg-white border border-gray-200 text-gray-700 font-medium py-2.5 px-5 rounded-lg shadow-sm 
    transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md hover:border-blue-300 hover:text-blue-600 active:scale-95 flex items-center">
    <img src="cars.png" alt="" className="w-7 h-7 mr-2" /> Add Car
  </button>

  <button className="bg-white border border-gray-200 text-gray-700 font-medium py-2.5 px-5 rounded-lg shadow-sm 
    transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md hover:border-blue-300 hover:text-blue-600 active:scale-95 flex items-center">
  <img src="/fork.png" alt="" className="w-5 h-5 mr-2" /> Add Meal
  </button>

  <button className="bg-white border border-gray-200 text-gray-700 font-medium py-2.5 px-5 rounded-lg shadow-sm 
    transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-md hover:border-blue-300 hover:text-blue-600 active:scale-95">
    <span className="mr-2 text-lg">⛰️</span> Add Activity
  </button>
</div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Recent Quotations Table */}
<div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
    <h2 className="text-lg font-semibold text-gray-800">Recent Quotations</h2>
    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
      View All
    </button>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Client
          </th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Destination
          </th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
     <tbody className="divide-y divide-gray-100">
  {quotations.map((quote) => (
    <tr
      key={quote.id}
      className="bg-white    transition-all duration-300 ease-out transform hover:scale-105 hover:bg-blue-50 cursor-pointer  hover:shadow-lg"
    >
      <td className="py-4 px-6 text-sm font-medium text-gray-500">
        {quote.client}
      </td>
      <td className="py-4 px-6 text-sm text-gray-500">
        {quote.destination}
      </td>
      <td className="py-4 px-6 text-sm text-gray-500">
        {quote.date}
      </td>
      <td className="py-4 px-6 text-sm text-gray-500">
        {quote.amount}
      </td>
      <td className="py-4 px-6">
        <span
          className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[quote.status]}`}
        >
          {quote.status}
        </span>
      </td>
      <td className="py-4 px-7 text-sm text-gray-700">
        <div className="flex space-x-2">
          <button className="p-1.5 rounded-full transition-all duration-300 hover:scale-110 hover:bg-blue-50">
           <img src="/edits.png" alt="" className="w-4 h-4"/>
          </button>
          <button className="p-1.5 rounded-full transition-all duration-300 hover:scale-110 hover:bg-red-50">
          <img src="/bin.png" alt="" className="w-4 h-4"/>
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>


    </table>
  </div>
</div>



        {/* Chart Section */}
        <div className=" flex flex-col gap-5">
          <div className=" bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800  mb-4">
            Quotation Status
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}`, `${name}`]}
                contentStyle={{ borderRadius: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
            <div>
            
<div className="grid grid-cols-2 gap-4 mt-6">
  {chartData.map((item, index) => (
    <div
      key={index}
      className="p-4 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 ease-out transform hover:scale-105 flex gap-2 items-center cursor-pointer"
      style={{ borderColor: item.color }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = item.color;
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "white";
        e.currentTarget.style.color = "black";
      }}
    >
      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
      <span className="font-medium">{item.name}</span>
      <span className="text-lg font-semibold ml-auto">{item.value}</span>
    </div>
  ))}
</div>
            </div>
            </div>
      
        {/* Recent Activity */}
<div className="bg-white rounded-xl shadow-sm p-6">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>

  <div className="space-y-5">
    {[
      { id: 1, text: "New quotation created for Rajesh Kumar", time: "2 hours ago", type: "creation" },
      { id: 2, text: "Quotation #QT-0042 marked as Won", time: "yesterday", type: "won" },
      { id: 3, text: "New client Meera Singh added", time: "2 days ago", type: "client" },
    ].map((activity) => {
      let icon = "/default.png"; // fallback icon
      if (activity.type === "creation") icon = "/google-docs.png";
      if (activity.type === "won") icon = "/medal.png";
      if (activity.type === "client") icon = "/client.png";

      return (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 shadow-sm transition-all duration-300 ease-out transform hover:scale-[1.02] hover:shadow-md hover:bg-blue-50"
        >
          {/* Icon */}
          <div className="flex-shrink-0">
            <img src={icon} alt={activity.type} className="h-8 w-8 " />
          </div>

          {/* Text */}
          <div>
            <p className="text-gray-800 text-sm font-medium">{activity.text}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
        </div>
      );
    })}
  </div>
</div>


     </div>   </div>
    </div>
  );
}
