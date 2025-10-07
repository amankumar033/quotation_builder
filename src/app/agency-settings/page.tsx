// app/agency-settings/page.tsx
'use client';

import { useAgencySettings, defaultAgencySettings } from '@/context/AgencySettingsContext';
import { useQuotation } from '@/context/QuotationContext';
import { useState, useEffect } from 'react';

export default function AgencySettingsPage() {
  const { agencySettings, updateAgencySettings, updatePricing } = useAgencySettings();
  const {
    // Inclusions & Exclusions
    getInclusions,
    getExclusions,
    addInclusionExclusion,
    updateInclusionExclusion,
    deleteInclusionExclusion,
    // Terms
    termsConditions: structuredTerms,
    addTermsCondition,
    updateTermsCondition,
    deleteTermsCondition
  } = useQuotation();
  const [activeTab, setActiveTab] = useState<'branding' | 'terms' | 'pricing'>('branding');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newTermTitle, setNewTermTitle] = useState('');
  const [newTermContent, setNewTermContent] = useState('');
  const [newTermCategory, setNewTermCategory] = useState<'general' | 'payment' | 'cancellation' | 'liability'>('general');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Safe agency settings with fallbacks
  const safeAgencySettings = {
    ...agencySettings,
    pricing: agencySettings?.pricing || defaultAgencySettings.pricing,
    paymentTerms: agencySettings?.paymentTerms || defaultAgencySettings.paymentTerms,
    termsConditions: agencySettings?.termsConditions || defaultAgencySettings.termsConditions,
    agencyLogo: agencySettings?.agencyLogo || '',
    agencyName: agencySettings?.agencyName || '',
    contactInfo: agencySettings?.contactInfo || ''
  };

  useEffect(() => {
    // If agencySettings is empty, initialize with defaults
    if (!agencySettings || !agencySettings.pricing) {
      updateAgencySettings(defaultAgencySettings);
    }
    setIsLoading(false);
  }, [agencySettings, updateAgencySettings]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateAgencySettings({ agencyLogo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = (field: string, currentValue: number) => {
    setEditingField(field);
    setTempValue(currentValue.toString());
  };

  const saveEditing = () => {
    if (editingField && tempValue) {
      const numValue = parseFloat(tempValue);
      if (!isNaN(numValue)) {
        updatePricing({ [editingField]: numValue });
      }
    }
    setEditingField(null);
    setTempValue('');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

  // Calculate pricing summary with safe defaults
  const calculateTotals = () => {
    const pricing = safeAgencySettings.pricing;
    const subtotal = pricing.subtotal || 0;
    const markupPercentage = pricing.markupPercentage || 0;
    const gstPercentage = pricing.gstPercentage || 0;
    const discountAmount = pricing.discountAmount || 0;
    
    const markup = (subtotal * markupPercentage) / 100;
    const taxable = subtotal + markup;
    const gst = (taxable * gstPercentage) / 100;
    const grandTotal = taxable + gst - discountAmount;
    
    return { 
      subtotal, 
      markup, 
      taxable, 
      gst, 
      grandTotal, 
      markupPercentage, 
      gstPercentage, 
      discountAmount 
    };
  };

  const { subtotal, markup, taxable, gst, grandTotal, markupPercentage, gstPercentage, discountAmount } = calculateTotals();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Compact Header */}
        <div className="text-center mb-8 flex gap-5 mt-5">
          <div className="inline-flex  items-center justify-center w-15 h-15 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
            Agency Settings
          </h1>
          
        </div>

        {/* Compact Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg mb-6 overflow-hidden border border-white/20">
          <div className="flex border-b border-gray-200/60">
            <button
              onClick={() => setActiveTab('branding')}
              className={`flex-1 py-4 px-4 text-base font-semibold transition-all duration-300 ${
                activeTab === 'branding'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50/50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>🎨</span>
                <span>Branding</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex-1 py-4 px-4 text-base font-semibold transition-all duration-300 ${
                activeTab === 'terms'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50/50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>📝</span>
                <span>Terms</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`flex-1 py-4 px-4 text-base font-semibold transition-all duration-300 ${
                activeTab === 'pricing'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50/50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>💰</span>
                <span>Pricing</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Agency Branding</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Logo Upload Section */}
                  <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                        🖼️
                      </span>
                      Agency Logo
                    </h3>
                    <div className="flex items-center justify-center w-full mb-3">
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:border-blue-400 transition-all duration-300 bg-white/50 hover:bg-white">
                        {safeAgencySettings.agencyLogo ? (
                          <div className="relative w-full h-full group">
                            <img 
                              src={safeAgencySettings.agencyLogo} 
                              alt="Agency Logo" 
                              className="w-full h-full object-contain p-4 rounded-xl" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-xl flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 text-sm bg-black/50 px-3 py-1 rounded">
                                Change Logo
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-3 shadow-inner">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm text-gray-700 font-medium">Upload your logo</p>
                            <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Agency Information Section */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                          🏢
                        </span>
                        Agency Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Agency Name</label>
                          <input
                            type="text"
                            value={safeAgencySettings.agencyName}
                            onChange={(e) => updateAgencySettings({ agencyName: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 text-sm"
                            placeholder="Enter your agency name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Information</label>
                          <textarea
                            value={safeAgencySettings.contactInfo}
                            onChange={(e) => updateAgencySettings({ contactInfo: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 text-sm"
                            rows={3}
                            placeholder="Address, phone, email, etc."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terms Tab */}
            {activeTab === 'terms' && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Terms & Conditions</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-6 border border-orange-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
                        💳
                      </span>
                      Payment Terms
                    </h3>
                    <div className="space-y-3">
                      <select
                        value={safeAgencySettings.paymentTerms}
                        onChange={(e) => updateAgencySettings({ paymentTerms: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 text-sm"
                      >
                        {(agencySettings.paymentTermsOptions || []).map(pt => (
                          <option key={pt} value={pt}>{pt}</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add payment term (e.g. Net 45)"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value.trim();
                              if (!value) return;
                              const next = Array.from(new Set([...(agencySettings.paymentTermsOptions || []), value]));
                              updateAgencySettings({ paymentTermsOptions: next, paymentTerms: value });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                      </div>
                      {(agencySettings.paymentTermsOptions || []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {(agencySettings.paymentTermsOptions || []).map(pt => (
                            <span key={pt} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs flex items-center gap-2">
                              {pt}
                              <button
                                onClick={() => {
                                  const next = (agencySettings.paymentTermsOptions || []).filter(x => x !== pt);
                                  updateAgencySettings({ paymentTermsOptions: next, paymentTerms: next[0] || '' });
                                }}
                                className="text-red-600"
                                title="Remove"
                              >×</button>
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">Default payment term for new quotations. Press Enter to add.</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                        📄
                      </span>
                      Terms & Conditions
                    </h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={newTermTitle}
                          onChange={(e) => setNewTermTitle(e.target.value)}
                          placeholder="Term title"
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                        <select
                          value={newTermCategory}
                          onChange={(e) => setNewTermCategory(e.target.value as any)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                          <option value="general">General</option>
                          <option value="payment">Payment</option>
                          <option value="cancellation">Cancellation</option>
                          <option value="liability">Liability</option>
                        </select>
                        <button
                          onClick={() => {
                            if (!newTermTitle || !newTermContent) return;
                            addTermsCondition({ title: newTermTitle, content: newTermContent, category: newTermCategory });
                            setNewTermTitle('');
                            setNewTermContent('');
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                        >
                          Add Term
                        </button>
                      </div>
                      <textarea
                        value={newTermContent}
                        onChange={(e) => setNewTermContent(e.target.value)}
                        placeholder="Term content"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <div className="space-y-2">
                        {structuredTerms.length === 0 && (
                          <p className="text-sm text-gray-500">No structured terms yet. Add above.</p>
                        )}
                        {structuredTerms.map(term => (
                          <div key={term.id} className="border border-purple-200 bg-white rounded-lg p-3 flex items-start justify-between">
                            <div className="pr-3">
                              <div className="text-xs text-purple-700 font-semibold mb-1 uppercase">{term.category}</div>
                              <div className="font-semibold text-gray-800">{term.title}</div>
                              <div className="text-sm text-gray-600 whitespace-pre-wrap">{term.content}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateTermsCondition(term.id, { title: prompt('Update title', term.title) || term.title })}
                                className="px-2 py-1 text-blue-600 text-sm"
                              >Edit</button>
                              <button
                                onClick={() => deleteTermsCondition(term.id)}
                                className="px-2 py-1 text-red-600 text-sm"
                              >Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Inclusions</h3>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newInclusion}
                        onChange={(e) => setNewInclusion(e.target.value)}
                        placeholder="Add inclusion"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => { if (!newInclusion) return; addInclusionExclusion({ text: newInclusion, type: 'inclusion', category: 'general' }); setNewInclusion(''); }}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
                      >Add</button>
                    </div>
                    <ul className="space-y-2">
                      {getInclusions().map(item => (
                        <li key={item.id} className="bg-white rounded-lg p-3 border border-green-200 flex items-start justify-between">
                          <span className="text-sm text-gray-700 pr-3">{item.text}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateInclusionExclusion(item.id, { text: prompt('Update inclusion', item.text) || item.text })}
                              className="text-blue-600 text-sm"
                            >Edit</button>
                            <button
                              onClick={() => deleteInclusionExclusion(item.id)}
                              className="text-red-600 text-sm"
                            >Delete</button>
                          </div>
                        </li>
                      ))}
                      {getInclusions().length === 0 && <li className="text-sm text-gray-500">No inclusions added.</li>}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-white to-red-50 rounded-xl p-6 border border-red-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Exclusions</h3>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newExclusion}
                        onChange={(e) => setNewExclusion(e.target.value)}
                        placeholder="Add exclusion"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => { if (!newExclusion) return; addInclusionExclusion({ text: newExclusion, type: 'exclusion', category: 'general' }); setNewExclusion(''); }}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                      >Add</button>
                    </div>
                    <ul className="space-y-2">
                      {getExclusions().map(item => (
                        <li key={item.id} className="bg-white rounded-lg p-3 border border-red-200 flex items-start justify-between">
                          <span className="text-sm text-gray-700 pr-3">{item.text}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateInclusionExclusion(item.id, { text: prompt('Update exclusion', item.text) || item.text })}
                              className="text-blue-600 text-sm"
                            >Edit</button>
                            <button
                              onClick={() => deleteInclusionExclusion(item.id)}
                              className="text-red-600 text-sm"
                            >Delete</button>
                          </div>
                        </li>
                      ))}
                      {getExclusions().length === 0 && <li className="text-sm text-gray-500">No exclusions added.</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Pricing Configuration</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Pricing Inputs - Removed subtotal input */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                          ⚙️
                        </span>
                        Pricing Parameters
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Markup Percentage - Editable input field */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Markup Percentage
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              value={editingField === 'markupPercentage' ? tempValue : safeAgencySettings.pricing.markupPercentage}
                              onChange={(e) => setTempValue(e.target.value)}
                              onFocus={() => startEditing('markupPercentage', safeAgencySettings.pricing.markupPercentage)}
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                              placeholder="Enter markup percentage"
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            {editingField === 'markupPercentage' ? (
                              <div className="flex space-x-1">
                                <button onClick={saveEditing} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm">
                                  ✓
                                </button>
                                <button onClick={cancelEditing} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm">
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => startEditing('markupPercentage', safeAgencySettings.pricing.markupPercentage)}
                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>

                        {/* GST Percentage - Editable input field */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            GST Percentage
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              value={editingField === 'gstPercentage' ? tempValue : safeAgencySettings.pricing.gstPercentage}
                              onChange={(e) => setTempValue(e.target.value)}
                              onFocus={() => startEditing('gstPercentage', safeAgencySettings.pricing.gstPercentage)}
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="Enter GST percentage"
                            />
                            {editingField === 'gstPercentage' ? (
                              <div className="flex space-x-1">
                                <button onClick={saveEditing} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm">
                                  ✓
                                </button>
                                <button onClick={cancelEditing} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm">
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => startEditing('gstPercentage', safeAgencySettings.pricing.gstPercentage)}
                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Discount Amount - Editable input field */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Amount (₹)</label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              value={editingField === 'discountAmount' ? tempValue : safeAgencySettings.pricing.discountAmount}
                              onChange={(e) => setTempValue(e.target.value)}
                              onFocus={() => startEditing('discountAmount', safeAgencySettings.pricing.discountAmount)}
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-sm"
                              min="0"
                              placeholder="0"
                            />
                            {editingField === 'discountAmount' ? (
                              <div className="flex space-x-1">
                                <button onClick={saveEditing} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm">
                                  ✓
                                </button>
                                <button onClick={cancelEditing} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm">
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => startEditing('discountAmount', safeAgencySettings.pricing.discountAmount)}
                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="w-5 h-5 bg-white/20 rounded flex items-center justify-center mr-2">
                          💰
                        </span>
                        Pricing Summary
                      </h3>
                      <p className="text-blue-100 text-xs mt-1">Based on your settings</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center py-1 border-b border-gray-700">
                        <span className="text-gray-300 text-sm">Subtotal</span>
                        <span className="text-white font-semibold text-sm">₹{subtotal.toFixed(2)}</span>
                      </div>
                      
                      {/* Markup Row - Editable */}
                      <div className="flex justify-between items-center py-1 border-b border-gray-700">
                        <span className="text-gray-300 text-sm">Markup</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-300 font-semibold text-sm">
                            {markupPercentage}% (₹{markup.toFixed(2)})
                          </span>
                          <button 
                            onClick={() => startEditing('markupPercentage', safeAgencySettings.pricing.markupPercentage)}
                            className="w-5 h-5 bg-blue-600 rounded text-xs hover:bg-blue-700 transition"
                          >
                            ✎
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-1 border-b border-gray-700">
                        <span className="text-gray-300 text-sm">Taxable Amount</span>
                        <span className="text-white font-semibold text-sm">₹{taxable.toFixed(2)}</span>
                      </div>
                      
                      {/* GST Row - Editable */}
                      <div className="flex justify-between items-center py-1 border-b border-gray-700">
                        <span className="text-gray-300 text-sm">GST</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold text-sm">
                            {gstPercentage}% (₹{gst.toFixed(2)})
                          </span>
                          <button 
                            onClick={() => startEditing('gstPercentage', safeAgencySettings.pricing.gstPercentage)}
                            className="w-5 h-5 bg-blue-600 rounded text-xs hover:bg-blue-700 transition"
                          >
                            ✎
                          </button>
                        </div>
                      </div>
                      
                      {/* Discount Row - Editable */}
                      {discountAmount > 0 && (
                        <div className="flex justify-between items-center py-1 border-b border-gray-700">
                          <span className="text-gray-300 text-sm">Discount</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-red-300 font-semibold text-sm">-₹{discountAmount.toFixed(2)}</span>
                            <button 
                              onClick={() => startEditing('discountAmount', safeAgencySettings.pricing.discountAmount)}
                              className="w-5 h-5 bg-red-600 rounded text-xs hover:bg-red-700 transition"
                            >
                              ✎
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-600">
                        <span className="text-lg font-bold text-white">Grand Total</span>
                        <span className="text-xl font-bold text-green-400">₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compact Save Status */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            All changes are automatically saved
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}