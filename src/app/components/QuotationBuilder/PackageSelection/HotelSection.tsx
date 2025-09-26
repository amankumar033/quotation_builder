import { Hotel, DaySelection, Meal, RoomSelection } from "@/types/type";
import HotelCard from "../PackageSelection/HotelCard";
import MealSelection from "../PackageSelection/MealSelection";
import RoomSelect from "../PackageSelection/RoomSelection";
import HotelSummary from "../PackageSelection/HotelSummary";
import { Building, ChevronUp, ChevronDown, ArrowLeft, Star, Utensils, Bed, CheckCircle, IndianRupee } from "lucide-react";
import { useState } from "react";

interface HotelSectionProps {
  daySelection: DaySelection;
  updateDaySelection: (dayNumber: number, updates: Partial<DaySelection>) => void;
  hotels: Hotel[];
  isHotelLoading: boolean;
  roomSelectionState: string;
  setRoomSelectionState: (state: any) => void;
  theme: any;
  show: boolean;
  setShow: (show: boolean) => void;
  updateData: (data: any) => void;
  isSectionActive: boolean;
  toggleSection: () => void;
  selectedHotelForRooms: Hotel | null;
  currentDayForRooms: number;
  mealSelections: Meal[];
  roomSelections: RoomSelection[];
  onViewHotelMeals: (hotel: Hotel, dayNumber: number) => void;
  onBackToHotels: () => void;
  onProceedToRooms: () => void;
  onBackToMeals: () => void;
  onConfirmRoomSelection: () => void;
  onEditRoomSelection: () => void;
  onMealsChange: (meals: Meal[]) => void;
  onRoomSelectionsChange: (selections: RoomSelection[]) => void;
  isHotelConfirmed: boolean;
}

const hotelMeals: Meal[] = [
  // Your meal data here
];

// Room types with prices (should match your RoomSelect component)
const roomTypes = [
  { id: 1, type: "Deluxe Room", price: 3000 },
  { id: 2, type: "Super Deluxe Room", price: 4500 },
  { id: 3, type: "Suite Room", price: 6500 }
];

// Format price with Indian Rupee symbol - MOVED TO TOP LEVEL
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN').format(price);
};

