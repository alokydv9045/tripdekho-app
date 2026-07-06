"use client";

import React, { useState, useEffect } from 'react';
import ContactInfoCard from './ContactInfoCard';
import SideContactCard from './SideContactCard';
import { CONTACT_INFO } from '@/constants/contactData';

import { axiosPublic } from '@/lib/axios';

const ContactPageContent = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosPublic.get('/cms/settings');
        if (res.data.success) setSettings(res.data.data);
      } catch (err) {
        console.error("Failed to fetch contact settings:", err);
      }
    };
    fetchSettings();
  }, []);
  return (
    <section className="w-full py-16 md:py-24 bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Headline */}
          <div className="lg:col-span-4 lg:pt-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-400 leading-tight">
              Leave us a <br />
              <span className="text-gray-900 border-b-8 border-amber-400 pb-2">message!</span>
            </h1>
            <p className="mt-12 text-gray-500 text-lg max-w-sm leading-relaxed">
              Have questions about your next adventure? Our team is here to help you plan the perfect trip. Get in touch with us using any of the channels on the right.
            </p>
          </div>

          {/* Right Side Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Main Info Card */}
            <div className="md:col-span-7">
              <ContactInfoCard 
                companyName={CONTACT_INFO.company.name}
                contactPerson={{
                  name: CONTACT_INFO.company.personName,
                  role: CONTACT_INFO.company.role
                }}
                phone={settings?.brandPhone || CONTACT_INFO.company.phone}
                email={settings?.brandEmail || CONTACT_INFO.company.email}
                address={settings?.brandAddress || CONTACT_INFO.company.address}
              />
            </div>

            {/* Side Small Cards */}
            <div className="md:col-span-5 flex flex-col gap-8">
              {/* Helpline */}
              <SideContactCard 
                title="Helpline Numbers"
                value={settings?.brandPhone || CONTACT_INFO.helpline[0].phone}
                icon={
                  <div className="bg-amber-400 text-white rounded-2xl p-3 shadow-lg shadow-amber-400/20">
                    <svg viewBox="0 0 40 40" className="w-10 h-10 fill-white">
                      <path d="M30,10 H10 C8,10 6,12 6,14 V26 C6,28 8,30 10,30 H30 C32,30 34,28 34,26 V14 C34,12 32,10 30,10 Z M20,24 C16,24 14,21 14,18 C14,15 16,12 20,12 C24,12 26,15 26,18 C26,21 24,24 20,24 Z" />
                      <path d="M12,14 H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M24,14 H28" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <g fill="white">
                        <circle cx="18" cy="16" r="1.5" />
                        <circle cx="20" cy="16" r="1.5" />
                        <circle cx="22" cy="16" r="1.5" />
                        <circle cx="18" cy="18" r="1.5" />
                        <circle cx="20" cy="18" r="1.5" />
                        <circle cx="22" cy="18" r="1.5" />
                        <circle cx="18" cy="20" r="1.5" />
                        <circle cx="20" cy="20" r="1.5" />
                        <circle cx="22" cy="20" r="1.5" />
                      </g>
                    </svg>
                  </div>
                }
              />

              {/* Email */}
              <SideContactCard 
                title="Email"
                subtext="Sales & Partnership"
                value={settings?.brandEmail || CONTACT_INFO.email[0].email}
                icon={
                  <div className="bg-amber-400 text-white rounded-2xl p-3 shadow-lg shadow-amber-400/20 overflow-hidden relative">
                    <svg viewBox="0 0 40 40" className="w-10 h-10">
                      <rect x="5" y="12" width="30" height="20" rx="3" fill="white" />
                      <path d="M5 12 L20 22 L35 12" stroke="#FFD100" strokeWidth="3" fill="none" strokeLinejoin="round" />
                      <rect x="12" y="18" width="16" height="4" fill="#FFD100" rx="1" />
                    </svg>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPageContent;
