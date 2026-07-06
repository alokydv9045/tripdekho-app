'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Maximize2, Volume2, Info, ExternalLink, Instagram } from 'lucide-react';
import Link from 'next/link';

interface VideoModalProps {
  video: any | null; // Can be VlogVideo or VibeVideo
  onClose: () => void;
}

const fixImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://localhost:9000/')) {
    return url.replace('http://localhost:9000/', 'http://127.0.0.1:9000/');
  }
  return url;
};

/**
 * Extract an Instagram shortcode from various URL formats:
 * - https://www.instagram.com/reel/ABC123/
 * - https://www.instagram.com/p/ABC123/
 * - https://instagram.com/reels/ABC123/?igsh=...
 */
const extractInstagramShortcode = (url: string): string | null => {
  const match = url.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
};

const isInstagramUrl = (url: string): boolean => {
  return url.includes('instagram.com/reel') || url.includes('instagram.com/p/') || url.includes('instagram.com/reels/') || url.includes('instagram.com/tv/');
};

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (video) {
      document.body.style.overflow = 'hidden';
      setIframeError(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [video]);

  // Detect if the instagramUrl is raw blockquote HTML
  const isInstagramEmbed = useMemo(() => {
    return video?.instagramUrl?.includes('<blockquote');
  }, [video?.instagramUrl]);

  // Load Instagram embed.js when we have blockquote HTML
  useEffect(() => {
    if (isInstagramEmbed && video) {
      if (!(window as any).instgrm) {
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if ((window as any).instgrm) {
            (window as any).instgrm.Embeds.process();
          }
        };
        document.body.appendChild(script);
      } else {
        // Small delay so the DOM can render the blockquote before processing
        setTimeout(() => {
          (window as any).instgrm.Embeds.process();
        }, 100);
      }
    }
  }, [video, isInstagramEmbed]);

  // Build embed URL based on the video source
  const embedUrl = useMemo(() => {
    if (!video) return '';
    if (isInstagramEmbed) return ''; // Handled via innerHTML

    const url = video.videoUrl || video.instagramUrl;
    if (!url) return '';

    // Handle Instagram URL → use /embed/ path
    if (isInstagramUrl(url)) {
      const shortcode = extractInstagramShortcode(url);
      if (shortcode) {
        return `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
      }
      // Fallback: strip query params and append /embed
      const baseUrl = url.split('?')[0].replace(/\/+$/, '');
      return `${baseUrl}/embed/`;
    }

    // Handle YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be')) {
        videoId = url.split('/').pop() || '';
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0`;
    }

    return url;
  }, [video, isInstagramEmbed]);

  if (!video) return null;

  const isInstagram = video.instagramUrl || (video.videoUrl && video.videoUrl.includes('instagram.com'));
  const instagramDirectUrl = video.instagramUrl && !video.instagramUrl.includes('<blockquote') 
    ? video.instagramUrl.split('?')[0] 
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl bg-black/80"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={`relative w-full overflow-hidden bg-[#0f1115] shadow-[0_0_100px_rgba(245,158,11,0.2)] border border-white/5 ${
            isInstagram ? 'max-w-md h-[85vh] max-h-[850px] flex flex-col rounded-3xl' : 'max-w-6xl aspect-video rounded-[50px]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute z-50 p-3 bg-black/50 text-white hover:bg-amber-500 hover:text-black rounded-full transition-all duration-300 ${isInstagram ? 'top-4 right-4' : 'top-6 right-6'}`}
          >
            <X className="w-5 h-5" />
          </button>

          {isInstagram ? (
            /* =========================================
               INSTAGRAM EMBED LAYOUT (Split View)
               ========================================= */
            <div className="flex flex-col w-full h-full">
              {/* Video Area */}
              <div className="flex-1 w-full bg-white relative overflow-hidden">
                {isInstagramEmbed ? (
                  <div 
                    className="w-full h-full flex flex-col items-center justify-center overflow-y-auto bg-white py-4 instagram-wrapper"
                    dangerouslySetInnerHTML={{ __html: video.instagramUrl }}
                  />
                ) : embedUrl && !iframeError ? (
                  <iframe
                    src={embedUrl}
                    title={video.title || 'Instagram Reel'}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                    onError={() => setIframeError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-[#0f1115] p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center mb-6">
                      <Instagram className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Instagram Reel</p>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">{video.title || 'Watch This Reel'}</h3>
                  </div>
                )}
              </div>

              {/* Action Bar Below Video */}
              <div className="shrink-0 w-full bg-[#0f1115] p-5 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-base font-black text-white uppercase tracking-tight line-clamp-1">{video.title}</h3>
                   <div className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-lg">
                      {video.category || 'Vibe'}
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                   {video.linkedTripId ? (
                     <Link href={`/trips/${video.linkedTripId}`} className="flex-1">
                        <button className="w-full h-12 bg-amber-500 text-black text-[11px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-amber-500/20 hover:bg-white transition-colors">
                           Book This Trip
                        </button>
                     </Link>
                   ) : (
                     <button disabled className="flex-1 h-12 bg-white/5 text-white/40 text-[11px] font-black uppercase tracking-widest rounded-xl cursor-not-allowed">
                        Book This Trip
                     </button>
                   )}

                   {instagramDirectUrl && (
                     <a 
                       href={instagramDirectUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex-1 h-12 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 border border-pink-500/30 text-white text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                     >
                       <ExternalLink className="w-4 h-4" /> Open IG
                     </a>
                   )}
                </div>
              </div>
            </div>
          ) : (
            /* =========================================
               STANDARD VIDEO LAYOUT (Cinematic Overlays)
               ========================================= */
            <>
              {/* Metadata Overlay */}
              <div className="absolute top-8 left-8 flex items-center gap-4 z-50 pointer-events-none">
                 <div className="px-4 py-2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl pointer-events-auto">
                    {video.category || 'Vibe'}
                 </div>
                 <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{video.views || '0'} Views</span>
              </div>

              {/* Bottom Info Bar Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-8 md:p-12 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/80 to-transparent z-40 pointer-events-none flex flex-col md:flex-row justify-between items-end gap-10">
                 <div className="max-w-2xl pointer-events-auto">
                    <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Now Exploring</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-[0.9]">
                       {video.title}
                    </h2>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6 uppercase tracking-widest line-clamp-2 md:line-clamp-none">
                       {video.description}
                    </p>
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-amber-500" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{video.location}</span>
                       </div>
                       <button 
                          onClick={() => setIsMuted(!isMuted)}
                          className="flex items-center gap-2 hover:scale-105 transition-transform"
                       >
                          <Volume2 className={`w-4 h-4 ${isMuted ? 'text-gray-500' : 'text-amber-500'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isMuted ? 'text-gray-500' : 'text-white'}`}>
                             {isMuted ? 'Unmute' : 'Atmos Surround'}
                          </span>
                       </button>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 pointer-events-auto">
                    <button className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all">
                       <Share2 className="w-6 h-6" />
                    </button>
                    {video.linkedTripId ? (
                       <Link href={`/trips/${video.linkedTripId}`}>
                          <button className="h-14 px-8 bg-amber-500 text-black text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-transform active:scale-95">
                             Book This Trip
                          </button>
                       </Link>
                    ) : (
                       <button disabled className="h-14 px-8 bg-white/10 text-white/50 text-xs font-black uppercase tracking-widest rounded-2xl cursor-not-allowed">
                          Book This Trip
                       </button>
                    )}
                 </div>
              </div>

              {/* Actual Video Player */}
              <div className="w-full h-full pointer-events-auto flex items-center justify-center overflow-hidden bg-black/5">
                <video
                  src={fixImageUrl(video.videoUrl)}
                  title={video.title || 'Video Player'}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-contain bg-black"
                  controls={false}
                />
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoModal;
