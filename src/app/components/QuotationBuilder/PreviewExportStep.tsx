// components/QuotationBuilder/PreviewExportStep.tsx
import { QuotationData } from '../../quotation-builder/page';
import { Download, Mail, Star, Users, Bed, Sparkles, Edit, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useQuotation } from '@/context/QuotationContext';
import { useAgencySettings } from '@/context/AgencySettingsContext';
import { RoomSelection, TransportRoute, Hotel } from '@/types/type';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

// Extended html2canvas options
interface ExtendedHtml2CanvasOptions {
  scale?: number;
  useCORS?: boolean;
  allowTaint?: boolean;
  backgroundColor?: string;
  logging?: boolean;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  scrollX?: number;
  scrollY?: number;
  windowWidth?: number;
  windowHeight?: number;
}

export default function PreviewExportStep({ data, prevStep }: PreviewExportStepProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditingItinerary, setIsEditingItinerary] = useState(false);
  const [editableItinerary, setEditableItinerary] = useState<EditableTableData[]>([]);
  const [totalPages, setTotalPages] = useState(4);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
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
    getDaySelectionsArray
  } = useQuotation();

  const { agencySettings } = useAgencySettings();

  const [exportData, setExportData] = useState<any>(null);

  useEffect(() => {
    const data = exportQuotationData();
    setExportData(data);
  }, [exportQuotationData]);

  // Calculate total pages based on content
  useEffect(() => {
    let pages = 4; // Minimum pages (Cover, Quotation, Hotels, Itinerary)
    
    const hotelEntries = Object.entries(daySelections).filter(([_, dayData]) => dayData.hotel);
    
    if (hotelEntries.length > 0) {
      pages = 3 + Math.ceil(hotelEntries.length / 2);
    } else {
      pages = 3;
    }
    
    setTotalPages(pages);
  }, [daySelections]);

  // Initialize editable itinerary data
  useEffect(() => {
    const itineraryData: EditableTableData[] = [];
    
    Object.entries(daySelections).forEach(([date, dayData], index) => {
      if (dayData.hotel) {
        const dayNumber = getDayNumber(date);
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
        
        itineraryData.push({
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
      
      itineraryData.push({
        day: `${getOrdinalSuffix(dayNumber)} Day\n${dateStr}`,
        service: serviceDescription,
        type: 'transport',
        originalIndex: index
      });
    });

    setEditableItinerary(itineraryData);
  }, [daySelections, transportRoutes, startDate]);

  const handleExport = async (format: 'pdf' | 'email' | 'whatsapp') => {
    if (format === 'pdf') {
      await exportToPDF();
    } else {
      alert(`Exporting quotation as ${format.toUpperCase()}`);
    }
  };

  // Wait for all images to load
  const waitForImagesToLoad = (element: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      const images = element.getElementsByTagName('img');
      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        resolve();
        return;
      }

      const imageLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve();
        }
      };

      Array.from(images).forEach(img => {
        if (img.complete) {
          imageLoaded();
        } else {
          img.addEventListener('load', imageLoaded);
          img.addEventListener('error', imageLoaded); // Continue even if image fails
        }
      });
    });
  };

  const exportToPDF = async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (pageNum > 1) {
          pdf.addPage();
        }
        
        const pageElement = document.getElementById(`page-${pageNum}`) as HTMLElement;
        if (!pageElement) {
          console.warn(`Page ${pageNum} not found`);
          continue;
        }

        // Make the page visible temporarily for capture
        const originalDisplay = pageElement.style.display;
        pageElement.style.display = 'block';
        
        try {
          // Wait for images to load
          await waitForImagesToLoad(pageElement);
          
          // Wait a bit more for any CSS to render
          await new Promise(resolve => setTimeout(resolve, 500));

          const options: ExtendedHtml2CanvasOptions = {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: true, // Enable logging to see what's happening
            width: pageElement.scrollWidth,
            height: pageElement.scrollHeight,
            windowWidth: pageElement.scrollWidth,
            windowHeight: pageElement.scrollHeight,
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0
          };

          console.log(`Capturing page ${pageNum} with dimensions:`, {
            width: pageElement.scrollWidth,
            height: pageElement.scrollHeight
          });

          const canvas = await html2canvas(pageElement, options as any);

          console.log(`Canvas created for page ${pageNum}:`, {
            width: canvas.width,
            height: canvas.height
          });

          if (canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas has zero dimensions');
          }

          const imgData = canvas.toDataURL('image/png', 1.0);
          
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          
          const ratio = Math.min(
            (pdfWidth - 20) / imgWidth,
            (pdfHeight - 20) / imgHeight
          );

          const finalWidth = imgWidth * ratio;
          const finalHeight = imgHeight * ratio;
          
          const x = (pdfWidth - finalWidth) / 2;
          const y = (pdfHeight - finalHeight) / 2;

          console.log(`Adding page ${pageNum} to PDF:`, { x, y, finalWidth, finalHeight });

          pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

        } catch (canvasError) {
          console.error(`Error capturing page ${pageNum}:`, canvasError);
          
          // Try alternative method for this page
          try {
            await capturePageAlternative(pdf, pageElement, pageNum);
          } catch (altError) {
            console.error(`Alternative capture also failed for page ${pageNum}:`, altError);
            // Add simple text content as last resort
            pdf.setFontSize(16);
            pdf.text(`Page ${pageNum} - ${getPageTitle(pageNum)}`, 20, 30);
            pdf.setFontSize(12);
            
            // Extract text content from the page
            const textContent = pageElement.innerText || pageElement.textContent || '';
            const lines = pdf.splitTextToSize(textContent.substring(0, 1000), pdfWidth - 40);
            pdf.text(lines, 20, 50);
          }
        } finally {
          // Restore original display state
          pageElement.style.display = originalDisplay;
        }
      }

      const fileName = `Quotation-${clientName || 'Trip'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try the "Simple Text PDF" option.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Alternative capture method
  const capturePageAlternative = async (pdf: jsPDF, pageElement: HTMLElement, pageNum: number) => {
    const pdfWidth = pdf.internal.pageSize.getWidth();
    
    // Create a temporary container with simpler styling
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '0';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm';
    tempContainer.style.height = '297mm';
    tempContainer.style.background = 'white';
    tempContainer.style.padding = '20px';
    tempContainer.style.zIndex = '10000';
    tempContainer.style.overflow = 'auto';
    
    // Clone and simplify the content
    const clone = pageElement.cloneNode(true) as HTMLElement;
    
    // Remove complex styles that might cause issues
    const removeComplexStyles = (element: HTMLElement) => {
      element.style.backdropFilter = 'none';
      element.style.filter = 'none';
      element.style.transform = 'none';
      
      // But preserve basic colors and layout
      if (element.style.backgroundImage && element.style.backgroundImage.includes('gradient')) {
        // Keep gradients but ensure they're simple
        element.style.backgroundImage = element.style.backgroundImage;
      }
    };

    const allElements = clone.querySelectorAll('*');
    allElements.forEach((el: Element) => {
      if (el instanceof HTMLElement) {
        removeComplexStyles(el);
      }
    });

    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);

    try {
      await waitForImagesToLoad(tempContainer);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const options: ExtendedHtml2CanvasOptions = {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight,
      };

      const canvas = await html2canvas(tempContainer, options as any);
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const ratio = Math.min(
        (pdfWidth - 20) / canvas.width,
        (pdf.internal.pageSize.getHeight() - 20) / canvas.height
      );

      const finalWidth = canvas.width * ratio;
      const finalHeight = canvas.height * ratio;
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdf.internal.pageSize.getHeight() - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  // Get page title for fallback
  const getPageTitle = (pageNum: number): string => {
    switch (pageNum) {
      case 1: return 'Destination Cover';
      case 2: return 'Quotation Letter';
      case 3: return 'Hotels & Accommodations';
      default: 
        if (pageNum <= totalPages - 1) return 'Hotels & Accommodations (Continued)';
        return 'Brief Itinerary';
    }
  };

  // Simple text-only PDF as fallback
  const exportSimplePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    
    let yPosition = 20;
    
    // Cover page
    pdf.setFontSize(20);
    pdf.text('TRAVEL QUOTATION', pdfWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    pdf.setFontSize(16);
    pdf.text(tripDestination || 'Destination', pdfWidth / 2, yPosition, { align: 'center' });
    yPosition += 30;
    
    pdf.setFontSize(12);
    pdf.text(`Client: ${getClientDisplayName()}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Duration: ${getTripDuration()}`, 20, yPosition);
    yPosition += 10;
    pdf.text(`Total: ₹${finalGrandTotal.toLocaleString()}`, 20, yPosition);
    
    pdf.addPage();
    yPosition = 20;
    
    // Quotation letter content
    pdf.setFontSize(14);
    pdf.text('QUOTATION LETTER', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    const letterContent = [
      `Dear ${getClientDisplayName()},`,
      '',
      `Hello from ${agencySettings.agencyName || 'Your Company Name'}!!! We are delighted to send you our`,
      `custom-made quote for your ${getTripDuration()} tour to ${tripDestination || 'your chosen destination'}.`,
      '',
      `Your tour begins on ${startDate ? new Date(startDate).toLocaleDateString('en-GB') : 'selected date'}`,
      `in ${tripDestination || 'your destination'}, and runs over ${getTripDuration()}, ending on`,
      `${endDate ? new Date(endDate).toLocaleDateString('en-GB') : 'selected date'}.`,
      '',
      'We look forward to hearing from you.',
      '',
      'Best regards,',
      agencySettings.agencyName || 'Your Company Name'
    ];
    
    letterContent.forEach(line => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 20, yPosition);
      yPosition += 5;
    });
    
    // Hotels information
    const hotelEntries = Object.entries(daySelections).filter(([_, dayData]) => dayData.hotel);
    if (hotelEntries.length > 0) {
      pdf.addPage();
      yPosition = 20;
      
      pdf.setFontSize(14);
      pdf.text('HOTELS & ACCOMMODATIONS', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(10);
      hotelEntries.forEach(([date, dayData]) => {
        if (dayData.hotel) {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          
          const dayNumber = getDayNumber(date);
          pdf.text(`${getOrdinalSuffix(dayNumber)} Day: ${dayData.hotel.name}`, 20, yPosition);
          yPosition += 5;
          pdf.text(`Check-in: ${getCheckinDate(date)}`, 25, yPosition);
          yPosition += 10;
        }
      });
    }
    
    // Itinerary
    pdf.addPage();
    yPosition = 20;
    
    pdf.setFontSize(14);
    pdf.text('BRIEF ITINERARY', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(10);
    editableItinerary.forEach(item => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      const dayLines = pdf.splitTextToSize(item.day, 40);
      const serviceLines = pdf.splitTextToSize(item.service, pdfWidth - 60);
      
      pdf.text(dayLines, 20, yPosition);
      pdf.text(serviceLines, 60, yPosition);
      yPosition += Math.max(dayLines.length, serviceLines.length) * 5 + 5;
    });

    const fileName = `Quotation-Simple-${clientName || 'Trip'}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  // Rest of the component remains the same...
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

  const handleEditItinerary = () => {
    setIsEditingItinerary(true);
  };

  const handleSaveItinerary = () => {
    setIsEditingItinerary(false);
  };

  const handleCancelEdit = () => {
    setIsEditingItinerary(false);
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
  };

  const handleItineraryChange = (index: number, field: 'day' | 'service', value: string) => {
    const updatedItinerary = [...editableItinerary];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value
    };
    setEditableItinerary(updatedItinerary);
  };

  const handleAddRow = () => {
    const newRow: EditableTableData = {
      day: 'New Day',
      service: 'New Service',
      type: 'custom',
      originalIndex: -1
    };
    setEditableItinerary([...editableItinerary, newRow]);
  };

  const handleDeleteRow = (index: number) => {
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

  const destinationImages = getDestinationImages();
  const hotelEntries = getHotelEntries();
  const itineraryPageNumber = getItineraryPageNumber();

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

          {/* Itinerary Page (Always the last page) */}
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

            {/* Edit Button */}
            <div className="mb-4 flex justify-between items-center">
              <div>
                {!isEditingItinerary ? (
                  <button
                    onClick={handleEditItinerary}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Itinerary
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveItinerary}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              {/* Add Row Button - Only show when editing */}
              {isEditingItinerary && (
                <button
                  onClick={handleAddRow}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Row
                </button>
              )}
            </div>
            
            <div className="border border-blue-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="border border-blue-500 p-4 text-left font-semibold">Day</th>
                    <th className="border border-blue-500 p-4 text-left font-semibold">Service</th>
                    {isEditingItinerary && (
                      <th className="border border-blue-500 p-4 text-left font-semibold">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {editableItinerary.length > 0 ? (
                    editableItinerary.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                        <td className="border border-blue-300 p-4 font-medium text-blue-800 whitespace-pre-line">
                          {isEditingItinerary ? (
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
                          {isEditingItinerary ? (
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
                        {isEditingItinerary && (
                          <td className="border border-blue-300 p-4">
                            <button
                              onClick={() => handleDeleteRow(index)}
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
                      <td colSpan={isEditingItinerary ? 3 : 2} className="border border-blue-300 p-8 text-center text-gray-500">
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
        </div>

        {/* Right Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          {/* Export Options */}
          <div className="bg-gradient-to-br from-white to-slate-50 p-6 shadow rounded-xl space-y-4 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Export Options</h2>
            <button
              onClick={() => handleExport('pdf')}
              disabled={isGeneratingPDF}
              className={`w-full px-4 py-3 flex items-center justify-center rounded-lg transition ${
                isGeneratingPDF 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white'
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="inline-block mr-2 pb-1" size={22} />
                  Download PDF
                </>
              )}
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
            
            <button
              onClick={exportSimplePDF}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition text-sm"
            >
              <Download className="inline-block mr-2 pb-1" size={18} />
              Simple Text PDF
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
    </div>
  );
}