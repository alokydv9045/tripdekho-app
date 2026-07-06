import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Be_Vietnam_Pro, Caveat, Permanent_Marker, Lora } from "next/font/google";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
import dynamic from 'next/dynamic';
import FooterWrapper from "@/components/Footer/FooterWrapper";
import FloatingSupport from "@/components/shared/FloatingSupport";
import VisualOrchestrator from "@/components/shared/VisualOrchestrator";
import { Providers } from "./providers";
import { PublicBanner } from "@/components/shared/PublicBanner";
import { LockdownShield } from "@/components/shared/LockdownShield";
import PageTransition from "@/components/shared/PageTransition";
import { ReviewPopupManager } from "@/components/shared/ReviewPopupManager";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-vietnam",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  variable: "--font-permanent-marker",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TripDekho - Find Your Dream Trip",
  description: "Get instant suggestions for your next adventure. Explore destinations, book trips, and create memories with TripDekho.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${beVietnamPro.variable} ${lora.variable} ${caveat.variable} ${permanentMarker.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream" suppressHydrationWarning>
        <VisualOrchestrator />
        <Providers>
          <PublicBanner />
          <LockdownShield>
             <main className="grow">
               <PageTransition>{children}</PageTransition>
             </main>
          </LockdownShield>
          <FooterWrapper />
          <FloatingSupport />
          <ReviewPopupManager />
        </Providers>
      </body>
    </html>
  );
}
