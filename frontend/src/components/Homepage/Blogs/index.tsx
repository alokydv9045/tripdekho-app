"use client";

import React, { useRef, useState, useEffect } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import BlogCard from "./BlogCard";
import { axiosPublic } from "@/lib/axios";
// import { blogsData } from "../data/blogs";

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    const fetchBlogs = async () => {
      try {
        const res = await axiosPublic.get('/cms/blogs');
        if (res.data.success) {
          setBlogs(res.data.data);
        }
      } catch (error) {
        console.error('Blog fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
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
  }, [blogs]);

  if (!loading && blogs.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400; // Adjust scroll distance as needed
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="blogs-section"
      className="relative w-full py-12 md:py-16"
      style={{ background: "var(--background, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Blogs"
          highlightedWord=""
          showViewAll={false}
        />

        <div className="relative mt-8">
           {/* Left Scroll Button */}
           {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Scroll left"
              suppressHydrationWarning
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#191c1d" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                backdropFilter: "blur(8px)",
              }}
              aria-label="Scroll right"
              suppressHydrationWarning
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#191c1d" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

           {/* Left Fade Gradient */}
           {canScrollLeft && (
            <div
              className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, #ffffff, transparent)" }}
            />
          )}

          {/* Right Fade Gradient */}
          {canScrollRight && (
            <div
              className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, #ffffff, transparent)" }}
            />
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scroll-smooth scrollbar-hide"
          >
            {blogs.map((blog: any) => (
              <BlogCard key={blog.id || blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;
