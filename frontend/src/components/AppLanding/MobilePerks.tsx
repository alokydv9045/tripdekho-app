'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Zap, ShieldCheck, CreditCard, Sparkles, Smartphone } from 'lucide-react';

const MobilePerks = () => {
  const perks = [
    {
      title: "15% Extra Discount",
      desc: "Unlock app-only promotion codes on all premium trip bookings.",
      icon: Gift,
      color: "text-pink-500",
      bg: "bg-pink-100/10"
    },
    {
      title: "Priority Support",
      desc: "Get 24/7 direct access to our local travel experts via in-app chat.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-100/10"
    },
    {
      title: "Smart Check-in",
      desc: "Skip the queues with mobile check-in for flights and partner hotels.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-100/10"
    },
    {
      title: "Digital Wallet",
      desc: "Manage all your travel expenses and get instant refunds on cancellations.",
      icon: CreditCard,
      color: "text-green-500",
      bg: "bg-green-100/10"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden group" style={{ background: 'var(--background, #FFFBF0)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12 text-center md:text-left">
           <div className="max-w-2xl">
              <span className="flex items-center justify-center md:justify-start gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                 <Sparkles className="w-4 h-4" /> Exclusive Benefits
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                 The <span className="text-amber-500">Privileged</span> <br /> Mobile Club
              </h2>
           </div>
           
           <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[30px] border border-gray-100">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                 <Smartphone className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Live Sync</p>
                 <p className="text-xs font-black text-gray-900 uppercase">Seamless Cross-Platform</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {perks.map((perk, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative p-10 bg-white rounded-[40px] border border-gray-100 hover:border-amber-500/30 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Decorative Corner Glow */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-0 hover:opacity-20 transition-opacity ${perk.color.replace('text', 'bg')}`} />

              <div className={`w-14 h-14 rounded-2xl ${perk.bg} flex items-center justify-center mb-10 shadow-xl shadow-gray-200 ${perk.color}`}>
                 <perk.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4 group-hover:text-amber-500 transition-colors">
                 {perk.title}
              </h3>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                 {perk.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobilePerks;
