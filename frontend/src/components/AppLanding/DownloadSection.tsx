'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Play, QrCode, Smartphone, Download, Map } from 'lucide-react';

const DownloadSection = () => {
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: 'var(--background, #FFFBF0)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[60px] p-12 lg:p-24 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-20">
           {/* Illustration Background */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.05),transparent_70%)] pointer-events-none" />
           <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

           <div className="lg:w-1/2 space-y-12 relative z-10 text-center lg:text-left">
              <div className="space-y-4">
                 <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">Available Globally</span>
                 <h2 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                    One Journey. <br />
                    <span className="text-amber-500 not-italic">One App.</span>
                 </h2>
                 <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed uppercase tracking-widest pt-4">
                    Scan the code to download the TripDekho app and unlock a world of seamless travel.
                 </p>
              </div>

              {/* Store Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                 <button className="flex items-center gap-4 bg-black text-white px-8 py-5 rounded-3xl hover:scale-105 transition-transform shadow-2xl group">
                    <Apple className="w-8 h-8 fill-current" />
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Download on the</p>
                       <p className="text-lg font-black uppercase tracking-tighter">App Store</p>
                    </div>
                 </button>
                 <button className="flex items-center gap-4 bg-white border-2 border-gray-100 text-gray-900 px-8 py-5 rounded-3xl hover:scale-105 transition-transform shadow-xl group">
                    <Play className="w-8 h-8 fill-amber-500 text-amber-500" />
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Get it on</p>
                       <p className="text-lg font-black uppercase tracking-tighter">Google Play</p>
                    </div>
                 </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-10 pt-10 border-t border-gray-50">
                 <div className="flex items-center gap-3">
                    <Map className="w-5 h-5 text-gray-300" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">190+ Countries</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-gray-300" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">5M+ Local Maps</span>
                 </div>
              </div>
           </div>

           {/* QR Code Deep Focus */}
           <div className="lg:w-1/2 flex items-center justify-center relative z-10">
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative group p-4"
              >
                 <div className="absolute inset-0 bg-amber-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <div className="w-80 h-80 bg-white p-10 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-50 flex items-center justify-center relative overflow-hidden">
                    {/* Animated Scanning Line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-amber-500/50 z-20 shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
                    />
                    <QrCode className="w-full h-full text-gray-900 opacity-90" strokeWidth={1} />
                    
                    {/* Center Logo Placeholder */}
                    <div className="absolute inset-x-0 bottom-0 py-4 bg-white/90 backdrop-blur-sm border-t border-gray-50 flex items-center justify-center">
                       <span className="text-[8px] font-black text-gray-900 uppercase tracking-[0.5em]">TripDekho App</span>
                    </div>
                 </div>

                 {/* Phone Mockup Floating Overlay */}
                 <motion.div 
                   animate={{ x: [0, 20, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -right-20 top-10 bg-white p-6 rounded-[30px] shadow-2xl flex items-center gap-4 border border-gray-50 hidden lg:flex"
                 >
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                       <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Instant App</p>
                       <p className="text-xs font-black text-gray-900 uppercase">Universal Link</p>
                    </div>
                 </motion.div>
              </motion.div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
