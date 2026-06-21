import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GymCare",
  description: "Fitness & Gym Management Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Navbar and Footer must live INSIDE body, alongside {children} — not
          as siblings of <body>, and not directly under <html>. That's what
          was causing the hydration error. */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        
        {children}
         <Toaster />
        <Footer />
      </body>
    </html>
  );
}