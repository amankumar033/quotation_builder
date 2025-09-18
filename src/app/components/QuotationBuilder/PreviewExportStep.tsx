// components/QuotationBuilder/PreviewExportStep.tsx
import { QuotationData } from '../../quotation-builder/page';

interface PreviewExportStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  prevStep: () => void;
}

export default function PreviewExportStep({ data, prevStep }: PreviewExportStepProps) {
  const handleExport = (format: 'pdf' | 'email' | 'whatsapp') => {
    alert(`Exporting quotation as ${format.toUpperCase()}`);
    // In a real application, this would generate and send the quotation
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Quotation Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Travel Quotation</h1>
          <p className="text-blue-100 text-lg">TravelPro Agency</p>
        </div>

        {/* Quotation Content */}
        <div className="p-8">
          {/* Quote Info */}
          <div className="text-center mb-8">
            <p className="text-gray-700"><span className="font-semibold">Quote #:</span> TQ-2024-001</p>
            <p className="text-gray-700 mt-1"><span className="font-semibold">Date:</span> 9/18/2025</p>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Client Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p><span className="font-medium">Name:</span> Rajesh Kumar</p>
                <p className="mt-2"><span className="font-medium">Phone:</span> +91 98765 43210</p>
              </div>
              <div>
                <p><span className="font-medium">Email:</span> rajesh@example.com</p>
                <p className="mt-2"><span className="font-medium">Destination:</span> Goa</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Trip Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Trip Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p><span className="font-medium">Travel Date:</span> 15 Dec 2024 - 20 Dec 2024</p>
                <p className="mt-2"><span className="font-medium">Duration:</span> 5 Days / 4 Nights</p>
              </div>
              <div>
                <p><span className="font-medium">Travelers:</span> 2 Adults, 1 Child</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Package Inclusions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Package Inclusions</h2>
            
            {/* Hotel */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="The Grand Resort" 
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-lg font-semibold text-gray-800">The Grand Resort (5⭐)</h3>
                  <p className="text-gray-600 mt-1">4 Nights</p>
                  <p className="text-gray-600">Deluxe Room with Breakfast, WiFi, Pool, AC</p>
                  <div className="mt-3 p-3 bg-gray-50 rounded border">
                    <p className="text-gray-800 font-medium text-lg">₹8,500 × 4 nights = ₹34,000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Transportation - SUV</h3>
              <p className="text-gray-600">5 Days</p>
              <p className="text-gray-600">6 passengers capacity</p>
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <p className="text-gray-800 font-medium text-lg">₹3,500 × 5 days = ₹17,500</p>
              </div>
            </div>

            {/* Meals */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Meals</h3>
              <p className="text-gray-600">Included</p>
              <p className="text-gray-600">Breakfast & Dinner for 3 persons</p>
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <p className="text-gray-800 font-medium text-lg">₹2,700</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Cost Breakdown */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cost Breakdown</h2>
            <div className="space-y-3 max-w-md ml-auto">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium">₹45,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Markup (15%):</span>
                <span className="font-medium">₹6,750</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Taxable Amount:</span>
                <span className="font-medium">₹51,750</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">GST (5%):</span>
                <span className="font-medium">₹2,588</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                <span className="text-lg font-semibold text-gray-800">Grand Total:</span>
                <span className="text-lg font-bold text-blue-600">₹54,338</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Terms & Conditions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Terms & Conditions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Advance payment of 50% required at booking</li>
              <li>Balance payment 7 days before departure</li>
              <li>Cancellation charges as per company policy</li>
              <li>Check-in: 2:00 PM, Check-out: 12:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={prevStep}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" clipRule="evenodd" />
                </svg>
                Edit Quotation
              </button>
              
              <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save as Draft
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => handleExport('pdf')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </button>
              
              <button 
                onClick={() => handleExport('email')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}