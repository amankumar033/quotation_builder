// components/QuotationBuilder/PreviewExportStep.tsx
import { QuotationData } from '../../quotation-builder/page';
import { Download, Mail, Star } from 'lucide-react';
import { useState } from 'react';

interface PreviewExportStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  prevStep: () => void;
}

export default function PreviewExportStep({ data, prevStep }: PreviewExportStepProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleExport = (format: 'pdf' | 'email' | 'whatsapp') => {
    alert(`Exporting quotation as ${format.toUpperCase()}`);
  };

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const rajasthanImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyle8jeYxSkTJqwMGoatwjOxfGEGIT0_ifpg&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN1TQId1p0GKKL4A60xU5NRVdSCX56l5_Aww&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSginMdQSw2t3OTGHvCZFjE1d1Fwaalii8wUQ&s'
  ];

  const hotelImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        
        {/* Main Content - A4 Size Container */}
        <div className="w-[210mm] h-[297mm] bg-gray-50 shadow-2xl overflow-hidden mx-auto border border-gray-300">
          
          {/* Page 1 - Rajasthan Cover Page */}
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
                  RAJASTHAN
                </h1>
                <p className="text-3xl text-amber-200 italic mb-3 drop-shadow-lg font-serif">
                  The Heart of India
                </p>
                <div className="w-40 h-[2px] bg-amber-400 mx-auto rounded-full shadow-lg mb-2"></div>
              </div>

              {/* Image Cards */}
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center justify-center gap-5 max-w-5xl w-full bg-black/50 rounded-3xl py-12 mx-5 border-4 border-white backdrop-blur-sm">
                  {/* Left Image */}
                  <div className="w-48 h-72 rounded-xl overflow-hidden shadow-2xl border-4 border-white/90">
                    <img
                      src={rajasthanImages[0]}
                      alt="Rajasthan Heritage 1"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Center Larger Image */}
                  <div className="w-64 h-80 rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src={rajasthanImages[1]}
                      alt="Rajasthan Heritage 2"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Right Image */}
                  <div className="w-48 h-72 rounded-xl overflow-hidden shadow-2xl border-4 border-white/90">
                    <img
                      src={rajasthanImages[2]}
                      alt="Rajasthan Heritage 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="px-8 pb-8 mb-10">
                <div className="bg-gray-300/50 rounded-2xl p-6 shadow-2xl border border-gray-200">
                  <div className="grid grid-cols-3 gap-6 items-center text-center">
                    {/* Trip ID */}
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-gray-600 text-lg font-semibold uppercase tracking-widest mb-3">Trip ID</h3>
                      <p className="text-blue-500 text-2xl font-bold font-mono bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
                        #3074
                      </p>
                    </div>
                    
                    {/* Traveler */}
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-gray-600 text-lg font-semibold uppercase tracking-widest mb-3">Traveler</h3>
                      <p className="text-blue-500 text-xl font-bold bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
                        Sachin +2A
                      </p>
                    </div>
                    
                    {/* Duration */}
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-gray-600 text-lg font-semibold uppercase tracking-widest mb-3">Duration</h3>
                      <p className="text-blue-500 text-lg font-bold bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
                        20 Jun - 24 Jun 2025
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
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Your Company Name</h1>
                <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
              </div>

              {/* Content */}
              <div className="space-y-6 text-gray-700">
                <div className="space-y-4">
                  <p className="text-lg"><strong>Dear Sachin,</strong></p>
                  <p>
                    Hello from <strong className="text-blue-700">Your Company Name</strong> !!! We are delighted to send you our custom-made quote for your 5-Day Group Camping Tour Tarangire, Serengeti & Ngorongoro Crater.
                  </p>
                  <p>
                    Your tour begins on <strong className="text-blue-700">August 14, 2025</strong> in Arusha, and runs over 5 days, ending on <strong className="text-blue-700">August 18, 2025</strong> in Arusha.
                  </p>
                  <p>
                    We feel sure that you will be as excited about this safari as we are to have you join us. Please let us know if you have any questions.
                  </p>
                  <p>We look forward to hearing from you.</p>
                </div>

                {/* Closing */}
                <div className="mt-8">
                  <p className="font-semibold text-blue-800">Best regards,</p>
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
                        <td className="border border-blue-300 p-3 font-medium text-blue-800">Rajasthan</td>
                        <td className="border border-blue-300 p-3 text-blue-700">20 June, 2025</td>
                        <td className="border border-blue-300 p-3 text-blue-700">4 Nights / 5 Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Price Section */}
                <div className="mt-8 text-center border-2 border-blue-300 rounded-lg py-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">QUOTE PRICE</h3>
                  <p className="text-sm text-gray-600 mb-2">Total (INR)</p>
                  <p className="text-3xl font-bold text-blue-600">35,000 /-</p>
                  <p className="text-sm text-gray-500 mt-1">(including N/A)</p>
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
              
              {/* Jaipur Hotel */}
              <div className="mb-12 border flex border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex-1">
                  {/* Days Header */}
                  <div className=" mb-6">
                    <h3 className="text-lg mb-2 text-gray-600 font-semibold"><span className='bg-blue-200 text-blue-800 p-2 rounded-sm border-2 border-blue-600'>1st</span> Night at Jaipur</h3>
                    <span className='text-[10px] text-gray-500 font-light'>check-in on 20th june</span>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="mb-6">
                        <h4 className="text-xl font-bold text-blue-700 mb-1">Fern Residency</h4>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold mb-1">ROOMS</p>
                            <p className="text-sm font-medium text-gray-500">1 Winter Green Room</p>
                            <p className="text-xs text-gray-600">2 Pax</p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold mb-1">MEAL PLAN</p>
                            <p className="text-sm font-medium text-gray-500 mr-2">Meal plan includes breakfast and lunch</p>
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
                      src={hotelImage}
                      alt="Fern Residency"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Udaipur Hotel */}
              <div className="border flex border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex-1">
                  {/* Days Header */}
                  <div className=" mb-6">
                    <h3 className="text-lg mb-2 text-gray-600 font-semibold"><span className='bg-blue-200 text-blue-800 p-2 rounded-sm border-2 border-blue-600'>3rd & 4th</span> Nights at Udaipur</h3>
                    <span className='text-[10px] text-gray-500 font-light'>check-in on 22nd june</span>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <div className="mb-6">
                        <h4 className="text-xl font-bold text-blue-700 mb-1">Fern Residency</h4>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold mb-1">ROOMS</p>
                            <p className="text-sm font-medium text-gray-500">1 Winter Green Room</p>
                            <p className="text-xs text-gray-600">2 Pax</p>
                          </div>
                        </div>
                        <div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold mb-1">MEAL PLAN</p>
                            <p className="text-sm font-medium text-gray-500 mr-2">Meal plan includes breakfast and lunch</p>
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
                      src={hotelImage}
                      alt="Fern Residency"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page 4 - Brief Itinerary */}
          {currentPage === 4 && (
            <div className="min-h-[297mm] p-12 bg-white">
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
                <strong className="text-blue-700">Transportation Used:</strong> 1-A/c Sedan
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
                    {[
                      { day: '1st Day', service: 'Jaipur - Arrival & Transfer to the Hotel', date: 'Pri, 20 Jun' },
                      { day: '2nd Day', service: 'Jaipur - Sightseeing', date: 'Sat, 21 Jun' },
                      { day: '3rd Day', service: 'Jaipur to Udaipur - Transfer Via Chittorgarh', date: 'Sun, 22 Jun' },
                      { day: '4th Day', service: 'Udaipur - Sightseeing', date: 'Mon, 23 Jun' },
                      { day: '5th Day', service: 'Udaipur - Departure', date: 'Tue, 24 Jun' },
                    ].map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                        <td className="border border-blue-300 p-4 font-medium text-blue-800">
                          {item.day}
                          <br/>
                          <span className="text-sm text-blue-600">{item.date}</span>
                        </td>
                        <td className="border border-blue-300 p-4 text-gray-700">{item.service}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Page 5 - Inclusions/Exclusions */}
          {currentPage === 5 && (
            <div className="min-h-[297mm] p-12 bg-white">
              {/* Section Header with Integrated Blue Vertical Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 ">
                    <div className="flex items-center ">
                      <div className="w-[6px] h-15 bg-blue-600  "></div>
                      <h2 className="text-2xl font-bold text-blue-800 text-center flex-1  py-2">
                        Inclusions/Exclusions
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {/* Inclusions */}
                <div className="border border-green-200 rounded-lg p-6 bg-white">
                  <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Inclusions</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      "Accommodation Mention In Hotel Section.",
                      "Meal Plan Mention In Hotel Section.",
                      "Pick up and drop from Airport by a private Non Ac Car",
                      "All sightseeing by private Non Ac cars as per itinerary",
                      "State tax, hotel tax, and driver charge.",
                      "All toll taxes, driver's allowance, parking charges."
                    ].map((item, index) => (
                      <div key={index} className="flex items-start p-3 border-b border-gray-200 last:border-b-0">
                        <span className="text-green-500 mr-3 mt-1 text-lg">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exclusions */}
                <div className="border border-red-200 rounded-lg p-6 bg-white">
                  <h3 className="text-xl font-bold text-red-800 mb-4 text-center">Exclusions</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      "Any kind of insurance, Air, Train or Bus fare from / to your originating city of stay, unless specified",
                      "Garden entrance fee and guide charges, wherever applicable.",
                      "Personal meals and personal expenses like entry tickets, telephone, laundry or anything which is not mentioned in the inclusions",
                      "Item of personal nature- tips, laundry, room service, telephone, alcoholic or non alcoholic beverages",
                      "Anything not in inclusions is excluded"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start p-3 border-b border-gray-200 last:border-b-0">
                        <span className="text-red-500 mr-3 mt-1 text-lg">✗</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page 6 - Day Wise Itinerary Start */}
          {currentPage === 6 && (
            <div className="min-h-[297mm] p-12 bg-white">
              {/* Section Header with Integrated Blue Vertical Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 ">
                    <div className="flex items-center ">
                      <div className="w-[6px] h-15 bg-blue-600  "></div>
                      <h2 className="text-2xl font-bold text-blue-800 text-center flex-1  py-2">
                        Day Wise Itinerary
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Day 1 */}
              <div className="mb-8 border flex border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex-1">
                  {/* Days Header */}
                  <div className=" mb-6">
                    <h3 className="text-lg mb-2 text-gray-600 font-semibold"><span className='bg-blue-200 text-blue-800 p-2 rounded-sm border-2 border-blue-600'>1st</span> Day</h3>
                    <span className='text-[10px] text-gray-500 font-light'>Friday 20th June, 2025</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Jaipur Local Half Day • Approx Distance: 50 Km</p>
                    </div>
                    
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="font-semibold mr-2 text-blue-600">•</span>
                        <span><strong className="text-blue-700">Arrive Jaipur - The Pink City</strong></span>
                      </li>
                      <li className="flex items-start ml-4">
                        <span className="mr-2 text-blue-500">-</span>
                        <span className="text-sm text-gray-600">Assistance on arrival by Anywhere Door, Later transfer to your prebooked hotel/Resort</span>
                      </li>
                      <li className="flex items-start ml-4">
                        <span className="mr-2 text-blue-500">-</span>
                        <span className="text-sm text-gray-600">Overnight stay at the Jaipur</span>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Day Image */}
                <div className="w-48 h-40">
                  <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={rajasthanImages[0]}
                      alt="Day 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="mb-8 border flex border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex-1">
                  {/* Days Header */}
                  <div className=" mb-6">
                    <h3 className="text-lg mb-2 text-gray-600 font-semibold"><span className='bg-blue-200 text-blue-800 p-2 rounded-sm border-2 border-blue-600'>2nd</span> Day</h3>
                    <span className='text-[10px] text-gray-500 font-light'>Saturday 21st June, 2025</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Jaipur • Approx Distance: 50 Km</p>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      After breakfast day free for sightseeing visiting Amber Fort, the Old capital of Jaipur Rulers. Ride on the back of an elephant [at own cost] from the foots of the hill up to the gates of the fortress. Later after Amber fort visit The Maharaja's City Palace Museum, Jai Singh's Astronomical Observatory [Jantar Mantar] and Hawa Mahal. Thereafter day free at Leisure for Shopping, you can shop for various items like handicrafts, lacquered brass work, textiles etc. while on your stay here. Textiles in tie and dye (bandhani), Sanganeri and Bagru block print are important varieties and style of fabric you can choose from. Overnight stay at Jaipur.
                    </p>
                  </div>
                </div>
                {/* Day Image */}
                <div className="w-48 h-40">
                  <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={rajasthanImages[1]}
                      alt="Day 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Day 3 */}
              <div className="border flex border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex-1">
                  {/* Days Header */}
                  <div className=" mb-6">
                    <h3 className="text-lg mb-2 text-gray-600 font-semibold"><span className='bg-blue-200 text-blue-800 p-2 rounded-sm border-2 border-blue-600'>3rd</span> Day</h3>
                    <span className='text-[10px] text-gray-500 font-light'>Sunday 22nd June, 2025</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Jaipur to Udaipur – Transfer Via Chittorgarh • Approx Distance: 420 Km</p>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      After breakfast check out from the hotel & proceed to Udaipur – The White City & City of Lakes. Enroute visiting Chittorgarh Fort, Victory Tower, Maha Sati, Gaumukh Khund, Padmini Palace, Meera Temple, Rana Kumbha Palace, Kalika Mata Temple. Arrive Udaipur & transfer to your pre booked hotel. Overnight stay at Udaipur.
                    </p>
                  </div>
                </div>
                {/* Day Image */}
                <div className="w-48 h-40">
                  <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={rajasthanImages[2]}
                      alt="Day 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue with remaining pages... */}
          {/* Pages 7, 8, 9 would follow the same pattern */}

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
            <h2 className="text-lg font-sem-slate-900">Page Navigation</h2>
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