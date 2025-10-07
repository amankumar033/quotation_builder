"use client";

import { Bell, Search, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed w-full flex items-center justify-between z-20 bg-white border-b border-gray-200">
      {/* Left: Hamburger (mobile) + Logo */}
      <div className="flex items-center gap-3 pl-3 pr-2 py-3 lg:w-64 lg:justify-center">
        {/* Mobile menu button */}
        <button
          aria-label="Open Menu"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
          onClick={() => {
            // Dispatch a custom event to toggle the sidebar on mobile
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('toggle-sidebar'));
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
        <span className="text-xl lg:text-2xl font-bold">TravelQuoter</span>
      </div>

      {/* Rest of the header content */}
      <div className="flex-1 px-3 lg:px-6 py-2 lg:py-3 shadow-md flex items-center justify-between bg-white">
        {/* Left: Navigation (hidden on small screens) */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="hidden lg:flex gap-6 font-medium">
            <a href="#" className="hover:text-blue-600 text-gray-700 text-[19px]">
              Trips
            </a>
            <a href="#" className="hover:text-blue-600 text-gray-700 text-[19px]">
              Bookings
            </a>
          </nav>
        </div>

        {/* Middle: Search */}
         <div className="hidden sm:flex flex-1 justify-center px-2 lg:px-6">
          <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 w-full max-w-md border border-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for trips"
              className="bg-transparent outline-none px-2 py-1 text-sm placeholder-gray-400 text-gray-700 w-full"
            />
          </div>
        </div> 

        {/* Right: Menu + Icons */}
        <div className="flex items-center gap-4 lg:gap-8 pr-3">
          <nav className="hidden lg:flex gap-6 font-medium">
            <a href="#" className="hover:text-blue-600 text-gray-700 text-[19px]">
              Hotels
            </a>
            <a href="#" className="hover:text-blue-600 text-gray-700 text-[19px]">
              Transport
            </a>
          </nav>

          {/* Notification bell */}
          <div className="relative cursor-pointer">
            <Bell className="h-6 w-6 text-blue-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 flex items-center justify-center rounded-full text-white">
              1
            </span>
          </div>

          {/* User icon */}
          <div className="hidden sm:flex items-center gap-2">
            <img src="/user.png" alt="User" className="w-8 h-8 rounded-full border bg-gray-300 border-gray-500" />
            <span className="text-lg text-gray-700 font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}