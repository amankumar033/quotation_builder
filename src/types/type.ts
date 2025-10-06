// types/type.ts
export interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  locations?: string[];
}

export interface QuotationData {
  client: {
    name: string;
    phone: string;
    email: string;
    destination: string;
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    infants: number;
  };
  trip: {
    destination: string;
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    infants: number;
    duration: number;
    quoteNumber: string;
  };
  services: ServiceItem[];
  markupPercentage: number;
  termsConditions: string;
  specialNotes: string;
  agencyLogo: string | null;
  discountAmount: number;
  paymentTerms: string;
  contactInfo: string;
  agencyName: string;
  quoteNumber: string;
  totalPackagePrice?: number;
  finalGrandTotal?: number;
}

export interface Room {
  id: number;
  type: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  amenities: string[];
  photos: string[];
  bedType?: string;
  description?: string;
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
  roomType: string;
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
  cancellation: string;
  agencyId: string;
  roomTypes: {
    id: string;
    type: string;
    price: string;
    hotelId: string;
  }[];
  amenities?: string[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image: string;
  photos?: string[];
  agencyId?: string;
  isCustom?: boolean;
  selectedDays?: string[];
}

export interface TransportRoute {
  id: string;
  from: string;
  to: string;
  type: 'pickup' | 'transfer' | 'sightseeing' | 'drop';
  dayNumber: number;
  vehicle: Transport;
  price: number;
  distance: number;
  isComplimentary?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  type: 'hotel' | 'car' | 'meal' | 'activity';
  price: number;
  quantity: number;
  details: Record<string, any>;
  unit?: string;
}

export interface ClientInfo {
  name: string;
  phone: string;
  email: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  adults?: number;
  children?: number;
  infants?: number;
}

export interface TripInfo {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  duration?: number;
  quoteNumber?: string;
}

export interface DayItinerary {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
  transport: string;
  approximateDistance?: string;
  approximateTime?: string;
  image?: string;
}