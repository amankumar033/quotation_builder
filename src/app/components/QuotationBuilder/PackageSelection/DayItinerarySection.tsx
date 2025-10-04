"use client";

import { useState, useEffect } from "react";
import { useQuotation } from "@/context/QuotationContext";
import { Calendar, MapPin, Star, Plus, Edit, Trash2, X, ChevronDown, ChevronUp, Building, Car, Utensils, Sparkles, CheckCircle, Bed, Users, Route } from "lucide-react";

export default function DayItinerarySection() {
  const { 
    dayItineraries, 
    addDayItinerary, 
    updateDayItinerary, 
    deleteDayItinerary,
    allDays,
    daySelections,
    transportRoutes,
    getCompletionStatus,
    professionalRooms,
    dayMeals
  } = useQuotation();

  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [canCreateItinerary, setCanCreateItinerary] = useState(false);

  const [itineraryData, setItineraryData] = useState({
    dayNumber: 1,
    date: "",
    title: "",
    description: "",
    image: ""
  });

  // FIXED: Check if hotel and transport are completed for all days
  useEffect(() => {
    if (allDays.length === 0) {
      setCanCreateItinerary(false);
      return;
    }

    // Check if ALL days have hotels configured
    const allDaysHaveHotels = allDays.every(day => {
      const daySelection = daySelections[day.date];
      return daySelection?.hotel !== null && daySelection?.hotel !== undefined;
    });

    // Check if transport is configured (at least one route exists)
    const hasTransport = transportRoutes.length > 0;

    setCanCreateItinerary(allDaysHaveHotels && hasTransport);
  }, [allDays, daySelections, transportRoutes]);

  const handleCreateItinerary = () => {
    const firstDay = allDays[0];
    setEditingItinerary(null);
    setItineraryData({
      dayNumber: 1,
      date: firstDay?.date || "",
      title: "",
      description: "",
      image: ""
    });
    setShowItineraryModal(true);
  };

  const handleEditItinerary = (itinerary: any) => {
    setEditingItinerary(itinerary);
    setItineraryData({
      dayNumber: itinerary.dayNumber,
      date: itinerary.date,
      title: itinerary.title,
      description: itinerary.description,
      image: itinerary.image || ""
    });
    setShowItineraryModal(true);
  };

  const handleSaveItinerary = () => {
    if (!itineraryData.title || !itineraryData.description) {
      alert("Please fill in title and description");
      return;
    }

    // Check if itinerary already exists for this day
    const existingItinerary = dayItineraries.find(
      itinerary => itinerary.dayNumber === itineraryData.dayNumber && 
      itinerary.id !== editingItinerary?.id
    );

    if (existingItinerary && !editingItinerary) {
      alert(`An itinerary already exists for Day ${itineraryData.dayNumber}. Please edit the existing itinerary or choose a different day.`);
      return;
    }

    const itineraryPayload = {
      dayNumber: itineraryData.dayNumber,
      date: itineraryData.date,
      title: itineraryData.title,
      description: itineraryData.description,
      image: itineraryData.image,
      activities: [],
      meals: [],
      accommodation: "",
      transport: ""
    };

    if (editingItinerary) {
      updateDayItinerary(editingItinerary.id, itineraryPayload);
    } else {
      addDayItinerary(itineraryPayload);
    }
    setShowItineraryModal(false);
    setEditingItinerary(null);
  };

  // Update date when day number changes
  const handleDayNumberChange = (dayNumber: number) => {
    const selectedDay = allDays[dayNumber - 1];
    setItineraryData(prev => ({
      ...prev,
      dayNumber: dayNumber,
      date: selectedDay?.date || ""
    }));
  };

  // Update day number when date changes
  const handleDateChange = (date: string) => {
    const selectedDayIndex = allDays.findIndex(day => day.date === date);
    const dayNumber = selectedDayIndex + 1;
    setItineraryData(prev => ({
      ...prev,
      date: date,
      dayNumber: dayNumber
    }));
  };

  // Get day summary for the sidebar - ENHANCED with room selection, transport, and meals
  const getDaySummary = (dayNumber: number) => {
    const day = allDays[dayNumber - 1];
    if (!day) return null;

    const daySelection = daySelections[day.date];
    const routes = transportRoutes.filter(route => route.dayNumber === dayNumber);
    
    // Get room selections for this day
    const roomSelections = daySelection?.roomSelections || [];
    const roomDetails = roomSelections.map(selection => {
      const room = professionalRooms.find(r => r.id === selection.roomId);
      return {
        type: room?.type || 'Room',
        count: selection.roomCount,
        adults: selection.adults,
        children: selection.childrenWithBed + selection.childrenWithoutBed,
        price: selection.totalPrice
      };
    });

    // Get meals for this day
    const mealsForDay = dayMeals[day.date] || [];
    const mealDetails = mealsForDay.filter(meal => meal.quantity > 0).map(meal => ({
      name: meal.name,
      type: meal.type,
      quantity: meal.quantity,
      price: meal.price,
      total: meal.price * meal.quantity
    }));

    return {
      date: day.date,
      hotel: daySelection?.hotel,
      transport: routes.length > 0 ? routes[0].vehicle : null,
      activities: daySelection?.activities || [],
      roomSelections: roomDetails,
      routes: routes,
      meals: mealDetails
    };
  };

  const currentDaySummary = getDaySummary(itineraryData.dayNumber);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      {/* Header with accordion toggle */}
      <div 
        className="p-6 border-b border-gray-200 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Day-wise Itinerary</h3>
            <p className="text-sm text-gray-600">
              {allDays.length > 0 
                ? `Create itinerary for ${allDays.length} days` 
                : 'No days available'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCreateItinerary();
            }}
            disabled={!canCreateItinerary}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            <span>Add Itinerary</span>
          </button>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="relative">
          {/* Itinerary Modal */}
          {showItineraryModal && (
            <div className="bg-white rounded-b-xl">
              <div className="p-6 border-b border-gray-200 bg-blue-50 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingItinerary ? 'Edit Itinerary' : 'Create Day Itinerary'}
                </h2>
                <button
                  onClick={() => setShowItineraryModal(false)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex gap-6">
                  {/* Form Section - 2/3 width */}
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200 rounded-lg p-4 bg-white">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Day Number *
                        </label>
                        <select
                          value={itineraryData.dayNumber}
                          onChange={(e) => handleDayNumberChange(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {allDays.length > 0 ? (
                            allDays.map((day, index) => (
                              <option key={day.date} value={index + 1}>
                                Day {index + 1} - {new Date(day.date).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </option>
                            ))
                          ) : (
                            <option value="">No days available</option>
                          )}
                        </select>
                        {allDays.length === 0 && (
                          <p className="text-red-500 text-xs mt-1">
                            Please configure trip dates first
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date *
                        </label>
                        <select
                          value={itineraryData.date}
                          onChange={(e) => handleDateChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {allDays.length > 0 ? (
                            allDays.map((day) => (
                              <option key={day.date} value={day.date}>
                                {new Date(day.date).toLocaleDateString('en-GB', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </option>
                            ))
                          ) : (
                            <option value="">No dates available</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={itineraryData.title}
                        onChange={(e) =>
                          setItineraryData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Arrival in Jaipur, City Tour"
                      />
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={itineraryData.description}
                        onChange={(e) =>
                          setItineraryData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe the day's schedule and highlights..."
                      />
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={itineraryData.image}
                        onChange={(e) =>
                          setItineraryData((prev) => ({
                            ...prev,
                            image: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Buttons inside form */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setShowItineraryModal(false)}
                        className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveItinerary}
                        disabled={!itineraryData.title || !itineraryData.description || allDays.length === 0}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {editingItinerary ? "Update Itinerary" : "Create Itinerary"}
                      </button>
                    </div>
                  </div>

                  {/* Day Summary Section - 1/3 width with scrollable content */}
                  {currentDaySummary && (
                    <div className="w-80 space-y-4 max-h-[600px] overflow-y-auto">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                        Day {itineraryData.dayNumber} Summary
                      </h3>

                      {/* Hotel Information */}
                      {currentDaySummary.hotel && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center space-x-2 mb-3">
                            <Building className="h-4 w-4 text-blue-600" />
                            <h4 className="font-semibold text-gray-900">Hotel</h4>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-900">
                              {currentDaySummary.hotel.name}
                            </p>
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span>{currentDaySummary.hotel.city}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-600">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{currentDaySummary.hotel.starCategory} Star</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Room Selection Summary */}
                      {currentDaySummary.roomSelections.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center space-x-2 mb-3">
                            <Bed className="h-4 w-4 text-green-600" />
                            <h4 className="font-semibold text-gray-900">Room Selection</h4>
                          </div>
                          <div className="space-y-3">
                            {currentDaySummary.roomSelections.map((room, index) => (
                              <div key={index} className="border border-gray-100 rounded p-3 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {room.type}
                                  </span>
                                  <span className="text-sm font-semibold text-green-600">
                                    ₹{room.price}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-600">
                                  <Users className="h-3 w-3" />
                                  <span>{room.count} room(s)</span>
                                  <span>•</span>
                                  <span>{room.adults} adults</span>
                                  {room.children > 0 && (
                                    <>
                                      <span>•</span>
                                      <span>{room.children} children</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Meal Summary */}
                      {currentDaySummary.meals.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center space-x-2 mb-3">
                            <Utensils className="h-4 w-4 text-orange-600" />
                            <h4 className="font-semibold text-gray-900">Meals</h4>
                          </div>
                          <div className="space-y-2">
                            {currentDaySummary.meals.map((meal, index) => (
                              <div key={index} className="flex justify-between items-center py-1">
                                <div>
                                  <span className="text-sm text-gray-700">
                                    {meal.name}
                                  </span>
                                  <div className="text-xs text-gray-500">
                                    {meal.quantity} × ₹{meal.price}
                                  </div>
                                </div>
                                <span className="text-sm font-semibold text-orange-600">
                                  ₹{meal.total}
                                </span>
                              </div>
                            ))}
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold text-sm">
                              <span className="text-gray-700">Total Meals:</span>
                              <span className="text-orange-600">
                                ₹{currentDaySummary.meals.reduce((sum, meal) => sum + meal.total, 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Transport Summary */}
                      {currentDaySummary.routes.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center space-x-2 mb-3">
                            <Car className="h-4 w-4 text-purple-600" />
                            <h4 className="font-semibold text-gray-900">Transport</h4>
                          </div>
                          <div className="space-y-3">
                            {currentDaySummary.routes.map((route, index) => (
                              <div key={index} className="border border-gray-100 rounded p-3 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {/* FIXED: Render vehicle name instead of vehicle object */}
                                    {route.vehicle?.name || 'Transport'}
                                  </span>
                                  {route.price > 0 && (
                                    <span className="text-sm font-semibold text-purple-600">
                                      ₹{route.price}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div className="flex items-center space-x-1">
                                    <Route className="h-3 w-3" />
                                    <span>From: {route.from}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Route className="h-3 w-3" />
                                    <span>To: {route.to}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 capitalize">
                                    Type: {route.type}
                                  </div>
                                  {route.isComplimentary && (
                                    <div className="text-xs text-green-600 font-medium">
                                      Complimentary
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Activities Summary */}
                      {currentDaySummary.activities.length > 0 && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex items-center space-x-2 mb-3">
                            <Sparkles className="h-4 w-4 text-pink-600" />
                            <h4 className="font-semibold text-gray-900">Activities</h4>
                          </div>
                          <div className="space-y-2">
                            {currentDaySummary.activities.map((activity, index) => (
                              <div key={index} className="flex justify-between items-center py-1">
                                <span className="text-sm text-gray-700">
                                  {activity.name}
                                </span>
                                <span className="text-sm font-semibold text-pink-600">
                                  ₹{activity.price}
                                </span>
                              </div>
                            ))}
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold text-sm">
                              <span className="text-gray-700">Activities Total:</span>
                              <span className="text-pink-600">
                                ₹{currentDaySummary.activities.reduce((sum, activity) => sum + activity.price, 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Existing Itineraries */}
          {!showItineraryModal && (
            <div className="p-6">
              {dayItineraries.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Itineraries Created
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {!canCreateItinerary 
                      ? "Please configure hotels for all days and add transport before creating itineraries."
                      : "Create your first day itinerary to organize your trip schedule."
                    }
                  </p>
                  {!canCreateItinerary && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto mb-6">
                      <div className="flex items-center space-x-2 text-yellow-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Requirements:</span>
                      </div>
                      <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                        <li>• Configure hotels for all days</li>
                        <li>• Add at least one transport route</li>
                      </ul>
                    </div>
                  )}
                  {canCreateItinerary && (
                    <button
                      onClick={handleCreateItinerary}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Create First Itinerary
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-6">
                  {dayItineraries.map((itinerary) => (
                    <div
                      key={itinerary.id}
                      className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors bg-white"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Day {itinerary.dayNumber}: {itinerary.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(itinerary.date).toLocaleDateString("en-GB", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditItinerary(itinerary)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteDayItinerary(itinerary.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{itinerary.description}</p>
                      {itinerary.image && (
                        <div className="mb-4">
                          <img
                            src={itinerary.image}
                            alt={itinerary.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}