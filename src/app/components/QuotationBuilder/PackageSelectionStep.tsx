"use client";

import { useEffect, useState } from "react";
import { QuotationData, Hotel, DaySelection, RoomSelection, Meal } from "@/types/type";
import HotelCard from "./PackageSelection/HotelCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ChevronDown, ChevronUp, X, ArrowLeft, Check, Edit, Users, Crown, Bed, Star, Receipt, MapPin, Building, Calendar, CalendarDays, Utensils } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";
import HotelSummary from "./PackageSelection/HotelSummary";
import RoomSelect from "./PackageSelection/RoomSelection";
interface PackageSelectionStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;export default function PackageSelectionStep({
  data,
  updateData,
  nextStep,
  prevStep,
}: PackageSelectionStepProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelSearch, setHotelSearch] = useState("");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [isHotelLoading, setIsHotelLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [daySelections, setDaySelections] = useState<DaySelection[]>([
    { day: 1, selectedHotel: null, selectedMeals: [], selectedActivities: [] },
    { day: 2, selectedHotel: null, selectedMeals: [], selectedActivities: [] },
    { day: 3, selectedHotel: null, selectedMeals: [], selectedActivities: [] },
    { day: 4, selectedHotel: null, selectedMeals: [], selectedActivities: [] },
  ]);

  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<Hotel | null>(null);
  const [currentDayForRooms, setCurrentDayForRooms] = useState<number>(1);
  const [roomSelections, setRoomSelections] = useState<RoomSelection[]>([]);
  const [mealSelections, setMealSelections] = useState<Meal[]>([]);
  const [roomSelectionState, setRoomSelectionState] = useState<RoomSelectionState>('browsing');
  const { setShow,show } = useQuotation();
  useEffect(() => {
    setIsHotelLoading(true);
    fetch("/api/hotels")
      .then((res) => res.json())
      .then((res) => {
        const rawHotels = Array.isArray(res) ? res : res.data || [];
        const normalized = rawHotels.map((h: any) => ({
          ...h,
          photos: typeof h.photos === "string" ? JSON.parse(h.photos) : h.photos || [],
          inclusions: h.inclusions ? JSON.parse(h.inclusions) : [],
        }));
        setHotels(normalized);
        setIsHotelLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch hotels:", err);
        setHotels([]);
        setIsHotelLoading(false);
      });
  }, []);

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) &&
      (starFilter ? hotel.starCategory === starFilter : true)
  );

  const toggleDayAccordion = (day: number) => {
    if (roomSelectionState !== 'browsing') return;
    setActiveDay(activeDay === day ? -1 : day);
  };

  const selectHotelForDay = (dayNumber: number, hotelId: number | null) => {
    setDaySelections(prev => prev.map(day => 
      day.day === dayNumber ? { ...day, selectedHotel: hotelId } : day
    ));
  };

  const handleViewHotelMeals = (hotel: Hotel, dayNumber: number) => {
    setSelectedHotelForRooms(hotel);
    setCurrentDayForRooms(dayNumber);
    setRoomSelectionState('selecting-meals');
    
    // Initialize with default meal selections
    const defaultMeals: Meal[] = hotelMeals.map(meal => ({
      ...meal,
      quantity: 0
    }));
    setMealSelections(defaultMeals);
  };

  const handleBackToHotels = () => {
    setRoomSelectionState('browsing');
    setSelectedHotelForRooms(null);
    setRoomSelections([]);
    setMealSelections([]);
  };

  const handleProceedToRooms = () => {
    setRoomSelectionState('selecting-rooms');
    
    const defaultSelection: RoomSelection = {
      roomId: 1,
      roomCount: 1,
      adults: 2,
      childrenWithBed: 0,
      childrenWithoutBed: 0,
      totalPrice: 3000
    };
    setRoomSelections([defaultSelection]);
  };

  const handleBackToMeals = () => {
    setRoomSelectionState('selecting-meals');
  };

  const handleConfirmRoomSelection = () => {
    setRoomSelectionState('confirmed');
    updateData({
      roomSelections: {
        hotel: selectedHotelForRooms,
        day: currentDayForRooms,
        selections: roomSelections,
        meals: mealSelections.filter(meal => meal.quantity > 0)
      }
    });
  };

  const handleEditRoomSelection = () => {
    setRoomSelectionState('selecting-rooms');
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

  const isViewingDetails = roomSelectionState !== 'browsing';

  return (
    <div className="space-y-8 px-6 min-h-screen bg-gray-50">
      <section className="space-y-6">
        {daySelections.map((daySelection) => {
          const theme = getDayTheme(daySelection.day);
          const isActive = activeDay === daySelection.day;
          const isCurrentDayDetails = currentDayForRooms === daySelection.day && isViewingDetails;
          
          return (
            <div key={daySelection.day} className={`bg-white rounded-xl shadow-sm border ${theme.border} transition-all duration-300`}>
              <div 
                className={`px-6 py-3 cursor-pointer rounded-t-xl ${isActive ? 'bg-gradient-to-r ' + theme.bg + ' text-white' : 'hover:bg-gray-50'} ${
                  isViewingDetails ? 'cursor-not-allowed opacity-80' : ''
                }`}
                onClick={() => !isViewingDetails && toggleDayAccordion(daySelection.day)}
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
                    {daySelection.selectedHotel && roomSelectionState === 'browsing' && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isActive ? 'bg-white text-gray-800' : 'bg-green-100 text-green-800'
                      }`}>
                        Hotel Selected
                      </span>
                    )}
                    {roomSelectionState === 'confirmed' && currentDayForRooms === daySelection.day && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isActive ? 'bg-white text-gray-800' : 'bg-green-100 text-green-800'
                      }`}>
                        Rooms & Meals Confirmed
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
               

              {isActive && (
                <div className="p-6 space-y-8 animate-in fade-in duration-300">
                  {isCurrentDayDetails && selectedHotelForRooms && (
                    <div className=" rounded-xl border-2 border-gray-100" >
                      <div className="flex items-center justify-between px-6 py-3 cursor-pointer border-b border-gray-200 " onClick={() => {
    setShow(!show);  }}>
                        <div className="flex flex-col  items-center space-x-4">
                      
                          <div className="flex items-center space-x-3 cursor-pointer" >
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center">
                              <img src="/hotel.png" alt="Hotel" className="h-6 w-6 filter brightness-0 invert" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-700">{selectedHotelForRooms.name}</h2>
                              <p className="text-gray-600 flex items-center">
                              
                                
                                <span>{selectedHotelForRooms.city}</span>
                                <span className="mx-2">•</span>
                                 
                                <span className="flex items-center">
                                  {selectedHotelForRooms.starCategory} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                       {isViewingDetails && (
                            <button
                              onClick={handleBackToHotels}
                              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              <ArrowLeft className="h-5 w-5" />
                              <span>Back to Hotels</span>
                            </button>
                          )}
                      </div>
                      {show&&(
                      <div className="p-6">
                        {roomSelectionState === 'selecting-meals' && (
                          <ProfessionalMealSelection
                            hotel={selectedHotelForRooms}
                            meals={mealSelections}
                            onMealsChange={setMealSelections}
                            onProceed={handleProceedToRooms}
                            theme={theme}
                          />
                        )}

                        {roomSelectionState === 'selecting-rooms' && (
                          <RoomSelect
                            hotel={selectedHotelForRooms}
                            selections={roomSelections}
                            onSelectionsChange={setRoomSelections}
                            onConfirm={handleConfirmRoomSelection}
                            onBack={handleBackToMeals}
                            theme={theme}
                          />
                        )}

                        {roomSelectionState === 'confirmed' && show &&(
  <HotelSummary
    hotel={selectedHotelForRooms}
    selections={roomSelections}
    meals={mealSelections.filter(meal => meal.quantity > 0)}
    onEdit={handleEditRoomSelection}
    theme={theme}
  />
)}
                      </div>)}
                    </div>
                  )}

                  {!isCurrentDayDetails && roomSelectionState === 'browsing' && (
                    <div >
                        {/* Close button */}
    <div className="flex justify-end mb-2">
      <button 
       
        className="p-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
      </div>
                      <div className="flex items-center mb-6">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-tr ${theme.bg} flex items-center justify-center mr-3`}>
                          <img src="/hotel.png" alt="Hotel" className="h-6 w-6" />
                        </div>
                        <h4 className={`text-xl font-semibold ${theme.text}`}>
                          Hotel Selection for Day {daySelection.day}
                        </h4>
                      </div>

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

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isHotelLoading
                          ? Array.from({ length: 3 }).map((_, idx) => (
                              <div key={idx} className="flex flex-col border rounded-xl border-gray-100 overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200 w-full" />
                                <div className="p-4 space-y-2">
                                  <div className="h-5 bg-gray-300 rounded w-3/4" />
                                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                                  <div className="h-6 bg-gray-300 rounded w-full mt-3" />
                                </div>
                              </div>
                            ))
                          : filteredHotels.map((hotel) => (
                              <HotelCard
                                key={hotel.id}
                                hotel={hotel}
                                isSelected={daySelection.selectedHotel === hotel.id}
                                onSelect={(hotelId) => selectHotelForDay(daySelection.day, hotelId)}
                                onViewDetails={(hotel) => handleViewHotelMeals(hotel, daySelection.day)}
                                theme={theme}
                                disabled={isViewingDetails}
                              />
                            ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

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

// Sample meal data
const hotelMeals: Meal[] = [
  {
    id: 1,
    name: "Continental Breakfast",
    type: "breakfast",
    category: "veg",
    price: 450,
    description: "Fresh fruits, cereals, breads, juices and hot beverages",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSIjnT16b72GWq4B8WZ2lhTxQLbT8ki6pdnQ&s",
    quantity: 0
  },
  {
    id: 2,
    name: "American Breakfast",
    type: "breakfast",
    category: "non-veg",
    price: 650,
    description: "Eggs, bacon, sausages, toast with butter and jam",
    image: "https://veg.fit/wp-content/uploads/2022/11/2-min-7.jpg",
    quantity: 0
  },
  {
    id: 3,
    name: "North Indian Lunch",
    type: "lunch",
    category: "veg",
    price: 800,
    description: "Traditional North Indian thali with roti, rice, dal and vegetables",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2KIvUWqujUIqnMLD_d9o6R_lqunRiEotvnQ&s",
    quantity: 0
  },
  {
    id: 4,
    name: "Seafood Lunch",
    type: "lunch",
    category: "non-veg",
    price: 1200,
    description: "Fresh seafood platter with fish, prawns and rice",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5iiE9ABhB1xqmvfBUfBTl1i7yYWgChBFDXw&s",
    quantity: 0
  },
  {
    id: 5,
    name: "Vegetarian Dinner",
    type: "dinner",
    category: "veg",
    price: 900,
    description: "Multi-cuisine vegetarian buffet with live counters",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTgubXoJPtiVWlC6MdHXgYcHz2xMiodY7Cyw&s",
    quantity: 0
  },
  {
    id: 6,
    name: "Non-Vegetarian Dinner",
    type: "dinner",
    category: "non-veg",
    price: 1100,
    description: "Premium non-veg buffet with chicken, lamb and fish dishes",
    image: "https://www.kolhapurtourism.org/wp-content/uploads/2021/09/non-veg-thali-kolhapur.jpg",
    quantity: 0
  }
];

// Professional Meal Selection Component
interface ProfessionalMealSelectionProps {
  hotel: Hotel;
  meals: Meal[];
  onMealsChange: (meals: Meal[]) => void;
  onProceed: () => void;
  theme: { bg: string; text: string; border: string };
}

function ProfessionalMealSelection({ hotel, meals, onMealsChange, onProceed, theme }: ProfessionalMealSelectionProps) {
  // Define the type for expandedSections to allow string indexing
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    dinner: true
  });

  const updateMealQuantity = (mealId: number, quantity: number) => {
    const updatedMeals = meals.map(meal => 
      meal.id === mealId ? { ...meal, quantity: Math.max(0, quantity) } : meal
    );
    onMealsChange(updatedMeals);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getMealsByType = (type: string) => {
    return meals.filter(meal => meal.type === type);
  };

  const totalMealPrice = meals.reduce((total, meal) => total + (meal.price * meal.quantity), 0);
  const hasSelectedMeals = meals.some(meal => meal.quantity > 0);

  return (
    <div className="space-y-6">
      {/* Header - Made more compact */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Meals</h3>
        <p className="text-gray-600">Choose from our premium dining options for your stay</p>
      </div>

      {/* Meal Types with Accordion */}
      {['breakfast', 'lunch', 'dinner'].map(mealType => (
        <div key={mealType} className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Accordion Header */}
          <div 
            className={`p-5 cursor-pointer transition-all duration-200 ${
              expandedSections[mealType] 
                ? `bg-gradient-to-r ${theme.bg} rounded-t-xl`
                : 'bg-gray-50 hover:bg-gray-100 rounded-xl'
            }`}
            onClick={() => toggleSection(mealType)}
          >
            <div className="flex justify-between items-center">
              <h4 className={`text-lg font-bold capitalize flex items-center ${
                expandedSections[mealType] ? 'text-white' : 'text-gray-900'
              }`}>
                <Utensils className="h-5 w-5 mr-2" />
                {mealType} Options
              </h4>
              <div className="flex items-center">
                <ChevronDown 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    expandedSections[mealType] ? 'rotate-180 text-white' : 'text-gray-600'
                  }`}
                />
              </div>
            </div>
          </div>
          
          {/* Accordion Content */}
          {expandedSections[mealType] && (
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {getMealsByType(mealType).map(meal => (
                  <div key={meal.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div className="flex">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-28 h-28 object-cover rounded-l-lg"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-gray-900">{meal.name}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            meal.category === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {meal.category.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-blue-600">₹{meal.price}/person</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMealQuantity(meal.id, meal.quantity - 1);
                              }}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-900">{meal.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMealQuantity(meal.id, meal.quantity + 1);
                              }}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Compact Professional Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Meal Selection Summary</h4>
              <p className="text-gray-600 text-sm">Review your meal choices before proceeding</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹{totalMealPrice}</div>
              <div className="text-sm text-gray-500">Total meal cost</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {['breakfast', 'lunch', 'dinner'].map(type => {
              const typeMeals = meals.filter(meal => meal.quantity > 0 && meal.type === type);
              return typeMeals.length > 0 ? (
                <div key={type} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900 capitalize mb-2 text-sm">{type}</div>
                  {typeMeals.map(meal => (
                    <div key={meal.id} className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="truncate">{meal.name}</span>
                      <span>{meal.quantity} × ₹{meal.price}</span>
                    </div>
                  ))}
                </div>
              ) : null;
            })}
          </div>

          <button
            onClick={onProceed}
            disabled={!hasSelectedMeals}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Room Selection →
          </button>
        </div>
      </div>
    </div>
  );
}

// Professional Room Selection Component (Updated)

// Professional Room Summary Component (Updated to include meals)
