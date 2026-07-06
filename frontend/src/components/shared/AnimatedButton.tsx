"use client";

import React from 'react';
import { motion, useReducedMotion, HTMLMotionProps } from 'framer-motion';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedButton({ children, className = '', ...props }: AnimatedButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      className={className}
      whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
      transition={{ duration: 0.12 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
