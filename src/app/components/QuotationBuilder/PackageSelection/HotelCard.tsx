// components/QuotationBuilder/PackageSelection/HotelCard.tsx
"use client"
import { Hotel } from "@/types/type";
import { useQuotation } from "@/context/QuotationContext";

interface HotelCardProps {
  hotel: Hotel;
  isSelected: boolean;
  onSelect: (hotelId: string) => void;
  onViewDetails: (hotel: Hotel) => void;
  theme: { text: string };
}

export default function HotelCard({
  hotel,
  isSelected,
  onSelect,
  onViewDetails,
  theme,
}: HotelCardProps) {
  const { setHotelInfo } = useQuotation();

  function callbacki(hotel: Hotel) {
    setHotelInfo([hotel]);
    console.log("callback", hotel);
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    callbacki(hotel);
    onSelect(hotel.id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    callbacki(hotel);
    onViewDetails(hotel);
  };

  return (
    <div
      className={`flex flex-col border rounded-xl overflow-hidden transition-all duration-300 ease-out
        hover:transform hover:scale-105 cursor-pointer
        ${
          isSelected
            ? `border-${theme.text.split("-")[1]}-500 shadow-md scale-105`
            : "border-gray-200 hover:border-blue-300"
        }`}
    >
      <div
        className="h-48 overflow-hidden"
        onClick={handleViewDetails}
      >
        <img
          src={hotel.photos[0] || ""}
          alt={hotel.name}
          className="w-full h-full object-cover hover:transform hover:scale-107 transition-all duration-300 ease-out"
        />
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-xl text-gray-700">{hotel.name}</h4>
            <p className="text-lg text-gray-500 mt-2">{hotel.city}</p>
          </div>
        </div>

        <div className="flex items-center mb-3">
          <span className="text-yellow-500 text-xl mr-1">
            {"★".repeat(hotel.starCategory)}
          </span>
          <span className="text-gray-300">
            {"★".repeat(5 - hotel.starCategory)}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">Inclusions:</p>
          {hotel.inclusions.map((inc, idx) => (
            <span
              key={idx}
              className="text-gray-500 bg-blue-100 px-2 ml-2 py-[2px] text-[12px]"
            >
              {inc}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            View Details
          </button>
          <button
            onClick={handleSelect}
            className={`flex-1 py-2 rounded-lg transition ${
              isSelected
                ? `bg-blue-800 text-white`
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isSelected ? "✓ Selected" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
}