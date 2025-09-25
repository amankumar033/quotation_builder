"use client";

import { useState, useMemo } from "react";
import { useQuotation } from "@/context/QuotationContext"; // ✅ new

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  
}

interface Destinationprops{
    nextStep: () => void;
}


export default function DestinationSelectionStep({ nextStep}:Destinationprops){
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { setSelectedDestination } = useQuotation(); // ✅ new


  // ✅ Define destinations inside component
  const destinations: Destination[] = [
    { id: "1", name: "Maldives", image: "https://t3.ftcdn.net/jpg/03/34/77/78/360_F_334777839_Y7Y5P8FFY5WFo7sTwjeT0vxDbTGxhIo5.jpg", description: "Beautiful beaches and luxury resorts", category: "Beach" },
    { id: "2", name: "Sikkim", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgOtHARwlYuSjVLSjlXqVK-2OV7dt3m8eiiA&s", description: "The city of lights and romance", category: "City" },
    { id: "3", name: "Himalayas", image: "https://cdn.britannica.com/74/114874-050-6E04C88C/North-Face-Mount-Everest-Tibet-Autonomous-Region.jpg", description: "Adventure and trekking paradise", category: "Mountain" },
    { id: "4", name: "Goa", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=60", description: "Pristine beaches and vibrant nightlife", category: "Beach" },
    { id: "5", name: "Andaman Islands", image: "https://images.unsplash.com/photo-1586016413664-864c0dd76f53?w=800&auto=format&fit=crop&q=60", description: "Crystal clear waters and exotic marine life", category: "Beach" },
    { id: "6", name: "Kovalam", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR67QxVFUxVoz13Tv9tRvyNiZ8TtqRFMK-skg&s", description: "Serene beaches in Kerala with lighthouse views", category: "Beach" },
    { id: "7", name: "Jaipur", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8RIf0-JMU4AxY9dUZgXtaW2CdqoY8fKpkkVW9HQ_6Lc0pL5AB-vgd61k5j4bfHjfnDDc&usqp=CAU", description: "The Pink City with palaces and forts", category: "City" },
    { id: "8", name: "Varanasi", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsdX-6qgNUM-4az7w_AT5DeVsnpRaSjHDvHg&s", description: "Spiritual capital on the River Ganges", category: "City" },
    { id: "9", name: "Mumbai", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&auto=format&fit=crop&q=60", description: "Financial capital with Bollywood glamour", category: "City" },
    { id: "10", name: "Leh-Ladakh", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROONRpGbD3Z5mgrEB-ya8Hnqplq74sp2vpyw&s", description: "High-altitude desert with breathtaking landscapes", category: "Mountain" },
    { id: "11", name: "Shimla", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVVlpbdpqtQZNBSl390eOEbFcXOCSLsBjKog&s", description: "Queen of Hills with colonial architecture", category: "Mountain" },
    { id: "12", name: "Darjeeling", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoT5np4_N69FhwNbKYDDuhMkJRa8jqhZio5Q&s", description: "Tea gardens and Himalayan railway", category: "Mountain" },
    { id: "13", name: "Udaipur", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTCrR4Aw4kZZKkB3EPgsQYrKkUk_lb-gCgzQ&s", description: "City of Lakes with luxurious palaces", category: "Luxury" },
    { id: "14", name: "Rishikesh", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBqCquWtuD_xjw7XOf3Xm3YViu7SAq7IZyEQ&s", description: "Yoga retreats and spiritual wellness", category: "Luxury" },
    { id: "15", name: "Kerala Backwaters", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0Z1vIVF8Zms5pJuazOs2Lg3-6COPzNR8UNQ&s", description: "Luxury houseboat experience", category: "Luxury" },
    { id: "16", name: "Tungnath", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCn4meRZWstKztgjSAtnv2c7Hyxd0P1a5Zqg&s", description: "Rafting and bungee jumping", category: "Adventure" },
    { id: "17", name: "Manali", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXa3-E-740lQHe5j4oLjggcJqyJ7zQjoV6Aw&s", description: "Trekking, skiing, paragliding", category: "Adventure" },
    { id: "18", name: "Spiti Valley", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQfqdDtajYOYLzCO0pgG_wvKAxr_Th1gRCJg&s", description: "Motorcycle expeditions and camping", category: "Adventure" },
    { id: "19", name: "Puri", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkl7dz5Pt1LSMOXk3-ODWtP1gW9GP6zHXymw&s", description: "Jagannath Temple and golden beaches", category: "Beach" },
    { id: "20", name: "Lakshadweep", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60", description: "Coral islands with turquoise lagoons", category: "Beach" },
    { id: "21", name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=60", description: "Historical monuments and modern vibe", category: "City" },
    { id: "22", name: "Kolkata", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVhbgZmVVyDgPqOPxdAZo4730fX03sR00MoQ&s", description: "Cultural capital with colonial heritage", category: "City" },
    { id: "23", name: "Mussoorie", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQ09uHKUL1jzlgx71YQkD90y4uOaaf4Cctg&s", description: "Hill station with Himalayan views", category: "Mountain" },
    { id: "24", name: "Nainital", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXPmJX8FdMBywK0sF95Y0GDi6lrgTcbkxPXQ&s", description: "Lake district of India", category: "Mountain" },
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  // Categories
  const categories = useMemo(
    () => ["All", ...new Set(destinations.map((d) => d.category))],
    [destinations]
  );

  // Filtered
  const filteredDestinations = useMemo(
    () =>
      destinations.filter((d) => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [destinations, searchTerm, selectedCategory]
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
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-white bg-opacity-90 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1 shadow-sm">
                    <span>{getCategoryIcon(destination.category)}</span>
                    {destination.category}
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
