"use client";

import React from "react";
import Header from "@/components/Header";
import { Shield, Lock, FileText, Activity } from "lucide-react";

const PrivacyPage = () => {
  const lastUpdated = "April 3, 2026";

  return (
    <div className="min-h-screen bg-transparent text-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="mb-16">
          <div className="w-16 h-16 bg-amber-400 rounded-3xl flex items-center justify-center shadow-xl shadow-amber-200 mb-8">
             <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" /> Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-[48px] p-12 shadow-2xl shadow-gray-200/50">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-amber-600 prose-a:font-bold prose-p:font-medium prose-p:text-gray-600">
            <p className="lead text-xl text-gray-900 font-black mb-10">
              At TripDekho, we take your privacy as seriously as we take our adventures. This policy describes how we collect, use, and handle your information when you use our platform.
            </p>

            <h2 className="flex items-center gap-3 mt-12 text-2xl">
               <FileText className="w-6 h-6 text-amber-500" /> Information We Collect
            </h2>
            <p>
              When you use TripDekho to book an adventure or register as a vendor, we may collect the following types of information:
            </p>
            <ul>
              <li><strong>Personal Identity:</strong> First name, last name, email address, phone number, and government-issued IDs (strictly for verified vendors and international travel requirements).</li>
              <li><strong>Financial Data:</strong> While we do not store full credit card numbers directly on our servers (processed securely via Razorpay), we retain transaction histories, billing addresses, and linked payout accounts for vendors.</li>
              <li><strong>Usage Data:</strong> We automatically log interactions with our platform, including IP addresses, browser types, search queries, and page views to improve user experience.</li>
            </ul>

            <h2 className="flex items-center gap-3 mt-12 text-2xl">
               <Lock className="w-6 h-6 text-amber-500" /> How We Use Your Data
            </h2>
            <p>
              Your data is primarily used to deliver the core TripDekho experience. Specifically, we use it to:
            </p>
            <ol>
              <li>Facilitate bookings between travelers and verified vendors.</li>
              <li>Process payments and issue refunds efficiently.</li>
              <li>Send critical trip updates, itineraries, and safety alerts.</li>
              <li>Maintain platform security and prevent fraudulent activity.</li>
            </ol>

            <h2 className="mt-12 text-2xl">Data Sharing & Vendors</h2>
            <p>
              When you book a trip, we must share specific details with your chosen vendor so they can prepare for your arrival. <strong>We only share what is necessary</strong>: your name, contact details, and special requirements. We <em>never</em> sell your personal data to third-party marketing agencies.
            </p>

            <div className="mt-16 p-8 bg-amber-50 rounded-3xl border border-amber-100">
               <h3 className="text-lg font-black uppercase mb-2 text-amber-900">Contact Privacy Team</h3>
               <p className="text-amber-800 text-sm font-bold mb-0">
                 If you have questions about how we handle your data or wish to request data deletion, contact our Data Protection Officer at: <br/>
                 <strong className="text-amber-900 border-b border-amber-400">privacy@TripDekho.com</strong>
               </p>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default PrivacyPage;

