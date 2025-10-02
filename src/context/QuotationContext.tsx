"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Meal, Hotel, Transport, Activity, DaySelection, RoomSelection, TransportRoute, Destination } from "@/types/type";

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

interface Travelers {
  adults: number;
  children: number;
  infants: number;
}

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
  selectedDestination: Destination | null;
  setSelectedDestination: (destination: Destination | null) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  openDestination: (destination: Destination) => void;
  closeDestination: () => void;
  totalPackagePrice: number;
  setTotalPackagePrice: (price: number) => void;
  
  packageSelectionStep: 'location' | 'selection';
  setPackageSelectionStep: (step: 'location' | 'selection') => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  isLocationSelected: boolean;
  setIsLocationSelected: (selected: boolean) => void;

  professionalRooms: Room[];
  setProfessionalRooms: (rooms: Room[]) => void;

  hotelInfo: HotelInfo[];
  setHotelInfo: (info: HotelInfo[]) => void;

  dayMeals: Record<string, Meal[]>;
  setDayMeals: (meals: Record<string, Meal[]>) => void;
  updateDayMealQuantity: (date: string, mealId: number, quantity: number, mealData?: Meal) => void;
  clearDayMeals: (date: string) => void;

  clientName: string;
  setClientName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  emailAddress: string;
  setEmailAddress: (email: string) => void;

  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  tripDestination: string;
  setTripDestination: (destination: string) => void;

  travelers: Travelers;
  setTravelers: (travelers: Travelers) => void;
  setAdults: (count: number) => void;
  setChildren: (count: number) => void;
  setInfants: (count: number) => void;

  daySelections: Record<string, DaySelection>;
  setDaySelections: (selections: Record<string, DaySelection>) => void;
  updateDaySelection: (date: string, updates: Partial<DaySelection>) => void;
  getDaySelectionsArray: () => Array<{date: string; data: DaySelection}>;
  areAllDaysCompleted: () => boolean;

  currentEditingDay: string | null;
  setCurrentEditingDay: (date: string | null) => void;

  currentDayMeals: Meal[];
  setCurrentDayMeals: (meals: Meal[]) => void;
  updateCurrentDayMealQuantity: (mealId: number, quantity: number, mealData?: Meal) => void;

  calculateDayPrice: (date: string) => { mealPrice: number; roomPrice: number; total: number };

  transportRoutes: TransportRoute[];
  setTransportRoutes: (routes: TransportRoute[]) => void;
  addTransportRoute: (route: Omit<TransportRoute, 'id'>) => void;
  updateTransportRoute: (id: string, updates: Partial<TransportRoute>) => void;
  deleteTransportRoute: (id: string) => void;
  getRoutesForDay: (dayNumber: number) => TransportRoute[];
  addPickupRoute: (pickupLocation: string, hotelName: string) => void;
  removePickupRoute: () => void;

  pickupLocation: string;
  setPickupLocation: (location: string) => void;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [show, setShow] = useState(true);
  const [totalPackagePrice, setTotalPackagePrice] = useState<number>(0);
  
  const [packageSelectionStep, setPackageSelectionStep] = useState<'location' | 'selection'>('location');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);

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

  const [hotelInfo, setHotelInfo] = useState<HotelInfo[]>([]);
  const [dayMeals, setDayMeals] = useState<Record<string, Meal[]>>({});
  const [currentDayMeals, setCurrentDayMeals] = useState<Meal[]>([]);
  const [daySelections, setDaySelections] = useState<Record<string, DaySelection>>({});
  const [currentEditingDay, setCurrentEditingDay] = useState<string | null>(null);
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>([]);
  const [pickupLocation, setPickupLocation] = useState<string>("");

  const [clientName, setClientName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [tripDestination, setTripDestination] = useState<string>("");
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 2,
    children: 0,
    infants: 0,
  });

  // Transport Route Functions
  const addTransportRoute = (route: Omit<TransportRoute, 'id'>) => {
    const newRoute: TransportRoute = {
      ...route,
      id: `route_${Date.now()}`
    };
    setTransportRoutes(prev => [...prev, newRoute]);
  };

  const updateTransportRoute = (id: string, updates: Partial<TransportRoute>) => {
    setTransportRoutes(prev => 
      prev.map(route => route.id === id ? { ...route, ...updates } : route)
    );
  };

  const deleteTransportRoute = (id: string) => {
    setTransportRoutes(prev => prev.filter(route => route.id !== id));
  };

  const getRoutesForDay = (dayNumber: number): TransportRoute[] => {
    return transportRoutes.filter(route => route.dayNumber === dayNumber);
  };

  const addPickupRoute = (pickupLocation: string, hotelName: string) => {
    const pickupRoute: TransportRoute = {
      id: `pickup_${Date.now()}`,
      from: pickupLocation,
      to: hotelName,
      type: 'pickup',
      dayNumber: 1,
      vehicle: {
        id: 0,
        name: "Complimentary Pickup",
        type: "Pickup Service",
        capacity: travelers.adults + travelers.children,
        price: 0,
        features: ["Complimentary", "Professional Driver"],
        image: "",
        passengers: travelers.adults + travelers.children,
        perDay: 0,
        perKm: 0,
        photos: "",
        maxCapacity: travelers.adults + travelers.children,
        vehicleType: "Pickup"
      },
      price: 0,
      isComplimentary: true
    };
    setTransportRoutes(prev => [pickupRoute, ...prev]);
  };

  const removePickupRoute = () => {
    setTransportRoutes(prev => prev.filter(route => !route.isComplimentary));
  };

  // Meal Functions
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

  const updateCurrentDayMealQuantity = (mealId: number, quantity: number, mealData?: Meal): void => {
    if (!currentEditingDay) return;
    
    setCurrentDayMeals((prev: Meal[]) => {
      const existingIndex = prev.findIndex((meal: Meal) => meal.id === mealId);
      
      if (existingIndex >= 0) {
        if (quantity === 0) {
          return prev.filter((meal: Meal) => meal.id !== mealId);
        } else {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], quantity };
          return updated;
        }
      } else if (mealData && quantity > 0) {
        return [...prev, { ...mealData, quantity }];
      }
      
      return prev;
    });
  };

  // Day Selection Functions
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

  const updateDaySelection = (date: string, updates: Partial<DaySelection>): void => {
    setDaySelections(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        ...updates,
        isCompleted: !!(updates.hotel ?? prev[date]?.hotel) && 
                     !!(updates.transports ?? prev[date]?.transports) && 
                     !!((updates.activities ?? prev[date]?.activities)?.length > 0)
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

  // Traveler Functions
  const setAdults = (count: number): void => {
    setTravelers((prev) => ({ ...prev, adults: count }));
  };

  const setChildren = (count: number): void => {
    setTravelers((prev) => ({ ...prev, children: count }));
  };

  const setInfants = (count: number): void => {
    setTravelers((prev) => ({ ...prev, infants: count }));
  };

  // Destination Functions
  const openDestination = (destination: Destination): void => {
    setSelectedDestination(destination);
    setShow(true);
  };

  const closeDestination = (): void => {
    setShow(false);
    setSelectedDestination(null);
  };

  const value: QuotationContextType = {
    selectedDestination,
    setSelectedDestination,
    show,
    setShow,
    openDestination,
    closeDestination,
    totalPackagePrice,
    setTotalPackagePrice,
    
    packageSelectionStep,
    setPackageSelectionStep,
    selectedLocation,
    setSelectedLocation,
    isLocationSelected,
    setIsLocationSelected,

    professionalRooms,
    setProfessionalRooms,

    hotelInfo,
    setHotelInfo,

    dayMeals,
    setDayMeals,
    updateDayMealQuantity,
    clearDayMeals,

    clientName,
    setClientName,
    phoneNumber,
    setPhoneNumber,
    emailAddress,
    setEmailAddress,

    startDate,
    setStartDate,
    endDate,
    setEndDate,
    tripDestination,
    setTripDestination,

    travelers,
    setTravelers,
    setAdults,
    setChildren,
    setInfants,

    daySelections,
    setDaySelections,
    updateDaySelection,
    getDaySelectionsArray,
    areAllDaysCompleted,

    currentEditingDay,
    setCurrentEditingDay,

    currentDayMeals,
    setCurrentDayMeals,
    updateCurrentDayMealQuantity,

    calculateDayPrice,

    transportRoutes,
    setTransportRoutes,
    addTransportRoute,
    updateTransportRoute,
    deleteTransportRoute,
    getRoutesForDay,
    addPickupRoute,
    removePickupRoute,

    pickupLocation,
    setPickupLocation,
  };

  return (
    <QuotationContext.Provider value={value}>
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