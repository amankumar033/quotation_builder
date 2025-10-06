"use client";

import { useState, useMemo } from "react";
import { useQuotation } from "@/context/QuotationContext";

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  region: "Domestic" | "International";
  locations?: string[];
}

interface DestinationProps {
  nextStep: () => void;
}

export default function DestinationSelectionStep({ nextStep }: DestinationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const { setSelectedDestination, setTripDestination } = useQuotation();

  // Destinations with locations
  const destinations: Destination[] = [
    { 
      id: "1", 
      name: "Gangtok", 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgOtHARwlYuSjVLSjlXqVK-2OV7dt3m8eiiA&s", 
      description: "Beautiful Himalayan destination with stunning landscapes", 
      category: "Hill Station", 
      region: "Domestic",
      locations: ["Gangtok", "Pelling", "Lachung", "Lachen", "Ravangla", "Namchi", "Yuksom"]
    },
    { 
      id: "2", 
      name: "Goa", 
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=60", 
      description: "Sun, sand, and sea paradise", 
      category: "Beach", 
      region: "Domestic",
      locations: ["North Goa", "South Goa", "Panjim", "Calangute", "Anjuna"]
    },
    { 
      id: "3", 
      name: "Rameshwaram", 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsS7eIwolTxWXutrpD0Tkodo7HQRQF7kElqQ&s", 
      description: "God's own country with backwaters and lush greenery", 
      category: "Backwaters", 
      region: "Domestic",
      locations: ["Munnar", "Alleppey", "Kochi", "Thekkady", "Kovalam"]
    },
    { 
      id: "4", 
      name: "Jaipur", 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8RIf0-JMU4AxY9dUZgXtaW2CdqoY8fKpkkVW9HQ_6Lc0pL5AB-vgd61k5j4bfHjfnDDc&usqp=CAU", 
      description: "Land of kings and majestic forts", 
      category: "Heritage", 
      region: "Domestic",
      locations: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"]
    },
    { 
      id: "5", 
      name: "Kasouli", 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY_4HEBTUa9KncZ-NdblzVjX4eV7YoVdZgsQ&s", 
      description: "Snow-capped mountains and adventure sports", 
      category: "Hill Station", 
      region: "Domestic",
      locations: ["Manali", "Shimla", "Dharamshala", "Kasol", "Spiti Valley"]
    },
    { 
      id: "6", 
      name: "Maldives", 
      image: "https://t3.ftcdn.net/jpg/03/34/77/78/360_F_334777839_Y7Y5P8FFY5WFo7sTwjeT0vxDbTGxhIo5.jpg", 
      description: "Beautiful beaches and luxury resorts", 
      category: "Beach", 
      region: "International" 
    },
    { 
      id: "7", 
      name: "Dubai", 
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV5mfsFZOSmU3JXQ5Cos76Z_HZjdn5sHEOVw&s", 
      description: "Luxury shopping, ultramodern architecture", 
      category: "Luxury", 
      region: "International" 
    },
    { 
      id: "8", 
      name: "Paris", 
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=60", 
      description: "The city of lights and romance", 
      category: "City", 
      region: "International" 
    },
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedRegion("All");
  };

  // Categories
  const categories = useMemo(
    () => ["All", ...new Set(destinations.map((d) => d.category))],
    [destinations]
  );

  // Regions
  const regions = ["All", "Domestic", "International"];

  // Filtered destinations
  const filteredDestinations = useMemo(
    () =>
      destinations.filter((d) => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
        const matchesRegion = selectedRegion === "All" || d.region === selectedRegion;
        return matchesSearch && matchesCategory && matchesRegion;
      }),
    [destinations, searchTerm, selectedCategory, selectedRegion]
  );

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "beach": return "🏖️";
      case "city": return "🏙️";
      case "luxury": return "⭐";
      case "mountain": return "⛰️";
      case "hill station": return "🏔️";
      case "heritage": return "🏛️";
      case "backwaters": return "🚤";
      case "adventure": return "🧗";
      default: return "📍";
    }
  };

  const handleSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    setTripDestination(destination.name);
    // Now go directly to client info (next step)
    nextStep();
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "beach": return "from-blue-400 to-blue-600";
      case "city": return "from-orange-400 to-orange-600";
      case "luxury": return "from-purple-400 to-purple-600";
      case "mountain": 
      case "hill station": return "from-green-400 to-green-600";
      case "heritage": return "from-yellow-400 to-yellow-600";
      case "backwaters": return "from-cyan-400 to-cyan-600";
      case "adventure": return "from-red-400 to-red-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl mb-8 shadow-md p-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Destination Selection
          </h1>

          {/* Search + Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <div className="flex items-center border rounded-lg px-3 py-2 border-gray-300 shadow-sm bg-white flex-grow">
              <input
                type="text"
                placeholder="Search by name ..."
                className="outline-none w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="border rounded-lg px-3 border-gray-300 py-[11px] shadow-sm bg-white text-gray-600 cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : `${getCategoryIcon(category)} ${category}`}
                </option>
              ))}
            </select>

            {/* Region Filter */}
            <select
              className="border rounded-lg px-3 border-gray-300 py-[11px] shadow-sm bg-white text-gray-600 cursor-pointer"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === "All" ? "All Regions" : region}
                </option>
              ))}
            </select>

            <button
              className="px-3 py-2 bg-gradient-to-br text-white rounded-lg from-blue-600 to-blue-700"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          Showing {filteredDestinations.length} of {destinations.length} destinations
        </p>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              onClick={() => handleSelect(destination)}
              className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  <span className="px-3 py-1 bg-white bg-opacity-90 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1 shadow-sm">
                    <span>{getCategoryIcon(destination.category)}</span>
                    {destination.category}
                  </span>
                <span className="px-3 py-1 bg-white text-gray-600 rounded-full text-center text-xs font-medium shadow-sm flex items-center gap-1">
  {destination.region === "Domestic" ? "🏠" : "🌍"}
  {destination.region}
</span>

                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">{destination.name}</h3>
                
                {/* Show only number of locations, not tags */}
                {/* <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-1">📍</span>
                    <span>{destination.locations?.length || 0} locations</span>
                  </div>
                </div> */}

                <div className="mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(destination);
                    }}
                    className={`w-full py-2 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r ${getCategoryColor(destination.category)}`}
                  >
                    Select Destination
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No destinations found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check out our custom destination option below.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}