// components/QuotationBuilder/PackageSelectionStep.tsx
import { useState } from 'react';
import { QuotationData, ServiceItem } from '../../quotation-builder/page';

interface PackageSelectionStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// Mock data for demonstration
const mockHotels = [
  { id: 1, name: "Taj Hotel", city: "Goa", stars: 5, price: 7500, roomType: "Deluxe" },
  { id: 2, name: "Hilton Resort", city: "Goa", stars: 4, price: 5500, roomType: "Standard" },
  { id: 3, name: "Sea View Villa", city: "Goa", stars: 3, price: 3500, roomType: "Villa" },
];

const mockCars = [
  { id: 1, name: "Toyota Innova", type: "SUV", pricePerDay: 2500, capacity: "6 passengers" },
  { id: 2, name: "Hyundai Creta", type: "SUV", pricePerDay: 2000, capacity: "5 passengers" },
  { id: 3, name: "Tempo Traveller", type: "Van", pricePerDay: 4500, capacity: "12 passengers" },
];

const mockMeals = [
  { id: 1, name: "Breakfast Buffet", type: "Breakfast", price: 450, option: "Veg" },
  { id: 2, name: "Lunch Buffet", type: "Lunch", price: 650, option: "Veg & Non-Veg" },
  { id: 3, name: "Dinner Buffet", type: "Dinner", price: 750, option: "Veg & Non-Veg" },
];

const mockActivities = [
  { id: 1, name: "Scuba Diving", duration: "Half-day", price: 2500, description: "Explore underwater life" },
  { id: 2, name: "City Tour", duration: "Full-day", price: 3500, description: "Guided city sightseeing" },
  { id: 3, name: "Sunset Cruise", duration: "2 hours", price: 1800, description: "Evening boat cruise" },
];

export default function PackageSelectionStep({ data, updateData, nextStep, prevStep }: PackageSelectionStepProps) {
  const [activeTab, setActiveTab] = useState<'hotels' | 'cars' | 'meals' | 'activities'>('hotels');

  const addService = (service: Omit<ServiceItem, 'id' | 'quantity'>) => {
    const newService: ServiceItem = {
      ...service,
      id: Math.random().toString(36).substr(2, 9),
      quantity: 1
    };
    
    updateData({
      services: [...data.services, newService]
    });
  };

  const removeService = (id: string) => {
    updateData({
      services: data.services.filter(service => service.id !== id)
    });
  };

  const updateServiceQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    updateData({
      services: data.services.map(service => 
        service.id === id ? { ...service, quantity } : service
      )
    });
  };

  // Calculate pricing
  const subtotal = data.services.reduce((sum, service) => sum + (service.price * service.quantity), 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-2">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </span>
          Package Selection
        </h3>
        <p className="text-gray-600 mt-1 ml-11">Select hotels, transfers, meals, and activities for your package</p>
      </div>

      <div className="flex border-b border-gray-200">
        {(['hotels', 'cars', 'meals', 'activities'] as const).map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium text-sm ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Service Selection Panel */}
        <div className="md:col-span-2">
          <h4 className="font-medium text-gray-800 mb-4">Available {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h4>
          
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto p-1">
            {(activeTab === 'hotels' ? mockHotels : 
              activeTab === 'cars' ? mockCars : 
              activeTab === 'meals' ? mockMeals : mockActivities).map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-gray-900">{item.name}</h5>
                    <p className="text-sm text-gray-500">
                      {activeTab === 'hotels' && 'city' in item && 'stars' in item && `${item.city} • ${'★'.repeat(item.stars)}`}
                      {activeTab === 'cars' && 'type' in item && 'capacity' in item && `${item.type} • ${item.capacity}`}
                      {activeTab === 'meals' && 'type' in item && 'option' in item && `${item.type} • ${item.option}`}
                      {activeTab === 'activities' && 'duration' in item && 'description' in item && `${item.duration} • ${item.description}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{activeTab === 'cars' && 'pricePerDay' in item ? item.pricePerDay : 'price' in item ? item.price : 0}
                    </p>
                    <button
                      onClick={() => addService({
                        name: item.name,
                        type: activeTab.slice(0, -1) as any, // Remove 's' from end
                        price: activeTab === 'cars' && 'pricePerDay' in item
                          ? item.pricePerDay
                          : 'price' in item
                          ? item.price
                          : 0,
                        details: activeTab === 'hotels' && 'city' in item && 'stars' in item && 'roomType' in item
                          ? { city: item.city, stars: item.stars, roomType: item.roomType }
                          : activeTab === 'cars' && 'type' in item && 'capacity' in item
                          ? { type: item.type, capacity: item.capacity }
                          : activeTab === 'meals'
                          ? ('type' in item && 'option' in item
                              ? { type: item.type, option: item.option }
                              : {})
                          : 'duration' in item && 'description' in item
                          ? { duration: item.duration, description: item.description }
                          : {}
                      })}
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-md hover:bg-blue-200 transition"
                    >
                      Add to Package
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Services Panel */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-4">Selected Services</h4>
          
          {data.services.length > 0 ? (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {data.services.map(service => (
                <div key={service.id} className="bg-white p-3 rounded-md border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 text-sm">{service.name}</h5>
                      <p className="text-xs text-gray-500 capitalize">{service.type}</p>
                      {Object.entries(service.details).map(([key, value]) => (
                        <p key={key} className="text-xs text-gray-500">{key}: {value}</p>
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm">₹{service.price * service.quantity}</p>
                      <div className="flex items-center mt-1">
                        <button 
                          onClick={() => updateServiceQuantity(service.id, service.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 rounded-l-md flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 h-6 bg-gray-100 text-center text-xs flex items-center justify-center">
                          {service.quantity}
                        </span>
                        <button 
                          onClick={() => updateServiceQuantity(service.id, service.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 rounded-r-md flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeService(service.id)}
                    className="mt-2 text-red-600 text-xs hover:text-red-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-md border border-dashed border-gray-300">
              <p className="text-gray-500 text-sm">No services added yet</p>
              <p className="text-xs text-gray-400 mt-1">Select services from the left panel</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Subtotal:</span>
              <span className="text-gray-900 font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition flex items-center"
        >
          Next: Customization
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}