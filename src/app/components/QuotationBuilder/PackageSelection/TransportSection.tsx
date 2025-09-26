import { useState } from "react";
import TransportCard from "./TransportCard";
import { DaySelection, Transport } from "@/types/type";
import { ChevronDown, ChevronUp, Users } from "lucide-react";

interface TransportSectionProps {
  daySelection: DaySelection;
  updateDaySelection: (dayNumber: number, updates: Partial<DaySelection>) => void;
  transportations: Transport[];
  theme: any;
  isSectionActive: boolean;
  toggleSection: () => void;
}

// sampleTransports.ts
export const sampleTransports = [
  {
    id: 1,
    name: "Creta",
    type: "suv",
    capacity: 6, // excluding driver
    price: "₹2500",
    features: ["AC", "Spacious", "GPS"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHwo2fcL5DN780PkeTF5Jcwm9iugyP7jm_A&s",
  },
  {
    id: 2,
    name: "Mahindra XUV700",
    type: "suv",
    capacity: 6,
    price: "₹3000",
    features: ["AC", "Comfort", "Music System"],
    image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT9viXlIfRkuJzL9O2Kn6GxGmFfiZNkuqyWFcjsoMscxG-hGSLKLvrQq9zgASRroESxx01RGf--7NQEyGekss_bolubwG5PGMkVPxUzpTqA",
  },
  {
    id: 3,
    name: "Honda City",
    type: "sedan",
    capacity: 4,
    price: "₹2000",
    features: ["Compact", "Luxury", "AC"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRraGwEcqfCSHVUzegKkPPhZ_VD90I0ZTCZ2g&s",
  },
  {
    id: 4,
    name: "12 Seater Tempo",
    type: "tempo-traveller",
    capacity: 12,
    price: "₹4500 ",
    features: ["Large", "AC", "Luggage Space"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjVbbXPs-SJ1GiQxTF6HcYCqDZPGTt8T6udw&s",
  },
];

const vehicleCategories: Record<string, { label: string; img: string; description: string }> = {
  suv: {
    label: "SUV",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHwo2fcL5DN780PkeTF5Jcwm9iugyP7jm_A&s",
    description: "Comfortable 6-7 seater, great for families."
  },
  sedan: {
    label: "Sedan",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmCta4mUoMPjzCowgxUzrtCK2-H46Gr5lPpA&s",
    description: "Ideal for 4 passengers, stylish & compact."
  },
  "tempo-traveller": {
    label: "Tempo Traveller",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaf8xNw9MhbFaMHXKuikaiqNvzryJ1FoWVlQ&s",
    description: "Spacious 12–15 seater, best for groups."
  }
};

export default function TransportSection({
  daySelection,
  updateDaySelection,
  transportations,
  theme,
  isSectionActive,
  toggleSection
}: TransportSectionProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleVehicleSelect = (vehicleId: number) => {
    updateDaySelection(daySelection.day, {
      selectedTransport: vehicleId,
      selectedVehicleType: selectedType
    });
  };

  // Use sampleTransports instead of the transportations prop if you want to use your sample data
  const availableTransports = sampleTransports; // or use transportations if you want to use the prop

  return (
    <div className="border rounded-xl border-gray-300 overflow-hidden">
      {/* Accordion Header */}
      <div
        className="px-6 py-4 cursor-pointer text-gray-700  bg-gray-50"
        onClick={toggleSection}
      >
        
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
        <img src="/suv1.png" alt="" className="h-8 w-5"/>
       
          <h4 className="text-lg font-semibold text-gray-500">
            Select Transport for Day {daySelection.day}
          </h4>
           </div>
          {isSectionActive ? <ChevronUp className="text-gray-500"/> : <ChevronDown className="text-gray-500"/>}
        </div>
      </div>

      {isSectionActive && (
        <div className="p-6">
          {!daySelection.selectedTransport ? (
            <>
              {/* Category cards */}
              {!selectedType ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {Object.entries(vehicleCategories).map(([type, { label, img }]) => (
                    <div
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className="relative bg-white rounded-2xl shadow-md border border-gray-200 p-6 cursor-pointer
                                 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col items-center text-center"
                    >
                      <img src={img} alt={label} className="h-54 object-contain mb-3" />
                      <h6 className="text-lg font-semibold">{label}</h6>
                      <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {type === "suv" && "6–7 Seater"}
                        {type === "sedan" && "4 Seater"}
                        {type === "tempo-traveller" && "12–15 Seater"}
                      </div>
                      <button className="mt-4 px-4 py-2 rounded-lg w-full bg-green-400 text-white hover:bg-gray-200 text-sm font-medium">
                        Select {label}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Vehicle list after selecting a type */}
                  <h5 className="text-lg font-bold mb-4">
                    Choose your {vehicleCategories[selectedType].label}
                  </h5>
          <div className="flex flex-wrap gap-4 justify-start">
  {availableTransports
    .filter((t) => t.type.toLowerCase() === selectedType.toLowerCase())
    .map((transport) => (
      <TransportCard
        key={transport.id}
        transport={transport}
        isSelected={daySelection.selectedTransport === transport.id}
        onSelect={handleVehicleSelect}
        theme={theme}
      />
    ))}
</div>
                  <button
                    onClick={() => setSelectedType(null)}
                    className="mt-6 text-sm text-gray-500 hover:underline"
                  >
                    ← Back to Vehicle Types
                  </button>
                </>
              )}
            </>
          ) : (
            // Summary after selection
            <div className="bg-white border border-gray-300 rounded-xl px-6 py-3 shadow-md flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={
                    availableTransports.find((t) => t.id === daySelection.selectedTransport)
                      ?.image || "/placeholder.png"
                  }
                  alt="Selected Vehicle"
                  className="w-20 h-16 object-cover border-gray-200 rounded-lg border"
                />
                <div>
                  <h5 className="text-lg font-semibold text-gray-800">Selected Vehicle</h5>
                  <p className="text-gray-600">
                    {
                      availableTransports.find((t) => t.id === daySelection.selectedTransport)
                        ?.name
                    }
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    {
                      availableTransports.find((t) => t.id === daySelection.selectedTransport)
                        ?.price
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  updateDaySelection(daySelection.day, {
                    selectedTransport: null,
                    selectedVehicleType: null,
                  })
                }
                className="px-4 py-2 text-sm font-medium rounded-lg text-red-600 border border-red-300 hover:bg-red-50"
              >
                Change
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}