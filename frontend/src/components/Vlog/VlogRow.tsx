'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { VlogVideo } from './vlogData';
import VlogCard from './VlogCard';

interface VlogRowProps {
  title: string;
  videos: VlogVideo[];
  onPlay: (video: VlogVideo) => void;
}

const VlogRow: React.FC<VlogRowProps> = ({ title, videos, onPlay }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-20 group">
      <div className="flex items-center justify-between px-6 md:px-12 mb-8">
         <div className="flex flex-col">
            <span className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
               <Sparkles className="w-3 h-3" /> Featured Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
               {title}
            </h2>
         </div>
         
         <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <button 
              onClick={() => scroll('left')}
              className="h-12 w-12 rounded-2xl bg-white border border-gray-100 shadow-xl flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all"
            >
               <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="h-12 w-12 rounded-2xl bg-white border border-gray-100 shadow-xl flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all"
            >
               <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div 
        ref={rowRef}
        className="flex items-center gap-6 px-6 md:px-12 overflow-x-auto no-scrollbar scroll-smooth pb-10"
      >
        {videos.map((video) => (
          <div key={video.id || video.id} className="min-w-[300px] md:min-w-[450px] lg:min-w-[500px]">
             <VlogCard video={video} onPlay={() => onPlay(video)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VlogRow;
