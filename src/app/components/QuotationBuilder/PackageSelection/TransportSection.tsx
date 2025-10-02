"use client";

import { Transport, DaySelection, TransportRoute } from "@/types/type";
import { ChevronDown, ChevronUp, Car, Plus, Route, MapPin, Trash2, Edit, X, Users, IndianRupee, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuotation } from "@/context/QuotationContext";

interface TransportSectionProps {
  transportations: Transport[];
  isTransportLoading: boolean;
  theme: { bg: string; text: string; border: string };
  isSectionActive: boolean;
  toggleSection: () => void;
  allDays: Array<{ date: string; data: DaySelection }>;
}

const sampleTransports: Transport[] = [
  {
    id: 1,
    name: "Toyota Innova",
    type: "SUV",
    capacity: 6,
    price: 2500,
    features: ["AC", "Spacious", "GPS", "Comfortable"],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop",
    passengers: 6,
    perDay: 2500,
    perKm: 12,
    photos: "",
    maxCapacity: 6,
    vehicleType: "SUV"
  },
  {
    id: 2,
    name: "Mahindra XUV700",
    type: "Premium SUV",
    capacity: 7,
    price: 3500,
    features: ["AC", "Premium Interior", "Music System", "Sunroof"],
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop",
    passengers: 7,
    perDay: 3500,
    perKm: 15,
    photos: "",
    maxCapacity: 7,
    vehicleType: "SUV"
  },
  {
    id: 3,
    name: "12-Seater Tempo Traveller",
    type: "Minibus",
    capacity: 12,
    price: 4500,
    features: ["AC", "Spacious", "Comfortable Seats", "Luggage Space"],
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=250&fit=crop",
    passengers: 12,
    perDay: 4500,
    perKm: 18,
    photos: "",
    maxCapacity: 12,
    vehicleType: "Minibus"
  }
];

// Create a separate component for each day to fix hook order
interface DayRouteProps {
  day: { date: string; data: DaySelection };
  dayNumber: number;
  dayRoutes: TransportRoute[];
  pickupLocation: string;
  firstDayHotel: string | undefined;
  hasPickupRoute: boolean;
  onAddPickup: (dayNumber: number) => void;
  onRemovePickup: () => void;
  onAddRoute: (routeData: Omit<TransportRoute, 'id'>) => void;
  onEditRoute: (route: TransportRoute) => void;
  onDeleteRoute: (routeId: string) => void;
  availableVehicles: Transport[];
}

