"use client";

import { useEffect, useState } from "react";
import { Hotel, RoomSelection as RoomSelectionType } from "@/types/type";
import { ArrowLeft, Check, Users, Bed, Plus, X, ChevronDown, ChevronUp, User, Minus } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";

interface RoomSelectionProps {
  hotel: Hotel;
  selections: RoomSelectionType[];
  onSelectionsChange: (selections: RoomSelectionType[]) => void;
  onConfirm: () => void;
  onBack: () => void;
  theme: { bg: string; text: string; border: string };
  currentDay: number;
}

// Define Room interface
interface Room {
  id: number;
  hotelId: string;
  type: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  bedType: string;
  amenities: string[];
  description: string;
  photos: string[];
}

// Define professionalRooms array with proper typing
const professionalRooms: Room[] = [
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
  // FIXED: Added more rooms to support future IDs
  {
    id: 10,
    hotelId: "HTL1",
    type: "Executive Suite",
    price: 8000,
    maxAdults: 3,
    maxChildren: 2,
    bedType: "King Size Bed",
    amenities: ["Free WiFi", "AC", "TV", "Breakfast", "Executive Lounge"],
    description: "Premium executive suite with lounge access",
    photos: [
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=250&fit=crop",
    ],
  },
  {
    id: 11,
    hotelId: "HTL2",
    type: "Premium Room",
    price: 6000,
    maxAdults: 3,
    maxChildren: 2,
    bedType: "Queen Size Bed",
    amenities: ["Free WiFi", "AC", "TV", "Breakfast", "Mini Bar", "City View"],
    description: "Premium room with city view and enhanced amenities",
    photos: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=250&fit=crop",
    ],
  },
  {
    id: 12,
    hotelId: "HTL3",
    type: "Luxury Villa",
    price: 15000,
    maxAdults: 6,
    maxChildren: 4,
    bedType: "Multiple King Beds",
    amenities: ["Free WiFi", "AC", "TV", "Breakfast", "Private Pool", "Garden"],
    description: "Private luxury villa with exclusive amenities",
    photos: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
    ],
  },
];

// Interface for individual room configuration
interface RoomConfiguration {
  roomId: number;
  roomCount: number;
  adults: number;
  childrenWithBed: number;
  childrenWithoutBed: number;
  adultsWithExtraBed: number;
  isExpanded?: boolean;
}

// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({ top: 700, behavior: 'smooth' });
};

