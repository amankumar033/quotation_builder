"use client";

import { useEffect, useState } from "react";
import { QuotationData, Hotel, DaySelection, RoomSelection, Meal } from "@/types/type";
import { ChevronDown, ChevronUp, X, ArrowLeft, Check, Edit, Users, Crown, Bed, Star, Receipt, MapPin, Building, Calendar, CalendarDays, Utensils } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";

interface RoomSelectionProps {
  hotel: Hotel;
  selections: RoomSelection[];
  onSelectionsChange: (selections: RoomSelection[]) => void;
  onConfirm: () => void;
  onBack: () => void;
  theme: { bg: string; text: string; border: string };
  currentDay: number; // Add current day prop
}

const professionalRooms = [
  {
    id: 1,
    hotelId: "HTL1",
    type: "Deluxe Room",
    price: 3000,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "King Size Bed",
    amenities: ["Free WiFi", "AC", "TV", "Breakfast", "King Bed"],
    description: "Spacious room with modern amenities and comfortable bedding",
    photos: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=250&fit=crop",
    ],
  },
  {
    id: 2,
    hotelId: "HTL1",
    type: "Super Deluxe Room",
    price: 4500,
    maxAdults: 3,
    maxChildren: 2,
    bedType: "Queen Size Bed",
    amenities: [
      "Free WiFi",
      "AC",
      "TV",
      "Breakfast",
      "Balcony",
      "Sea View",
    ],
    description: "Luxurious room with premium features and stunning views",
    photos: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=250&fit=crop",
    ],
  },
  {
    id: 3,
    hotelId: "HTL1",
    type: "Suite Room",
    price: 6500,
    maxAdults: 4,
    maxChildren: 3,
    bedType: "King Size + Extra Bed",
    amenities: [
      "Free WiFi",
      "AC",
      "TV",
      "Breakfast",
      "Balcony",
      "Living Room",
      "Mini Bar",
    ],
    description:
      "Executive suite with separate living area and premium amenities",
    photos: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop",
    ],
  },
  {
    id: 4,
    hotelId: "HTL2",
    type: "Standard Room",
    price: 2500,
    maxAdults: 2,
    maxChildren: 1,
    bedType: "Double Bed",
    amenities: ["Free WiFi", "AC", "TV", "Breakfast"],
    description: "Affordable room with essential amenities for short stays",
    photos: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT67zQD7L-AtLFIIpH_kbZLRb_QeU3zwQGXBw&s",
    ],
  },
  {
    id: 5,
    hotelId: "HTL2",
    type: "Executive Room",
    price: 5200,
    maxAdults: 3,
    maxChildren: 2,
    bedType: "King Bed",
    amenities: [
      "Free WiFi",
      "AC",
      "TV",
      "Breakfast",
      "Work Desk",
      "Mini Bar",
    ],
    description:
      "Designed for business travelers with work-friendly amenities and comfort",
    photos: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=250&fit=crop",
    ],
  },
  {
    id: 6,
    hotelId: "HTL2",
    type: "Family Room",
    price: 5800,
    maxAdults: 4,
    maxChildren: 2,
    bedType: "Two Queen Beds",
    amenities: [
      "Free WiFi",
      "AC",
      "TV",
      "Breakfast",
      "Balcony",
      "Sofa",
    ],
    description:
      "Spacious family-friendly room with multiple beds and extra seating",
    photos: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7BUZcZ6BJZZCgYfGaHaggqOz8i9k2OlSwKQ&s",
    ],
  },
  {
    id: 7,
    hotelId: "HTL3",
    type: "Presidential Suite",
    price: 12000,
    maxAdults: 5,
    maxChildren: 3,
    bedType: "Super King Bed",
    amenities: [
      "Free WiFi",
      "AC",
      "TV",
      "Breakfast",
      "Jacuzzi",
      "Private Lounge",
      "Butler Service",
    ],
    description:
      "Ultimate luxury experience with private lounge, jacuzzi, and butler service",
    photos: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRyPq_7UEy9rRKjuGEzFjuRlgOQVG4_W8Szg&s",
    ],
  },
  {
    id: 8,
    hotelId: "HTL3",
    type: "Garden View Room",
    price: 4000,
    maxAdults: 2,
    maxChildren: 1,
    bedType: "Queen Bed",
    amenities: [
      "Free WiFi",
      "AC",
      "TV",
      "Breakfast",
      "Garden Access",
    ],
    description:
      "Relax with a serene garden view and cozy modern furnishing",
    photos: [
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=250&fit=crop",
    ],
  },
  {
    id: 9,
    hotelId: "HTL3",
    type: "Poolside Room",
    price: 4800,
    maxAdults: 2,
    maxChildren: 2,
    bedType: "Double Bed",
    amenities: [
      "Free WiFi",
      "AC",
      "TV",
      "Breakfast",
      "Pool Access",
    ],
    description:
      "Stay close to the pool with easy access and refreshing vibes",
    photos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=250&fit=crop",
    ],
  },
];

