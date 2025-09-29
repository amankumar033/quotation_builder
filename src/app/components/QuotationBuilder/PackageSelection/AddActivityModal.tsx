"use client";

import { useState } from "react";
import { Activity } from "@/types/type";
import { X, Search, Clock, MapPin } from "lucide-react";

interface AddActivityModalProps {
  onClose: () => void;
  activities: Activity[];
}

export default function AddActivityModal({ onClose, activities }: AddActivityModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  const filteredActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddActivity = (activity: Activity) => {
    if (!selectedActivities.find(a => a.id === activity.id)) {
      setSelectedActivities(prev => [...prev, activity]);
    }
  };

  const handleRemoveActivity = (activityId: string) => {
    setSelectedActivities(prev => prev.filter(a => a.id !== activityId));
  };

  const totalSelectedPrice = selectedActivities.reduce((sum, activity) => sum + activity.price, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Add Custom Activities</h3>
            <p className="text-sm text-gray-600 mt-1">Select activities to add to your package</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Available Activities */}
          <div className="flex-1 border-r p-6 overflow-y-auto">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer group"
                  onClick={() => handleAddActivity(activity)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {activity.name}
                    </h4>
                    <span className="font-bold text-green-600">₹{activity.price}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{activity.duration}</span>
                    </div>
                    {activity.category && (
                      <span className="px-2 py-1 bg-gray-100 rounded-full">
                        {activity.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Activities */}
          <div className="w-80 bg-gray-50 p-6 overflow-y-auto">
            <h4 className="font-semibold text-gray-900 mb-4">Selected Activities</h4>
            
            {selectedActivities.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No activities selected</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900 text-sm">
                        {activity.name}
                      </h5>
                      <button
                        onClick={() => handleRemoveActivity(activity.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>{activity.duration}</span>
                      <span className="font-semibold text-green-600">₹{activity.price}</span>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">₹{totalSelectedPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Selected Activities
          </button>
        </div>
      </div>
    </div>
  );
}