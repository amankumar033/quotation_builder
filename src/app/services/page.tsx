"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiDownload, FiHome, FiTruck, FiCoffee, FiActivity } from "react-icons/fi";
import { useRouter } from "next/navigation";
import type { Hotel, Transport, Meal, Activity, RoomType } from "@/types/interfaces";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useToast } from "../components/Toast";

// Extended interfaces to handle API data that might have additional properties
interface ApiHotel extends Hotel {
  meals?: any[];
  activities?: any[];
}

interface ApiTransport extends Transport {
  vehicleModel?: string;
  ac?: boolean;
  driverName?: string;
}

interface ApiMeal extends Meal {
  name: string;
  category: string;
  hotelId: string;
  vegOption: boolean;
  nonVegOption: boolean;
  hotelName?: string; // Added for hotel name display
}

interface ApiActivity extends Activity {
  hotelId?: string;
  hotelName?: string; // Added for hotel name display
}

export default function ServicesLibraryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"hotels" | "transports" | "meals" | "activities">("hotels");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const { success, error, info, warning } = useToast();

  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  // Data states with proper typing
  const [hotels, setHotels] = useState<ApiHotel[]>([]);
  const [transports, setTransports] = useState<ApiTransport[]>([]);
  const [meals, setMeals] = useState<ApiMeal[]>([]);
  const [activities, setActivities] = useState<ApiActivity[]>([]);

  // Function to get hotel name by ID
  const getHotelNameById = (hotelId: string | null | undefined): string => {
    if (!hotelId) return "Standalone";
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.name : "Unknown Hotel";
  };

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

        // Cast the API data to our extended interfaces
        const hotelsData = (hotelsRes.data || []) as ApiHotel[];
        const transportsData = (transportsRes.data || []) as ApiTransport[];
        const mealsData = (mealsRes.data || []) as ApiMeal[];
        const activitiesData = (activitiesRes.data || []) as ApiActivity[];

        // Set hotels first to ensure hotel names are available
        setHotels(hotelsData);
        setTransports(transportsData);
        
        // Enhance meals with hotel names
        const enhancedMeals = mealsData.map(meal => ({
          ...meal,
          hotelName: meal.hotelId ? getHotelNameById(meal.hotelId) : "Standalone"
        }));
        setMeals(enhancedMeals);

        // Enhance activities with hotel names
        const enhancedActivities = activitiesData.map(activity => ({
          ...activity,
          hotelName: activity.hotelId ? getHotelNameById(activity.hotelId) : "Standalone"
        }));
        setActivities(enhancedActivities);
      } catch (err) {
        console.log("Table Rendering Error:", err);
        error("Error", "Failed to load data from the database");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update hotel names when hotels data changes
  useEffect(() => {
    if (hotels.length > 0) {
      // Update meal hotel names
      setMeals(prevMeals => 
        prevMeals.map(meal => ({
          ...meal,
          hotelName: meal.hotelId ? getHotelNameById(meal.hotelId) : "Standalone"
        }))
      );

      // Update activity hotel names
      setActivities(prevActivities => 
        prevActivities.map(activity => ({
          ...activity,
          hotelName: activity.hotelId ? getHotelNameById(activity.hotelId) : "Standalone"
        }))
      );
    }
  }, [hotels]);

  // Generic delete function
  const handleDelete = async (type: "hotels" | "transports" | "meals" | "activities", id: string) => {
    try {
      setLoadingDeleteId(id);
      const response = await fetch(`/api/${type}/${id}`, { method: "DELETE" });
    
      const data = await response.json();
      if (data.success) {
        console.log(`${type.slice(0, -1)} deleted:`, data);
        const singularType = type.slice(0, -1);
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
        const singularType = type.slice(0, -1);
        const capitalizedType = singularType.charAt(0).toUpperCase() + singularType.slice(1);
        error(`Failed`,`Failed to Delete ${capitalizedType}`);
        console.error(`Failed to delete ${type}:`, data.error);
      }
    } catch (err) {
      const singularType = type.slice(0, -1);
      const capitalizedType = singularType.charAt(0).toUpperCase() + singularType.slice(1);
      error(`Failed`,`Failed to Delete ${capitalizedType}`);
    } finally {
      setLoadingDeleteId(null);
    }
  };

  // Handle edit - Fixed path names
  const handleEdit = (rowId: string) => {
    setLoadingEditId(rowId);
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

  // Filtered data with safe property access
  const filteredHotels = hotels.filter(h =>
    (h.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (h.city?.toLowerCase() || "").includes(search.toLowerCase())
  ).filter(h => {
    if (!filter) return true;
    if (filter === "3 Star") return h.starCategory === 3;
    if (filter === "4 Star") return h.starCategory === 4;
    if (filter === "5 Star") return h.starCategory === 5;
    if (filter === "With Activities") {
      // Check if activities exist and are associated with this hotel
      return activities.some(activity => activity.hotelId === h.id);
    }
    if (filter === "With Meals") {
      // Check if meals exist and are associated with this hotel
      return meals.some(meal => meal.hotelId === h.id);
    }
    return true;
  });

  const filteredTransports = transports.filter(t =>
    ((t.vehicleType?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (t.vehicleModel?.toLowerCase() || "").includes(search.toLowerCase()))
  ).filter(t => {
    if (!filter) return true;
    if (filter === "SUV") return (t.vehicleType?.toLowerCase() || "") === "suv";
    if (filter === "Bus") return (t.vehicleType?.toLowerCase() || "") === "bus";
    if (filter === "Tempo Traveller") return (t.vehicleType?.toLowerCase() || "") === "tempo traveller";
    if (filter === "AC") return t.ac === true;
    if (filter === "Non-AC") return t.ac === false;
    return true;
  });

  const filteredMeals = meals.filter(m =>
    (m.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (m.type?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (m.hotelName?.toLowerCase() || "").includes(search.toLowerCase())
  ).filter(m => {
    if (!filter) return true;
    if (filter === "Veg") return m.vegOption === true;
    if (filter === "Non-Veg") return m.nonVegOption === true;
    if (filter === "Breakfast") return (m.type?.toLowerCase() || "") === "breakfast";
    if (filter === "Lunch") return (m.type?.toLowerCase() || "") === "lunch";
    if (filter === "Dinner") return (m.type?.toLowerCase() || "") === "dinner";
    return true;
  });

  const filteredActivities = activities.filter(a =>
    (a.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (a.description?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (a.hotelName?.toLowerCase() || "").includes(search.toLowerCase())
  ).filter(a => {
    if (!filter) return true;
    const duration = parseInt(a.duration ?? "0");
    if (filter === "Less than 1h") return duration < 1;
    if (filter === "1-3h") return duration >= 1 && duration <= 3;
    if (filter === "More than 3h") return duration > 3;
    if (filter === "With Hotel") return a.hotelId && a.hotelId !== "";
    if (filter === "Standalone") return !a.hotelId || a.hotelId === "";
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
            headers={["Hotel Name", "City", "Category", "Inclusions", "Room Types", "Price/Night", "Actions"]}
            rows={filteredHotels.map(h => {
              // Parse inclusions if it's a string (from database)
              const inclusionsArray = h.inclusions 
                ? (typeof h.inclusions === 'string' ? JSON.parse(h.inclusions) : h.inclusions) 
                : [];
              
              // Ensure roomTypes is properly handled
              const roomTypes = Array.isArray(h.roomTypes) ? h.roomTypes : [];
              
              // Get minimum price from room types
              const minPrice = roomTypes.length > 0 
                ? Math.min(...roomTypes.map(r => Number(r.price)))
                : "N/A";
              
              return [
                h.name,
                h.city,
                `${h.starCategory} ⭐`,
                Array.isArray(inclusionsArray) ? inclusionsArray.slice(0, 2).join(", ") + (inclusionsArray.length > 2 ? "..." : "") : "N/A",
                roomTypes.length > 0 ? roomTypes.map(r => r.type).join(", ").substring(0, 30) + (roomTypes.map(r => r.type).join(", ").length > 30 ? "..." : "") : "N/A",
                minPrice !== "N/A" ? `₹${minPrice}` : "N/A",
                "actions",
                h.id,
              ];
            })}
          />
        );
      case "transports":
        return (
          <Table
            headers={["Vehicle", "Model", "Capacity", "AC", "Price Per Day", "Price Per Km", "Driver", "Actions"]}
            rows={filteredTransports.map(t => [
              t.vehicleType,
              t.vehicleModel || "N/A",
              t.maxCapacity ? t.maxCapacity.toString() : "N/A",
              t.ac !== undefined ? (t.ac ? "Yes" : "No") : "N/A",
              t.perDay && t.perDay > 0 ? `₹${t.perDay}` : "N/A",
              t.perKm && t.perKm > 0 ? `₹${t.perKm}` : "N/A",
              t.driverName || "N/A",
              "actions",
              t.id,
            ])}
          />
        );
      case "meals":
        return (
          <Table
            headers={["Meal Name", "Type", "Category", "Hotel", "Price", "Veg", "Non-Veg", "Actions"]}
            rows={filteredMeals.map(m => [
              m.name || "Unnamed Meal",
              m.type || "N/A",
              m.category === 'veg' ? 'Vegetarian' : m.category === 'non-veg' ? 'Non-Vegetarian' : 'N/A',
              m.hotelName || "Standalone",
              m.price ? `₹${m.price}` : "N/A",
              m.vegOption ? "Yes" : "No",
              m.nonVegOption ? "Yes" : "No",
              "actions",
              m.id,
            ])}
          />
        );
      case "activities":
        return (
          <Table
            headers={["Activity", "Duration", "Hotel", "Price", "Actions"]}
            rows={filteredActivities.map(a => [
              a.name || "Unnamed Activity",
              a.duration || "N/A",
              a.hotelName || "Standalone",
              a.price ? `₹${a.price}` : "N/A",
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
                  className="px-4 py-4 text-left font-semibold"
                  style={{ width: `${100 / headers.length}%` }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-500">
            {rows.map((row, rowIdx) => {
              const rowId = row[row.length - 1];
              const cells = row.slice(0, -1);
              const isThisRowEditing = loadingEditId === rowId;
              const isThisRowDeleting = loadingDeleteId === rowId;
              return (
                <tr
                  key={rowId}
                  className="border-b last:border-none border-gray-100 hover:bg-blue-50 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1"
                >
                  {cells.map((cell, i) => {
                    if (cell === "actions") {
                      return (
                        <td key={i} className="px-4 py-5">
                          <div className="flex items-center gap-3">
                            <button
                              aria-label="edit"
                              className="text-blue-600 hover:text-blue-800 transition"
                              onClick={() => handleEdit(rowId)}
                              disabled={isThisRowEditing || isThisRowDeleting}
                            >
                              {isThisRowEditing ? <LoadingSpinner size={15}/> : <FiEdit />}
                            </button>
                            <button
                              aria-label="delete"
                              className="text-red-500 hover:text-red-700 transition"
                              onClick={() => handleDelete(activeTab, rowId)}
                              disabled={isThisRowEditing || isThisRowDeleting}
                            >
                              {isThisRowDeleting ? <LoadingSpinner size={15}/> : <FiTrash2 />}
                            </button>
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td key={i} className="px-4 py-5 whitespace-pre-line text-sm">
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
                // Fixed path names for Add buttons too
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
              placeholder={
                activeTab === "hotels" ? "Search by hotel name, city..." :
                activeTab === "transports" ? "Search by vehicle type, model..." :
                activeTab === "meals" ? "Search by meal name, type, hotel..." :
                "Search by activity name, hotel..."
              }
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
                <option value="">All Hotels</option>
                <option value="3 Star">3 Star</option>
                <option value="4 Star">4 Star</option>
                <option value="5 Star">5 Star</option>
                <option value="With Activities">With Activities</option>
                <option value="With Meals">With Meals</option>
              </>
            ) : activeTab === "transports" ? (
              <>
                <option value="">All Vehicles</option>
                <option value="SUV">SUV</option>
                <option value="Bus">Bus</option>
                <option value="Tempo Traveller">Tempo Traveller</option>
                <option value="AC">AC Vehicles</option>
                <option value="Non-AC">Non-AC Vehicles</option>
              </>
            ) : activeTab === "meals" ? (
              <>
                <option value="">All Meals</option>
                <option value="Veg">Vegetarian</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </>
            ) : (
              <>
                <option value="">All Activities</option>
                <option value="Less than 1h">Less than 1h</option>
                <option value="1-3h">1-3h</option>
                <option value="More than 3h">More than 3h</option>
                <option value="With Hotel">With Hotel</option>
                <option value="Standalone">Standalone</option>
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
            width: "25%",
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
          { key: "transports", label: "Transports", icon: <FiTruck /> },
          { key: "meals", label: "Meals", icon: <FiCoffee /> },
          { key: "activities", label: "Activities", icon: <FiActivity /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onMouseEnter={() => setActiveTab(tab.key as any)}
          
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 
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