"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
}

interface QuotationContextType {
  selectedDestination: Destination | null;
  setSelectedDestination: (destination: Destination | null) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  openDestination: (destination: Destination) => void;
  closeDestination: () => void;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [show, setShow] = useState(true);

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
