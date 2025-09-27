export interface QuotationData {
  selectedVehicle: string | null;
  roomSelections?: {
    hotel: Hotel | null;
    day: number;
    selections: RoomSelection[];
    meals?: Meal[];
  };
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  starCategory: number;
  price: number;
  photos: string[];
  inclusions: string[];
  isHotelConfirmed: boolean;
  cancellation:string;
  agencyId:string;
  
  roomTypes: {
    id: string;
    type: string;
    price: string;
    hotelId: string;
  }[];

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
  hotelId:string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category?: string;
  image: string;
  photos?: string[];
  agencyId?: string;
}

export interface DaySelection {
  day: number;
  selectedHotel: Hotel | null;  // <-- full hotel object
  selectedMeals: Meal[];
  selectedActivities: string[];
  selectedTransport: Transport | null;
  selectedVehicleType: string | null;
  roomSelections?: RoomSelection[];
  isHotelConfirmed?: boolean;
}

// In your @/types/type file
export interface RoomSelection {
  roomId: number;
  roomCount: number;
  dayNumber: number;
  adults: number;
  adultsWithExtraBed: number; // Make sure this property exists
  childrenWithBed: number;
  childrenWithoutBed: number;
  totalPrice: number;
  isConfirmed: boolean;
  confirmedAt: string;
}