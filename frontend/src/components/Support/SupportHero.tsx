'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldHalf, LifeBuoy, Clock } from 'lucide-react';

const SupportHero = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-[#0f1115]">
      {/* Background Calm Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/grid.svg')] bg-[length:40px_40px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="px-5 py-2 bg-white/5 text-amber-500 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-8 inline-flex items-center gap-2">
            <ShieldHalf className="w-4 h-4" /> The Support Sanctuary
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-8">
            How Can We <br />
            <span className="text-amber-500 not-italic">Help You?</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto mb-16 leading-relaxed uppercase tracking-widest">
            Expert assistance from real travelers, ready to guide you through every step of your journey.
          </p>
        </motion.div>

        {/* Global Help Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-3xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-amber-500/30 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[30px] p-2 flex items-center gap-4 focus-within:border-amber-500/50 transition-all shadow-2xl">
            <div className="pl-6 text-gray-500">
               <Search className="w-6 h-6" />
            </div>
            <input 
              type="text" 
              placeholder="Search help by keyword or topic..."
              className="flex-1 bg-transparent py-6 text-white font-black uppercase text-sm tracking-widest outline-none placeholder:text-gray-600 focus:placeholder:text-gray-500"
            />
            <button className="bg-amber-500 text-black px-8 py-5 rounded-[22px] font-black text-[12px] uppercase tracking-widest hover:bg-white transition-all">
               Quick Search
            </button>
          </div>
        </motion.div>

        {/* Trust Strips */}
        <div className="mt-20 flex flex-wrap justify-center gap-10 md:gap-20">
           <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500/50" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Response: 15min</span>
           </div>
           <div className="flex items-center gap-3">
              <LifeBuoy className="w-5 h-5 text-amber-500/50" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">24/7 Human Experts</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default SupportHero;
