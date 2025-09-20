"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

export default function CustomDatePicker() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  return (
    <div className="w-full relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Date
      </label>

      <DatePicker
        selected={startDate}
        onChange={(date: Date | null) => setStartDate(date)}
        minDate={new Date()} // only today and future dates
        dateFormat="dd MMM yyyy"
        placeholderText="dd MMM yyyy"
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        calendarClassName="!bg-white !border !border-gray-200 !shadow-md !rounded-lg" // ✅ fully white
        dayClassName={() =>
          "hover:bg-blue-100 focus:bg-blue-200 rounded-full"
        }
      />

      <Calendar
        className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}
