'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PremiumLoaderProps {
  text?: React.ReactNode;
  subText?: string;
}

const PremiumLoader = ({ text, subText }: PremiumLoaderProps = {}) => {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-amber-500 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05] 
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-amber-600 rounded-full blur-[100px]"
        />
      </div>

      {/* Center Logo/Animation Container */}
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-amber-500 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-b-2 border-l-2 border-amber-300/40 rounded-full"
          />
          
          {/* Brand Logo (Owl Icon) */}
          <motion.div
            animate={{ 
              scale: [0.9, 1.05, 0.9],
              y: [0, -3, 0]
            }}
            transition={{ 
              scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 flex items-center justify-center p-6 drop-shadow-[0_4px_12px_rgba(255,209,51,0.25)]"
          >
            <img 
              src="/sm-logo.png" 
              alt="TripDekho"
              className="w-12 h-12 object-contain"
            />
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <motion.h2
            className="text-lg font-black text-gray-900 uppercase tracking-[0.3em] mb-2"
          >
            {text || (
              <>Trip<span className="text-amber-500">Dekho</span></>
            )}
          </motion.h2>
          
          <div className="flex items-center justify-center gap-1">
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
            >
              {subText || "Curating Your premium escape"}
            </motion.p>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 1] }}
              className="w-1 h-1 bg-amber-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Progress Line (Fake but stylish) */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-50 overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/3 h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
        />
      </div>
    </div>
  );
};

export default PremiumLoader;
