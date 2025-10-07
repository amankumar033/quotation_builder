import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/Providers";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import RouteProgress from "./components/RouteProgress";
import { ToastProvider } from "./components/Toast";
import { QuotationProvider } from "../context/QuotationContext";
import { AgencySettingsProvider } from "@/context/AgencySettingsContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quotation Builder",
  description: "Generate Quotation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}  >

        <RouteProgress />

        {/* Header*/}
        <Header />

        {/* Fixed Sidebar (desktop) + mobile drawer inside component) */}
        <Sidebar />

        <div className="pt-14 lg:ml-64 px-3 sm:px-4 lg:px-0">
          <ToastProvider>
            <Providers>
              <AgencySettingsProvider>
                <QuotationProvider>
                  {children}
                  </QuotationProvider>
                  </AgencySettingsProvider>
            </Providers>
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
