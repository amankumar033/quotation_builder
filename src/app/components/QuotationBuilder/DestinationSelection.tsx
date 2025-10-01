"use client";

import { useState, useMemo } from "react";
import { useQuotation } from "@/context/QuotationContext"; // ✅ new

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  region: "Domestic" | "International"; // ✅ new field
}

interface Destinationprops {
  nextStep: () => void;
}

export default function DestinationSelectionStep({ nextStep }: Destinationprops) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All"); // ✅ new state
  const { setSelectedDestination } = useQuotation(); // ✅ new

  // ✅ Define destinations inside component with Domestic/International
  const destinations: Destination[] = [
    { id: "1", name: "Maldives", image: "https://t3.ftcdn.net/jpg/03/34/77/78/360_F_334777839_Y7Y5P8FFY5WFo7sTwjeT0vxDbTGxhIo5.jpg", description: "Beautiful beaches and luxury resorts", category: "Beach", region: "International" },
    { id: "2", name: "Sikkim", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgOtHARwlYuSjVLSjlXqVK-2OV7dt3m8eiiA&s", description: "The city of lights and romance", category: "City", region: "Domestic" },
    { id: "3", name: "Himalayas", image: "https://cdn.britannica.com/74/114874-050-6E04C88C/North-Face-Mount-Everest-Tibet-Autonomous-Region.jpg", description: "Adventure and trekking paradise", category: "Mountain", region: "Domestic" },
    { id: "4", name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=60", description: "Pristine beaches and vibrant nightlife", category: "Beach", region: "Domestic" },
    { id: "5", name: "Andaman Islands", image: "https://images.unsplash.com/photo-1586016413664-864c0dd76f53?w=800&auto=format&fit=crop&q=60", description: "Crystal clear waters and exotic marine life", category: "Beach", region: "Domestic" },
    { id: "6", name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=60", description: "The city of lights and romance", category: "City", region: "International" },
    { id: "7", name: "Dubai", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV5mfsFZOSmU3JXQ5Cos76Z_HZjdn5sHEOVw&s", description: "Luxury shopping, ultramodern architecture", category: "Luxury", region: "International" },
    { id: "8", name: "Jaipur", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8RIf0-JMU4AxY9dUZgXtaW2CdqoY8fKpkkVW9HQ_6Lc0pL5AB-vgd61k5j4bfHjfnDDc&usqp=CAU", description: "The Pink City with palaces and forts", category: "City", region: "Domestic" },
    { id: "9", name: "Tokyo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdEnx5QhhDvzDr_6tmMSpTycABM4i-qsrHcA&s", description: "A perfect blend of tradition and technology", category: "City", region: "International" },
    { id: "10", name: "Kerala Backwaters", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Z1vIVF8Zms5pJuazOs2Lg3-6COPzNR8UNQ&s", description: "Luxury houseboat experience", category: "Luxury", region: "Domestic" },
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedRegion("All"); // ✅ reset region
  };

  // Categories
  const categories = useMemo(
    () => ["All", ...new Set(destinations.map((d) => d.category))],
    [destinations]
  );

  // Regions
  const regions = ["All", "Domestic", "International"];

  // Filtered
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
      case "adventure": return "🧗";
      default: return "📍";
    }
  };

  // ✅ new handler
  const handleSelect = (destination: Destination) => {
    setSelectedDestination(destination); // save full object in context
    nextStep(); // move to next step
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "beach": return "from-blue-400 to-blue-600";
      case "city": return "from-orange-400 to-orange-600";
      case "luxury": return "from-purple-400 to-purple-600";
      case "mountain": return "from-green-400 to-green-600";
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

            {/* Region Filter ✅ */}
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
                  <span className="px-3 py-1 bg-white text-gray-600 rounded-full text-center text-xs font-medium shadow-sm">
                    {destination.region}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-2 truncate">{destination.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 min-h-[3rem]">
                  {destination.description}
                </p>

                <div className="mt-4">
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
