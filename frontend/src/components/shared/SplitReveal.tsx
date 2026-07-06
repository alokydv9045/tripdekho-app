"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { variants } from '@/lib/motion';

interface SplitRevealProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
}

export default function SplitReveal({
  leftContent,
  rightContent,
  className = "flex flex-col md:flex-row gap-8 items-center w-full",
  leftClassName = "flex-1 w-full",
  rightClassName = "flex-1 w-full"
}: SplitRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const leftVariant = shouldReduceMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  } : variants.fadeInLeft;

  const rightVariant = shouldReduceMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  } : variants.fadeInRight;

  return (
    <div className={className}>
      <motion.div
        className={leftClassName}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={leftVariant}
      >
        {leftContent}
      </motion.div>

      <motion.div
        className={rightClassName}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={rightVariant}
      >
        {rightContent}
      </motion.div>
    </div>
  );
}
