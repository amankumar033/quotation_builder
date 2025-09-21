// components/QuotationBuilder/PackageSelectionStep.tsx
"use client";

import { QuotationData } from "../../quotation-builder/page";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

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
  stars: number;
  price: number;
  image: string;
  inclusions: string[];
}

interface Vehicle {
  id: number;
  name: string;
  passengers: number;
  perDay: number;
  perKm: number;
  logo: string;
}

interface Meal {
  id: number;
  name: string;
  price: number;
}

interface Activity {
  id: number;
  name: string;
  desc: string;
  price: number;
}

export default function PackageSelectionStep({
  data,
  updateData,
  nextStep,
  prevStep,
}: PackageSelectionStepProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [transports, setTransports] = useState<Vehicle[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [hotelSearch, setHotelSearch] = useState("");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);

  // Fetch data
  useEffect(() => {
    fetch("/api/hotels")
      .then((res) => res.json())
      .then((result) => setHotels(result.data || []))
      .catch(() => setHotels([]));

    fetch("/api/transports")
      .then((res) => res.json())
      .then((result) => setTransports(result.data || []))
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
    selectedVehicle: selectedVehicle ? String(selectedVehicle) : null,
    selectedMealIds: selectedMeals.map(String),        // ✅ correct key
    selectedActivityIds: selectedActivities.map(String) // ✅ correct key
  });
}, [selectedHotel, selectedVehicle, selectedMeals, selectedActivities]);


  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) &&
      (starFilter ? hotel.stars === starFilter : true)
  );

  const toggleMealSelection = (mealId: number) => {
    setSelectedMeals((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId]
    );
  };

  const toggleActivitySelection = (activityId: number) => {
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
                {star}★
              </button>
            ))}
          </div>
        </div>

        {/* Hotel Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => setSelectedHotel(hotel.id)}
              className={`flex flex-col border rounded-xl overflow-hidden transition-all cursor-pointer ${
                selectedHotel === hotel.id
                  ? "border-blue-500 shadow-2xl scale-105 -translate-y-2"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
              }`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-xl text-gray-700">
                      {hotel.name}
                    </h4>
                    <p className="text-lg text-gray-500">{hotel.city}</p>
                  </div>
                  <div className="text-blue-600 font-bold">
                    ₹{hotel.price}/night
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 text-xl mr-1">
                    {"★".repeat(hotel.stars)}
                  </span>
                  <span className="text-gray-300">
                    {"★".repeat(5 - hotel.stars)}
                  </span>
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
            <img src="/sedan.png" alt="" />
          </div>
          <h3 className="text-3xl font-semibold text-green-500">
            Transportation
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {transports.map((v) => (
            <div
              key={v.id}
              className={`rounded-xl p-5 transition-all cursor-pointer ${
                selectedVehicle === v.id
                  ? "bg-green-50 ring-2 ring-green-300"
                  : "border border-gray-200 hover:border-green-300"
              }`}
              onClick={() => setSelectedVehicle(v.id)}
            >
              <h4 className="font-mono font-semibold text-green-500 text-2xl mb-5">
                {v.name}
              </h4>
              <div className="text-sm text-gray-600 mb-4">
                Capacity: {v.passengers}{" "}
                {v.passengers === 1 ? "person" : "people"}
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
                onClick={() => setSelectedVehicle(v.id)}
                className={`w-full py-2 rounded-lg transition ${
                  selectedVehicle === v.id
                    ? "bg-green-600 text-white"
                    : "bg-green-400 text-white hover:bg-green-200"
                }`}
              >
                {selectedVehicle === v.id ? "✓ Selected" : "Select Vehicle"}
              </button>
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
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer ${
                selectedMeals.includes(meal.id)
                  ? "border-yellow-400"
                  : "border-gray-200 hover:border-yellow-300"
              }`}
              onClick={() => toggleMealSelection(meal.id)}
            >
              <div>
                <p className="font-semibold text-xl text-gray-800">{meal.name}</p>
                <p className="text-sm text-gray-500">₹{meal.price} per person</p>
              </div>
              <input
                type="checkbox"
                checked={selectedMeals.includes(meal.id)}
                readOnly
              />
            </div>
          ))}
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
        <div className="grid md:grid-cols-2 gap-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className={`flex flex-col border rounded-xl p-4 cursor-pointer ${
                selectedActivities.includes(act.id)
                  ? "border-orange-400"
                  : "border-gray-200 hover:border-orange-300"
              }`}
              onClick={() => toggleActivitySelection(act.id)}
            >
              <h4 className="font-semibold text-gray-800 text-lg mb-1">
                {act.name}
              </h4>
              <p className="text-sm text-gray-500">{act.desc}</p>
              <div className="mt-auto flex justify-between items-center">
                <p className="font-bold text-orange-400">
                  ₹{act.price} per person
                </p>
                <button
                  onClick={() => toggleActivitySelection(act.id)}
                  className={`px-4 py-2 rounded-lg transition text-sm flex items-center ${
                    selectedActivities.includes(act.id)
                      ? "bg-orange-600 text-white"
                      : "bg-orange-400 text-white"
                  }`}
                >
                  {selectedActivities.includes(act.id) ? "Added" : "Add"}
                </button>
              </div>
            </div>
          ))}
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
          onClick={nextStep}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
