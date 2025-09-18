// components/QuotationBuilder/CustomizationStep.tsx
import { QuotationData } from '../../quotation-builder/page';

interface CustomizationStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function CustomizationStep({ data, updateData, nextStep, prevStep }: CustomizationStepProps) {
  const handleInputChange = (field: string, value: any) => {
    updateData({ [field]: value });
  };

  // Calculate pricing
  const subtotal = data.services.reduce((sum, service) => sum + (service.price * service.quantity), 0);
  const markup = (subtotal * data.markupPercentage) / 100;
  const taxable = subtotal + markup;
  const gst = taxable * 0.05;
  const grandTotal = taxable + gst;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateData({ agencyLogo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-2">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
          </span>
          Customization
        </h3>
        <p className="text-gray-600 mt-1 ml-11">Add your agency branding and customize terms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Agency Logo */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4">Agency Branding</h4>
            <div className="flex items-center">
              <div className="mr-4">
                {data.agencyLogo ? (
                  <img src={data.agencyLogo} alt="Agency Logo" className="w-16 h-16 object-contain border rounded" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Agency Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 200x200px PNG with transparent background</p>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4">Terms & Conditions</h4>
            <textarea
              value={data.termsConditions}
              onChange={(e) => handleInputChange('termsConditions', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={6}
              placeholder="Enter your terms and conditions here..."
            />
          </div>

          {/* Special Notes */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4">Special Notes & Discounts</h4>
            <textarea
              value={data.specialNotes}
              onChange={(e) => handleInputChange('specialNotes', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={3}
              placeholder="Add any special notes, discounts, or offers here..."
            />
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-gradient-to-b from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-5">Pricing Summary</h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Markup</span>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={data.markupPercentage}
                  onChange={(e) => handleInputChange('markupPercentage', parseFloat(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-right"
                />
                <span className="ml-2 text-gray-600">%</span>
                <span className="font-medium ml-2">₹{markup.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxable Amount</span>
              <span className="font-medium">₹{taxable.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST (5%)</span>
              <span className="font-medium">₹{gst.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-4 mt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Grand Total</span>
                <span className="text-blue-700">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition flex items-center"
        >
          Next: Preview & Export
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}