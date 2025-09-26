import { useState } from "react";
import { DaySelection, Hotel, Transport, Activity, RoomSelection, Meal } from "@/types/type";
import HotelSection from "./HotelSection";
import TransportSection from "./TransportSection";
import ActivitiesSection from "./ActivitySection";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DayAccordionProps {
  daySelection: DaySelection;
  updateDaySelection: (dayNumber: number, updates: Partial<DaySelection>) => void;
  hotels: Hotel[];
  transportations: Transport[];
  activities: Activity[];
  isHotelLoading: boolean;
  isTransportLoading: boolean;
  isActivitiesLoading: boolean;
  roomSelectionState: string;
  setRoomSelectionState: (state: any) => void;
  theme: any;
  show: boolean;
  setShow: (show: boolean) => void;
  updateData: (data: any) => void;
  selectedHotelForRooms: Hotel | null;
  currentDayForRooms: number;
  mealSelections: Meal[];
  roomSelections: RoomSelection[];
  onViewHotelMeals: (hotel: Hotel, dayNumber: number) => void;
  onBackToHotels: () => void;
  onProceedToRooms: () => void;
  onBackToMeals: () => void;
  onConfirmRoomSelection: () => void;
  onEditRoomSelection: (day: number) => void;
  onMealsChange: (meals: Meal[]) => void;
  onRoomSelectionsChange: (selections: RoomSelection[]) => void;
}

export type SectionType = 'hotel' | 'transport' | 'activities';

export default function DayAccordion({
  daySelection,
  updateDaySelection,
  hotels,
  transportations,
  activities,
  isHotelLoading,
  isTransportLoading,
  isActivitiesLoading,
  roomSelectionState,
  setRoomSelectionState,
  theme,
  show,
  setShow,
  updateData,
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
  onRoomSelectionsChange
}: DayAccordionProps) {
  const [isActive, setIsActive] = useState(daySelection.day === 1);
  const [activeSections, setActiveSections] = useState<SectionType[]>(['hotel']);

  const toggleDayAccordion = () => setIsActive(!isActive);
  const toggleSection = (section: SectionType) => setActiveSections(prev =>
    prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
  );
  const isSectionActive = (section: SectionType) => activeSections.includes(section);

  const isHotelConfirmed = daySelection.selectedHotel !== null;
  const isTransportConfirmed = daySelection.selectedTransport !== null;
  const isActivitiesConfirmed = daySelection.selectedActivities.length > 0;

  const confirmedCount = [isHotelConfirmed, isTransportConfirmed, isActivitiesConfirmed].filter(Boolean).length;

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${theme.border} transition-all duration-300`}>
      <div className={`px-6 py-3 cursor-pointer rounded-t-xl ${isActive ? 'bg-gradient-to-r ' + theme.bg + ' text-white' : 'hover:bg-gray-50'}`} onClick={toggleDayAccordion}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center mr-4 ${isActive ? 'bg-white bg-opacity-20' : 'bg-gradient-to-r ' + theme.bg}`}>
              <span className={`text-xl font-bold ${isActive ? 'text-white' : 'text-white'}`}>{daySelection.day}</span>
            </div>
            <div>
              <h3 className={`text-2xl font-semibold ${isActive ? 'text-white' : theme.text}`}>Day {daySelection.day} Itinerary</h3>
              {confirmedCount > 0 && (
                <p className={`text-sm mt-1 ${isActive ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                  {confirmedCount === 3 ? 'All sections confirmed' : `${confirmedCount}/3 sections confirmed`}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isHotelConfirmed && <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Hotel Selected</span>}
            {isTransportConfirmed && <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Transport</span>}
            {isActivitiesConfirmed && <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">Activities</span>}
            {isActive ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
          </div>
        </div>
      </div>

      {isActive && (
        <div className="p-6 space-y-4 animate-in fade-in duration-300">
          <HotelSection
            daySelection={daySelection}
            updateDaySelection={updateDaySelection}
            hotels={hotels}
            isHotelLoading={isHotelLoading}
            roomSelectionState={roomSelectionState}
            setRoomSelectionState={setRoomSelectionState}
            theme={theme}
            show={show}
            setShow={setShow}
            updateData={updateData}
            isSectionActive={isSectionActive('hotel')}
            toggleSection={() => toggleSection('hotel')}
            selectedHotelForRooms={selectedHotelForRooms}
            currentDayForRooms={currentDayForRooms}
            mealSelections={mealSelections}
            roomSelections={roomSelections}
            onViewHotelMeals={onViewHotelMeals}
            onBackToHotels={onBackToHotels}
            onProceedToRooms={onProceedToRooms}
            onBackToMeals={onBackToMeals}
            onConfirmRoomSelection={onConfirmRoomSelection}
            onEditRoomSelection={() => onEditRoomSelection(daySelection.day)}
            onMealsChange={onMealsChange}
            onRoomSelectionsChange={onRoomSelectionsChange}
            isHotelConfirmed={isHotelConfirmed}
          />
          <TransportSection
            daySelection={daySelection}
            updateDaySelection={updateDaySelection}
            transportations={transportations}
            theme={theme}
            isSectionActive={isSectionActive('transport')}
            toggleSection={() => toggleSection('transport')}
          />
          <ActivitiesSection
            daySelection={daySelection}
            updateDaySelection={updateDaySelection}
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
