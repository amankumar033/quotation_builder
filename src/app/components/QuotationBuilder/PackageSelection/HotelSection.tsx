"use client";

import { Hotel, DaySelection, Meal, RoomSelection, Activity } from "@/types/type";
import { ChevronDown, ChevronUp, Building, CheckCircle, Utensils, Bed, Home, MapPin, Star, Plus, Sparkles, Cake, Music, Gift, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuotation } from "@/context/QuotationContext";
import MealSelection from "./MealSelection";
import RoomSelect from "./RoomSelection";

interface HotelSectionProps {
  hotels: Hotel[];
  isHotelLoading: boolean;
  theme: { bg: string; text: string; border: string };
  isSectionActive: boolean;
  toggleSection: () => void;
  allDays: Array<{ date: string; data: DaySelection }>;
}

// Enhanced hotel meals data with proper hotel-specific meals
const hotelMeals: Meal[] = [
  // Hotel HTL1 - Luxury Hotel meals
  {
    id: 1,
    hotelId: "HTL1",
    name: "Continental Breakfast Buffet",
    type: "breakfast",
    category: "veg",
    price: 450,
    image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop",
    quantity: 0,
  },
  {
    id: 2,
    hotelId: "HTL1",
    name: "Indian Breakfast Platter",
    type: "breakfast",
    category: "veg",
    price: 500,
    image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop",
    quantity: 0,
  },
  {
    id: 3,
    hotelId: "HTL1",
    name: "Gourmet Lunch Buffet",
    type: "lunch",
    category: "veg",
    price: 900,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    quantity: 0,
  },
  {
    id: 4,
    hotelId: "HTL1",
    name: "Premium Vegetarian Dinner",
    type: "dinner",
    category: "veg",
    price: 850,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    quantity: 0,
  },
  {
    id: 5,
    hotelId: "HTL1",
    name: "Non-Veg Special Dinner",
    type: "dinner",
    category: "non-veg",
    price: 1200,
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400&h=300&fit=crop",
    quantity: 0,
  },

  // Hotel HTL2 - Business Hotel meals
  {
    id: 6,
    hotelId: "HTL2",
    name: "Executive Breakfast",
    type: "breakfast",
    category: "veg",
    price: 400,
    image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop",
    quantity: 0,
  },
  {
    id: 7,
    hotelId: "HTL2",
    name: "Business Lunch",
    type: "lunch",
    category: "veg",
    price: 750,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    quantity: 0,
  },
  {
    id: 8,
    hotelId: "HTL2",
    name: "Dinner Buffet",
    type: "dinner",
    category: "veg",
    price: 800,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    quantity: 0,
  },

  // Hotel HTL3 - Resort meals
  {
    id: 9,
    hotelId: "HTL3",
    name: "Luxury Breakfast Spread",
    type: "breakfast",
    category: "veg",
    price: 600,
    image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop",
    quantity: 0,
  },
  {
    id: 10,
    hotelId: "HTL3",
    name: "Resort Lunch Special",
    type: "lunch",
    category: "veg",
    price: 1100,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    quantity: 0,
  },
  {
    id: 11,
    hotelId: "HTL3",
    name: "Gourmet Dinner Experience",
    type: "dinner",
    category: "veg",
    price: 1300,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    quantity: 0,
  },
];

