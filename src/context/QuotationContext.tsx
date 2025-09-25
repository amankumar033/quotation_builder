"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
}

interface Room {
  id: number;
  type: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  bedType: string;
  amenities: string[];
  description: string;
  photos: string[];
}

interface QuotationContextType {
  selectedDestination: Destination | null;
  setSelectedDestination: (destination: Destination | null) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  openDestination: (destination: Destination) => void;
  closeDestination: () => void;
  professionalRooms: Room[];             // added state
  setProfessionalRooms: (rooms: Room[]) => void;  // setter for rooms
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [show, setShow] = useState(true);

  // State for professionalRooms
  const [professionalRooms, setProfessionalRooms] = useState<Room[]>([
    {
      id: 1,
      type: "Deluxe Room",
      price: 3000,
      maxAdults: 2,
      maxChildren: 2,
      bedType: "King Size Bed",
      amenities: ["Free WiFi", "AC", "TV", "Breakfast", "King Bed"],
      description: "Spacious room with modern amenities and comfortable bedding",
      photos: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=250&fit=crop"]
    },
    {
      id: 2,
      type: "Super Deluxe Room",
      price: 4500,
      maxAdults: 3,
      maxChildren: 2,
      bedType: "Queen Size Bed",
      amenities: ["Free WiFi", "AC", "TV", "Breakfast", "Balcony", "Sea View"],
      description: "Luxurious room with premium features and stunning views",
      photos: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=250&fit=crop"]
    },
    {
      id: 3,
      type: "Suite Room",
      price: 6500,
      maxAdults: 4,
      maxChildren: 3,
      bedType: "King Size + Extra Bed",
      amenities: ["Free WiFi", "AC", "TV", "Breakfast", "Balcony", "Living Room", "Mini Bar"],
      description: "Executive suite with separate living area and premium amenities",
      photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=250&fit=crop"]
    }
  ]);

  const openDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    setShow(true);
  };

  const closeDestination = () => {
    setShow(false);
    setSelectedDestination(null);
  };

  return (
    <QuotationContext.Provider
      value={{
        selectedDestination,
        setSelectedDestination,
        show,
        setShow,
        openDestination,
        closeDestination,
        professionalRooms,
        setProfessionalRooms,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (!context) {
    throw new Error("useQuotation must be used within QuotationProvider");
  }
  return context;
}
