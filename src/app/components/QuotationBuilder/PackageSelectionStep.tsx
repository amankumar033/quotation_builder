"use client";

import { useEffect, useState } from "react";
import { QuotationData, Hotel, DaySelection, RoomSelection, Meal, Transport, Activity } from "@/types/type";
import { useQuotation } from "@/context/QuotationContext";
import DayAccordion from "./PackageSelection/DayAccordion";

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
  const [transportations, setTransportations] = useState<Transport[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isHotelLoading, setIsHotelLoading] = useState(true);
  const [isTransportLoading, setIsTransportLoading] = useState(true);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);

  const { startDate, endDate, setShow, show } = useQuotation();

  const numberOfDays = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1)
    : 1;

  const [daySelections, setDaySelections] = useState<DaySelection[]>([]);

  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
      const selections: DaySelection[] = Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        selectedHotel: null,
        selectedMeals: [],
        selectedRoomSelections: [],
        selectedActivities: [],
        selectedTransport: null,
        selectedVehicleType: null
      }));
      setDaySelections(selections);
    }
  }, [startDate, endDate]);

  // Temporary selection states
  const [currentDayForSelection, setCurrentDayForSelection] = useState<number>(1);
  const [selectedHotelTemp, setSelectedHotelTemp] = useState<Hotel | null>(null);
  const [mealSelections, setMealSelections] = useState<Meal[]>([]);
  const [roomSelections, setRoomSelections] = useState<RoomSelection[]>([]);
  const [roomSelectionState, setRoomSelectionState] = useState<RoomSelectionState>('browsing');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Hotels
      setIsHotelLoading(true);
      const hotelsRes = await fetch("/api/hotels");
      const hotelsData = await hotelsRes.json();
      const normalizedHotels = (hotelsData.data || hotelsData).map((h: any) => ({
        ...h,
        photos: typeof h.photos === "string" ? JSON.parse(h.photos) : h.photos || [],
        inclusions: h.inclusions ? JSON.parse(h.inclusions) : [],
      }));
      setHotels(normalizedHotels);
      setIsHotelLoading(false);

      // Transports
      setIsTransportLoading(true);
      const transportsRes = await fetch("/api/transports");
      const transportsData = await transportsRes.json();
      const normalizedTransports = (transportsData.data || transportsData).map((t: any) => ({
        id: t.id,
        name: t.vehicleType,
        type: t.vehicleType,
        capacity: t.maxCapacity,
        price: t.perDay,
        features: t.notes ? [t.notes] : ['AC', 'Comfortable seating'],
        image: t.photos ? JSON.parse(t.photos)[0] : '/default-transport.jpg'
      }));
      setTransportations(normalizedTransports);
      setIsTransportLoading(false);

      // Activities
      setIsActivitiesLoading(true);
      const activitiesRes = await fetch("/api/activities");
      const activitiesData = await activitiesRes.json();
      const normalizedActivities = (activitiesData.data || activitiesData).map((a: any) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        price: a.price,
        duration: a.duration + ' hours',
        image: a.photos && a.photos.length > 0 ? a.photos[0] : '/default-activity.jpg',
        agencyId: a.agencyId
      }));
      setActivities(normalizedActivities);
      setIsActivitiesLoading(false);

    } catch (error) {
      console.error("Failed to fetch data:", error);
      setIsHotelLoading(false);
      setIsTransportLoading(false);
      setIsActivitiesLoading(false);
    }
  };

  const updateDaySelection = (dayNumber: number, updates: Partial<DaySelection>) => {
    setDaySelections(prev => prev.map(day =>
      day.day === dayNumber ? { ...day, ...updates } : day
    ));
  };

  // Hotel selection flow
  const handleViewHotelMeals = (hotel: Hotel, dayNumber: number) => {
    setSelectedHotelTemp(hotel);
    setCurrentDayForSelection(dayNumber);

    const defaultMeals: Meal[] = hotelMeals.map(meal => ({ ...meal, quantity: 0 }));
    setMealSelections(defaultMeals);
    setRoomSelectionState('selecting-meals');
  };

  const handleBackToHotels = () => {
    setSelectedHotelTemp(null);
    setMealSelections([]);
    setRoomSelections([]);
    setRoomSelectionState('browsing');
  };

