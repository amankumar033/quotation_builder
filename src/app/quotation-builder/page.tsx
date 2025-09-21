// components/QuotationBuilder/QuotationBuilder.tsx
'use client';

import { useState } from 'react';
import ClientInfoStep from '../components/QuotationBuilder/ClientInfoStep';
import PackageSelectionStep from '../components/QuotationBuilder/PackageSelectionStep';
import CustomizationStep from '../components/QuotationBuilder/CustomizationStep';
import PreviewExportStep from '../components/QuotationBuilder/PreviewExportStep';

export interface ClientInfo {
  name: string;
  phone: string;
  email: string;
  destination?: string;   // New field
  startDate?: string;     // New field
  endDate?: string;       // New field
  adults?: number;        // New field
  children?: number;      // New field
  infants?: number;       // New field
}

export interface TripInfo {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  duration?: number; // in days
  quoteNumber?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  type: 'hotel' | 'car' | 'meal' | 'activity';
  price: number;
  quantity: number;
  details: Record<string, any>;
  unit?: string; // e.g., "Nights", "Days", "Persons"
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
  selectedHotel?: string | null;       // store the 'id' of the selected hotel
  selectedVehicle?: string | null;     // store the 'id' of the selected transport
  selectedMealIds?: string[];          // array of selected meal 'id's
  selectedActivityIds?: string[]; 
}

export default function QuotationBuilder() {
  const [activeStep, setActiveStep] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);
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

  const nextStep = () => {
    setActiveStep(prev => prev + 1);
    setCompletedStep(prev => prev + 1);
  };
  const prevStep = () => {
    setActiveStep(prev => prev - 1);
    setCompletedStep(prev => prev - 1);
  };

  const updateQuotationData = (newData: Partial<QuotationData>) => {
    setQuotationData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className=" rounded-xl shadow-lg  border border-gray-100 pb-6">


<div className='p-6 mt-1'>
        <div className="mb-3   ">
        <h2
  className={`text-4xl font-bold ${
    activeStep === 1 ? 'text-green-600' :
    activeStep === 2 ? 'text-blue-600' :
    activeStep === 3 ? 'text-yellow-600' :
    activeStep === 4 ? 'text-red-600' :
    'text-gray-700'
  }`}
>
  {activeStep === 1 ? '1. Basic Information' :
   activeStep === 2 ? '2. Package Selection' :
   activeStep === 3 ? '3. Customization' :
   activeStep === 4 ? '4. Preview & Export' :
   ''}
</h2>


        </div>
    
</div>
{/* Step Indicator */}
<div className=" mt-1 px-15 flex gap-7 shadow-md mb-7 items-center pb-6">
  {/* Step 1 */}
  <div className="flex items-center gap-3 font-medium text-gray-600">
    <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
      <span className="text-white text-xl font-bold">
        {completedStep >= 1 ? '✓' : '1'}
      </span>
    </div>
    <div className="flex flex-col">
      <span className="font-bold">Step 1</span>
      <span className="text-sm">Basic Information</span>
    </div>
  </div>

  {/* Line */}
  <div className={`flex-1 h-[2px] w-5 ${completedStep >= 1 ? 'bg-green-500' : 'bg-gray-200'}`} />

  {/* Step 2 */}
  <div className="flex items-center gap-3 font-medium text-gray-600">
    <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
      <span className="text-white text-xl font-bold">
        {completedStep >= 2 ? '✓' : '2'}
      </span>
    </div>
    <div className="flex flex-col">
      <span className="font-bold">Step 2</span>
      <span className="text-sm">Package Selection</span>
    </div>
  </div>
  {/* Line */}
  <div className={`flex-1 h-[2px] mx-2 ${completedStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />

  {/* Step 3 */}
  <div className="flex items-center gap-3 font-medium text-gray-600">
    <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center">
      <span className="text-white text-xl font-bold">
        {completedStep >= 3 ? '✓' : '3'}
      </span>
    </div>
    <div className="flex flex-col">
      <span className="font-bold">Step 3</span>
      <span className="text-sm">Customization</span>
    </div>
  </div>

  {/* Line */}
  <div className={`flex-1 h-[2px] mx-2 ${completedStep >= 3 ? 'bg-yellow-500' : 'bg-gray-200'}`} />

  {/* Step 4 */}
  <div className="flex items-center gap-3 font-medium text-gray-600">
    <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
      <span className="text-white text-xl font-bold">
        {completedStep >= 4 ? '✓' : '4'}
      </span>
    </div>
    <div className="flex flex-col">
      <span className="font-bold">Step 4</span>
      <span className="text-sm">Preview & Export</span>
    </div>
  </div>
</div>


      {/* Render current step */}
      {activeStep === 1 && (
        <ClientInfoStep 
          data={quotationData}
          updateData={updateQuotationData}
          nextStep={nextStep}
        />
      )}
      
      {activeStep === 2 && (
        <PackageSelectionStep 
          data={quotationData}
          updateData={updateQuotationData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      
      {activeStep === 3 && (
        <CustomizationStep 
          data={quotationData}
          updateData={updateQuotationData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      
      {activeStep === 4 && (
        <PreviewExportStep 
          data={quotationData}
          updateData={updateQuotationData}
          prevStep={prevStep}
        />
      )}
    </div>
  );
}