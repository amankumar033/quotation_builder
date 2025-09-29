import { Activity, DaySelection } from "@/types/type";
import ActivityCard from "../PackageSelection/Activitycard";
import { MapPin, ChevronUp, ChevronDown, CheckCircle } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";

interface ActivitiesSectionProps {
  date: string;
  daySelection: DaySelection;
  updateDaySelection: (date: string, updates: Partial<DaySelection>) => void;
  activities: Activity[];
  isActivitiesLoading: boolean;
  theme: any;
  isSectionActive: boolean;
  toggleSection: () => void;
}

export default function ActivitiesSection({
  date,
  daySelection,
  updateDaySelection,
  activities,
  isActivitiesLoading,
  theme,
  isSectionActive,
  toggleSection
}: ActivitiesSectionProps) {
  const { updateDaySelection: contextUpdateDaySelection } = useQuotation();

  const handleActivitySelect = (activity: Activity) => {
    const currentActivities = daySelection.activities || [];
    const isSelected = currentActivities.some(a => a.id === activity.id);
    
    const updatedActivities = isSelected 
      ? currentActivities.filter(a => a.id !== activity.id)
      : [...currentActivities, activity];
    
    contextUpdateDaySelection(date, { 
      activities: updatedActivities,
      isCompleted: !!daySelection.hotel && !!daySelection.transports
    });
  };

  const isActivitySelected = (activityId: string) => {
    return daySelection.activities?.some(a => a.id === activityId) || false;
  };

  const hasSelectedActivities = !!(daySelection.activities && daySelection.activities.length > 0);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div
        className={`px-6 py-4 cursor-pointer flex items-center justify-between transition-colors ${
          isSectionActive ? 'bg-gray-50' : 'hover:bg-gray-50'
        }`}
        onClick={toggleSection}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${theme.text} bg-opacity-10`}>
            <MapPin className={`h-5 w-5 ${theme.text}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Activities</h3>
            {hasSelectedActivities && (
              <p className="text-sm text-gray-600 mt-1">
                {daySelection.activities?.length} activities selected
              </p>
            )}
          </div>
        </div>
        {hasSelectedActivities && (
  <div className="text-right">
    <div className="text-sm font-semibold text-green-600">
      ₹{daySelection.activities?.reduce((sum, activity) => sum + activity.price, 0) || 0}
    </div>
    <div className="text-xs text-gray-500">Activities</div>
  </div>
)}
        <div className="flex items-center space-x-3">
          {hasSelectedActivities && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Selected
            </span>
          )}
          {isSectionActive ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </div>
       


      </div>

      {isSectionActive && (
        <div className="px-6 py-4 border-t border-gray-200 animate-in fade-in duration-300">
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Available Activities</h4>
            
            {isActivitiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-xl"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    isSelected={isActivitySelected(activity.id)}
                    onSelect={() => handleActivitySelect(activity)}
                    theme={theme}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}