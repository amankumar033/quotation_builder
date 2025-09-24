// components/Common/CustomDatePicker.tsx
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomDatePicker({
  selectedDate,
  onChange,
  placeholder = "dd/MM/yyyy",
  className = "",
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if date is selectable (from today onwards)
  const isDateSelectable = (date: Date) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // start of today
    return date >= todayStart;
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      );
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (isDateSelectable(date)) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className={`relative ${className}`}>
      <div
        className="w-full px-4 py-[14px] border border-gray-300 rounded-lg bg-white text-gray-800 cursor-pointer flex justify-between items-center text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedDate ? "text-gray-800" : "text-gray-400"}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <Calendar className="h-4 w-4 text-gray-400" />
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Calendar Popup */}
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64">
            {/* Calendar Header */}
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1
                    )
                  )
                }
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <div className="font-semibold text-gray-800 text-sm">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </div>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1
                    )
                  )
                }
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-2">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-0 mb-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="text-center text-xs font-medium text-gray-500 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-0">
                {generateCalendarDays().map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="h-7" />;
                  }

                  const isSelectable = isDateSelectable(date);
                  const isSelected =
                    selectedDate &&
                    date.getDate() === selectedDate.getDate() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getFullYear() === selectedDate.getFullYear();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateSelect(date)}
                      disabled={!isSelectable}
                      className={`
                        h-7 rounded text-xs font-medium transition
                        ${
                          isSelected
                            ? "bg-green-500 text-white"
                            : isSelectable
                            ? "text-gray-700 hover:bg-gray-100"
                            : "text-gray-300 cursor-not-allowed"
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
              Only dates from today and onwards are selectable
            </div>
          </div>
        </>
      )}
    </div>
  );
}
