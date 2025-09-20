"use client";
import { useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiDownload, FiHome, FiTruck, FiCoffee, FiActivity} from "react-icons/fi";

interface Hotel {
  id: number;
  name: string;
  city: string;
  category: string;
  roomTypes: string[];
  pricePerNight: number;
}

interface Transfer {
  id: number;
  vehicleType: string;
  pricingModel: string;
  maxCapacity: number;
  price: number;
}

interface Meal {
  id: number;
  mealType: string;
  option: string;
  pricePerPerson: number;
  items?: string[];
}

interface Activity {
  id: number;
  name: string;
  duration: string;
  pricePerPerson: number;
}

export default function ServicesLibraryPage() {
  const [activeTab, setActiveTab] = useState<
    "hotels" | "transfers" | "meals" | "activities"
  >("hotels");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");


  // Dummy data
  const hotels: Hotel[] = [
    {
      id: 1,
      name: "Grand Palace",
      city: "Goa",
      category: "5 Star",
      roomTypes: ["Deluxe", "Suite"],
      pricePerNight: 12000,
    },
    {
      id: 2,
      name: "Sea Breeze",
      city: "Mumbai",
      category: "4 Star",
      roomTypes: ["Standard", "Deluxe"],
      pricePerNight: 8000,
    },
    {
      id: 3,
      name: "Mountain View",
      city: "Manali",
      category: "3 Star",
      roomTypes: ["Standard"],
      pricePerNight: 5000,
    },
  ];

  const transfers: Transfer[] = [
    { id: 1, vehicleType: "SUV", pricingModel: "Per Day", maxCapacity: 6, price: 4000 },
    { id: 2, vehicleType: "Bus", pricingModel: "Per Km", maxCapacity: 40, price: 50 },
  ];

  const meals: Meal[] = [
    {
      id: 1,
      mealType: "Breakfast",
      option: "Veg",
      pricePerPerson: 500,
      items: ["Idli", "Dosa", "Sambar"],
    },
    {
      id: 2,
      mealType: "Dinner",
      option: "Non-Veg",
      pricePerPerson: 800,
      items: ["Chicken Curry", "Rice", "Salad"],
    },
  ];

  const activities: Activity[] = [
    { id: 1, name: "Snorkeling", duration: "2h", pricePerPerson: 1500 },
    { id: 2, name: "City Tour", duration: "4h", pricePerPerson: 1200 },
  ];

  // Filters
 const filteredHotels = hotels
  .filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase())
  )
 .filter((a) => {
    if (!filter) return true;
    if (filter === "3 Star") return a.category === "3 Star";
    if (filter === "4 Star") return a.category === "4 Star";
    if (filter === "5 Star") return a.category === "5 Star";
    return true;
  });
const filteredTransfers = transfers
  .filter(
    (t) =>
      t.vehicleType.toLowerCase().includes(search.toLowerCase()) ||
      t.pricingModel.toLowerCase().includes(search.toLowerCase())
  )
 .filter((a) => {
    if (!filter) return true;
    if (filter === "Per Day") return a.pricingModel === "Per Day";
    if (filter === "per Km") return a.pricingModel === "per Km";
    return true;
  });
const filteredMeals = meals
  .filter(
    (m) =>
      m.mealType.toLowerCase().includes(search.toLowerCase()) ||
      m.option.toLowerCase().includes(search.toLowerCase())
  )
  .filter((a) => {
    if (!filter) return true;
    if (filter === "Veg") return a.items?.some(item => item.toLowerCase().includes("veg"));
    if (filter === "Non Veg") return a.items?.some(item => item.toLowerCase().includes("non veg"));
    return true;
  });

