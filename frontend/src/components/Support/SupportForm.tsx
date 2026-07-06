'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, MessageSquare, Send, CheckCircle2, ChevronRight, MapPin, Phone, Building2 } from 'lucide-react';
import { contactService } from '@/services/contactService';
import { toast } from 'sonner';

const SupportForm = () => {
   const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      topic: 'general',
      message: ''
   });

   useEffect(() => {
      if (typeof window !== 'undefined') {
         const params = new URLSearchParams(window.location.search);
         const type = params.get('type');
         if (type === 'transport') {
            setFormData(prev => ({ ...prev, topic: 'transport' }));
         } else if (type === 'creator') {
            setFormData(prev => ({ ...prev, topic: 'creator' }));
         } else if (type === 'captain') {
            setFormData(prev => ({ ...prev, topic: 'captain' }));
         }
      }
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('submitting');
      try {
         await contactService.submitContact(formData);
         setStatus('success');
         setTimeout(() => {
            setStatus('idle');
            setFormData({ name: '', email: '', topic: 'general', message: '' });
         }, 5000);
      } catch (err: any) {
         setStatus('idle');
         toast.error(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
      }
   };


   return (
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Live Contact Info */}
            <div className="space-y-16">
               <div>
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block underline underline-offset-8 decoration-amber-500/30">Direct Inquiries</span>
                  <h2 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] mb-8">
                     Get in <br />
                     <span className="text-amber-500 not-italic">Synchronized.</span>
                  </h2>
                  <p className="text-gray-500 text-lg font-medium max-w-xl leading-relaxed uppercase tracking-widest">
                     Not found what you're looking for? Reach out to our human concierge team directly.
                  </p>
               </div>

               <div className="space-y-8">
                  {[
                     { icon: MapPin, title: "Headquarters", detail: "Tech Park, Sector 4, Bangalore" },
                     { icon: Mail, title: "Official Email", detail: "hello@tripdekho.com" },
                     { icon: Phone, title: "Direct Hotline", detail: "+91 1800-TRIPDEKHO" }
                  ].map((item, idx) => (
                     <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-6 group"
                     >
                        <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-500 transition-colors shadow-xl group-hover:rotate-6">
                           <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-amber-500 transition-colors">{item.title}</p>
                           <p className="text-lg font-black uppercase italic tracking-tighter text-gray-900">{item.detail}</p>
                        </div>
                     </motion.div>
                  ))}
               </div>

               {/* Response Time Indicator */}
               <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 flex items-center justify-between group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-[50px] group-hover:blur-[80px] transition-all" />
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic">Live Status: System Online</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest relative z-10 flex items-center gap-2">
                     Expect Response in <span className="text-gray-900 underline decoration-amber-500 pr-1">12 minutes</span> <ChevronRight className="w-3 h-3" />
                  </span>
               </div>
            </div>

            {/* Advanced Form */}
            <div className="relative">
               <div className="absolute inset-0 bg-gray-900 rounded-[60px] translate-x-4 translate-y-4 -z-10 opacity-5" />
               <div className="bg-white border-2 border-gray-50 p-12 lg:p-16 rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] h-full relative overflow-hidden">

                  <AnimatePresence mode="wait">
                     {status === 'success' ? (
                        <motion.div
                           key="success"
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           className="h-full flex flex-col items-center justify-center text-center space-y-8"
                        >
                           <div className="w-24 h-24 bg-green-500 text-white rounded-[40px] flex items-center justify-center shadow-2xl shadow-green-500/20">
                              <CheckCircle2 className="w-12 h-12" strokeWidth={1.5} />
                           </div>
                           <div>
                              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">Message Synchronized!</h3>
                              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                 Our team has received your inquiry. We will respond within the next hour.
                              </p>
                           </div>
                        </motion.div>
                     ) : (
                        <motion.form
                           key="form"
                           onSubmit={handleSubmit}
                           className="space-y-8 h-full"
                        >
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <User className="w-3 h-3" /> Full Identity
                                 </label>
                                 <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-amber-500 font-bold transition-all focus:bg-white"
                                    placeholder="KAYLA ADVENTURE"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Mail className="w-3 h-3" /> Digital Address
                                 </label>
                                 <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-amber-500 font-bold transition-all focus:bg-white"
                                    placeholder="KAYLA@EXPLORE.COM"
                                 />
                              </div>
                           </div>

                           <div className="space-y-3">
                              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                 <MessageSquare className="w-3 h-3" /> Inquiry Topic
                              </label>
                              <select
                                 value={formData.topic}
                                 onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                 className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-amber-500 font-bold transition-all cursor-pointer appearance-none"
                              >
                                 <option value="general">GENERAL EXPLORATION</option>
                                 <option value="booking">BOOKING ARCHITECTURE</option>
                                 <option value="payment">PAYMENT PROTOCOL</option>
                                 <option value="partnership">ELITE VENDOR PROGRAM</option>
                                 <option value="transport">TRANSPORT PARTNERSHIP</option>
                                 <option value="creator">CREATOR / VLOGGER PROGRAM</option>
                                 <option value="captain">TRIP CAPTAIN ROLE</option>
                              </select>
                           </div>

                           <div className="space-y-3">
                              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                 <MessageSquare className="w-3 h-3" /> Your Narrative
                              </label>
                              <textarea
                                 required
                                 value={formData.message}
                                 onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                 className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-amber-500 font-bold transition-all h-40 resize-none focus:bg-white"
                                 placeholder="HOW CAN WE ASSIST YOUR JOURNEY?"
                              />
                           </div>

                           <button
                              type="submit"
                              disabled={status === 'submitting'}
                              className="w-full bg-gray-900 text-white h-16 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl group overflow-hidden"
                           >
                              {status === 'submitting' ? (
                                 <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Synchronizing...
                                 </div>
                              ) : (
                                 <>
                                    Propagate Inquiry <Send className="w-4 h-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                 </>
                              )}
                           </button>
                        </motion.form>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </div>
      </section>
   );
};

export default SupportForm;
