"use client";

import { Transport, DaySelection } from "@/types/type";
import { ChevronDown, ChevronUp, Car, CheckCircle, Search, Users } from "lucide-react";
import { useState } from "react";
import { useQuotation } from "@/context/QuotationContext";

interface TransportSectionProps {
  transportations: Transport[];
  isTransportLoading: boolean;
  theme: { bg: string; text: string; border: string };
  isSectionActive: boolean;
  toggleSection: () => void;
  allDays: Array<{ date: string; data: DaySelection }>;
}

// Sample transports data
const sampleTransports: Transport[] = [
  {
    id: 1,
    name: "Toyota Innova",
    type: "SUV",
    capacity: 6,
    price: 2500,
    features: ["AC", "Spacious", "GPS", "Comfortable"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHwo2fcL5DN780PkeTF5Jcwm9iugyP7jm_A&s",
    passengers: 6,
    perDay: 2500,
    perKm: 0,
    photos: "",
    maxCapacity: 6,
    vehicleType: "SUV"
  },
  {
    id: 2,
    name: "Mahindra XUV700",
    type: "SUV",
    capacity: 7,
    price: 3000,
    features: ["AC", "Premium", "Music System", "Comfort"],
    image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT9viXlIfRkuJzL9O2Kn6GxGmFfiZNkuqyWFcjsoMscxG-hGSLKLvrQq9zgASRroESxx01RGf--7NQEyGekss_bolubwG5PGMkVPxUzpTqA",
    passengers: 7,
    perDay: 3000,
    perKm: 0,
    photos: "",
    maxCapacity: 7,
    vehicleType: "SUV"
  },
  {
    id: 3,
    name: "Honda City",
    type: "Sedan",
    capacity: 4,
    price: 2000,
    features: ["AC", "Compact", "Luxury", "Fuel Efficient"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRraGwEcqfCSHVUzegKkPPhZ_VD90I0ZTCZ2g&s",
    passengers: 4,
    perDay: 2000,
    perKm: 0,
    photos: "",
    maxCapacity: 4,
    vehicleType: "Sedan"
  },
  {
    id: 4,
    name: "12 Seater Tempo",
    type: "Tempo Traveller",
    capacity: 12,
    price: 4500,
    features: ["AC", "Large", "Luggage Space", "Comfortable"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjVbbXPs-SJ1GiQxTF6HcYCqDZPGTt8T6udw&s",
    passengers: 12,
    perDay: 4500,
    perKm: 0,
    photos: "",
    maxCapacity: 12,
    vehicleType: "Tempo Traveller"
  }
];

export default function TransportSection({
  transportations,
  isTransportLoading,
  theme,
  isSectionActive,
  toggleSection,
  allDays,
}: TransportSectionProps) {
  const { 
    daySelections,
    updateDaySelection
  } = useQuotation();

  const [selectedDays, setSelectedDays] = useState<string[]>(allDays.map(day => day.date));
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);

  const handleDayToggle = (dayDate: string) => {
    setSelectedDays(prev => 
      prev.includes(dayDate) 
        ? prev.filter(d => d !== dayDate)
        : [...prev, dayDate]
    );
  };

  const handleTransportSelect = (transport: Transport) => {
    setSelectedTransport(transport);
    
    // Apply to all selected days
    selectedDays.forEach(date => {
      updateDaySelection(date, {
        transports: transport,
        isCompleted: true
      });
    });
  };

  const handleApplyToAllDays = () => {
    if (selectedTransport) {
      selectedDays.forEach(date => {
        updateDaySelection(date, {
          transports: selectedTransport,
          isCompleted: true
        });
      });
    }
  };

  // Filter transports based on search and capacity
  const filteredTransports = sampleTransports.filter(transport => {
    const matchesSearch = transport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transport.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = capacityFilter ? transport.capacity >= capacityFilter : true;
    
    return matchesSearch && matchesCapacity;
  });

  const hasTransportSelected = selectedDays.some(date => daySelections[date]?.transports);

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
                {hasTransportSelected 
                  ? `${selectedDays.length} days selected`
                  : `Select transport for ${allDays.length} days`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {hasTransportSelected && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Selected</span>
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
          {/* Day Selection */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Select Days for Transport:</h4>
            <div className="flex flex-wrap gap-2">
              {allDays.map(({ date }, index) => (
                <button
                  key={date}
                  onClick={() => handleDayToggle(date)}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    selectedDays.includes(date)
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Day {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vehicles by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Capacity:</span>
              <select
                value={capacityFilter || ''}
                onChange={(e) => setCapacityFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="4">4+ seats</option>
                <option value="6">6+ seats</option>
                <option value="8">8+ seats</option>
                <option value="12">12+ seats</option>
              </select>
            </div>
          </div>

          {/* Transport Selection */}
          {isTransportLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading vehicles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredTransports.map((transport) => (
                <div
                  key={transport.id}
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedTransport?.id === transport.id
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-100'
                      : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                  onClick={() => handleTransportSelect(transport)}
                >
                  <div className="h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    {transport.image && (
                      <img
                        src={transport.image}
                        alt={transport.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{transport.name}</h4>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{transport.capacity}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">₹{transport.price}</span>
                      <span className="text-sm text-gray-500">per day</span>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      {transport.features?.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Apply to Selected Days Button */}
          {selectedTransport && selectedDays.length > 0 && (
            <div className="mt-6">
              <button
                onClick={handleApplyToAllDays}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium"
              >
                Apply {selectedTransport.name} to {selectedDays.length} Selected Days
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}