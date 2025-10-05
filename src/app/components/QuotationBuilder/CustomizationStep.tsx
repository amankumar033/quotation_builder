// components/QuotationBuilder/CustomizationStep.tsx
import { QuotationData } from '../../quotation-builder/page';
import { useState, useEffect } from 'react';
import { useAgencySettings } from '@/context/AgencySettingsContext';
import { useQuotation } from '@/context/QuotationContext';

interface CustomizationStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function CustomizationStep({ data, updateData, nextStep, prevStep }: CustomizationStepProps) {
  const { agencySettings } = useAgencySettings();
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [isEditingGrandTotal, setIsEditingGrandTotal] = useState(false);
  const { totalPackagePrice, exportQuotationData, quotationData, updateQuotationData, finalGrandTotal, setFinalGrandTotal } = useQuotation();
  const [tempPricing, setTempPricing] = useState({
    markupPercentage: 0,
    gstPercentage: 0,
    discountAmount: 0
  });
  const [tempGrandTotal, setTempGrandTotal] = useState(0);

  // Safe access to agency settings with fallbacks
  const safeAgencySettings = {
    pricing: agencySettings?.pricing || {
      subtotal: 1000,
      markupPercentage: 20,
      gstPercentage: 5,
      discountAmount: 0
    },
    paymentTerms: agencySettings?.paymentTerms || 'Net 30',
    termsConditions: agencySettings?.termsConditions || `• Payment due within 30 days of invoice date
• 50% advance required for project commencement
• Late payments subject to 1.5% monthly interest`
  };

  // Initialize with context data
  useEffect(() => {
    updateData({
      ...quotationData,
      markupPercentage: quotationData.markupPercentage || safeAgencySettings.pricing.markupPercentage,
      discountAmount: quotationData.discountAmount || 0,
      paymentTerms: quotationData.paymentTerms || safeAgencySettings.paymentTerms,
      termsConditions: quotationData.termsConditions || safeAgencySettings.termsConditions
    });
  }, []);

  const handleInputChange = (field: string, value: any) => {
    const updatedData = { [field]: value };
    updateData(updatedData);
    updateQuotationData(updatedData);
  };

  const startEditingPricing = () => {
    setTempPricing({
      markupPercentage: data.markupPercentage || safeAgencySettings.pricing.markupPercentage,
      gstPercentage: safeAgencySettings.pricing.gstPercentage,
      discountAmount: data.discountAmount || 0
    });
    setIsEditingPricing(true);
  };

  const savePricing = () => {
    const updates = {
      markupPercentage: parseFloat(tempPricing.markupPercentage.toFixed(2)), // Limit to 2 decimal places
      discountAmount: parseFloat(tempPricing.discountAmount.toFixed(2)) // Limit to 2 decimal places
    };
    updateData(updates);
    updateQuotationData(updates);
    setIsEditingPricing(false);
  };

  const cancelEditingPricing = () => {
    setIsEditingPricing(false);
  };

  const startEditingGrandTotal = () => {
    const currentTotals = calculateTotals();
    setTempGrandTotal(Math.round(currentTotals.grandTotal)); // Round to whole number
    setIsEditingGrandTotal(true);
  };

  const saveGrandTotal = () => {
    const currentTotals = calculateTotals();
    const subtotal = currentTotals.subtotal;
    const gstPercentage = safeAgencySettings.pricing.gstPercentage;
    const discountAmount = data.discountAmount || 0;
    
    // Calculate required markup to achieve the desired grand total
    const requiredTaxable = (tempGrandTotal + discountAmount) / (1 + gstPercentage / 100);
    const requiredMarkup = requiredTaxable - subtotal;
    const requiredMarkupPercentage = subtotal > 0 ? (requiredMarkup / subtotal) * 100 : 0;

    const updates = {
      markupPercentage: parseFloat(Math.max(0, requiredMarkupPercentage).toFixed(2)) // Limit to 2 decimal places
    };
    updateData(updates);
    updateQuotationData(updates);
    
    // Store the final grand total in context
    setFinalGrandTotal(tempGrandTotal);
    
    setIsEditingGrandTotal(false);
  };

  const cancelEditingGrandTotal = () => {
    setIsEditingGrandTotal(false);
  };

  // Helper function to recalc pricing live with safe defaults
  const calculateTotals = () => {
    const subtotal = totalPackagePrice;
    const markupPercentage = data.markupPercentage || safeAgencySettings.pricing.markupPercentage;
    const markup = (subtotal * markupPercentage) / 100;
    const taxable = subtotal + markup;
    const gstPercentage = safeAgencySettings.pricing.gstPercentage;
    const gst = (taxable * gstPercentage) / 100;
    const discountAmount = data.discountAmount || 0;
    const grandTotal = taxable + gst - discountAmount;
    
    return { 
      subtotal, 
      markup, 
      taxable, 
      gst, 
      grandTotal: Math.round(grandTotal), // Round to whole number
      markupPercentage: parseFloat(markupPercentage.toFixed(2)), // Limit to 2 decimal places
      gstPercentage: parseFloat(gstPercentage.toFixed(2)), // Limit to 2 decimal places
      discountAmount: parseFloat(discountAmount.toFixed(2)) // Limit to 2 decimal places
    };
  };

  const { subtotal, markup, taxable, gst, grandTotal, markupPercentage, gstPercentage, discountAmount } = calculateTotals();

  // Calculate the difference when editing grand total
  const grandTotalDifference = tempGrandTotal - grandTotal;
  const adjustedMarkupPercentage = subtotal > 0 ? ((tempGrandTotal + discountAmount) / (1 + gstPercentage / 100) - subtotal) / subtotal * 100 : 0;

