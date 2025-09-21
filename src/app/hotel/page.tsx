"use client";
import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiDownload, FiHome, FiTruck, FiCoffee, FiActivity } from "react-icons/fi";

export default function ServicesLibraryPage() {
  const [activeTab, setActiveTab] = useState<"hotels" | "transfers" | "meals" | "activities">("hotels");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // States for DB data
  const [hotels, setHotels] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // Fetch all data on load
  useEffect(() => {
    fetch("/api/hotels").then(res => res.json()).then(data => setHotels(data.data || []));
    fetch("/api/transfers").then(res => res.json()).then(data => setTransfers(data.data || []));
    fetch("/api/meals").then(res => res.json()).then(data => setMeals(data.data || []));
    fetch("/api/activities").then(res => res.json()).then(data => setActivities(data.data || []));
  }, []);

  // 🔹 Filtering (adjusted for your schema)
  const filteredHotels = hotels
    .filter((h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase())
    )
    .filter((a) => {
      if (!filter) return true;
      return a.starCategory === parseInt(filter);
    });

  const filteredTransfers = transfers
    .filter((t) =>
      t.vehicleType.toLowerCase().includes(search.toLowerCase())
    )
    .filter((a) => {
      if (!filter) return true;
      if (filter === "Per Day") return a.perDay > 0;
      if (filter === "Per Km") return a.perKm > 0;
      return true;
    });

  const filteredMeals = meals.filter((m) =>
    m.type.toLowerCase().includes(search.toLowerCase())
  );

  const filteredActivities = activities.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Table renderer (schema-based headers)
  const renderTable = () => {
    switch (activeTab) {
      case "hotels":
        return (
          <Table
            headers={["Hotel Name", "City", "Star Category", "Room Types", "Price/Night", "Actions"]}
            rows={filteredHotels.map((h) => [
              h.name,
              h.city,
              `${h.starCategory} Star`,
              h.roomTypes.map((r: any) => `${r.type} (₹${r.price})`).join(", "),
              `₹${h.roomTypes.length ? h.roomTypes[0].price : "-"}`,
              "actions",
            ])}
          />
        );
      case "transfers":
        return (
          <Table
            headers={["Vehicle", "Per Day", "Per Km", "Capacity", "Actions"]}
            rows={filteredTransfers.map((t) => [
              t.vehicleType,
              `₹${t.perDay}`,
              `₹${t.perKm}`,
              t.maxCapacity.toString(),
              "actions",
            ])}
          />
        );
      case "meals":
        return (
          <Table
            headers={["Meal Type", "Veg", "Non-Veg", "Price", "Actions"]}
            rows={filteredMeals.map((m) => [
              m.type,
              m.vegOption ? "Yes" : "No",
              m.nonVegOption ? "Yes" : "No",
              `₹${m.price}`,
              "actions",
            ])}
          />
        );
      case "activities":
        return (
          <Table
            headers={["Activity", "Description", "Duration", "Price", "Actions"]}
            rows={filteredActivities.map((a) => [
              a.name,
              a.description || "N/A",
              a.duration || "N/A",
              `₹${a.price}`,
              "actions",
            ])}
          />
        );
    }
  };

  // Table component (same as before)
  const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
    <div className="overflow-x-auto mt-4">
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-500 text-sm uppercase tracking-wide">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-4 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-500">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b last:border-none border-gray-100 hover:bg-blue-50 transition-all">
                {row.map((cell, i) =>
                  cell === "actions" ? (
                    <td key={i} className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 hover:text-blue-800"><FiEdit /></button>
                        <button className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                      </div>
                    </td>
                  ) : (
                    <td key={i} className="px-6 py-5 whitespace-pre-line">{cell}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* header + filter/search UI (same as your code) */}
      {renderTable()}
    </div>
  );
}
