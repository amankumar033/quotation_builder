import { useState, useCallback } from "react";
import { DaySelection, Hotel, Transport, Activity } from "@/types/type";
import HotelSection from "./HotelSection";
import TransportSection from "./TransportSection";
import ActivitiesSection from "./ActivitySection";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DayAccordionProps {
  date: string;
  daySelection: DaySelection & { day?: number };
  dayNumber: number;
  hotels: Hotel[];
  transportations: Transport[];
  activities: Activity[];
  isHotelLoading: boolean;
  isTransportLoading: boolean;
  isActivitiesLoading: boolean;
  theme: any;
  show: boolean;
  setShow: (show: boolean) => void;
  updateData: (data: any) => void;
}

export type SectionType = 'hotel' | 'transport' | 'activities';

export default function DayAccordion({
  date,
  daySelection,
  dayNumber,
  hotels,
  transportations,
  activities,
  isHotelLoading,
  isTransportLoading,
  isActivitiesLoading,
  theme,
  show,
  setShow,
  updateData,
}: DayAccordionProps) {
  const [isActive, setIsActive] = useState(dayNumber === 1);
  const [activeSections, setActiveSections] = useState<SectionType[]>(['hotel']);

  const toggleDayAccordion = () => setIsActive(!isActive);
  
  // FIXED: Use useCallback to prevent infinite re-renders
  const toggleSection = useCallback((section: SectionType) => {
    setActiveSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  }, []);

  const isSectionActive = (section: SectionType) => activeSections.includes(section);

  const isHotelConfirmed = !!daySelection.hotel;
  const isTransportConfirmed = !!daySelection.transports;
  const isActivitiesConfirmed = !!(daySelection.activities && daySelection.activities.length > 0);

  const confirmedCount = [isHotelConfirmed, isTransportConfirmed, isActivitiesConfirmed].filter(Boolean).length;

  // Calculate prices for summary
  const calculateHotelPrice = () => {
    if (!daySelection.hotel || !daySelection.roomSelections || daySelection.roomSelections.length === 0) return 0;
    
    const roomSelection = daySelection.roomSelections[0];
    const roomPrice = roomSelection.totalPrice || 0;
    const mealPrice = daySelection.meals ? daySelection.meals.reduce((total, meal) => total + (meal.price * meal.quantity), 0) : 0;
    
    return roomPrice + mealPrice;
  };

  const calculateTransportPrice = () => {
    return daySelection.transports?.price || 0;
  };

  const calculateActivitiesPrice = () => {
    if (!daySelection.activities) return 0;
    return daySelection.activities.reduce((total, activity) => total + activity.price, 0);
  };

  const totalDayPrice = calculateHotelPrice() + calculateTransportPrice() + calculateActivitiesPrice();

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${theme.border} transition-all duration-300`}>
      <div className={`px-6 py-4 cursor-pointer rounded-t-xl ${isActive ? 'bg-gradient-to-r ' + theme.bg + ' text-white' : 'hover:bg-gray-50'}`} onClick={toggleDayAccordion}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-4 ${isActive ? 'bg-white bg-opacity-20' : 'bg-gradient-to-r ' + theme.bg}`}>
              <span className={`text-lg font-bold ${isActive ? 'text-white' : 'text-white'}`}>{dayNumber}</span>
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${isActive ? 'text-white' : theme.text}`}>Day {dayNumber} - {formattedDate}</h3>
              {confirmedCount > 0 && (
                <p className={`text-sm mt-1 ${isActive ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                  {confirmedCount === 3 ? 'All sections confirmed' : `${confirmedCount}/3 sections confirmed`}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Price Summary */}
            {(isHotelConfirmed || isTransportConfirmed || isActivitiesConfirmed) && (
              <div className="text-right">
                <div className={`text-lg font-bold ${isActive ? 'text-white' : 'text-green-600'}`}>
                  ₹{totalDayPrice}
                </div>
                <div className={`text-xs ${isActive ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
                  {isHotelConfirmed && `H : ₹${calculateHotelPrice()}, `}
                  {isTransportConfirmed && ` T : ₹${calculateTransportPrice()}, `}
                  {isActivitiesConfirmed && ` A : ₹${calculateActivitiesPrice()}`}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              {isHotelConfirmed && <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Hotel</span>}
              {isTransportConfirmed && <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Transport</span>}
              {isActivitiesConfirmed && <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Activities</span>}
              {isActive ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
        </div>
      </div>

      {isActive && (
        <div className="p-6 space-y-6 animate-in fade-in duration-300">
          <HotelSection
            date={date}
            daySelection={daySelection}
            updateDaySelection={() => {}}
            hotels={hotels}
            isHotelLoading={isHotelLoading}
            theme={theme}
            isSectionActive={isSectionActive('hotel')}
            toggleSection={() => toggleSection('hotel')}
            isHotelConfirmed={isHotelConfirmed}
          />
          <TransportSection
            date={date}
            daySelection={daySelection}
            updateDaySelection={() => {}}
            transportations={transportations}
            theme={theme}
            isSectionActive={isSectionActive('transport')}
            toggleSection={() => toggleSection('transport')}
          />
          <ActivitiesSection
            date={date}
            daySelection={daySelection}
            updateDaySelection={() => {}}
            activities={activities}
            isActivitiesLoading={isActivitiesLoading}
            theme={theme}
            isSectionActive={isSectionActive('activities')}
            toggleSection={() => toggleSection('activities')}
          />
        </div>
      )}
    </div>
  );
}