  const handleContinue = () => {
    // Set the final grand total in context with the current calculated grand total
    setFinalGrandTotal(grandTotal);
    
    // Export and log all quotation data
    exportQuotationData();
    
    // Scroll to top and proceed
    window.scrollTo({ top: 0, behavior: 'smooth' });
    nextStep();
  };

  // Format number for display (remove decimals for whole numbers, limit to 2 for others)
  const formatNumber = (num: number, isCurrency: boolean = false): string => {
    if (isCurrency) {
      // For currency values, round to whole number and format
      return `₹${Math.round(num).toLocaleString()}`;
    } else {
      // For percentages and other numbers, limit to 2 decimal places
      return num % 1 === 0 ? num.toString() : num.toFixed(2);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Terms & Conditions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Terms & Conditions</h2>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
            <select
              value={data.paymentTerms || safeAgencySettings.paymentTerms}
              onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="Net 15">Net 15</option>
              <option value="Net 30">Net 30</option>
              <option value="Due on receipt">Due on receipt</option>
              <option value="50% advance, 50% on completion">50% advance, 50% on completion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
            <textarea
              value={data.termsConditions || safeAgencySettings.termsConditions}
              onChange={(e) => handleInputChange('termsConditions', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={6}
              placeholder="Enter your terms and conditions here..."
            />
            <p className="text-xs text-gray-500 mt-2">Include cancellation policies, liability clauses, and other important terms.</p>
          </div>
        </div>

        {/* Special Notes */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Special Notes</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
            <textarea
              value={data.specialNotes || ''}
              onChange={(e) => handleInputChange('specialNotes', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={4}
              placeholder="Add any special notes, offers, or additional information here..."
            />
          </div>
        </section>

        {/* Pricing Summary */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Pricing Summary</h2>
            <button
              onClick={startEditingPricing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Pricing</span>
            </button>
          </div>
          
          {!isEditingPricing && (
            <div className="rounded-lg divide-y divide-gray-200 border border-gray-200">
              {/* Subtotal */}
              <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-50">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-medium">{formatNumber(subtotal, true)}</span>
              </div>

              {/* Markup */}
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100">
                <span className="text-gray-700">Markup</span>
                <span className="font-medium text-blue-600">{formatNumber(markupPercentage)}% ({formatNumber(markup, true)})</span>
              </div>

              {/* Taxable Amount */}
              <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-50">
                <span className="text-gray-700">Taxable Amount</span>
                <span className="font-medium">{formatNumber(taxable, true)}</span>
              </div>

              {/* GST */}
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100">
                <span className="text-gray-700">GST</span>
                <span className="font-medium">{formatNumber(gstPercentage)}% ({formatNumber(gst, true)})</span>
              </div>

              {/* Discount */}
              <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-50">
                <span className="text-gray-700">Discount</span>
                <span className="font-medium text-green-600">-{formatNumber(discountAmount, true)}</span>
              </div>

              {/* Grand Total */}
              <div className="flex justify-between items-center px-4 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-blue-800">Grand Total</span>
                  {!isEditingGrandTotal && (
                    <button
                      onClick={startEditingGrandTotal}
                      className="p-1 rounded-full hover:bg-blue-200 transition"
                      title="Edit Grand Total"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                </div>
                <span className="text-xl font-bold text-blue-800">{formatNumber(grandTotal, true)}</span>
              </div>
            </div>
          )}
         
          {/* Pricing Edit Inline */}
          {isEditingPricing && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Edit Pricing Parameters</h3>
              
              <div className="space-y-4">
                {/* Markup Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Markup Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={tempPricing.markupPercentage}
                    onChange={(e) => setTempPricing(prev => ({
                      ...prev,
                      markupPercentage: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 2 decimal places</p>
                </div>

                {/* GST Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={tempPricing.gstPercentage}
                    onChange={(e) => setTempPricing(prev => ({
                      ...prev,
                      gstPercentage: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 2 decimal places</p>
                </div>

                {/* Discount Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={tempPricing.discountAmount}
                    onChange={(e) => setTempPricing(prev => ({
                      ...prev,
                      discountAmount: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 2 decimal places</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={savePricing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Save Changes
                </button>
                <button 
                  onClick={cancelEditingPricing}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Grand Total Edit Inline */}
          {isEditingGrandTotal && (
            <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Adjust Grand Total</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    New Grand Total (₹)
                  </label>
                  <input
                    type="number"
                    value={tempGrandTotal}
                    onChange={(e) => setTempGrandTotal(Math.round(parseFloat(e.target.value) || 0))} // Round to whole number
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="1"
                  />
                  <p className="text-xs text-blue-600 mt-1">Whole numbers only (no decimals)</p>
                </div>

                {/* Adjustment Preview */}
                <div className="p-3 bg-white rounded border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Current Grand Total:</span>
                    <span className="font-medium">{formatNumber(grandTotal, true)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600">Difference:</span>
                    <span className={`font-medium ${grandTotalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {grandTotalDifference >= 0 ? '+' : ''}{formatNumber(grandTotalDifference, true)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600">Adjusted Markup:</span>
                    <span className={`font-medium ${adjustedMarkupPercentage >= markupPercentage ? 'text-green-600' : 'text-red-600'}`}>
                      {formatNumber(adjustedMarkupPercentage)}% {adjustedMarkupPercentage >= markupPercentage ? '(↑)' : '(↓)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button 
                  onClick={saveGrandTotal}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Apply Adjustment
                </button>
                <button 
                  onClick={cancelEditingGrandTotal}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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
            onClick={handleContinue}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
          >
            Continue to Review →
          </button>
        </div>
      </div>
    </div>
  );
}