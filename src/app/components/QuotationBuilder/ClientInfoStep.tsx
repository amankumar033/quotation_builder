// components/QuotationBuilder/ClientInfoStep.tsx
import { QuotationData } from '../../quotation-builder/page';

interface ClientInfoStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
}

export default function ClientInfoStep({ data, updateData, nextStep }: ClientInfoStepProps) {
  const handleInputChange = (field: string, value: any) => {
    updateData({
      client: {
        ...data.client,
        [field]: value
      }
    });
  };

  const isFormValid = 
    data.client.name && 
    data.client.phone && 
    data.client.email && 
    data.client.destination && 
    data.client.startDate && 
    data.client.endDate;

  const cardClass = "bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200";

  return (
    <div className="space-y-6 bg-gray-50 px-15 pt-7">
<div className='flex gap-10  mt-10 justify-between
'>
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
              value={data.client.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter client's full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              value={data.client.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={data.client.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="client@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
        </div>
      </section>

      {/* Trip Details Section */}
      <section className={`${cardClass} w-full md:w-1/2`}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className=" shadow-lg bg-green-400 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </span>
          Trip Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input
              type="date"
              value={data.client.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
            <input
              type="date"
              value={data.client.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Destination *</label>
            <input
              type="text"
              value={data.client.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="e.g., Goa, Kerala, Rajasthan"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
            />
          </div>
        </div>
      </section>
</div>
      {/* Number of Travelers Section */}
      <section className={cardClass}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="bg-yellow-500 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </span>
          Number of Travelers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adults (12+ years)</label>
            <input
              type="number"
              value={data.client.adults ?? 2}
              min={0}
              onChange={(e) => handleInputChange('adults', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Children (5-11 years)</label>
            <input
              type="number"
              value={data.client.children ?? 0}
              min={0}
              onChange={(e) => handleInputChange('children', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Infants (0-4 years)</label>
            <input
              type="number"
              value={data.client.infants ?? 0}
              min={0}
              onChange={(e) => handleInputChange('infants', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
            />
          </div>
        </div>
      </section>

      {/* Next Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={nextStep}
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
  );
}
