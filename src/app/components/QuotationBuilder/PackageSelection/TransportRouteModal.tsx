"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Route, Car, Users, Check, IndianRupee } from "lucide-react";
import { Transport } from "@/types/type";

interface TransportRouteModalProps {
  dayNumber: number;
  pickupLocation: string;
  hotels: string[];
  availableVehicles: Transport[];
  editingRoute?: any;
  onClose: () => void;
  onSave: (routeData: any) => void;
}

export default function TransportRouteModal({
  dayNumber,
  pickupLocation,
  hotels,
  availableVehicles,
  editingRoute,
  onClose,
  onSave
}: TransportRouteModalProps) {
  const [routeData, setRouteData] = useState({
    from: editingRoute?.from || (dayNumber === 1 ? pickupLocation : ""),
    to: editingRoute?.to || "",
    type: editingRoute?.type || (dayNumber === 1 ? "pickup" as const : "transfer" as const),
    vehicle: editingRoute?.vehicle || null as Transport | null
  });

  const [currentStep, setCurrentStep] = useState<"route" | "vehicle">(editingRoute ? "vehicle" : "route");

  const routeTypes = [
    { value: "pickup", label: "Pickup", description: "Client pickup from location", color: "purple" },
    { value: "transfer", label: "Transfer", description: "Hotel to hotel transfer", color: "blue" },
    { value: "sightseeing", label: "Sightseeing", description: "Tour and sightseeing", color: "green" },
    { value: "drop", label: "Drop", description: "Final drop to location", color: "red" }
  ];

  const calculateRoutePrice = () => {
    if (!routeData.vehicle) return 0;
    // Use perDay price from vehicle, fallback to price property
    return routeData.vehicle.perDay || routeData.vehicle.price || 0;
  };

  const handleSave = () => {
    if (!routeData.from || !routeData.to) {
      alert("Please fill in both from and to locations");
      return;
    }
    if (!routeData.vehicle) {
      alert("Please select a vehicle for this route");
      return;
    }
    
    const price = calculateRoutePrice();
    
    onSave({
      ...routeData,
      price: price,
      dayNumber
    });
  };

  const isRouteStepValid = routeData.from && routeData.to;
  const isVehicleStepValid = routeData.vehicle !== null;
  const isFormValid = isRouteStepValid && isVehicleStepValid;

  const getColorClass = (color: string) => {
    const colors: any = {
      purple: "bg-purple-500 border-purple-500",
      blue: "bg-blue-500 border-blue-500",
      green: "bg-green-500 border-green-500",
      red: "bg-red-500 border-red-500"
    };
    return colors[color] || "bg-gray-500 border-gray-500";
  };

  // Auto-advance to vehicle selection when route is valid
  useEffect(() => {
    if (isRouteStepValid && currentStep === "route" && !editingRoute) {
      setCurrentStep("vehicle");
    }
  }, [isRouteStepValid, currentStep, editingRoute]);

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Route className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {editingRoute ? 'Edit Transport Route' : 'Add Transport Route'}
            </h3>
            <p className="text-sm text-gray-600">Day {dayNumber}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${currentStep === "route" ? "text-blue-600" : "text-gray-400"}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm ${
              currentStep === "route" ? "bg-blue-600 border-blue-600 text-white" : 
              "bg-gray-100 border-gray-300 text-gray-600"
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Route Details</span>
          </div>
          <div className="w-12 h-1 bg-gray-300"></div>
          <div className={`flex items-center space-x-2 ${currentStep === "vehicle" ? "text-blue-600" : "text-gray-400"}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm ${
              currentStep === "vehicle" ? "bg-blue-600 border-blue-600 text-white" : 
              "bg-gray-100 border-gray-300 text-gray-600"
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Vehicle Selection</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 max-h-[50vh] overflow-y-auto">
        {currentStep === "route" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Route Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Route Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {routeTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setRouteData(prev => ({ ...prev, type: type.value as any }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        routeData.type === type.value
                          ? `${getColorClass(type.color)} text-white`
                          : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-md"
                      }`}
                    >
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs opacity-90 mt-1">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      value={routeData.from}
                      onChange={(e) => setRouteData(prev => ({ ...prev, from: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select starting point</option>
                      {dayNumber === 1 && pickupLocation && (
                        <option value={pickupLocation}>{pickupLocation} (Pickup)</option>
                      )}
                      {hotels.map((hotel, index) => (
                        <option key={index} value={hotel}>{hotel}</option>
                      ))}
                      <option value="custom">Custom Location</option>
                    </select>
                  </div>
                  {routeData.from === "custom" && (
                    <input
                      type="text"
                      placeholder="Enter custom location"
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setRouteData(prev => ({ ...prev, from: e.target.value }))}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select
                      value={routeData.to}
                      onChange={(e) => setRouteData(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select destination</option>
                      {hotels.map((hotel, index) => (
                        <option key={index} value={hotel}>{hotel}</option>
                      ))}
                      <option value="custom">Custom Location</option>
                    </select>
                  </div>
                  {routeData.to === "custom" && (
                    <input
                      type="text"
                      placeholder="Enter custom location"
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setRouteData(prev => ({ ...prev, to: e.target.value }))}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setCurrentStep("vehicle")}
                disabled={!isRouteStepValid}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>Next: Select Vehicle</span>
                <Car className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
                <Car className="h-4 w-4 mr-2 text-blue-600" />
                Select Vehicle *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto p-2">
                {availableVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => setRouteData(prev => ({ ...prev, vehicle }))}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                      routeData.vehicle?.id === vehicle.id
                        ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="font-semibold text-gray-900 text-sm">{vehicle.name}</div>
                          {routeData.vehicle?.id === vehicle.id && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{vehicle.capacity} passengers</span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            <span className="font-semibold text-green-600">
                              ₹{vehicle.perDay || vehicle.price}/day
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {vehicle.features.slice(0, 2).map((feature: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {feature}
                            </span>
                          ))}
                          {vehicle.features.length > 2 && (
                            <span className="text-xs text-gray-500">+{vehicle.features.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Calculation */}
            {routeData.vehicle && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Route Summary</div>
                    <div className="text-gray-600 text-sm mt-1">
                      {routeData.from} → {routeData.to}
                    </div>
                    <div className="text-xs text-gray-500 capitalize mt-1">
                      {routeData.type} • {routeData.vehicle.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      ₹{calculateRoutePrice()}
                    </div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep("route")}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <span>← Back to Route</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Route className="h-4 w-4" />
                <span>{editingRoute ? 'Update Route' : 'Add Route'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}