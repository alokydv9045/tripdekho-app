import React from "react";
import Image from "next/image";
import { VibeVideo } from "@/types/vibeVideo";
import { fixImageUrl } from "@/lib/utils/formatters";

interface VideoCardProps {
  video: VibeVideo;
  onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <article
      id={`vibe-video-${video.id || video.id}`}
      onClick={onClick}
      className="relative shrink-0 w-[180px] sm:w-[200px] h-[320px] sm:h-[350px] rounded-xl overflow-hidden cursor-pointer group"
      style={{
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      <Image
        src={fixImageUrl(video.thumbnail) || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop'}
        alt={video.title || "Vibe With Us Video"}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 180px, 200px"
      />
      
      {/* Overlay gradient for better contrast if text was added, mapping to design's slightly darkened lower half */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-40" 
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)'
        }}
      />

      {/* Mute/Sound Icon (bottom right, per design) */}
      <div className="absolute bottom-3 right-3 z-20 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
        <svg
          className="w-3.5 h-3.5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      </div>
    </article>
  );
};

export default VideoCard;
