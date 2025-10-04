"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { DaySelection } from "@/types/type";
import "react-quill/dist/quill.snow.css";

interface DayItineraryModalProps {
  itinerary?: any;
  onSave: (data: any) => void;
  onClose: () => void;
  availableDays: Array<{ date: string; data: DaySelection }>;
}

export default function DayItineraryModal({ itinerary, onSave, onClose, availableDays }: DayItineraryModalProps) {
  const [formData, setFormData] = useState({
    dayNumber: 1,
    date: "",
    title: "",
    description: "",
    activities: [""],
    meals: [""],
    accommodation: "",
    transport: "",
    approximateDistance: "",
    approximateTime: ""
  });

  useEffect(() => {
    if (itinerary) {
      setFormData({
        dayNumber: itinerary.dayNumber || 1,
        date: itinerary.date || "",
        title: itinerary.title || "",
        description: itinerary.description || "",
        activities: itinerary.activities || [""],
        meals: itinerary.meals || [""],
        accommodation: itinerary.accommodation || "",
        transport: itinerary.transport || "",
        approximateDistance: itinerary.approximateDistance || "",
        approximateTime: itinerary.approximateTime || ""
      });
    } else {
      // Set default values for new itinerary
      const firstDay = availableDays[0];
      setFormData(prev => ({
        ...prev,
        dayNumber: 1,
        date: firstDay?.date || "",
        meals: ["Breakfast", "Lunch", "Dinner"]
      }));
    }
  }, [itinerary, availableDays]);

  const handleAddActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, ""]
    }));
  };

  const handleRemoveActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const handleActivityChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.map((activity, i) => i === index ? value : activity)
    }));
  };

  const handleAddMeal = () => {
    setFormData(prev => ({
      ...prev,
      meals: [...prev.meals, ""]
    }));
  };

  const handleRemoveMeal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index)
    }));
  };

  const handleMealChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.map((meal, i) => i === index ? value : meal)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty activities and meals
    const filteredData = {
      ...formData,
      activities: formData.activities.filter(activity => activity.trim() !== ""),
      meals: formData.meals.filter(meal => meal.trim() !== "")
    };

    onSave(filteredData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {itinerary ? 'Edit Itinerary' : 'Create Day Itinerary'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg bg-white">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day Number *
              </label>
              <select
                value={formData.dayNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, dayNumber: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {availableDays.map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Day {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Arrival in Jaipur, City Tour"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the day's schedule and highlights..."
              required
            />
          </div>

          {/* Activities */}
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activities *
            </label>
            <div className="space-y-2">
              {formData.activities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => handleActivityChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Activity ${index + 1}`}
                  />
                  {formData.activities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddActivity}
                className="flex items-center space-x-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Activity</span>
              </button>
            </div>
          </div>

          {/* Meals */}
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meals Included
            </label>
            <div className="space-y-2">
              {formData.meals.map((meal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={meal}
                    onChange={(e) => handleMealChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Meal ${index + 1}`}
                  />
                  {formData.meals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMeal(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMeal}
                className="flex items-center space-x-2 px-4 py-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Meal</span>
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accommodation
                </label>
                <input
                  type="text"
                  value={formData.accommodation}
                  onChange={(e) => setFormData(prev => ({ ...prev, accommodation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Hotel name or accommodation details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transport
                </label>
                <input
                  type="text"
                  value={formData.transport}
                  onChange={(e) => setFormData(prev => ({ ...prev, transport: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Transport details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approximate Distance
                </label>
                <input
                  type="text"
                  value={formData.approximateDistance}
                  onChange={(e) => setFormData(prev => ({ ...prev, approximateDistance: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 250 km"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approximate Time
                </label>
                <input
                  type="text"
                  value={formData.approximateTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, approximateTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 5-6 hours"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {itinerary ? 'Update Itinerary' : 'Create Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}