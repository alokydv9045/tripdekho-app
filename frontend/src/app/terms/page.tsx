"use client";

import React from "react";
import Header from "@/components/Header";
import { Scale, FileSignature, AlertTriangle, AlertCircle } from "lucide-react";

const TermsPage = () => {
  const lastUpdated = "April 3, 2026";

  return (
    <div className="min-h-screen bg-transparent text-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="mb-16">
          <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center shadow-xl shadow-gray-200 mb-8">
             <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Terms & Conditions</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Effective Date: {lastUpdated}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-[48px] p-12 shadow-2xl shadow-gray-200/50">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-amber-600 prose-a:font-bold prose-p:font-medium prose-p:text-gray-600">
            <p className="lead text-xl text-gray-900 font-black mb-10">
              Welcome to TripDekho. By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of these terms, please do not use our services.
            </p>

            <h2 className="flex items-center gap-3 mt-12 text-2xl">
               <FileSignature className="w-6 h-6 text-amber-500" /> Platform Role
            </h2>
            <p>
              TripDekho acts as an intermediary marketplace connecting independent travel vendors ("Hosts" or "Vendors") with users seeking travel experiences ("Travelers"). 
              <strong> TripDekho does not directly own, operate, or provide any tours, accommodations, or travel experiences.</strong> The contract for the travel service is solely between the Traveler and the Vendor.
            </p>

            <h2 className="mt-12 text-2xl">Traveler Responsibilities</h2>
            <ul className="space-y-2">
              <li>You must be at least 18 years old to create an account and book a trip.</li>
              <li>You are responsible for ensuring you meet the physical requirements listed for any booked adventure (e.g., fitness levels for high-altitude treks).</li>
              <li>You must possess valid travel documents, including passports, visas, and health certificates, as required by the destination jurisdiction.</li>
            </ul>

            <h2 className="mt-12 text-2xl">Vendor Obligations</h2>
            <p>
              Vendors listing trips on TripDekho agree to the following operational standards:
            </p>
            <ul className="space-y-2">
              <li>Maintain accurate, up-to-date pricing and availability calendars.</li>
              <li>Provide services exactly as described in the published itinerary.</li>
              <li>Carry necessary liability insurance and valid operating licenses as mandated by local tourism authorities.</li>
            </ul>

            <h2 className="flex items-center gap-3 mt-12 text-2xl">
               <AlertTriangle className="w-6 h-6 text-red-500" /> Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, TripDekho shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, resulting from:
            </p>
            <ol className="space-y-2">
              <li>Your access to or use of the platform.</li>
              <li>Any conduct or content of any third-party vendor.</li>
              <li>Physical injuries, property damage, or delays occurring during a booked trip, which remain the sole responsibility of the respective Vendor.</li>
            </ol>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default TermsPage;