export default function RoomSelect({ hotel, selections, onSelectionsChange, onConfirm, onBack, theme, currentDay }: RoomSelectionProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<number>(1);
  const [roomCount, setRoomCount] = useState<number>(1);
  const [adults, setAdults] = useState<number>(2);
  const [childrenWithBed, setChildrenWithBed] = useState<number>(0);
  const [childrenWithoutBed, setChildrenWithoutBed] = useState<number>(0);
  const [adultsWithExtraBed, setAdultsWithExtraBed] = useState<number>(0);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const { hotelInfo } = useQuotation();
// Maybe pick the first one
const selectedHotel = hotelInfo[0]; 

const filteredRooms = professionalRooms.filter(
  room => room.hotelId === selectedHotel?.id
);

  
  // Set default selected room to first available room
  useEffect(() => {
    if (filteredRooms.length > 0 && !filteredRooms.find(room => room.id === selectedRoomType)) {
      setSelectedRoomType(filteredRooms[0].id);
    }
  }, [filteredRooms, selectedRoomType]);

  const selectedRoom = filteredRooms.find(room => room.id === selectedRoomType);

  const calculateTotalPrice = () => {
    if (!selectedRoom) return 0;
    return (selectedRoom.price * roomCount) + (childrenWithBed * 500) + (adultsWithExtraBed * 800);
  };

  const handleConfirmSelection = () => {
    if (!selectedRoom) return;
    
    const newSelection: RoomSelection = {
      roomId: selectedRoomType,
      roomCount,
      adults,
      childrenWithBed,
      childrenWithoutBed,
      adultsWithExtraBed,
      totalPrice: calculateTotalPrice(),
      isConfirmed: true,
      confirmedAt: new Date().toISOString(),
      dayNumber: currentDay
    };
     
    onSelectionsChange([newSelection]);
    setIsConfirmed(true);
    
    // Call onConfirm after a brief delay to ensure state updates
    setTimeout(() => {
      onConfirm();
    }, 100);
  };

  const totalGuests = adults + childrenWithBed + childrenWithoutBed + adultsWithExtraBed;
  const canAddMoreAdults = adults < (selectedRoom?.maxAdults || 0);
  const canAddMoreChildren = (childrenWithBed + childrenWithoutBed) < (selectedRoom?.maxChildren || 0);
  const canAddMoreAdultsWithExtraBed = adultsWithExtraBed < (selectedRoom?.maxAdults || 0);

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Meals</span>
        </button>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900">Select Your Room</h3>
          {isConfirmed && (
            <div className="flex items-center justify-center mt-2 space-x-2">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Room & Meals Confirmed for Day {currentDay}
              </div>
            </div>
          )}
        </div>
        <div></div> {/* Spacer for alignment */}
      </div>

      {/* Rest of your component remains the same */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Room Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <div
              key={room.id}
              className={`border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedRoomType === room.id
                  ? 'border-blue-500 shadow-xl scale-105 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
              onClick={() => setSelectedRoomType(room.id)}
            >
              <div className="relative">
                <img
                  src={room.photos[0]}
                  alt={room.type}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ₹{room.price}/night
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {room.bedType}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg text-gray-900">{room.type}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {room.maxAdults + room.maxChildren} max
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{room.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rooms selected:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoomCount(Math.max(0, roomCount - (selectedRoomType === room.id ? 1 : 0)));
                      }}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      -
                    </button>
                    <span className={`w-8 text-center font-semibold ${
                      selectedRoomType === room.id && roomCount > 0 ? 'text-blue-600 text-lg' : 'text-gray-400'
                    }`}>
                      {selectedRoomType === room.id ? roomCount : 0}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedRoomType === room.id) setRoomCount(roomCount + 1);
                      }}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Section */}
      {selectedRoom && roomCount > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Configure Your Stay</h3>
              <p className="text-gray-600">Customize your booking details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Guest Configuration */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h4 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Bed className="h-5 w-5 text-blue-600" />
                  </div>
                  Guest Configuration
                </h4>
      
                <div className="space-y-6">
                  {/* Adult with Bed */}
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Total Adults
                      </div>
                      <div className="text-sm text-blue-600 font-medium mt-1"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-10 h-10 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center hover:bg-blue-100 text-blue-600 font-bold transition-colors duration-200 shadow-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-lg text-gray-900 bg-gray-50 py-1 rounded-md">{adults}</span>
                      <button
                        onClick={() => setAdults(Math.min(selectedRoom.maxAdults, adults + 1))}
                        disabled={!canAddMoreAdults}
                        className="w-10 h-10 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center hover:bg-blue-100 text-blue-600 font-bold transition-colors duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Adults with Extra Bed */}
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        Adults with Extra Bed
                      </div>
                      <div className="text-sm text-orange-600 font-medium mt-1">₹800/adult</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setAdultsWithExtraBed(Math.max(0, adultsWithExtraBed - 1))}
                        className="w-10 h-10 rounded-full border-2 border-orange-200 bg-orange-50 flex items-center justify-center hover:bg-orange-100 text-orange-600 font-bold transition-colors duration-200 shadow-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-lg text-gray-900 bg-gray-50 py-1 rounded-md">{adultsWithExtraBed}</span>
                      <button
                        onClick={() => setAdultsWithExtraBed(Math.min(selectedRoom.maxAdults, adultsWithExtraBed + 1))}
                        disabled={!canAddMoreAdultsWithExtraBed}
                        className="w-10 h-10 rounded-full border-2 border-orange-200 bg-orange-50 flex items-center justify-center hover:bg-orange-100 text-orange-600 font-bold transition-colors duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children with bed */}
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Child with extra bed
                      </div>
                      <div className="text-sm text-green-600 font-medium mt-1">₹500/child</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setChildrenWithBed(Math.max(0, childrenWithBed - 1))}
                        className="w-10 h-10 rounded-full border-2 border-green-200 bg-green-50 flex items-center justify-center hover:bg-green-100 text-green-600 font-bold transition-colors duration-200 shadow-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-lg text-gray-900 bg-gray-50 py-1 rounded-md">{childrenWithBed}</span>
                      <button
                        onClick={() => setChildrenWithBed(Math.min(selectedRoom.maxChildren - childrenWithoutBed, childrenWithBed + 1))}
                        disabled={!canAddMoreChildren}
                        className="w-10 h-10 rounded-full border-2 border-green-200 bg-green-50 flex items-center justify-center hover:bg-green-100 text-green-600 font-bold transition-colors duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-green-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children without Bed */}
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Child Without Bed
                      </div>
                      <div className="text-sm text-purple-600 font-medium mt-1">No charge</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setChildrenWithoutBed(Math.max(0, childrenWithoutBed - 1))}
                        className="w-10 h-10 rounded-full border-2 border-purple-200 bg-purple-50 flex items-center justify-center hover:bg-purple-100 text-purple-600 font-bold transition-colors duration-200 shadow-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-lg text-gray-900 bg-gray-50 py-1 rounded-md">{childrenWithoutBed}</span>
                      <button
                        onClick={() => setChildrenWithoutBed(Math.min(selectedRoom.maxChildren - childrenWithBed, childrenWithoutBed + 1))}
                        disabled={!canAddMoreChildren}
                        className="w-10 h-10 rounded-full border-2 border-purple-200 bg-purple-50 flex items-center justify-center hover:bg-purple-100 text-purple-600 font-bold transition-colors duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Booking Summary</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                  <span className="text-gray-600 font-medium">{roomCount} {roomCount === 1 ? 'room' : 'rooms'} × ₹{selectedRoom.price}</span>
                  <span className="font-semibold text-blue-600">₹{selectedRoom.price * roomCount}</span>
                </div>
                
                {adultsWithExtraBed > 0 && (
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                    <span className="text-gray-600 font-medium">Extra beds (adults) × {adultsWithExtraBed}</span>
                    <span className="font-semibold text-orange-600">₹{adultsWithExtraBed * 800}</span>
                  </div>
                )}
                
                {childrenWithBed > 0 && (
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100">
                    <span className="text-gray-600 font-medium">Extra beds (children) × {childrenWithBed}</span>
                    <span className="font-semibold text-green-600">₹{childrenWithBed * 500}</span>
                  </div>
                )}

                <div className="border-t border-green-200 pt-4 mt-2">
                  <div className="flex justify-between items-center mb-3 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                    <div>
                      <span className="text-lg font-bold text-gray-900 block">Total per night</span>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Users className="h-4 w-4 mr-1" />
                        {roomCount} {roomCount === 1 ? 'room' : 'rooms'} • {totalGuests} guests
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-green-600 bg-white px-3 py-2 rounded-lg shadow-sm">₹{calculateTotalPrice()}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmSelection}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
                >
                  <Check className="h-5 w-5" />
                  <span>{isConfirmed ? 'Confirmed!' : 'Confirm Room Selection'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}