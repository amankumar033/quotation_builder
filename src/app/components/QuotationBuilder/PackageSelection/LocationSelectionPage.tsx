"use client";

import { useState, useMemo } from "react";
import { useQuotation } from "@/context/QuotationContext";

interface Location {
  id: string;
  name: string;
  image: string;
  description: string;
  type: string;
  locations: string[];
}

interface LocationSelectionPageProps {
  nextStep: () => void;
  prevStep: () => void;
}

// Dummy location images
const locationImages: { [key: string]: string } = {
  "Gangtok": "https://images.unsplash.com/photo-1580130530873-ec15236313a3?w=400&h=300&fit=crop",
  "Pelling": "https://images.unsplash.com/photo-1548013147-b861efabdef9?w=400&h=300&fit=crop",
  "Lachung": "https://images.unsplash.com/photo-1574362849222-d9c5ac1f3c94?w=400&h=300&fit=crop",
  "Lachen": "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=400&h=300&fit=crop",
  "Ravangla": "https://images.unsplash.com/photo-1574362849222-d9c5ac1f3c94?w=400&h=300&fit=crop",
  "Namchi": "https://images.unsplash.com/photo-1548013147-b861efabdef9?w=400&h=300&fit=crop",
  "Yuksom": "https://images.unsplash.com/photo-1580130530873-ec15236313a3?w=400&h=300&fit=crop",
  
  "Jaipur": "https://images.unsplash.com/photo-1534570122623-99e8378a9aa7?w=400&h=300&fit=crop",
  "Udaipur": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
  "Jodhpur": "https://images.unsplash.com/photo-1534577403868-27b9b01f330b?w=400&h=300&fit=crop",
  "Jaisalmer": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
  "Pushkar": "https://images.unsplash.com/photo-1534570122623-99e8378a9aa7?w=400&h=300&fit=crop",
  "Mount Abu": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
  "Bikaner": "https://images.unsplash.com/photo-1534577403868-27b9b01f330b?w=400&h=300&fit=crop",
  
  "Kochi": "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=400&h=300&fit=crop",
  "Munnar": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
  "Alleppey": "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=400&h=300&fit=crop",
  "Thekkady": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
  "Kovalam": "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=400&h=300&fit=crop",
  "Wayanad": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
  "Kumarakom": "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=400&h=300&fit=crop",
  
  "Shimla": "https://images.unsplash.com/photo-1574362849222-d9c5ac1f3c94?w=400&h=300&fit=crop",
  "Manali": "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=400&h=300&fit=crop",
  "Dharamshala": "https://images.unsplash.com/photo-1574362849222-d9c5ac1f3c94?w=400&h=300&fit=crop",
  "Dalhousie": "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=400&h=300&fit=crop",
  "Kasauli": "https://images.unsplash.com/photo-1574362849222-d9c5ac1f3c94?w=400&h=300&fit=crop",
  "Spiti Valley": "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=400&h=300&fit=crop",
  
  "North Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
  "South Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
  "Panaji": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
  "Calangute": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
  "Anjuna": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
  "Vagator": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
};

export default function LocationSelectionPage({ nextStep, prevStep }: LocationSelectionPageProps) {
  const { 
    selectedDestination, 
    setSelectedLocation, 
    setTripDestination
  } = useQuotation();
  
  const [searchTerm, setSearchTerm] = useState("");

  // Static destinations data
  const destinations: Location[] = [
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
    switch (type.toLowerCase()) {
      case "hill station": return "🏔️";
      case "cultural": return "🏛️";
      case "beach": return "🏖️";
      case "backwaters": return "🚤";
      case "adventure": return "🧗";
      case "city": return "🏙️";
      case "luxury": return "⭐";
      default: return "📍";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "hill station": return "from-green-400 to-green-600";
      case "cultural": return "from-yellow-400 to-yellow-600";
      case "beach": return "from-blue-400 to-blue-600";
      case "backwaters": return "from-cyan-400 to-cyan-600";
      case "adventure": return "from-red-400 to-red-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  // Get current destination from context or find by name
  const currentDestination = useMemo(() => {
    if (selectedDestination) {
      // Find the destination in our static data that matches the selected destination
      const foundDest = destinations.find(dest => 
        dest.name.toLowerCase() === selectedDestination.name.toLowerCase()
      );
      return foundDest || {
        id: selectedDestination.id,
        name: selectedDestination.name,
        type: selectedDestination.category,
        description: selectedDestination.description,
        image: selectedDestination.image,
        locations: selectedDestination.locations || ["Default Location"]
      };
    }
    return null;
  }, [selectedDestination]);

  const filteredLocations = useMemo(() => {
    if (!currentDestination) return [];
    return currentDestination.locations.filter(location =>
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentDestination, searchTerm]);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    if (currentDestination) {
      setTripDestination(currentDestination.name);
    }
    nextStep();
  };

  const handleBackToDestinations = () => {
    prevStep();
  };

  // If no destination is selected, show destination selection
  if (!currentDestination) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl mb-8 shadow-md p-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Location Selection
            </h1>
            <p className="text-gray-600 mt-2">Please select a destination first.</p>
            <button
              onClick={handleBackToDestinations}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Destinations
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Location Selection View
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl mb-8 shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className={`h-16 w-16 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-r ${getTypeColor(currentDestination.type)} text-white`}>
              {getIconByType(currentDestination.type)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{currentDestination.name}</h1>
              <p className="text-gray-600">{currentDestination.description}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl mb-6 shadow-md p-6">
          <div className="flex items-center border rounded-lg px-3 py-2 border-gray-300 shadow-sm bg-white">
            <input
              type="text"
              placeholder={`Search locations in ${currentDestination.name}...`}
              className="outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing {filteredLocations.length} of {currentDestination.locations.length} locations in {currentDestination.name}
        </p>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredLocations.map((location: string, index: number) => (
            <div
              key={location}
              onClick={() => handleLocationSelect(location)}
              className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg border border-gray-200"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={locationImages[location] || currentDestination.image}
                  alt={location}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  <span className="px-3 py-1 bg-white bg-opacity-90 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1 shadow-sm">
                    <span>{getIconByType(currentDestination.type)}</span>
                    {currentDestination.type}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-black bg-opacity-60 text-white rounded-full text-xs font-medium">
                    #{index + 1}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{location}</h3>
                      <p className="text-sm text-gray-600">{currentDestination.name}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  className={`w-full py-2 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r ${getTypeColor(currentDestination.type)} hover:shadow-lg`}
                >
                  Select Location
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No locations found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria for {currentDestination.name}.
            </p>
          </div>
        )}

        {/* Back Button at Bottom */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="flex justify-center">
            <button
              onClick={handleBackToDestinations}
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium flex items-center space-x-2"
            >
              <span>← Back to Destinations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}