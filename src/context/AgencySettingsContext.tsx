// contexts/AgencySettingsContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PricingConfiguration {
  subtotal: number;
  markupPercentage: number;
  gstPercentage: number;
  discountAmount: number;
}

interface AgencySettings {
  agencyLogo: string;
  agencyName: string;
  contactInfo: string;
  paymentTerms: string;
  paymentTermsOptions?: string[];
  termsConditions: string;
  pricing: PricingConfiguration;
}

interface AgencySettingsContextType {
  agencySettings: AgencySettings;
  updateAgencySettings: (settings: Partial<AgencySettings>) => void;
  updatePricing: (pricing: Partial<PricingConfiguration>) => void;
}

// Export the default settings so they can be used in other files
export const defaultPricing: PricingConfiguration = {
  subtotal: 1000,
  markupPercentage: 20,
  gstPercentage: 5,
  discountAmount: 0,
};

export const defaultAgencySettings: AgencySettings = {
  agencyLogo: '',
  agencyName: '',
  contactInfo: '',
  paymentTerms: 'Net 30',
  paymentTermsOptions: ['Net 15', 'Net 30', 'Due on receipt', '50% advance, 50% on completion'],
  termsConditions: `• Payment due within 30 days of invoice date
• 50% advance required for project commencement
• Late payments subject to 1.5% monthly interest
• Client approves all work before final delivery
• Revisions limited to 3 rounds per deliverable`,
  pricing: defaultPricing,
};

const AgencySettingsContext = createContext<AgencySettingsContextType | undefined>(undefined);

export function AgencySettingsProvider({ children }: { children: ReactNode }) {
  const [agencySettings, setAgencySettings] = useState<AgencySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agencySettings');
      const parsed = saved ? JSON.parse(saved) : defaultAgencySettings;
      // Migrate missing fields
      if (!parsed.paymentTermsOptions) {
        parsed.paymentTermsOptions = defaultAgencySettings.paymentTermsOptions;
      }
      return parsed;
    }
    return defaultAgencySettings;
  });

  const updateAgencySettings = (settings: Partial<AgencySettings>) => {
    setAgencySettings(prev => {
      const newSettings = { ...prev, ...settings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('agencySettings', JSON.stringify(newSettings));
      }
      return newSettings;
    });
  };

  const updatePricing = (pricing: Partial<PricingConfiguration>) => {
    setAgencySettings(prev => {
      const newSettings = {
        ...prev,
        pricing: { ...prev.pricing, ...pricing }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('agencySettings', JSON.stringify(newSettings));
      }
      return newSettings;
    });
  };

  return (
    <AgencySettingsContext.Provider value={{ agencySettings, updateAgencySettings, updatePricing }}>
      {children}
    </AgencySettingsContext.Provider>
  );
}

export function useAgencySettings() {
  const context = useContext(AgencySettingsContext);
  if (context === undefined) {
    throw new Error('useAgencySettings must be used within an AgencySettingsProvider');
  }
  return context;
}