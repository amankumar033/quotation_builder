"use client";
import { useState } from "react";
import { FiDownload, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { MapPinned} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
LabelList} from "recharts";

// Dummy analytics data
const quotations = [
  { month: "Jan", sent: 40, won: 25, lost: 15, revenue: 50000 },
  { month: "Feb", sent: 50, won: 30, lost: 20, revenue: 65000 },
  { month: "Mar", sent: 35, won: 20, lost: 15, revenue: 40000 },
];

const popularDestinations = [
  { name: "Goa Package", count: 20 },
  { name: "Manali Adventure", count: 15 },
  { name: "Kerala Backwaters", count: 10 },
  { name: "Rajasthan Heritage", count: 5 },
];

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#facc15"]; // green, red, blue, yellow

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(quotations[0].month);
  const currentMonthData = quotations.find(q => q.month === selectedMonth) || quotations[0];
  const winLossRatio = (currentMonthData.won / currentMonthData.sent) * 100;
  const lossRatio = (currentMonthData.lost / currentMonthData.sent) * 100;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-lg">
            Key metrics and visual insights
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <FiDownload size={20} /> Export
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quotations Sent */}
        <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-gray-100">
          <div className="flex justify-between">
            <div>
          <p className="text-gray-400 font-medium">Quotations Sent</p>
          <p className="text-3xl font-bold mt-3">{currentMonthData.sent}</p>
            </div>
          <div className="p-3 rounded-lg bg-green-400 transition-transform duration-300 hover:scale-110 h-13">
              <img src="/document.png" alt="" className="h-7 w-7" />
            </div>
        </div>
          <p className="text-sm text-green-500 mt-1">Compared to last month: +10%</p>
      
        </div>

        {/* Win/Loss Ratio */}
        <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-gray-100">
         <div className="flex justify-between">
         <div>

          <p className="text-gray-400 font-medium">Win/Loss Ratio</p>
          <p className="text-3xl font-bold mt-3 ">{winLossRatio.toFixed(1)}%</p>
         </div>
            <div className="p-3 rounded-lg bg-blue-500 transition-transform duration-300 hover:scale-110 h-13">
              <img src="/uptrend.png" alt="" className="h-7 w-7" />
            </div>
            </div>
          <p className="flex items-center text-sm mt-1 text-blue-400">
            <FiArrowUp className="mr-1" /> Trend Up
          </p>
        </div>

        {/* Revenue Estimation */}
        <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-gray-100">

          
          <div className="flex justify-between ">
          <div>
          <p className="text-gray-400 font-medium">Revenue Estimation</p>
          <p className="text-3xl font-bold mt-3">₹{currentMonthData.revenue}</p>
          </div>
            <div className="p-3 rounded-lg bg-indigo-500 transition-transform duration-300 hover:scale-110 h-13">
              <img src="/groups.png" alt="" className="h-7 w-7" />
            </div>
            </div>
          <p className="flex items-center text-sm mt-1 text-red-500">
            <FiArrowDown className="mr-1" /> Loss: ₹{currentMonthData.sent * 200}
          </p>
        </div>

        {/* Popular Destination */}
        <div className="p-5 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-gray-100">
          <div className="flex justify-between">
          <div>

          <p className="text-gray-400 font-medium">Popular Destination</p>
          <p className="text-3xl font-bold mt-2">{popularDestinations[0].name}</p>
          </div>
          <div className="p-3 rounded-lg bg-yellow-500 transition-transform duration-300 hover:scale-110 h-12 ">
           <MapPinned className="h-6 w-6 text-white" />
          </div>
          </div>
          <p className="text-sm text-yellow-600 mt-1">{popularDestinations[0].count} Bookings</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart: Quotations */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-gray-100">
  <h2 className="font-semibold mb-4 text-lg">Monthly Quotations Overview</h2>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={quotations} barCategoryGap="20%">
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="month" tick={{ fontSize: 14, fill: "#6b7280" }} />
      <YAxis tick={{ fontSize: 14, fill: "#6b7280" }} />

      {/* Custom Tooltip */}
   <Tooltip
   
  content={({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            padding: "10px 15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          <p style={{ color: "#6b7280", fontWeight: 500 }}>{label}</p>
          {payload.map((entry: any, index: number) => {
            let color = entry.color; // bar color is automatically passed
            return (
              <p key={`item-${index}`} style={{ color, marginTop: 10 }}>
                <strong>{entry.name}:</strong> {entry.value}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  }}
/>




      <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 14 }} />

      {/* Bars with labels */}
      <Bar dataKey="sent" fill="#3b82f6" name="Sent" radius={[6, 6, 0, 0]} barSize={40}>
        <LabelList dataKey="sent" position="top" fill="#374151" fontSize={12} />
      </Bar>

      <Bar dataKey="won" fill="#22c55e" name="Won" radius={[6, 6, 0, 0]} barSize={40}>
        <LabelList dataKey="won" position="top" fill="#374151" fontSize={12} />
      </Bar>

      <Bar dataKey="lost" fill="#ef4444" name="Lost" radius={[6, 6, 0, 0]} barSize={40}>
        <LabelList dataKey="lost" position="top" fill="#374151" fontSize={12} />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>


        {/* Pie Chart: Popular Destinations */}
<div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 ease-out border border-gray-100">
  <h2 className="font-semibold mb-4 text-lg">Popular Destinations / Packages</h2>
  
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={popularDestinations}
        dataKey="count"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60} // donut style
        outerRadius={100}
        paddingAngle={5} // space between slices
        label={false} // remove connecting text
        isAnimationActive={true}
      >
        {popularDestinations.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
            style={{ cursor: "pointer", transition: "all 0.3s" }}
          />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          padding: 0,
        }}
        itemStyle={{ color: "#fff" }}
        formatter={(value: number, name: string, props: any) => {
          const total = popularDestinations.reduce((sum, entry) => sum + entry.count, 0);
          const percent = ((value / total) * 100).toFixed(0);
          const color = props?.payload?.fill || "#3b82f6";

          return [
            <span
              style={{
                backgroundColor: color,
                color: "#fff",
                padding: "6px 12px",
                borderRadius: "6px",
                display: "inline-block",
                fontWeight: 500,
              }}
            >
              {name}: {value} ({percent}%)
            </span>,
            "",
          ];
        }}
      />
    </PieChart>
  </ResponsiveContainer>

  {/* Custom Grid Legend */}
  <div className="grid grid-cols-2 gap-4 mt-4">
    {popularDestinations.map((entry, index) => {
      const total = popularDestinations.reduce((sum, e) => sum + e.count, 0);
      const percent = ((entry.count / total) * 100).toFixed(0);

      return (
        <div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer bg-white border border-gray-100"
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <div>
            <p className="font-semibold text-gray-700">{entry.name}</p>
            <p className="text-sm text-gray-500">
              {entry.count} bookings ({percent}%)
            </p>
          </div>
        </div>
      );
    })}
  </div>
</div>



      </div>

      
    </div>
  );
}
