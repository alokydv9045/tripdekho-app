'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from './supportData';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const SupportFAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#FFFBF0] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
           <span className="flex items-center justify-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
              <Sparkles className="w-4 h-4" /> Quick Intelligence
           </span>
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
              Common <span className="text-amber-500">Curiosities</span>
           </h2>
        </div>

        <div className="space-y-4">
           {faqs.map((faq, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               viewport={{ once: true }}
               className="group"
             >
                <div 
                  onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                  className={`p-8 bg-white rounded-[32px] border-2 transition-all duration-300 cursor-pointer flex items-center justify-between gap-6 ${activeIndex === idx ? 'border-amber-500 shadow-2xl shadow-amber-500/10' : 'border-gray-50 hover:border-amber-500/30'}`}
                >
                   <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeIndex === idx ? 'bg-amber-500 text-white' : 'bg-gray-50 text-gray-400 group-hover:text-amber-500'}`}>
                         <HelpCircle className="w-6 h-6" />
                      </div>
                      <h3 className={`text-lg font-black uppercase tracking-tighter transition-colors ${activeIndex === idx ? 'text-gray-900' : 'text-gray-500'}`}>
                         {faq.question}
                      </h3>
                   </div>
                   <ChevronDown className={`w-6 h-6 text-gray-300 transition-transform duration-500 ${activeIndex === idx ? 'rotate-180 text-amber-500' : ''}`} />
                </div>
                
                <AnimatePresence>
                   {activeIndex === idx && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                       className="overflow-hidden"
                     >
                        <div className="p-8 pb-10 text-gray-500 text-[11px] font-black uppercase tracking-widest leading-relaxed ml-20 max-w-2xl border-l-2 border-amber-500/20">
                           {faq.answer}
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default SupportFAQ;
