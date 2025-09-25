import React from "react";
import { ChevronDown, ChevronUp, X, ArrowLeft, Check, Edit, Users, Crown, Bed, Star, Receipt, MapPin, Building, Calendar, CalendarDays, Utensils } from "lucide-react";
import { QuotationData,Hotel,DaySelection,RoomSelection,Meal} from "@/types/type";

import { useQuotation } from "@/context/QuotationContext";

export default function HotelSummary({ hotel,selections, meals,onEdit,theme,}: any) {

  const { professionalRooms } = useQuotation();

  const selection = selections[0];

  const room = professionalRooms.find((r) => r.id === selection?.roomId);

  if (!room || !selection) return null;

  const roomPrice =
    room.price * selection.roomCount + selection.childrenWithBed * 500;
  const mealPrice = meals.reduce(
    (total: number, meal: Meal) => total + meal.price * meal.quantity,
    0
  );
  const totalPrice = roomPrice + mealPrice;
  const totalGuests =
    selection.adults + selection.childrenWithBed + selection.childrenWithoutBed;

  // Group meals by type for better display
  const mealsByType = meals.reduce((acc: any, meal: Meal) => {
    if (meal.quantity > 0) {
      if (!acc[meal.type]) acc[meal.type] = [];
      acc[meal.type].push(meal);
    }
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Building className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-700">{hotel.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{hotel.city}</span>
              <span className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                <Star className="h-3 w-3 mr-1" />
                {hotel.starCategory}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors bg-white text-sm"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Stay Details */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            Stay Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-500">Check-in</div>
                  <div className="font-semibold text-gray-700">
                    Dec 25, 2025
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CalendarDays className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-xs text-gray-500">Check-out</div>
                  <div className="font-semibold text-gray-700">
                    Dec 26, 2025
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-xs text-gray-500">Total Guests</div>
                  <div className="font-semibold text-gray-700">
                    {totalGuests} Guests
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <Bed className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-xs text-gray-500">Extra Beds</div>
                  <div className="font-semibold text-gray-700">
                    {selection.childrenWithBed} beds
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
              <div className="text-center text-sm text-gray-700">
                <span className="font-semibold">
                  {selection.roomCount} Room
                  {selection.roomCount === 1 ? "" : "s"} • 1 night stay
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Room Type */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Bed className="h-4 w-4 mr-2 text-purple-500" />
            Room Type
          </h3>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-bold text-purple-700 text-lg">
                  {room.type}
                </div>
                <div className="text-xs text-purple-600">
                  Luxury accommodation
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Per night</div>
              <div className="font-bold text-purple-600">₹{room.price}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Rooms</div>
              <div className="font-bold text-gray-900">
                {selection.roomCount}
              </div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Adults</div>
              <div className="font-bold text-gray-900">{selection.adults}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-500">Children</div>
              <div className="font-bold text-gray-900">
                {selection.childrenWithBed + selection.childrenWithoutBed}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Details Section */}
      {meals.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Utensils className="h-4 w-4 mr-2 text-orange-500" />
            Meal Selection
          </h3>

          <div className="space-y-4">
            {Object.keys(mealsByType).map((mealType) => (
              <div
                key={mealType}
                className="border border-gray-100 rounded-lg p-4"
              >
                <h4 className="font-semibold text-gray-900 capitalize mb-3 flex items-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  {mealType} ({mealsByType[mealType].length} item
                  {mealsByType[mealType].length === 1 ? "" : "s"})
                </h4>
                <div className="space-y-2">
                  {mealsByType[mealType].map((meal: Meal) => (
                    <div
                      key={meal.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {meal.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              meal.category === "veg"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {meal.category.toUpperCase()}
                          </span>
                          <span className="ml-2">₹{meal.price} per person</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {meal.quantity} × ₹{meal.price}
                        </div>
                        <div className="text-sm text-blue-600 font-bold">
                          ₹{meal.quantity * meal.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">
                  Total Meal Cost:
                </span>
                <span className="font-bold text-orange-700">₹{mealPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Summary at Bottom */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Receipt className="h-4 w-4 mr-2 text-green-500" />
          Booking Summary
        </h3>

        <div className="space-y-3">
          {/* Room Cost */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">
                {selection.roomCount}{" "}
                {selection.roomCount === 1 ? "room" : "rooms"} × ₹{room.price}
              </div>
              <div className="text-xs text-gray-500">{room.type} Room</div>
            </div>
            <span className="font-semibold">
              ₹{room.price * selection.roomCount}
            </span>
          </div>

          {/* Extra Beds */}
          {selection.childrenWithBed > 0 && (
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  Extra beds × {selection.childrenWithBed}
                </div>
                <div className="text-xs text-gray-500">₹500 per bed</div>
              </div>
              <span className="font-semibold">
                ₹{selection.childrenWithBed * 500}
              </span>
            </div>
          )}

          {/* Meal Cost */}
          {mealPrice > 0 && (
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Meals & Dining</div>
                <div className="text-xs text-gray-500">
                  {Object.keys(mealsByType).length} meal type(s)
                </div>
              </div>
              <span className="font-semibold">₹{mealPrice}</span>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900 text-lg">
                Total Amount
              </span>
              <span className="font-bold text-green-600 text-xl">
                ₹{totalPrice}
              </span>
            </div>
            <div className="text-xs text-gray-500 flex items-center mb-3">
              <Users className="h-3 w-3 mr-1" />
              {selection.roomCount}{" "}
              {selection.roomCount === 1 ? "room" : "rooms"} • {totalGuests}{" "}
              guests • {room.type}
              {mealPrice > 0 &&
                ` • ${Object.keys(mealsByType).length} meal type(s)`}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-3 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  For 1 night:
                </span>
                <span className="font-bold text-green-700">₹{totalPrice}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                <div>Room: ₹{roomPrice}</div>
                {mealPrice > 0 && <div>Meals: ₹{mealPrice}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