export default function HotelSection({
  daySelection,
  updateDaySelection,
  hotels,
  isHotelLoading,
  roomSelectionState,
  setRoomSelectionState,
  theme,
  show,
  setShow,
  updateData,
  isSectionActive,
  toggleSection,
  selectedHotelForRooms,
  currentDayForRooms,
  mealSelections,
  roomSelections,
  onViewHotelMeals,
  onBackToHotels,
  onProceedToRooms,
  onBackToMeals,
  onConfirmRoomSelection,
  onEditRoomSelection,
  onMealsChange,
  isHotelConfirmed,
  onRoomSelectionsChange
}: HotelSectionProps) {
  const [hotelSearch, setHotelSearch] = useState("");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const isCurrentDayDetails = currentDayForRooms === daySelection.day && roomSelectionState !== 'browsing';

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) &&
      (starFilter ? hotel.starCategory === starFilter : true)
  );

  const selectHotelForDay = (hotel: Hotel | null) => {
  updateDaySelection(daySelection.day, { selectedHotel: hotel });
};

  // Get selected room type with price
  const getSelectedRoomType = () => {
    if (!roomSelections || roomSelections.length === 0) return null;
    const roomSelection = roomSelections[0];
    
    const roomType = roomTypes.find(room => room.id === roomSelection.roomId);
    if (!roomType) return null;
    
    return {
      type: roomType.type,
      price: roomType.price,
      roomCount: roomSelection.roomCount,
      totalPrice: roomSelection.totalPrice
    };
  };

  // Get selected meals summary with prices
  const getSelectedMealsSummary = () => {
    if (!mealSelections || mealSelections.length === 0) return null;
    
    const selectedMeals = mealSelections.filter(meal => meal.quantity > 0);
    if (selectedMeals.length === 0) return null;
    
    return selectedMeals.map(meal => `${meal.type} (₹${formatPrice(meal.price)})`).join(', ');
  };

  // Calculate total meal price
  const getTotalMealPrice = () => {
    if (!mealSelections || mealSelections.length === 0) return 0;
    return mealSelections.reduce((total, meal) => total + (meal.price * meal.quantity), 0);
  };

  // Handle breadcrumb click
  const handleBreadcrumbClick = (stepId: string) => {
    switch (stepId) {
      case 'hotel':
        onBackToHotels();
        break;
      case 'meals':
        if (roomSelectionState === 'selecting-rooms' || roomSelectionState === 'confirmed') {
          onBackToMeals();
        }
        break;
      case 'rooms':
        if (roomSelectionState === 'confirmed') {
          onEditRoomSelection();
        }
        break;
      default:
        break;
    }
  };

  // Get current step status for breadcrumb
  const getBreadcrumbSteps = () => {
    const steps = [
      { 
        id: 'hotel', 
        label: 'Select Hotel', 
        icon: Building, 
        active: roomSelectionState === 'browsing',
        completed: roomSelectionState !== 'browsing',
        clickable: roomSelectionState !== 'browsing'
      },
      { 
        id: 'meals', 
        label: 'Select Meals', 
        icon: Utensils, 
        active: roomSelectionState === 'selecting-meals',
        completed: roomSelectionState === 'selecting-rooms' || roomSelectionState === 'confirmed',
        price: getTotalMealPrice(),
        clickable: roomSelectionState === 'selecting-rooms' || roomSelectionState === 'confirmed'
      },
      { 
        id: 'rooms', 
        label: 'Select Rooms', 
        icon: Bed, 
        active: roomSelectionState === 'selecting-rooms',
        completed: roomSelectionState === 'confirmed',
        clickable: roomSelectionState === 'confirmed'
      },
      { 
        id: 'confirmed', 
        label: 'Confirmed', 
        icon: CheckCircle, 
        active: roomSelectionState === 'confirmed',
        completed: false,
        clickable: false
      }
    ];

    return steps;
  };

  const breadcrumbSteps = getBreadcrumbSteps();
  const selectedRoom = getSelectedRoomType();
  const selectedMealsSummary = getSelectedMealsSummary();

  return (
    <div className="border rounded-xl border-gray-200 overflow-hidden">
      <div 
        className={`px-6 py-4 cursor-pointer text-gray-500 bg-gray-50`}
        onClick={toggleSection}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/hotels.png" alt="" className="w-5 h-5 mr-2" />
            <h4 className="text-lg font-semibold">Select Hotel for Day {daySelection.day}</h4>
          </div>
          <div className="flex items-center space-x-2">
            {daySelection.selectedHotel && (
              <span className={`px-2 py-1 rounded-full text-sm ${
                isSectionActive ? 'bg-white text-gray-800' : 'bg-green-100 text-green-800'
              }`}>
                Selected
              </span>
            )}
            {isSectionActive ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {isSectionActive && (
        <div className="p-6">
          {isCurrentDayDetails && selectedHotelForRooms ? (
            <div className="rounded-xl border-2 border-gray-100">
              {/* Header Section */}
              <div className="flex items-center justify-between px-6 py-4 cursor-pointer border-b border-gray-200" onClick={() => setShow(!show)}>
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
                      
                      {/* Selection info next to star rating - KEPT AS REQUESTED */}
                      {(selectedRoom || selectedMealsSummary) && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="flex items-center space-x-2 text-sm">
                            {selectedRoom && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                                <Bed className="h-3 w-3 mr-1" />
                                {selectedRoom.type} - ₹{formatPrice(selectedRoom.price)}
                                {selectedRoom.roomCount > 1 && (
                                  <span className="ml-1 bg-blue-200 px-1 rounded text-xs">
                                    ×{selectedRoom.roomCount}
                                  </span>
                                )}
                              </span>
                            )}
                            {selectedMealsSummary && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                                <Utensils className="h-3 w-3 mr-1" />
                                {selectedMealsSummary}
                              </span>
                            )}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Total price display when room is selected - KEPT AS REQUESTED */}
                  {/* {selectedRoom && (
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-green-50 px-3 py-2 rounded-lg border border-blue-200">
                      <IndianRupee className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-green-700">
                        ₹{formatPrice(selectedRoom.totalPrice)}/night
                      </span>
                    </div>
                  )} */}
                  
                
                  {show ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>

              {/* Breadcrumb Navigation */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {breadcrumbSteps.map((step, index) => {
                      const StepIcon = step.icon;
                      const isLastStep = index === breadcrumbSteps.length - 1;
                      
                      return (
                        <div key={step.id} className="flex items-center">
                          <button
                            onClick={() => step.clickable && handleBreadcrumbClick(step.id)}
                            disabled={!step.clickable}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                              step.active 
                                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                                : step.completed
                                  ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-500 border border-gray-200'
                            } ${
                              step.clickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                            }`}
                          >
                            <StepIcon className="h-4 w-4" />
                            <span className="font-medium text-sm">{step.label}</span>
                            {step.price && step.price > 0 && (
                              <span className="bg-white px-2 py-1 rounded text-xs font-bold ml-2">
                                ₹{formatPrice(step.price)}
                              </span>
                            )}
                          </button>
                          {!isLastStep && (
                            <div className="mx-2 text-gray-400">
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Current step status moved to right side */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="text-sm font-medium">Current:</span>
                    {breadcrumbSteps.find(step => step.active) && (() => {
                      const activeStep = breadcrumbSteps.find(step => step.active);
                      const ActiveIcon = activeStep?.icon || Building;
                      return (
                        <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-full border border-gray-300">
                          <ActiveIcon className="h-3 w-3" />
                          <span className="text-sm font-medium">{activeStep?.label}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
              
              {show && (
                <div className="p-6">
                  {roomSelectionState === 'selecting-meals' && (
                    <MealSelection
                      hotel={selectedHotelForRooms}
                      meals={mealSelections}
                      onMealsChange={onMealsChange}
                      onProceed={onProceedToRooms}
                      theme={theme}
                    />
                  )}

                  {roomSelectionState === 'selecting-rooms' && (
                    <RoomSelect
                      hotel={selectedHotelForRooms}
                      selections={roomSelections}
                      onSelectionsChange={onRoomSelectionsChange}
                      onConfirm={onConfirmRoomSelection}
                      onBack={onBackToMeals}
                      theme={theme}
                      currentDay={daySelection.day} 
                    />
                  )}

                  {roomSelectionState === 'confirmed' && (
                    <HotelSummary
                      hotel={selectedHotelForRooms}
                      selections={roomSelections}
                      meals={mealSelections.filter(meal => meal.quantity > 0)}
                      onEdit={onEditRoomSelection}
                      theme={theme}
                    />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
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
  isSelected={daySelection.selectedHotel?.id === hotel.id}
  onSelect={() => selectHotelForDay(hotel)}
  onViewDetails={() => onViewHotelMeals(hotel, daySelection.day)}
  theme={theme}
/>

                    ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ChevronRight icon component
const ChevronRight = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);