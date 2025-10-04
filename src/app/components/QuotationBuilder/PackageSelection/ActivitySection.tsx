"use client";

import { Activity, DaySelection } from "@/types/type";
import { ChevronDown, ChevronUp, MapPin, CheckCircle, Search, Clock, Plus, X, Calendar, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuotation } from "@/context/QuotationContext";

interface ActivitiesSectionProps {
  activities: Activity[];
  isActivitiesLoading: boolean;
  theme: { bg: string; text: string; border: string };
  isSectionActive: boolean;
  toggleSection: () => void;
  allDays: Array<{ date: string; data: DaySelection }>;
}

type ViewMode = 'all' | 'day';

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
    updateDaySelection,
    customActivities,
    addCustomActivity
  } = useQuotation();

  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedDay, setSelectedDay] = useState<string>(allDays[0]?.date || '');
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomActivityModal, setShowCustomActivityModal] = useState(false);
  const [showDayAssignmentModal, setShowDayAssignmentModal] = useState(false);
  const [selectedActivityForAssignment, setSelectedActivityForAssignment] = useState<Activity | null>(null);
  const [selectedDaysForAssignment, setSelectedDaysForAssignment] = useState<string[]>([]);
  const [customActivityData, setCustomActivityData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: "1 hour",
    category: "sightseeing",
    image: "",
  });

  // Combine regular activities with custom activities
  const allActivities = [...activities, ...customActivities];

  // Reset selected day when allDays changes
  useEffect(() => {
    if (allDays.length > 0 && !allDays.find(day => day.date === selectedDay)) {
      setSelectedDay(allDays[0].date);
    }
  }, [allDays, selectedDay]);

  const handleDayTabClick = (date: string) => {
    setViewMode('day');
    setSelectedDay(date);
  };

  const handleAllTabClick = () => {
    setViewMode('all');
  };

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivityForAssignment(activity);
    
    // Pre-select days where this activity is already assigned
    const alreadyAssignedDays = allDays
      .filter(({ date }) => isActivityAssignedToDay(activity.id, date))
      .map(({ date }) => date);
    
    setSelectedDaysForAssignment(alreadyAssignedDays);
    setShowDayAssignmentModal(true);
  };

  const handleCustomActivityCreate = () => {
    if (!customActivityData.name || !customActivityData.price) {
      alert("Please fill in activity name and price");
      return;
    }

    const newCustomActivity: Activity = {
      id: `custom_${Date.now()}`,
      name: customActivityData.name,
      description: customActivityData.description,
      price: customActivityData.price,
      duration: customActivityData.duration,
      category: customActivityData.category,
      image: customActivityData.image,
      isCustom: true
    };

    addCustomActivity(newCustomActivity);
    setShowCustomActivityModal(false);
    
    // After creating custom activity, show assignment modal
    setSelectedActivityForAssignment(newCustomActivity);
    setSelectedDaysForAssignment([]);
    setShowDayAssignmentModal(true);
    
    setCustomActivityData({
      name: "",
      description: "",
      price: 0,
      duration: "1 hour",
      category: "sightseeing",
      image: "",
    });
  };

  const handleDayAssignmentToggle = (dayDate: string) => {
    setSelectedDaysForAssignment(prev => 
      prev.includes(dayDate) 
        ? prev.filter(d => d !== dayDate)
        : [...prev, dayDate]
    );
  };

  const handleAssignActivityToDays = () => {
    if (!selectedActivityForAssignment) return;

    // For each day in the assignment list, add or remove the activity
    allDays.forEach(({ date }) => {
      const currentDaySelection = daySelections[date] || { date, isCompleted: false, activities: [] };
      const currentActivities = currentDaySelection.activities || [];
      
      const shouldHaveActivity = selectedDaysForAssignment.includes(date);
      const currentlyHasActivity = currentActivities.some(a => a.id === selectedActivityForAssignment.id);
      
      if (shouldHaveActivity && !currentlyHasActivity) {
        // Add activity to this day
        updateDaySelection(date, {
          activities: [...currentActivities, selectedActivityForAssignment],
          isCompleted: true
        });
      } else if (!shouldHaveActivity && currentlyHasActivity) {
        // Remove activity from this day
        const updatedActivities = currentActivities.filter(a => a.id !== selectedActivityForAssignment.id);
        updateDaySelection(date, {
          activities: updatedActivities,
          isCompleted: updatedActivities.length > 0
        });
      }
    });

    setShowDayAssignmentModal(false);
    setSelectedActivityForAssignment(null);
    setSelectedDaysForAssignment([]);
  };

  const handleRemoveActivityFromDay = (activityId: string, date: string) => {
    const currentDaySelection = daySelections[date] || { date, isCompleted: false, activities: [] };
    const currentActivities = currentDaySelection.activities || [];
    
    const updatedActivities = currentActivities.filter(a => a.id !== activityId);
    
    updateDaySelection(date, {
      activities: updatedActivities,
      isCompleted: updatedActivities.length > 0
    });
  };

  const isActivityAssignedToDay = (activityId: string, date: string): boolean => {
    const daySelection = daySelections[date];
    return daySelection?.activities?.some(a => a.id === activityId) || false;
  };

  // Filter activities based on search for "All Activities" view
  const filteredAllActivities = allActivities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get activities for current selected day in "Day" view
  const getActivitiesForSelectedDay = (): Activity[] => {
    if (viewMode === 'all') return filteredAllActivities;
    
    const daySelection = daySelections[selectedDay];
    const dayActivities = daySelection?.activities || [];
    
    // Also filter by search term in day view
    return dayActivities.filter(activity =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getDayIndex = (date: string): number => {
    return allDays.findIndex(day => day.date === date) + 1;
  };

  const hasActivitiesForDay = (date: string): boolean => {
    const daySelection = daySelections[date];
    return !!(daySelection?.activities && daySelection.activities.length > 0);
  };

  const getActivityCountForDay = (date: string): number => {
    const daySelection = daySelections[date];
    return daySelection?.activities?.length || 0;
  };

  const getTotalActivitiesCount = (): number => {
    return allDays.reduce((total, { date }) => {
      return total + getActivityCountForDay(date);
    }, 0);
  };

  // Calculate total price for activities in a specific day
  const getTotalPriceForDay = (date: string): number => {
    const daySelection = daySelections[date];
    const dayActivities = daySelection?.activities || [];
    return dayActivities.reduce((total, activity) => total + activity.price, 0);
  };

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
                {viewMode === 'all' 
                  ? `${allActivities.length} activities available` 
                  : `${getActivityCountForDay(selectedDay)} activities for Day ${getDayIndex(selectedDay)}`
                }
                {viewMode === 'all' && getTotalActivitiesCount() > 0 && (
                  <span className="text-purple-600 font-medium">
                    {' '}({getTotalActivitiesCount()} assigned to days)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {getTotalActivitiesCount() > 0 && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{getTotalActivitiesCount()} Assigned</span>
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
        <div className="border-t border-gray-200 relative min-h-[500px]">
          {/* Day Assignment Modal */}
          {showDayAssignmentModal && selectedActivityForAssignment && (
            <div className="absolute inset-0 bg-white z-20 rounded-b-xl flex flex-col">
              {/* Modal Header */}
              <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    Assign Activity to Days
                  </h3>
                  <button
                    onClick={() => {
                      setShowDayAssignmentModal(false);
                      setSelectedActivityForAssignment(null);
                      setSelectedDaysForAssignment([]);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-gray-600 mt-1">
                  Select the days for <span className="font-semibold text-purple-600">{selectedActivityForAssignment.name}</span>
                </p>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
                  {/* Activity Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-4">
                      {selectedActivityForAssignment.image && (
                        <img 
                          src={selectedActivityForAssignment.image} 
                          alt={selectedActivityForAssignment.name}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{selectedActivityForAssignment.name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{selectedActivityForAssignment.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-500">{selectedActivityForAssignment.duration}</span>
                          <span className="font-bold text-green-600">₹{selectedActivityForAssignment.price}</span>
                          {selectedActivityForAssignment.isCustom && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                              Custom
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Day Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Select Days for this Activity:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {allDays.map(({ date }) => {
                        const isAssigned = isActivityAssignedToDay(selectedActivityForAssignment.id, date);
                        const isSelected = selectedDaysForAssignment.includes(date);
                        
                        return (
                          <button
                            key={date}
                            onClick={() => handleDayAssignmentToggle(date)}
                            className={`p-3 rounded-lg border-2 transition-all text-center relative ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            } ${
                              isAssigned && !isSelected
                                ? 'ring-2 ring-orange-200 border-orange-300 bg-orange-50'
                                : ''
                            }`}
                          >
                            <div className="text-sm font-medium">Day {getDayIndex(date)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(date).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </div>
                            {isAssigned && (
                              <div className={`text-xs mt-1 font-medium ${
                                isSelected ? 'text-purple-600' : 'text-orange-600'
                              }`}>
                                {isSelected ? 'Will keep' : 'Currently assigned'}
                              </div>
                            )}
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 h-5 w-5 bg-purple-500 text-white rounded-full flex items-center justify-center">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Days Summary */}
                  {selectedDaysForAssignment.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">
                        This activity will be assigned to {selectedDaysForAssignment.length} day{selectedDaysForAssignment.length !== 1 ? 's' : ''}:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDaysForAssignment.map(date => (
                          <span key={date} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            Day {getDayIndex(date)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowDayAssignmentModal(false);
                      setSelectedActivityForAssignment(null);
                      setSelectedDaysForAssignment([]);
                    }}
                    className="w-1/2 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignActivityToDays}
                    className="w-1/2 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    {selectedDaysForAssignment.length === 0 ? 'Remove from All Days' : `Update ${selectedDaysForAssignment.length} Day${selectedDaysForAssignment.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Custom Activity Modal */}
          {showCustomActivityModal && !showDayAssignmentModal && (
            <div className="absolute inset-0 bg-white z-10 rounded-b-xl flex flex-col">
              {/* Scrollable Form Content - Now includes everything */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6 max-w-2xl mx-auto w-full">
                  {/* Form fields only - no separate header */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Name *
                    </label>
                    <input
                      type="text"
                      value={customActivityData.name}
                      onChange={(e) =>
                        setCustomActivityData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter activity name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={customActivityData.description}
                      onChange={(e) =>
                        setCustomActivityData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe the activity..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={customActivityData.price}
                        onChange={(e) =>
                          setCustomActivityData((prev) => ({
                            ...prev,
                            price: Number(e.target.value),
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <select
                        value={customActivityData.duration}
                        onChange={(e) =>
                          setCustomActivityData((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="30 mins">30 minutes</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="3 hours">3 hours</option>
                        <option value="4 hours">4 hours</option>
                        <option value="Half day">Half day</option>
                        <option value="Full day">Full day</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={customActivityData.category}
                      onChange={(e) =>
                        setCustomActivityData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="sightseeing">Sightseeing</option>
                      <option value="adventure">Adventure</option>
                      <option value="cultural">Cultural</option>
                      <option value="leisure">Leisure</option>
                      <option value="shopping">Shopping</option>
                      <option value="food">Food & Dining</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={customActivityData.image}
                      onChange={(e) =>
                        setCustomActivityData((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Buttons inside the form */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowCustomActivityModal(false)}
                      className="w-1/2 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCustomActivityCreate}
                      className="w-1/2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Create Activity
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Hidden when modals are open */}
          {!showCustomActivityModal && !showDayAssignmentModal && (
            <div className="p-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6 pt-3 overflow-x-auto">
                <button
                  onClick={handleAllTabClick}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    viewMode === 'all'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Activities
                </button>
                {allDays.map(({ date }) => (
                  <button
                    key={date}
                    onClick={() => handleDayTabClick(date)}
                    className={`px-4 py-2 font-medium border-b-2 transition-colors relative whitespace-nowrap ${
                      viewMode === 'day' && selectedDay === date
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Day {getDayIndex(date)}
                    {hasActivitiesForDay(date) && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                        {getActivityCountForDay(date)}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search and Add Activity Bar */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={`Search ${viewMode === 'all' ? 'all activities' : `activities for Day ${getDayIndex(selectedDay)}`}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowCustomActivityModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Custom Activity</span>
                </button>
              </div>

              {/* Day Summary in All Activities View */}
              {viewMode === 'all' && getTotalActivitiesCount() > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Activity Assignment Summary:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {allDays.map(({ date }) => {
                      const count = getActivityCountForDay(date);
                      const totalPrice = getTotalPriceForDay(date);
                      if (count === 0) return null;
                      
                      return (
                        <div key={date} className="bg-white rounded-lg p-3 border border-blue-200">
                          <div className="font-medium text-blue-800">Day {getDayIndex(date)}</div>
                          <div className="text-sm text-gray-600">{count} activity{count !== 1 ? 's' : ''}</div>
                          <div className="text-sm font-semibold text-green-600">₹{totalPrice}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Activities Grid */}
              {isActivitiesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading activities...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getActivitiesForSelectedDay().map((activity) => (
                    <div
                      key={activity.id}
                      className={`border rounded-xl overflow-hidden transition-all ${
                        viewMode === 'day' 
                          ? 'border-purple-200 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                      } ${activity.isCustom ? 'border-green-300 bg-green-50' : ''}`}
                    >
                      <div className="h-32 bg-gray-200 relative">
                        {activity.image && (
                          <img
                            src={activity.image}
                            alt={activity.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {activity.isCustom && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                            Custom
                          </div>
                        )}
                        {viewMode === 'day' && (
                          <button
                            onClick={() => handleRemoveActivityFromDay(activity.id, selectedDay)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{activity.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{activity.duration}</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            ₹{activity.price}
                          </div>
                        </div>

                        {viewMode === 'all' && (
                          <div className="space-y-2">
                            <button
                              onClick={() => handleActivitySelect(activity)}
                              className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                            >
                              Manage Days
                            </button>
                            <div className="text-xs text-gray-500 text-center">
                              Assigned to {allDays.filter(({ date }) => isActivityAssignedToDay(activity.id, date)).length} day{allDays.filter(({ date }) => isActivityAssignedToDay(activity.id, date)).length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        )}

                        {viewMode === 'day' && (
                          <div className="text-xs text-purple-600 font-medium">
                            Assigned to this day
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {getActivitiesForSelectedDay().length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {viewMode === 'all' ? 'No activities found' : 'No activities for this day'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {viewMode === 'all' 
                      ? searchTerm ? 'Try searching for different activities or create a custom one.' : 'No activities available. Create your first custom activity!'
                      : 'Add activities to this day from the "All Activities" tab.'
                    }
                  </p>
                  {viewMode === 'all' && (
                    <button
                      onClick={() => setShowCustomActivityModal(true)}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Create Custom Activity
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}