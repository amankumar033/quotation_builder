// components/QuotationBuilder/PackageSelectionStep.tsx
"use client";

import { QuotationData } from "../../quotation-builder/page";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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
  photos: string[];   // ✅ use this instead of "image: string"
  inclusions: string[];
}


interface Transport {
  id: number;
  name: string;
  passengers: number;
  perDay: number;
  perKm: number;
  photos: string;
  maxCapacity:number;
  vehicleType:string;
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
  photos:string;
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
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<number | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);

  // Fetch data
  useEffect(() => {
   fetch("/api/hotels")
  .then((res) => res.json())
  .then((res) => {
    // Support both array or { data: [...] } response
    const rawHotels = Array.isArray(res) ? res : res.data || [];

    const normalized = rawHotels.map((h: any) => ({
      ...h,
      photos: typeof h.photos === "string" ? JSON.parse(h.photos) : h.photos || [],
      inclusions: h.inclusions ? JSON.parse(h.inclusions) : [],
    }));

    console.log("Normalized hotels:", normalized); // 👀 debug
    setHotels(normalized);
  })
  .catch((err) => {
    console.error("Failed to fetch hotels:", err);
    setHotels([]);
  });


    fetch("/api/transports")
  .then((res) => res.json())
  .then((res) => {
    const raw = Array.isArray(res) ? res : res.data || [];

    const normalized = raw.map((t: any) => ({
      ...t,
      photos: typeof t.photos === "string" ? JSON.parse(t.photos)[0] : t.photos, // take first image
    }));

    console.log("Normalized transports:", normalized);
    setTransports(normalized);
  })
  .catch(() => setTransports([]));

      
    fetch("/api/meals")
      .then((res) => res.json())
      .then((result) => setMeals(result.data || []))
      .catch(() => setMeals([]));

    fetch("/api/activities")
      .then((res) => res.json())
      .then((result) => setActivities(result.data || []))
      .catch(() => setActivities([]));
  
  }, []);

  // Keep QuotationData updated
