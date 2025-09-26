import { X, Users, Car } from "lucide-react";

interface VehicleTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleType: string | null;
  vehicles: any[];
  onVehicleSelect: (vehicleId: number) => void;
  theme: any;
}

export default function VehicleTypeModal({
  isOpen,
  onClose,
  vehicleType,
  vehicles,
  onVehicleSelect,
  theme
}: VehicleTypeModalProps) {
  if (!isOpen) return null;

  const vehicleTypeLabels = {
    suv: "SUV Vehicles",
    sedan: "Sedan Cars", 
    "tempo-traveller": "Tempo Travellers"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold">
            {vehicleTypeLabels[vehicleType as keyof typeof vehicleTypeLabels] || "Select Vehicle"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="border rounded-lg p-4 cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => onVehicleSelect(vehicle.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-tr ${theme.bg} flex items-center justify-center`}>
                      <Car className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{vehicle.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{vehicleType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">₹{vehicle.price}</span>
                    <p className="text-sm text-gray-500">per day</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {vehicle.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}