'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function ScrollReveal({ children, delay = 0, direction = 'up' }: ScrollRevealProps) {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    if (sessionStorage.getItem('home_visited_reveal')) {
      setHasVisited(true);
    } else {
      sessionStorage.setItem('home_visited_reveal', 'true');
    }
  }, []);

  // Safari has a known bug where positive rootMargin values (e.g. "0px 0px 150px 0px")
  // on the viewport root don't fire reliably — elements stay at opacity:0 forever.
  // Use negative margin instead, which triggers reliably in all browsers.
  const isInView = useInView(ref, { once: true, amount: 0.05, margin: isMobile ? "0px 0px -20px 0px" : "0px 0px -30px 0px" });

  const directions = {
    up: { y: isMobile ? 15 : 30, x: 0 },
    down: { y: isMobile ? -15 : -30, x: 0 },
    left: { x: isMobile ? 15 : 30, y: 0 },
    right: { x: isMobile ? -15 : -30, y: 0 },
  };

  // If already visited this session (e.g. back navigation), skip animation and render visible
  if (hasVisited) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{
        duration: isMobile ? 0.3 : 0.5,
        delay: delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}
