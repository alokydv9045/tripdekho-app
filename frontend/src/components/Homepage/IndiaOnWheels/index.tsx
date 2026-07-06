"use client";

import React, { useRef, useState, useEffect } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import DestinationCard from "./DestinationCard";
import { indiaOnWheelsDestinations } from "../data/indiaOnWheels";
import { motion } from "framer-motion";
import { variants } from "@/lib/motion";

const IndiaOnWheels: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 4
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 320;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="india-on-wheels-section"
      className="relative w-full py-12 md:py-16"
      style={{ background: "var(--background, #FFFBF0)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="India on"
          highlightedWord="Wheels"
          showViewAll={false}
        />

        {/* Scrollable Two-Row Grid */}
        <div className="relative">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              id="india-wheels-scroll-left"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Scroll left"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#191c1d"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              id="india-wheels-scroll-right"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Scroll right"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#191c1d"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Left Fade Gradient */}
          {canScrollLeft && (
            <div
              className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, var(--background, #FFFBF0), transparent)",
              }}
            />
          )}

          {/* Right Fade Gradient */}
          {canScrollRight && (
            <div
              className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to left, var(--background, #FFFBF0), transparent)",
              }}
            />
          )}

          {/* Two-Row Scrollable Grid */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scroll-smooth scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div
              className="grid grid-rows-2 grid-flow-col gap-5 md:gap-6"
              style={{
                gridAutoColumns: "minmax(200px, 1fr)",
              }}
            >
              {indiaOnWheelsDestinations.map((destination, i) => (
                <motion.div
                  key={destination.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={variants.fadeDownLong}
                  transition={{ delay: (i % 6) * 0.1 }}
                >
                  <DestinationCard
                    destination={destination}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndiaOnWheels;
