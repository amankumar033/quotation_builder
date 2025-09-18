// components/QuotationBuilder/PackageSelectionStep.tsx
import { QuotationData } from "../../quotation-builder/page";
import { useState } from "react";

interface PackageSelectionStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// Mock data with image URLs for hotels only
const hotels = [
  { 
    id: 1, 
    name: "The Grand Resort", 
    city: "Goa", 
    stars: 5, 
    price: 8500, 
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    inclusions: ["Breakfast", "WiFi", "Pool", "AC", "Beach Access"] 
  },
  { 
    id: 2, 
    name: "Seaside Hotel", 
    city: "Goa", 
    stars: 4, 
    price: 6200, 
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    inclusions: ["Breakfast", "WiFi", "Pool", "AC"] 
  },
  { 
    id: 3, 
    name: "Budget Inn", 
    city: "Goa", 
    stars: 3, 
    price: 3800, 
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    inclusions: ["WiFi", "AC"] 
  },
];

const vehicles = [
  { id: 1, name: "Sedan", passengers: 4, perDay: 2500, perKm: 12 ,logo:"/sedan.png"},
  { id: 2, name: "SUV", passengers: 6, perDay: 3500, perKm: 18 ,logo:"/suv.png"},
  { id: 3, name: "Traveller", passengers: 12, perDay: 5000, perKm: 25 ,logo:"/traveller.png"},
  { id: 4, name: "Bus", passengers: 35, perDay: 8000, perKm: 35 ,logo:"/bus.png"},
];

const meals = [
  { id: 1, name: "Breakfast", price: 350 },
  { id: 2, name: "Lunch", price: 450 },
  { id: 3, name: "Dinner", price: 550 },
];

const activities = [
  { id: 1, name: "Water Sports", desc: "Full day adventure", price: 1500 },
  { id: 2, name: "City Tour", desc: "Half day sightseeing", price: 800 },
];

export default function PackageSelectionStep({ data, updateData, nextStep, prevStep }: PackageSelectionStepProps) {
  const [hotelSearch, setHotelSearch] = useState("");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) &&
      (starFilter ? hotel.stars === starFilter : true)
  );

  const toggleMealSelection = (mealId: number) => {
    if (selectedMeals.includes(mealId)) {
      setSelectedMeals(selectedMeals.filter(id => id !== mealId));
    } else {
      setSelectedMeals([...selectedMeals, mealId]);
    }
  };

  const toggleActivitySelection = (activityId: number) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gray-50">
      {/* Header */}
  <div className="bg-white flex flex-col gap-10">
  

      {/* Hotels Section */}
      <section className=" p-6 shadow-sm border bg-white rounded-xl border-gray-100">
        <div className="flex items-center mb-6">
