'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, MessageCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const FloatingSupport = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    const toggleVisibility = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Collapse when navigating away
  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.472-1.761-1.645-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 0C5.373 0 0 5.373 0 12c0 2.102.544 4.078 1.503 5.803L0 24l6.391-1.475C8.04 23.424 9.96 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.585-.487-5.092-1.339l-.366-.203-3.774.871.89-3.418-.224-.356C2.564 16.035 2 14.12 2 12c0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10S17.514 22 12 22z" />
    </svg>
  );

  const phoneIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );

  // Whether contact icons should show
  const showContactIcons = isHome || isExpanded;

  return (
    <div className="fixed bottom-[100px] md:bottom-8 right-4 md:right-8 z-[100] flex flex-col items-center gap-3">

      {/* Scroll to Top — shows above all */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            onClick={scrollToTop}
            className="w-11 h-11 bg-amber-500 rounded-full flex items-center justify-center text-black shadow-2xl shadow-amber-500/30 hover:bg-amber-400 transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contact icons — expand above the toggle button */}
      <AnimatePresence>
        {showContactIcons && (
          <motion.div
            key="contact-icons"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col gap-3"
          >
            {/* WhatsApp */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#25D366]/30 hover:scale-110 transition-transform"
              aria-label="Contact on WhatsApp"
            >
              {whatsappIcon}
            </a>

            {/* Phone */}
            <a
              href="tel:+1234567890"
              className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-cyan-500/30 hover:scale-110 transition-transform"
              aria-label="Call Support"
            >
              {phoneIcon}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button — only on non-home pages, always at bottom of stack */}
      {!isHome && (
        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-2xl shadow-gray-900/40 hover:bg-black hover:scale-110 transition-all"
          aria-label="Toggle contact options"
        >
          <motion.span
            key={isExpanded ? 'close' : 'open'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </button>
      )}
    </div>
  );
};

export default FloatingSupport;
