"use client";

import { useState } from "react";
import { useQuotation } from "@/context/QuotationContext";
import { Calendar, MapPin, Plus, Edit, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";

export default function DayItinerarySection() {
  const { 
    dayItineraries, 
    addDayItinerary, 
    updateDayItinerary, 
    deleteDayItinerary,
    allDays 
  } = useQuotation();

  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(true);

  const [itineraryData, setItineraryData] = useState({
    dayNumber: 1,
    date: "",
    title: "",
    description: "",
    image: ""
  });

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
    const selectedDay = allDays[dayNumber - 1]; // dayNumber is 1-based, array is 0-based
    setItineraryData(prev => ({
      ...prev,
      dayNumber: dayNumber,
      date: selectedDay?.date || ""
    }));
  };

  // Update day number when date changes
  const handleDateChange = (date: string) => {
    const selectedDayIndex = allDays.findIndex(day => day.date === date);
    const dayNumber = selectedDayIndex + 1; // Convert to 1-based
    setItineraryData(prev => ({
      ...prev,
      date: date,
      dayNumber: dayNumber
    }));
  };

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
            disabled={allDays.length === 0}
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
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div>
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

                  <div>
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

                  <div>
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

                  {/* Buttons inside form (50/50 split) */}
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
              </div>
            </div>
          )}

          {/* Main Content - Hidden when modal is open */}
          {!showItineraryModal && (
            <div className="p-6">
              {allDays.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Trip Days Configured</h4>
                  <p className="text-gray-600 mb-4">
                    Please set trip dates in the client information section first
                  </p>
                </div>
              ) : dayItineraries.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Itinerary Created</h4>
                  <p className="text-gray-600 mb-4">
                    Create a day-wise itinerary to provide detailed schedule for your clients
                  </p>
                  <button
                    onClick={handleCreateItinerary}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create First Itinerary
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {dayItineraries
                    .sort((a, b) => a.dayNumber - b.dayNumber)
                    .map((itinerary) => (
                      <div key={itinerary.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        {/* Day Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-blue-500 text-white px-3 py-1 rounded-full font-semibold">
                                Day {itinerary.dayNumber}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(itinerary.date).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {itinerary.title}
                              </h4>
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
                        </div>

                        {/* Itinerary Content */}
                        <div className="p-6">
                          {itinerary.image && (
                            <img
                              src={itinerary.image}
                              alt={itinerary.title}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                          )}
                          <p className="text-gray-700">{itinerary.description}</p>
                        </div>
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