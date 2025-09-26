import { Car, Users } from "lucide-react";

interface TransportCardProps {
  transport: {
    id: number;
    name: string;
    type: string;
    capacity: number; // excluding driver
    price: string;    // price as a range string
    features: string[];
    image?: string;
  };
  isSelected: boolean;
  onSelect: (transportId: number) => void;
  theme: any;
}

export default function TransportCard({
  transport,
  isSelected,
  onSelect,
  theme,
}: TransportCardProps) {
  return (
    <div
      className={`border rounded-2xl shadow-md bg-white overflow-hidden transition-all w-72
        ${
          isSelected
            ? "ring-2 ring-green-500 border-green-500"
            : "border-gray-200 hover:-translate-y-2 hover:shadow-xl"
        }`}
    >
      {/* Image */}
      {transport.image && (
        <img
          src={transport.image}
          alt={transport.name}
          className="w-full h-40 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4 flex flex-col space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{transport.name}</h3>
          <span className="font-bold text-green-700">{transport.price}</span>
        </div>

        {/* Capacity */}
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>{transport.capacity} Passengers</span>
        </div>

        {/* Features as tags */}
        <div className="flex flex-wrap gap-2">
          {transport.features?.map((feature, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-700"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => onSelect(transport.id)}
          className={`mt-3 w-full py-2 rounded-lg font-medium transition-colors ${
            isSelected
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isSelected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}
