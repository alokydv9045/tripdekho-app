"use client";

import React from "react";
import { Globe, Users, TrendingUp, ShieldCheck, ChevronRight, Award, Zap, BarChart, Database, CreditCard, Check, Star, Quote, Plane, Compass, Map } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { useDispatch } from "react-redux";
import { openAuthModal } from "@/store/slices/authSlice";
import { motion } from "framer-motion";

const AgentsPage = () => {
  const dispatch = useDispatch();
  
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Distribution",
      desc: "Connect your itineraries with travelers across the globe instantly."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Verified Status",
      desc: "Gain the 'TripDekho Elite' badge—a mark of trust in the global travel market."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Revenue Growth",
      desc: "Our partners see an average 25% increase in bookings within the first quarter."
    }
  ];

  const ecosystem = [
    { icon: <Database />, title: "Vendor SDK", desc: "Automate itinerary updates via our robust API and WebSocket integration." },
    { icon: <CreditCard />, title: "Swift Payouts", desc: "Automated settlements via NEFT, SEPA, or SWIFT directly to your hub." },
    { icon: <BarChart />, title: "Real-time Edge", desc: "Deep-dive into traveler behavior, conversion heatmaps, and trend forecasting." }
  ];

  const testimonials = [
    {
      name: "Rajiv Sharma",
      company: "Himalayan Treks Co.",
      location: "Manali, HP",
      quote: "Our booking volume tripled within 60 days of listing on TripDekho. The platform's reach is unmatched.",
      rating: 5,
      avatar: "R"
    },
    {
      name: "Priya Nair",
      company: "Kerala Backwaters Tours",
      location: "Kochi, Kerala",
      quote: "The vendor dashboard is a game-changer. Real-time analytics and instant settlement make this the best platform we've used.",
      rating: 5,
      avatar: "P"
    },
    {
      name: "Vikram Singh",
      company: "Rajputana Adventures",
      location: "Jaipur, Rajasthan",
      quote: "TripDekho's scout verification gave our brand the credibility we needed to attract premium travelers.",
      rating: 5,
      avatar: "V"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-gray-900 selection:bg-amber-100">
      <Header />

      {/* Hero Section — Light themed matching hotel partner page */}
      <section className="bg-[#FFFBF0] pt-24 pb-32 relative overflow-hidden">
        {/* Radial amber glows */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />

        {/* Floating amber icons — matching hero section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Plane className="absolute top-[12%] left-[6%] w-10 h-10 md:w-14 md:h-14 rotate-[15deg] opacity-40 text-[#d97706] animate-float-fast" />
          <Globe className="absolute top-[55%] left-[3%] w-8 h-8 md:w-12 md:h-12 -rotate-12 opacity-30 text-[#d97706] animate-float-slow" />
          <Compass className="absolute top-[20%] left-[42%] w-10 h-10 md:w-16 md:h-16 rotate-45 opacity-[0.18] text-[#d97706] animate-float-diagonal" />
          <Map className="absolute bottom-[20%] right-[4%] w-8 h-8 md:w-12 md:h-12 rotate-[10deg] opacity-35 text-[#d97706] animate-float-slow" />
          <Users className="absolute top-[10%] right-[7%] w-7 h-7 md:w-11 md:h-11 -rotate-[15deg] opacity-25 text-[#d97706] animate-float-fast" />
          <TrendingUp className="absolute top-[75%] left-[20%] w-8 h-8 md:w-12 md:h-12 rotate-[5deg] opacity-25 text-[#d97706] animate-float" />
          <Award className="absolute top-[8%] left-[62%] w-10 h-10 md:w-14 md:h-14 opacity-20 text-[#d97706] animate-float-slow" />
          <Zap className="absolute bottom-[25%] left-[48%] w-7 h-7 md:w-11 md:h-11 -rotate-[10deg] opacity-20 text-[#d97706] animate-float-diagonal" />
          <ShieldCheck className="absolute bottom-[12%] right-[28%] w-8 h-8 md:w-12 md:h-12 -rotate-[20deg] opacity-30 text-[#d97706] animate-float" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-200"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Elite Vendor Program</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-[0.9] uppercase"
              >
                Scale Your <br /><span className="text-amber-500">Expedition</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg"
              >
                Professional infrastructure for travel agencies. List, manage, and scale your operations for a global audience of verified travelers.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/vendor/register">
                  <button className="h-14 px-10 bg-gray-900 text-white font-black uppercase tracking-wider text-xs rounded-xl hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-900/10">
                    Start Application <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
                <button 
                  onClick={() => dispatch(openAuthModal('login'))}
                  className="h-14 px-10 border border-gray-200 text-gray-700 font-black uppercase tracking-wider text-xs rounded-xl hover:border-amber-400 hover:text-amber-600 transition-all flex items-center justify-center gap-3 bg-white"
                >
                  Vendor Login
                </button>
              </motion.div>
            </div>

            {/* Stats Cards — light themed */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Partner Agencies', value: '125+', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: 'Vendor Payouts', value: '₹45M+', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Avg Booking Boost', value: '+40%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Trust Rate', value: '99.8%', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  className="bg-white border border-gray-100 rounded-3xl p-6 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300"
                >
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features — numbered steps */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Why Partner With Us</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 uppercase leading-[0.9]">Built for <span className="text-amber-500">Growth</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-10 rounded-[40px] bg-gray-50 border border-gray-100 hover:border-amber-300 hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-500 group overflow-hidden"
            >
              <span className="absolute top-6 right-8 text-6xl font-black text-gray-100 group-hover:text-amber-500/10 transition-colors leading-none">0{i+1}</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 mb-8 shadow-lg shadow-gray-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight font-lora">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>




      {/* Testimonials */}
      <section className="py-32 bg-[#FFFBF0] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Partner Stories</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase">Voices From the <span className="text-amber-500">Field</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[32px] p-8 border border-gray-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-500"
              >
                <Quote size={24} className="text-amber-200 mb-6" />
                <div className="flex text-amber-400 gap-0.5 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} className="fill-current" />)}
                </div>
                <p className="text-gray-700 font-medium leading-relaxed text-sm mb-8 italic">"{t.quote}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-black text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{t.name}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.company} · {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase leading-[0.9] mb-6">Become a <br />Certified Partner</h2>
          <p className="text-black/60 mb-12 font-bold uppercase tracking-widest text-[10px]">We are looking for operators who organize authentic, high-impact travel experiences.</p>
          <Link href="/vendor/register">
             <button className="h-16 px-12 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all shadow-2xl shadow-black/20">
                Get Started Today <ChevronRight className="inline ml-2 w-4 h-4" />
             </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AgentsPage;
