export interface QuotationData {
  selectedVehicle: string | null;
  roomSelections?: {
    hotel: Hotel | null;
    day: number;
    selections: RoomSelection[];
    meals?: Meal[];
  };
}



export interface Room {
  id: number;
  type: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  amenities: string[];
  photos: string[];
}

export interface Transport {
  id: number;
  name: string;
  passengers: number;
  perDay: number;
  perKm: number;
  photos: string;
  maxCapacity: number;
  vehicleType: string;
  type: string;
  capacity: number;
  price: number;
  features: string[];
  image?: string;
}

export interface Meal {
  id: number;
  type: string;
  price: number;
  quantity: number;
  name: string;
  category: string;
  image: string;
  hotelId: string;
}



export interface DaySelection {
  date: string;
  hotel?: Hotel | null;
  meals?: Meal[];
  transports?: Transport | null;
  activities?: Activity[];
  isCompleted: boolean;
  selectedHotel?: Hotel | null;
  selectedMeals?: Meal[];
  selectedTransport?: Transport | null;
  selectedActivities?: Activity[];
  selectedVehicleType?: string | null;
  roomSelections?: RoomSelection[];
}

export interface RoomSelection {
  roomId: number;
  roomCount: number;
  dayNumber: number;
  adults: number;
  adultsWithExtraBed: number;
  childrenWithBed: number;
  childrenWithoutBed: number;
  totalPrice: number;
  isConfirmed: boolean;
  confirmedAt: string;
}
// Add amenities to Hotel interface
// Add amenities to Hotel interface
export interface Hotel {
  id: string;
  name: string;
  city: string;
  starCategory: number;
  price: number;
  photos: string[];
  inclusions: string[];
  isHotelConfirmed: boolean;
  cancellation: string;
  agencyId: string;
  roomTypes: {
    id: string;
    type: string;
    price: string;
    hotelId: string;
  }[];
  amenities?: string[]; // Add this line
}

// Make category required in Activity
export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string; // Changed from optional to required
  image: string;
  photos?: string[];
  agencyId?: string;
}