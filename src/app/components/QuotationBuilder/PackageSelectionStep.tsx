"use client";

import { useEffect, useState } from "react";
import { QuotationData, Hotel, DaySelection, Transport, Activity } from "@/types/type";
import { useQuotation } from "@/context/QuotationContext";
import DayAccordion from "./PackageSelection/DayAccordion";
import AddActivityModal from "./PackageSelection/AddActivityModal";

interface PackageSelectionStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

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
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  const { 
    startDate, 
    endDate, 
    setShow, 
    show, 
    daySelections, 
    setDaySelections,
    areAllDaysCompleted
  } = useQuotation();

  // Initialize day selections when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      
      const newDaySelections: Record<string, DaySelection> = {};
      
      for (let i = 0; i < days; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const dateString = currentDate.toISOString().split('T')[0];
        
        newDaySelections[dateString] = {
          date: dateString,
          hotel: null,
          meals: [],
          transports: null,
          activities: [],
          isCompleted: false
        };
      }
      
      setDaySelections(newDaySelections);
    }
  }, [startDate, endDate, setDaySelections]);

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

  // Calculate total package price
  const calculateTotalPrice = () => {
    let total = 0;
    Object.values(daySelections).forEach(day => {
      // Hotel price
      if (day.hotel && day.roomSelections && day.roomSelections.length > 0) {
        const roomPrice = day.roomSelections[0].totalPrice || 0;
        const mealPrice = day.meals ? day.meals.reduce((sum, meal) => sum + (meal.price * meal.quantity), 0) : 0;
        total += roomPrice + mealPrice;
      }
      
      // Transport price
      if (day.transports) {
        total += day.transports.price || 0;
      }
      
      // Activities price
      if (day.activities) {
        total += day.activities.reduce((sum, activity) => sum + activity.price, 0);
      }
    });
    return total;
  };

  // Get ALL hotels without filtering - make days independent
  const getAvailableHotels = (currentDate: string) => {
    return hotels;
  };

  const getDayTheme = (index: number) => {
    const themes = [
      { bg: 'from-blue-400 to-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
      { bg: 'from-green-400 to-green-500', text: 'text-green-600', border: 'border-green-200' },
      { bg: 'from-purple-400 to-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
      { bg: 'from-orange-400 to-orange-500', text: 'text-orange-600', border: 'border-orange-200' },
    ];
    return themes[index % themes.length];
  };

  const handleContinue = () => {
    if (!areAllDaysCompleted()) return;

    const daySelectionsArray = Object.entries(daySelections);
    daySelectionsArray.forEach(([date, data]) => {
      const formattedDate = new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');
      console.log(`Day ${formattedDate} →`, {
        hotel: data.hotel,
        meals: data.meals,
        transport: data.transports,
        activities: data.activities
      });
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    nextStep();
  };

  const daySelectionsArray = Object.entries(daySelections).map(([date, data], index) => ({
    date,
    data: { ...data, day: index + 1 }
  }));

  const totalPrice = calculateTotalPrice();

  return (
    <div className="space-y-8 px-6 min-h-screen bg-gray-50">
      <section className="space-y-6">
        {daySelectionsArray.map(({ date, data }, index) => (
          <DayAccordion
            key={date}
            date={date}
            daySelection={data}
            dayNumber={index + 1}
            hotels={getAvailableHotels(date)}
            transportations={transportations}
            activities={activities}
            isHotelLoading={isHotelLoading}
            isTransportLoading={isTransportLoading}
            isActivitiesLoading={isActivitiesLoading}
            theme={getDayTheme(index)}
            show={show}
            setShow={setShow}
            updateData={updateData}
          />
        ))}
      </section>

      {/* Global Summary Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Package Summary</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">₹{totalPrice}</div>
            <div className="text-sm text-gray-500">Total Package Price</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {daySelectionsArray.map(({ date, data }, index) => {
            const dayPrice = 
              (data.hotel && data.roomSelections?.[0]?.totalPrice || 0) +
              (data.meals?.reduce((sum, meal) => sum + (meal.price * meal.quantity), 0) || 0) +
              (data.transports?.price || 0) +
              (data.activities?.reduce((sum, activity) => sum + activity.price, 0) || 0);

            return (
              <div key={date} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">Day {index + 1}</span>
                  <span className="text-green-600 font-bold">₹{dayPrice}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  {data.hotel && <div>🏨 {data.hotel.name}</div>}
                  {data.transports && <div>🚗 {data.transports.name}</div>}
                  {data.activities && data.activities.length > 0 && (
                    <div>🎯 {data.activities.length} activities</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Activity Button - Only show when all sections are completed */}
        {areAllDaysCompleted() && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddActivityModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-medium flex items-center space-x-2"
            >
              <span>+ Add Custom Activity</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">Final Total: ₹{totalPrice}</div>
                <div className="text-sm text-gray-500">{daySelectionsArray.length} days • All sections completed</div>
              </div>
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {!areAllDaysCompleted() && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Complete all sections to continue
            </div>
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              ← Back
            </button>
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <AddActivityModal
          onClose={() => setShowAddActivityModal(false)}
          activities={activities}
        />
      )}
    </div>
  );
}