"use client";

import { useEffect, useState } from "react";
import { QuotationData, Hotel, DaySelection, Transport, Activity } from "@/types/type";
import { useQuotation } from "@/context/QuotationContext";
import HotelSection from "./PackageSelection/HotelSection";
import TransportSection from "./PackageSelection/TransportSection";
import ActivitiesSection from "./PackageSelection/ActivitySection";
import DayItinerarySection from "./PackageSelection/DayItinerarySection";
import { ChevronLeft, Calendar, MapPin, Building, Car, Map, CheckCircle } from "lucide-react";

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
  const [activeSections, setActiveSections] = useState({
    hotel: true,
    transport: false,
    activities: false
  });

  const { 
    selectedLocation,
    startDate, 
    endDate, 
    daySelections, 
    setDaySelections,
    areAllDaysCompleted,
    getCompletionStatus,
    debugDayCompletions,
    setTotalPackagePrice,
    exportQuotationData
  } = useQuotation();

  const completionStatus = getCompletionStatus();

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
      if (day.hotel && day.roomSelections && day.roomSelections.length > 0) {
        const roomPrice = day.roomSelections[0].totalPrice || 0;
        const mealPrice = day.meals ? day.meals.reduce((sum, meal) => sum + (meal.price * meal.quantity), 0) : 0;
        total += roomPrice + mealPrice;
      }
      
      if (day.transports) {
        total += day.transports.price || 0;
      }
      
      if (day.activities) {
        total += day.activities.reduce((sum, activity) => sum + activity.price, 0);
      }
    });
    return total;
  };

  const toggleSection = (section: keyof typeof activeSections) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleContinue = () => {
    // Debug: Check what's missing
    debugDayCompletions();
    
    if (!completionStatus.isComplete) {
      alert(`Please configure hotels for all days. ${completionStatus.message}`);
      return;
    }

    // Export and log all data
    exportQuotationData();
    
    const daySelectionsArray = Object.entries(daySelections);
    daySelectionsArray.forEach(([date, data]) => {
      const formattedDate = new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');
      console.log(`Day ${formattedDate} →`, {
        hotel: data.hotel?.name,
        meals: data.meals?.length,
        transport: data.transports?.name,
        activities: data.activities?.length
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
  const totalDays = Object.keys(daySelections).length;
  
  useEffect(() => {
    setTotalPackagePrice(totalPrice);
  }, [totalPrice, setTotalPackagePrice]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">Package Selection</h1>
              <p className="text-gray-600">Configure hotels, transport, and activities for your trip</p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹{totalPrice}</div>
              <div className="text-sm text-gray-500">Total Package Price</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-500">Destination</div>
                <div className="font-semibold text-gray-900">{selectedLocation}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-500">Trip Duration</div>
                <div className="font-semibold text-gray-900">
                  {totalDays} Days
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Building className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-500">Hotels Configured</div>
                <div className="font-semibold text-gray-900">
                  {completionStatus.completedDays}/{completionStatus.totalDays} Days
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="h-5 w-5 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-semibold text-gray-900">
                  {completionStatus.isComplete ? 'Ready to Continue' : 'In Progress'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {totalDays > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Package Completion
              </span>
              <span className="text-sm font-medium text-gray-700">
                {completionStatus.completedDays}/{completionStatus.totalDays} days
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completionStatus.completedDays / completionStatus.totalDays) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {completionStatus.message}
            </p>
          </div>
        )}

        {/* Service Selection Sections */}
        <div className="space-y-6">
          {/* Hotel Section */}
          <HotelSection
            hotels={hotels}
            isHotelLoading={isHotelLoading}
            theme={{ bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', border: 'border-blue-200' }}
            isSectionActive={activeSections.hotel}
            toggleSection={() => toggleSection('hotel')}
            allDays={daySelectionsArray}
          />

          {/* Transport Section */}
          <TransportSection
            transportations={transportations}
            isTransportLoading={isTransportLoading}
            theme={{ bg: 'from-green-500 to-green-600', text: 'text-green-600', border: 'border-green-200' }}
            isSectionActive={activeSections.transport}
            toggleSection={() => toggleSection('transport')}
            allDays={daySelectionsArray}
          />

          {/* Activities Section */}
          <ActivitiesSection
            activities={activities}
            isActivitiesLoading={isActivitiesLoading}
            theme={{ bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', border: 'border-purple-200' }}
            isSectionActive={activeSections.activities}
            toggleSection={() => toggleSection('activities')}
            allDays={daySelectionsArray}
          />

          {/* Day Itinerary Section */}
          <DayItinerarySection />
        </div>

        {/* Continue Button */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              ← Back to Client Info
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">Final Total: ₹{totalPrice}</div>
                <div className="text-sm text-gray-500">
                  {totalDays} days • {selectedLocation} • {completionStatus.completedDays}/{completionStatus.totalDays} configured
                </div>
              </div>
              <button
                onClick={handleContinue}
                disabled={!completionStatus.isComplete}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {completionStatus.isComplete ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Continue to Customization</span>
                  </>
                ) : (
                  <span>
                    Complete Hotel Selection First ({completionStatus.completedDays}/{completionStatus.totalDays})
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}