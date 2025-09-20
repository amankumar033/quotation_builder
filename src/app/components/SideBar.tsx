"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/quotation-builder", label: "Quotation Builder", icon: FileText },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/services", label: "Services", icon: Bell },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
  <div className="fixed top-0 left-0 h-screen w-64 bg-gray-50 border-r border-gray-200 text-gray-600 pt-20 flex flex-col  shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.05)]">


      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-4">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[18px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-3 p-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-lg bg-red-500 text-white hover:bg-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[18px] font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
