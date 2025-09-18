"use client";

import { Bell, Search, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-[#04042A] px-6 py-5 ml-64 text-white">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
       
        <nav className="flex gap-8 font-medium">
          <a href="#" className="hover:text-gray-300 text-[18px]">
            Trips
          </a>
          <a href="#" className="hover:text-gray-300 text-[18px]">
            Bookings
          </a>
        </nav>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 flex justify-center px-6">
        <div className="flex items-center bg-gray-600 rounded-md px-3 py-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-gray-300" />
          <input
            type="text"
            placeholder="search for trips"
            className="bg-transparent outline-none px-2 text-sm placeholder-gray-300 text-white w-full"
          />
        </div>
      </div>

      {/* Right: Menu + Icons */}
      <div className="flex items-center gap-12">
        <nav className="flex gap-8 font-medium">
          <a href="#" className="hover:text-gray-300 text-[18px]">
            Hotels
          </a>
          <a href="#" className="hover:text-gray-300 text-[18px]">
            Transport
          </a>
        </nav>

        {/* Notification bell */}
        <div className="relative cursor-pointer">
          <Bell className="h-6 w-6 text-yellow-400" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs w-4 h-4 flex items-center justify-center rounded-full">
            1
          </span>
        </div>

        {/* User icon */}
        <div className="flex items-center gap-2">
         <img src="/user.png" alt="User" className="w-8 h-8" />
          <span className="text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
}