// Hotel-specific activities
const hotelActivities: Activity[] = [
  {
    id: "act-1",
    name: "Welcome Cake Cutting",
    description: "Special welcome cake cutting ceremony with personalized message",
    price: 1500,
    duration: "30 minutes",
    category: "celebration",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnCEAUa1MTb3uxLO7n6NUrti-8f9_l4VhuWQ&s",
    agencyId: "HTL1"
  },
  {
    id: "act-2",
    name: "Grand Welcome Entry",
    description: "Royal welcome with traditional music and flower shower",
    price: 2500,
    duration: "45 minutes",
    category: "welcome",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp5LA4nWC3x0Zir6mrFARB8LQ07w2S_A8skg&s",
    agencyId: "HTL1"
  },
  {
    id: "act-3",
    name: "Room Decoration",
    description: "Special room setup with flowers and candles",
    price: 2000,
    duration: "1 hour",
    category: "romance",
    image: "https://cheetah.cherishx.com/uploads/1557818214_large.jpg",
    agencyId: "HTL1"
  },
  {
    id: "act-4",
    name: "Business Center Access",
    description: "Premium business center access with meeting facilities",
    price: 1000,
    duration: "4 hours",
    category: "business",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsFIg9TgCUMlYb2zdBKY6euyEAZhBRhqpngA&s",
    agencyId: "HTL2"
  },
  {
    id: "act-5",
    name: "Executive Lounge Access",
    description: "Exclusive executive lounge with complimentary snacks",
    price: 1800,
    duration: "3 hours",
    category: "business",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuNA9OAii6p8-IgUjt11ZGRN6SUEhAQM_u-g&s",
    agencyId: "HTL2"
  },
  {
    id: "act-6",
    name: "Spa Welcome Package",
    description: "Relaxing spa welcome with aromatherapy and massage",
    price: 3000,
    duration: "1.5 hours",
    category: "wellness",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQimb2RvCKgElmeAepVK60B8gfMdhnyQQ5hrg&s",
    agencyId: "HTL3"
  },
  {
    id: "act-7",
    name: "Poolside Celebration",
    description: "Exclusive poolside celebration with drinks and snacks",
    price: 3500,
    duration: "2 hours",
    category: "celebration",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoNvHHkbvCWZG9drQmLbGuB0vcYg85oMOt4w&s",
    agencyId: "HTL3"
  }
];

// FIXED: Unified type for selection modes
type SelectionStep = 'hotel' | 'meals' | 'rooms' | 'activities' | 'completed';
type HotelSelectionMode = 'overview' | SelectionStep;

interface DayHotelProgress {
  date: string;
  dayNumber: number;
  currentStep: SelectionStep; // FIXED: Using unified type
  selectedHotel: Hotel | null;
  mealSelections: Meal[];
  roomSelections: RoomSelection[];
  activitySelections: Activity[];
}

// Define Room interface to match professionalRooms
interface Room {
  id: number;
  type: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  bedType: string;
  amenities: string[];
  description: string;
  photos: string[];
}

// Breadcrumb item type - FIXED: Using unified SelectionStep type
interface BreadcrumbItem {
  label: string;
  step: SelectionStep;
  icon: React.ComponentType<any>;
}