const filteredActivities = activities
  .filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.duration.toLowerCase().includes(search.toLowerCase())
  )
  .filter((a) => {
    if (!filter) return true;
    if (filter === "Less than 1h") return parseInt(a.duration) < 1;
    if (filter === "1-3h") return parseInt(a.duration) >= 1 && parseInt(a.duration) <= 3;
    if (filter === "More than 3h") return parseInt(a.duration) > 3;
    return true;
  });


  const renderTable = () => {
    switch (activeTab) {
      case "hotels":
        return (
          <Table
            headers={[
              "Hotel Name",
              "City",
              "Category",
              "Room Types",
              "Price/Night",
              "Actions",
            ]}
            rows={filteredHotels.map((h) => [
              h.name,
              h.city,
              h.category,
              h.roomTypes.join(", "),
              `₹${h.pricePerNight}`,
              "actions",
            ])}
          />
        );
      case "transfers":
        return (
          <Table
            headers={["Vehicle", "Pricing", "Capacity", "Price", "Actions"]}
            rows={filteredTransfers.map((t) => [
              t.vehicleType,
              t.pricingModel,
              t.maxCapacity.toString(),
              `₹${t.price}`,
              "actions",
            ])}
          />
        );
      case "meals":
        return (
          <Table
            headers={["Meal", "Option", "Price", "Items", "Actions"]}
            rows={filteredMeals.map((m) => [
              m.mealType,
              m.option,
              `₹${m.pricePerPerson}`,
              m.items?.join(", ") || "N/A",
              "actions",
            ])}
          />
        );
      case "activities":
        return (
          <Table
            headers={["Activity", "Duration", "Price", "Actions"]}
            rows={filteredActivities.map((a) => [
              a.name,
              a.duration,
              `₹${a.pricePerPerson}`,
              "actions",
            ])}
          />
        );
    }
  };

  const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full border-collapse">
          {/* Table Header */}
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-500 text-sm uppercase tracking-wide">
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-gray-500">
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b last:border-none border-gray-100 hover:bg-blue-50 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1"
              >
                {row.map((cell, i) => {
                  if (cell === "actions") {
                    return (
                      <td key={i} className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            aria-label="edit"
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <FiEdit />
                          </button>
                          <button
                            aria-label="delete"
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={i} className="px-6 py-5 whitespace-pre-line">
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

  return (
   <div className="p-6 space-y-6">
  {/* Floating Card for Header, Search & Filter */}
  <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1">
    {/* Row 1: Heading + Buttons */}
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Services Management
      </h1>
      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 hover:scale-107 transition-all duration-300 ">
          <FiDownload /> Export
        </button>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 hover:scale-107 transition-all duration-300">
          <FiPlus /> Add Service
        </button>
      </div>
    </div>

    {/* Row 2: Search + Filter */}
    <div className="flex justify-between items-center gap-4 mt-4">
      {/* Search */}
      <div className="flex items-center border rounded-lg px-3 py-2 border-gray-300 shadow-sm bg-white flex-grow hover:scale-101 transition-all duration-300">
        <FiSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by name, category, or type..."
          className="outline-none w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* Filter */}
     <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="border rounded-lg px-3 border-gray-300 py-[11px] shadow-sm bg-white text-gray-600 cursor-pointer hover:scale-107 transition-all duration-300"
>
  {activeTab === "hotels" ? (
    <>
      <option value="">All Star</option>
      <option value="3 Star">3 Star</option>
      <option value="4 Star">4 Star</option>
      <option value="5 Star">5 Star</option>
    </>
  ) : activeTab === "transfers" ? (
    <>
      <option value="">All Pricing</option>
      <option value="Per Day">Per Day</option>
      <option value="Per Km">Per Km</option>
    </>
  ) : activeTab === "meals" ? (
    <>
      <option value="">All Options</option>
      <option value="Veg">Veg</option>
      <option value="Non-Veg">Non-Veg</option>
    </>
  ) : (
    <>
      <option value="">All Durations</option>
      <option value="Less than 1h">Less than 1h</option>
      <option value="1-3h">1-3h</option>
      <option value="More than 3h">More than 3h</option>
    </>
  )}
</select>

    </div>
  </div>

{/* Tabs with Slider */}
<div className="relative flex bg-gray-100 rounded-xl p-1 mt-4 w-fit">
  {/* Slider background */}
  <div
    className={`absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 shadow-md transition-all duration-300`}
    style={{
      width: "25%", // since we have 4 tabs
      left:
        activeTab === "hotels"
          ? "0%"
          : activeTab === "transfers"
          ? "25%"
          : activeTab === "meals"
          ? "50%"
          : "75%",
    }}
  />

  {/* Tabs */}
  {[
    { key: "hotels", label: "Hotels", icon: <FiHome /> },
    { key: "transfers", label: "Transfers", icon: <FiTruck /> },
    { key: "meals", label: "Meals", icon: <FiCoffee /> },
    { key: "activities", label: "Activities", icon: <FiActivity /> },
  ].map((tab) => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key as any)}
       onMouseEnter={() => setActiveTab(tab.key as any) }
  // onMouseLeave={() => setActiveTab(tab.key as any)}
      className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors duration-300 
        ${
          activeTab === tab.key
            ? "text-white"
            : "text-gray-600 hover:text-blue-600"
        }`}
    >
      {tab.icon}
      {tab.label}
    </button>
  ))}
</div>


  {/* Table */}
  {renderTable()}
</div>

  );
}
