'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/types/blog";
import { fixImageUrl } from "@/lib/utils/formatters";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  // Map backend fields with graceful fallbacks
  const title = blog.title || "Untitled Adventure";
  const getImageUrl = (src: any) => {
    if (typeof src === 'string' && src.trim() !== "") return src;
    if (src && typeof src === 'object' && src.url && src.url.trim() !== "") return src.url;
    return "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800";
  };
  const imageSrc = fixImageUrl(getImageUrl(blog.thumbnail || blog.image));
  const dateStr = blog.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) 
    : blog.date || "Just Now";
  const readTime = blog.readTime || "5 min read";
  const slug = blog.slug || blog.id || blog.id || "";
  const href = slug ? `/blog/${slug}` : "#";

  return (
    <article className="shrink-0 w-[280px] sm:w-[320px] flex flex-col bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.04)] h-full transition-transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative w-full aspect-[16/9] bg-gray-100">
        <Image
          src={imageSrc || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 280px, 320px"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col grow p-4 sm:p-5">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-[15px] leading-snug mb-4 line-clamp-2">
          {title}
        </h3>

        {/* Footer info */}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1.5 font-medium">
            <span>{dateStr}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{readTime}</span>
          </div>

          <Link
            href={href}
            className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            Read Now 
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
