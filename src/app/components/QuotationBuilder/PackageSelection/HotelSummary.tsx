import React from "react";
import { ChevronDown, ChevronUp, X, ArrowLeft, Check, Edit, Users, Crown, Bed, Star, Receipt, MapPin, Building, Calendar, CalendarDays, Utensils, Coffee, Sun, Moon } from "lucide-react";
import { Hotel, RoomSelection, Meal } from "@/types/type";
import { useQuotation } from "@/context/QuotationContext";

interface HotelSummaryProps {
  hotel: Hotel;
  selections: RoomSelection[];
  meals: Meal[];
  onEdit: () => void;
  theme: { bg: string; text: string; border: string };
  date: string;
  dayNumber: number;
}

interface RoomSelectionWithDetails extends RoomSelection {
  roomDetails?: {
    id: number;
    type: string;
    price: number;
    maxAdults: number;
    maxChildren: number;
    bedType: string;
    amenities: string[];
    description: string;
    photos: string[];
  };
}

export default function HotelSummary({ hotel, selections, meals, onEdit, theme, date, dayNumber }: HotelSummaryProps) {
  const { professionalRooms, dayMeals } = useQuotation();

  // Get all room selections with their details - filter out invalid ones
  const roomSelectionsWithDetails: RoomSelectionWithDetails[] = selections
    .map(selection => {
      const room = professionalRooms.find((r) => r.id === selection?.roomId);
      if (!room) return null;
      
      return {
        ...selection,
        roomDetails: room
      };
    })
    .filter((selection): selection is RoomSelectionWithDetails => selection !== null);

  // Get meals for this specific day
  const daySpecificMeals = dayMeals[date] || meals;
  
  // Calculate prices for all rooms
  const totalRoomPrice = roomSelectionsWithDetails.reduce((total: number, selection: RoomSelectionWithDetails) => {
    return total + selection.totalPrice;
  }, 0);

  const mealPrice = daySpecificMeals.reduce(
    (total: number, meal: Meal) => total + meal.price * meal.quantity,
    0
  );
  const totalPrice = totalRoomPrice + mealPrice;
  
  // Calculate total guests across all room selections
  const totalGuests = roomSelectionsWithDetails.reduce((total: number, selection: RoomSelectionWithDetails) => 
    total + selection.adults + selection.childrenWithBed + selection.childrenWithoutBed + selection.adultsWithExtraBed, 0
  );

  // Calculate total rooms
  const totalRooms = roomSelectionsWithDetails.reduce((total: number, selection: RoomSelectionWithDetails) => 
    total + selection.roomCount, 0
  );

  // Group meals by type for better display
  const mealsByType = daySpecificMeals.reduce((acc: Record<string, Meal[]>, meal: Meal) => {
    if (meal.quantity > 0) {
      if (!acc[meal.type]) acc[meal.type] = [];
      acc[meal.type].push(meal);
    }
    return acc;
  }, {});

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-4 w-4" />;
      case 'lunch': return <Sun className="h-4 w-4" />;
      case 'dinner': return <Moon className="h-4 w-4" />;
      default: return <Utensils className="h-4 w-4" />;
    }
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'from-orange-400 to-orange-600';
      case 'lunch': return 'from-blue-400 to-blue-600';
      case 'dinner': return 'from-indigo-400 to-indigo-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{hotel.name}</h1>
            <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{hotel.city}</span>
              </div>
              <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                <Star className="h-3 w-3" />
                <span className="font-medium">{hotel.starCategory}</span>
              </div>
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                Day {dayNumber}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Edit className="h-4 w-4" />
          <span className="font-medium">Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Stay Details */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            Stay Details
          </h3>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-800">{formattedDate}</div>
                <div className="text-sm text-blue-600 mt-1">Check-in Date</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Guests</span>
                </div>
                <div className="text-lg font-bold text-gray-900 mt-1">{totalGuests}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Bed className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Rooms</span>
                </div>
                <div className="text-lg font-bold text-gray-900 mt-1">{totalRooms}</div>
              </div>
            </div>

            {/* Room Types Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <div className="text-center">
                <div className="font-semibold text-green-800 text-sm mb-2">
                  {roomSelectionsWithDetails.length} Room Type{roomSelectionsWithDetails.length > 1 ? 's' : ''}
                </div>
                <div className="text-xs text-green-600 space-y-1">
                  {roomSelectionsWithDetails.map((selection, index) => (
                    <div key={index}>
                      {selection.roomCount} × {selection.roomDetails?.type}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Configuration */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            Guest Breakdown
          </h3>

          <div className="space-y-3">
            {/* Calculate totals across all room selections */}
            {(() => {
              const totalAdults = roomSelectionsWithDetails.reduce((sum: number, selection: RoomSelectionWithDetails) => sum + selection.adults, 0);
              const totalAdultsWithExtraBed = roomSelectionsWithDetails.reduce((sum: number, selection: RoomSelectionWithDetails) => sum + selection.adultsWithExtraBed, 0);
              const totalChildrenWithBed = roomSelectionsWithDetails.reduce((sum: number, selection: RoomSelectionWithDetails) => sum + selection.childrenWithBed, 0);
              const totalChildrenWithoutBed = roomSelectionsWithDetails.reduce((sum: number, selection: RoomSelectionWithDetails) => sum + selection.childrenWithoutBed, 0);

              return (
                <>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Adults</span>
                    </div>
                    <span className="font-bold text-blue-700">{totalAdults}</span>
                  </div>
                  
                  {totalAdultsWithExtraBed > 0 && (
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Adults (Extra Bed)</span>
                      </div>
                      <span className="font-bold text-orange-700">{totalAdultsWithExtraBed}</span>
                    </div>
                  )}
                  
                  {totalChildrenWithBed > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Children (With Bed)</span>
                      </div>
                      <span className="font-bold text-green-700">{totalChildrenWithBed}</span>
                    </div>
                  )}
                  
                  {totalChildrenWithoutBed > 0 && (
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Children (No Bed)</span>
                      </div>
                      <span className="font-bold text-indigo-700">{totalChildrenWithoutBed}</span>
                    </div>
                  )}
                </>
              );
            })()}

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
              <div className="text-center">
                <div className="font-bold text-purple-700 text-lg">Total: {totalGuests} Guests</div>
                <div className="text-xs text-purple-600 mt-1">
                  Across {totalRooms} room{totalRooms > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Receipt className="h-4 w-4 text-green-600" />
            </div>
            Price Summary
          </h3>

          <div className="space-y-4">
            {/* Room Costs - Show each room type */}
            {roomSelectionsWithDetails.map((selection, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {selection.roomDetails?.type} × {selection.roomCount}
                  </span>
                  <span className="font-semibold text-blue-600">
                    ₹{selection.totalPrice}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Base: {selection.roomCount} × ₹{selection.roomDetails?.price}</div>
                  {selection.childrenWithBed > 0 && (
                    <div>Children with bed: {selection.childrenWithBed} × ₹500</div>
                  )}
                  {selection.adultsWithExtraBed > 0 && (
                    <div>Adults with extra bed: {selection.adultsWithExtraBed} × ₹800</div>
                  )}
                </div>
              </div>
            ))}

            {mealPrice > 0 && (
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Meals</span>
                  <span className="font-semibold text-blue-600">₹{mealPrice}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {Object.keys(mealsByType).length} meal type(s) selected
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-300 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-green-700 text-xl">₹{totalPrice}</span>
              </div>
              <div className="text-xs text-green-600 mt-2 text-center">
                For Day {dayNumber} • {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Room Breakdown */}
      {roomSelectionsWithDetails.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Bed className="h-4 w-4 text-blue-600" />
            </div>
            All Room Selections
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomSelectionsWithDetails.map((selection, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">{selection.roomDetails?.type}</h4>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {selection.roomCount} room{selection.roomCount > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-medium">₹{selection.roomDetails?.price}/room</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adults:</span>
                    <span className="font-medium">{selection.adults}</span>
                  </div>
                  {selection.adultsWithExtraBed > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Adults (Extra Bed):</span>
                      <span className="font-medium">{selection.adultsWithExtraBed}</span>
                    </div>
                  )}
                  {selection.childrenWithBed > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Children (With Bed):</span>
                      <span className="font-medium">{selection.childrenWithBed}</span>
                    </div>
                  )}
                  {selection.childrenWithoutBed > 0 && (
                    <div className="flex justify-between text-purple-600">
                      <span>Children (No Bed):</span>
                      <span className="font-medium">{selection.childrenWithoutBed}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Subtotal:</span>
                      <span>₹{selection.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal Details Section - Only show if meals are selected */}
      {daySpecificMeals.length > 0 && daySpecificMeals.some(meal => meal.quantity > 0) && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Utensils className="h-4 w-4 text-orange-600" />
            </div>
            Meal Selection Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(mealsByType).map((mealType) => (
              <div
                key={mealType}
                className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm"
              >
                <div className={`flex items-center justify-between mb-3 p-2 rounded-lg bg-gradient-to-r ${getMealTypeColor(mealType)} text-white`}>
                  <div className="flex items-center space-x-2">
                    {getMealTypeIcon(mealType)}
                    <span className="font-semibold capitalize">{mealType}</span>
                  </div>
                  <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {mealsByType[mealType].length} item{mealsByType[mealType].length === 1 ? '' : 's'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {mealsByType[mealType].map((meal: Meal) => (
                    <div
                      key={meal.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">
                          {meal.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              meal.category === "veg"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {meal.category.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 text-sm">
                          {meal.quantity} × ₹{meal.price}
                        </div>
                        <div className="text-xs text-blue-600 font-bold">
                          ₹{meal.quantity * meal.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-2 mt-3">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                    <span>Subtotal:</span>
                    <span>
                      ₹{mealsByType[mealType].reduce((sum: number, meal: Meal) => sum + (meal.quantity * meal.price), 0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-lg">Total Meal Cost</span>
              <span className="font-bold text-orange-700 text-xl">₹{mealPrice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}