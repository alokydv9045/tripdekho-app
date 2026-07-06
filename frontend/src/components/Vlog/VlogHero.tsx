'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, MapPin, TrendingUp, Monitor, Minimize2, Volume2, VolumeX } from 'lucide-react';
import PrimaryButton from '../shared/PrimaryButton';
import { useState, useEffect } from 'react';
import MagneticWrapper from '../shared/MagneticWrapper';
import { axiosPublic } from '@/lib/axios';

const VlogHero = () => {
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [trailerUrl, setTrailerUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-ethereal-mountain-range-and-lake-panorama-4432-large.mp4');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosPublic.get('/cms/settings');
        if (res.data?.success && res.data?.data?.vlogTrailerUrl) {
          setTrailerUrl(res.data.data.vlogTrailerUrl);
        }
      } catch (error) {
        console.error('Failed to fetch global settings for trailer URL', error);
      }
    };
    fetchSettings();
  }, []);

  const handleWatchTrailer = () => {
    // Enter cinema mode and unmute
    setIsCinemaMode(true);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleStartJourney = () => {
    // Scroll to the vlog content below
    const vlogContent = document.getElementById('vlog-content');
    if (vlogContent) {
      vlogContent.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  const handleExitCinema = () => {
    setIsCinemaMode(false);
    setIsMuted(true);
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      }
    }
  };

  return (
    <section className={`relative transition-all duration-1000 ease-in-out ${isCinemaMode ? 'h-screen' : 'h-[85vh]'} w-full overflow-hidden flex items-center justify-center`}>
      {/* Video/Image Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          key={trailerUrl}
          className={`w-full h-full object-cover transition-transform duration-1000 ${isCinemaMode ? 'scale-100' : 'scale-110'}`}
          poster="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
        >
          <source src={trailerUrl} type="video/mp4" />
        </video>
        {/* Cinematic Overlays */}
        <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 transition-opacity duration-1000 ${isCinemaMode ? 'opacity-40' : 'opacity-100'}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40" />
      </div>

      {/* Hero Content */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 text-center transition-all duration-1000 ${isCinemaMode ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="mb-8 flex flex-col items-center"
        >
           <span className="px-4 py-1.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 shadow-xl shadow-amber-500/20">
              TripDekho Studios
           </span>
           <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase font-brush">
              Expedition <br />
              <span className="text-amber-500 not-italic font-brush">Stories</span>
           </h1>
        </motion.div>

        <motion.p
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5, duration: 1 }}
           className="text-gray-300 text-sm sm:text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed uppercase tracking-widest px-2"
        >
           Immersive Visual Narratives from the Earth's Most Remote Corners.
        </motion.p>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto">
           <PrimaryButton 
             onClick={handleStartJourney}
             className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 group shadow-2xl shadow-amber-500/20 bg-amber-500 hover:bg-white hover:text-black border-none flex justify-center"
           >
              Start The Journey
           </PrimaryButton>
           
           <button 
             onClick={handleWatchTrailer}
             className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 sm:h-16 px-6 border-2 border-white/20 hover:border-amber-500 hover:text-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all backdrop-blur-md"
           >
            <Play className="w-5 h-5" />
             <span className='text-white'>Watch Trailer</span>
           </button>
        </div>

        {/* Stats Strip */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1.2, duration: 0.8 }}
           className="mt-12 md:mt-20 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 md:gap-20 text-white/50"
        >
           <div className="flex items-center gap-3 group pointer-events-none">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">Trending: Dolomites</span>
           </div>
           <div className="flex items-center gap-3 group pointer-events-none">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">Destinations Covered</span>
           </div>
        </motion.div>
      </div>

      {/* Cinema Mode Controls */}
      <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 md:bottom-10 md:right-12 z-50 flex items-center gap-3">
         {/* Mute/Unmute (visible in cinema mode) */}
         {isCinemaMode && (
           <MagneticWrapper>
             <button 
               onClick={toggleMute}
               className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 bg-black/40 border-white/10 text-white backdrop-blur-xl hover:border-amber-500 transition-all font-black text-[10px] uppercase tracking-widest"
             >
               {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
               {isMuted ? 'Unmute' : 'Muted'}
             </button>
           </MagneticWrapper>
         )}

         {/* Fullscreen (visible in cinema mode) */}
         {isCinemaMode && (
           <MagneticWrapper>
             <button 
               onClick={handleFullscreen}
               className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 bg-black/40 border-white/10 text-white backdrop-blur-xl hover:border-amber-500 transition-all font-black text-[10px] uppercase tracking-widest"
             >
               <Monitor className="w-4 h-4" />
               Fullscreen
             </button>
           </MagneticWrapper>
         )}

         {/* Cinema Mode Toggle */}
         <MagneticWrapper>
            <button 
              onClick={isCinemaMode ? handleExitCinema : handleWatchTrailer}
              className={`flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border-2 transition-all font-black text-[10px] sm:text-xs uppercase tracking-widest ${
                isCinemaMode 
                ? 'bg-amber-500 border-amber-500 text-black shadow-2xl shadow-amber-500/40' 
                : 'bg-black/40 border-white/10 text-white backdrop-blur-xl hover:border-amber-500'
              }`}
            >
              {isCinemaMode ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  Exit Cinema Mode
                </>
              ) : (
                <>
                  <Monitor className="w-4 h-4" />
                  Cinema Mode
                </>
              )}
            </button>
         </MagneticWrapper>
      </div>

      {/* Floating Scroll Indicator */}
      <div className={`hidden md:flex absolute bottom-10 left-12 items-center gap-4 text-white/40 rotate-90 origin-left transition-opacity duration-1000 ${isCinemaMode ? 'opacity-0' : 'opacity-100'}`}>
         <span className="text-[10px] font-black uppercase tracking-[0.4em]">Scroll Reveal</span>
         <div className="w-20 h-px bg-white/20" />
      </div>
    </section>
  );
};

export default VlogHero;
