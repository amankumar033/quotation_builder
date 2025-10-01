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
  
  // Package Selection Flow
  packageSelectionStep: 'location' | 'selection';
  setPackageSelectionStep: (step: 'location' | 'selection') => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;

  // Room related
  professionalRooms: Room[];
  setProfessionalRooms: (rooms: Room[]) => void;

  // Hotel Info state
  hotelInfo: HotelInfo[];
  setHotelInfo: (info: HotelInfo[]) => void;

  // Meal selection state - PER DAY
  dayMeals: Record<string, Meal[]>; // date -> meals
  setDayMeals: (meals: Record<string, Meal[]>) => void;
  updateDayMealQuantity: (date: string, mealId: number, quantity: number, mealData?: Meal) => void;
  clearDayMeals: (date: string) => void;

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

  // Current editing day
  currentEditingDay: string | null;
  setCurrentEditingDay: (date: string | null) => void;

  // Current day meals (for meal selection component)
  currentDayMeals: Meal[];
  setCurrentDayMeals: (meals: Meal[]) => void;
  updateCurrentDayMealQuantity: (mealId: number, quantity: number, mealData?: Meal) => void;

  // Price calculation
  calculateDayPrice: (date: string) => { mealPrice: number; roomPrice: number; total: number };
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
  // Destination states
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [show, setShow] = useState(true);
  const [totalPackagePrice, setTotalPackagePrice] = useState<number>(0);
  
  // Package Selection Flow
  const [packageSelectionStep, setPackageSelectionStep] = useState<'location' | 'selection'>('location');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

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

  // Meal selection state - PER DAY
  const [dayMeals, setDayMeals] = useState<Record<string, Meal[]>>({});
  
  // Current day meals for meal selection component
  const [currentDayMeals, setCurrentDayMeals] = useState<Meal[]>([]);

  // Day Selections state
  const [daySelections, setDaySelections] = useState<Record<string, DaySelection>>({});
  
  // Current editing day
  const [currentEditingDay, setCurrentEditingDay] = useState<string | null>(null);

  // Meal management functions - PER DAY
  const updateDayMealQuantity = (date: string, mealId: number, quantity: number, mealData?: Meal): void => {
    setDayMeals(prev => {
      const currentMeals = prev[date] || [];
      const existingMealIndex = currentMeals.findIndex((meal: Meal) => meal.id === mealId);
      
      let newMeals: Meal[];
      if (existingMealIndex >= 0) {
        if (quantity === 0) {
          newMeals = currentMeals.filter((meal: Meal) => meal.id !== mealId);
        } else {
          newMeals = [...currentMeals];
          newMeals[existingMealIndex] = {
            ...newMeals[existingMealIndex],
            quantity: Math.max(0, quantity)
          };
        }
      } else if (mealData && quantity > 0) {
        newMeals = [...currentMeals, { ...mealData, quantity: Math.max(0, quantity) }];
      } else {
        newMeals = currentMeals;
      }
      
      return {
        ...prev,
        [date]: newMeals
      };
    });
  };

  const clearDayMeals = (date: string): void => {
    setDayMeals(prev => ({
      ...prev,
      [date]: []
    }));
  };

  // Current day meal management (for meal selection component)
  const updateCurrentDayMealQuantity = (mealId: number, quantity: number, mealData?: Meal): void => {
    if (!currentEditingDay) return;
    
    setCurrentDayMeals((prev: Meal[]) => {
      const existingIndex = prev.findIndex((meal: Meal) => meal.id === mealId);
      
      if (existingIndex >= 0) {
        if (quantity === 0) {
          // Remove meal if quantity is 0
          return prev.filter((meal: Meal) => meal.id !== mealId);
        } else {
          // Update quantity
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], quantity };
          return updated;
        }
      } else if (mealData && quantity > 0) {
        // Add new meal
        return [...prev, { ...mealData, quantity }];
      }
      
      return prev;
    });
  };

  // Calculate total price for day
  const calculateDayPrice = (date: string): { mealPrice: number; roomPrice: number; total: number } => {
    const day = daySelections[date];
    const meals = dayMeals[date] || [];
    
    const mealPrice = meals.reduce((total: number, meal: Meal) => total + (meal.price * meal.quantity), 0);
    const roomPrice = day?.roomSelections?.reduce((total: number, selection: RoomSelection) => total + selection.totalPrice, 0) || 0;
    
    return {
      mealPrice,
      roomPrice,
      total: mealPrice + roomPrice
    };
  };

  // Day selection management
  const updateDaySelection = (date: string, updates: Partial<DaySelection>): void => {
    setDaySelections(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        ...updates,
        isCompleted: !!(updates.hotel !== undefined ? updates.hotel : prev[date]?.hotel) && 
                     !!(updates.transports !== undefined ? updates.transports : prev[date]?.transports) && 
                     !!((updates.activities !== undefined ? updates.activities : prev[date]?.activities)?.length > 0)
      }
    }));
  };

  const getDaySelectionsArray = (): Array<{date: string; data: DaySelection}> => {
    return Object.entries(daySelections).map(([date, data]) => ({
      date,
      data
    }));
  };

  const areAllDaysCompleted = (): boolean => {
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
  const setAdults = (count: number): void => {
    setTravelers((prev) => ({ ...prev, adults: count }));
  };

  const setChildren = (count: number): void => {
    setTravelers((prev) => ({ ...prev, children: count }));
  };

  const setInfants = (count: number): void => {
    setTravelers((prev) => ({ ...prev, infants: count }));
  };

  const openDestination = (destination: Destination): void => {
    setSelectedDestination(destination);
    setShow(true);
  };

  const closeDestination = (): void => {
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
        
        // Package Selection Flow
        packageSelectionStep,
        setPackageSelectionStep,
        selectedLocation,
        setSelectedLocation,

        // Rooms
        professionalRooms,
        setProfessionalRooms,

        // Hotels
        hotelInfo,
        setHotelInfo,

        // Meals - PER DAY
        dayMeals,
        setDayMeals,
        updateDayMealQuantity,
        clearDayMeals,

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

        // Current editing day
        currentEditingDay,
        setCurrentEditingDay,

        // Current day meals
        currentDayMeals,
        setCurrentDayMeals,
        updateCurrentDayMealQuantity,

        // Price calculation
        calculateDayPrice,
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