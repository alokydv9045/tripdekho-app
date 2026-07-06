"use client";

import React from "react";
import Header from "@/components/Header";
import { Compass, Shield, Heart, Globe, ArrowRight, Star, Users, Map, CheckCircle2, Zap, Anchor, Clock, Mountain, Award, ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const AboutPage = () => {
  const auditPhases = [
    { id: "01", title: "Digital Sourcing", desc: "Cross-referencing global sentiment, regulatory records, and safety history across 40+ databases." },
    { id: "02", title: "Operator Audit", desc: "Direct legal and infrastructure verification of the regional partner's gear and fleet." },
    { id: "03", title: "Shadowing", desc: "A TripDekho scout joins a standard departure anonymously to audit real-world service." },
    { id: "04", title: "Safety Protocol", desc: "Strict verification of first-aid certifications and emergency evacuation routes." },
    { id: "05", title: "Heritage Calibration", desc: "Ensuring the trip respects local indigenous customs and preserves fragile ecosystems." },
    { id: "06", title: "Yield Review", desc: "Verifying local guide compensation meets our 'Fair-Wage' benchmark (>30% above market)." },
    { id: "07", title: "Scout Certification", desc: "A detailed report is filed by the lead scout for final brand alignment review." },
    { id: "08", title: "Live Activation", desc: "The trip is activated with a 'Scout-Verified' seal, subject to quarterly re-audits." }
  ];

  const stats = [
    { value: "2M+", label: "Happy Travelers" },
    { value: "150K+", label: "Verified Reviews" },
    { value: "500+", label: "Scout-Verified Trips" },
    { value: "98.6%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-gray-900 selection:bg-amber-100 font-sans">
      <Header />

      <main>
        {/* Luxurious Hero - Moody Minimalist */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
               className="w-full h-full object-cover grayscale opacity-[0.15]" 
               alt="Moody Mountain"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-3 px-4 py-1.5 border border-gray-200 rounded-full bg-white/50 backdrop-blur-sm"
             >
                <Mountain className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Established MMXXIV in Manali</span>
             </motion.div>
             
             <motion.h1
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.15 }}
               className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[0.9] italic font-lora"
             >
                the art of <br /> <span className="text-amber-600 not-italic">curation.</span>
             </motion.h1>
             
             <motion.p
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="max-w-xl mx-auto text-lg text-gray-400 font-medium leading-relaxed tracking-tight"
             >
                TripDekho is a high-density travel collective dedicated to the pursuit of authentic, scout-verified expeditions.
             </motion.p>

             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.45 }}
               className="flex flex-wrap justify-center gap-6 pt-4"
             >
               <Link href="/trips">
                 <button className="h-14 px-10 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-amber-500 hover:text-black transition-all flex items-center gap-3">
                   Browse Expeditions <ArrowRight size={14} />
                 </button>
               </Link>
               <Link href="/vlog">
                 <button className="h-14 px-10 border border-gray-200 text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-gray-50 transition-all flex items-center gap-3">
                   <Play size={14} className="text-amber-500 fill-amber-500" /> Watch Our Story
                 </button>
               </Link>
             </motion.div>
          </div>
        </section>



        {/* Founder's Note - Aman Chaudhary */}
        <section className="py-32 bg-white border-y border-gray-100">
           <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-20 items-center">
                 <div className="md:col-span-5 relative">
                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-[40px] shadow-2xl">
                       <img 
                         src="/aman founder.png" 
                         className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                         alt="Aman Chaudhary"
                       />
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-amber-500 rounded-full flex items-center justify-center p-8 text-black font-black text-xs uppercase tracking-tighter leading-none text-center">
                       verified leadership since day zero
                    </div>
                 </div>
                 <div className="md:col-span-7 space-y-10">
                    <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.5em]">Visionary Statement</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none italic font-lora">"Luxury is the truth <br /> of the experience."</h2>
                    <div className="space-y-6 text-gray-500 font-medium leading-[1.8] text-lg">
                       <p>
                          Travel has been commoditized into a series of identical booking buttons. We founded TripDekho to reclaim the narrative. I wanted a platform where 'verified' wasn't an algorithm, but a person—a Scout who has walked the trail before you.
                       </p>
                       <p>
                          Our mission is simple: To empower local indigenous guides and connect them with explorers who value authenticity over artifice. We don't sell trips; we curate legacies.
                       </p>
                    </div>
                    <div>
                       <p className="font-black text-xl uppercase tracking-tighter">Aman Chaudhary</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Head Scout</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Mission Video CTA */}
        <section className="py-32 bg-gray-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/80 to-gray-950" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8 block">Our Story in Motion</span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-12">
              See the World <br /> <span className="text-amber-500">Through Our Eyes</span>
            </h2>
            <Link href="/vlog">
              <button className="w-24 h-24 mx-auto rounded-full bg-amber-500 text-black flex items-center justify-center hover:scale-110 hover:bg-white transition-all duration-300 shadow-2xl shadow-amber-500/30 group">
                <Play size={36} className="fill-current ml-2 group-hover:scale-110 transition-transform" />
              </button>
            </Link>
            <p className="text-gray-500 mt-8 text-sm font-bold uppercase tracking-widest">Watch Our Travel Vlogs</p>
          </div>
        </section>

        {/* The Scout Protocol - Deep Detail */}
        <section className="py-32 bg-[#FFFBF0]">
           <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                 <div className="max-w-xl">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-6 font-lora">The Scout Protocol</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed">Our 8-Phase verification framework represents the most stringent audit in the luxury travel industry.</p>
                 </div>
                 <div className="p-6 bg-white border border-gray-200 rounded-3xl flex items-center gap-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-amber-600">
                       <Award size={24} />
                    </div>
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest text-gray-900 leading-none">Global Accuracy</p>
                       <p className="text-2xl font-black text-amber-600 mt-1">100%</p>
                    </div>
                 </div>
              </div>

              {/* Connected Timeline Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {auditPhases.map((phase, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.07 }}
                     className="p-8 bg-white border border-gray-100 rounded-[32px] hover:border-amber-500 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 group h-full"
                   >
                      <p className="text-4xl font-black text-gray-100 group-hover:text-amber-500/20 transition-colors mb-6">{phase.id}</p>
                      <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 font-lora">{phase.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">{phase.desc}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Ethical Stewardship */}
        <section className="py-32 bg-white">
           <div className="max-w-7xl mx-auto px-6">
              <div className="bg-gray-50 rounded-[64px] p-16 md:p-24 border border-gray-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px]" />
                 
                 <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                       <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.5em]">The Ethical Promise</span>
                       <h2 className="text-5xl font-black tracking-tighter uppercase leading-none font-lora">Luxury With <br /> <span className="text-gray-300 italic">Integrity.</span></h2>
                       <p className="text-lg text-gray-500 font-medium leading-relaxed">
                          We believe the finest travel moments are built on respect. Our zero-plastic protocol and fair-wage guide initiatives ensure that your journey leaves a positive footprint on the world.
                       </p>
                       <div className="grid grid-cols-2 gap-10">
                          <div className="space-y-2">
                             <p className="text-3xl font-black">100%</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Guide Compensation Clarity</p>
                          </div>
                          <div className="space-y-2">
                             <p className="text-3xl font-black">Zero</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Single Use Plastics On-ground</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-12">
                       {[
                         { title: "Indigeneous Empowerment", desc: "Collaborating with village councils to ensure tourism benefits stay within the local economy." },
                         { title: "Regenerative Travel", desc: "A portion of every TripDekho platform fee is reinvested into regional conservation hubs." }
                       ].map((promise, i) => (
                         <div key={i} className="flex gap-8 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-amber-500 flex-shrink-0">
                               <CheckCircle2 size={24} />
                            </div>
                            <div className="space-y-2">
                               <h4 className="text-lg font-bold uppercase tracking-tight font-lora">{promise.title}</h4>
                               <p className="text-sm text-gray-400 leading-relaxed font-medium">{promise.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 text-center bg-white border-t border-gray-100">
           <div className="max-w-4xl mx-auto px-6 space-y-12">
              <h2 className="text-3xl font-bold tracking-tighter uppercase text-gray-400 font-lora">Join the Collective</h2>
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                 <Link href="/trips">
                    <button className="h-16 px-12 bg-gray-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 hover:text-black transition-all">
                       Browse Active Expeditions
                    </button>
                  </Link>
                  <Link href="/agents">
                    <button className="h-16 px-12 border border-gray-200 text-gray-900 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-gray-900 hover:text-white transition-all">
                       Partner With Us
                    </button>
                  </Link>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
