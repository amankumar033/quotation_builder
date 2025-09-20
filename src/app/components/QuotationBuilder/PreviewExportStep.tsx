// components/QuotationBuilder/PreviewExportStep.tsx
import { QuotationData } from '../../quotation-builder/page';
import {Download,Mail} from 'lucide-react';
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
  <div className="min-h-screen bg-gray-50 py-6 px-4  sm:px-6 lg:px-8 gap-10">
    <div className='flex gap-10'>
  <div className="w-[80%] bg-white shadow-lg overflow-hidden ">

    {/* Header */}
    <div className="bg-gradient-to-r from-[#0a0f3d] to-[#1a1a5f] px-8 py-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-3xl font-bold mb-1">Travel Quotation</h1>
        <p className="text-blue-100 text-lg">TravelPro Agency</p>
      </div>
      <div className="mt-4 md:mt-0 text-left md:text-right">
        <p><span className="font-semibold">Quote #:</span> TQ-2024-001</p>
        <p className="mt-1"><span className="font-semibold">Date:</span> 9/18/2025</p>
      </div>
    </div>

    {/* Content */}
    <div className="px-8 py-6 space-y-6">

      {/* Client Info */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
        <div className="gap-4 flex justify-between pr-7">
          <div className='flex flex-col gap-4'>
            <p className='text-gray-600'><span className="font-medium text-gray-900 text-[18px]">Name:</span> Rajesh Kumar</p>
            <p className='text-gray-600'><span className="font-medium text-gray-900 text-[18px]">Phone:</span> +91 98765 43210</p>
          </div>
          <div className='flex flex-col gap-4'>
            <p className='text-gray-600'><span className="font-medium text-gray-900 text-[18px]">Email:</span> rajesh@example.com</p>
            <p className='text-gray-600'><span className="font-medium text-gray-900 text-[18px]">Destination:</span> Goa</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300"></div>

      {/* Trip Details */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Details</h2>
        <div className="flex justify-between pr-7">
          <div className="space-y-4">
            <p className='text-gray-600'><span className="font-medium text-gray-900 text-[18px]">Travel Date:</span> 15 Dec 2025 - 20 Dec 2025</p>
            <p className='text-gray-600'><span className="font-medium text-gray-900 text-[18px]">Travelers:</span> 2 Adults, 1 Child</p>
          </div>
          <div className="space-y-2">
            <p className='text-gray-600'><span className="font-medium text-gray-900 text-[18px]">Duration:</span> 5 Days / 4 Nights</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300"></div>

      {/* Package Inclusions */}
      <div className='flex flex-col gap-6'>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Package Inclusions</h2>

        {/* Hotel */}
        <div className="mb-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="md:w-1/3">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="The Grand Resort"
              className="w-full h-36 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3 space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">The Grand Resort (5⭐)</h3>
            <p className="text-gray-700">4 Nights</p>
            <p className="text-gray-700">Deluxe Room with Breakfast, WiFi, Pool, AC</p>
            <div className="mt-2 p-3 bg-gray-50 border-l-4 border-blue-500">
              <p className="font-medium text-gray-900">₹8,500 × 4 nights = ₹34,000</p>
            </div>
          </div>
        </div>

        {/* Transportation */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Transportation - SUV</h3>
          <p className="text-gray-700">5 Days</p>
          <p className="text-gray-700">6 passengers capacity</p>
          <div className="mt-2 p-3 bg-gray-50 border-l-4 border-blue-500">
            <p className="font-medium text-gray-900">₹3,500 × 5 days = ₹17,500</p>
          </div>
        </div>

        {/* Meals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Meals</h3>
          <p className="text-gray-700">Included</p>
          <p className="text-gray-700">Breakfast & Dinner for 3 persons</p>
          <div className="mt-2 p-3 bg-gray-50 border-l-4 border-blue-500">
            <p className="font-medium text-gray-900">₹2,700</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300"></div>

      {/* Cost Breakdown */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-7">Cost Breakdown</h2>
        <div className="space-y-2">
          <div className="flex justify-between py-2 px-4 bg-gray-50 border-l-4 border-blue-500 rounded">
            <span className="text-gray-900">Subtotal:</span>
            <span className="font-medium text-gray-900">₹45,000</span>
          </div>
          <div className="flex justify-between py-2 px-4 rounded">
            <span className="text-gray-900">Markup (15%):</span>
            <span className="font-medium text-gray-900">₹6,750</span>
          </div>
          <div className="flex justify-between py-2 px-4 bg-gray-50 border-l-4 border-blue-500 rounded">
            <span className="text-gray-900">Taxable Amount:</span>
            <span className="font-medium text-gray-900">₹51,750</span>
          </div>
          <div className="flex justify-between py-2 px-4 rounded">
            <span className="text-gray-900">GST (5%):</span>
            <span className="font-medium text-gray-900">₹2,588</span>
          </div>
          <div className="flex justify-between py-2 px-4 bg-gray-50 border-l-4 border-blue-500 rounded">
            <span className="text-gray-900">Discount (5%):</span>
            <span className="font-medium text-gray-900">₹2,588</span>
          </div>
          <div className="flex justify-between py-3 px-4 mt-2">
            <span className="text-lg font-semibold text-gray-900">Grand Total:</span>
            <span className="text-lg font-bold text-blue-600">₹54,338</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300"></div>

      {/* Terms */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Terms & Conditions</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Advance payment of 50% required at booking</li>
          <li>Balance payment 7 days before departure</li>
          <li>Cancellation charges as per company policy</li>
          <li>Check-in: 2:00 PM, Check-out: 12:00 PM</li>
        </ul>
      </div>
    </div>
  </div>
   {/* Right Column: Export & Quick Actions */}
    <div className="md:w-1/3 flex flex-col gap-4">
      
      {/* Export Options */}
      <div className="bg-white p-6 shadow  space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Export Options</h2>
        <button
          onClick={() => handleExport('pdf')}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
        >
          <Download className="inline-block mr-2 pb-1" size={22} />
          Download PDF
        </button>
        <button
          onClick={() => handleExport('email')}
          className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition"
        >
          <Mail className="inline-block mr-2 pb-1" size={22} />
          Send via Email
        </button>
        <button
          onClick={() => handleExport('whatsapp')}
          className="w-full px-4 py-3 bg-gradient-to-r flex gap-2 justify-center from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition"
        >
          <img src="whatsapp.png" alt="WhatsApp" className='h-5 w-5' />
          Share on WhatsApp
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 shadow  space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <button className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition">Full Screen Preview</button>
        <button className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition">Edit Quotation</button>
        <button className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition">Save as Draft</button>
        <button className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition">Duplicate Quotation</button>
      </div>

      

    </div>
    </div>
        {/* Navigation */}
      <div className="flex justify-between pt-6 mt-10 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← Back
        </button>
        
        <button
         
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          Finish →
        </button>
      </div>
  </div>


  );
}