"use client";
import { useState } from "react";
import { FiPlus, FiDownload, FiUsers, FiFileText, FiTrendingUp, FiCalendar, FiTrash2 ,FiEdit,FiSearch } from "react-icons/fi";

export default function ClientDashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // Dummy Data
  const clients = [
    { name: "Rajesh Kumar", city: "Mumbai", quotations: 5, won: 3, lost: 2 },
    { name: "Anita Sharma", city: "Goa", quotations: 2, won: 1, lost: 1 },
    { name: "Vikram Singh", city: "Delhi", quotations: 7, won: 5, lost: 2 },
  ];

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Client Dashboard
        </h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-all duration-300">
            <FiDownload /> Export
          </button>
          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-300">
            <FiPlus /> Add Client
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3">
            <FiFileText className="text-blue-500 text-3xl" />
            <div>
              <p className="text-gray-500 text-sm">Quotations Sent</p>
              <p className="text-xl font-semibold">45</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3">
            <FiTrendingUp className="text-green-500 text-3xl" />
            <div>
              <p className="text-gray-500 text-sm">Quotations Won</p>
              <p className="text-xl font-semibold">28</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3">
            <FiTrendingUp className="text-red-500 text-3xl" />
            <div>
              <p className="text-gray-500 text-sm">Quotations Lost</p>
              <p className="text-xl font-semibold">17</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
          <div className="flex items-center gap-3">
            <FiUsers className="text-purple-500 text-3xl" />
            <div>
              <p className="text-gray-500 text-sm">Total Clients</p>
              <p className="text-xl font-semibold">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center border rounded-lg px-3 py-2 border-gray-300 shadow-sm bg-white flex-grow hover:scale-101 transition-all duration-300">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search clients..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 border-gray-300 py-[11px] shadow-sm bg-white text-gray-600 cursor-pointer hover:scale-107 transition-all duration-300"
        >
          <option value="">All Cities</option>
          <option value="Goa">Goa</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
        </select>
      </div>

      {/* Client Table */}
      <div className="overflow-x-auto mt-4">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-500 text-sm uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Client Name</th>
                <th className="px-6 py-4 text-left font-semibold">City</th>
                <th className="px-6 py-4 text-left font-semibold">Quotations</th>
                <th className="px-6 py-4 text-left font-semibold">Won</th>
                <th className="px-6 py-4 text-left font-semibold">Lost</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              {filteredClients.map((c, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-none border-gray-100 hover:bg-blue-50 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1"
                >
                  <td className="px-6 py-5 whitespace-pre-line">{c.name}</td>
                  <td className="px-6 py-5 whitespace-pre-line">{c.city}</td>
                  <td className="px-6 py-5 whitespace-pre-line">{c.quotations}</td>
                  <td className="px-6 py-5 whitespace-pre-line">{c.won}</td>
                  <td className="px-6 py-5 whitespace-pre-line">{c.lost}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button className="text-blue-600 hover:text-blue-800 transition">
                        <FiEdit />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
