"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const pageVariants = {
  pageEnter: { opacity: 0, y: 8 },
  pageAnimate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // Fix for Next.js scroll restoration when using Framer Motion page transitions
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial="pageEnter"
      animate="pageAnimate"
      variants={pageVariants}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
