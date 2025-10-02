'use client';

import { useState, useEffect } from 'react';
import DestinationSelectionStep from '../components/QuotationBuilder/DestinationSelection';
import LocationSelectionPage from '../components/QuotationBuilder/PackageSelection/LocationSelectionPage';
import ClientInfoStep from '../components/QuotationBuilder/ClientInfoStep';
import PackageSelectionStep from '../components/QuotationBuilder/PackageSelectionStep';
import CustomizationStep from '../components/QuotationBuilder/CustomizationStep';
import PreviewExportStep from '../components/QuotationBuilder/PreviewExportStep';
import { useQuotation } from '@/context/QuotationContext';

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

export interface ServiceItem {
  id: string;
  name: string;
  type: 'hotel' | 'car' | 'meal' | 'activity';
  price: number;
  quantity: number;
  details: Record<string, any>;
  unit?: string;
}

export interface QuotationData {
  client: ClientInfo;
  trip: TripInfo;
  services: ServiceItem[];
  markupPercentage: number;
  termsConditions: string;
  specialNotes: string;
  agencyLogo: string | null;
  discountAmount?: number;
  paymentTerms?: string;
  contactInfo?: string;
  agencyName?: string;
  quoteNumber?: string;
  selectedHotel?: string | null;
  selectedVehicle?: string | null;
  selectedMealIds?: string[];
  selectedActivityIds?: string[];
}

// Storage keys
const STORAGE_KEYS = {
  ACTIVE_STEP: 'quotation_active_step',
  COMPLETED_STEP: 'quotation_completed_step',
  QUOTATION_DATA: 'quotation_data'
};

export default function QuotationBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedStep, setCompletedStep] = useState(0);
  const { selectedDestination, selectedLocation } = useQuotation();

  const [quotationData, setQuotationData] = useState<QuotationData>({
    client: {
      name: '',
      phone: '',
      email: '',
    },
    trip: {
      destination: '',
      startDate: '',
      endDate: '',
      adults: 1,
      children: 0,
      infants: 0,
    },
    services: [],
    markupPercentage: 15,
    termsConditions: '• 50% advance payment required at the time of booking\n• Cancellation 15 days prior: 90% refund\n• Cancellation 7 days prior: 50% refund\n• No refund for cancellation within 48 hours',
    specialNotes: '',
    agencyLogo: null,
  });

  // Load saved state on component mount
  useEffect(() => {
    const savedActiveStep = localStorage.getItem(STORAGE_KEYS.ACTIVE_STEP);
    const savedCompletedStep = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEP);
    const savedQuotationData = localStorage.getItem(STORAGE_KEYS.QUOTATION_DATA);

    if (savedActiveStep) {
      setActiveStep(Number(savedActiveStep));
    }
    
    if (savedCompletedStep) {
      setCompletedStep(Number(savedCompletedStep));
    }
    
    if (savedQuotationData) {
      try {
        const parsedData = JSON.parse(savedQuotationData);
        setQuotationData(parsedData);
      } catch (error) {
        console.error('Error parsing saved quotation data:', error);
        localStorage.removeItem(STORAGE_KEYS.QUOTATION_DATA);
      }
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STEP, activeStep.toString());
  }, [activeStep]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_STEP, completedStep.toString());
  }, [completedStep]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUOTATION_DATA, JSON.stringify(quotationData));
  }, [quotationData]);

  const nextStep = () => {
    setActiveStep(prev => prev + 1);
    setCompletedStep(prev => Math.max(prev, prev + 1));
  };

  const prevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const updateQuotationData = (newData: Partial<QuotationData>) => {
    setQuotationData(prev => ({ ...prev, ...newData }));
  };

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_STEP);
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_STEP);
    localStorage.removeItem(STORAGE_KEYS.QUOTATION_DATA);
  };

  // Update trip destination when we have both destination and location
  useEffect(() => {
    if (selectedDestination && selectedLocation && activeStep >= 2) {
      updateQuotationData({
        trip: {
          ...quotationData.trip,
          destination: `${selectedLocation}, ${selectedDestination.name}`
        }
      });
    }
  }, [selectedDestination, selectedLocation, activeStep]);

  // Step 0: Destination Selection (full page)
  if (activeStep === 0) {
    return <DestinationSelectionStep nextStep={nextStep} />;
  }

  // Step 1: Location Selection (full page)
  if (activeStep === 1) {
    return <LocationSelectionPage nextStep={nextStep} prevStep={prevStep} />;
  }

  return (
    <div className="rounded-xl shadow-lg border border-gray-100 pb-6">
      <div className='p-6 mt-1'>
        <div className="mb-3">
          <h2
            className={`text-4xl font-bold ${
              activeStep === 2 ? 'text-green-600' :
              activeStep === 3 ? 'text-blue-600' :
              activeStep === 4 ? 'text-yellow-600' :
              activeStep === 5 ? 'text-red-600' :
              'text-gray-700'
            }`}
          >
            {activeStep === 2 ? '1. Client Information' :
             activeStep === 3 ? '2. Package Selection' :
             activeStep === 4 ? '3. Customization' :
             activeStep === 5 ? '4. Preview & Export' :
             ''}
          </h2>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mt-1 px-15 flex gap-7 shadow-md mb-7 items-center pb-6">
        {/* Step 1 - Client Info */}
        <div className="flex items-center gap-3 font-medium text-gray-600">
          <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {completedStep >= 2 ? '✓' : '1'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Step 1</span>
            <span className="text-sm">Client Information</span>
          </div>
        </div>

        {/* Line */}
        <div className={`flex-1 h-[2px] w-5 ${completedStep >= 2 ? 'bg-green-500' : 'bg-gray-200'}`} />

        {/* Step 2 - Package Selection */}
        <div className="flex items-center gap-3 font-medium text-gray-600">
          <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {completedStep >= 3 ? '✓' : '2'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Step 2</span>
            <span className="text-sm">Package Selection</span>
          </div>
        </div>
        
        {/* Line */}
        <div className={`flex-1 h-[2px] mx-2 ${completedStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`} />

        {/* Step 3 - Customization */}
        <div className="flex items-center gap-3 font-medium text-gray-600">
          <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {completedStep >= 4 ? '✓' : '3'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Step 3</span>
            <span className="text-sm">Customization</span>
          </div>
        </div>

        {/* Line */}
        <div className={`flex-1 h-[2px] mx-2 ${completedStep >= 4 ? 'bg-yellow-500' : 'bg-gray-200'}`} />

        {/* Step 4 - Preview & Export */}
        <div className="flex items-center gap-3 font-medium text-gray-600">
          <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {completedStep >= 5 ? '✓' : '4'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Step 4</span>
            <span className="text-sm">Preview & Export</span>
          </div>
        </div>
      </div>

      {/* Render current step */}
      {activeStep === 2 && (
        <ClientInfoStep 
          data={quotationData}
          updateData={updateQuotationData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      
      {activeStep === 3 && (
        <PackageSelectionStep 
          data={quotationData}
          updateData={updateQuotationData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      
      {activeStep === 4 && (
        <CustomizationStep 
          data={quotationData}
          updateData={updateQuotationData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      
      {activeStep === 5 && (
        <PreviewExportStep 
          data={quotationData}
          updateData={updateQuotationData}
          prevStep={prevStep}
          clearStorage={clearStorage}
        />
      )}
    </div>
  );
}