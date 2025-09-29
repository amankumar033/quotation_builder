import { Hotel, DaySelection, Meal, RoomSelection } from "@/types/type";
import HotelCard from "../PackageSelection/HotelCard";
import MealSelection from "../PackageSelection/MealSelection";
import RoomSelect from "../PackageSelection/RoomSelection";
import HotelSummary from "../PackageSelection/HotelSummary";
import { Building, ChevronUp, ChevronDown, ArrowLeft, CheckCircle, Home, Utensils, Bed, Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useQuotation } from "@/context/QuotationContext";

interface HotelSectionProps {
  date: string;
  daySelection: DaySelection;
  updateDaySelection: (date: string, updates: Partial<DaySelection>) => void;
  hotels: Hotel[];
  isHotelLoading: boolean;
  theme: any;
  isSectionActive: boolean;
  toggleSection: () => void;
  isHotelConfirmed: boolean;
}

// Hotel meals data
const hotelMeals: Meal[] = [
  {
    id: 1,
    hotelId: "HTL1",
    name: "Continental Breakfast",
    type: "breakfast",
    category: "veg",
    price: 450,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSIjnT16b72GWq4B8WZ2lhTxQLbT8ki6pdnQ&s",
    quantity: 0,
  },
  {
    id: 2,
    hotelId: "HTL2",
    name: "Indian Breakfast",
    type: "breakfast",
    category: "veg",
    price: 500,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm4nTDOsrHZwI3FAcGwx0ZAz8zb8MuHSs42Q&s",
    quantity: 0,
  },
  {
    id: 3,
    hotelId: "HTL1",
    name: "Buffet Lunch",
    type: "lunch",
    category: "veg",
    price: 900,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvyg6rtmkTDFrWLcHwjNOA02U15bKJ71IhRA&s",
    quantity: 0,
  },
  {
    id: 4,
    hotelId: "HTL3",
    name: "Vegetarian Thali",
    type: "lunch",
    category: "veg",
    price: 700,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-odM1YeL8AjwW3U3U82eWTk9ghO01egs6VA&s",
    quantity: 0,
  },
  {
    id: 5,
    hotelId: "HTL2",
    name: "Non-Veg Dinner",
    type: "dinner",
    category: "non-veg",
    price: 1200,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLvTQ0SeNN6VlqI7mcwPUpXXGEZKOTN_nB8A&s",
    quantity: 0,
  },
  {
    id: 6,
    hotelId: "HTL3",
    name: "South Indian Breakfast",
    type: "breakfast",
    category: "veg",
    price: 550,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH2M9v8uTuQRfbhdp8jU33_J_zAlQDBCsStg&s",
    quantity: 0,
  },
  {
    id: 7,
    hotelId: "HTL1",
    name: "Chinese Dinner",
    type: "dinner",
    category: "veg",
    price: 1000,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=250&fit=crop",
    quantity: 0,
  },
];

