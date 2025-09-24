// components/QuotationBuilder/PackageSelectionStep.tsx
"use client";

import { QuotationData } from "../../quotation-builder/page";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner"

import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface PackageSelectionStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

interface Hotel {
  id: number;
  name: string;
  city: string;
  starCategory: number;
  price: number;
  photos: string[];
  inclusions: string[];
}

interface Transport {
  id: number;
  name: string;
  passengers: number;
  perDay: number;
  perKm: number;
  photos: string;
  maxCapacity: number;
  vehicleType: string;
}

interface Meal {
  id: number;
  type: string;
  price: number;
}

interface Activity {
  id: number;
  name: string;
  desc: string;
  price: number;
  photos: string;
}

interface DaySelection {
  day: number;
  selectedHotel: number | null;
  selectedMeals: number[];
  selectedTransport?: number | null; // optional
  selectedActivities: number[];
}

export default function PackageSelectionStep({
  data,
  updateData,
  nextStep,
  prevStep,
}: PackageSelectionStepProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [hotelSearch, setHotelSearch] = useState("");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<number | null>(null);
  
  const [isHotelLoading, setIsHotelLoading] = useState(false);
  const [isTransportLoading, setIsTransportLoading] = useState(false);
  const [isMealLoading, setIsMealLoading] = useState(false);
  const [isActivityLoading, setIsActivityLoading] = useState(false);

  // Day management
  const [activeDay, setActiveDay] = useState<number>(1);
  const [daySelections, setDaySelections] = useState<DaySelection[]>([
    { day: 1, selectedHotel: null, selectedMeals: [], selectedActivities: [] },
    { day: 2, selectedHotel: null, selectedMeals: [], selectedActivities: [] },
    { day: 3, selectedHotel: null, selectedMeals: [], selectedActivities: [] },
    { day: 4, selectedHotel: null, selectedMeals: [], selectedActivities: [] },
  ]);

  // Fetch data
  useEffect(() => {
    setIsActivityLoading(true);
    setIsHotelLoading(true);
    setIsMealLoading(true);
    setIsTransportLoading(true);

    fetch("/api/hotels")
      .then((res) => res.json())
      .then((res) => {
        const rawHotels = Array.isArray(res) ? res : res.data || [];
        const normalized = rawHotels.map((h: any) => ({
          ...h,
          photos: typeof h.photos === "string" ? JSON.parse(h.photos) : h.photos || [],
          inclusions: h.inclusions ? JSON.parse(h.inclusions) : [],
        }));
        console.log("Normalized hotels:", normalized);
        setHotels(normalized);
        setIsHotelLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch hotels:", err);
        setHotels([]);
        setIsHotelLoading(false);
      });

    fetch("/api/transports")
      .then((res) => res.json())
      .then((res) => {
        const raw = Array.isArray(res) ? res : res.data || [];
        const normalized = raw.map((t: any) => ({
          ...t,
          photos: typeof t.photos === "string" ? JSON.parse(t.photos)[0] : t.photos,
        }));
        console.log("Normalized transports:", normalized);
        setTransports(normalized);
        setIsTransportLoading(false);
      })
      .catch(() => {
        setTransports([]);
        setIsTransportLoading(false);
      });

    fetch("/api/meals")
      .then((res) => res.json())
      .then((result) => {
        setMeals(result.data || []);
        setIsMealLoading(false);
      })
      .catch(() => {
        setMeals([]);
        setIsMealLoading(false);
      });

    fetch("/api/activities")
      .then((res) => res.json())
      .then((result) => {
        setActivities(result.data || []);
        setIsActivityLoading(false);
      })
      .catch(() => {
        setActivities([]);
        setIsActivityLoading(false);
      });
  }, []);

  // Keep QuotationData updated
  useEffect(() => {
    updateData({
      selectedVehicle: selectedTransport ? String(selectedTransport) : null,
      // daySelections: daySelections.map(day => ({
      //   day: day.day,
      //   selectedHotel: day.selectedHotel ? String(day.selectedHotel) : null,
      //   selectedMealIds: day.selectedMeals.map(String),
      //   selectedActivityIds: day.selectedActivities.map(String)
      // }))
    });
  }, [daySelections, selectedTransport]);

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) &&
      (starFilter ? hotel.starCategory === starFilter : true)
  );

  const toggleDayAccordion = (day: number) => {
    setActiveDay(activeDay === day ? -1 : day);
  };

  const updateDaySelection = (dayNumber: number, updates: Partial<DaySelection>) => {
    setDaySelections(prev => prev.map(day => 
      day.day === dayNumber ? { ...day, ...updates } : day
    ));
  };

  const toggleMealSelection = (dayNumber: number, mealId: number | null) => {
    if (mealId === null) return;
    updateDaySelection(dayNumber, {
      selectedMeals: daySelections.find(d => d.day === dayNumber)?.selectedMeals.includes(mealId)
        ? daySelections.find(d => d.day === dayNumber)!.selectedMeals.filter(id => id !== mealId)
        : [...(daySelections.find(d => d.day === dayNumber)?.selectedMeals || []), mealId]
    });
  };

  const toggleActivitySelection = (dayNumber: number, activityId: number | null) => {
    if (activityId === null) return;
    updateDaySelection(dayNumber, {
      selectedActivities: daySelections.find(d => d.day === dayNumber)?.selectedActivities.includes(activityId)
        ? daySelections.find(d => d.day === dayNumber)!.selectedActivities.filter(id => id !== activityId)
        : [...(daySelections.find(d => d.day === dayNumber)?.selectedActivities || []), activityId]
    });
  };

  const selectHotelForDay = (dayNumber: number, hotelId: number | null) => {
    updateDaySelection(dayNumber, {
      selectedHotel: hotelId
    });
  };

  const getDayTheme = (day: number) => {
    const themes = [
      { bg: 'from-blue-400 to-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
      { bg: 'from-green-400 to-green-500', text: 'text-green-600', border: 'border-green-200' },
      { bg: 'from-purple-400 to-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
      { bg: 'from-orange-400 to-orange-500', text: 'text-orange-600', border: 'border-orange-200' }
    ];
    return themes[(day - 1) % themes.length];
  };

  return (
    <div className="space-y-8 px-6 min-h-screen bg-gray-50">
      

      {/* Day Accordions Section */}
      <section className="space-y-6">
        {daySelections.map((daySelection) => {
          const theme = getDayTheme(daySelection.day);
          const isActive = activeDay === daySelection.day;
          
          return (
            <div key={daySelection.day} className={`bg-white rounded-xl shadow-sm border ${theme.border} transition-all duration-300`}>
              {/* Accordion Header */}
              <div 
                className={`px-6 py-3 cursor-pointer rounded-t-xl ${isActive ? 'bg-gradient-to-r ' + theme.bg + ' text-white' : 'hover:bg-gray-50'}`}
                onClick={() => toggleDayAccordion(daySelection.day)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center mr-4 ${
                      isActive ? 'bg-white bg-opacity-20' : 'bg-gradient-to-r ' + theme.bg
                    }`}>
                      <span className={`text-xl font-bold ${isActive ? 'text-white' : 'text-white'}`}>
                         {daySelection.day}
                      </span>
                    </div>
                    <h3 className={`text-2xl font-semibold ${isActive ? 'text-white' : theme.text}`}>
                      Day {daySelection.day} Itinerary
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {daySelection.selectedHotel && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isActive ? 'bg-white text-gray-800' : 'bg-green-100 text-green-800'
                      }`}>
                        Hotel Selected
                      </span>
                    )}
                    {isActive ? (
                      <ChevronUp className="h-6 w-6" />
                    ) : (
                      <ChevronDown className="h-6 w-6" />
                    )}
                  </div>
                </div>
              </div>

              {/* Accordion Content */}
              {isActive && (
                <div className="p-6 space-y-8 animate-in fade-in duration-300">
                  {/* Hotels Section for this day */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-tr ${theme.bg} flex items-center justify-center mr-3`}>
                        <img src="/hotel.png" alt="Hotel" className="h-6 w-6" />
                      </div>
                      <h4 className={`text-xl font-semibold ${theme.text}`}>
                        Hotel Selection for Day {daySelection.day}
                      </h4>
                    </div>

                    {/* Search + Filter */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <input
                        type="text"
                        placeholder="Search hotels by name..."
                        value={hotelSearch}
                        onChange={(e) => setHotelSearch(e.target.value)}
                        className="w-full md:w-1/2 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Filter by rating:</span>
                        {[3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              setStarFilter(starFilter === star ? null : star)
                            }
                            className={`px-3 py-1 rounded-md border transition-all text-sm ${
                              starFilter === star
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
                            }`}
                          >
                            {star}
                            <span className="text-yellow-500 h-4">★</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hotel Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {isHotelLoading
                        ? Array.from({ length: 3 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col border rounded-xl border-gray-100 overflow-hidden animate-pulse"
                            >
                              <div className="h-48 bg-gray-200 w-full" />
                              <div className="p-4 space-y-2">
                                <div className="h-5 bg-gray-300 rounded w-3/4" />
                                <div className="h-4 bg-gray-300 rounded w-1/2" />
                                <div className="h-6 bg-gray-300 rounded w-full mt-3" />
                              </div>
                            </div>
                          ))
                        : filteredHotels.map((hotel) => (
                            <div
                              onClick={() => selectHotelForDay(daySelection.day, hotel.id)}
                              key={hotel.id}
                              className={`flex flex-col border rounded-xl overflow-hidden hover:transform hover:scale-105 cursor-pointer hover:transition-all duration-300 ease-out ${
                                daySelection.selectedHotel === hotel.id
                                  ? `border-${theme.text.split('-')[1]}-500 shadow-md hover:transform scale-105 transition-all duration-300 ease-out`
                                  : "border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              <div className="h-48 overflow-hidden">
                                <img
                                  src={hotel.photos[0] || ""}
                                  alt={hotel.name}
                                  className="w-full h-full object-cover hover:transform hover:scale-107 cursor-pointer hover:transition-all duration-300 ease-out"
                                />
                              </div>
                              <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-semibold text-xl text-gray-700">
                                      {hotel.name}
                                    </h4>
                                    <p className="text-lg text-gray-500 mt-2">{hotel.city}</p>
                                  </div>
                                  <div className="text-blue-600 font-bold">₹3000/night</div>
                                </div>
                                <div className="flex items-center mb-3">
                                  <span className="text-yellow-500 text-xl mr-1">
                                    {"★".repeat(hotel.starCategory)}
                                  </span>
                                  <span className="text-gray-300">
                                    {"★".repeat(5 - hotel.starCategory)}
                                  </span>
                                </div>
                                <div className="mb-4">
                                  <p className="text-gray-600">Inclusions:</p>
                                  {hotel.inclusions.map((inc, idx) => (
                                    <span key={idx} className="text-gray-500 bg-blue-100 px-2 ml-2 py-[2px] text-[12px]">
                                      {inc}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  onClick={() => selectHotelForDay(daySelection.day, hotel.id)}
                                  className={`w-full py-2 rounded-lg transition ${
                                    daySelection.selectedHotel === hotel.id
                                      ? `bg-${theme.text.split('-')[1]}-800 text-white`
                                      : "bg-blue-500 text-white hover:bg-blue-100 hover:text-blue-700"
                                  }`}
                                >
                                  {daySelection.selectedHotel === hotel.id ? "✓ Selected" : "Select Hotel"}
                                </button>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>

                  {/* Meals Section for this day */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-tr ${theme.bg} flex items-center justify-center mr-3`}>
                        <img src="/meal.png" alt="Meals" className="h-6 w-6" />
                      </div>
                      <h4 className={`text-xl font-semibold ${theme.text}`}>
                        Meals for Day {daySelection.day}
                      </h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      {isMealLoading
                        ? Array.from({ length: 3 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between border border-gray-100 rounded-xl p-4 animate-pulse"
                            >
                              <div className="space-y-2">
                                <div className="h-5 bg-gray-300 rounded w-32" />
                                <div className="h-4 bg-gray-300 rounded w-24" />
                              </div>
                              <div className="w-12 h-6 bg-gray-300 rounded-full" />
                            </div>
                          ))
                        : meals.map((meal) => {
                            const isSelected = daySelection.selectedMeals.includes(meal.id);
                            return (
                              <div
                                key={meal.id}
                                className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition ${
                                  isSelected
                                    ? `border-${theme.text.split('-')[1]}-400`
                                    : "border-gray-200 hover:border-yellow-300"
                                }`}
                                onClick={() => toggleMealSelection(daySelection.day, meal.id)}
                              >
                                <div>
                                  <p className="font-semibold text-xl text-gray-800">{meal.type}</p>
                                  <p className="text-sm text-gray-500">₹{meal.price} per person</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleMealSelection(daySelection.day, meal.id)}
                                  className={`relative w-12 h-6 rounded-full transition-colors ${
                                    isSelected ? `bg-${theme.text.split('-')[1]}-400` : "bg-gray-300"
                                  }`}
                                >
                                  <span
                                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                      isSelected ? "translate-x-6" : "translate-x-0"
                                    }`}
                                  />
                                </button>
                              </div>
                            );
                          })}
                    </div>
                  </div>
{/* Transportation for this day */}
<div>
  <div className="flex items-center mb-6">
    <div className={`h-10 w-10 rounded-lg bg-gradient-to-tr from-green-400 to-green-500 flex items-center justify-center mr-3`}>
      <img src="/sedan.png" alt="Transportation" className="h-6 w-6" />
    </div>
    <h4 className={`text-xl font-semibold ${theme.text}`}>
      Transportation
    </h4>
  </div>
  {selectedTransport ? (
    (() => {
      const transport = transports.find(t => t.id === selectedTransport);
      if (!transport) return <p className="text-gray-500">No transport selected</p>;
      return (
        <div className="flex flex-col md:flex-row gap-4 items-center border rounded-xl p-4">
          <div className="h-32 w-48 overflow-hidden rounded-lg">
            <img
              src={transport.photos || "/placeholder.png"}
              alt={transport.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-lg text-green-600">{transport.vehicleType}</h5>
            <p className="text-gray-600 mb-1">Capacity: {transport.maxCapacity} {transport.maxCapacity === 1 ? "person" : "people"}</p>
            <p className="text-gray-600 mb-1">Daily Rate: ₹{transport.perDay}</p>
            <p className="text-gray-600">Per Km: ₹{transport.perKm}</p>
          </div>
        </div>
      );
    })()
  ) : (
    <p className="text-gray-500">No transport selected</p>
  )}
</div>

                  {/* Activities Section for this day */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-tr ${theme.bg} flex items-center justify-center mr-3`}>
                        <img src="/sticky-note.png" alt="Activities" className="h-5 w-5" />
                      </div>
                      <h4 className={`text-xl font-semibold ${theme.text}`}>
                        Activities & Add-ons for Day {daySelection.day}
                      </h4>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {isActivityLoading
                        ? Array.from({ length: 3 }).map((_, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col border border-gray-100 rounded-xl overflow-hidden animate-pulse"
                            >
                              <div className="h-48 bg-gray-200 w-full" />
                              <div className="p-4 space-y-2">
                                <div className="h-5 bg-gray-300 rounded w-3/4" />
                                <div className="h-4 bg-gray-300 rounded w-1/2" />
                                <div className="h-6 bg-gray-300 rounded w-full mt-3" />
                              </div>
                            </div>
                          ))
                        : activities.map((act) => {
                            const isSelected = daySelection.selectedActivities.includes(act.id);
                            const imageUrl = Array.isArray(act.photos)
                              ? act.photos[0] || "/placeholder.png"
                              : act.photos || "/placeholder.png";

                            return (
                              <div
                                key={act.id}
                                className={`flex flex-col border rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-104 ${
                                  isSelected
                                    ? `border-${theme.text.split('-')[1]}-400 shadow-md scale-104`
                                    : "border-gray-200 hover:border-orange-300"
                                }`}
                                onClick={() => toggleActivitySelection(daySelection.day, act.id)}
                              >
                                <div className="h-48 w-full overflow-hidden relative">
                                  <img
                                    src={imageUrl}
                                    alt={act.name}
                                    className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-105"
                                  />
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                  <h4 className="font-semibold text-gray-800 text-lg mb-1">{act.name}</h4>
                                  <p className="text-sm text-gray-500 mb-4">{act.desc}</p>
                                  <div className="mt-auto flex justify-between items-center">
                                    <p className="font-bold text-orange-400">₹{act.price} per person</p>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleActivitySelection(daySelection.day, act.id);
                                      }}
                                      className={`px-4 py-2 rounded-lg transition text-sm flex items-center ${
                                        isSelected
                                          ? `bg-${theme.text.split('-')[1]}-600 text-white`
                                          : "bg-orange-400 text-white hover:bg-orange-200 hover:text-orange-700"
                                      }`}
                                    >
                                      {isSelected ? "Added" : "Add Activity"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Navigation */}
      <div className="flex justify-between pt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← Back
        </button>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            nextStep();
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}