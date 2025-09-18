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

  const isFormValid = data.client.name && data.client.phone && data.client.email;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-green-200 p-5 rounded-xl mb-10">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="bg-green-500 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </span>
          Client Information
        </h3>
        <p className="text-gray-600 mt-1 ml-11">Enter your client's contact details</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
          <input
            type="text"
            value={data.client.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter client name"
            required
          />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={data.client.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={data.client.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter email address"
            required
          />
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button
          onClick={nextStep}
          disabled={!isFormValid}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Package Selection
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}