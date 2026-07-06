import React from 'react';
import AppHero from '@/components/AppLanding/AppHero';
import FeatureShowcase from '@/components/AppLanding/FeatureShowcase';
import DownloadSection from '@/components/AppLanding/DownloadSection';
import MobilePerks from '@/components/AppLanding/MobilePerks';
import Header from '@/components/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TripDekho Mobile - Travel in Your Pocket',
  description: 'Download the TripDekho mobile app for exclusive deals, offline maps, and real-time trip alerts. the ultimate travel companion.',
};

export default function AppLandingPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <AppHero />
      <FeatureShowcase />
      <MobilePerks />
      <DownloadSection />
    </div>
  );
}
