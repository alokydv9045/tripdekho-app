import React from 'react';
import Header from '@/components/Header';
import SupportHero from '@/components/Support/SupportHero';
import SupportCategoryGrid from '@/components/Support/SupportCategoryGrid';
import SupportFAQ from '@/components/Support/SupportFAQ';
import SupportForm from '@/components/Support/SupportForm';
import { Metadata } from 'next';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Support Sanctuary - TripDekho Expert Help',
  description: 'Get expert travel assistance, browse our comprehensive FAQ, and connect with our human concierge team. the ultimate travel support sanctuary.',
};

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main>
        <SupportHero />
        <SupportCategoryGrid />
        <SupportFAQ />
        <SupportForm />
      </main>
    </div>
  );
};

export default ContactPage;
