"use client";

import { useEffect, useState } from "react";
import { QuotationData, Hotel, DaySelection, RoomSelection, Meal } from "@/types/type";
import HotelCard from "./PackageSelection/HotelCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import { ChevronDown, ChevronUp, X, ArrowLeft, Check, Edit, Users, Crown, Bed, Star, Receipt, MapPin, Building, Calendar, CalendarDays, Utensils } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";

interface PackageSelectionStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

type RoomSelectionState = 'browsing' | 'selecting-meals' | 'selecting-rooms' | 'confirmed';

export default function PackageSelectionStep({
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
                    <div className="bg-white rounded-xl border-2 border-gray-100 cursor-pointer" onClick={() => {
    setShow(!show);
 
  }}>
                      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100" >
                        <div className="flex flex-col items-center space-x-4">
                      
                          <div className="flex items-center space-x-3">
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
                                <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Hotel</span>
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
                          <ProfessionalRoomSelection
                            hotel={selectedHotelForRooms}
                            selections={roomSelections}
                            onSelectionsChange={setRoomSelections}
                            onConfirm={handleConfirmRoomSelection}
                            onBack={handleBackToMeals}
                            theme={theme}
                          />
                        )}

                        {roomSelectionState === 'confirmed' && show &&(
  <ProfessionalRoomSummary
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
interface ProfessionalRoomSelectionProps {
  hotel: Hotel;
  selections: RoomSelection[];
  onSelectionsChange: (selections: RoomSelection[]) => void;
  onConfirm: () => void;
  onBack: () => void;
  theme: { bg: string; text: string; border: string };
}

const professionalRooms = [
  {
    id: 1,
    type: "Deluxe Room",
    price: 3000,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "King Size Bed",
    amenities: ["Free WiFi", "AC", "TV", "Breakfast", "King Bed"],
    description: "Spacious room with modern amenities and comfortable bedding",
    photos: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=250&fit=crop"]
  },
  {
    id: 2,
    type: "Super Deluxe Room",
    price: 4500,
    maxAdults: 3,
    maxChildren: 2,
    bedType: "Queen Size Bed",
    amenities: ["Free WiFi", "AC", "TV", "Breakfast", "Balcony", "Sea View"],
    description: "Luxurious room with premium features and stunning views",
    photos: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=250&fit=crop"]
  },
  {
    id: 3,
    type: "Suite Room",
    price: 6500,
    maxAdults: 4,
    maxChildren: 3,
    bedType: "King Size + Extra Bed",
    amenities: ["Free WiFi", "AC", "TV", "Breakfast", "Balcony", "Living Room", "Mini Bar"],
    description: "Executive suite with separate living area and premium amenities",
    photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop"]
  }
];

function ProfessionalRoomSelection({ hotel, selections, onSelectionsChange, onConfirm, onBack, theme }: ProfessionalRoomSelectionProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<number>(1);
  const [roomCount, setRoomCount] = useState<number>(1);
  const [adults, setAdults] = useState<number>(2);
  const [childrenWithBed, setChildrenWithBed] = useState<number>(0);
  const [childrenWithoutBed, setChildrenWithoutBed] = useState<number>(0);

  const selectedRoom = professionalRooms.find(room => room.id === selectedRoomType);

  const calculateTotalPrice = () => {
    if (!selectedRoom) return 0;
    return (selectedRoom.price * roomCount) + (childrenWithBed * 500);
  };

  const handleConfirmSelection = () => {
    if (!selectedRoom) return;

    const newSelection: RoomSelection = {
      roomId: selectedRoomType,
      roomCount,
      adults,
      childrenWithBed,
      childrenWithoutBed,
      totalPrice: calculateTotalPrice()
    };

    onSelectionsChange([newSelection]);
    onConfirm();
  };

  const totalGuests = adults + childrenWithBed + childrenWithoutBed;
  const canAddMoreAdults = adults < (selectedRoom?.maxAdults || 0);
  const canAddMoreChildren = (childrenWithBed + childrenWithoutBed) < (selectedRoom?.maxChildren || 0);

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Meals</span>
        </button>
        <h3 className="text-3xl font-bold text-gray-900">Select Your Room</h3>
        <div></div> {/* Spacer for alignment */}
      </div>

      {/* Room Type Selection */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Room Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {professionalRooms.map(room => (
            <div
              key={room.id}
              className={`border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedRoomType === room.id
                  ? 'border-blue-500 shadow-xl scale-105 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
              onClick={() => setSelectedRoomType(room.id)}
            >
              <div className="relative">
                <img
                  src={room.photos[0]}
                  alt={room.type}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ₹{room.price}/night
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {room.bedType}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg text-gray-900">{room.type}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {room.maxAdults + room.maxChildren} max
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{room.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rooms selected:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoomCount(Math.max(0, roomCount - (selectedRoomType === room.id ? 1 : 0)));
                      }}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      -
                    </button>
                    <span className={`w-8 text-center font-semibold ${
                      selectedRoomType === room.id && roomCount > 0 ? 'text-blue-600 text-lg' : 'text-gray-400'
                    }`}>
                      {selectedRoomType === room.id ? roomCount : 0}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedRoomType === room.id) setRoomCount(roomCount + 1);
                      }}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Section */}
      {selectedRoom && roomCount > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Configure Your Stay</h3>
              <p className="text-gray-600">Customize your booking details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Guest Configuration */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h4 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Bed className="h-5 w-5 text-blue-600" />
                  </div>
                  Guest Configuration
                </h4>
      
      <div className="space-y-6">
        {/* Adult with Bed */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex-1">
            <div className="font-semibold text-gray-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Total Adults
            </div>
            <div className="text-sm text-blue-600 font-medium mt-1"></div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setChildrenWithBed(Math.max(0, childrenWithBed - 1))}
              className="w-10 h-10 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center hover:bg-blue-100 text-blue-600 font-bold transition-colors duration-200 shadow-sm"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-lg text-gray-900 bg-gray-50 py-1 rounded-md">{childrenWithBed}</span>
            <button
              onClick={() => setChildrenWithBed(Math.min(selectedRoom.maxChildren - childrenWithoutBed, childrenWithBed + 1))}
              disabled={!canAddMoreChildren}
              className="w-10 h-10 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center hover:bg-blue-100 text-blue-600 font-bold transition-colors duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-50"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex-1">
            <div className="font-semibold text-gray-900 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Adult with extra bed
            </div>
            <div className="text-sm text-blue-600 font-medium mt-1">₹700/Adult</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setChildrenWithBed(Math.max(0, childrenWithBed - 1))}
              className="w-10 h-10 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center hover:bg-blue-100 text-blue-600 font-bold transition-colors duration-200 shadow-sm"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-lg text-gray-900 bg-gray-50 py-1 rounded-md">{childrenWithBed}</span>
            <button
              onClick={() => setChildrenWithBed(Math.min(selectedRoom.maxChildren - childrenWithoutBed, childrenWithBed + 1))}
              disabled={!canAddMoreChildren}
              className="w-10 h-10 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center hover:bg-blue-100 text-blue-600 font-bold transition-colors duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Children with bed */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex-1">
            <div className="font-semibold text-gray-900 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Child with extra bed
            </div>
            <div className="text-sm text-green-600 font-medium mt-1">₹500/child</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setChildrenWithBed(Math.max(0, childrenWithBed - 1))}
              className="w-10 h-10 rounded-full border-2 border-green-200 bg-green-50 flex items-center justify-center hover:bg-green-100 text-green-600 font-bold transition-colors duration-200 shadow-sm"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-lg text-gray-900 bg-gray-50 py-1 rounded-md">{childrenWithBed}</span>
            <button
              onClick={() => setChildrenWithBed(Math.min(selectedRoom.maxChildren - childrenWithoutBed, childrenWithBed + 1))}
              disabled={!canAddMoreChildren}
              className="w-10 h-10 rounded-full border-2 border-green-200 bg-green-50 flex items-center justify-center hover:bg-green-100 text-green-600 font-bold transition-colors duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-green-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Children without Bed */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex-1">
            <div className="font-semibold text-gray-900 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Child Without Bed
            </div>
            <div className="text-sm text-purple-600 font-medium mt-1">No charge</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setChildrenWithoutBed(Math.max(0, childrenWithoutBed - 1))}
              className="w-10 h-10 rounded-full border-2 border-purple-200 bg-purple-50 flex items-center justify-center hover:bg-purple-100 text-purple-600 font-bold transition-colors duration-200 shadow-sm"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-lg text-gray-900 bg-gray-50 py-1 rounded-md">{childrenWithoutBed}</span>
            <button
              onClick={() => setChildrenWithoutBed(Math.min(selectedRoom.maxChildren - childrenWithBed, childrenWithoutBed + 1))}
              disabled={!canAddMoreChildren}
              className="w-10 h-10 rounded-full border-2 border-purple-200 bg-purple-50 flex items-center justify-center hover:bg-purple-100 text-purple-600 font-bold transition-colors duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-50"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Summary Section */}
  <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <h4 className="font-bold text-gray-900 mb-6 text-lg">Booking Summary</h4>
    
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
        <span className="text-gray-600 font-medium">{roomCount} {roomCount === 1 ? 'room' : 'rooms'} × ₹{selectedRoom.price}</span>
        <span className="font-semibold text-blue-600">₹{selectedRoom.price * roomCount}</span>
      </div>
      
      {childrenWithBed > 0 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
          <span className="text-gray-600 font-medium">Extra beds × {childrenWithBed}</span>
          <span className="font-semibold text-green-600">₹{childrenWithBed * 500}</span>
        </div>
      )}

      <div className="border-t border-green-200 pt-4 mt-2">
        <div className="flex justify-between items-center mb-3 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
          <div>
            <span className="text-lg font-bold text-gray-900 block">Total per night</span>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Users className="h-4 w-4 mr-1" />
              {roomCount} {roomCount === 1 ? 'room' : 'rooms'} • {totalGuests} guests
            </div>
          </div>
          <span className="text-2xl font-bold text-green-600 bg-white px-3 py-2 rounded-lg shadow-sm">₹{calculateTotalPrice()}</span>
        </div>
      </div>

      <button
        onClick={handleConfirmSelection}
        className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transform "
      >
        <Check className="h-5 w-5" />
        <span>Confirm Room Selection</span>
      </button>
    </div>
  </div>
</div>
        </div>
      )}
    </div>
  );
}
// Professional Room Summary Component (Updated to include meals)

function ProfessionalRoomSummary({ hotel, selections, meals, onEdit, theme }: any) {

  const selection = selections[0];
  const room = professionalRooms.find(r => r.id === selection?.roomId);

  if (!room || !selection) return null;
 
  const roomPrice = (room.price * selection.roomCount) + (selection.childrenWithBed * 500);
  const mealPrice = meals.reduce((total: number, meal: Meal) => total + (meal.price * meal.quantity), 0);
  const totalPrice = roomPrice + mealPrice;
  const totalGuests = selection.adults + selection.childrenWithBed + selection.childrenWithoutBed;

  // Group meals by type for better display
  const mealsByType = meals.reduce((acc: any, meal: Meal) => {
    if (meal.quantity > 0) {
      if (!acc[meal.type]) acc[meal.type] = [];
      acc[meal.type].push(meal);
    }
    return acc;
  }, {});

  return (
  
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
      {/* Header */}
     
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Building className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-700">{hotel.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{hotel.city}</span>
              <span className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                <Star className="h-3 w-3 mr-1" />
                {hotel.starCategory}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors bg-white text-sm"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Stay Details */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            Stay Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-500">Check-in</div>
                  <div className="font-semibold text-gray-700">Dec 25, 2025</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarDays className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-xs text-gray-500">Check-out</div>
                  <div className="font-semibold text-gray-700">Dec 26, 2025</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-xs text-gray-500">Total Guests</div>
                  <div className="font-semibold text-gray-700">{totalGuests} Guests</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <Bed className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-xs text-gray-500">Extra Beds</div>
                  <div className="font-semibold text-gray-700">{selection.childrenWithBed} beds</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
              <div className="text-center text-sm text-gray-700">
                <span className="font-semibold">{selection.roomCount} Room{selection.roomCount === 1 ? '' : 's'} • 1 night stay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Room Type */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Bed className="h-4 w-4 mr-2 text-purple-500" />
            Room Type
          </h3>
          
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-bold text-purple-700 text-lg">{room.type}</div>
                <div className="text-xs text-purple-600">Luxury accommodation</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Per night</div>
              <div className="font-bold text-purple-600">₹{room.price}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Rooms</div>
              <div className="font-bold text-gray-900">{selection.roomCount}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Adults</div>
              <div className="font-bold text-gray-900">{selection.adults}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Children</div>
              <div className="font-bold text-gray-900">{selection.childrenWithBed + selection.childrenWithoutBed}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Details Section */}
      {meals.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Utensils className="h-4 w-4 mr-2 text-orange-500" />
            Meal Selection
          </h3>
          
          <div className="space-y-4">
            {Object.keys(mealsByType).map(mealType => (
              <div key={mealType} className="border border-gray-100 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 capitalize mb-3 flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  {mealType} ({mealsByType[mealType].length} item{mealsByType[mealType].length === 1 ? '' : 's'})
                </h4>
                <div className="space-y-2">
                  {mealsByType[mealType].map((meal: Meal) => (
                    <div key={meal.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{meal.name}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            meal.category === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {meal.category.toUpperCase()}
                          </span>
                          <span className="ml-2">₹{meal.price} per person</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{meal.quantity} × ₹{meal.price}</div>
                        <div className="text-sm text-blue-600 font-bold">₹{meal.quantity * meal.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Meal Cost:</span>
                <span className="font-bold text-orange-700">₹{mealPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Summary at Bottom */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Receipt className="h-4 w-4 mr-2 text-green-500" />
          Booking Summary
        </h3>
        
        <div className="space-y-3">
          {/* Room Cost */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{selection.roomCount} {selection.roomCount === 1 ? 'room' : 'rooms'} × ₹{room.price}</div>
              <div className="text-xs text-gray-500">{room.type} Room</div>
            </div>
            <span className="font-semibold">₹{room.price * selection.roomCount}</span>
          </div>
          
          {/* Extra Beds */}
          {selection.childrenWithBed > 0 && (
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Extra beds × {selection.childrenWithBed}</div>
                <div className="text-xs text-gray-500">₹500 per bed</div>
              </div>
              <span className="font-semibold">₹{selection.childrenWithBed * 500}</span>
            </div>
          )}

          {/* Meal Cost */}
          {mealPrice > 0 && (
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Meals & Dining</div>
                <div className="text-xs text-gray-500">{Object.keys(mealsByType).length} meal type(s)</div>
              </div>
              <span className="font-semibold">₹{mealPrice}</span>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900 text-lg">Total Amount</span>
              <span className="font-bold text-green-600 text-xl">₹{totalPrice}</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center mb-3">
              <Users className="h-3 w-3 mr-1" />
              {selection.roomCount} {selection.roomCount === 1 ? 'room' : 'rooms'} • {totalGuests} guests • {room.type}
              {mealPrice > 0 && ` • ${Object.keys(mealsByType).length} meal type(s)`}
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-3 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">For 1 night:</span>
                <span className="font-bold text-green-700">₹{totalPrice}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                <div>Room: ₹{roomPrice}</div>
                {mealPrice > 0 && <div>Meals: ₹{mealPrice}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div> 
   
      
        
  );
}