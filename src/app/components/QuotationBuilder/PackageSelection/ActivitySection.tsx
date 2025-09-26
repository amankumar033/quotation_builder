import { Activity, DaySelection } from "@/types/type";
import ActivityCard from "./Activitycard";
import { ActivityIcon, ChevronUp, ChevronDown } from "lucide-react";

interface ActivitiesSectionProps {
  daySelection: DaySelection;
  updateDaySelection: (dayNumber: number, updates: Partial<DaySelection>) => void;
  activities: Activity[];
  isActivitiesLoading: boolean;
  theme: any;
  isSectionActive: boolean;
  toggleSection: () => void;
}

export default function ActivitiesSection({
  daySelection,
  updateDaySelection,
  activities,
  isActivitiesLoading,
  theme,
  isSectionActive,
  toggleSection
}: ActivitiesSectionProps) {
  const selectActivity = (activityId: string) => {
    updateDaySelection(daySelection.day, { 
      selectedActivities: daySelection.selectedActivities.includes(activityId) 
        ? daySelection.selectedActivities.filter(id => id !== activityId)
        : [...daySelection.selectedActivities, activityId]
    });
  };

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden">
    <div 
  className="px-6 py-4 cursor-pointer  text-gray-500 bg-gray-50"
  onClick={toggleSection}
>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ActivityIcon className="h-5 w-5 mr-3" />
            <h4 className="text-lg font-semibold">Select Activities for Day {daySelection.day}</h4>
          </div>
          <div className="flex items-center space-x-2">
            {daySelection.selectedActivities.length > 0 && (
              <span className={`px-2 py-1 rounded-full text-sm ${
                isSectionActive ? 'bg-white text-gray-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {daySelection.selectedActivities.length} Selected
              </span>
            )}
            {isSectionActive ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {isSectionActive && (
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isActivitiesLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col border rounded-xl border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-40 bg-gray-200 w-full" />
                    <div className="p-4 space-y-2">
                      <div className="h-5 bg-gray-300 rounded w-3/4" />
                      <div className="h-4 bg-gray-300 rounded w-1/2" />
                      <div className="h-6 bg-gray-300 rounded w-full mt-3" />
                    </div>
                  </div>
                ))
              : activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    isSelected={daySelection.selectedActivities.includes(activity.id)}
                    onSelect={selectActivity}
                    theme={theme}
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
}