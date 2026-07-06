"use client";

import React, { useRef, useState, useEffect } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import VideoCard from "./VideoCard";
import { axiosPublic } from "@/lib/axios";
import VideoModal from "../../Vlog/VideoModal";



const VibeWithUs: React.FC = () => {
  const [vibeVideos, setVibeVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<any | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 4
    );
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosPublic.get('/cms/vlogs');
        if (res.data.success) {
          // Show all active vlogs on homepage, sorted by arrangement order
          const active = (Array.isArray(res.data.data) ? res.data.data : []).filter((v: any) => v.isActive);
          const sorted = active.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
          setVibeVideos(sorted);
        } else {
          setVibeVideos([]);
        }
      } catch (error) {
        console.error('Fetch vibe videos failed:', error);
        setVibeVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);


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
  }, [vibeVideos]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="vibe-with-us-section"
      className="relative w-full py-12 md:py-16"
      style={{ background: "var(--background, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Vibe with"
          highlightedWord="Us"
          showViewAll={false}
        />

        <div className="relative mt-8">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              id="vibe-scroll-left"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Scroll left"
              suppressHydrationWarning
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
              id="vibe-scroll-right"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Scroll right"
              suppressHydrationWarning
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
              className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, #ffffff, transparent)",
              }}
            />
          )}

          {/* Right Fade Gradient */}
          {canScrollRight && (
            <div
              className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to left, #ffffff, transparent)",
              }}
            />
          )}

          {/* Cards Row */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-6 scroll-smooth scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {vibeVideos.map((video) => (
              <VideoCard 
                key={video.id || video.id} 
                video={video} 
                onClick={() => setActiveVideo(video)}
              />
            ))}
          </div>
        </div>
      </div>

      <VideoModal 
        video={activeVideo} 
        onClose={() => setActiveVideo(null)} 
      />
    </section>
  );
};

export default VibeWithUs;
