"use client";

import React, { useEffect, useState } from 'react';
import { Plane, BaggageClaim, Map, Compass, Camera, Tent, Sun, Palmtree, Navigation, Ticket } from "lucide-react";
import { motion } from 'framer-motion';

const FloatingIcons = () => {
  const [mounted, setMounted] = useState(false);
  const icons = [Plane, BaggageClaim, Map, Compass, Camera, Tent, Sun, Palmtree, Navigation, Ticket];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pseudo-random generation for stable SSR
  const elements = Array.from({ length: 45 }).map((_, i) => {
    const Icon = icons[i % icons.length];
    const top = (i * 13) % 90 + 8; 
    const left = (i * 29) % 90 + 5;
    const rotate = (i * 31) % 90 - 45;
    const size = (i * 7) % 20 + 24; // 24px to 44px
    const yOffset = (i * 11) % 20 + 10; // 10px to 30px
    const duration = (i * 3) % 4 + 6; // 6s to 9s

    return (
      <motion.div 
        key={i} 
        className="absolute pointer-events-none"
        style={{ top: `${top}%`, left: `${left}%` }}
        initial={{ opacity: 0, y: 0 }}
        animate={{ 
          opacity: 0.15,
          y: [0, -yOffset, 0]
        }}
        transition={{
          opacity: { duration: 1, delay: i * 0.08 },
          y: {
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (i % 5) * 0.5
          }
        }}
      >
        <Icon 
           className="text-gold" 
           style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
        />
      </motion.div>
    );
  });

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {elements}
    </div>
  );
};

export default FloatingIcons;