useEffect(() => {
  updateData({
    selectedHotel: selectedHotel ? String(selectedHotel) : null,
    selectedVehicle: selectedTransport ? String(selectedTransport) : null,
    selectedMealIds: selectedMeals.map(String),        // ✅ correct key
    selectedActivityIds: selectedActivities.map(String) // ✅ correct key
  });
}, [selectedHotel, selectedTransport, selectedMeals, selectedActivities]);


  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) &&
      (starFilter ? hotel.starCategory === starFilter : true)
  );

  const toggleMealSelection = (mealId: number | null) => {
  if (mealId === null) return; 

  setSelectedMeals((prev) =>
    prev.includes(mealId)
      ? prev.filter((id) => id !== mealId)
      : [...prev, mealId]
  );
};


  const toggleActivitySelection = (activityId: number | null) => {
    if(activityId===null ) return;
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  return (
    <div className="space-y-8 px-6 min-h-screen bg-gray-50">
      {/* Hotels Section */}
      <section className="p-6 shadow-sm border bg-white rounded-xl border-gray-100">
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-blue-400 to-blue-500 flex items-center justify-center mr-3">
            <img src="/hotel.png" alt="" className="h-9 w-9" />
          </div>
          <h3 className="text-3xl font-semibold text-blue-600">
            Hotel Selection
          </h3>
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
        <div className="grid md:grid-cols-3 gap-6 ">
          {filteredHotels.map((hotel) => (
            <div 
              onClick={() => setSelectedHotel(hotel.id)}
              key={hotel.id}
              className={`flex flex-col border rounded-xl overflow-hidden hover:transform hover:scale-105 cursor-pointer  hover:transition-all duration-300 ease-out ${
                selectedHotel === hotel.id 
                  ? "border-blue-500 shadow-md hover:transform scale-105 transition-all duration-300 ease-out" 
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="h-48 overflow-hidden ">
                <img
                  src={hotel.photos[0]||""}
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:transform hover:scale-107 cursor-pointer  hover:transition-all duration-300 ease-out"
                />
              </div>
              <div className="p-4 ">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-xl text-gray-700">
                      {hotel.name}
                    </h4>
                    <p className="text-lg text-gray-500 mt-2">{hotel.city}</p>
                  </div>
                  <div className="text-blue-600 font-bold">
                    ₹3000/night
                  </div>
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
    <span key={idx} className=" text-gray-500 bg-blue-100 px-2 ml-2 py-[2px]  text-[12px]">
      {inc}
    </span>
  ))}
                  </div>
                <button
                  onClick={() => setSelectedHotel(hotel.id)}
                  className={`w-full py-2 rounded-lg transition ${
                    selectedHotel === hotel.id
                      ? "bg-blue-800 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-100 hover:text-blue-700"
                  }`}
                >
                  {selectedHotel === hotel.id ? "✓ Selected" : "Select Hotel"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transportation Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mr-3 shadow-md">
            
            <img src="/sedan.png" alt="kkkk" />
          </div>
          <h3 className="text-3xl font-semibold text-green-500">
            Transportation
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {transports.map((v) => (
            <div
              key={v.id}
              className={`rounded-xl transition-all cursor-pointer hover:scale-105  hover:transform hover:transition-all duration-300 ${
                selectedTransport === v.id
                  ? "bg-green-50 ring-2 ring-green-300 scale-103"
                  : "border border-gray-200 hover:border-green-300"
              }`}
              onClick={() => setSelectedTransport(v.id)}
            >
             <div className="h-48 w-full overflow-hidden rounded-t-xl relative">
  <img
    src={v.photos || "/placeholder.png"}
    alt={v.name}
    className="w-full h-full object-cover hover:transform hover:transition-all hover:scale-102 duration-300 ease-out"
  />
</div>
<div className="p-5">

              <h4 className="font-mono font-semibold text-green-500 text-2xl mb-5">
                {v.vehicleType}
              </h4>
              <div className="text-sm text-gray-600 mb-4">
                Capacity: {v.maxCapacity}{" "}
                {v.maxCapacity === 1 ? "person" : "people"}
              </div>
              <div className="space-y-2 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">DAILY RATE:</span>
                  <span className="font-medium text-gray-800">₹{v.perDay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">PER KM:</span>
                  <span className="font-medium text-gray-800">₹{v.perKm}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTransport (v.id)}
                className={`w-full py-2 rounded-lg transition ${
                  selectedTransport  === v.id
                    ? "bg-green-600 text-white"
                    : "bg-green-400 text-white hover:bg-green-200"
                }`}
              >
                {selectedTransport === v.id ? "✓ Selected" : "Select Vehicle"}
              </button>
            </div>
            </div>
          ))}
        </div>
      </section>

    {/* Meals Section */}
<section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center mb-6">
    <div className="h-12 w-12 rounded-lg bg-yellow-400 flex items-center justify-center mr-3">
      <img src="/meal.png" alt="" className="h-9 w-9" />
    </div>
    <h3 className="text-3xl font-semibold text-yellow-500">Meals</h3>
  </div>
  <div className="grid md:grid-cols-3 gap-4">
    {meals.map((meal) => {
      const isSelected = selectedMeals.includes(meal.id);
      return (
        <div
          key={meal.id}
          className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition ${
            isSelected
              ? "border-yellow-400"
              : "border-gray-200 hover:border-yellow-300"
          }`}
          onClick={() => toggleMealSelection(meal.id)}
        >
          <div>
            <p className="font-semibold text-xl text-gray-800">{meal.type}</p>
            <p className="text-sm text-gray-500">₹{meal.price} per person</p>
          </div>

          {/* Toggle */}
          <button
            type="button"
            onClick={() => toggleMealSelection(meal.id)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isSelected ? "bg-yellow-400" : "bg-gray-300"
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
</section>


      {/* Activities Section */}
<section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center mb-6">
    <div className="h-12 w-12 rounded-lg bg-orange-400 flex items-center justify-center mr-3">
      <img src="/sticky-note.png" alt="" className="h-7 w-7" />
    </div>
    <h3 className="text-3xl font-semibold text-orange-500">
      Activities & Add-ons
    </h3>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
>
    {activities.map((act) => {
      const isSelected = selectedActivities.includes(act.id);
      const imageUrl = Array.isArray(act.photos)
        ? act.photos[0] || "/placeholder.png"
        : act.photos || "/placeholder.png";

      return (
     <div
  key={act.id}
  className={`flex flex-col border rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-104 ${
    isSelected
      ? "border-orange-400 shadow-md scale-104"
      : "border-gray-200 hover:border-orange-300"
  }`}
  onClick={() => toggleActivitySelection(act.id)} // whole card toggles
>
  {/* Image */}
  <div className="h-48 w-full overflow-hidden relative">
    <img
      src={imageUrl}
      alt={act.name}
      className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-105"
    />
  </div>

  {/* Card Content */}
  <div className="p-4 flex flex-col flex-1">
    <h4 className="font-semibold text-gray-800 text-lg mb-1">{act.name}</h4>
    <p className="text-sm text-gray-500 mb-4">{act.desc}</p>

    <div className="mt-auto flex justify-between items-center">
      <p className="font-bold text-orange-400">₹{act.price} per person</p>
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent double toggle
          toggleActivitySelection(act.id);
        }}
        className={`px-4 py-2 rounded-lg transition text-sm flex items-center ${
          isSelected
            ? "bg-orange-600 text-white"
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
          onClick={()=>{
            window.scrollTo({ top: 0, behavior: 'smooth' });
            nextStep()}}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
