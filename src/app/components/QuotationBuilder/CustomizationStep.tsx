// components/QuotationBuilder/CustomizationStep.tsx
import { QuotationData } from '../../quotation-builder/page';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
   

        {/* Agency Branding */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Agency Branding</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Agency Logo</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  {data.agencyLogo ? (
                    <img src={data.agencyLogo} alt="Agency Logo" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">Click to upload your logo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Recommended: 200x200px PNG with transparent background</p>
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
                <input
                  type="text"
                  value={data.agencyName || ''}
                  onChange={(e) => handleInputChange('agencyName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter agency name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                <textarea
                  value={data.contactInfo || ''}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows={3}
                  placeholder="Address, phone, email, etc."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Terms & Conditions</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
            <select
              value={data.paymentTerms || ''}
              onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Select payment terms</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Due on receipt">Due on receipt</option>
              <option value="50% advance, 50% on completion">50% advance, 50% on completion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
            <textarea
              value={data.termsConditions}
              onChange={(e) => handleInputChange('termsConditions', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={6}
              placeholder="Enter your terms and conditions here..."
            />
            <p className="text-xs text-gray-500 mt-2">Include cancellation policies, liability clauses, and other important terms.</p>
          </div>
        </div>
{/* Special Notes & Discounts */}
<section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
  <div className="flex items-center mb-6">
    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    </div>
    <h2 className="text-xl font-semibold text-gray-800">Special Notes & Discounts</h2>
  </div>

  {/* Special Notes */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
    <textarea
      value={data.specialNotes}
      onChange={(e) => handleInputChange('specialNotes', e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      rows={4}
      placeholder="Add any special notes, discounts, or offers here..."
    />
  </div>

  {/* Discount Section */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    {/* Discount Input */}
    <div className="flex items-center w-full md:w-[45%]">
      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">₹</span>
      <input
        type="number"
        min="0"
        value={data.discountAmount || 0}
        onChange={(e) => handleInputChange('discountAmount', parseFloat(e.target.value))}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="0.00"
      />
    </div>

    {/* Quick Add Discounts */}
    <div className="flex items-center gap-3">
      <span className="font-medium text-gray-700">Quick Add:</span>
      {[5, 10, 15, 20].map((d) => (
        <button
          key={d}
          type="button"
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
          onClick={() => {
            const discountValue = (subtotal + markup + gst) * (d / 100);
            handleInputChange('discountAmount', discountValue);
          }}
        >
          {d}%
        </button>
      ))}

      {/* Clear Button */}
      <button
        type="button"
        className="px-3 py-1 ml-4 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
        onClick={() => handleInputChange('discountAmount', 0)}
      >
        Clear
      </button>
    </div>
  </div>
</section>

{/* Pricing Summary */}
<section className="bg-white rounded-xl shadow-sm p-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing Summary</h2>
  <div className=" rounded-lg divide-y divide-gray-200">
    <div className="flex justify-between px-4 py-2">
      <span>Subtotal</span>
      <span>₹{subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between px-4 py-2 bg-gray-50">
      <span>Markup ({data.markupPercentage}%)</span>
      <span>₹{markup.toFixed(2)}</span>
    </div>
    <div className="flex justify-between px-4 py-2">
      <span>Taxable Amount</span>
      <span>₹{taxable.toFixed(2)}</span>
    </div>
    <div className="flex justify-between px-4 py-2 bg-gray-50">
      <span>GST (5%)</span>
      <span>₹{gst.toFixed(2)}</span>
    </div>
    
      <div className="flex justify-between px-4 py-2 text-green-700 font-medium">
        <span>Discount</span>
        <span>-₹{data.discountAmount?.toFixed(2) || 0}</span>
      </div>
    
    <div className="flex justify-between px-4 py-3 font-bold text-blue-700 bg-gray-100 text-lg">
      <span>Grand Total</span>
      <span>₹{(grandTotal - (data.discountAmount || 0)).toFixed(2)}</span>
    </div>
  </div>
</section>


         {/* Navigation */}
      <div className="flex mt-10 justify-between pt-6 bg-white rounded-xl p-6 w-full shadow-sm border border-gray-100">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          ← Back
        </button>
       
        <button
          onClick={nextStep}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          Continue to Review →
        </button>
      </div>
      </div>
    </div>
  );
}