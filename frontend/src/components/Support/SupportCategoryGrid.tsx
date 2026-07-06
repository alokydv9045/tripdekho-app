'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { supportCategories } from './supportData';

const SupportCategoryGrid = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
           <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Help Resource Hub</span>
           <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
              Browse the <span className="text-amber-500">Resource</span> <br /> Categories
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {supportCategories.map((category, idx) => (
             <motion.div
               key={category.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               viewport={{ once: true }}
               className="group p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:border-amber-500/30 hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer"
             >
                <div className={`w-16 h-16 rounded-2xl ${category.bg} flex items-center justify-center mb-8 shadow-xl shadow-gray-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${category.color}`}>
                   <category.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4 group-hover:text-amber-500 transition-colors">
                   {category.title}
                </h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                   {category.desc}
                </p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default SupportCategoryGrid;
