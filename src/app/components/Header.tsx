"use client";

import { Bell, Search, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed w-full  flex items-center justify-between z-10 bg-white px-6 py-3  shadow-md">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8 ">
       {/* Logo */}
      <div className="flex items-center gap-2 w-[201]  ">
        <img src="/logo.png" alt="Logo" className="w-10 h-10  rounded-full" />
        <span className="text-2xl font-bold">TravelQuoter</span>
      </div>

        <nav className="flex gap-6 font-medium">
          <a href="#" className="hover:text-blue-600 text-gray-700 text-[19px]">
            Trips
          </a>
          <a href="#" className="hover:text-blue-600 text-gray-700 text-[19px]">
            Bookings
          </a>
        </nav>
      </div>

      {/* Middle: Search
      <div className="flex-1 flex justify-center px-6">
        <div className="flex items-center bg-gray-100 rounded-md px-3 py-1 w-full max-w-md border border-gray-200">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for trips"
            className="bg-transparent outline-none px-2 py-1 text-sm placeholder-gray-400 text-gray-700 w-full"
          />
        </div>
      </div> */}

      {/* Right: Menu + Icons */}
      <div className="flex items-center gap-8">
        <nav className="flex gap-6 font-medium">
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
        <div className="flex items-center gap-2">
          <img src="/user.png" alt="User" className="w-8 h-8 rounded-full border bg-gray-300 border-gray-500" />
          <span className="text-lg text-gray-700 font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
