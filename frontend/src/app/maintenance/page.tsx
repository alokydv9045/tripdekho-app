'use client';
import React from 'react';
import { Settings, RefreshCw, Construction, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function MaintenancePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto bg-white/60 backdrop-blur-xl border border-white/80 p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-amber-900/5"
      >
        <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Settings className="w-12 h-12 text-amber-500 animate-spin-slow" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase italic" style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}>
          We'll be back shortly
        </h1>
        
        <p className="text-gray-500 font-medium text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Our platform is currently undergoing scheduled maintenance to improve your experience. We apologize for the inconvenience and appreciate your patience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          
          <button 
            onClick={() => window.location.href = 'mailto:support@tripdekho.com'}
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-200 transition-all"
          >
            <Mail className="w-4 h-4" /> Contact Support
          </button>
        </div>
      </motion.div>
    </div>
  );
}
