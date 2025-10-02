"use client";

import { useState } from "react";
import { useQuotation } from "@/context/QuotationContext";
import { Calendar, MapPin, Clock, Car, Utensils, Hotel, Plus, Edit, Trash2 } from "lucide-react";
import DayItineraryModal from "../PackageSelection/DayItineraryModal";

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

  const handleCreateItinerary = () => {
    setEditingItinerary(null);
    setShowItineraryModal(true);
  };

  const handleEditItinerary = (itinerary: any) => {
    setEditingItinerary(itinerary);
    setShowItineraryModal(true);
  };

  const handleSaveItinerary = (itineraryData: any) => {
    if (editingItinerary) {
      updateDayItinerary(editingItinerary.id, itineraryData);
    } else {
      addDayItinerary(itineraryData);
    }
    setShowItineraryModal(false);
    setEditingItinerary(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Day-wise Itinerary</h3>
              <p className="text-sm text-gray-600">
                Create detailed itinerary for each day of the trip
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCreateItinerary}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Itinerary</span>
          </button>
        </div>
      </div>

      {/* Itinerary List */}
      <div className="p-6">
        {dayItineraries.length === 0 ? (
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
                          {new Date(itinerary.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
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
                    <p className="text-gray-700 mb-4">{itinerary.description}</p>

                    {/* Activities */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        Activities
                      </h5>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {itinerary.activities.map((activity: string, index: number) => (
                          <li key={index}>{activity}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Utensils className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">
                          <strong>Meals:</strong> {itinerary.meals.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hotel className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-700">
                          <strong>Accommodation:</strong> {itinerary.accommodation}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-orange-500" />
                        <span className="text-gray-700">
                          <strong>Transport:</strong> {itinerary.transport}
                        </span>
                      </div>
                      {itinerary.approximateDistance && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-red-500" />
                          <span className="text-gray-700">
                            <strong>Distance:</strong> {itinerary.approximateDistance}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Itinerary Modal */}
      {showItineraryModal && (
        <DayItineraryModal
          itinerary={editingItinerary}
          onSave={handleSaveItinerary}
          onClose={() => {
            setShowItineraryModal(false);
            setEditingItinerary(null);
          }}
          availableDays={allDays}
        />
      )}
    </div>
  );
}