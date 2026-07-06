'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-amber-500 origin-left z-[9999] shadow-[0_0_10px_rgba(245,158,11,0.5)]"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