export default function RoomSelect({ 
  hotel, 
  selections, 
  onSelectionsChange, 
  onConfirm, 
  onBack, 
  theme, 
  currentDay 
}: RoomSelectionProps) {
  const [selectedRoomType, setSelectedRoomType] = useState<number | null>(null);
  const [roomConfigurations, setRoomConfigurations] = useState<RoomConfiguration[]>([]);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [expandedRoomIndex, setExpandedRoomIndex] = useState<number | null>(null);
  const [isTravelerInfoCollapsed, setIsTravelerInfoCollapsed] = useState<boolean>(false);
  const [animateSelection, setAnimateSelection] = useState<boolean>(false);

  const { hotelInfo, travelers } = useQuotation();
  const selectedHotel = hotelInfo[0] || hotel;

  // Filter rooms to show only hotel-specific rooms
  const filteredRooms = professionalRooms.filter(
    (room: Room) => room.hotelId === selectedHotel?.id
  );

  // Calculate total travelers from client info
  const totalTravelers = travelers.adults + travelers.children + travelers.infants;

  // Initialize room configurations from existing selections
  useEffect(() => {
    if (selections.length > 0) {
      const configs = selections.map(selection => ({
        roomId: selection.roomId,
        roomCount: selection.roomCount,
        adults: selection.adults,
        childrenWithBed: selection.childrenWithBed,
        childrenWithoutBed: selection.childrenWithoutBed,
        adultsWithExtraBed: selection.adultsWithExtraBed || 0,
        isExpanded: false
      }));
      setRoomConfigurations(configs);
      setIsConfirmed(true);
    }
  }, [selections]);

  const selectedRoom = filteredRooms.find((room: Room) => room.id === selectedRoomType);

  // FIXED: Enhanced room card click handler - select/deselect on card click
  const handleRoomCardClick = (roomId: number) => {
    const existingConfigIndex = roomConfigurations.findIndex(config => config.roomId === roomId);
    
    if (existingConfigIndex >= 0) {
      // Room is already selected - remove it (deselect)
      const updatedConfigs = roomConfigurations.filter((_, i) => i !== existingConfigIndex);
      setRoomConfigurations(updatedConfigs);
      
      // Clear selection if this was the selected room
      if (selectedRoomType === roomId) {
        setSelectedRoomType(null);
      }
      
      // Adjust expanded index
      if (expandedRoomIndex === existingConfigIndex) {
        setExpandedRoomIndex(null);
      } else if (expandedRoomIndex && expandedRoomIndex > existingConfigIndex) {
        setExpandedRoomIndex(expandedRoomIndex - 1);
      }
    } else {
      // Room is not selected - add it (select)
      const room = filteredRooms.find(r => r.id === roomId);
      if (room) {
        const newConfig: RoomConfiguration = {
          roomId: roomId,
          roomCount: 1,
          adults: Math.min(2, room.maxAdults),
          childrenWithBed: 0,
          childrenWithoutBed: 0,
          adultsWithExtraBed: 0,
          isExpanded: true
        };
        
        setRoomConfigurations([...roomConfigurations, newConfig]);
        setSelectedRoomType(roomId);
        setExpandedRoomIndex(roomConfigurations.length);
      }
    }
  };

  // Update room configuration
  const updateRoomConfiguration = (index: number, updates: Partial<RoomConfiguration>) => {
    const updatedConfigs = [...roomConfigurations];
    updatedConfigs[index] = { ...updatedConfigs[index], ...updates };
    setRoomConfigurations(updatedConfigs);
  };

  // Remove room configuration
  const removeRoomConfiguration = (index: number) => {
    const updatedConfigs = roomConfigurations.filter((_, i) => i !== index);
    setRoomConfigurations(updatedConfigs);
    
    // If we removed the selected room, clear selection
    const removedRoomId = roomConfigurations[index].roomId;
    if (selectedRoomType === removedRoomId) {
      setSelectedRoomType(null);
    }
    
    if (expandedRoomIndex === index) {
      setExpandedRoomIndex(null);
    } else if (expandedRoomIndex && expandedRoomIndex > index) {
      setExpandedRoomIndex(expandedRoomIndex - 1);
    }
  };

  // Toggle accordion
  const toggleAccordion = (index: number) => {
    setExpandedRoomIndex(expandedRoomIndex === index ? null : index);
  };

  // Toggle traveler info
  const toggleTravelerInfo = () => {
    setIsTravelerInfoCollapsed(!isTravelerInfoCollapsed);
  };

  // Calculate capacity for a specific room configuration
  const calculateRoomCapacity = (config: RoomConfiguration): { 
    maxTotal: number; 
    currentTotal: number; 
    remaining: number;
  } => {
    const room = filteredRooms.find(r => r.id === config.roomId);
    if (!room) return { maxTotal: 0, currentTotal: 0, remaining: 0 };
    
    const maxTotal = (room.maxAdults + room.maxChildren) * config.roomCount;
    const currentTotal = config.adults + config.childrenWithBed + config.childrenWithoutBed + config.adultsWithExtraBed;
    const remaining = maxTotal - currentTotal;
    
    return { maxTotal, currentTotal, remaining };
  };

  // Calculate total price for all room configurations
  const calculateTotalPrice = (): number => {
    return roomConfigurations.reduce((total: number, config: RoomConfiguration) => {
      const room = filteredRooms.find(r => r.id === config.roomId);
      if (!room) return total;
      
      const roomPrice = room.price * config.roomCount;
      const extraBedPrice = (config.childrenWithBed * 500) + (config.adultsWithExtraBed * 800);
      
      return total + roomPrice + extraBedPrice;
    }, 0);
  };

  // Calculate total guests across all room configurations
  const calculateTotalGuests = (): number => {
    return roomConfigurations.reduce((total: number, config: RoomConfiguration) => {
      return total + config.adults + config.childrenWithBed + config.childrenWithoutBed + config.adultsWithExtraBed;
    }, 0);
  };

  // Group room configurations by type for better display
  const groupedRoomConfigurations = roomConfigurations.reduce((groups: Record<string, RoomConfiguration[]>, config: RoomConfiguration) => {
    const room = filteredRooms.find(r => r.id === config.roomId);
    const roomType = room?.type || 'Unknown';
    if (!groups[roomType]) {
      groups[roomType] = [];
    }
    groups[roomType].push(config);
    return groups;
  }, {});

  // FIXED: Get room type name from professionalRooms
  const getRoomTypeName = (roomId: number): string => {
    const room = professionalRooms.find(r => r.id === roomId);
    return room?.type || `Room Type ${roomId}`;
  };

  const handleConfirmSelection = () => {
    if (roomConfigurations.length === 0) return;
    
    const newSelections: RoomSelectionType[] = roomConfigurations.map(config => {
      const room = filteredRooms.find(r => r.id === config.roomId);
      const roomPrice = room?.price || 3000; // FIXED: Default price for any room
      const totalPrice = (roomPrice * config.roomCount) + (config.childrenWithBed * 500) + (config.adultsWithExtraBed * 800);
      
      // FIXED: Store roomType in the selection
      return {
        roomId: config.roomId,
        roomCount: config.roomCount,
        adults: config.adults,
        childrenWithBed: config.childrenWithBed,
        childrenWithoutBed: config.childrenWithoutBed,
        adultsWithExtraBed: config.adultsWithExtraBed,
        totalPrice: totalPrice,
        isConfirmed: true,
        confirmedAt: new Date().toISOString(),
        dayNumber: currentDay,
        roomType: getRoomTypeName(config.roomId) // NEW: Store room type name
      };
    });
    
    onSelectionsChange(newSelections);
    setIsConfirmed(true);
    onConfirm();
    scrollToTop();
  };

  // Check if a room type is already selected in configurations
  const isRoomSelected = (roomId: number): boolean => {
    return roomConfigurations.some(config => config.roomId === roomId);
  };

  // Get button text and state based on selection status
  const getButtonState = (roomId: number) => {
    const isSelected = isRoomSelected(roomId);
    
    if (isSelected) {
      return {
        text: "Selected",
        className: "bg-red-600 text-white hover:bg-red-700",
        disabled: false
      };
    }
    
    return {
      text: "Select",
      className: "bg-gray-200 text-gray-500 cursor-not-allowed",
      disabled: true
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span className="font-medium">Back</span>
        </button>
        <div className="text-center flex-1">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">Select Your Rooms</h3>
          {isConfirmed && (
            <div className="flex items-center justify-center mt-2 space-x-2">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-sm">
                <Check className="h-4 w-4 mr-2" />
                Room Selection Confirmed for Day {currentDay}
              </div>
            </div>
          )}
        </div>
        <div className="w-20"></div> {/* Spacer for balance */}
      </div>

      {/* Available Room Types */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Room Types at {selectedHotel.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room: Room) => {
            const buttonState = getButtonState(room.id);
            const isSelected = isRoomSelected(room.id);
            
            return (
              <div
                key={room.id}
                className={`border rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'border-indigo-500 shadow-lg transform hover:scale-[1.02] bg-gradient-to-br from-indigo-50 to-white'
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-md bg-white hover:translate-y-[-4px]'
                }`}
                onClick={() => {
                  setAnimateSelection(true);
                  setTimeout(() => setAnimateSelection(false), 500);
                  handleRoomCardClick(room.id);
                }}
              >
                <div className="relative">
                  <img
                    src={room.photos[0]}
                    alt={room.type}
                    className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      ₹{room.price}/night
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm backdrop-blur-sm">
                      {room.bedType}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Selected
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-indigo-700 transition-colors">{room.type}</h4>
                    <div className="flex items-center text-sm bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                      <Users className="h-4 w-4 mr-1" />
                      {room.maxAdults} Adults + {room.maxChildren} Kids
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                      <span key={idx} className="text-xs bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 px-3 py-1 rounded-full font-medium shadow-sm">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">+{room.amenities.length - 3} more</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnimateSelection(true);
                      setTimeout(() => setAnimateSelection(false), 500);
                      handleRoomCardClick(room.id);
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                      isSelected 
                        ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md hover:shadow-lg' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <X className="h-4 w-4 inline mr-1" />
                         Remove
                      </>
                    ) : (
                      "Select"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traveler Information Card - Collapsible */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={toggleTravelerInfo}
        >
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Traveler Information</h3>
              <p className="text-gray-600">Based on your client details</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{totalTravelers}</div>
              <div className="text-sm text-gray-600">Total Travelers</div>
            </div>
            {isTravelerInfoCollapsed ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
        
        {!isTravelerInfoCollapsed && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                <div className="text-lg font-bold text-gray-900">{travelers.adults}</div>
                <div className="text-sm text-gray-600">Adults</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                <div className="text-lg font-bold text-gray-900">{travelers.children}</div>
                <div className="text-sm text-gray-600">Children</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                <div className="text-lg font-bold text-gray-900">{travelers.infants}</div>
                <div className="text-sm text-gray-600">Infants</div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Note:</span> Click on any room card to select or deselect it. You can add multiple room types.
            </div>
          </>
        )}
      </div>

      {/* Configure Stay Section */}
      {roomConfigurations.length > 0 && (
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-8 border border-indigo-100 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">Configure Your Stay</h3>
                <p className="text-gray-600">
                  {roomConfigurations.length} room type(s) selected • {calculateTotalGuests()} guests allocated
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹{calculateTotalPrice()}</div>
              <div className="text-sm text-gray-600">Total per night</div>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(groupedRoomConfigurations).map(([roomType, configs]) => (
              <div key={roomType} className="bg-white rounded-xl border-2 border-gray-300 overflow-hidden">
                {/* Room Type Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{roomType}</h4>
                      <p className="text-gray-600 text-sm">
                        {configs.length} configuration{configs.length > 1 ? 's' : ''} • {configs.reduce((sum: number, config: RoomConfiguration) => sum + config.roomCount, 0)} total rooms
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-600">
                        ₹{configs.reduce((sum: number, config: RoomConfiguration) => {
                          const room = filteredRooms.find(r => r.id === config.roomId);
                          const roomPrice = room?.price || 0;
                          return sum + (roomPrice * config.roomCount) + (config.childrenWithBed * 500) + (config.adultsWithExtraBed * 800);
                        }, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Subtotal</div>
                    </div>
                  </div>
                </div>

                {/* Individual Room Configurations */}
                <div className="divide-y divide-gray-200">
                  {configs.map((config, index) => {
                    const globalIndex = roomConfigurations.findIndex(c => c === config);
                    const room = filteredRooms.find(r => r.id === config.roomId);
                    const capacity = calculateRoomCapacity(config);
                    
                    if (!room) return null;

                    return (
                      <div key={globalIndex} className="bg-white">
                        {/* Accordion Header */}
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
                          onClick={() => toggleAccordion(globalIndex)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">{globalIndex + 1}</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">{room.type}</h5>
                              <p className="text-sm text-gray-600">
                                {config.roomCount} {config.roomCount === 1 ? 'room' : 'rooms'} • {config.adults + config.childrenWithBed + config.childrenWithoutBed + config.adultsWithExtraBed} guests
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-semibold text-green-600">
                                ₹{(room.price * config.roomCount) + (config.childrenWithBed * 500) + (config.adultsWithExtraBed * 800)}
                              </div>
                              <div className="text-xs text-gray-500">Total</div>
                            </div>
                            {expandedRoomIndex === globalIndex ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Accordion Content */}
                        {expandedRoomIndex === globalIndex && (
                          <div className="px-4 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Room Configuration */}
                              <div className="space-y-4">
                                {/* Number of Rooms */}
                                <div className="flex justify-between items-center p-3 mt-5 border border-gray-200 rounded-lg">
                                  <span className="font-medium text-gray-700">Number of Rooms:</span>
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateRoomConfiguration(globalIndex, { 
                                          roomCount: Math.max(1, config.roomCount - 1) 
                                        });
                                      }}
                                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-lg text-blue-600">
                                      {config.roomCount}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateRoomConfiguration(globalIndex, { 
                                          roomCount: config.roomCount + 1 
                                        });
                                      }}
                                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Guest Configuration - Table Style */}
                                <div className="space-y-2 border border-gray-200 rounded-lg p-4">
                                  <h6 className="font-semibold text-gray-900 mb-3">Guest Configuration</h6>
                                  {[
                                    { label: "Adults", value: config.adults, color: "blue", onIncrement: () => updateRoomConfiguration(globalIndex, { adults: config.adults + 1 }), onDecrement: () => updateRoomConfiguration(globalIndex, { adults: Math.max(1, config.adults - 1) }) },
                                    { label: "Children with Bed (₹500)", value: config.childrenWithBed, color: "green", onIncrement: () => updateRoomConfiguration(globalIndex, { childrenWithBed: config.childrenWithBed + 1 }), onDecrement: () => updateRoomConfiguration(globalIndex, { childrenWithBed: Math.max(0, config.childrenWithBed - 1) }) },
                                    { label: "Adults with Extra Bed (₹800)", value: config.adultsWithExtraBed, color: "orange", onIncrement: () => updateRoomConfiguration(globalIndex, { adultsWithExtraBed: config.adultsWithExtraBed + 1 }), onDecrement: () => updateRoomConfiguration(globalIndex, { adultsWithExtraBed: Math.max(0, config.adultsWithExtraBed - 1) }) },
                                    { label: "Children without Bed", value: config.childrenWithoutBed, color: "purple", onIncrement: () => updateRoomConfiguration(globalIndex, { childrenWithoutBed: config.childrenWithoutBed + 1 }), onDecrement: () => updateRoomConfiguration(globalIndex, { childrenWithoutBed: Math.max(0, config.childrenWithoutBed - 1) }) }
                                  ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            item.onDecrement();
                                          }}
                                          className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-6 text-center font-medium text-gray-900">{item.value}</span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (capacity.remaining > 0) {
                                              item.onIncrement();
                                            }
                                          }}
                                          disabled={capacity.remaining <= 0}
                                          className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Room Summary */}
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-5">
                                <h5 className="font-semibold text-gray-900 mb-3">Room Summary</h5>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>{config.roomCount} × {room.type}</span>
                                    <span>₹{room.price * config.roomCount}</span>
                                  </div>
                                  {config.childrenWithBed > 0 && (
                                    <div className="flex justify-between text-green-600">
                                      <span>Children with bed × {config.childrenWithBed}</span>
                                      <span>₹{config.childrenWithBed * 500}</span>
                                    </div>
                                  )}
                                  {config.adultsWithExtraBed > 0 && (
                                    <div className="flex justify-between text-orange-600">
                                      <span>Adults with extra bed × {config.adultsWithExtraBed}</span>
                                      <span>₹{config.adultsWithExtraBed * 800}</span>
                                    </div>
                                  )}
                                  <div className="border-t border-gray-300 pt-2 mt-2 font-semibold">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>₹{(room.price * config.roomCount) + (config.childrenWithBed * 500) + (config.adultsWithExtraBed * 800)}</span>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-2">
                                    Capacity: {capacity.currentTotal}/{capacity.maxTotal} persons
                                    {capacity.remaining < 0 && (
                                      <span className="text-red-600 font-medium ml-2">(Over capacity!)</span>
                                    )}
                                  </div>
                                </div>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeRoomConfiguration(globalIndex);
                                  }}
                                  className="w-full mt-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Remove Room
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary and Confirm Button */}
          <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-lg text-gray-900">Total Booking Summary</h4>
                <p className="text-gray-600">
                  {Object.keys(groupedRoomConfigurations).length} room type(s) • {calculateTotalGuests()} guests • {roomConfigurations.reduce((sum: number, config: RoomConfiguration) => sum + config.roomCount, 0)} rooms
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">₹{calculateTotalPrice()}</div>
                <div className="text-sm text-gray-600">Total per night</div>
              </div>
            </div>

            <button
              onClick={handleConfirmSelection}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Check className="h-5 w-5" />
              <span>
                {isConfirmed ? 'Update Room Selection' : 'Confirm Room Selection'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {roomConfigurations.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Rooms Selected</h3>
          <p className="text-gray-500 mb-6">Click on any room card above to select it for your stay</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Meals</span>
        </button>

        {roomConfigurations.length > 0 && (
          <button
            onClick={handleConfirmSelection}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Check className="h-4 w-4 inline mr-2" />
            Confirm Room Selection
          </button>
        )}
      </div>
    </div>
  );
}