<div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-blue-400 to-blue-500 flex items-center justify-center mr-3">
            <img src="/hotel.png" alt="" className="h-9 w-9"/>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-blue-600">Hotel Selection</h3>
          </div>
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
                onClick={() => setStarFilter(starFilter === star ? null : star)}
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
              className={`flex flex-col border rounded-xl overflow-hidden transition-all ${
                selectedHotel === hotel.id 
                  ? "border-blue-500 shadow-md" 
                  : "border-gray-200 hover:border-blue-300"
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
                    <h4 className="font-semibold text-xl mb-4 text-gray-700">{hotel.name}</h4>
                    <p className="text-lg text-gray-500">{hotel.city}</p>
                  </div>
                  <div className="text-blue-600 font-bold">₹{hotel.price}/night</div>
                </div>
                
                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 text-xl mr-1">{'★'.repeat(hotel.stars)}</span>
                  <span className="text-gray-300">{'★'.repeat(5 - hotel.stars)}</span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Inclusions:</p>
                  <div className="flex flex-wrap gap-1">
                    {hotel.inclusions.map((inc, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedHotel(hotel.id)}
                  className={`w-full py-2 rounded-lg transition ${
                    selectedHotel === hotel.id
                      ? "bg-blue-800 text-white "
                      : "bg-blue-500 text-white hover:bg-blue-100 hover:text-blue-700"
                  }`}
                >
                  {selectedHotel === hotel.id ? "Selected" : "Select Hotel"}
                </button>
              </div>
            </div>
          ))}
          
          {filteredHotels.length === 0 && (
            <div className="col-span-3 py-8 text-center">
              <p className="text-gray-500">No hotels found matching your criteria.</p>
              <button 
                onClick={() => {
                  setHotelSearch("");
                  setStarFilter(null);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm mt-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>


  {/* Transportation Section */}
<section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center mb-8">
    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mr-3 shadow-md">
      <img src="/sedan.png" alt="" />
    </div>
    <div>
      <h3 className="text-3xl font-semibold text-green-500">Transportation</h3>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {vehicles.map((v) => (
      <div
  key={v.id}
  className={`rounded-xl p-5 transition-all transform hover:-translate-y-1 hover:shadow-md ${
    selectedVehicle === v.id
      ? "bg-green-50 shadow-md ring-2 ring-green-300 border-0" // remove border when selected
      : "border border-gray-200 hover:border-green-300" // keep border when unselected
  }`}
>
  {/* Vehicle Name */}
  <h4 className="font-mono font-semibold text-green-500 text-2xl  tracking-tight mb-5">{v.name}</h4>
  
  {/* Passenger Capacity */}
  <div className="flex items-center text-sm text-gray-600 mb-4">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <span>{v.passengers} {v.passengers === 1 ? 'person' : 'people'}</span>
  </div>
  
  {/* Pricing Information */}
  <div className="space-y-2 mb-5">
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">DAILY RATE:</span>
      <span className={`font-medium text-gray-800 px-2 py-1 rounded ${
        selectedVehicle === v.id ? "bg-white" : "bg-gray-100"
      }`}>
        ₹{v.perDay}
      </span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500 tracking-wide">PER KM:</span>
      <span className={`font-medium text-gray-800 px-2 py-1 rounded ${
        selectedVehicle === v.id ? "bg-white" : "bg-gray-100"
      }`}>
        ₹{v.perKm}
      </span>
    </div>
  </div>
  
  {/* Select Button */}
  <button 
    onClick={() => setSelectedVehicle(v.id)}
    className={`w-full py-2.5 rounded-lg transition text-sm font-medium tracking-wide ${
      selectedVehicle === v.id
        ? "bg-green-400 text-white hover:bg-green-500 shadow-sm"
        : "bg-green-400 text-white hover:text-green-600 hover:bg-green-200 border border-green-300"
    }`}
  >
    {selectedVehicle === v.id ? "SELECTED" : "SELECT VEHICLE"}
  </button>
</div>


    ))}
  </div>

  {selectedVehicle && (
    <div className="mt-6 p-4 bg-green-50 border border-blue-200 rounded-lg flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      <span className="text-green-700 font-medium">
        {vehicles.find(v => v.id === selectedVehicle)?.name} selected
      </span>
      <button 
        onClick={() => setSelectedVehicle(null)}
        className="ml-auto text-green-600 hover:text-green-800 text-sm font-medium font-mono"
      >
        Change Selection
      </button>
    </div>
  )}
</section>


      {/* Meals Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 rounded-lg bg-yellow-400 flex items-center justify-center mr-3">
            <img src="/meal.png" alt="" className="h-9 w-9"/>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-yellow-500">Meals</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`flex items-center justify-between border rounded-xl p-4 transition-all ${
                selectedMeals.includes(meal.id)
                  ? "border-yellow-400 "
                  : "border-gray-200 hover:border-yellow-300"
              }`}
              onClick={() => toggleMealSelection(meal.id)}
            >
              <div>
                <p className="font-semibold text-xl mb-2 text-gray-800">{meal.name}</p>
                <p className="text-sm text-gray-500">₹{meal.price} per person</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={selectedMeals.includes(meal.id)}
                  onChange={() => toggleMealSelection(meal.id)}
                  className="sr-only" 
                />
                <div className={`relative w-10 h-6 rounded-full transition-colors ${
                  selectedMeals.includes(meal.id) ? 'bg-yellow-600' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform bg-white ${
                    selectedMeals.includes(meal.id) ? 'left-5' : 'left-1'
                  }`}></div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </section>


      {/* Activities Section */}
      <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="h-12 w-12 rounded-lg bg-orange-400 flex items-center justify-center mr-3">
            <img src="/sticky-note.png" alt="" className="h-7 w-7"/>
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-orange-500">Activities & Add-ons</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className={`flex flex-col border rounded-xl p-4 transition-all ${
                selectedActivities.includes(act.id)
                  ? "border-orange-400 ="
                  : "border-gray-200 hover:border-orange-300"
              }`}
            >
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800 text-lg mb-1">{act.name}</h4>
                <p className="text-sm text-gray-500">{act.desc}</p>
              </div>
              
              <div className="mt-auto flex justify-between items-center">
                <p className="font-bold text-orange-400">₹{act.price} per person</p>
                <button 
                  onClick={() => toggleActivitySelection(act.id)}
                  className={`px-4 py-2 rounded-lg transition text-sm ${
                    selectedActivities.includes(act.id)
                      ? "bg-orange-600 text-white"
                      : "bg-orange-400 text-white hover:bg-orange-300 hover:text-white"
                  }`}
                >
                  {selectedActivities.includes(act.id) ? "Added" : "Add Activity"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
</div>
      {/* Navigation */}
      <div className="flex justify-between pt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center text-sm text-gray-600">
          {selectedHotel && <span className="mx-2">🏨</span>}
          {selectedVehicle && <span className="mx-2">🚗</span>}
          {selectedMeals.length > 0 && <span className="mx-2">🍽️×{selectedMeals.length}</span>}
          {selectedActivities.length > 0 && <span className="mx-2">📍×{selectedActivities.length}</span>}
        </div>
        <button
          onClick={nextStep}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          Continue to Customization →
        </button>
      </div>
    </div>
  );
}