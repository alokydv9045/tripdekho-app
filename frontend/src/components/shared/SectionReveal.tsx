"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { variants } from '@/lib/motion';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: keyof typeof variants;
  once?: boolean;
}

export default function SectionReveal({ 
  children, 
  className = '', 
  delay = 0,
  variant = 'fadeInUp',
  once = true 
}: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const selectedVariant = variants[variant] || variants.fadeInUp;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={(shouldReduceMotion ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } }
      } : selectedVariant) as any}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
