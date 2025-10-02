"use client";

import { useState } from "react";
import { X, Upload, Calendar } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";
import { DaySelection } from "@/types/type";

interface CustomActivityModalProps {
  onClose: () => void;
  allDays: Array<{ date: string; data: DaySelection }>;
}

export default function CustomActivityModal({ onClose, allDays }: CustomActivityModalProps) {
  const { addCustomActivity, updateDaySelection } = useQuotation();

  const [activityData, setActivityData] = useState({
    name: "",
    description: "",
    price: 0,
    duration: "1 hour",
    category: "sightseeing",
    image: "",
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setActivityData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDayToggle = (date: string) => {
    setSelectedDays(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleCreateActivity = () => {
    if (!activityData.name || !activityData.price) {
      alert("Please fill in all required fields");
      return;
    }

    // Create custom activity
    const newActivity = {
      name: activityData.name,
      description: activityData.description,
      price: activityData.price,
      duration: activityData.duration,
      category: activityData.category,
      image: activityData.image,
      selectedDays: selectedDays,
    };

    addCustomActivity(newActivity);

    // Apply to selected days
    selectedDays.forEach(date => {
      updateDaySelection(date, {
        activities: [{
          ...newActivity,
          id: `custom_${Date.now()}`,
          isCustom: true
        }]
      });
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Custom Activity</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="activity-image"
                />
                <label
                  htmlFor="activity-image"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Upload Image
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Recommended: 400x300px
                </p>
              </div>
            </div>
          </div>

          {/* Activity Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Name *
              </label>
              <input
                type="text"
                value={activityData.name}
                onChange={(e) => setActivityData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter activity name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                value={activityData.price}
                onChange={(e) => setActivityData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                value={activityData.duration}
                onChange={(e) => setActivityData(prev => ({ ...prev, duration: e.target.value }))}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={activityData.category}
                onChange={(e) => setActivityData(prev => ({ ...prev, category: e.target.value }))}
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={activityData.description}
              onChange={(e) => setActivityData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe the activity..."
            />
          </div>

          {/* Day Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="h-4 w-4 inline mr-2" />
              Select Days for this Activity
            </label>
            <div className="flex flex-wrap gap-2">
              {allDays.map(({ date }, index) => (
                <button
                  key={date}
                  type="button"
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateActivity}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Create Activity
          </button>
        </div>
      </div>
    </div>
  );
}