"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiDownload, FiHome, FiTruck, FiCoffee, FiActivity } from "react-icons/fi";
import { useRouter } from "next/navigation";
import type { Hotel, Transport, Meal, Activity } from "@/types/interfaces";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useToast } from "../components/Toast";
export default function ServicesLibraryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"hotels" | "transports" | "meals" | "activities">("hotels");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
   const { success, error, info, warning } = useToast();
  

  //Loading State
  const [isLoading, setIsLoading] = useState(true);
const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  // Data states
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Fetch data
  useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [hotelsRes, transportsRes, mealsRes, activitiesRes] =
        await Promise.all([
          fetch("/api/hotels").then((res) => res.json()),
          fetch("/api/transports").then((res) => res.json()),
          fetch("/api/meals").then((res) => res.json()),
          fetch("/api/activities").then((res) => res.json()),
        ]);

      setHotels(hotelsRes.data || []);
      setTransports(transportsRes.data || []);
      setMeals(mealsRes.data || []);
      setActivities(activitiesRes.data || []);
    } catch (err) {
      console.log("Table Rendering Error:", err);
    } finally {
      setIsLoading(false); // ✅ runs only after all data is loaded
    }
  };

  fetchData();
}, []);


  // Generic delete function
  const handleDelete = async (type: "hotels" | "transports" | "meals" | "activities", id: string) => {
    try {
      setLoadingDeleteId(id);
      const response = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
    
      const data = await response.json();
      if (data.success) {
        console.log(`${type.slice(0, -1)} deleted:`, data);
        // Capitalize first letter and make singular
      const singularType = type.slice(0, -1); // remove last 's'
      const capitalizedType = singularType.charAt(0).toUpperCase() + singularType.slice(1);
      success(`${capitalizedType} deleted Successfully`,`Selected ${capitalizedType} deleted successfully`);

        switch (type) {
          case "hotels":
            setHotels(prev => prev.filter(item => item.id !== id));
            break;
          case "transports":
            setTransports(prev => prev.filter(item => item.id !== id));
            break;
          case "meals":
            setMeals(prev => prev.filter(item => item.id !== id));
            break;
          case "activities":
            setActivities(prev => prev.filter(item => item.id !== id));
            break;
        }
      } else {
          const singularType = type.slice(0, -1); // remove last 's'
      const capitalizedType = singularType.charAt(0).toUpperCase() + singularType.slice(1);
        error(`Failed`,`Failed to Delete${capitalizedType}  `);
        console.error(`Failed to delete ${type}:`, data.error);
      }
    } catch (err) {
      const singularType = type.slice(0, -1); // remove last 's'
      const capitalizedType = singularType.charAt(0).toUpperCase() + singularType.slice(1);
        error(`Failed`,`Failed to Delete${capitalizedType}  `);
      
    }
    finally{
       setLoadingDeleteId(null);
    }
  };
  
  //handle edit
  const handleEdit = (rowId: string) => {
  setLoadingEditId(rowId); // Set THIS specific row ID
  const path =
                 activeTab === "hotels"
                 ? "/hotel"
                  : activeTab === "transports"
                 ? "/transport"
                 : activeTab === "meals"
                 ? "/meal"
                 : "/activity";

  router.push(`${path}?id=${rowId}`);
};


  // Filtered data
  const filteredHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  ).filter(h => {
    if (!filter) return true;
    if (filter === "3 Star") return h.starCategory === 3;
    if (filter === "4 Star") return h.starCategory === 4;
    if (filter === "5 Star") return h.starCategory === 5;
    return true;
  });

  const filteredTransports = transports.filter(t =>
    t.vehicleType.toLowerCase().includes(search.toLowerCase())
  ).filter(t => {
    if (!filter) return true;
    if (filter.toLowerCase() === "suv") return t.vehicleType.toLowerCase() === "suv";
    if (filter.toLowerCase() === "bus") return t.vehicleType.toLowerCase() === "bus";
    if (filter.toLowerCase() === "tempo traveller") return t.vehicleType.toLowerCase() === "tempo traveller";
    return true;
  });

  const filteredMeals = meals.filter(m =>
    m.type.toLowerCase().includes(search.toLowerCase())
  ).filter(m => {
    if (!filter) return true;
    if (filter === "Veg") return m.vegOption;
    if (filter === "Non-Veg") return m.nonVegOption;
    return true;
  });

  const filteredActivities = activities.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  ).filter(a => {
    if (!filter) return true;
    const duration = parseInt(a.duration ?? "0");
    if (filter === "Less than 1h") return duration < 1;
    if (filter === "1-3h") return duration >= 1 && duration <= 3;
    if (filter === "More than 3h") return duration > 3;
    return true;
  });


  
  // Check if current tab has data
  const currentData = {
    hotels: filteredHotels,
    transports: filteredTransports,
    meals: filteredMeals,
    activities: filteredActivities
  }[activeTab];


  // Render table data dynamically
  const renderTable = () => {
        if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <LoadingSpinner size={48} color="#3b82f6" />
            <p className="mt-4 text-gray-600">Loading {activeTab}...</p>
          </div>
        </div>
      );
    }

    if (currentData.length === 0) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="text-6xl text-gray-300 mb-4">🏨</div>
            <p className="text-gray-500 text-lg">No {activeTab} Found</p>
            <p className="text-gray-400 text-sm mt-2">
              {search || filter ? "Try adjusting your search or filter" : `Add your first ${activeTab.slice(0, -1)} to get started`}
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "hotels":
        return (
          <Table
            headers={["Hotel Name", "City", "Category", "Room Types", "Price/Night", "Actions"]}
            rows={filteredHotels.map(h => [
              h.name,
              h.city,
              `${h.starCategory} ⭐`,
              h.roomTypes.map(r => r.type).join(", "),
              `₹${Math.min(...h.roomTypes.map(r => Number(r.price)))}`,
              "actions",
              h.id, // include id
            ])}
          />
        );
      case "transports":
        return (
          <Table
            headers={["Vehicle", "Capacity", "Price Per Day", "Price Per Km", "Actions"]}
            rows={filteredTransports.map(t => [
              t.vehicleType,
              t.maxCapacity.toString(),
              t.perDay > 0 ? `₹${t.perDay}` : "N/A",
              t.perKm > 0 ? `₹${t.perKm}` : "N/A",
              "actions",
              t.id,
            ])}
          />
        );
      case "meals":
        return (
          <Table
            headers={["Meal", "Option", "Price", "Actions"]}
            rows={filteredMeals.map(m => [
              m.type,
              m.vegOption ? "Veg" : m.nonVegOption ? "Non-Veg" : "N/A",
              `₹${m.price}`,
              "actions",
              m.id,
            ])}
          />
        );
      case "activities":
        return (
          <Table
            headers={["Activity", "Duration", "Price", "Actions"]}
            rows={filteredActivities.map(a => [
              a.name,
              `${a.duration}`,
              `₹${a.price}`,
              "actions",
              a.id,
            ])}
          />
        );
    }
  };

  // Generic Table component
 const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto mt-4">
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <table className="min-w-full w-full table-fixed border-collapse">
        <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-500 text-sm uppercase tracking-wide">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-6 py-4 text-left font-semibold w-[calc(100%/6)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-500">
          {rows.map((row, rowIdx) => {
            const rowId = row[row.length - 1]; // last item is id
            const cells = row.slice(0, -1); // remove id from display
            const isThisRowEditing = loadingEditId === rowId;    // Check if THIS row is editing
            const isThisRowDeleting = loadingDeleteId === rowId; // Check if THIS row is deleting
            return (
              <tr
                key={rowId}
                className="border-b last:border-none border-gray-100 hover:bg-blue-50 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1"
              >
                {cells.map((cell, i) => {
                  if (cell === "actions") {
                    return (
                      <td key={i} className="px-6 py-5 w-[calc(100%/6)]">
                        <div className="flex items-center  gap-3">
                          {/* Edit Button */}
                          <button
                            aria-label="edit"
                            className="text-blue-600 hover:text-blue-800 transition"
                            onClick={() => handleEdit(rowId)}
                            disabled={isThisRowEditing || isThisRowDeleting} // Prevent clicks while loading
                            >
                           {isThisRowEditing ? <LoadingSpinner size={15}/> : <FiEdit />}

                          </button>

                          {/* Delete Button */}
                          <button
                            aria-label="delete"
                            className="text-red-500 hover:text-red-700 transition"
                            onClick={() => handleDelete(activeTab, rowId)}
                             disabled={isThisRowEditing || isThisRowDeleting} // Prevent clicks while loading
                             >
                            {isThisRowDeleting ? <LoadingSpinner  size={15}/> : <FiTrash2 />}
                          </button>
                        </div>
                      </td>
                    );
                  }
                  return (
                    <td key={i} className="px-6 py-5 w-[calc(100%/6)] whitespace-pre-line">
                      {cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

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
    <button
      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 hover:scale-105 transition-all duration-300"
    >
      <FiDownload /> Export
    </button>

    <button
      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 hover:scale-105 transition-all duration-300"
      onClick={() => {
        // Redirect based on active tab
        if (activeTab === "hotels") router.push("/hotel");
        else if (activeTab === "transports") router.push("/transport");
        else if (activeTab === "meals") router.push("/meal");
        else if (activeTab === "activities") router.push("/activity");
      }}
    >
      <FiPlus />{" "}
      {activeTab === "hotels"
        ? "Add Hotel"
        : activeTab === "transports"
        ? "Add Transport"
        : activeTab === "meals"
        ? "Add Meal"
        : "Add Activity"}
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
  className="border rounded-lg px-3 border-gray-300 py-[11px] shadow-sm bg-white text-gray-600 cursor-pointer hover:scale-105 transition-all duration-300"
>
  {activeTab === "hotels" ? (
    <>
      <option value="">All Star</option>
      <option value="3 Star">3 Star</option>
      <option value="4 Star">4 Star</option>
      <option value="5 Star">5 Star</option>
    </>
  ) : activeTab === "transports" ? (
    <>
      <option value="">All Type</option>
      <option value="SUV">Suv</option>
      <option value="BUS">Bus</option>
      <option value="TEMPO TRAVELLER">Tempo Traveller</option>
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
          : activeTab === "transports"
          ? "25%"
          : activeTab === "meals"
          ? "50%"
          : "75%",
    }}
  />

  {/* Tabs */}
  {[
    { key: "hotels", label: "Hotels", icon: <FiHome /> },
    { key: "transports", label: "transports", icon: <FiTruck /> },
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
