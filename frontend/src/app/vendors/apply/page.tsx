'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Camera, MapPin, Users, Send, Star, Sparkles, ChevronRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const VendorApplyPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const perks = [
    { icon: <Star className="w-5 h-5 text-amber-500" />, title: "Elite Visibility", desc: "Showcase your expertise to our premium community of adventurers." },
    { icon: <ShieldCheck className="w-5 h-5 text-amber-500" />, title: "Guaranteed Payouts", desc: "Secure and timely earnings with our advanced escrow platform." },
    { icon: <Zap className="w-5 h-5 text-amber-500" />, title: "Concierge Support", desc: "Dedicated team to help you curate and grow your travel experiences." }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => router.push('/'), 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-24 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* Left Column: Brand Pitch */}
          <div className="lg:col-span-5 space-y-12 h-fit lg:sticky lg:top-32">
             <div className="space-y-6">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-amber-500 text-xs font-semibold flex items-center gap-3"
                >
                   <Sparkles className="w-4 h-4" /> Elite Vendor Program
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight"
                >
                   Craft <br /> The <span className="text-amber-500 underline decoration-8 decoration-amber-500/20 underline-offset-[16px]">Future</span> <br /> of Travel
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/40 text-sm font-medium leading-relaxed max-w-sm"
                >
                   TripDekho isn't just a platform; it's a guild of dreamers, storytellers, and explorers. We invite the finest guides and hosts to join our mission.
                </motion.p>
             </div>

             <div className="space-y-8 pt-6 border-t border-white/10">
                {perks.map((perk, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.3 + idx * 0.1 }}
                     className="flex gap-5 group"
                   >
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                        {perk.icon}
                      </div>
                      <div className="space-y-1">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-amber-500 transition-colors">{perk.title}</h4>
                         <p className="text-[10px] text-white/40 font-medium leading-relaxed">{perk.desc}</p>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>

          {/* Right Column: Animated Form */}
          <div className="lg:col-span-7">
             <div className="bg-white/5 border border-white/10 p-10 md:p-16 rounded-[40px] backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all" />
                
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      className="relative z-10"
                    >
                       <div className="flex items-center justify-between mb-12">
                          <h3 className="text-2xl font-black uppercase tracking-tighter">Application</h3>
                          <div className="flex gap-2">
                             {[1, 2, 3].map((i) => (
                                <div 
                                  key={i} 
                                  className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-amber-500' : 'w-4 bg-white/10'}`} 
                                />
                             ))}
                          </div>
                       </div>

                       <form onSubmit={handleSubmit} className="space-y-10">
                          {step === 1 && (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-8"
                            >
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Your Name</label>
                                  <input 
                                    className="w-full h-14 bg-transparent border-b border-white/10 outline-none focus:border-amber-500 font-bold transition-all" 
                                    placeholder="COMMANDER SMITH" 
                                    required
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Professional Role</label>
                                  <select className="w-full h-14 bg-transparent border-b border-white/10 outline-none focus:border-amber-500 font-bold transition-all text-sm uppercase tracking-widest">
                                     <option value="leader">TRIP LEADER</option>
                                     <option value="photo">PHOTOGRAPHER</option>
                                     <option value="host">LOCAL HOST</option>
                                     <option value="story">STORYTELLER</option>
                                  </select>
                               </div>
                               <button 
                                 type="button"
                                 onClick={() => setStep(2)}
                                 className="h-16 px-10 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-amber-500 transition-colors shadow-2xl shadow-white/5"
                               >
                                  Continue <ChevronRight className="w-4 h-4" />
                               </button>
                            </motion.div>
                          )}

                          {step === 2 && (
                             <motion.div 
                               initial={{ opacity: 0, x: 20 }}
                               animate={{ opacity: 1, x: 0 }}
                               className="space-y-8"
                             >
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Portfolio / Social URL</label>
                                   <input className="w-full h-14 bg-transparent border-b border-white/10 outline-none focus:border-amber-500 font-bold transition-all" placeholder="INSTAGRAM.COM/YOURS" />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Primary Base / City</label>
                                   <input className="w-full h-14 bg-transparent border-b border-white/10 outline-none focus:border-amber-500 font-bold transition-all" placeholder="GURGAON, INDIA" />
                                </div>
                                <div className="flex gap-4">
                                   <button 
                                     type="button"
                                     onClick={() => setStep(1)}
                                     className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                                   >
                                      <ChevronRight className="w-4 h-4 rotate-180" />
                                   </button>
                                   <button 
                                     type="button"
                                     onClick={() => setStep(3)}
                                     className="flex-1 h-16 px-10 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-amber-500 transition-colors"
                                   >
                                      Almost There <ChevronRight className="w-4 h-4" />
                                   </button>
                                </div>
                             </motion.div>
                          )}

                          {step === 3 && (
                             <motion.div 
                               initial={{ opacity: 0, x: 20 }}
                               animate={{ opacity: 1, x: 0 }}
                               className="space-y-8"
                             >
                                <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Why TripDekho?</label>
                                   <textarea 
                                     className="w-full h-40 bg-transparent border-b border-white/10 outline-none focus:border-amber-500 font-bold transition-all resize-none text-sm pt-4" 
                                     placeholder="Tell us what makes your journey unique..."
                                   />
                                </div>
                                <div className="flex gap-4">
                                   <button 
                                     type="button"
                                     onClick={() => setStep(2)}
                                     className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                                   >
                                      <ChevronRight className="w-4 h-4 rotate-180" />
                                   </button>
                                   <button 
                                     type="submit"
                                     className="flex-1 h-16 px-10 bg-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-2xl shadow-amber-500/20"
                                   >
                                      Submit Application <Send className="w-4 h-4" />
                                   </button>
                                </div>
                             </motion.div>
                          )}
                       </form>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-20 text-center space-y-8"
                    >
                       <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/40">
                          <CheckCircle2 className="w-12 h-12 text-black" />
                       </div>
                       <div className="space-y-3">
                          <h2 className="text-4xl font-black uppercase tracking-tighter">Initiated</h2>
                          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">Our Concierge will reach out shortly</p>
                       </div>
                       <Sparkles className="w-6 h-6 text-amber-500 mx-auto animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorApplyPage;
