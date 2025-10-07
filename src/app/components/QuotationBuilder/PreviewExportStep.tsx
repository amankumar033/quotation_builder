// components/QuotationBuilder/PreviewExportStep.tsx
import { QuotationData } from '@/types/type';
import { Download, Mail, Star, Users, Bed, Sparkles, Edit, Plus, Trash2, Check, X, Save, X as CloseIcon, Maximize2, Minimize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useQuotation } from '@/context/QuotationContext';
import { useAgencySettings } from '@/context/AgencySettingsContext';
import { RoomSelection, TransportRoute, Hotel } from '@/types/type';

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
    hotel: Hotel;
  };
}

interface EditableTableData {
  day: string;
  service: string;
  type: 'hotel' | 'transport' | 'custom';
  originalIndex: number;
}

interface EditableInclusionExclusion {
  id: string;
  text: string;
  type: 'inclusion' | 'exclusion';
  category: 'accommodation' | 'meals' | 'transport' | 'activities' | 'general';
  isEditing?: boolean;
}

interface EditableTerm {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'payment' | 'cancellation' | 'liability';
  isEditing?: boolean;
}

export default function PreviewExportStep({ data, prevStep }: PreviewExportStepProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editableItinerary, setEditableItinerary] = useState<EditableTableData[]>([]);
  const [editableInclusionsExclusions, setEditableInclusionsExclusions] = useState<EditableInclusionExclusion[]>([]);
  const [editableTerms, setEditableTerms] = useState<EditableTerm[]>([]);
  const [totalPages, setTotalPages] = useState(6);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [printMode, setPrintMode] = useState(false);
  
  const { 
    quotationData, 
    clientName, 
    startDate, 
    endDate, 
    tripDestination, 
    travelers,
    daySelections,
    dayMeals,
    exportQuotationData,
    finalGrandTotal,
    transportRoutes,
    getDaySelectionsArray,
    dayItineraries,
    getInclusions,
    getExclusions,
    getInclusionsByCategory,
    getExclusionsByCategory,
    termsConditions,
    getTermsByCategory,
    updateInclusionExclusion,
    addInclusionExclusion,
    deleteInclusionExclusion,
    updateTermsCondition,
    addTermsCondition,
    deleteTermsCondition
  } = useQuotation();

  const { agencySettings } = useAgencySettings();

  const [exportData, setExportData] = useState<any>(null);

  useEffect(() => {
    const data = exportQuotationData();
    setExportData(data);
  }, [exportQuotationData]);

  // Initialize editable data
  useEffect(() => {
    // Initialize itinerary data
    const originalItinerary: EditableTableData[] = [];
    
    Object.entries(daySelections).forEach(([date, dayData], index) => {
      if (dayData.hotel) {
        const dayNumber = getDayNumber(date);
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
        
        originalItinerary.push({
          day: `${getOrdinalSuffix(dayNumber)} Day\n${dateStr}`,
          service: `Hotel Stay: ${dayData.hotel.name}`,
          type: 'hotel',
          originalIndex: index
        });
      }
    });

    transportRoutes.forEach((route, index) => {
      const dayNumber = route.dayNumber;
      const date = new Date(startDate || new Date());
      date.setDate(date.getDate() + (dayNumber - 1));
      const dateStr = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      
      const serviceDescription = getTransportServiceDescription(route);
      
      originalItinerary.push({
        day: `${getOrdinalSuffix(dayNumber)} Day\n${dateStr}`,
        service: serviceDescription,
        type: 'transport',
        originalIndex: index
      });
    });

    setEditableItinerary(originalItinerary);

    // Initialize inclusions/exclusions data
    const inclusions = getInclusions();
    const exclusions = getExclusions();
    const allInclusionsExclusions: EditableInclusionExclusion[] = [
      ...inclusions.map(item => ({ ...item, isEditing: false })),
      ...exclusions.map(item => ({ ...item, isEditing: false }))
    ];
    setEditableInclusionsExclusions(allInclusionsExclusions);

    // Initialize terms data
    const terms: EditableTerm[] = termsConditions.map(term => ({ ...term, isEditing: false }));
    setEditableTerms(terms);

  }, [daySelections, transportRoutes, termsConditions, getInclusions, getExclusions]);

  // Calculate total pages based on content
  useEffect(() => {
    let pages = 4; // Minimum pages (Cover, Quotation, Hotels, Itinerary)
    
    const hotelEntries = Object.entries(daySelections).filter(([_, dayData]) => dayData.hotel);
    const hasDayItineraries = dayItineraries && dayItineraries.length > 0;
    const hasInclusionsExclusions = editableInclusionsExclusions.length > 0;
    const hasTerms = editableTerms.length > 0;
    
    if (hotelEntries.length > 0) {
      pages = 3 + Math.ceil(hotelEntries.length / 2);
    } else {
      pages = 3;
    }
    
    // Add pages for day itineraries if they exist
    if (hasDayItineraries) {
      pages += Math.ceil(dayItineraries.length / 2);
    }
    
    // Add pages for inclusions/exclusions and terms
    if (hasInclusionsExclusions) {
      pages += 1;
    }
    
    if (hasTerms) {
      pages += 1;
    }
    
    setTotalPages(pages);
  }, [daySelections, dayItineraries, editableInclusionsExclusions, editableTerms]);

  // Handle Full Screen Preview
  const handleFullScreenPreview = () => {
    setIsFullScreen(true);
    // Scroll to top when entering full screen
    window.scrollTo(0, 0);
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
    setPrintMode(false);
  };

  // Handle Print
  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      // Reset print mode after a delay
      setTimeout(() => setPrintMode(false), 1000);
    }, 100);
  };

  // Add keyboard shortcut for print (Ctrl+P)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault();
        handlePrint();
      }
      // Escape key to exit full screen
      if (event.key === 'Escape' && isFullScreen) {
        handleExitFullScreen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isFullScreen]);

  // Day Itinerary Section Component
  const DayItinerarySection = ({ pageNum }: { pageNum: number }) => {
    if (!dayItineraries || dayItineraries.length === 0) {
      return null;
    }

    const startIndex = (pageNum - getDayItinerariesStartPage()) * 2;
    const pageItineraries = dayItineraries.slice(startIndex, startIndex + 2);

    return (
      <div className="space-y-8">
        {pageItineraries.map((itinerary, index) => {
          const dayNumber = itinerary.dayNumber;
          const date = new Date(itinerary.date);
          const fullDate = date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          
          const dayOrdinal = getOrdinalSuffix(dayNumber);

          return (
            <div key={itinerary.id} className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className='bg-blue-200 text-blue-800 px-3 py-1 rounded-sm border-2 border-blue-600 text-sm font-semibold'>
                    {dayOrdinal} Day
                  </span>
                  <span className='text-[16px] text-gray-700 font-semibold'>
                    {fullDate}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-blue-700">
                  {itinerary.title || `Day ${dayNumber} Itinerary`}
                </h4>
              </div>

              <div className="mb-6">
                <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={itinerary.image || "https://images.unsplash.com/photo-1588418076147-8e56c8e3d0c6?w=800&h=400&fit=crop&auto=format"}
                    alt={itinerary.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1588418076147-8e56c8e3d0c6?w=800&h=400&fit=crop&auto=format';
                    }}
                  />
                </div>
              </div>

              <div>
                <p className="text-[15px] text-gray-700 leading-relaxed">
                  {itinerary.description || 'No description provided for this day.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Inclusions & Exclusions Section Component - Simple & Elegant
  const InclusionsExclusionsSection = () => {
    const inclusions = editableInclusionsExclusions.filter(item => item.type === 'inclusion');
    const exclusions = editableInclusionsExclusions.filter(item => item.type === 'exclusion');
    
    const hasInclusions = inclusions.length > 0;
    const hasExclusions = exclusions.length > 0;

    const handleAddInclusionExclusion = (type: 'inclusion' | 'exclusion') => {
      const newItem: EditableInclusionExclusion = {
        id: `new_${Date.now()}`,
        text: 'New item',
        type,
        category: 'general',
        isEditing: true
      };
      setEditableInclusionsExclusions(prev => [...prev, newItem]);
    };

    const handleEditInclusionExclusion = (id: string) => {
      setEditableInclusionsExclusions(prev =>
        prev.map(item =>
          item.id === id ? { ...item, isEditing: true } : item
        )
      );
    };

    const handleSaveInclusionExclusion = (id: string, updates: Partial<EditableInclusionExclusion>) => {
      const item = editableInclusionsExclusions.find(item => item.id === id);
      if (!item) return;

      if (item.id.startsWith('new_')) {
        // Add new item
        addInclusionExclusion({
          text: updates.text || item.text,
          type: updates.type || item.type,
          category: updates.category || item.category
        });
        setEditableInclusionsExclusions(prev =>
          prev.filter(item => item.id !== id)
        );
      } else {
        // Update existing item
        updateInclusionExclusion(id, updates);
        setEditableInclusionsExclusions(prev =>
          prev.map(item =>
            item.id === id ? { ...item, ...updates, isEditing: false } : item
          )
        );
      }
    };

    const handleDeleteInclusionExclusion = (id: string) => {
      if (!id.startsWith('new_')) {
        deleteInclusionExclusion(id);
      }
      setEditableInclusionsExclusions(prev =>
        prev.filter(item => item.id !== id)
      );
    };

    const handleCancelEdit = (id: string) => {
      if (id.startsWith('new_')) {
        // Remove new item if canceled
        setEditableInclusionsExclusions(prev =>
          prev.filter(item => item.id !== id)
        );
      } else {
        // Just cancel editing for existing item
        setEditableInclusionsExclusions(prev =>
          prev.map(item =>
            item.id === id ? { ...item, isEditing: false } : item
          )
        );
      }
    };

    const EditableItem = ({ item }: { item: EditableInclusionExclusion }) => {
      const [text, setText] = useState(item.text);
      const [category, setCategory] = useState(item.category);
      const [type, setType] = useState(item.type);

      const handleSave = () => {
        handleSaveInclusionExclusion(item.id, { text, category, type });
      };

      const handleCancel = () => {
        handleCancelEdit(item.id);
      };

      if (item.isEditing) {
        return (
          <div className="flex items-start gap-4 p-4 bg-white rounded-lg border-2 border-blue-200">
            <div className="flex-1 space-y-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none text-sm"
                rows={3}
                placeholder="Enter item description..."
              />
              <div className="flex gap-3">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'inclusion' | 'exclusion')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="inclusion">Inclusion</option>
                  <option value="exclusion">Exclusion</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="accommodation">Accommodation</option>
                  <option value="meals">Meals</option>
                  <option value="transport">Transport</option>
                  <option value="activities">Activities</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="p-2 text-green-600 rounded-lg"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-red-600 rounded-lg"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      }

      return (
        <li className="flex items-start gap-4 p-3 bg-white rounded-lg">
          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
            item.type === 'inclusion' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {item.type === 'inclusion' ? (
              <Check className="w-3 h-3" />
            ) : (
              <X className="w-3 h-3" />
            )}
          </div>
          <span className="text-gray-700 text-[15px] leading-relaxed flex-1">
            {item.text}
          </span>
          {isEditingMode && (
            <div className="flex gap-1">
              <button
                onClick={() => handleEditInclusionExclusion(item.id)}
                className="p-1 text-blue-600"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteInclusionExclusion(item.id)}
                className="p-1 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </li>
      );
    };

    return (
      <div className="space-y-6">
        {/* Inclusions Section */}
        {hasInclusions && (
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Inclusions</h3>
                  <p className="text-gray-500 text-sm">What's included in your package</p>
                </div>
              </div>
              {isEditingMode && (
                <button
                  onClick={() => handleAddInclusionExclusion('inclusion')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Inclusion</span>
                </button>
              )}
            </div>
            
            {/* Inclusions List */}
            <div className="space-y-2">
              <ul className="space-y-2">
                {inclusions.map((item) => (
                  <EditableItem key={item.id} item={item} />
                ))}
                {inclusions.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-gray-500">No inclusions added yet</p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Exclusions Section */}
        {hasExclusions && (
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Exclusions</h3>
                  <p className="text-gray-500 text-sm">What's not included in your package</p>
                </div>
              </div>
              {isEditingMode && (
                <button
                  onClick={() => handleAddInclusionExclusion('exclusion')}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Exclusion</span>
                </button>
              )}
            </div>
            
            {/* Exclusions List */}
            <div className="space-y-2">
              <ul className="space-y-2">
                {exclusions.map((item) => (
                  <EditableItem key={item.id} item={item} />
                ))}
                {exclusions.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <X className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-gray-500">No exclusions added yet</p>
                  </div>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Terms & Conditions Section Component
  const TermsConditionsSection = () => {
    const termsByCategory = {
      general: editableTerms.filter(term => term.category === 'general'),
      payment: editableTerms.filter(term => term.category === 'payment'),
      cancellation: editableTerms.filter(term => term.category === 'cancellation'),
      liability: editableTerms.filter(term => term.category === 'liability')
    };

    const hasTerms = editableTerms.length > 0;

    const handleAddTerm = () => {
      const newTerm: EditableTerm = {
        id: `new_${Date.now()}`,
        title: 'New Term',
        content: 'Term content',
        category: 'general',
        isEditing: true
      };
      setEditableTerms(prev => [...prev, newTerm]);
    };

    const handleEditTerm = (id: string) => {
      setEditableTerms(prev =>
        prev.map(term =>
          term.id === id ? { ...term, isEditing: true } : term
        )
      );
    };

    const handleSaveTerm = (id: string, updates: Partial<EditableTerm>) => {
      const term = editableTerms.find(term => term.id === id);
      if (!term) return;

      if (term.id.startsWith('new_')) {
        // Add new term
        addTermsCondition({
          title: updates.title || term.title,
          content: updates.content || term.content,
          category: updates.category || term.category
        });
        setEditableTerms(prev =>
          prev.filter(term => term.id !== id)
        );
      } else {
        // Update existing term
        updateTermsCondition(id, updates);
        setEditableTerms(prev =>
          prev.map(term =>
            term.id === id ? { ...term, ...updates, isEditing: false } : term
          )
        );
      }
    };

    const handleDeleteTerm = (id: string) => {
      if (!id.startsWith('new_')) {
        deleteTermsCondition(id);
      }
      setEditableTerms(prev =>
        prev.filter(term => term.id !== id)
      );
    };

    const handleCancelEdit = (id: string) => {
      if (id.startsWith('new_')) {
        // Remove new term if canceled
        setEditableTerms(prev =>
          prev.filter(term => term.id !== id)
        );
      } else {
        // Just cancel editing for existing term
        setEditableTerms(prev =>
          prev.map(term =>
            term.id === id ? { ...term, isEditing: false } : term
          )
        );
      }
    };

    const EditableTermItem = ({ term }: { term: EditableTerm }) => {
      const [title, setTitle] = useState(term.title);
      const [content, setContent] = useState(term.content);
      const [category, setCategory] = useState(term.category);

      const handleSave = () => {
        handleSaveTerm(term.id, { title, content, category });
      };

      const handleCancel = () => {
        handleCancelEdit(term.id);
      };

      if (term.isEditing) {
        return (
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-semibold"
                placeholder="Term title"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded resize-none"
                rows={3}
                placeholder="Term content"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="general">General</option>
                <option value="payment">Payment</option>
                <option value="cancellation">Cancellation</option>
                <option value="liability">Liability</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="bg-white rounded-lg p-4 border border-blue-100 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="font-semibold text-gray-800 mb-2">{term.title}</h5>
              <p className="text-gray-600 text-sm leading-relaxed">{term.content}</p>
            </div>
            {isEditingMode && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                <button
                  onClick={() => handleEditTerm(term.id)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTerm(term.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-blue-800">Terms & Conditions</h3>
          </div>
          {isEditingMode && (
            <button
              onClick={handleAddTerm}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Term
            </button>
          )}
        </div>
        
        <div className="space-y-6">
          {Object.entries(termsByCategory).map(([category, terms]) => {
            if (terms.length === 0) return null;
            
            const categoryTitles = {
              general: 'General Terms',
              payment: 'Payment Terms',
              cancellation: 'Cancellation Policy',
              liability: 'Liability & Insurance'
            };
            
            return (
              <div key={category} className="space-y-4">
                <h4 className="font-semibold text-blue-700 text-lg border-b border-blue-200 pb-2">
                  {categoryTitles[category as keyof typeof categoryTitles]}
                </h4>
                <div className="space-y-3">
                  {terms.map((term) => (
                    <EditableTermItem key={term.id} term={term} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleExport = async (format: 'email' | 'whatsapp') => {
    alert(`Exporting quotation as ${format.toUpperCase()}`);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
    
    const mealsFromContext = dayMeals[date] || [];
    const mealsFromSelections = daySelection.meals || [];
    const allMeals = [...mealsFromContext, ...mealsFromSelections];
    
    const mealPlan = allMeals.length > 0 
      ? `Includes ${allMeals.length} meals: ${allMeals.map(meal => meal.type?.toLowerCase() || 'meal').join(', ')}`
      : 'No meals included';

    return {
      hotelName: hotel.name,
      roomSelections: roomSelections,
      starRating: hotel.starCategory || 3,
      travelers: travelers,
      mealPlan: mealPlan,
      hotelImage: hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : null,
      hotel: hotel
    };
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

  const getTransportServiceDescription = (route: TransportRoute): string => {
    const from = route.from || 'Pickup';
    const to = route.to || 'Destination';
    
    switch (route.type) {
      case 'pickup':
        return `Pickup from ${from} to ${to}`;
      case 'drop':
        return `Drop from ${from} to ${to}`;
      case 'transfer':
        return `Transfer from ${from} to ${to}`;
      case 'sightseeing':
        return `Sightseeing: ${from} to ${to}`;
      default:
        return `Transport: ${from} to ${to}`;
    }
  };

  // Hotel-specific activities
  const hotelActivities = [
    {
      id: "act-1",
      name: "Welcome Cake Cutting",
      description: "Special welcome cake cutting ceremony with personalized message",
      price: 1500,
      duration: "30 minutes",
      category: "celebration",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
      agencyId: "HTL1"
    },
    {
      id: "act-2",
      name: "Grand Welcome Entry",
      description: "Royal welcome with traditional music and flower shower",
      price: 2500,
      duration: "45 minutes",
      category: "welcome",
      image: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=400&h=300&fit=crop",
      agencyId: "HTL1"
    }
  ];

  const getHotelActivities = (hotelId: string) => {
    return hotelActivities.filter(activity => activity.agencyId === hotelId);
  };

  const getDestinationImages = (): string[] => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop'
    ];
    return defaultImages;
  };

  const formatGuestInfo = (selection: RoomSelection): string => {
    let guestInfo = `${selection.adults}A`;
    if (selection.childrenWithBed > 0) guestInfo += ` + ${selection.childrenWithBed}C`;
    if (selection.childrenWithoutBed > 0) guestInfo += ` + ${selection.childrenWithoutBed}C (no bed)`;
    if (selection.adultsWithExtraBed > 0) guestInfo += ` + ${selection.adultsWithExtraBed}A (extra bed)`;
    return guestInfo;
  };

  // Itinerary editing functions
  const handleItineraryChange = (index: number, field: 'day' | 'service', value: string) => {
    const updatedItinerary = [...editableItinerary];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value
    };
    setEditableItinerary(updatedItinerary);
  };

  const handleAddItineraryRow = () => {
    const newRow: EditableTableData = {
      day: 'New Day',
      service: 'New Service',
      type: 'custom',
      originalIndex: -1
    };
    setEditableItinerary([...editableItinerary, newRow]);
  };

  const handleDeleteItineraryRow = (index: number) => {
    const updatedItinerary = editableItinerary.filter((_, i) => i !== index);
    setEditableItinerary(updatedItinerary);
  };

  const getHotelEntries = () => {
    return Object.entries(daySelections).filter(([_, dayData]) => dayData.hotel);
  };

  const isHotelsPage = (pageNum: number): boolean => {
    const hotelEntries = getHotelEntries();
    if (hotelEntries.length === 0) return false;
    
    const hotelPages = Math.ceil(hotelEntries.length / 2);
    return pageNum >= 3 && pageNum < 3 + hotelPages;
  };

  const getHotelsForPage = (pageNum: number) => {
    const hotelEntries = getHotelEntries();
    if (!isHotelsPage(pageNum)) return [];
    
    const pageIndex = pageNum - 3;
    const startIndex = pageIndex * 2;
    return hotelEntries.slice(startIndex, startIndex + 2);
  };

  const getItineraryPageNumber = (): number => {
    const hotelEntries = getHotelEntries();
    const hotelPages = Math.ceil(hotelEntries.length / 2);
    return 3 + hotelPages;
  };

  const getDayItinerariesStartPage = (): number => {
    const hotelEntries = getHotelEntries();
    const hotelPages = Math.ceil(hotelEntries.length / 2);
    return 3 + hotelPages + 1; // Day itineraries come after brief itinerary
  };

  const isDayItinerariesPage = (pageNum: number): boolean => {
    if (!dayItineraries || dayItineraries.length === 0) return false;
    
    const startPage = getDayItinerariesStartPage();
    const dayItineraryPages = Math.ceil(dayItineraries.length / 2);
    return pageNum >= startPage && pageNum < startPage + dayItineraryPages;
  };

  const getDayItinerariesForPage = (pageNum: number) => {
    if (!isDayItinerariesPage(pageNum)) return [];
    
    const startPage = getDayItinerariesStartPage();
    const pageIndex = pageNum - startPage;
    const startIndex = pageIndex * 2;
    return dayItineraries.slice(startIndex, startIndex + 2);
  };

  const getInclusionsExclusionsPageNumber = (): number => {
    const hotelEntries = getHotelEntries();
    const hotelPages = Math.ceil(hotelEntries.length / 2);
    const dayItineraryPages = dayItineraries ? Math.ceil(dayItineraries.length / 2) : 0;
    return 3 + hotelPages + 1 + dayItineraryPages;
  };

  const getTermsConditionsPageNumber = (): number => {
    const hasInclusionsExclusions = editableInclusionsExclusions.length > 0;
    const basePage = getInclusionsExclusionsPageNumber();
    return hasInclusionsExclusions ? basePage + 1 : basePage;
  };

  const destinationImages = getDestinationImages();
  const hotelEntries = getHotelEntries();
  const itineraryPageNumber = getItineraryPageNumber();
  const dayItinerariesStartPage = getDayItinerariesStartPage();
  const inclusionsExclusionsPageNumber = getInclusionsExclusionsPageNumber();
  const termsConditionsPageNumber = getTermsConditionsPageNumber();

  // Function to render all pages for print
  const renderAllPagesForPrint = () => {
    const allPages = [];

    // Page 1 - Destination Cover Page
    allPages.push(
      <div key="page-1" className="w-[210mm] h-[297mm] bg-white shadow-2xl mx-auto border border-gray-300 page-break">
        <div 
          className="w-full h-full flex flex-col relative"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=794&h=1123&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
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
      </div>
    );

    // Page 2 - Quotation Letter
    allPages.push(
      <div key="page-2" className="w-[210mm] h-[297mm] bg-white shadow-2xl mx-auto border border-gray-300 page-break p-12">
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
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="border border-blue-500 p-3 text-left font-semibold">DESTINATION</th>
                  <th className="border border-blue-500 p-3 text-left font-semibold">START DATE</th>
                  <th className="border border-blue-500 p-3 text-left font-semibold">END DATE</th>
                  <th className="border border-blue-500 p-3 text-left font-semibold">DURATION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-blue-300 p-3 font-medium text-blue-800">{tripDestination || 'Destination'}</td>
                  <td className="border border-blue-300 p-3 text-blue-700">
                    {startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Start Date'}
                  </td>
                  <td className="border border-blue-300 p-3 text-blue-700">
                    {endDate ? new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'End Date'}
                  </td>
                  <td className="border border-blue-300 p-3 text-blue-700">{getTripDuration()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Price Section */}
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
    );

    // Hotels & Accommodations Pages
    if (hotelEntries.length > 0) {
      const hotelPages = Math.ceil(hotelEntries.length / 2);
      for (let pageNum = 0; pageNum < hotelPages; pageNum++) {
        const startIndex = pageNum * 2;
        const pageHotels = hotelEntries.slice(startIndex, startIndex + 2);
        
        allPages.push(
          <div key={`hotels-${pageNum}`} className="w-[210mm] h-[297mm] bg-white shadow-2xl mx-auto border border-gray-300 page-break p-12">
            {/* Section Header */}
            <div className="mb-8">
              <div className="relative">
                <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-[6px] h-15 bg-blue-600"></div>
                    <h2 className="text-2xl font-bold text-blue-800 text-center flex-1 py-2">
                      {pageNum === 0 ? 'Hotels / Accommodations' : `Hotels / Accommodations (Continued)`}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Individual Hotel Listings */}
            <div className="space-y-8">
              {pageHotels.map(([date, dayData], index) => {
                if (!dayData.hotel) return null;
                
                const hotelInfo = getHotelInfoForDay(date);
                if (!hotelInfo) return null;
                
                const dayNumber = getDayNumber(date);
                const ordinalSuffix = getOrdinalSuffix(dayNumber);
                const checkinDate = getCheckinDate(date);
                
                return (
                  <div key={`${date}-${index}`} className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="flex gap-6">
                      <div className="flex-1">
                        {/* Days Header */}
                        <div className="mb-6">
                          <h3 className="text-lg mb-2 text-gray-600 font-semibold">
                            <span className='bg-blue-200 text-blue-800 p-2 rounded-sm border-2 border-blue-600'>
                              {ordinalSuffix} Day
                            </span> 
                            {' '}Night at {tripDestination}
                          </h3>
                          <span className='text-[10px] text-gray-500 font-light'>
                            check-in on {checkinDate}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
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

                            <div>
                              <p className="text-xs text-gray-500 font-semibold mb-2">ROOMS</p>
                              {hotelInfo.roomSelections && hotelInfo.roomSelections.length > 0 ? (
                                <div className="space-y-2">
                                  {hotelInfo.roomSelections.map((selection: RoomSelection, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between py-1">
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">
                                          {selection.roomCount} × {selection.roomType || `Room Type ${selection.roomId}`}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                          {formatGuestInfo(selection)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm font-medium text-gray-500">No rooms selected</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs text-gray-500 font-semibold mb-2">MEAL PLAN</p>
                              <p className="text-sm font-medium text-gray-500">{hotelInfo.mealPlan}</p>
                            </div>
                            
                            {/* Activities Summary */}
                            {hotelInfo.hotel && getHotelActivities(hotelInfo.hotel.id).length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 font-semibold mb-2">ACTIVITIES</p>
                                <div className="space-y-2">
                                  {getHotelActivities(hotelInfo.hotel.id).map((activity, activityIndex) => (
                                    <div key={activityIndex} className="flex items-center text-xs text-gray-600">
                                      <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                                      <span>{activity.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Hotel Image */}
                      <div className="w-48">
                        <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={hotelInfo.hotelImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"}
                            alt={hotelInfo.hotelName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    }

    // Brief Itinerary Page
    allPages.push(
      <div key="brief-itinerary" className="w-[210mm] h-[297mm] bg-white shadow-2xl mx-auto border border-gray-300 page-break p-12">
        {/* Section Header */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="flex items-center">
                <div className="w-[6px] h-15 bg-blue-600"></div>
                <h2 className="text-2xl font-bold text-blue-800 text-center flex-1 py-2">
                  BRIEF ITINERARY
                </h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border border-blue-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="border border-blue-500 p-4 text-left font-semibold">Day</th>
                <th className="border border-blue-500 p-4 text-left font-semibold">Service</th>
              </tr>
            </thead>
            <tbody>
              {editableItinerary.length > 0 ? (
                editableItinerary.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="border border-blue-300 p-4 font-medium text-blue-800 whitespace-pre-line">
                      {item.day}
                    </td>
                    <td className="border border-blue-300 p-4 text-gray-700">
                      {item.service}
                      {item.type === 'transport' && transportRoutes[item.originalIndex]?.isComplimentary && (
                        <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Complimentary
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="border border-blue-300 p-8 text-center text-gray-500">
                    <div className="text-4xl mb-2">📅</div>
                    <p>No itinerary items configured</p>
                    <p className="text-sm mt-1">Itinerary information will appear here once trip details are added</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );

    // Day Itineraries Pages
    if (dayItineraries && dayItineraries.length > 0) {
      const dayItineraryPages = Math.ceil(dayItineraries.length / 2);
      for (let pageNum = 0; pageNum < dayItineraryPages; pageNum++) {
        const startIndex = pageNum * 2;
        const pageItineraries = dayItineraries.slice(startIndex, startIndex + 2);
        
        allPages.push(
          <div key={`day-itineraries-${pageNum}`} className="w-[210mm] h-[297mm] bg-white shadow-2xl mx-auto border border-gray-300 page-break p-12">
            {/* Section Header */}
            <div className="mb-8">
              <div className="relative">
                <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-[6px] h-15 bg-blue-600"></div>
                    <h2 className="text-2xl font-bold text-blue-800 text-center flex-1 py-2">
                      {pageNum === 0 ? 'Day Wise Itinerary' : `Day Wise Itinerary (Continued)`}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Day Itinerary Section */}
            <div className="space-y-8">
              {pageItineraries.map((itinerary, index) => {
                const dayNumber = itinerary.dayNumber;
                const date = new Date(itinerary.date);
                const fullDate = date.toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });
                
                const dayOrdinal = getOrdinalSuffix(dayNumber);

                return (
                  <div key={itinerary.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className='bg-blue-200 text-blue-800 px-3 py-1 rounded-sm border-2 border-blue-600 text-sm font-semibold'>
                          {dayOrdinal} Day
                        </span>
                        <span className='text-[16px] text-gray-700 font-semibold'>
                          {fullDate}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-2xl font-bold text-blue-700">
                        {itinerary.title || `Day ${dayNumber} Itinerary`}
                      </h4>
                    </div>

                    <div className="mb-6">
                      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={itinerary.image || "https://images.unsplash.com/photo-1588418076147-8e56c8e3d0c6?w=800&h=400&fit=crop&auto=format"}
                          alt={itinerary.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1588418076147-8e56c8e3d0c6?w=800&h=400&fit=crop&auto=format';
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-[15px] text-gray-700 leading-relaxed">
                        {itinerary.description || 'No description provided for this day.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    }

    // Inclusions & Exclusions Page
    if (editableInclusionsExclusions.length > 0) {
      allPages.push(
        <div key="inclusions-exclusions" className="w-[210mm] h-[297mm] bg-white shadow-2xl mx-auto border border-gray-300 page-break p-12">
          {/* Section Header */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center">
                  <div className="w-[6px] h-15 bg-blue-600"></div>
                  <h2 className="text-2xl font-bold text-blue-800 text-center flex-1 py-2">
                    Package Inclusions & Exclusions
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Inclusions & Exclusions Section */}
          <InclusionsExclusionsSection />
        </div>
      );
    }

    // Terms & Conditions Page
    if (editableTerms.length > 0) {
      allPages.push(
        <div key="terms-conditions" className="w-[210mm] h-[297mm] bg-white shadow-2xl mx-auto border border-gray-300 page-break p-12">
          {/* Section Header */}
          <div className="mb-8">
            <div className="relative">
              <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center">
                  <div className="w-[6px] h-15 bg-blue-600"></div>
                  <h2 className="text-2xl font-bold text-blue-800 text-center flex-1 py-2">
                    Terms & Conditions
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Section */}
          <TermsConditionsSection />
        </div>
      );
    }

    return allPages;
  };

  // Full Screen Preview Component
  const FullScreenPreview = () => {
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
      setIsPrinting(true);
      setTimeout(() => {
        window.print();
        setTimeout(() => setIsPrinting(false), 1000);
      }, 500);
    };

    const handleExitFullScreen = () => {
      setIsFullScreen(false);
      setIsPrinting(false);
    };

    // Add keyboard shortcut for print (Ctrl+P)
    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
          event.preventDefault();
          handlePrint();
        }
        if (event.key === 'Escape') {
          handleExitFullScreen();
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
      <div className={`fixed inset-0 bg-white z-50 overflow-y-auto ${isPrinting ? 'print-mode' : ''}`}>
        {/* Header Bar - Hidden in Print Mode */}
        {!isPrinting && (
          <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm print:hidden">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <h1 className="text-xl font-bold text-gray-800">Quotation Preview</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <Download className="w-4 h-4" />
                  Print (Ctrl+P)
                </button>
                <button
                  onClick={handleExitFullScreen}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  <Minimize2 className="w-4 h-4" />
                  Exit (ESC)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PDF-like Pages Container */}
        <div className={`py-8 px-4 max-w-4xl mx-auto space-y-8 ${isPrinting ? 'py-0 space-y-0' : ''}`}>
          {renderAllPagesForPrint()}
        </div>
      </div>
    );
  };

  // If in full screen mode, show only the full screen preview
  if (isFullScreen) {
    return <FullScreenPreview />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-gray-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-10">
        
        {/* Main Content - A4 Size Container */}
        <div className="w-[210mm] bg-gray-50 shadow-2xl overflow-hidden mx-auto border border-gray-300">
          
          {/* Page 1 - Destination Cover Page */}
          <div 
            id="page-1"
            className={`min-h-[297mm] flex flex-col relative ${currentPage !== 1 ? 'hidden' : ''}`}
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=794&h=1123&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
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

          {/* Page 2 - Quotation Letter */}
          <div 
            id="page-2"
            className={`min-h-[297mm] p-12 bg-white ${currentPage !== 2 ? 'hidden' : ''}`}
          >
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
                    <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <th className="border border-blue-500 p-3 text-left font-semibold">DESTINATION</th>
                      <th className="border border-blue-500 p-3 text-left font-semibold">START DATE</th>
                      <th className="border border-blue-500 p-3 text-left font-semibold">END DATE</th>
                      <th className="border border-blue-500 p-3 text-left font-semibold">DURATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-blue-300 p-3 font-medium text-blue-800">{tripDestination || 'Destination'}</td>
                      <td className="border border-blue-300 p-3 text-blue-700">
                        {startDate ? new Date(startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Start Date'}
                      </td>
                      <td className="border border-blue-300 p-3 text-blue-700">
                        {endDate ? new Date(endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'End Date'}
                      </td>
                      <td className="border border-blue-300 p-3 text-blue-700">{getTripDuration()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Price Section */}
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

          {/* Hotels & Accommodations Pages */}
          {hotelEntries.length > 0 && Array.from({ length: Math.ceil(hotelEntries.length / 2) }, (_, i) => i + 3).map((pageNum) => (
            <div
              key={pageNum}
              id={`page-${pageNum}`}
              className={`min-h-[297mm] p-12 bg-white ${currentPage !== pageNum ? 'hidden' : ''}`}
            >
              {/* Section Header with Integrated Blue Vertical Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 ">
                    <div className="flex items-center ">
                      <div className="w-[6px] h-15 bg-blue-600  "></div>
                      <h2 className="text-2xl font-bold text-blue-800 text-center flex-1  py-2">
                        {pageNum === 3 ? 'Hotels / Accommodations' : `Hotels / Accommodations (Continued)`}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Individual Hotel Listings for Current Page */}
              <div className="space-y-8">
                {getHotelsForPage(pageNum).map(([date, dayData], index) => {
                  if (!dayData.hotel) return null;
                  
                  const hotelInfo = getHotelInfoForDay(date);
                  if (!hotelInfo) return null;
                  
                  const dayNumber = getDayNumber(date);
                  const ordinalSuffix = getOrdinalSuffix(dayNumber);
                  const checkinDate = getCheckinDate(date);
                  
                  return (
                    <div key={`${date}-${index}`} className="border border-gray-200 rounded-lg p-6 bg-white">
                      <div className="flex gap-6">
                        <div className="flex-1">
                          {/* Days Header */}
                          <div className="mb-6">
                            <h3 className="text-lg mb-2 text-gray-600 font-semibold">
                              <span className='bg-blue-200 text-blue-800 p-2 rounded-sm border-2 border-blue-600'>
                                {ordinalSuffix} Day
                              </span> 
                              {' '}Night at {tripDestination}
                            </h3>
                            <span className='text-[10px] text-gray-500 font-light'>
                              check-in on {checkinDate}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
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

                              <div>
                                <p className="text-xs text-gray-500 font-semibold mb-2">ROOMS</p>
                                {hotelInfo.roomSelections && hotelInfo.roomSelections.length > 0 ? (
                                  <div className="space-y-2">
                                    {hotelInfo.roomSelections.map((selection: RoomSelection, idx: number) => (
                                      <div key={idx} className="flex items-center justify-between py-1">
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">
                                            {selection.roomCount} × {selection.roomType || `Room Type ${selection.roomId}`}
                                          </p>
                                          <p className="text-xs text-gray-600">
                                            {formatGuestInfo(selection)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm font-medium text-gray-500">No rooms selected</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <p className="text-xs text-gray-500 font-semibold mb-2">MEAL PLAN</p>
                                <p className="text-sm font-medium text-gray-500">{hotelInfo.mealPlan}</p>
                              </div>
                              
                              {/* Activities Summary - Show ALL activities without +1 more */}
                              {hotelInfo.hotel && getHotelActivities(hotelInfo.hotel.id).length > 0 && (
                                <div>
                                  <p className="text-xs text-gray-500 font-semibold mb-2">ACTIVITIES</p>
                                  <div className="space-y-2">
                                    {getHotelActivities(hotelInfo.hotel.id).map((activity, activityIndex) => (
                                      <div key={activityIndex} className="flex items-center text-xs text-gray-600">
                                        <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                                        <span>{activity.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Hotel Image */}
                        <div className="w-48">
                          <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={hotelInfo.hotelImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"}
                              alt={hotelInfo.hotelName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Brief Itinerary Page */}
          <div 
            id={`page-${itineraryPageNumber}`}
            className={`min-h-[297mm] p-12 bg-white ${currentPage !== itineraryPageNumber ? 'hidden' : ''}`}
          >
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
            
            <div className="border border-blue-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="border border-blue-500 p-4 text-left font-semibold">Day</th>
                    <th className="border border-blue-500 p-4 text-left font-semibold">Service</th>
                    {isEditingMode && (
                      <th className="border border-blue-500 p-4 text-left font-semibold">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {editableItinerary.length > 0 ? (
                    editableItinerary.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                        <td className="border border-blue-300 p-4 font-medium text-blue-800 whitespace-pre-line">
                          {isEditingMode ? (
                            <textarea
                              value={item.day}
                              onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded resize-none"
                              rows={2}
                            />
                          ) : (
                            item.day
                          )}
                        </td>
                        <td className="border border-blue-300 p-4 text-gray-700">
                          {isEditingMode ? (
                            <textarea
                              value={item.service}
                              onChange={(e) => handleItineraryChange(index, 'service', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded resize-none"
                              rows={2}
                            />
                          ) : (
                            <>
                              {item.service}
                              {item.type === 'transport' && transportRoutes[item.originalIndex]?.isComplimentary && (
                                <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                  Complimentary
                                </span>
                              )}
                            </>
                          )}
                        </td>
                        {isEditingMode && (
                          <td className="border border-blue-300 p-4">
                            <button
                              onClick={() => handleDeleteItineraryRow(index)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isEditingMode ? 3 : 2} className="border border-blue-300 p-8 text-center text-gray-500">
                        <div className="text-4xl mb-2">📅</div>
                        <p>No itinerary items configured</p>
                        <p className="text-sm mt-1">Itinerary information will appear here once trip details are added</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {isEditingMode && (
                <div className="p-4 border-t border-blue-300 bg-blue-50">
                  <button
                    onClick={handleAddItineraryRow}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Row
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Day Itineraries Pages */}
          {dayItineraries && dayItineraries.length > 0 && 
            Array.from({ length: Math.ceil(dayItineraries.length / 2) }, (_, i) => i + dayItinerariesStartPage).map((pageNum) => (
            <div 
              key={pageNum}
              id={`page-${pageNum}`}
              className={`min-h-[297mm] p-12 bg-white ${currentPage !== pageNum ? 'hidden' : ''}`}
            >
              {/* Section Header with Integrated Blue Vertical Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-[6px] h-15 bg-blue-600"></div>
                      <h2 className="text-2xl font-bold text-blue-800 text-center flex-1 py-2">
                        {pageNum === dayItinerariesStartPage ? 'Day Wise Itinerary' : `Day Wise Itinerary (Continued)`}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day Itinerary Section */}
              <DayItinerarySection pageNum={pageNum} />
            </div>
          ))}

          {/* Inclusions & Exclusions Page */}
          {editableInclusionsExclusions.length > 0 && (
            <div 
              id={`page-${inclusionsExclusionsPageNumber}`}
              className={`min-h-[297mm] p-12 bg-white ${currentPage !== inclusionsExclusionsPageNumber ? 'hidden' : ''}`}
            >
              {/* Section Header with Integrated Blue Vertical Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-[6px] h-15 bg-blue-600"></div>
                      <h2 className="text-2xl font-bold text-blue-800 text-center flex-1 py-2">
                        Package Inclusions & Exclusions
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inclusions & Exclusions Section */}
              <InclusionsExclusionsSection />
            </div>
          )}

          {/* Terms & Conditions Page */}
          {editableTerms.length > 0 && (
            <div 
              id={`page-${termsConditionsPageNumber}`}
              className={`min-h-[297mm] p-12 bg-white ${currentPage !== termsConditionsPageNumber ? 'hidden' : ''}`}
            >
              {/* Section Header with Integrated Blue Vertical Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-center">
                      <div className="w-[6px] h-15 bg-blue-600"></div>
                      <h2 className="text-2xl font-bold text-blue-800 text-center flex-1 py-2">
                        Terms & Conditions
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions Section */}
              <TermsConditionsSection />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          {/* Edit Mode Toggle */}
          <div className="bg-gradient-to-br from-white to-slate-50 p-6 shadow rounded-xl space-y-4 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Edit Mode</h2>
            <button
              onClick={() => setIsEditingMode(!isEditingMode)}
              className={`w-full px-4 py-3 flex items-center justify-center rounded-lg transition ${
                isEditingMode
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Edit className="inline-block mr-2 pb-1" size={22} />
              {isEditingMode ? 'Exit Edit Mode' : 'Edit Quotation'}
            </button>
            {isEditingMode && (
              <p className="text-sm text-gray-600 text-center">
                You can now edit itinerary, inclusions/exclusions, and terms & conditions
              </p>
            )}
          </div>

          {/* Export Options */}
          <div className="bg-gradient-to-br from-white to-slate-50 p-6 shadow rounded-xl space-y-4 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Export Options</h2>
            
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
            >
              <Download className="inline-block mr-2 pb-1" size={22} />
              Print Quotation (Ctrl+P)
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
            
            {/* Full Screen Preview Button */}
            <button
              onClick={handleFullScreenPreview}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Maximize2 className="w-5 h-5" />
              Full Screen Preview
            </button>
            
            {['Save as Draft', 'Duplicate Quotation'].map((action, i) => (
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
                disabled={currentPage === totalPages}
                className={`flex-1 px-4 py-2 rounded-lg transition ${
                  currentPage === totalPages 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
              >
                Next
              </button>
            </div>
            <div className="text-center text-sm text-slate-600">
              Page {currentPage} of {totalPages}
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

      {/* Add print styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .print-mode * {
            visibility: visible !important;
          }
          
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          
          /* Ensure images print properly */
          img {
            max-width: 100% !important;
            height: auto !important;
          }
          
          /* Hide everything except the pages during print */
          body * {
            visibility: hidden;
          }
          
          .print-mode .w-\\[210mm\\],
          .w-\\[210mm\\] {
            visibility: visible !important;
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: 1px solid #ccc !important;
          }
        }
      `}</style>
    </div>
  );
}