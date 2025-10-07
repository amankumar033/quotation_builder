// components/QuotationBuilder/CustomizationStep.tsx
"use client";
import { QuotationData } from '@/types/type';
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
  const { agencySettings, updatePricing, updateAgencySettings } = useAgencySettings();
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [isEditingGrandTotal, setIsEditingGrandTotal] = useState(false);
  const { totalPackagePrice, exportQuotationData, quotationData, updateQuotationData, finalGrandTotal, setFinalGrandTotal, termsConditions,
    getInclusions, getExclusions, addInclusionExclusion, updateInclusionExclusion, deleteInclusionExclusion,
    addTermsCondition, updateTermsCondition, deleteTermsCondition } = useQuotation();
  const [tempPricing, setTempPricing] = useState({
    markupPercentage: 0,
    gstPercentage: 0,
    discountAmount: 0
  });
  const [tempGrandTotal, setTempGrandTotal] = useState(0);
  const [newTerm, setNewTerm] = useState({ title: '', content: '', category: 'general' as 'general' | 'payment' | 'cancellation' | 'liability' });
  const [newInclusion, setNewInclusion] = useState({ text: '', category: 'general' as 'accommodation' | 'meals' | 'transport' | 'activities' | 'general' });
  const [newExclusion, setNewExclusion] = useState({ text: '', category: 'general' as 'accommodation' | 'meals' | 'transport' | 'activities' | 'general' });

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

  // Initialize with context data and keep terms in sync with payment terms
  useEffect(() => {
    const selectedPayment = quotationData.paymentTerms || safeAgencySettings.paymentTerms;
    const baseTerms = quotationData.termsConditions || safeAgencySettings.termsConditions;
    const updatedTerms = (() => {
      const lower = selectedPayment.toLowerCase();
      const paymentLine = lower.includes('net 15')
        ? '• Payment due within 15 days of invoice date'
        : lower.includes('net 30')
        ? '• Payment due within 30 days of invoice date'
        : lower.includes('receipt')
        ? '• Payment due upon receipt of invoice'
        : lower.includes('50%')
        ? '• 50% advance before commencement and remaining 50% on completion'
        : `• Payment terms: ${selectedPayment}`;
      const lines = baseTerms.split('\n').filter(Boolean);
      const withoutExistingPayment = lines.filter(l => !l.toLowerCase().includes('payment due') && !l.toLowerCase().includes('advance') && !l.toLowerCase().includes('payment terms:'));
      return [paymentLine, ...withoutExistingPayment].join('\n');
    })();

    const next = {
      ...quotationData,
      markupPercentage: quotationData.markupPercentage || safeAgencySettings.pricing.markupPercentage,
      discountAmount: quotationData.discountAmount || 0,
      paymentTerms: selectedPayment,
      termsConditions: updatedTerms
    };
    updateData(next);
    updateQuotationData(next);
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
      discountAmount: data.discountAmount || safeAgencySettings.pricing.discountAmount || 0
    });
    setIsEditingPricing(true);
  };

  const savePricing = () => {
    const updates = {
      markupPercentage: parseFloat(tempPricing.markupPercentage.toFixed(2)),
      discountAmount: parseFloat(tempPricing.discountAmount.toFixed(2))
    };
    // Persist to quotation
    updateData(updates);
    updateQuotationData(updates);
    // Persist to agency settings defaults so future quotes use the same
    updatePricing({
      markupPercentage: updates.markupPercentage,
      discountAmount: updates.discountAmount,
      gstPercentage: parseFloat(tempPricing.gstPercentage.toFixed(2))
    });
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

  const handleAddTerm = () => {
    if (newTerm.title.trim()) {
      addTermsCondition({
        title: newTerm.title.trim(),
        content: newTerm.content.trim(),
        category: newTerm.category
      });
      setNewTerm({ title: '', content: '', category: 'general' });
    }
  };

  const handleAddInclusion = () => {
    if (newInclusion.text.trim()) {
      addInclusionExclusion({
        text: newInclusion.text.trim(),
        type: 'inclusion',
        category: newInclusion.category
      });
      setNewInclusion({ text: '', category: 'general' });
    }
  };

  const handleAddExclusion = () => {
    if (newExclusion.text.trim()) {
      addInclusionExclusion({
        text: newExclusion.text.trim(),
        type: 'exclusion',
        category: newExclusion.category
      });
      setNewExclusion({ text: '', category: 'general' });
    }
  };

  const categoryLabels = {
    general: 'General',
    payment: 'Payment',
    cancellation: 'Cancellation',
    liability: 'Liability'
  };

  const inclusionCategoryLabels = {
    accommodation: 'Accommodation',
    meals: 'Meals',
    transport: 'Transport',
    activities: 'Activities',
    general: 'General'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Payment Terms & Terms & Conditions Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Payment Terms & Conditions</h2>
          </div>

          {/* Payment Terms Row */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Payment Terms</h3>
              <span className="text-sm text-gray-500">Select the payment terms for this quotation</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Net 15', 'Net 30', 'Due on receipt', '50% advance, 50% on completion'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleInputChange('paymentTerms', term)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    data.paymentTerms === term
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{term}</div>
                  <div className="text-xs text-gray-500">
                    {term === 'Net 15' && 'Payment due within 15 days'}
                    {term === 'Net 30' && 'Payment due within 30 days'}
                    {term === 'Due on receipt' && 'Payment due immediately'}
                    {term === '50% advance, 50% on completion' && '50% advance, 50% on completion'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Terms & Conditions Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Terms & Conditions</h3>
              <span className="text-sm text-gray-500">Manage your terms and conditions</span>
            </div>

            {/* Add New Term Form */}
            
            {/* Terms List */}
            <div className="space-y-4">
              {['payment', 'general', 'cancellation', 'liability'].map((category) => {
                const categoryTerms = termsConditions.filter(t => t.category === category);
                if (categoryTerms.length === 0) return null;

                return (
                  <div key={category} className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-800 capitalize">{categoryLabels[category as keyof typeof categoryLabels]}</h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {categoryTerms.map((term) => (
                        <div key={term.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <input
                                value={term.title}
                                onChange={(e) => updateTermsCondition(term.id, { title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800 mb-2"
                                placeholder="Term title"
                              />
                              <textarea
                                value={term.content}
                                onChange={(e) => updateTermsCondition(term.id, { content: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-600 resize-none"
                                placeholder="Term content"
                              />
                            </div>
                            <button
                              onClick={() => deleteTermsCondition(term.id)}
                              className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {termsConditions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2">No terms and conditions added yet.</p>
                  <p className="text-sm">Add your first term using the form above.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Inclusions & Exclusions Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Inclusions & Exclusions</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Inclusions */}
            <div className="border border-green-200 rounded-lg bg-green-50">
              <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
                <h3 className="font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Inclusions
                </h3>
              </div>
              
              {/* Add Inclusion Form */}
              <div className="p-4 border-b border-green-200">
                <div className="flex gap-2 mb-3">
                  <input
                    value={newInclusion.text}
                    onChange={(e) => setNewInclusion({ ...newInclusion, text: e.target.value })}
                    className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    placeholder="Add inclusion item..."
                  />
                  <select
                    value={newInclusion.category}
                    onChange={(e) => setNewInclusion({ ...newInclusion, category: e.target.value as any })}
                    className="px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="accommodation">Accommodation</option>
                    <option value="meals">Meals</option>
                    <option value="transport">Transport</option>
                    <option value="activities">Activities</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <button
                  onClick={handleAddInclusion}
                  disabled={!newInclusion.text.trim()}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Add Inclusion
                </button>
              </div>

              {/* Inclusions List */}
              <div className="max-h-64 overflow-y-auto">
                {getInclusions().length > 0 ? (
                  <ul className="divide-y divide-green-100">
                    {getInclusions().map((item) => (
                      <li key={item.id} className="p-3 hover:bg-green-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-green-600">•</span>
                              <input
                                value={item.text}
                                onChange={(e) => updateInclusionExclusion(item.id, { text: e.target.value })}
                                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-800"
                              />
                            </div>
                            <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded ml-4">
                              {inclusionCategoryLabels[item.category as keyof typeof inclusionCategoryLabels]}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteInclusionExclusion(item.id)}
                            className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-sm">No inclusions added yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Exclusions */}
            <div className="border border-red-200 rounded-lg bg-red-50">
              <div className="bg-red-600 text-white px-4 py-3 rounded-t-lg">
                <h3 className="font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Exclusions
                </h3>
              </div>

              {/* Add Exclusion Form */}
              <div className="p-4 border-b border-red-200">
                <div className="flex gap-2 mb-3">
                  <input
                    value={newExclusion.text}
                    onChange={(e) => setNewExclusion({ ...newExclusion, text: e.target.value })}
                    className="flex-1 px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    placeholder="Add exclusion item..."
                  />
                  <select
                    value={newExclusion.category}
                    onChange={(e) => setNewExclusion({ ...newExclusion, category: e.target.value as any })}
                    className="px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  >
                    <option value="accommodation">Accommodation</option>
                    <option value="meals">Meals</option>
                    <option value="transport">Transport</option>
                    <option value="activities">Activities</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <button
                  onClick={handleAddExclusion}
                  disabled={!newExclusion.text.trim()}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  Add Exclusion
                </button>
              </div>

              {/* Exclusions List */}
              <div className="max-h-64 overflow-y-auto">
                {getExclusions().length > 0 ? (
                  <ul className="divide-y divide-red-100">
                    {getExclusions().map((item) => (
                      <li key={item.id} className="p-3 hover:bg-red-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-red-600">•</span>
                              <input
                                value={item.text}
                                onChange={(e) => updateInclusionExclusion(item.id, { text: e.target.value })}
                                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-800"
                              />
                            </div>
                            <span className="inline-block bg-red-200 text-red-800 text-xs px-2 py-1 rounded ml-4">
                              {inclusionCategoryLabels[item.category as keyof typeof inclusionCategoryLabels]}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteInclusionExclusion(item.id)}
                            className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-sm">No exclusions added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Summary Section */}
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