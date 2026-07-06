'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, ShieldCheck, Zap, Plane, BaggageClaim, Map, Compass, Camera, Tent, Sun, Palmtree, Navigation, Ticket } from 'lucide-react';
import PrimaryButton from '../shared/PrimaryButton';
import Image from 'next/image';

/* ── Floating travel icons – same pattern as HeroSection ─────────────── */
const FloatingIcons = () => {
  const [mounted, setMounted] = useState(false);
  const icons = [Plane, BaggageClaim, Map, Compass, Camera, Tent, Sun, Palmtree, Navigation, Ticket];

  useEffect(() => { setMounted(true); }, []);

  const elements = Array.from({ length: 45 }).map((_, i) => {
    const Icon = icons[i % icons.length];
    const top      = (i * 13) % 90 + 8;
    const left     = (i * 29) % 90 + 5;
    const rotate   = (i * 31) % 90 - 45;
    const size     = (i * 7) % 20 + 24;
    const yOffset  = (i * 11) % 20 + 10;
    const duration = (i * 3) % 4 + 6;

    return (
      <motion.div
        key={i}
        className="absolute pointer-events-none"
        style={{ top: `${top}%`, left: `${left}%` }}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 0.15, y: [0, -yOffset, 0] }}
        transition={{
          opacity: { duration: 1, delay: i * 0.08 },
          y: { duration, repeat: Infinity, ease: 'easeInOut', delay: (i % 5) * 0.5 },
        }}
      >
        <Icon
          style={{
            width: size,
            height: size,
            transform: `rotate(${rotate}deg)`,
            color: '#d97706',
          }}
        />
      </motion.div>
    );
  });

  if (!mounted) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {elements}
    </div>
  );
};

/* ── AppHero ──────────────────────────────────────────────────────────── */
const AppHero = () => {
  return (
    <section className="relative min-h-[90vh] w-full pt-10 md:pt-20 pb-20 overflow-hidden flex items-center" style={{ background: 'var(--background, #FFFBF0)' }}>
      {/* Floating travel icons – same as homepage */}
      <FloatingIcons />

      {/* Radial yellow glow blobs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFD133 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFD133 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Text Content – original card design */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative z-10"
        >
           <span className="px-4 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-8 inline-block shadow-xl shadow-amber-500/20">
              TripDekho Mobile
           </span>
           <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] uppercase mb-6 sm:mb-8">
              World in <br />
              <span className="text-amber-500 not-italic">Pocket</span>
           </h1>
           <p className="text-gray-500 text-sm sm:text-lg md:text-xl font-medium max-w-xl mb-8 sm:mb-12 leading-relaxed uppercase tracking-widest">
              Book, Explore, and Navigate the planet with our all-in-one travel companion app.
           </p>

           <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mb-12 sm:mb-16">
              <PrimaryButton className="w-full sm:w-auto flex items-center justify-center h-14 sm:h-16 px-8 sm:px-10 group shadow-2xl shadow-amber-500/20 bg-amber-500 hover:bg-black hover:text-white border-none">
                 Download Now
                 <Download className="ml-2 sm:ml-3 w-5 h-5 shrink-0 group-hover:-translate-y-1 transition-transform" />
              </PrimaryButton>
              <button className="w-full sm:w-auto flex items-center justify-center h-14 sm:h-16 px-6 sm:px-10 border-2 border-gray-100 hover:border-amber-500 hover:text-amber-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-white group">
                 Watch How it Works
                 <Zap className="ml-2 sm:ml-3 w-4 h-4 shrink-0 inline group-hover:rotate-12 transition-transform" />
              </button>
           </div>

           {/* Quick Stats */}
            <div className="flex items-center gap-6 sm:gap-10">
               <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">4.9/5</span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">App Store Rating</span>
               </div>
            </div>
        </motion.div>

        {/* 3D Device Showcase */}
        <motion.div
           initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ delay: 0.3, duration: 1, type: "spring", bounce: 0.4 }}
           className="relative z-10 flex justify-center mt-12 lg:mt-0"
        >
           {/* Main Device Image */}
           <div className="relative group max-w-[280px] sm:max-w-sm lg:max-w-none mx-auto w-full h-[500px]">
              <Image 
                src="/images/app-mockup.png" 
                alt="TripDekho Mobile App Mockup" 
                fill
                className="object-contain drop-shadow-[0_50px_80px_rgba(0,0,0,0.15)] md:group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Dynamic Badges */}
              <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -top-4 -left-4 sm:-top-10 sm:-left-10 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[30px] shadow-2xl flex items-center gap-3 sm:gap-4 border border-gray-50 scale-75 sm:scale-100 origin-top-left"
              >
                 <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified</p>
                    <p className="text-sm font-black text-gray-900 uppercase">One-Tap Booking</p>
                 </div>
              </motion.div>

              <motion.div 
                 animate={{ y: [0, 20, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute -bottom-4 -right-4 sm:-bottom-10 sm:-right-10 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[30px] shadow-2xl flex items-center gap-3 sm:gap-4 border border-gray-50 scale-75 sm:scale-100 origin-bottom-right"
              >
                 <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500">
                    <Zap className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Offline</p>
                    <p className="text-sm font-black text-gray-900 uppercase">Expert Maps</p>
                 </div>
              </motion.div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppHero;
