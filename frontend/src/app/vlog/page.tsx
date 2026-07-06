import React from 'react';
import VlogPageContent from '@/components/Vlog/VlogPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TripDekho Vlog - Travel Stories & Cinematic Journeys',
  description: 'Explore the world through our cinematic travel stories. Watch high-quality vlogs of the most exotic destinations around the globe.',
};

export default function VlogPage() {
  return <VlogPageContent />;
}