const handleProceedToRooms = () => {
  setRoomSelectionState('selecting-rooms');
  setRoomSelections([{
    roomId: 1,
    roomCount: 1,
    dayNumber: currentDayForSelection,
    adults: 2,
    childrenWithBed: 0,
    childrenWithoutBed: 0,
    adultsWithExtraBed: 0,
    totalPrice: 3000,
    isConfirmed: false, // Add this - set to false initially
    confirmedAt: "" // Add this - empty string initially
  }]);
};

  const handleConfirmRoomSelection = () => {
    if (!selectedHotelTemp) return;

    updateDaySelection(currentDayForSelection, {
      selectedHotel: selectedHotelTemp,
      selectedMeals: mealSelections.filter(m => m.quantity > 0),
       roomSelections: roomSelections
    });

    setSelectedHotelTemp(null);
    setMealSelections([]);
    setRoomSelections([]);
    setRoomSelectionState('confirmed');
  };

  const handleEditRoomSelection = (day: number) => {
    const dayData = daySelections.find(d => d.day === day);
    if (!dayData) return;

    setSelectedHotelTemp(dayData.selectedHotel);
    setMealSelections(dayData.selectedMeals);
   setRoomSelections(dayData.roomSelections || []);

    setCurrentDayForSelection(day);
    setRoomSelectionState('selecting-rooms');
  };

 const hotelMeals: Meal[] = [
  {
    id: 1,
    hotelId: "HTL1",
    name: "Continental Breakfast",
    type: "breakfast",
    category: "veg",
    price: 450,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSIjnT16b72GWq4B8WZ2lhTxQLbT8ki6pdnQ&s",
    quantity: 0,
  },
  {
    id: 2,
    hotelId: "HTL2",
    name: "Indian Breakfast",
    type: "breakfast",
    category: "veg",
    price: 500,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm4nTDOsrHZwI3FAcGwx0ZAz8zb8MuHSs42Q&s",
    quantity: 0,
  },
  {
    id: 3,
    hotelId: "HTL1",
    name: "Buffet Lunch",
    type: "lunch",
    category: "veg",
    price: 900,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvyg6rtmkTDFrWLcHwjNOA02U15bKJ71IhRA&s",
    quantity: 0,
  },
  {
    id: 4,
    hotelId: "HTL3",
    name: "Vegetarian Thali",
    type: "lunch",
    category: "veg",
    price: 700,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-odM1YeL8AjwW3U3U82eWTk9ghO01egs6VA&s",
    quantity: 0,
  },
  {
    id: 5,
    hotelId: "HTL2",
    name: "Non-Veg Dinner",
    type: "dinner",
    category: "non-veg",
    price: 1200,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLvTQ0SeNN6VlqI7mcwPUpXXGEZKOTN_nB8A&s",
    quantity: 0,
  },
  {
    id: 6,
    hotelId: "HTL3",
    name: "South Indian Breakfast",
    type: "breakfast",
    category: "veg",
    price: 550,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH2M9v8uTuQRfbhdp8jU33_J_zAlQDBCsStg&s",
    quantity: 0,
  },
  {
    id: 7,
    hotelId: "HTL1",
    name: "Chinese Dinner",
    type: "dinner",
    category: "veg",
    price: 1000,
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=250&fit=crop",
    quantity: 0,
  },

];


  const getDayTheme = (day: number) => {
    const themes = [
      { bg: 'from-blue-400 to-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
      { bg: 'from-green-400 to-green-500', text: 'text-green-600', border: 'border-green-200' },
      { bg: 'from-purple-400 to-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
      { bg: 'from-orange-400 to-orange-500', text: 'text-orange-600', border: 'border-orange-200' },
    ];
    return themes[(day - 1) % themes.length];
  };

  return (
    <div className="space-y-8 px-6 min-h-screen bg-gray-50">
      <section className="space-y-6">
        {daySelections.map(daySelection => (
          <DayAccordion
            key={daySelection.day}
            daySelection={daySelection}
            updateDaySelection={updateDaySelection}
            hotels={hotels}
            transportations={transportations}
            activities={activities}
            isHotelLoading={isHotelLoading}
            isTransportLoading={isTransportLoading}
            isActivitiesLoading={isActivitiesLoading}
            roomSelectionState={roomSelectionState}
            setRoomSelectionState={setRoomSelectionState}
            theme={getDayTheme(daySelection.day)}
            show={show}
            setShow={setShow}
            updateData={updateData}
            selectedHotelForRooms={selectedHotelTemp}
            currentDayForRooms={currentDayForSelection}
            mealSelections={mealSelections}
            roomSelections={roomSelections}
            onViewHotelMeals={handleViewHotelMeals}
            onBackToHotels={handleBackToHotels}
            onProceedToRooms={handleProceedToRooms}
            onBackToMeals={() => setRoomSelectionState('selecting-meals')}
            onConfirmRoomSelection={handleConfirmRoomSelection}
            onEditRoomSelection={handleEditRoomSelection} // takes day as argument
            onMealsChange={setMealSelections}
            onRoomSelectionsChange={setRoomSelections}
          />
        ))}
      </section>

      <div className="flex justify-between pt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← Back
        </button>
        <button
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); nextStep(); }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