export default function HotelSection({
  date,
  daySelection,
  updateDaySelection,
  hotels,
  isHotelLoading,
  theme,
  isSectionActive,
  toggleSection,
  isHotelConfirmed
}: HotelSectionProps) {
  const { 
    updateDaySelection: contextUpdateDaySelection, 
    daySelections, 
    clearMeals,
    daySelectionStates,
    setDaySelectionState,
    resetDaySelectionState
  } = useQuotation();
  
  const [localHotelSearch, setLocalHotelSearch] = useState("");
  const [localStarFilter, setLocalStarFilter] = useState<number | null>(null);

  // Get per-day state for this specific date
  const dayState = daySelectionStates[date] || {
    roomSelectionState: 'browsing',
    selectedHotelTemp: null,
    mealSelections: [],
    roomSelections: []
  };

  // Filter hotels for this section - ALL hotels available
  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(localHotelSearch.toLowerCase()) &&
      (localStarFilter ? hotel.starCategory === localStarFilter : true)
  );

  // Calculate prices for summary
  const calculateHotelPrice = () => {
    if (!daySelection.hotel || !daySelection.roomSelections || daySelection.roomSelections.length === 0) return 0;
    
    const roomSelection = daySelection.roomSelections[0];
    return roomSelection.totalPrice || 0;
  };

  const calculateMealPrice = () => {
    if (!daySelection.meals) return 0;
    return daySelection.meals.reduce((total, meal) => total + (meal.price * meal.quantity), 0);
  };

  const totalHotelPrice = calculateHotelPrice() + calculateMealPrice();

  // Handle hotel selection - start the flow instead of directly selecting
  const handleHotelSelect = (hotelId: string) => {
    const hotel = hotels.find(h => h.id === hotelId);
    if (hotel) {
      handleViewDetails(hotel);
    }
  };

  const handleViewDetails = (hotel: Hotel) => {
    // Clear previous meal selections when starting new hotel selection
    clearMeals();
    // Filter meals for this specific hotel
    const hotelSpecificMeals = hotelMeals
      .filter(meal => meal.hotelId === hotel.id)
      .map(meal => ({ ...meal, quantity: 0 }));
    
    setDaySelectionState(date, {
      selectedHotelTemp: hotel,
      roomSelectionState: 'selecting-meals',
      mealSelections: hotelSpecificMeals
    });
  };

  const handleMealsChange = (meals: Meal[]) => {
    setDaySelectionState(date, { mealSelections: meals });
  };

  const handleRoomSelectionsChange = (selections: RoomSelection[]) => {
    setDaySelectionState(date, { roomSelections: selections });
  };

  const handleConfirmSelection = () => {
    if (dayState.selectedHotelTemp) {
      contextUpdateDaySelection(date, {
        hotel: dayState.selectedHotelTemp,
        meals: dayState.mealSelections.filter(m => m.quantity > 0),
        roomSelections: dayState.roomSelections,
        isCompleted: true
      });
    }
    setDaySelectionState(date, { roomSelectionState: 'confirmed' });
  };

  const handleEditSelection = () => {
    setDaySelectionState(date, { roomSelectionState: 'selecting-rooms' });
  };

  // Navigation handlers for this specific day
  const handleBackToHotels = () => {
    resetDaySelectionState(date);
  };

  const handleProceedToRooms = () => {
    setDaySelectionState(date, { 
      roomSelectionState: 'selecting-rooms',
      roomSelections: [{
        roomId: 1,
        roomCount: 1,
        dayNumber: Object.keys(daySelections).indexOf(date) + 1,
        adults: 2,
        childrenWithBed: 0,
        childrenWithoutBed: 0,
        adultsWithExtraBed: 0,
        totalPrice: 3000,
        isConfirmed: false,
        confirmedAt: ""
      }]
    });
  };

  const handleBackToMeals = () => {
    setDaySelectionState(date, { roomSelectionState: 'selecting-meals' });
  };

  // Compact Breadcrumb steps
  const breadcrumbSteps = [
    { 
      id: 'hotels', 
      label: 'Hotel', 
      icon: Home, 
      active: dayState.roomSelectionState === 'browsing',
      onClick: () => handleBackToHotels()
    },
    { 
      id: 'meals', 
      label: 'Meals', 
      icon: Utensils, 
      active: dayState.roomSelectionState === 'selecting-meals',
      onClick: () => setDaySelectionState(date, { roomSelectionState: 'selecting-meals' })
    },
    { 
      id: 'rooms', 
      label: 'Rooms', 
      icon: Bed, 
      active: dayState.roomSelectionState === 'selecting-rooms',
      onClick: () => setDaySelectionState(date, { roomSelectionState: 'selecting-rooms' })
    },
    { 
      id: 'confirmed', 
      label: 'Done', 
      icon: Check, 
      active: dayState.roomSelectionState === 'confirmed',
      onClick: () => {} // No action for confirmed state
    },
  ];

  const getCurrentStepIndex = () => {
    switch (dayState.roomSelectionState) {
      case 'browsing': return 0;
      case 'selecting-meals': return 1;
      case 'selecting-rooms': return 2;
      case 'confirmed': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div
        className={`px-6 py-4 cursor-pointer flex items-center justify-between transition-colors ${
          isSectionActive ? 'bg-gray-50' : 'hover:bg-gray-50'
        }`}
        onClick={toggleSection}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${theme.text} bg-opacity-10`}>
            <Building className={`h-5 w-5 ${theme.text}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hotel & Meals</h3>
            {daySelection.hotel && (
              <p className="text-sm text-gray-600 mt-1">
                {daySelection.hotel.name} • {daySelection.hotel.city}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
        
          
          {/* Price Summary - Center Aligned */}
          {daySelection.hotel && (
            <div className="text-center">
              <div className="text-sm font-semibold text-green-600">₹{totalHotelPrice}</div>
              <div className="text-xs text-gray-500">Hotel & Meals</div>
            </div>
          )}
          
          {daySelection.hotel && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Selected
            </span>
          )}
          {isSectionActive ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </div>
      </div>

      {isSectionActive && (
        
        <div className="px-6 py-4 border-t border-gray-200 animate-in fade-in duration-300">
            {/* Compact Breadcrumb - Only show when not browsing */}
          {(dayState.roomSelectionState !== 'browsing') && (
            <div className="flex items-center space-x-1 rounded-lg p-1 mb-5">
              {breadcrumbSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isClickable = index <= currentStepIndex && step.onClick;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={isClickable ? step.onClick : undefined}
                      disabled={!isClickable}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all text-xs ${
                        isCurrent 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : isCompleted
                          ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 cursor-pointer'
                          : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      } ${isClickable ? 'hover:shadow-sm' : ''}`}
                    >
                      <StepIcon className="h-3 w-3" />
                      <span className="font-medium">{step.label}</span>
                    </button>
                    {index < breadcrumbSteps.length - 1 && (
                      <div className={`mx-1 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`}>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {/* Browsing Hotels - Show for all days independently */}
          {dayState.roomSelectionState === 'browsing' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Search hotels by name..."
                  value={localHotelSearch}
                  onChange={(e) => setLocalHotelSearch(e.target.value)}
                  className="w-full md:w-1/2 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Filter by rating:</span>
                  {[3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setLocalStarFilter(localStarFilter === star ? null : star)}
                      className={`px-3 py-1 rounded-md border transition-all text-sm ${
                        localStarFilter === star
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>
              
              {isHotelLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      isSelected={daySelection.hotel?.id === hotel.id}
                      onSelect={handleHotelSelect}
                      onViewDetails={() => handleViewDetails(hotel)}
                      theme={theme}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selecting Meals */}
          {dayState.roomSelectionState === 'selecting-meals' && dayState.selectedHotelTemp && (
            <div className="space-y-6">
              {/* <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={handleBackToHotels}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Select Meals</h4>
                  <p className="text-sm text-gray-600">for {dayState.selectedHotelTemp.name}</p>
                </div>
              </div> */}

              <MealSelection
                hotel={dayState.selectedHotelTemp}
                meals={dayState.mealSelections}
                onMealsChange={handleMealsChange}
                onProceed={handleProceedToRooms}
                theme={theme}
              />
            </div>
          )}

          {/* Selecting Rooms */}
          {dayState.roomSelectionState === 'selecting-rooms' && dayState.selectedHotelTemp && (
            <div className="space-y-6">
              {/* <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={handleBackToMeals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Select Rooms</h4>
                  <p className="text-sm text-gray-600">for {dayState.selectedHotelTemp.name}</p>
                </div>
              </div> */}

              <RoomSelect
                hotel={dayState.selectedHotelTemp}
                selections={dayState.roomSelections}
                onSelectionsChange={handleRoomSelectionsChange}
                onConfirm={handleConfirmSelection}
                onBack={handleBackToMeals}
                theme={theme}
                currentDay={Object.keys(daySelections).indexOf(date) + 1}
              />
            </div>
          )}

          {/* Confirmed - Show Summary */}
          {dayState.roomSelectionState === 'confirmed' && daySelection.hotel && (
            <HotelSummary
              hotel={daySelection.hotel}
              selections={daySelection.roomSelections || []}
              meals={daySelection.meals || []}
              onEdit={handleEditSelection}
              theme={theme}
            />
          )}
        </div>
      )}
    </div>
  );
}