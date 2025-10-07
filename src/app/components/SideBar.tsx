"use client";
import React from "react";
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
  const serviceRoutes = ["/services", "/hotel", "/meal", "/activity", "/transport"]; // all routes that belong to Services
  const [open, setOpen] = React.useState(false);

  // Listen for header toggle on mobile
  React.useEffect(() => {
    const handler = () => setOpen(prev => !prev);
    if (typeof window !== 'undefined') {
      window.addEventListener('toggle-sidebar', handler as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('toggle-sidebar', handler as EventListener);
      }
    };
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/quotation-builder", label: "Quotation Builder", icon: FileText },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/services", label: "Services", icon: Bell },
    { href: "/agency-settings", label: "Agency Settings", icon: Settings },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
    {/* Desktop sidebar */}
    <div className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-gray-50 border-r border-gray-200 text-gray-600 pt-20 flex-col shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.05)]">

      {/* Nav Links */}
      <nav className="flex-1 px-4 space-y-4">
        {links.map(({ href, label, icon: Icon }) => {
          // Improved active state logic
         const isActive =
         (href === "/services" && serviceRoutes.some(r => pathname.startsWith(r))) ||
         pathname === href ||
         pathname.startsWith(href + "/") ||
         (pathname === "/" && href === "/dashboard"); // Handle root path

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

    {/* Mobile drawer */}
    {open && (
      <div className="lg:hidden fixed inset-0 z-30">
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)}></div>
        <div className="absolute top-0 left-0 h-full w-64 bg-white border-r border-gray-200 pt-20 flex flex-col shadow-xl">
          {/* Close button */}
          <button
            aria-label="Close Menu"
            className="absolute top-4 right-3 p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
          {/* Nav Links */}
          <nav className="flex-1 px-4 space-y-4">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive =
                (href === "/services" && serviceRoutes.some(r => pathname.startsWith(r))) ||
                pathname === href ||
                pathname.startsWith(href + "/") ||
                (pathname === "/" && href === "/dashboard");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ease-out
                    ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[18px] font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/login" }); }}
              className="w-full flex items-center justify-center gap-3 p-3 rounded-xl bg-red-500 text-white"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[18px] font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}