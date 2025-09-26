// components/QuotationBuilder/ClientInfoStep.tsx
import { QuotationData } from '../../quotation-builder/page';
import { MapPinned, Users, ArrowLeft } from 'lucide-react';
import { Calendar } from 'lucide-react';
import CustomDatePicker from '../ui/CustomDatePicker';
import { useQuotation } from "@/context/QuotationContext";

interface ClientInfoStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function ClientInfoStep({ data, updateData, nextStep, prevStep }: ClientInfoStepProps) {
  const { 
    selectedDestination,
    clientName, setClientName,
    phoneNumber, setPhoneNumber,
    emailAddress, setEmailAddress,
    startDate, setStartDate,
    endDate, setEndDate,
    travelers, setAdults, setChildren, setInfants
  } = useQuotation();        

  function print() {
  console.log("Hello World",clientName,phoneNumber,emailAddress,startDate,endDate,travelers,);
}

  
  // Validation functions
  const validateName = (name: string): boolean => {
    return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  const validatePhone = (phone: string): boolean => {
    return /^\d{10}$/.test(phone.replace(/\s/g, ''));
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNameChange = (value: string) => {
    // Only allow letters and spaces
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
    setClientName(filteredValue);
    updateData({
      client: {
        ...data.client,
        name: filteredValue
      }
    });
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers and limit to 10 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(numericValue);
    updateData({
      client: {
        ...data.client,
        phone: numericValue
      }
    });
  };

  const handleEmailChange = (value: string) => {
    setEmailAddress(value);
    updateData({
      client: {
        ...data.client,
        email: value
      }
    });
  };

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // "2025-09-27"
};

const handleStartDateChange = (date: Date | null) => {
  const dateString = date ? formatDate(date) : "";
  setStartDate(dateString);
  updateData({
    client: {
      ...data.client,
      startDate: dateString,
    },
  });
};

const handleEndDateChange = (date: Date | null) => {
  const dateString = date ? formatDate(date) : "";
  setEndDate(dateString);
  updateData({
    client: {
      ...data.client,
      endDate: dateString,
    },
  });
};


  const handleAdultsChange = (count: number) => {
    setAdults(count);
    updateData({
      client: {
        ...data.client,
        adults: count
      }
    });
  };

  const handleChildrenChange = (count: number) => {
    setChildren(count);
    updateData({
      client: {
        ...data.client,
        children: count
      }
    });
  };

  const handleInfantsChange = (count: number) => {
    setInfants(count);
    updateData({
      client: {
        ...data.client,
        infants: count
      }
    });
  };

  // Get validation states
  const isNameValid = validateName(clientName);
  const isPhoneValid = validatePhone(phoneNumber);
  const isEmailValid = validateEmail(emailAddress);
  const areDatesValid = startDate && endDate;

  const isFormValid = isNameValid && isPhoneValid && isEmailValid && areDatesValid;

  const cardClass = "bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200";

  return (
    <div className="space-y-6 bg-gray-50 px-15">
      <div className='flex gap-10 justify-between'>
        {/* Client Information Section */}
        <section className={`${cardClass} w-full md:w-1/2`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-500 text-white p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
            Client Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter client's full name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${
                  clientName && !isNameValid ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {clientName && !isNameValid && (
                <p className="text-red-500 text-xs mt-1">Name must be at least 2 letters (no numbers)</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="9876543210"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${
                  phoneNumber && !isPhoneValid ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {phoneNumber && !isPhoneValid && (
                <p className="text-red-500 text-xs mt-1">Phone must be exactly 10 digits</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="client@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${
                  emailAddress && !isEmailValid ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {emailAddress && !isEmailValid && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>
        </section>

        {/* Trip Details Section */}
        <section className={`${cardClass} w-full md:w-1/2`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="shadow-lg bg-green-400 text-white p-2 rounded-lg mr-3">
              <MapPinned className="h-5 w-5" />
            </span>
            Trip Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className='relative'>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <CustomDatePicker
                selectedDate={startDate ? new Date(startDate) : null}
                onChange={handleStartDateChange}
                placeholder="dd/MM/yyyy"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <CustomDatePicker
                selectedDate={endDate ? new Date(endDate) : null}
                onChange={handleEndDateChange}
                placeholder="dd/MM/yyyy"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Trip Destination *</label>
              <input
                type="text"
                value={selectedDestination?.name || "Maldives"}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Number of Travelers Section */}
      <section className={cardClass}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="bg-yellow-500 text-white p-2 rounded-lg mr-3">
            <Users className="h-5 w-5" />
          </span>
          Number of Travelers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adults (12+ years)</label>
            <input
              type="number"
              value={travelers.adults}
              min={1}
              onChange={(e) => handleAdultsChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Children (5-11 years)</label>
            <input
              type="number"
              value={travelers.children}
              min={0}
              onChange={(e) => handleChildrenChange(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Infants (0-4 years)</label>
            <input
              type="number"
              value={travelers.infants}
              min={0}
              onChange={(e) => handleInfantsChange(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            />
          </div>
        </div>
      </section>

      <div className='flex justify-between'>
        {/* PREV Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              prevStep();
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition flex items-center"
          >
            <ArrowLeft size={22} className='mr-3'/>
            Back
          </button>
        </div>
        
        {/* Next Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              print();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              nextStep();
            }}
            disabled={!isFormValid}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Package Selection
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}