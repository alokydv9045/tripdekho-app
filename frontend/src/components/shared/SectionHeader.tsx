"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { variants } from "@/lib/motion";

interface SectionHeaderProps {
  title: React.ReactNode;
  highlightedWord: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  showViewAll?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  highlightedWord,
  viewAllHref = "#",
  viewAllLabel = "View all",
  showViewAll = true,
}) => {
  return (
    <motion.div 
      className="flex items-center justify-between mb-6 md:mb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={variants.fadeDownLong}
    >
      <h2
        className="text-2xl sm:text-[28px] md:text-[32px] font-extrabold tracking-tight"
        style={{
          fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
          color: "#191c1d",
        }}
      >
        {title}
        <span
          className="ml-1"
          style={{ color: "var(--primary-container, #FFD133)" }}
        >
          {highlightedWord}
        </span>
      </h2>

      {showViewAll && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm font-semibold transition-colors duration-200 group shrink-0"
          style={{
            color: "#191c1d",
            fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
          }}
        >
          {viewAllLabel}
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      )}
    </motion.div>
  );
};

export default SectionHeader;

