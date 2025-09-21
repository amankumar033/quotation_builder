// /types/interfaces.ts

export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  password?: string;
  image?: string;
  role: Role;
  agencyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface LoginHistory {
  id: string;
  userId: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface Agency {
  id: string;
  name: string;
  logo?: string;
  settings?: any; // Json
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  notes?: string;
  agencyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  starCategory: number;
  inclusions?: string;
  cancellation?: string;
  photos?: string;
  agencyId: string;
  roomTypes: RoomType[];
}

export interface RoomType {
  id: string;
  type: string;
  price: number;
  hotelId: string;
}

export interface Transport {
  id: string;
  vehicleType: string;
  perDay: number;
  perKm: number;
  maxCapacity: number;
  notes?: string;
  photos?: string;
  agencyId: string;
}

export interface Meal {
  id: string;
  type: string;
  vegOption: boolean;
  nonVegOption: boolean;
  price: number;
  agencyId: string;
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  price: number;
  photos?: any; // Json
  agencyId: string;
}

export interface Quotation {
  id: string;
  clientId?: string;
  agencyId?: string;
  clientName?: string;
  phoneNumber?: number;
  emailAddress?: string;
  status: QuotationStatus;
  destination: any; // Json
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotationItem {
  id: string;
  quotationId: string;
  serviceType: ServiceType;
  serviceId: string;
  description?: string;
  price: number;
}

export interface Itinerary {
  id: string;
  quotationId: string;
  dayNumber: number;
  headline: string;
  description?: string;
  duration?: string;
  notes?: string;
  images?: any; // Json
  createdAt: Date;
  updatedAt: Date;
}

// Enums
export enum Role {
  SUPERADMIN = "SUPERADMIN",
  AGENCYADMIN = "AGENCYADMIN",
  EXECUTIVE = "EXECUTIVE",
}

export enum QuotationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  WON = "WON",
  LOST = "LOST",
}

export enum ServiceType {
  HOTEL = "HOTEL",
  CAR = "CAR",
  MEAL = "MEAL",
  ACTIVITY = "ACTIVITY",
}