export default function HotelSection({
  hotels,
  isHotelLoading,
  theme,
  isSectionActive,
  toggleSection,
  allDays,
}: HotelSectionProps) {
  const { 
    daySelections,
    updateDaySelection,
    currentEditingDay,
    setCurrentEditingDay,
    dayMeals,
    calculateDayPrice,
    professionalRooms
  } = useQuotation();

  const [selectionMode, setSelectionMode] = useState<HotelSelectionMode>('overview');
  const [dayProgress, setDayProgress] = useState<DayHotelProgress | null>(null);
  const [showActivities, setShowActivities] = useState<boolean>(false);

  // Breadcrumb items - FIXED: Using SelectionStep type
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Select Hotel', step: 'hotel', icon: Building },
    { label: 'Choose Meals', step: 'meals', icon: Utensils },
    { label: 'Room Selection', step: 'rooms', icon: Bed },
    { label: 'Add Activities', step: 'activities', icon: Sparkles },
  ];

  // Initialize day progress from existing selections
  const initializeDayProgress = (date: string, dayNumber: number): void => {
    const existingDay = daySelections[date];
    const existingMeals = dayMeals[date] || [];
    
    let currentStep: SelectionStep = 'hotel';
    if (existingDay?.roomSelections && existingDay.roomSelections.length > 0) {
      currentStep = 'completed';
    } else if (existingDay?.activities && existingDay.activities.length > 0) {
      currentStep = 'activities';
    } else if (existingDay?.meals && existingDay.meals.length > 0) {
      currentStep = 'rooms';
    } else if (existingDay?.hotel) {
      currentStep = 'meals';
    }

    setDayProgress({
      date,
      dayNumber,
      currentStep,
      selectedHotel: existingDay?.hotel || null,
      mealSelections: existingMeals,
      roomSelections: existingDay?.roomSelections || [],
      activitySelections: existingDay?.activities || []
    });
  };

  const handleStartHotelSelection = (date: string, dayNumber: number): void => {
    setCurrentEditingDay(date);
    initializeDayProgress(date, dayNumber);
    setSelectionMode('hotel'); // FIXED: Set to 'hotel' instead of 'selecting-hotel'
  };

  const handleHotelSelect = (hotel: Hotel): void => {
    if (!dayProgress) return;
    
    const updatedProgress: DayHotelProgress = {
      ...dayProgress,
      selectedHotel: hotel,
      currentStep: 'meals'
    };
    
    setDayProgress(updatedProgress);
    
    // Update global state
    updateDaySelection(dayProgress.date, {
      hotel: hotel
    });
    
    setSelectionMode('meals'); // FIXED: Set to 'meals' instead of 'selecting-meals'
  };

  const handleMealsConfirm = (meals: Meal[]): void => {
    if (!dayProgress) return;
    
    const updatedProgress: DayHotelProgress = {
      ...dayProgress,
      mealSelections: meals,
      currentStep: 'rooms'
    };
    
    setDayProgress(updatedProgress);
    
    // Update global state - store meals in both daySelections and dayMeals
    updateDaySelection(dayProgress.date, {
      meals: meals
    });
    
    setSelectionMode('rooms'); // FIXED: Set to 'rooms' instead of 'selecting-rooms'
  };

  const handleRoomsConfirm = (roomSelections: RoomSelection[]): void => {
    if (!dayProgress) return;
    
    const updatedProgress: DayHotelProgress = {
      ...dayProgress,
      roomSelections,
      currentStep: 'activities'
    };
    
    setDayProgress(updatedProgress);
    
    // Update global state
    updateDaySelection(dayProgress.date, {
      roomSelections: roomSelections.map(selection => ({
        ...selection,
        dayNumber: dayProgress.dayNumber
      }))
    });
    
    setSelectionMode('activities'); // FIXED: Set to 'activities' instead of 'selecting-activities'
  };

  const handleActivitiesConfirm = (activities: Activity[]): void => {
    if (!dayProgress) return;
    
    const updatedProgress: DayHotelProgress = {
      ...dayProgress,
      activitySelections: activities,
      currentStep: 'completed'
    };
    
    setDayProgress(updatedProgress);
    
    // Update global state
    updateDaySelection(dayProgress.date, {
      activities: activities,
      isCompleted: true
    });
    
    // Return to overview
    setTimeout(() => {
      setSelectionMode('overview');
      setCurrentEditingDay(null);
    }, 500);
  };

  const handleBackToOverview = (): void => {
    setSelectionMode('overview');
    setCurrentEditingDay(null);
  };

  const handleBackToHotelSelection = (): void => {
    setSelectionMode('hotel'); // FIXED: Set to 'hotel'
  };

  const handleBackToMealSelection = (): void => {
    setSelectionMode('meals'); // FIXED: Set to 'meals'
  };

  const handleBackToRoomSelection = (): void => {
    setSelectionMode('rooms'); // FIXED: Set to 'rooms'
  };

  const handleEditDay = (date: string, dayNumber: number): void => {
    handleStartHotelSelection(date, dayNumber);
  };

  const handleAddActivities = (date: string, dayNumber: number): void => {
    setCurrentEditingDay(date);
    initializeDayProgress(date, dayNumber);
    setSelectionMode('activities'); // FIXED: Set to 'activities'
  };

  // Breadcrumb navigation handler - FIXED: Using SelectionStep type
  const handleBreadcrumbClick = (step: SelectionStep): void => {
    if (!dayProgress) return;
    
    // Only allow navigation to completed or current steps
    const currentStepIndex = breadcrumbItems.findIndex(item => item.step === dayProgress.currentStep);
    const targetStepIndex = breadcrumbItems.findIndex(item => item.step === step);
    
    if (targetStepIndex <= currentStepIndex) {
      setSelectionMode(step);
    }
  };

  // Calculate total hotel price for all days
  const calculateTotalPrice = (): number => {
    return allDays.reduce((total: number, { date }) => {
      const dayPrice = calculateDayPrice(date);
      return total + dayPrice.total;
    }, 0);
  };

  // Enhanced price calculation that includes meals and activities
  const calculateDayTotalWithMeals = (date: string): { 
    roomPrice: number; 
    mealPrice: number;
    activityPrice: number;
    total: number;
    hasMeals: boolean;
    hasActivities: boolean;
  } => {
    const dayPrice = calculateDayPrice(date);
    const daySelection = daySelections[date];
    
    // Get meals for this day
    const mealsFromContext = dayMeals[date] || [];
    const mealsFromSelections = daySelection?.meals || [];
    const allMeals = [...mealsFromContext, ...mealsFromSelections];
    
    // Calculate actual meal price
    const actualMealPrice = allMeals.reduce((total: number, meal: Meal) => {
      return total + (meal.price * (meal.quantity || 0));
    }, 0);
    
    // Calculate activity price
    const activityPrice = daySelection?.activities?.reduce((total: number, activity: Activity) => {
      return total + activity.price;
    }, 0) || 0;
    
    const hasMeals = actualMealPrice > 0;
    const hasActivities = activityPrice > 0;
    
    return {
      roomPrice: dayPrice.roomPrice,
      mealPrice: actualMealPrice,
      activityPrice: activityPrice,
      total: dayPrice.roomPrice + actualMealPrice + activityPrice,
      hasMeals: hasMeals,
      hasActivities: hasActivities
    };
  };

  const totalPrice = calculateTotalPrice();
  const completedDays = allDays.filter(({ date }) => daySelections[date]?.hotel).length;
  const hasHotelSelected = completedDays > 0;

  // FIXED: Using SelectionStep type for steps
  const steps: Array<{ id: SelectionStep | 'completed'; label: string; icon: React.ComponentType<any> }> = [
    { id: 'hotel', label: 'Select Hotel', icon: Home },
    { id: 'meals', label: 'Choose Meals', icon: Utensils },
    { id: 'rooms', label: 'Room Selection', icon: Bed },
    { id: 'activities', label: 'Add Activities', icon: Sparkles },
    { id: 'completed', label: 'Completed', icon: CheckCircle }
  ];

  // Get hotel-specific activities
  const getHotelActivities = (hotelId: string): Activity[] => {
    return hotelActivities.filter(activity => activity.agencyId === hotelId);
  };

  // Handle undefined category safely
  const getActivityIcon = (category: string) => {
    switch (category) {
      case 'celebration': return <Cake className="h-4 w-4" />;
      case 'welcome': return <Music className="h-4 w-4" />;
      case 'romance': return <Sparkles className="h-4 w-4" />;
      case 'business': return <Building className="h-4 w-4" />;
      case 'wellness': return <Gift className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  // Handle undefined amenities safely - using hotel inclusions as amenities
  const getHotelAmenities = (hotel: Hotel): string[] => {
    return hotel.inclusions || ['Free WiFi', 'Air Conditioning', 'Room Service'];
  };

  // Get room price from hotel data
  const getHotelPrice = (hotel: Hotel): number => {
    return hotel.roomTypes?.[0]?.price ? parseInt(hotel.roomTypes[0].price) : 3000;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className={`p-6 cursor-pointer transition-all duration-300 ${
          isSectionActive ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-white'
        }`}
        onClick={toggleSection}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${theme.bg} flex items-center justify-center`}>
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Hotel & Accommodation</h3>
              <p className="text-sm text-gray-600">
                {hasHotelSelected 
                  ? `${completedDays}/${allDays.length} days configured • ₹${totalPrice}`
                  : `Configure hotels for ${allDays.length} days`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {hasHotelSelected && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{completedDays}/{allDays.length} Days</span>
              </div>
            )}
            {isSectionActive ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {isSectionActive && (
        <div className="p-6 border-t border-gray-200">
          {/* Breadcrumb Navigation - Only show when in selection flow */}
          {selectionMode !== 'overview' && dayProgress && (
            <div className="mb-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBackToOverview}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to Overview</span>
                </button>
                <span className="text-gray-400">/</span>
                <div className="flex items-center space-x-1">
                  {breadcrumbItems.map((item, index) => {
                    const IconComponent = item.icon;
                    const isActive = selectionMode === item.step;
                    const isCompleted = breadcrumbItems.findIndex(b => b.step === dayProgress.currentStep) > breadcrumbItems.findIndex(b => b.step === item.step);
                    const isClickable = isCompleted || isActive;
                    
                    return (
                      <div key={item.step} className="flex items-center">
                        {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                        <button
                          onClick={() => isClickable && handleBreadcrumbClick(item.step)}
                          disabled={!isClickable}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            isActive 
                              ? 'text-blue-600 font-semibold' 
                              : isCompleted 
                                ? 'text-green-600 hover:text-green-800 font-medium' 
                                : 'text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{item.label}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Current Day Info */}
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  Day {dayProgress.dayNumber}
                </span>
                <span>
                  {new Date(dayProgress.date).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {dayProgress.selectedHotel && (
                  <span className="text-green-600 font-medium">
                    • {dayProgress.selectedHotel.name}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Overview Mode - Enhanced UI */}
          {selectionMode === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allDays.map(({ date, data }, index) => {
                  const dayNumber = index + 1;
                  const hasHotel = data.hotel;
                  const dayTotal = calculateDayTotalWithMeals(date);
                  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  // Get meals for this day
                  const mealsFromContext = dayMeals[date] || [];
                  const mealsFromSelections = data.meals || [];
                  const allMeals = [...mealsFromContext, ...mealsFromSelections];
                  
                  // Filter unique meals by id and quantity > 0
                  const uniqueMeals = allMeals.reduce((acc: Meal[], meal) => {
                    const existing = acc.find(m => m.id === meal.id);
                    if (!existing && meal.quantity && meal.quantity > 0) {
                      acc.push(meal);
                    }
                    return acc;
                  }, []);

                  // Get room type name
                  const roomSelection = data.roomSelections?.[0];
                  const roomType = roomSelection ? 
                    professionalRooms.find((room: Room) => room.id === roomSelection.roomId)?.type : 
                    'Room';

                  // Get hotel activities
                  const hotelActivities = data.activities || [];

                  return (
                    <div
                      key={date}
                      className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                        hasHotel 
                          ? 'border-green-100 bg-white shadow-sm hover:shadow-md' 
                          : 'border-gray-100 bg-gray-50 hover:border-blue-200 hover:shadow-md'
                      }`}
                    >
                      {/* Day Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            hasHotel ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                          }`}>
                            <span className="font-bold text-sm">{dayNumber}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-base">Day {dayNumber}</h4>
                            <p className="text-sm text-gray-500">{formattedDate}</p>
                          </div>
                        </div>
                        {hasHotel ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Plus className="h-5 w-5 text-blue-500" />
                        )}
                      </div>

                      {hasHotel ? (
                        <div className="space-y-4">
                          {/* Hotel Info - Enhanced */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-bold text-gray-900 text-sm">{data.hotel?.name}</span>
                                  <span className="flex items-center text-xs text-white bg-blue-600 px-2 py-1 rounded-full">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {data.hotel?.city}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                  <span className="font-medium">{data.hotel?.starCategory} Stars • </span>
                                  <span className="ml-1 text-green-600 font-semibold">Confirmed</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Room Information - Enhanced */}
                          {roomSelection && (
                            <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                              <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                <Bed className="h-4 w-4 mr-2 text-blue-600" />
                                Room Details
                              </div>
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {roomSelection.roomCount} × {roomType}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {roomSelection.adults} adults, {roomSelection.childrenWithBed + roomSelection.childrenWithoutBed} children
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-gray-900">₹{roomSelection.totalPrice || dayTotal.roomPrice}</div>
                                  <div className="text-xs text-gray-500">Room Cost</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Meal Information - Enhanced */}
                          {dayTotal.hasMeals && (
                            <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                              <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                <Utensils className="h-4 w-4 mr-2 text-orange-600" />
                                Selected Meals
                              </div>
                              <div className="space-y-2">
                                {uniqueMeals.slice(0, 2).map((meal, mealIndex) => (
                                  <div key={mealIndex} className="flex justify-between items-center text-sm">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{meal.name}</div>
                                      <div className="text-xs text-gray-500 capitalize">{meal.type}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold text-gray-900">
                                        {meal.quantity} × ₹{meal.price}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {uniqueMeals.length > 2 && (
                                  <div className="text-xs text-blue-600 text-center pt-1">
                                    +{uniqueMeals.length - 2} more meals
                                  </div>
                                )}
                                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold text-sm">
                                  <span className="text-gray-700">Total Meal Cost:</span>
                                  <span className="text-orange-600">₹{dayTotal.mealPrice}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Activities Information - New Section */}
                          {dayTotal.hasActivities && (
                            <div className="border border-purple-200 rounded-lg p-3 bg-purple-50 shadow-sm">
                              <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                                Hotel Activities
                              </div>
                              <div className="space-y-2">
                                {hotelActivities.slice(0, 2).map((activity, activityIndex) => (
                                  <div key={activityIndex} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 flex items-center">
                                        {getActivityIcon(activity.category)}
                                        <span className="ml-2">{activity.name}</span>
                                      </div>
                                      <div className="text-xs text-gray-500">{activity.duration}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-semibold text-purple-600">₹{activity.price}</div>
                                    </div>
                                  </div>
                                ))}
                                {hotelActivities.length > 2 && (
                                  <div className="text-xs text-purple-600 text-center pt-1">
                                    +{hotelActivities.length - 2} more activities
                                  </div>
                                )}
                                <div className="border-t border-purple-200 pt-2 mt-2 flex justify-between font-semibold text-sm">
                                  <span className="text-gray-700">Activities Total:</span>
                                  <span className="text-purple-600">₹{dayTotal.activityPrice}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Final Price Summary - Enhanced */}
                          <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg p-4 border border-green-300 shadow-sm">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Room Cost:</span>
                                <span className="font-semibold text-gray-900">₹{dayTotal.roomPrice}</span>
                              </div>
                              {dayTotal.mealPrice > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Meal Cost:</span>
                                  <span className="font-semibold text-gray-900">₹{dayTotal.mealPrice}</span>
                                </div>
                              )}
                              {dayTotal.activityPrice > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">Activities:</span>
                                  <span className="font-semibold text-gray-900">₹{dayTotal.activityPrice}</span>
                                </div>
                              )}
                              <div className="border-t border-green-300 pt-2 mt-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-base text-gray-900">Total for Day {dayNumber}:</span>
                                  <span className="font-bold text-lg text-green-600">₹{dayTotal.total}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons - Enhanced with Add Activities */}
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDay(date, dayNumber);
                              }}
                              className="flex-1 py-2.5 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
                            >
                              Edit Selection
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddActivities(date, dayNumber);
                              }}
                              className="flex-1 py-2.5 text-purple-600 hover:text-purple-800 text-sm font-medium border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors duration-200 flex items-center justify-center"
                            >
                              <Sparkles className="h-4 w-4 mr-1" />
                              Add Activities
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Empty State - Enhanced */
                        <div 
                          className="text-center py-6 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => handleStartHotelSelection(date, dayNumber)}
                        >
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Home className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="text-gray-600 text-sm mb-3">No hotel selected for this day</p>
                          <button className="text-blue-600 hover:text-blue-800 font-medium py-2 px-4 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                            Select Hotel
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total Summary Card - Enhanced */}
              {hasHotelSelected && (
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Hotel Stay Summary</h3>
                      <p className="text-sm text-gray-600">
                        {completedDays} out of {allDays.length} days configured
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{totalPrice}</div>
                      <div className="text-sm text-gray-600">Total Accommodation Cost</div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Completion Progress</span>
                      <span>{Math.round((completedDays / allDays.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(completedDays / allDays.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Hotel Selection Flow */}
          {selectionMode !== 'overview' && dayProgress && (
            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6 px-4">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const stepIndex = steps.findIndex(s => s.id === step.id);
                  const currentStepIndex = steps.findIndex(s => s.id === dayProgress.currentStep);
                  const isCompleted = currentStepIndex > stepIndex;
                  const isCurrent = step.id === dayProgress.currentStep;
                  
                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center h-12 w-12 rounded-full border-2 ${
                          isCompleted ? 'bg-green-500 border-green-500 text-white' :
                          isCurrent ? 'bg-blue-500 border-blue-500 text-white' :
                          'bg-white border-gray-300 text-gray-400'
                        } transition-all duration-300`}>
                          {isCompleted ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <StepIcon className="h-5 w-5" />
                          )}
                        </div>
                        <span className={`mt-2 text-xs font-medium text-center max-w-20 ${
                          isCurrent ? 'text-blue-600 font-semibold' : 
                          isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        } transition-colors duration-300`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hotel Selection - Using Dynamic Hotels from API */}
              {selectionMode === 'hotel' && ( // FIXED: Changed from 'selecting-hotel'
                <div className="space-y-4">
                  {isHotelLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-gray-500 mt-4 text-lg">Loading hotels...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hotels.map((hotel) => (
                        <div
                          key={hotel.id}
                          className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                            dayProgress.selectedHotel?.id === hotel.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                          }`}
                          onClick={() => handleHotelSelect(hotel)}
                        >
                          {/* Hotel Image */}
                          <div className="h-40 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                            {hotel.photos && hotel.photos.length > 0 ? (
                              <img
                                src={hotel.photos[0]}
                                alt={hotel.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                                <Building className="h-12 w-12 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h5 className="font-bold text-gray-900 text-base mb-1">{hotel.name}</h5>
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {hotel.city}
                              </div>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < hotel.starCategory
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  {hotel.starCategory} Star Hotel
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold">Starting from:</span> ₹{getHotelPrice(hotel)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getHotelAmenities(hotel).slice(0, 3).join(' • ')}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-green-600 text-sm font-semibold">
                              Available
                            </span>
                            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                              {dayProgress.selectedHotel?.id === hotel.id ? 'Selected ✓' : 'Select Hotel'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Meal Selection */}
              {selectionMode === 'meals' && dayProgress.selectedHotel && ( // FIXED: Changed from 'selecting-meals'
                <div className="space-y-6">
                  <MealSelection
                    hotel={dayProgress.selectedHotel}
                    meals={hotelMeals.filter(meal => meal.hotelId === dayProgress.selectedHotel?.id)}
                    onMealsChange={handleMealsConfirm}
                    onProceed={() => {
                      // Proceed to room selection
                      setSelectionMode('rooms');
                    }}
                    onBack={handleBackToHotelSelection}
                    theme={theme}
                  />
                </div>
              )}

              {/* Room Selection */}
              {selectionMode === 'rooms' && dayProgress.selectedHotel && ( // FIXED: Changed from 'selecting-rooms'
                <div className="space-y-6">
                  <RoomSelect
                    hotel={dayProgress.selectedHotel}
                    selections={dayProgress.roomSelections}
                    onSelectionsChange={handleRoomsConfirm}
                    onConfirm={() => {}} // Handled by onSelectionsChange
                    onBack={handleBackToMealSelection}
                    theme={theme}
                    currentDay={dayProgress.dayNumber}
                  />
                </div>
              )}

              {/* Activities Selection - New Section */}
              {selectionMode === 'activities' && dayProgress.selectedHotel && ( // FIXED: Changed from 'selecting-activities'
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getHotelActivities(dayProgress.selectedHotel.id).map((activity) => {
                      const isSelected = dayProgress.activitySelections.some(
                        selected => selected.id === activity.id
                      );
                      
                      return (
                        <div
                          key={activity.id}
                          className={`border-2 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'border-purple-500 bg-purple-50 shadow-lg scale-[1.02]' 
                              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                          }`}
                          onClick={() => {
                            let updatedActivities: Activity[];
                            if (isSelected) {
                              updatedActivities = dayProgress.activitySelections.filter(
                                selected => selected.id !== activity.id
                              );
                            } else {
                              updatedActivities = [...dayProgress.activitySelections, activity];
                            }
                            handleActivitiesConfirm(updatedActivities);
                          }}
                        >
                          <div className="h-50  relative overflow-hidden">
                        <img src={activity.image} alt="" className="object-cover w-full h-full" />
                            <div className="absolute top-3 right-3">
                              {getActivityIcon(activity.category)}
                            </div>
                            <div className="absolute bottom-3 left-3 text-white">
                              <span className="text-xs bg-purple-700 px-2 py-1 rounded-full">
                                {activity.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-bold text-gray-900 text-sm flex-1">{activity.name}</h5>
                              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ml-2 ${
                                isSelected 
                                  ? 'bg-purple-500 border-purple-500 text-white' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && '✓'}
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                              {activity.description}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                              <span className="flex items-center">
                                <Sparkles className="h-3 w-3 mr-1" />
                                {activity.duration}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-purple-600">
                                ₹{activity.price}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isSelected 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {isSelected ? 'Selected' : 'Add Activity'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Activities Summary */}
                  {dayProgress.activitySelections.length > 0 && (
                    <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                        Selected Activities ({dayProgress.activitySelections.length})
                      </h5>
                      <div className="space-y-2">
                        {dayProgress.activitySelections.map((activity) => (
                          <div key={activity.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                            <div className="flex items-center">
                              {getActivityIcon(activity.category)}
                              <span className="ml-2 font-medium text-sm">{activity.name}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-purple-600">₹{activity.price}</div>
                              <div className="text-xs text-gray-500">{activity.duration}</div>
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-purple-200 pt-2 mt-2 flex justify-between font-semibold">
                          <span>Activities Total:</span>
                          <span className="text-purple-600">
                            ₹{dayProgress.activitySelections.reduce((sum, activity) => sum + activity.price, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confirm Button */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={handleBackToRoomSelection}
                      className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back to Rooms
                    </button>
                    <button
                      onClick={() => handleActivitiesConfirm(dayProgress.activitySelections)}
                      className="px-8 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Confirm Activities
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}