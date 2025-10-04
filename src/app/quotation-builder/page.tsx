// app/quotation-builder/page.tsx
"use client";

import { useState } from "react";
import DestinationStep from "@/app/components/QuotationBuilder/DestinationSelection";
import LocationSelectionPage from "@/app/components/QuotationBuilder/PackageSelection/LocationSelectionPage";
import ClientInfoStep from "@/app/components/QuotationBuilder/ClientInfoStep";
import PackageSelectionStep from "@/app/components/QuotationBuilder/PackageSelectionStep";
import CustomizationStep from "@/app/components/QuotationBuilder/CustomizationStep";
import PreviewExportStep from "@/app/components/QuotationBuilder/PreviewExportStep";
import { QuotationProvider, useQuotation } from "@/context/QuotationContext";
import { QuotationData } from "@/types/type";

export type Step = "destination" | "location" | "client-info" | "package-selection" | "customization" | "preview-export";

const STEPS: Step[] = [
  "destination",
  "client-info",
  "package-selection",
  "customization",
  "preview-export",
];

function QuotationBuilderContent() {
  const [currentStep, setCurrentStep] = useState<Step>("destination");
  const [quotationData, setQuotationData] = useState<QuotationData>({
    client: {
      name: "",
      phone: "",
      email: "",
      destination: "",
      startDate: "",
      endDate: "",
      adults: 2,
      children: 0,
      infants: 0,
    },
    trip: {
      destination: "",
      startDate: "",
      endDate: "",
      adults: 2,
      children: 0,
      infants: 0,
      duration: 0,
      quoteNumber: `TQ-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    },
    services: [],
    markupPercentage: 15,
    termsConditions: "",
    specialNotes: "",
    agencyLogo: null,
    discountAmount: 0,
    paymentTerms: "Net 30",
    contactInfo: "",
    agencyName: "TravelPro Agency",
    quoteNumber: `TQ-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  });

  const { updateQuotationData } = useQuotation();

  const updateData = (updates: Partial<QuotationData>) => {
    setQuotationData(prev => ({ ...prev, ...updates }));
    updateQuotationData(updates);
  };

  const nextStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "destination":
        return (
          <DestinationStep
            data={quotationData}
            updateData={updateData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
     
      case "client-info":
        return (
          <ClientInfoStep
            data={quotationData}
            updateData={updateData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case "package-selection":
        return (
          <PackageSelectionStep
            data={quotationData}
            updateData={updateData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case "customization":
        return (
          <CustomizationStep
            data={quotationData}
            updateData={updateData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case "preview-export":
        return (
          <PreviewExportStep
            data={quotationData}
            updateData={updateData}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderStep()}
    </div>
  );
}

export default function QuotationBuilderPage() {
  return (
    <QuotationProvider>
      <QuotationBuilderContent />
    </QuotationProvider>
  );
}