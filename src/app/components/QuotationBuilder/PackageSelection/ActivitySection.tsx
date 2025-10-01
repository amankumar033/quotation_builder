"use client";

import { Activity, DaySelection } from "@/types/type";
import { ChevronDown, ChevronUp, MapPin, CheckCircle, Search, Clock } from "lucide-react";
import { useState } from "react";
import { useQuotation } from "@/context/QuotationContext";

interface ActivitiesSectionProps {
  activities: Activity[];
  isActivitiesLoading: boolean;
  theme: { bg: string; text: string; border: string };
  isSectionActive: boolean;
  toggleSection: () => void;
  allDays: Array<{ date: string; data: DaySelection }>;
}

export default function ActivitiesSection({
  activities,
  isActivitiesLoading,
  theme,
  isSectionActive,
  toggleSection,
  allDays,
}: ActivitiesSectionProps) {
  const { 
    daySelections,
    updateDaySelection
  } = useQuotation();

  const [selectedDays, setSelectedDays] = useState<string[]>(allDays.map(day => day.date));
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDayToggle = (dayDate: string) => {
    setSelectedDays(prev => 
      prev.includes(dayDate) 
        ? prev.filter(d => d !== dayDate)
        : [...prev, dayDate]
    );
  };

  const handleActivityToggle = (activity: Activity) => {
    setSelectedActivities(prev => {
      const isSelected = prev.some(a => a.id === activity.id);
      if (isSelected) {
        return prev.filter(a => a.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };

  const handleSaveActivities = () => {
    // Apply selected activities to all selected days
    selectedDays.forEach(date => {
      updateDaySelection(date, {
        activities: selectedActivities,
        isCompleted: true
      });
    });
  };

  const isActivitySelected = (activityId: string) => {
    return selectedActivities.some(a => a.id === activityId);
  };

  const hasActivitiesSelected = selectedDays.some(date => 
    daySelections[date]?.activities && daySelections[date]!.activities!.length > 0
  );

  // Filter activities based on search
  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className={`p-6 cursor-pointer transition-all duration-300 ${
          isSectionActive ? 'bg-gradient-to-r from-purple-50 to-purple-100' : 'bg-white'
        }`}
        onClick={toggleSection}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center`}>
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Activities</h3>
              <p className="text-sm text-gray-600">
                {hasActivitiesSelected 
                  ? `${selectedDays.length} days selected`
                  : `Select activities for ${allDays.length} days`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {hasActivitiesSelected && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Selected</span>
              </div>
            )}
            {isSectionActive ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {isSectionActive && (
        <div className="p-6 border-t border-gray-200">
          {/* Day Selection */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Select Days for Activities:</h4>
            <div className="flex flex-wrap gap-2">
              {allDays.map(({ date }, index) => (
                <button
                  key={date}
                  onClick={() => handleDayToggle(date)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedDays.includes(date)
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Day {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Activities Selection */}
          {isActivitiesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading activities...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`border rounded-xl overflow-hidden cursor-pointer transition-all ${
                    isActivitySelected(activity.id)
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-100'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                  onClick={() => handleActivityToggle(activity)}
                >
                  <div className="h-32 bg-gray-200 relative">
                    {activity.image && (
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {isActivitySelected(activity.id) && (
                      <div className="absolute top-2 right-2 bg-purple-500 text-white p-1 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{activity.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{activity.duration}</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          ₹{activity.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {selectedActivities.length > 0 && (
            <div className="mt-6">
              <button
                onClick={handleSaveActivities}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-medium"
              >
                Apply {selectedActivities.length} Activities to {selectedDays.length} Selected Days
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}