function DayRouteItem({ 
  day, 
  dayNumber, 
  dayRoutes, 
  pickupLocation, 
  firstDayHotel, 
  hasPickupRoute, 
  onAddPickup, 
  onRemovePickup, 
  onAddRoute, 
  onEditRoute,
  onDeleteRoute,
  availableVehicles
}: DayRouteProps) {
  const [showDayRoutes, setShowDayRoutes] = useState(dayRoutes.length > 0);
  const [showAddRouteForm, setShowAddRouteForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [routeData, setRouteData] = useState({
    from: dayNumber === 1 ? pickupLocation : "",
    to: "",
    type: (dayNumber === 1 ? "pickup" : "transfer") as "pickup" | "transfer" | "sightseeing" | "drop",
    vehicle: null as Transport | null
  });
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const routeTypes = [
    { value: "pickup", label: "Pickup", description: "Client pickup from location", color: "purple" },
    { value: "transfer", label: "Transfer", description: "Hotel to hotel transfer", color: "blue" },
    { value: "sightseeing", label: "Sightseeing", description: "Tour and sightseeing", color: "green" },
    { value: "drop", label: "Drop", description: "Final drop to location", color: "red" }
  ];

  // Auto-expand when routes are added
  useEffect(() => {
    if (dayRoutes.length > 0) {
      setShowDayRoutes(true);
    }
  }, [dayRoutes.length]);

  const totalDayCost = dayRoutes.reduce((total, route) => total + (route.price || 0), 0);

  const calculateRoutePrice = () => {
    if (!routeData.vehicle) return 0;
    return routeData.vehicle.perDay || routeData.vehicle.price || 0;
  };

  const handleSaveRoute = () => {
    let fromLocation = routeData.from;
    let toLocation = routeData.to;

    // Use custom values if "custom" is selected
    if (routeData.from === "custom" && customFrom.trim()) {
      fromLocation = customFrom.trim();
    }
    if (routeData.to === "custom" && customTo.trim()) {
      toLocation = customTo.trim();
    }

    if (!fromLocation || !toLocation) {
      alert("Please fill in both from and to locations");
      return;
    }
    if (!routeData.vehicle) {
      alert("Please select a vehicle for this route");
      return;
    }
    
    const price = calculateRoutePrice();
    
    const routePayload: Omit<TransportRoute, 'id'> = {
      from: fromLocation,
      to: toLocation,
      type: routeData.type,
      dayNumber: dayNumber,
      vehicle: routeData.vehicle,
      price: price,
      isComplimentary: routeData.type === 'pickup' && price === 0
    };
    
    onAddRoute(routePayload);
    
    // Reset form
    setRouteData({
      from: dayNumber === 1 ? pickupLocation : "",
      to: "",
      type: dayNumber === 1 ? "pickup" : "transfer",
      vehicle: null
    });
    setCustomFrom("");
    setCustomTo("");
    setShowAddRouteForm(false);
    setEditingRoute(null);
  };

  const handleEditRoute = (route: TransportRoute) => {
    setRouteData({
      from: route.from,
      to: route.to,
      type: route.type,
      vehicle: route.vehicle
    });
    setEditingRoute(route);
    setShowAddRouteForm(true);
  };

  const handleCancel = () => {
    setShowAddRouteForm(false);
    setEditingRoute(null);
    setRouteData({
      from: dayNumber === 1 ? pickupLocation : "",
      to: "",
      type: dayNumber === 1 ? "pickup" : "transfer",
      vehicle: null
    });
    setCustomFrom("");
    setCustomTo("");
  };

  const getHotelsForDay = () => {
    return day.data.hotel ? [day.data.hotel.name] : [];
  };

  const isRouteStepValid = () => {
    const fromLocation = routeData.from === "custom" ? customFrom.trim() : routeData.from;
    const toLocation = routeData.to === "custom" ? customTo.trim() : routeData.to;
    return fromLocation && toLocation && routeData.vehicle !== null;
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      purple: "bg-purple-500 border-purple-500",
      blue: "bg-blue-500 border-blue-500",
      green: "bg-green-500 border-green-500",
      red: "bg-red-500 border-red-500"
    };
    return colors[color] || "bg-gray-500 border-gray-500";
  };

  // Handle dropdown changes
  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRouteData(prev => ({ ...prev, from: value }));
    if (value !== "custom") {
      setCustomFrom("");
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRouteData(prev => ({ ...prev, to: value }));
    if (value !== "custom") {
      setCustomTo("");
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
            {dayNumber}
          </div>
          <div>
            <h5 className="font-semibold text-gray-900">
              Day {dayNumber} - {new Date(day.date).toLocaleDateString()}
            </h5>
            <p className="text-sm text-gray-600">
              {dayRoutes.length} route{dayRoutes.length !== 1 ? 's' : ''} • ₹{totalDayCost}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!showAddRouteForm && (
            <button
              onClick={() => setShowAddRouteForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Route
            </button>
          )}
          <button
            onClick={() => setShowDayRoutes(!showDayRoutes)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showDayRoutes ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Day 1 Pickup Option - Show remove option when pickup exists */}
      {dayNumber === 1 && pickupLocation && firstDayHotel && (
        <div className={`mt-3 rounded-lg p-3 border ${
          hasPickupRoute 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
            : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className={`h-4 w-4 ${hasPickupRoute ? 'text-green-600' : 'text-purple-600'}`} />
              <div>
                <div className={`font-medium text-sm ${hasPickupRoute ? 'text-green-800' : 'text-purple-800'}`}>
                  {hasPickupRoute ? 'Pickup Service Added' : 'Pickup Service Available'}
                </div>
                <div className={`text-xs ${hasPickupRoute ? 'text-green-600' : 'text-purple-600'}`}>
                  {pickupLocation} → {firstDayHotel}
                </div>
              </div>
            </div>
            {hasPickupRoute ? (
              <button
                onClick={onRemovePickup}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs flex items-center"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remove
              </button>
            ) : (
              <button
                onClick={() => onAddPickup(dayNumber)}
                className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs"
              >
                Add Pickup
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Route Form - Integrated directly in the day section with white theme */}
      {showAddRouteForm && (
        <div className="mt-4 bg-white rounded-lg p-4 border-2 border-blue-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h6 className="font-semibold text-gray-900 text-lg">
              {editingRoute ? 'Edit Route' : 'Add New Route'}
            </h6>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Route Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {routeTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setRouteData(prev => ({ ...prev, type: type.value as any }))}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      routeData.type === type.value
                        ? `${getColorClass(type.color)} text-white shadow-md`
                        : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs opacity-90 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={routeData.from}
                    onChange={handleFromChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select starting point</option>
                    {dayNumber === 1 && pickupLocation && (
                      <option value={pickupLocation}>{pickupLocation} (Pickup)</option>
                    )}
                    {getHotelsForDay().map((hotel, index) => (
                      <option key={index} value={hotel}>{hotel}</option>
                    ))}
                    <option value="custom">Custom Location</option>
                  </select>
                </div>
                {routeData.from === "custom" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter custom location"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                    {!customFrom.trim() && (
                      <p className="text-red-500 text-xs mt-1">Please enter a custom location</p>
                    )}
                  </div>
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
                    onChange={handleToChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select destination</option>
                    {getHotelsForDay().map((hotel, index) => (
                      <option key={index} value={hotel}>{hotel}</option>
                    ))}
                    <option value="custom">Custom Location</option>
                  </select>
                </div>
                {routeData.to === "custom" && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter custom location"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                    {!customTo.trim() && (
                      <p className="text-red-500 text-xs mt-1">Please enter a custom location</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Car className="h-4 w-4 mr-2 text-blue-600" />
                Select Vehicle *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                {availableVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => setRouteData(prev => ({ ...prev, vehicle }))}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                      routeData.vehicle?.id === vehicle.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="font-semibold text-gray-900 text-sm">{vehicle.name}</div>
                          {routeData.vehicle?.id === vehicle.id && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="h-2 w-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="mt-1 space-y-1">
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
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            {routeData.vehicle && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Route Summary</div>
                    <div className="text-sm text-gray-600">
                      {routeData.from === "custom" ? customFrom : routeData.from} → {routeData.to === "custom" ? customTo : routeData.to}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoute}
                disabled={!isRouteStepValid()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
              >
                <Route className="h-4 w-4" />
                <span>{editingRoute ? 'Update Route' : 'Add Route'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routes List - Auto-expanded when routes exist */}
      {showDayRoutes && (
        <div className="mt-4 space-y-3 border-t pt-4">
          {dayRoutes.length === 0 && !showAddRouteForm ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No routes added for this day
            </div>
          ) : (
            dayRoutes.map((route) => (
              <div
                key={route.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    route.isComplimentary ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    <Route className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">
                      {route.from} → {route.to}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center space-x-2 mt-1">
                      <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                        {route.type}
                      </span>
                      {route.vehicle && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md">
                          {route.vehicle.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-sm ${
                    route.isComplimentary ? 'text-purple-600' : 'text-green-600'
                  }`}>
                    {route.isComplimentary ? 'Complimentary' : `₹${route.price || 0}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {route.vehicle?.name}
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-3">
                  <button
                    onClick={() => handleEditRoute(route)}
                    className="p-1 text-blue-600 hover:text-blue-800 rounded transition-colors"
                    title="Edit Route"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {!route.isComplimentary && (
                    <button
                      onClick={() => onDeleteRoute(route.id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded transition-colors"
                      title="Delete Route"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function TransportSection({
  transportations = sampleTransports,
  isTransportLoading = false,
  theme,
  isSectionActive,
  toggleSection,
  allDays
}: TransportSectionProps) {
  const {
    daySelections,
    transportRoutes,
    addTransportRoute,
    updateTransportRoute,
    deleteTransportRoute,
    getRoutesForDay,
    pickupLocation,
    addPickupRoute,
    removePickupRoute
  } = useQuotation();

  const handleAddRoute = (routeData: Omit<TransportRoute, 'id'>) => {
    addTransportRoute(routeData);
  };

  const handleEditRoute = (route: TransportRoute) => {
    updateTransportRoute(route.id, route);
  };

  const handleAddPickup = (dayNumber: number) => {
    addPickupRoute(pickupLocation, firstDayHotel!);
  };

  const hasPickupRoute = transportRoutes.some(route => route.isComplimentary);
  const firstDayHotel = allDays[0]?.data.hotel?.name;

  const totalTransportCost = transportRoutes.reduce((total, route) => {
    return total + (route.price || 0);
  }, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className={`p-6 cursor-pointer transition-all duration-300 ${
          isSectionActive ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-white'
        }`}
        onClick={toggleSection}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center`}>
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Transport</h3>
              <p className="text-sm text-gray-600">
                {transportRoutes.length > 0 
                  ? `${transportRoutes.length} routes configured • ₹${totalTransportCost}`
                  : `Plan transport for ${allDays.length} days`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {transportRoutes.length > 0 && (
              <div className="flex items-center space-x-2 text-green-600">
                <span className="font-medium">{transportRoutes.length} Routes</span>
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
          {Object.keys(daySelections).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Please add days to your itinerary first
            </div>
          ) : (
            <div className="space-y-4">
              {allDays.map((day, index) => {
                const dayNumber = index + 1;
                const dayRoutes = getRoutesForDay(dayNumber);
                
                return (
                  <DayRouteItem
                    key={day.date}
                    day={day}
                    dayNumber={dayNumber}
                    dayRoutes={dayRoutes}
                    pickupLocation={pickupLocation}
                    firstDayHotel={firstDayHotel}
                    hasPickupRoute={hasPickupRoute}
                    onAddPickup={handleAddPickup}
                    onRemovePickup={removePickupRoute}
                    onAddRoute={handleAddRoute}
                    onEditRoute={handleEditRoute}
                    onDeleteRoute={deleteTransportRoute}
                    availableVehicles={transportations}
                  />
                );
              })}
            </div>
          )}

          {/* Total Summary */}
          {transportRoutes.length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Transport Summary</h4>
                  <p className="text-sm text-gray-600">
                    {transportRoutes.length} total routes
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{totalTransportCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Cost</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}