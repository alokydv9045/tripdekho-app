'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Eye, MapPin, Share2 } from 'lucide-react';
import { VlogVideo } from './vlogData';
import { fixImageUrl } from '@/lib/utils/formatters';

interface VlogCardProps {
  video: VlogVideo;
  onPlay: (video: VlogVideo) => void;
}

// Map categories to high-quality ambient previews for the 'WOW' factor
const previewVideos: Record<string, string> = {
  'Adventure': 'https://assets.mixkit.co/videos/preview/mixkit-adventure-photographer-standing-on-top-of-a-mountain-40092-large.mp4',
  'Culture': 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-her-back-to-the-camera-looking-at-a-building-42171-large.mp4',
  'Relaxation': 'https://assets.mixkit.co/videos/preview/mixkit-ethereal-mountain-range-and-lake-panorama-4432-large.mp4',
  'Food': 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-salad-41312-large.mp4',
};

const VlogCard: React.FC<VlogCardProps> = ({ video, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(video)}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[9/16] md:aspect-[4/5] overflow-hidden rounded-[32px] bg-gray-900 shadow-2xl border border-white/10 group-hover:shadow-amber-500/40 transition-all duration-700">
        
        {/* Background Layer: Static Image */}
        <motion.img
          src={video.thumbnail?.trim() ? fixImageUrl(video.thumbnail) : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop'}
          alt={video.title}
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            filter: isHovered ? 'brightness(0.5)' : 'brightness(0.9)'
          }}
          className="w-full h-full object-cover absolute inset-0 z-0"
        />


        
        {/* Cinematic Gradient Overlay */}
        <div className={`absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
        
        {/* Play Button Overlay (High Priority) */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
            <motion.div
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                opacity: isHovered ? 1 : 0.8
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-500 text-black shadow-[0_0_40px_rgba(245,158,11,0.5)]"
            >
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            </motion.div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-40">
           <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-[0.2em] rounded-lg">
              {video.category}
           </span>
           <span className="px-3 py-1 bg-amber-500/20 backdrop-blur-md text-amber-500 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest rounded-lg">
              {video.duration}
           </span>
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-6 left-8 right-8 z-40 transition-transform duration-500">
           <motion.div 
             animate={{ y: isHovered ? -5 : 0 }}
             className="flex items-center gap-2 text-amber-500 mb-2"
           >
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{video.location}</span>
           </motion.div>
           <h3 className="text-xl md:text-2xl font-black text-white leading-none uppercase group-hover:text-amber-400 transition-colors tracking-tighter">
              {video.title}
           </h3>
        </div>
      </div>

      {/* Stats Under-Card (Reveal on Hover) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 flex items-center justify-between px-6 text-gray-500"
          >
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <Eye className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{video.views}</span>
                </div>
                <button className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                   <Share2 className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                </button>
             </div>
             <Clock className="w-4 h-4 opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VlogCard;
