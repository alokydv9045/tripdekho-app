'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { appFeatures } from './AppFeatures';
import { CheckCircle2 } from 'lucide-react';

const FeatureShowcase = () => {
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: 'var(--background, #FFFBF0)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 max-w-2xl mx-auto">
           <span className="text-amber-500 text-sm font-bold uppercase tracking-wider mb-4 block">Engineered for Travel</span>
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              The Best Way to <br />
              <span className="text-amber-500">Navigate the Planet</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {appFeatures.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col group"
            >
              <div className={`w-16 h-16 rounded-[24px] bg-gray-50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-gray-100 group-hover:shadow-amber-500/10 ${feature.color}`}>
                 <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-500 transition-colors">
                 {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                 {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeatureShowcase;
