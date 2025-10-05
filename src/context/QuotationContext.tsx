"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Meal, Hotel, Transport, Activity, DaySelection, RoomSelection, TransportRoute, Destination, DayItinerary, QuotationData, ServiceItem } from "@/types/type";

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
  // Destination
  selectedDestination: Destination | null;
  setSelectedDestination: (destination: Destination | null) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  openDestination: (destination: Destination) => void;
  closeDestination: () => void;
  
  // Rooms & Hotels
  professionalRooms: Room[];
  setProfessionalRooms: (rooms: Room[]) => void;
  hotelInfo: HotelInfo[];
  setHotelInfo: (info: HotelInfo[]) => void;

  // Meals
  dayMeals: Record<string, Meal[]>;
  setDayMeals: (meals: Record<string, Meal[]>) => void;
  updateDayMealQuantity: (date: string, mealId: number, quantity: number, mealData?: Meal) => void;
  clearDayMeals: (date: string) => void;

  // Client Information
  clientName: string;
  setClientName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  emailAddress: string;
  setEmailAddress: (email: string) => void;

  // Trip Details
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  tripDestination: string;
  setTripDestination: (destination: string) => void;
  selectedLocation: string;

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
  getCompletionStatus: () => { isComplete: boolean; completedDays: number; totalDays: number; message: string };
  debugDayCompletions: () => void;

  // Current Editing Day
  currentEditingDay: string | null;
  setCurrentEditingDay: (date: string | null) => void;

  // Current Day Meals
  currentDayMeals: Meal[];
  setCurrentDayMeals: (meals: Meal[]) => void;
  updateCurrentDayMealQuantity: (mealId: number, quantity: number, mealData?: Meal) => void;

  // Pricing
  totalPackagePrice: number;
  setTotalPackagePrice: (price: number) => void;
  calculateDayPrice: (date: string) => { mealPrice: number; roomPrice: number; activityPrice: number; total: number };
  calculateTotalPackagePrice: () => number;

  // Final pricing from customization step
  finalGrandTotal: number;
  setFinalGrandTotal: (total: number) => void;
  markupPercentage: number;
  setMarkupPercentage: (percentage: number) => void;
  discountAmount: number;
  setDiscountAmount: (amount: number) => void;

  // Transport
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

  // Custom Activities
  customActivities: Activity[];
  setCustomActivities: (activities: Activity[]) => void;
  addCustomActivity: (activity: Omit<Activity, 'id'>) => void;
  updateCustomActivity: (id: string, updates: Partial<Activity>) => void;
  deleteCustomActivity: (id: string) => void;

  // Day Itinerary
  dayItineraries: DayItinerary[];
  setDayItineraries: (itineraries: DayItinerary[]) => void;
  addDayItinerary: (itinerary: Omit<DayItinerary, 'id'>) => void;
  updateDayItinerary: (id: string, updates: Partial<DayItinerary>) => void;
  deleteDayItinerary: (id: string) => void;
  getItineraryForDay: (dayNumber: number) => DayItinerary | undefined;

  // Complete Quotation Data Management
  quotationData: QuotationData;
  setQuotationData: (data: QuotationData) => void;
  updateQuotationData: (updates: Partial<QuotationData>) => void;
  exportQuotationData: () => any;

  // Helper for all days
  allDays: Array<{date: string; data: DaySelection}>;

  // Hotel total price
  hotelTotalPrice: number;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
  // Destination State
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [show, setShow] = useState(true);

  // Pricing State
  const [totalPackagePrice, setTotalPackagePrice] = useState<number>(0);
  
  // Final pricing state from customization
  const [finalGrandTotal, setFinalGrandTotal] = useState<number>(0);
  const [markupPercentage, setMarkupPercentage] = useState<number>(15);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Hotel total price state
  const [hotelTotalPrice, setHotelTotalPrice] = useState<number>(0);

  // Rooms & Hotels State
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

  // Meals State
  const [dayMeals, setDayMeals] = useState<Record<string, Meal[]>>({});
  const [currentDayMeals, setCurrentDayMeals] = useState<Meal[]>([]);

  // Client Information State
  const [clientName, setClientName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [tripDestination, setTripDestination] = useState<string>("");

  // Travelers State
  const [travelers, setTravelers] = useState<Travelers>({
    adults: 2,
    children: 0,
    infants: 0,
  });

  // Day Selections State
  const [daySelections, setDaySelections] = useState<Record<string, DaySelection>>({});
  const [currentEditingDay, setCurrentEditingDay] = useState<string | null>(null);

  // Transport State
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>([]);
  const [pickupLocation, setPickupLocation] = useState<string>("");

  // Custom Activities State
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);
  
  // Day Itineraries State
  const [dayItineraries, setDayItineraries] = useState<DayItinerary[]>([]);

  // Complete Quotation Data State
  const [quotationData, setQuotationData] = useState<QuotationData>({
    client: {
      name: "",
      phone: "",
      email: "",
      destination: "",
      startDate: "",
      endDate: "",
      adults: 2,
      children: 0,
      infants: 0,
    },
    trip: {
      destination: "",
      startDate: "",
      endDate: "",
      adults: 2,
      children: 0,
      infants: 0,
      duration: 0,
      quoteNumber: `TQ-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    },
    services: [],
    markupPercentage: 15,
    termsConditions: "",
    specialNotes: "",
    agencyLogo: null,
    discountAmount: 0,
    paymentTerms: "Net 30",
    contactInfo: "",
    agencyName: "TravelPro Agency",
    quoteNumber: `TQ-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  });

  // Selected location (alias for tripDestination)
  const selectedLocation = tripDestination;

  // Update quotation data when context data changes
  useEffect(() => {
    updateQuotationData({
      client: {
        name: clientName,
        phone: phoneNumber,
        email: emailAddress,
        destination: tripDestination,
        startDate: startDate,
        endDate: endDate,
        adults: travelers.adults,
        children: travelers.children,
        infants: travelers.infants,
      },
      trip: {
        destination: tripDestination,
        startDate: startDate,
        endDate: endDate,
        adults: travelers.adults,
        children: travelers.children,
        infants: travelers.infants,
        duration: calculateTripDuration(),
        quoteNumber: quotationData.trip.quoteNumber
      },
      markupPercentage: markupPercentage,
      discountAmount: discountAmount
    });
  }, [clientName, phoneNumber, emailAddress, tripDestination, startDate, endDate, travelers, markupPercentage, discountAmount]);

  // NEW: Sync finalGrandTotal with quotationData
  useEffect(() => {
    if (finalGrandTotal > 0) {
      updateQuotationData({
        totalPackagePrice: finalGrandTotal,
        finalGrandTotal: finalGrandTotal
      });
    }
  }, [finalGrandTotal]);

  // Calculate trip duration
  const calculateTripDuration = (): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  };

  // Calculate total hotel price for all days (rooms + meals + activities)
  const calculateHotelTotalPrice = (): number => {
    const allDays = getDaySelectionsArray();
    let total = 0;
    
    allDays.forEach(({ date }) => {
      const daySelection = daySelections[date];
      
      // Calculate room price for this day
      const roomPrice = daySelection?.roomSelections?.reduce((sum: number, selection: RoomSelection) => {
        return sum + (selection.totalPrice || 0);
      }, 0) || 0;
      
      // Calculate meal price for this day - include both dayMeals and daySelections.meals
      const mealsFromContext = dayMeals[date] || [];
      const mealsFromSelections = daySelection?.meals || [];
      const allMeals = [...mealsFromContext, ...mealsFromSelections];
      
      const mealPrice = allMeals.reduce((sum: number, meal: Meal) => {
        return sum + (meal.price * (meal.quantity || 0));
      }, 0);
      
      // Calculate activity price for this day
      const activityPrice = daySelection?.activities?.reduce((total: number, activity: Activity) => {
        return total + (activity.price || 0);
      }, 0) || 0;
      
      // Add to total
      total += roomPrice + mealPrice + activityPrice;
    });
    
    return total;
  };

  // Update hotel total price whenever relevant data changes
  useEffect(() => {
    const newHotelTotal = calculateHotelTotalPrice();
    setHotelTotalPrice(newHotelTotal);
  }, [daySelections, dayMeals]);

  // Calculate total package price including all components
  const calculateTotalPackagePrice = (): number => {
    let total = hotelTotalPrice;

    // Calculate transport costs
    const transportCost = transportRoutes.reduce((sum: number, route: TransportRoute) => sum + (route.price || 0), 0);
    total += transportCost;

    return total;
  };

  // Update total package price whenever relevant data changes
  useEffect(() => {
    const newTotal = calculateTotalPackagePrice();
    setTotalPackagePrice(newTotal);
    
    // Also update final grand total if it's not set yet
    if (finalGrandTotal === 0) {
      setFinalGrandTotal(newTotal);
    }
  }, [hotelTotalPrice, transportRoutes]);

  // Update quotation data
  const updateQuotationData = (updates: Partial<QuotationData>) => {
    setQuotationData(prev => ({
      ...prev,
      ...updates,
      client: { ...prev.client, ...(updates.client || {}) },
      trip: { ...prev.trip, ...(updates.trip || {}) }
    }));
  };

  // Export all quotation data for logging and use
  const exportQuotationData = () => {
    // Calculate services array from day selections
    const services: ServiceItem[] = Object.entries(daySelections).flatMap(([date, dayData]) => {
      const dayServices: ServiceItem[] = [];
      
      // Hotel service
      if (dayData.hotel && dayData.roomSelections && dayData.roomSelections.length > 0) {
        const roomSelection = dayData.roomSelections[0];
        dayServices.push({
          id: `hotel-${date}`,
          name: `${dayData.hotel.name}`,
          type: 'hotel',
          price: roomSelection.totalPrice,
          quantity: 1,
          details: {
            hotel: dayData.hotel,
            roomSelection,
            date
          }
        });
      }

      // Transport service
      if (dayData.transports) {
        dayServices.push({
          id: `transport-${date}`,
          name: dayData.transports.name,
          type: 'car',
          price: dayData.transports.price || 0,
          quantity: 1,
          details: {
            transport: dayData.transports,
            date
          }
        });
      }

      // Meal services
      const dayMealsForDate = dayMeals[date] || [];
      dayMealsForDate.forEach(meal => {
        if (meal.quantity > 0) {
          dayServices.push({
            id: `meal-${date}-${meal.id}`,
            name: meal.name,
            type: 'meal',
            price: meal.price * meal.quantity,
            quantity: meal.quantity,
            details: {
              meal,
              date
            }
          });
        }
      });

      // Activity services
      if (dayData.activities) {
        dayData.activities.forEach(activity => {
          dayServices.push({
            id: `activity-${date}-${activity.id}`,
            name: activity.name,
            type: 'activity',
            price: activity.price,
            quantity: 1,
            details: {
              activity,
              date
            }
          });
        });
      }

      return dayServices;
    });

    const allData = {
      // Complete quotation data
      quotationData: {
        ...quotationData,
        services,
        totalPackagePrice: finalGrandTotal > 0 ? finalGrandTotal : totalPackagePrice,
        selectedHotel: daySelections[Object.keys(daySelections)[0]]?.hotel?.name || null,
        selectedVehicle: transportRoutes[0]?.vehicle?.name || null,
        selectedMealIds: Object.values(dayMeals).flat().map(meal => meal.id.toString()),
        selectedActivityIds: Object.values(daySelections).flatMap(day => day.activities?.map(act => act.id) || []),
        itinerary: dayItineraries,
        finalGrandTotal: finalGrandTotal > 0 ? finalGrandTotal : totalPackagePrice,
        markupPercentage,
        discountAmount
      },
      
      // Individual sections for detailed logging
      clientInfo: {
        name: clientName,
        phone: phoneNumber,
        email: emailAddress,
        destination: tripDestination
      },
      
      tripDetails: {
        startDate,
        endDate,
        duration: calculateTripDuration(),
        travelers
      },
      
      destinationInfo: {
        selectedDestination
      },
      
      packageSelection: {
        daySelections,
        totalDays: Object.keys(daySelections).length,
        completedDays: Object.values(daySelections).filter(day => !!day.hotel).length
      },
      
      transport: {
        routes: transportRoutes,
        totalRoutes: transportRoutes.length,
        totalCost: transportRoutes.reduce((sum, route) => sum + (route.price || 0), 0)
      },
      
      activities: {
        customActivities,
        dayItineraries,
        totalActivities: customActivities.length + dayItineraries.length
      },
      
      pricing: {
        totalPackagePrice: finalGrandTotal > 0 ? finalGrandTotal : totalPackagePrice,
        markupPercentage,
        discountAmount,
        calculatedTotal: totalPackagePrice,
        finalGrandTotal
      }
    };
    
    console.log("=== COMPLETE QUOTATION DATA ===", allData);
    return allData;
  };

  // Custom Activities Functions
  const addCustomActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `custom_${Date.now()}`,
      isCustom: true
    };
    setCustomActivities(prev => [...prev, newActivity]);
  };

  const updateCustomActivity = (id: string, updates: Partial<Activity>) => {
    setCustomActivities(prev => 
      prev.map(activity => activity.id === id ? { ...activity, ...updates } : activity)
    );
  };

  const deleteCustomActivity = (id: string) => {
    setCustomActivities(prev => prev.filter(activity => activity.id !== id));
  };

  // Day Itinerary Functions
  const addDayItinerary = (itinerary: Omit<DayItinerary, 'id'>) => {
    const newItinerary: DayItinerary = {
      ...itinerary,
      id: `itinerary_${Date.now()}`
    };
    setDayItineraries(prev => [...prev, newItinerary]);
  };

  const updateDayItinerary = (id: string, updates: Partial<DayItinerary>) => {
    setDayItineraries(prev => 
      prev.map(itinerary => itinerary.id === id ? { ...itinerary, ...updates } : itinerary)
    );
  };

  const deleteDayItinerary = (id: string) => {
    setDayItineraries(prev => prev.filter(itinerary => itinerary.id !== id));
  };

  const getItineraryForDay = (dayNumber: number): DayItinerary | undefined => {
    return dayItineraries.find(itinerary => itinerary.dayNumber === dayNumber);
  };

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

  // Day Selection Functions - includes activityPrice and combines meal sources
  const calculateDayPrice = (date: string): { mealPrice: number; roomPrice: number; activityPrice: number; total: number } => {
    const day = daySelections[date];
    
    // Get meals from both dayMeals and daySelections
    const mealsFromContext = dayMeals[date] || [];
    const mealsFromSelections = day?.meals || [];
    const allMeals = [...mealsFromContext, ...mealsFromSelections];
    
    const mealPrice = allMeals.reduce((total: number, meal: Meal) => total + (meal.price * meal.quantity), 0);
    const roomPrice = day?.roomSelections?.reduce((total: number, selection: RoomSelection) => total + selection.totalPrice, 0) || 0;
    const activityPrice = day?.activities?.reduce((total: number, activity: Activity) => total + activity.price, 0) || 0;
    
    return {
      mealPrice,
      roomPrice,
      activityPrice,
      total: mealPrice + roomPrice + activityPrice
    };
  };

  const updateDaySelection = (date: string, updates: Partial<DaySelection>): void => {
    setDaySelections(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        ...updates,
        // Only require hotel for completion
        isCompleted: !!(updates.hotel ?? prev[date]?.hotel)
      }
    }));
  };

  const getDaySelectionsArray = (): Array<{date: string; data: DaySelection}> => {
    return Object.entries(daySelections).map(([date, data]) => ({
      date,
      data
    }));
  };

  // Only require hotels for completion
  const areAllDaysCompleted = (): boolean => {
    const days = Object.values(daySelections);
    return days.length > 0 && days.every(day => !!day.hotel);
  };

  // Better completion status with detailed info
  const getCompletionStatus = () => {
    const days = Object.values(daySelections);
    const totalDays = days.length;
    
    if (totalDays === 0) {
      return {
        isComplete: false,
        completedDays: 0,
        totalDays: 0,
        message: "No days configured"
      };
    }

    const completedDays = days.filter(day => !!day.hotel).length;
    const isComplete = completedDays === totalDays;

    return {
      isComplete,
      completedDays,
      totalDays,
      message: isComplete 
        ? "All days have hotels configured" 
        : `${completedDays}/${totalDays} days have hotels configured`
    };
  };

  // Debug function to check what's missing
  const debugDayCompletions = () => {
    const days = getDaySelectionsArray();
    console.log("=== DAY COMPLETION DEBUG ===");
    days.forEach(({ date, data }, index) => {
      console.log(`Day ${index + 1} (${date}):`, {
        hasHotel: !!data.hotel,
        hotelName: data.hotel?.name,
        hasTransport: !!data.transports,
        transportName: data.transports?.name,
        hasActivities: !!(data.activities && data.activities.length > 0),
        activitiesCount: data.activities?.length,
        isCompleted: data.isCompleted
      });
    });
    
    const completionStatus = getCompletionStatus();
    console.log("Overall Completion:", completionStatus);
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

  // Helper for all days
  const allDays = getDaySelectionsArray();

  const value: QuotationContextType = {
    // Destination
    selectedDestination,
    setSelectedDestination,
    show,
    setShow,
    openDestination,
    closeDestination,

    // Pricing
    totalPackagePrice,
    setTotalPackagePrice,
    calculateTotalPackagePrice,
    finalGrandTotal,
    setFinalGrandTotal,
    markupPercentage,
    setMarkupPercentage,
    discountAmount,
    setDiscountAmount,

    // Rooms & Hotels
    professionalRooms,
    setProfessionalRooms,
    hotelInfo,
    setHotelInfo,

    // Meals
    dayMeals,
    setDayMeals,
    updateDayMealQuantity,
    clearDayMeals,

    // Client Information
    clientName,
    setClientName,
    phoneNumber,
    setPhoneNumber,
    emailAddress,
    setEmailAddress,

    // Trip Details
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    tripDestination,
    setTripDestination,
    selectedLocation,

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
    getCompletionStatus,
    debugDayCompletions,

    // Current Editing Day
    currentEditingDay,
    setCurrentEditingDay,

    // Current Day Meals
    currentDayMeals,
    setCurrentDayMeals,
    updateCurrentDayMealQuantity,

    // Pricing Calculation
    calculateDayPrice,

    // Transport
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

    // Custom Activities
    customActivities,
    setCustomActivities,
    addCustomActivity,
    updateCustomActivity,
    deleteCustomActivity,

    // Day Itinerary
    dayItineraries,
    setDayItineraries,
    addDayItinerary,
    updateDayItinerary,
    deleteDayItinerary,
    getItineraryForDay,

    // Complete Quotation Data Management
    quotationData,
    setQuotationData,
    updateQuotationData,
    exportQuotationData,

    // Helper for all days
    allDays,

    // Hotel total price
    hotelTotalPrice,
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