// components/QuotationBuilder/PreviewExportStep.tsx
import { QuotationData } from '../../quotation-builder/page';

interface PreviewExportStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  prevStep: () => void;
}

export default function PreviewExportStep({ data, prevStep }: PreviewExportStepProps) {
  // Calculate pricing
  const subtotal = data.services.reduce((sum, service) => sum + (service.price * service.quantity), 0);
  const markup = (subtotal * data.markupPercentage) / 100;
  const taxable = subtotal + markup;
  const gst = taxable * 0.05;
  const grandTotal = taxable + gst;

  const handleExport = (format: 'pdf' | 'email' | 'whatsapp') => {
    alert(`Exporting quotation as ${format.toUpperCase()}`);
    // In a real application, this would generate and send the quotation
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl mb-2">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
          Preview & Export
        </h3>
        <p className="text-gray-600 mt-1 ml-11">Review your quotation and export it to share with your client</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quotation Preview */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-6 text-lg border-b pb-3">Quotation Preview</h4>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                {data.agencyLogo ? (
                  <img src={data.agencyLogo} alt="Agency Logo" className="h-12 mb-2" />
                ) : (
                  <div className="h-12 w-40 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                    Agency Logo
                  </div>
                )}
                <p className="text-sm text-gray-600">Travel Quotation</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Quotation #: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-800 mb-2">Client Information</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Name: {data.client.name || 'Not provided'}</p>
                  <p className="text-gray-600">Phone: {data.client.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email: {data.client.email || 'Not provided'}</p>
                  <p className="text-gray-600">Destination: {data.trip.destination || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Services Table */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-800 mb-3">Package Details</h5>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Service</th>
                    <th className="px-4 py-2 text-left">Details</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Qty</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.services.map(service => (
                    <tr key={service.id} className="border-b border-gray-100">
                      <td className="px-4 py-3">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{service.type}</div>
                      </td>
                      <td className="px-4 py-3">
                        {Object.entries(service.details).map(([key, value]) => (
                          <div key={key} className="text-xs text-gray-600">{key}: {value}</div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-right">₹{service.price}</td>
                      <td className="px-4 py-3 text-right">{service.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium">₹{service.price * service.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing Summary */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-800 mb-3">Pricing Summary</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Markup ({data.markupPercentage}%):</span>
                  <span>₹{markup.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxable Amount:</span>
                  <span>₹{taxable.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                  <span>Grand Total:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Terms & Notes */}
            <div>
              <h5 className="font-medium text-gray-800 mb-2">Terms & Conditions</h5>
              <div className="text-sm text-gray-600 whitespace-pre-line mb-4">{data.termsConditions}</div>
              
              {data.specialNotes && (
                <>
                  <h5 className="font-medium text-gray-800 mb-2">Special Notes</h5>
                  <div className="text-sm text-gray-600">{data.specialNotes}</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-5">Export Options</h4>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleExport('pdf')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
              </button>
              
              <button 
                onClick={() => handleExport('email')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Send via Email
              </button>
              
              <button 
                onClick={() => handleExport('whatsapp')}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-md transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Share via WhatsApp
              </button>
            </div>
          </div>

          {/* Quotation Summary */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4">Quotation Summary</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Client:</span>
                <span className="font-medium">{data.client.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destination:</span>
                <span className="font-medium">{data.trip.destination || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Travelers:</span>
                <span className="font-medium">
                  {data.trip.adults > 0 && `${data.trip.adults} Adult(s)`}
                  {data.trip.children > 0 && `, ${data.trip.children} Child(ren)`}
                  {data.trip.infants > 0 && `, ${data.trip.infants} Infant(s)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Services:</span>
                <span className="font-medium">{data.services.length} items</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{grandTotal.toFixed(2)}</span>
                </div>
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
          Back to Customization
        </button>
        <button
          onClick={() => alert('Quotation created successfully!')}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md transition flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Finalize Quotation
        </button>
      </div>
    </div>
  );
}