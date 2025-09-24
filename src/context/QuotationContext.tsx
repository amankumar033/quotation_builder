"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
}

interface DestinationContextType {
  selectedDestination: Destination | null;
  setSelectedDestination: (destination: Destination | null) => void;
}

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export function DestinationProvider({ children }: { children: ReactNode }) {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  return (
    <DestinationContext.Provider value={{ selectedDestination, setSelectedDestination }}>
      {children}
    </DestinationContext.Provider>
  );
}

export function useDestination() {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error("useDestination must be used within DestinationProvider");
  }
  return context;
}
