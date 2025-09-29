"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Meal, Hotel, Transport, Activity, DaySelection, RoomSelection } from "@/types/type";

// Destination type
interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
}

// Room type
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

// Travelers type
interface Travelers {
  adults: number;
  children: number;
  infants: number;
}

// HotelInfo type
interface HotelInfo {
  id: string;
  name: string;
  city: string;
  starCategory: number;
  inclusions: string[];
  cancellation: string;
  photos: string[];
  agencyId: string;
  roomTypes: {
    id: string;
    type: string;
    price: string;
    hotelId: string;
  }[];
}

// RoomSelectionState type
type RoomSelectionState = 'browsing' | 'selecting-meals' | 'selecting-rooms' | 'confirmed';

interface QuotationContextType {
  // Destination related
  selectedDestination: Destination | null;
  setSelectedDestination: (destination: Destination | null) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  openDestination: (destination: Destination) => void;
  closeDestination: () => void;
  totalPackagePrice: number;
  setTotalPackagePrice: (price: number) => void;


  // Room related
  professionalRooms: Room[];
  setProfessionalRooms: (rooms: Room[]) => void;

  // Hotel Info state
  hotelInfo: HotelInfo[];
  setHotelInfo: (info: HotelInfo[]) => void;

  // Meal selection state
  selectedMeals: Meal[];
  setSelectedMeals: (meals: Meal[]) => void;
  updateMealQuantity: (mealId: number, quantity: number, mealData?: Meal) => void;
  clearMeals: () => void;

  // Client information
  clientName: string;
  setClientName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  emailAddress: string;
  setEmailAddress: (email: string) => void;

  // Trip details
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  tripDestination: string;
  setTripDestination: (destination: string) => void;

  // Travelers
  travelers: Travelers;
  setTravelers: (travelers: Travelers) => void;
  setAdults: (count: number) => void;
  setChildren: (count: number) => void;
  setInfants: (count: number) => void;

  // Day Selections
  daySelections: Record<string, DaySelection>;
  setDaySelections: (selections: Record<string, DaySelection>) => void;
  updateDaySelection: (date: string, updates: Partial<DaySelection>) => void;
  getDaySelectionsArray: () => Array<{date: string; data: DaySelection}>;
  areAllDaysCompleted: () => boolean;

  // Per-day selection states
  daySelectionStates: Record<string, {
    roomSelectionState: RoomSelectionState;
    selectedHotelTemp: Hotel | null;
    mealSelections: Meal[];
    roomSelections: RoomSelection[];
  }>;
  setDaySelectionState: (date: string, state: Partial<{
    roomSelectionState: RoomSelectionState;
    selectedHotelTemp: Hotel | null;
    mealSelections: Meal[];
    roomSelections: RoomSelection[];
  }>) => void;
  resetDaySelectionState: (date: string) => void;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
  // Destination states
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [show, setShow] = useState(true);
   const [totalPackagePrice, setTotalPackagePrice] = useState<number>(0);
  // Room states
  const [professionalRooms, setProfessionalRooms] = useState<Room[]>([
    {
      id: 1,
      type: "Deluxe Room",
      price: 3000,
      maxAdults: 2,
      maxChildren: 2,
      bedType: "King Size Bed",
      amenities: ["Free WiFi", "AC", "TV", "Breakfast", "King Bed"],
      description: "Spacious room with modern amenities and comfortable bedding",
      photos: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=250&fit=crop",
      ],
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
      photos: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=250&fit=crop",
      ],
    },
    {
      id: 3,
      type: "Suite Room",
      price: 6500,
      maxAdults: 4,
      maxChildren: 3,
      bedType: "King Size + Extra Bed",
      amenities: [
        "Free WiFi",
        "AC",
        "TV",
        "Breakfast",
        "Balcony",
        "Living Room",
        "Mini Bar",
      ],
      description: "Executive suite with separate living area and premium amenities",
      photos: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop",
      ],
    },
  ]);

  // Hotel Info state
  const [hotelInfo, setHotelInfo] = useState<HotelInfo[]>([]);

  // Meal selection state
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);

  // Day Selections state
  const [daySelections, setDaySelections] = useState<Record<string, DaySelection>>({});

  // Per-day selection states
  const [daySelectionStates, setDaySelectionStates] = useState<Record<string, {
    roomSelectionState: RoomSelectionState;
    selectedHotelTemp: Hotel | null;
    mealSelections: Meal[];
    roomSelections: RoomSelection[];
  }>>({});

  // Day selection state management
// In QuotationContext.tsx, replace the setDaySelectionState function with this:

