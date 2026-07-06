"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { variants } from '@/lib/motion';

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  isHero?: boolean;
}

export default function StaggerGroup({ children, className = '', isHero = false }: StaggerGroupProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('home_visited_stagger')) {
        setHasVisited(true);
      } else {
        sessionStorage.setItem('home_visited_stagger', 'true');
      }
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hasVisited ? "visible" : "hidden"}
      animate={hasVisited ? "visible" : (isInView ? "visible" : "hidden")}
      variants={isHero ? variants.heroStagger : variants.staggerContainer}
    >
      {children}
    </motion.div>
  );
}
