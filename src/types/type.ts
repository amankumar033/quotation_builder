// types/quotation.ts
export interface QuotationData {
  selectedVehicle: string | null;
  // Add other quotation data properties as needed
    roomSelections?: {
    hotel: Hotel | null;
    day: number;
    selections: RoomSelection[];
    meals?: Meal[];
  };
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  starCategory: number;
  price: number;
  photos: string[];
  inclusions: string[];
 
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
}

export interface Meal {
  id: number;
  type: string;
  price: number;
  quantity:number
  name:string
  category:string
  description:string
  image:string
  
}

export interface Activity {
  id: number;
  name: string;
  desc: string;
  price: number;
  photos: string;
}

export interface DaySelection {
  day: number;
  selectedHotel: number | null;
  selectedMeals: number[];
  selectedTransport?: number | null;
  selectedActivities: number[];
}

export interface RoomSelection {
  roomId: number;
  roomCount: number;
  adults: number;
  childrenWithBed: number;
  childrenWithoutBed: number;
  totalPrice: number;
}