// Day selection state management
const setDaySelectionState = (date: string, updates: Partial<{
  roomSelectionState: RoomSelectionState;
  selectedHotelTemp: Hotel | null;
  mealSelections: Meal[];
  roomSelections: RoomSelection[];
}>) => {
  setDaySelectionStates(prev => {
    // Get current state for this date or create default state
    const currentState = prev[date] || {
      roomSelectionState: 'browsing',
      selectedHotelTemp: null,
      mealSelections: [],
      roomSelections: []
    };
    
    return {
      ...prev,
      [date]: {
        ...currentState,
        ...updates
      }
    };
  });
};
 const resetDaySelectionState = (date: string) => {
  setDaySelectionStates(prev => ({
    ...prev,
    [date]: {
      roomSelectionState: 'browsing',
      selectedHotelTemp: null,
      mealSelections: [],
      roomSelections: []
    }
  }));
};

  // Meal management functions
  const updateMealQuantity = (mealId: number, quantity: number, mealData?: Meal) => {
    setSelectedMeals(prevMeals => {
      const existingMealIndex = prevMeals.findIndex(meal => meal.id === mealId);
      
      if (existingMealIndex >= 0) {
        // Update existing meal quantity
        if (quantity === 0) {
          // Remove meal if quantity is 0
          return prevMeals.filter(meal => meal.id !== mealId);
        } else {
          const updatedMeals = [...prevMeals];
          updatedMeals[existingMealIndex] = {
            ...updatedMeals[existingMealIndex],
            quantity: Math.max(0, quantity)
          };
          return updatedMeals;
        }
      } else if (mealData && quantity > 0) {
        // Add new meal with the provided data
        return [...prevMeals, { ...mealData, quantity: Math.max(0, quantity) }];
      }
      
      // If no meal data provided and meal doesn't exist, return unchanged
      return prevMeals;
    });
  };

  const clearMeals = () => {
    setSelectedMeals([]);
  };

  // Day selection management
  const updateDaySelection = (date: string, updates: Partial<DaySelection>) => {
    setDaySelections(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        ...updates,
        // Auto-calculate completion status
        isCompleted: !!(updates.hotel || prev[date]?.hotel) && 
                     !!(updates.transports || prev[date]?.transports) && 
                     !!((updates.activities && updates.activities.length > 0) || 
                        (prev[date]?.activities && prev[date].activities.length > 0))
      }
    }));
  };

  const getDaySelectionsArray = () => {
    return Object.entries(daySelections).map(([date, data]) => ({
      date,
      data
    }));
  };

  const areAllDaysCompleted = () => {
    const days = Object.values(daySelections);
    return days.length > 0 && days.every(day => day.isCompleted);
  };

  // Client information
  const [clientName, setClientName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");

  // Trip details
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [tripDestination, setTripDestination] = useState<string>("");

  // Travelers
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 2,
    children: 0,
    infants: 0,
  });

  // Helpers
  const setAdults = (count: number) => {
    setTravelers((prev) => ({ ...prev, adults: count }));
  };

  const setChildren = (count: number) => {
    setTravelers((prev) => ({ ...prev, children: count }));
  };

  const setInfants = (count: number) => {
    setTravelers((prev) => ({ ...prev, infants: count }));
  };

  const openDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    setShow(true);
  };

  const closeDestination = () => {
    setShow(false);
    setSelectedDestination(null);
  };

  return (
    <QuotationContext.Provider
      value={{
        // Destination
        selectedDestination,
        setSelectedDestination,
        show,
        setShow,
        openDestination,
        closeDestination,


           totalPackagePrice,
    setTotalPackagePrice,
        // Rooms
        professionalRooms,
        setProfessionalRooms,

        // Hotels
        hotelInfo,
        setHotelInfo,

        // Meals
        selectedMeals,
        setSelectedMeals,
        updateMealQuantity,
        clearMeals,

        // Client
        clientName,
        setClientName,
        phoneNumber,
        setPhoneNumber,
        emailAddress,
        setEmailAddress,

        // Trip
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        tripDestination,
        setTripDestination,

        // Travelers
        travelers,
        setTravelers,
        setAdults,
        setChildren,
        setInfants,

        // Day Selections
        daySelections,
        setDaySelections,
        updateDaySelection,
        getDaySelectionsArray,
        areAllDaysCompleted,

        // Per-day selection states
        daySelectionStates,
        setDaySelectionState,
        resetDaySelectionState,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (!context) {
    throw new Error("useQuotation must be used within QuotationProvider");
  }
  return context;
}