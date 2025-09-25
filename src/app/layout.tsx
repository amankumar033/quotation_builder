import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/Providers";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import RouteProgress from "./components/RouteProgress";
import { ToastProvider } from "./components/Toast";
import { QuotationProvider } from "../context/QuotationContext";
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

        {/* Fixed Sidebar */}
        <Sidebar />

        <div className="ml-64 pt-14">
          <ToastProvider>
            <Providers>
                <QuotationProvider>
                  {children}
                  </QuotationProvider>
            </Providers>
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
