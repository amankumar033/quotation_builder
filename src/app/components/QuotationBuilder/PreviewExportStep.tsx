// components/QuotationBuilder/PreviewExportStep.tsx
import { QuotationData } from '../../quotation-builder/page';
import { Download, Mail, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuotation } from '@/context/QuotationContext';
import { useAgencySettings } from '@/context/AgencySettingsContext';
import { RoomSelection, TransportRoute } from '@/types/type';

interface PreviewExportStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  prevStep: () => void;
}

interface HotelGroup {
  dates: string[];
  count: number;
  hotelInfo: {
    hotelName: string;
    roomSelections: RoomSelection[];
    starRating: number;
    travelers: { adults: number; children: number; infants: number };
    mealPlan: string;
    hotelImage: string | null;
  };
}

export default function PreviewExportStep({ data, prevStep }: PreviewExportStepProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { 
    quotationData, 
    clientName, 
    startDate, 
    endDate, 
    tripDestination, 
    travelers,
    daySelections,
    professionalRooms,
    exportQuotationData,
    finalGrandTotal,
    transportRoutes
  } = useQuotation();

  const { agencySettings } = useAgencySettings();

  const [exportData, setExportData] = useState<any>(null);

  useEffect(() => {
    const data = exportQuotationData();
    setExportData(data);
  }, [exportQuotationData]);

  const handleExport = (format: 'pdf' | 'email' | 'whatsapp') => {
    alert(`Exporting quotation as ${format.toUpperCase()}`);
  };

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const getTripDuration = (): string => {
    if (!startDate || !endDate) return '0 Nights / 0 Days';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${nights} Nights / ${nights + 1} Days`;
  };

  const getTravelerInfo = (): string => {
    const { adults, children, infants } = travelers;
    let info = '';
    if (adults > 0) info += `${adults}A`;
    if (children > 0) info += ` +${children}C`;
    if (infants > 0) info += ` +${infants}I`;
    return info || '0A';
  };

  const getClientDisplayName = (): string => {
    if (clientName) return clientName;
    return 'Valued Client';
  };

  const getHotelInfoForDay = (date: string) => {
    const daySelection = daySelections[date];
    if (!daySelection?.hotel) return null;
    
    const hotel = daySelection.hotel;
    const roomSelections = daySelection.roomSelections || [];
    
    return {
      hotelName: hotel.name,
      roomSelections: roomSelections,
      starRating: hotel.starCategory || 3,
      travelers: travelers,
      mealPlan: daySelection.meals && daySelection.meals.length > 0 ? 
        `Meal plan includes ${daySelection.meals.map(meal => meal.type?.toLowerCase() || 'meal').join(' and ')}` : 
        'No meals included',
      hotelImage: hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : null
    };
  };

  const getGroupedHotelNights = (): HotelGroup[] => {
    const groups: { [key: string]: HotelGroup } = {};
    
    Object.entries(daySelections).forEach(([date, dayData]) => {
      if (dayData.hotel) {
        const hotelKey = dayData.hotel.id;
        const hotelInfo = getHotelInfoForDay(date);
        if (!hotelInfo) return;
        
        if (!groups[hotelKey]) {
          groups[hotelKey] = {
            dates: [date],
            count: 1,
            hotelInfo: hotelInfo
          };
        } else {
          groups[hotelKey].dates.push(date);
          groups[hotelKey].count++;
        }
      }
    });

    return Object.values(groups);
  };

  const getDayNumber = (date: string): number => {
    if (!startDate) return 1;
    const start = new Date(startDate);
    const current = new Date(date);
    return Math.ceil((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getOrdinalSuffix = (number: number): string => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = number % 100;
    return number + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
  };

  const getCheckinDate = (date: string): string => {
    const checkinDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return checkinDate.toLocaleDateString('en-GB', options);
  };

  // Get room type name dynamically from room selections
  const getRoomTypeDisplay = (selection: RoomSelection) => {
    // Use the room type from the selection if available, otherwise fallback
    return selection.roomType || `Room Type ${selection.roomId}`;
  };

  const getDestinationImages = (): string[] => {
    const defaultImages = [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyle8jeYxSkTJqwMGoatwjOxfGEGIT0_ifpg&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN1TQId1p0GKKL4A60xU5NRVdSCX56l5_Aww&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSginMdQSw2t3OTGHvCZFjE1d1Fwaalii8wUQ&s'
    ];
    return defaultImages;
  };

  const destinationImages = getDestinationImages();
  const hotelGroups = getGroupedHotelNights();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        
        {/* Main Content - A4 Size Container */}
        <div className="w-[210mm] h-[297mm] bg-gray-50 shadow-2xl overflow-hidden mx-auto border border-gray-300">
          
          {/* Page 1 - Destination Cover Page */}
          {currentPage === 1 && (
            <div 
              className="min-h-[297mm] flex flex-col relative"
              style={{
                backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJP85I2v6kJa3eq4DE7qoj6LCYhR2rmviGpo57Pjvq6B0zzB7ZK2MBlXQ&s')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Header */}
              <div className="pt-10 px-8 text-center">
                <h1 className="text-7xl font-bold font-serif mb-2 tracking-widest text-white drop-shadow-2xl">
                  {tripDestination || 'DESTINATION'}
                </h1>
                <p className="text-3xl text-amber-200 italic mb-3 drop-shadow-lg font-serif">
                  {tripDestination ? `Explore ${tripDestination}` : 'Your Dream Destination'}
                </p>
                <div className="w-40 h-[2px] bg-amber-400 mx-auto rounded-full shadow-lg mb-2"></div>
              </div>

              {/* Image Cards */}
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center justify-center gap-5 max-w-5xl w-full bg-black/50 rounded-3xl py-12 mx-5 border-4 border-white backdrop-blur-sm">
                  {/* Left Image */}
                  <div className="w-48 h-72 rounded-xl overflow-hidden shadow-2xl border-4 border-white/90">
                    <img
                      src={destinationImages[0]}
                      alt={`${tripDestination} View 1`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Center Larger Image */}
                  <div className="w-64 h-80 rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src={destinationImages[1]}
                      alt={`${tripDestination} View 2`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Right Image */}
                  <div className="w-48 h-72 rounded-xl overflow-hidden shadow-2xl border-4 border-white/90">
                    <img
                      src={destinationImages[2]}
                      alt={`${tripDestination} View 3`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="px-8 pb-8 mb-10">
                <div className="bg-gray-300/80 rounded-2xl p-6 shadow-2xl border border-gray-200">
                  <div className="grid grid-cols-3 gap-4 items-center text-center">
                    {/* Trip ID */}
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-gray-700 text-sm font-semibold uppercase tracking-widest mb-2">Trip ID</h3>
                      <p className="text-blue-600 text-lg font-bold font-mono bg-white/90 px-3 py-2 rounded-lg border border-gray-300">
                        {quotationData.trip.quoteNumber || `#${Math.floor(1000 + Math.random() * 9000)}`}
                      </p>
                    </div>
                    
                    {/* Client Name */}
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-gray-700 text-sm font-semibold uppercase tracking-widest mb-2">Client</h3>
                      <p className="text-blue-600 text-lg font-bold bg-white/90 px-3 py-2 rounded-lg border border-gray-300">
                        {getClientDisplayName()}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-gray-700 text-sm font-semibold uppercase tracking-widest mb-2">Duration</h3>
                      <p className="text-blue-600 text-base font-bold bg-white/90 px-3 py-2 rounded-lg border border-gray-300 whitespace-nowrap">
                        {getTripDuration()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page 2 - Quotation Letter */}
          {currentPage === 2 && (
            <div className="min-h-[297mm] p-12 bg-white">
              {/* Header with Agency Details */}
              <div className="text-center mb-8">
                {agencySettings.agencyLogo && (
                  <div className="mb-4 flex justify-center">
                    <img 
                      src={agencySettings.agencyLogo} 
                      alt={agencySettings.agencyName || 'Agency Logo'} 
                      className="h-16 object-contain"
                    />
                  </div>
                )}
                <h1 className="text-3xl font-bold text-blue-800 mb-2">
                  {agencySettings.agencyName || 'Your Company Name'}
                </h1>
                {agencySettings.contactInfo && (
                  <p className="text-gray-600 mb-2">{agencySettings.contactInfo}</p>
                )}
                <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
              </div>

              {/* Content */}
              <div className="space-y-6 text-gray-700">
                <div className="space-y-4">
                  <p className="text-lg"><strong>Dear {getClientDisplayName()},</strong></p>
                  <p>
                    Hello from <strong className="text-blue-700">{agencySettings.agencyName || 'Your Company Name'}</strong> !!! We are delighted to send you our custom-made quote for your {getTripDuration()} tour to {tripDestination || 'your chosen destination'}.
                  </p>
                  <p>
                    Your tour begins on <strong className="text-blue-700">{startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'selected date'}</strong> in {tripDestination || 'your destination'}, and runs over {getTripDuration()}, ending on <strong className="text-blue-700">{endDate ? new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'selected date'}</strong>.
                  </p>
                  <p>
                    We feel sure that you will be as excited about this trip as we are to have you join us. Please let us know if you have any questions.
                  </p>
                  <p>We look forward to hearing from you.</p>
                </div>

                {/* Closing */}
                <div className="mt-8">
                  <p className="font-semibold text-blue-800">Best regards,</p>
                  <p className="text-blue-700 font-medium">{agencySettings.agencyName || 'Your Company Name'}</p>
                  {agencySettings.contactInfo && (
                    <p className="text-gray-600 text-sm mt-1">{agencySettings.contactInfo}</p>
                  )}
                </div>

                {/* Details Table */}
                <div className="mt-8 border border-blue-200 rounded-lg overflow-hidden bg-blue-50">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="border border-blue-500 p-3 text-left font-semibold">DESTINATION</th>
                        <th className="border border-blue-500 p-3 text-left font-semibold">START DATE</th>
                        <th className="border border-blue-500 p-3 text-left font-semibold">DURATION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-blue-300 p-3 font-medium text-blue-800">{tripDestination || 'Destination'}</td>
                        <td className="border border-blue-300 p-3 text-blue-700">
                          {startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Start Date'}
                        </td>
                        <td className="border border-blue-300 p-3 text-blue-700">{getTripDuration()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Price Section - FIXED: Use finalGrandTotal directly */}
                <div className="mt-8 text-center border-2 border-blue-300 rounded-lg py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">QUOTE PRICE</h3>
                  <p className="text-sm text-gray-600 mb-2">Total (INR)</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{finalGrandTotal.toLocaleString()} /-
                  </p>
                  <p className="text-sm text-gray-500 mt-1">(including taxes)</p>
                </div>
              </div>
            </div>
          )}

          {/* Page 3 - Hotels & Accommodations */}
          {currentPage === 3 && (
            <div className="min-h-[297mm] p-12 bg-white">
              {/* Section Header with Integrated Blue Vertical Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 ">
                    <div className="flex items-center ">
                      <div className="w-[6px] h-15 bg-blue-600  "></div>
                      <h2 className="text-2xl font-bold text-blue-800 text-center flex-1  py-2">
                        Hotels / Accommodations
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Hotel Listings */}
              {hotelGroups.length > 0 ? (
                hotelGroups.map((hotelGroup, index) => {
                  const { dates, count, hotelInfo } = hotelGroup;
                  const firstDate = dates[0];
                  const dayNumber = getDayNumber(firstDate);
                  const ordinalSuffix = getOrdinalSuffix(dayNumber);
                  const checkinDate = getCheckinDate(firstDate);
                  
                  return (
                    <div key={index} className="mb-12 border flex border-gray-200 rounded-lg p-6 bg-white">
                      <div className="flex-1">
                        {/* Days Header */}
                        <div className="mb-6">
                          <h3 className="text-lg mb-2 text-gray-600 font-semibold">
                            <span className='bg-blue-200 text-blue-800 p-2 rounded-sm border-2 border-blue-600'>
                              {count > 1 ? `${ordinalSuffix} & ${getOrdinalSuffix(dayNumber + count - 1)}` : `${ordinalSuffix}`}
                            </span> 
                            {count > 1 ? ' Nights' : ' Night'} at {tripDestination}
                          </h3>
                          <span className='text-[10px] text-gray-500 font-light'>
                            check-in on {checkinDate}
                          </span>
                        </div>
                        
                        <div className="flex gap-6">
                          <div className="flex-1">
                            <div className="mb-6">
                              <h4 className="text-xl font-bold text-blue-700 mb-1">{hotelInfo.hotelName}</h4>
                              <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`w-4 w-4 ${star <= hotelInfo.starRating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`} 
                                  />
                                ))}
                                <span className="text-sm text-gray-500 ml-1">({hotelInfo.starRating} stars)</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs text-gray-500 font-semibold mb-1">ROOMS</p>
                                  {hotelInfo.roomSelections && hotelInfo.roomSelections.length > 0 ? (
                                    hotelInfo.roomSelections.map((selection: RoomSelection, idx: number) => (
                                      <div key={idx} className="mb-2">
                                        {/* FIXED: Use dynamic room type from selection */}
                                        <p className="text-sm font-medium text-gray-500">
                                          {selection.roomCount} × {getRoomTypeDisplay(selection)}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          {selection.adults} Adults
                                          {selection.childrenWithBed > 0 ? ` + ${selection.childrenWithBed} Children with bed` : ''}
                                          {selection.childrenWithoutBed > 0 ? ` + ${selection.childrenWithoutBed} Children without bed` : ''}
                                        </p>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm font-medium text-gray-500">No rooms selected</p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div>
                                  <p className="text-xs text-gray-500 font-semibold mb-1">MEAL PLAN</p>
                                  <p className="text-sm font-medium text-gray-500 mr-2">{hotelInfo.mealPlan}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Hotel Image */}
                      <div className="w-48 h-40">
                        <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={hotelInfo.hotelImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"}
                            alt={hotelInfo.hotelName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏨</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Hotels Selected</h3>
                  <p className="text-gray-600">
                    Hotel information will appear here once hotels are selected for your trip days.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Page 4 - Brief Itinerary - RESTORED to original */}
          {currentPage === 4 && (
            <div className="min-h-[297mm] p-12 bg-white">
              {/* Agency Header */}
              <div className="text-center mb-6 border-b border-gray-200 pb-4">
                {agencySettings.agencyLogo && (
                  <div className="mb-2 flex justify-center">
                    <img 
                      src={agencySettings.agencyLogo} 
                      alt={agencySettings.agencyName || 'Agency Logo'} 
                      className="h-12 object-contain"
                    />
                  </div>
                )}
                <h1 className="text-2xl font-bold text-blue-800">
                  {agencySettings.agencyName || 'Travel Agency'}
                </h1>
              </div>

              {/* Section Header with Integrated Blue Vertical Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 ">
                    <div className="flex items-center ">
                      <div className="w-[6px] h-15 bg-blue-600  "></div>
                      <h2 className="text-2xl font-bold text-blue-800 text-center flex-1  py-2">
                        BRIEF ITINERARY
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50">
                <strong className="text-blue-700">Transportation Used:</strong> {transportRoutes.length > 0 ? transportRoutes.map(route => route.vehicle?.name).join(', ') : 'Not configured'}
              </p>
              
              <div className="border border-blue-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <th className="border border-blue-500 p-4 text-left font-semibold">Day</th>
                      <th className="border border-blue-500 p-4 text-left font-semibold">Service</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelGroups.map((group, index) => {
                      const dayNumber = getDayNumber(group.dates[0]);
                      const date = new Date(group.dates[0]);
                      const dateStr = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                      
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                          <td className="border border-blue-300 p-4 font-medium text-blue-800">
                            {getOrdinalSuffix(dayNumber)} Day
                            <br/>
                            <span className="text-sm text-blue-600">{dateStr}</span>
                          </td>
                          <td className="border border-blue-300 p-4 text-gray-700">
                            {tripDestination} - {group.hotelInfo.hotelName}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Continue with remaining pages... */}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          {/* Export Options */}
          <div className="bg-gradient-to-br from-white to-slate-50 p-6 shadow rounded-xl space-y-4 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Export Options</h2>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition"
            >
              <Download className="inline-block mr-2 pb-1" size={22} />
              Download PDF
            </button>
            <button
              onClick={() => handleExport('email')}
              className="w-full px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition"
            >
              <Mail className="inline-block mr-2 pb-1" size={22} />
              Send via Email
            </button>
            <button
              onClick={() => handleExport('whatsapp')}
              className="w-full px-4 py-3 flex gap-2 justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition"
            >
              <img src="/whatsapp.png" alt="WhatsApp" className='h-5 w-5' />
              Share on WhatsApp
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-white to-slate-50 p-6 shadow rounded-xl space-y-4 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            {['Full Screen Preview', 'Edit Quotation', 'Save as Draft', 'Duplicate Quotation'].map((action, i) => (
              <button
                key={i}
                className="w-full px-4 py-3 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition font-medium"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Page Navigation */}
          <div className="bg-gradient-to-br from-white to-slate-50 p-6 shadow rounded-xl space-y-4 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Page Navigation</h2>
            <div className="flex gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`flex-1 px-4 py-2 rounded-lg transition ${
                  currentPage === 1 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === 9}
                className={`flex-1 px-4 py-2 rounded-lg transition ${
                  currentPage === 9 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                Next
              </button>
            </div>
            <div className="text-center text-sm text-slate-600">
              Page {currentPage} of 9
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex justify-between pt-6 mt-10 bg-white rounded-xl p-6 shadow border border-slate-200">
        <button
          onClick={prevStep}
          className="px-6 py-3 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 transition font-medium"
        >
          ← Back
        </button>
        
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm">
          Finish →  
        </button>
      </div>
    </div>
  );
}