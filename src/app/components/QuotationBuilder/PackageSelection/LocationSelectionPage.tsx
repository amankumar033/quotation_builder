"use client";

import { useState } from "react";
import { Search, MapPin, ChevronRight, Building, Mountain, Sun } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";

// Static destinations data
const destinations = [
  {
    id: "sikkim",
    name: "Sikkim",
    type: "Hill Station",
    description: "Beautiful Himalayan destination with stunning landscapes",
    image: "https://images.unsplash.com/photo-1580130530873-ec15236313a3?w=400&h=300&fit=crop",
    locations: ["Gangtok", "Pelling", "Lachung", "Lachen", "Ravangla", "Namchi", "Yuksom"]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    type: "Cultural",
    description: "Land of kings with rich heritage and palaces",
    image: "https://images.unsplash.com/photo-1534570122623-99e8378a9aa7?w=400&h=300&fit=crop",
    locations: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar", "Mount Abu", "Bikaner"]
  },
  {
    id: "kerala",
    name: "Kerala",
    type: "Backwaters",
    description: "God's own country with serene backwaters",
    image: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=400&h=300&fit=crop",
    locations: ["Kochi", "Munnar", "Alleppey", "Thekkady", "Kovalam", "Wayanad", "Kumarakom"]
  },
  {
    id: "himachal",
    name: "Himachal Pradesh",
    type: "Adventure",
    description: "Perfect destination for adventure and nature lovers",
    image: "https://images.unsplash.com/photo-1574362849222-d9c5ac1f3c94?w=400&h=300&fit=crop",
    locations: ["Shimla", "Manali", "Dharamshala", "Dalhousie", "Kasauli", "Spiti Valley"]
  },
  {
    id: "goa",
    name: "Goa",
    type: "Beach",
    description: "Sun, sand, and sea - perfect beach destination",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
    locations: ["North Goa", "South Goa", "Panaji", "Calangute", "Anjuna", "Vagator"]
  }
];

const getIconByType = (type: string) => {
  switch (type) {
    case "Hill Station":
      return <Mountain className="h-6 w-6" />;
    case "Cultural":
      return <Building className="h-6 w-6" />;
    case "Beach":
      return <Sun className="h-6 w-6" />;
    default:
      return <MapPin className="h-6 w-6" />;
  }
};

export default function LocationSelectionPage() {
  const { 
    packageSelectionStep, 
    setPackageSelectionStep, 
    selectedLocation, 
    setSelectedLocation,
    setTripDestination
  } = useQuotation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<any>(null);

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.locations.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDestinationSelect = (destination: any) => {
    setSelectedDestination(destination);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setTripDestination(selectedDestination.name);
    setPackageSelectionStep('selection');
  };

  const handleBackToDestinations = () => {
    setSelectedDestination(null);
    setSearchTerm("");
  };

  if (packageSelectionStep !== 'location') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Where do you want to go?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your dream destination and start planning your perfect trip
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search destinations, locations, or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {!selectedDestination ? (
          // Destination Selection
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Popular Destinations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDestinations.map((destination) => (
                <div
                  key={destination.id}
                  onClick={() => handleDestinationSelect(destination)}
                  className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {getIconByType(destination.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {destination.name}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">
                            {destination.type}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {destination.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {destination.locations.length} locations
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Select Destination
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Location Selection within Destination
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={handleBackToDestinations}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span className="font-medium">Back to destinations</span>
            </button>

            {/* Destination Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  {getIconByType(selectedDestination.type)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedDestination.name}
                  </h2>
                  <p className="text-gray-600">{selectedDestination.description}</p>
                </div>
              </div>
            </div>

            {/* Locations Grid */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Select your base location in {selectedDestination.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedDestination.locations.map((location: string) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className={`p-4 border rounded-xl transition-all duration-200 text-left group ${
                      selectedLocation === location
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        selectedLocation === location
                          ? 'bg-blue-500'
                          : 'bg-gray-100 group-hover:bg-blue-100'
                      }`}>
                        <MapPin className={`h-5 w-5 ${
                          selectedLocation === location ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-semibold ${
                          selectedLocation === location ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {location}
                        </div>
                        <div className="text-sm text-gray-500">{selectedDestination.name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}