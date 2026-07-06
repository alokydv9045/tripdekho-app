"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Plane, BaggageClaim, Map, Compass, Camera, Tent, Sun, Palmtree, Navigation, Ticket } from "lucide-react";
import { variants } from "@/lib/motion";
import StaggerGroup from "@/components/shared/StaggerGroup";
import HeroSearchBox from "./HeroSearchBox";

interface Props {
  settings?: any;
}


const HeroSection = ({ settings }: Props) => {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 250]);
  const yImage = useTransform(scrollY, [0, 800], [0, 80]);

  return (
    <section
      id="hero-section"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--background, #FFFBF0)" }}
    >
      {/* ... (rest of the decorative background elements) ... */}
      {/* Subtle decorative background elements with parallax */}
      <motion.div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ y: yBg }}
      >
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        
        {/* Animated Floating Travel Icons */}
        <div className="absolute top-[12%] left-[8%] opacity-0 animate-fade-in-up delay-300">
          <Plane className="w-8 h-8 md:w-14 md:h-14 rotate-[15deg] opacity-50 text-[#d97706] animate-float-fast" />
        </div>
        <div className="absolute top-[55%] left-[4%] opacity-0 animate-fade-in-left delay-500">
          <BaggageClaim className="w-6 h-6 md:w-10 md:h-10 -rotate-12 opacity-40 text-[#d97706] animate-float-slow delay-100" />
        </div>
        <div className="absolute top-[25%] left-[40%] opacity-0 animate-fade-in-up delay-400">
          <Compass className="w-10 h-10 md:w-16 md:h-16 rotate-45 opacity-20 text-[#d97706] animate-float-diagonal delay-200" />
        </div>
        <div className="absolute bottom-[20%] right-[3%] opacity-0 animate-fade-in-right delay-500">
          <Map className="w-7 h-7 md:w-12 md:h-12 rotate-[10deg] opacity-40 text-[#d97706] animate-float-slow delay-300" />
        </div>
        <div className="absolute top-[10%] right-[8%] opacity-0 animate-fade-in-left delay-200">
          <Camera className="w-6 h-6 md:w-10 md:h-10 -rotate-[15deg] opacity-30 text-[#d97706] animate-float-fast delay-100" />
        </div>
        
        {/* Additional Organic Elements */}
        <div className="absolute top-[75%] left-[22%] opacity-0 animate-fade-in-up delay-400">
          <Tent className="w-8 h-8 md:w-12 md:h-12 rotate-[5deg] opacity-30 text-[#d97706] animate-float delay-500" />
        </div>
        <div className="absolute top-[8%] left-[60%] opacity-0 animate-fade-in-up delay-500">
          <Sun className="w-10 h-10 md:w-16 md:h-16 opacity-25 text-[#d97706] animate-float-slow" />
        </div>
        <div className="absolute bottom-[25%] left-[45%] opacity-0 animate-fade-in-left delay-300">
          <Palmtree className="w-8 h-8 md:w-14 md:h-14 -rotate-[10deg] opacity-25 text-[#d97706] animate-float-diagonal delay-200" />
        </div>
        <div className="absolute top-[40%] right-[35%] opacity-0 animate-fade-in-right delay-400">
          <Navigation className="w-6 h-6 md:w-10 md:h-10 rotate-[45deg] opacity-30 text-[#d97706] animate-float-fast delay-100" />
        </div>
        <div className="absolute bottom-[10%] right-[30%] opacity-0 animate-fade-in-up delay-500">
          <Ticket className="w-7 h-7 md:w-12 md:h-12 -rotate-[20deg] opacity-40 text-[#d97706] animate-float delay-300" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 md:pt-14 md:pb-24">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-6">
          
          {/* Left Column: Yellow Search Card */}
          <motion.div 
            className="w-full max-w-full lg:max-w-[380px] shrink-0 z-10"
            initial="hidden"
            animate="visible"
            variants={variants.fadeDownLong}
          >

            <div
              className="rounded-2xl p-8 pb-9 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #FFD133 0%, #F5C623 50%, #EEC221 100%)",
                boxShadow: "0 20px 60px -12px rgba(115, 92, 0, 0.20), 0 8px 24px -8px rgba(255, 209, 51, 0.25)",
              }}
            >
              {/* Subtle card texture */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.8) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5) 0%, transparent 40%)`,
                }}
              />

              <StaggerGroup className="relative z-10" isHero>
                {/* Heading */}
                <motion.h1
                  variants={variants.staggerChildFadeDown}
                  className="text-[28px] sm:text-[36px] md:text-[40px] font-extrabold leading-[1.08] mb-3.5 tracking-tight"
                  style={{
                    fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                    color: "#191c1d",
                  }}
                >
                  {settings?.heroStats?.heroTitleTop || "Find Your"}<br />
                  {settings?.heroStats?.heroTitleBottom || "Dream Trip"}
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  variants={variants.staggerChildFadeDown}
                  className="text-[15px] leading-relaxed mb-7 font-medium"
                  style={{
                    fontFamily: "var(--font-vietnam), 'Be Vietnam Pro', sans-serif",
                    color: "#3a3520",
                  }}
                >
                  {settings?.heroStats?.heroSubtitle || "Get instant suggestions for your next adventure"}
                </motion.p>

                {/* Search Form */}
                <motion.div variants={variants.staggerChildFadeDown}>
                  <HeroSearchBox />
                </motion.div>

                {/* Bottom Stats */}
                <motion.div variants={variants.staggerChildFadeDown} className="mt-7 flex items-end justify-between px-1">
                  {/* Reviews */}
                  <div className="flex flex-col items-center justify-center flex-1 pr-4 relative">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      {/* Green star icon */}
                      <svg
                        className="w-[20px] h-[20px]"
                        viewBox="0 0 24 24"
                        fill="#2E7D32"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                      </svg>
                      <span
                        className="text-[18px] font-bold leading-none"
                        style={{
                          color: "#191c1d",
                          fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {settings?.heroStats?.rating || "4.0"}/5
                      </span>
                    </div>
                    <p
                      className="text-[11px] leading-[1.35] text-center font-medium"
                      style={{
                        color: "#4d4633",
                        fontFamily: "var(--font-vietnam), 'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      Based on
                      <br />
                      Reviews
                    </p>

                    {/* Vertical Divider — using background shift instead of border per design system */}
                    <div
                      className="absolute right-0 top-1 bottom-1 w-[1px]"
                      style={{ background: "rgba(25, 28, 29, 0.12)" }}
                    />
                  </div>

                  {/* Happy Customers */}
                  <div className="flex flex-col items-center justify-center flex-1 pl-4">
                    <div
                      className="flex items-center gap-1.5 mb-1.5"
                    >
                      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="#e11d48">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <p
                      className="text-[11px] leading-[1.35] text-center font-medium"
                      style={{
                        color: "#4d4633",
                        fontFamily: "var(--font-vietnam), 'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      Happy
                      <br />
                      Customers
                    </p>
                  </div>
                </motion.div>
              </StaggerGroup>
            </div>
          </motion.div>

          {/* Right Column: Hero Image */}
          <motion.div 
            className="hidden md:flex flex-1 w-full max-w-full lg:max-w-[850px] relative mt-2 lg:mt-0 justify-center lg:justify-end"
            initial="hidden"
            animate="visible"
            variants={variants.fadeDownLong}
          >
            <motion.div 
              className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[620px] lg:-mr-8 xl:-mr-16"
              style={{ y: yImage }}
            >
              {/* Floating animation wrapper */}
              <motion.div 
                className="relative w-full h-full"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/heroimage.png"
                  alt="Search for your next adventure"
                  fill
                  unoptimized
                  className="object-contain lg:object-right object-center drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] mix-blend-multiply"
                  style={{ background: 'transparent' }}
                  priority
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 55vw"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
