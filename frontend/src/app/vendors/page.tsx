"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Globe, TrendingUp, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import MagneticWrapper from "@/components/shared/MagneticWrapper";

const VendorsPage = () => {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-40">
           <img 
             src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
             className="w-full h-full object-cover"
             alt="Partners Background"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-white" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 rounded-full mb-8"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span className="text-[10px] font-semibold text-black">TripDekho Vendor Program</span>
            </div>
           <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-tight mb-8">
              Grow Your <br />
              <span className="text-amber-500">Travel Business</span>
           </h1>
           <p className="text-gray-300 font-bold uppercase tracking-[0.2em] text-xs max-w-xl mx-auto leading-relaxed">
              Join the world's most elite network of travel vendors and hotel partners.
           </p>
        </div>
      </section>

      {/* Program Tracks */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {/* Vendor Track */}
           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-gray-50 rounded-[40px] p-12 border border-gray-100 flex flex-col items-start"
           >
              <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-amber-200">
                 <Globe className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-gray-900">Travel Vendors</h3>
              <p className="text-gray-500 font-bold mb-10 leading-relaxed uppercase tracking-widest text-[10px]">For travel agencies, tour operators, and expedition organizers looking to reach a global elite audience.</p>
              <ul className="space-y-4 mb-12">
                 {['Verified Listing', 'Instant Bookings', 'Global Reach', 'Secure Payouts'].map(feature => (
                   <li key={feature} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-900">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> {feature}
                   </li>
                 ))}
              </ul>
              <Link href="/vendors/apply" className="mt-auto w-full group">
                 <button className="w-full bg-black text-white py-6 rounded-2xl font-semibold text-sm hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-4">
                    Apply as Vendor <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                 </button>
              </Link>
           </motion.div>

           {/* Hotel Track */}
           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-black rounded-[40px] p-12 border border-white/10 flex flex-col items-start"
           >
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-10">
                 <Building2 className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-white">Stay Partners</h3>
              <p className="text-white/40 font-bold mb-10 leading-relaxed uppercase tracking-widest text-[10px]">For luxury resorts, boutique stays, and premium accommodation partners seeking high-value travelers.</p>
              <ul className="space-y-4 mb-12">
                 {['Inventory Management', 'Direct Communication', 'Revenue Analytics', 'Marketing Support'].map(feature => (
                   <li key={feature} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/60">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> {feature}
                   </li>
                 ))}
              </ul>
              <Link href="/vendors/apply" className="mt-auto w-full group">
                 <button className="w-full bg-white text-black py-6 rounded-2xl font-semibold text-sm hover:bg-amber-500 transition-all flex items-center justify-center gap-4">
                    Apply as Hotel <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                 </button>
              </Link>
           </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-20">
           <div className="max-w-xl">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 leading-tight">
                 Empowering the next generation of <span className="text-amber-500">Travel Creators</span>
              </h2>
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] leading-relaxed mb-10">
                 TripDekho isn't just a platform; it's a movement. We provide the tools, the audience, and the infrastructure to help your business transition into the digital-first era of luxury travel.
              </p>
              <div className="grid grid-cols-2 gap-8">
                 <div>
                    <p className="text-3xl font-black text-gray-900 mb-1">125+</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Active Partners</p>
                 </div>
                 <div>
                    <p className="text-3xl font-black text-gray-900 mb-1">✓</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Verified Travellers</p>
                 </div>
              </div>
           </div>
           <div className="relative">
              <div className="w-80 h-80 bg-amber-500 rounded-[60px] flex items-center justify-center shadow-2xl shadow-amber-200">
                 <TrendingUp className="w-40 h-40 text-black opacity-20" />
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default VendorsPage;
