"use client";
import { signOut } from "next-auth/react";
import { sign } from "crypto";
import {
  Globe,
  LayoutDashboard,
  FileText,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-[#0A1128] text-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 pt-4 ml-6 mb-10">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
        <span className="text-lg font-bold">TravelQuoter</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-8 mt-3">
        <a className="flex items-center gap-3 px-4 py-2 text-[20px] rounded-lg bg-blue-600">
          <LayoutDashboard className="w-5 h-5" /> 
          Dashboard
        </a>
        <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-[20px] hover:bg-blue-600 transition">
          <FileText className="w-5 h-5" /> Quotation Builder
        </a>
        <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-[20px] hover:bg-blue-600 transition">
          <Users className="w-5 h-5" /> Clients
        </a>
        <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-[20px] hover:bg-blue-600 transition">
          <Bell className="w-5 h-5" /> Services
        </a>
        <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-[20px] hover:bg-blue-600 transition">
          <BarChart3 className="w-5 h-5" /> Reports
        </a>
        <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-[20px] hover:bg-blue-600 transition">
          <Settings className="w-5 h-5" /> Settings
        </a>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t  border-gray-700">
        <a className="flex items-center gap-3 px-4 py-2  justify-center  rounded-lg hover:bg-red-600 bg-red-500 transition" onClick={()=> signOut({ callbackUrl: "/login" })}>
          <LogOut className="w-5 h-5" /> Logout
        </a>
      </div>
    </div>
  );
}
