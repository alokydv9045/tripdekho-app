"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedCard({ children, className = '' }: AnimatedCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`bg-surface shadow-card rounded-card overflow-hidden border border-border-warm ${className}`}
      whileHover={shouldReduceMotion ? {} : { y: -6, boxShadow: "var(--shadow-card-hover)" }}
      transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
