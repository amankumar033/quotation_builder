"use client";

import { useState } from "react";
import { Activity } from "@/types/type";
import { ChevronDown, ChevronUp, X, Search, Upload } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";

interface AddActivityAccordionProps {
  activities: Activity[];
  onClose: () => void;
}

export default function AddActivityAccordion({ activities, onClose }: AddActivityAccordionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { daySelections } = useQuotation();

  // Get actual days from itinerary
  const itineraryDays = Object.entries(daySelections).map(([date, data], index) => ({
    value: date,
    label: `Day ${index + 1} - ${new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }));

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddActivity = () => {
    if (selectedActivity && selectedDay) {
      // Here you would typically update the context with the new activity
      console.log("Adding activity:", selectedActivity, "to day:", selectedDay);
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="px-6 py-4 cursor-pointer flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-500 bg-opacity-10 w-10 h-10 text-center">
            <span className="text-white h-8 w-8 ">+</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add Custom Activity</h3>
            <p className="text-sm text-gray-600 mt-1">Select an activity to add to your package</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button> */}
          {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-200 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Selection */}
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedActivity?.id === activity.id
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-100'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-green-600">₹{activity.price}</div>
                        <div className="text-xs text-gray-500 mt-1">{activity.duration}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Form */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Activity Details</h4>
              
              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-20 w-20 object-cover rounded-lg mb-2"
                        />
                        <span className="text-sm text-purple-600">Change Image</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload image</span>
                        <span className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  value={selectedActivity?.name || ""}
                  onChange={(e) => {
                    if (selectedActivity) {
                      setSelectedActivity({
                        ...selectedActivity,
                        name: e.target.value
                      });
                    } else {
                      // Create new activity object if none selected
                      setSelectedActivity({
                        id: Date.now().toString(),
                        name: e.target.value,
                        description: "",
                        price: 0,
                        duration: "1 hour",
                        image: "",
                        agencyId: "",
                        category: "sightseeing"
                      });
                    }
                  }}
                  placeholder="Enter activity name"
                />
              </div>

              {/* Price Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  value={selectedActivity?.price || ""}
                  onChange={(e) => {
                    if (selectedActivity) {
                      setSelectedActivity({
                        ...selectedActivity,
                        price: parseInt(e.target.value) || 0
                      });
                    }
                  }}
                  placeholder="Enter price"
                />
              </div>

              {/* Day Dropdown - Only shows actual itinerary days */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Day
                </label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  <option value="">Select a day</option>
                  {itineraryDays.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddActivity}
                  disabled={!selectedActivity || !selectedDay}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}