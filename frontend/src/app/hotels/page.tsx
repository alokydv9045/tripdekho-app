"use client";

import React from "react";
import { Building2, ShieldCheck, ChevronRight, Layout, BarChart3, Sparkles, CheckCircle2, DollarSign, Calendar, FileText, Search } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

const HotelsPage = () => {
  const benefits = [
    {
      icon: <Layout className="w-8 h-8" />,
      title: "Inventory Control",
      desc: "Synchronize your rooms with zero overbooking risk using our channel tools."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Global Visibility",
      desc: "Feature your property to a worldwide community of premium travelers."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Revenue Insights",
      desc: "Access daily analytics to optimize your rates and guest metrics."
    }
  ];

  const auditSteps = [
    { title: "Digital Screening", desc: "We review your online presence, guest reviews, and core value proposition.", icon: Search },
    { title: "Physical Verification", desc: "A TripDekho scout conducts an anonymous stay to verify service standards.", icon: Building2 },
    { title: "Safety & Compliance", desc: "Final audit of fire safety, local registration, and hygiene protocols.", icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-transparent text-gray-900 selection:bg-amber-100">
      <Header />

      {/* Hero Section */}
      <section className="py-24 md:py-32 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center animate-in fade-in zoom-in duration-700">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-8 lowercase font-lora">
            <span className="capitalize">Hospitality</span> <span className="text-amber-500 underline decoration-2 underline-offset-8">elevated.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-12 uppercase tracking-tight">
            Join our curated collection of extraordinary stays. Simple tools, global reach, and elite guests.
          </p>

          <Link href="/hotels/apply">
            <button className="h-14 px-8 bg-gray-900 text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-3 mx-auto">
              Partner With Us <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 max-w-7xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((b, i) => (
            <div key={i} className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-500 mb-6 shadow-sm">
                {b.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tighter font-lora">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Audit Protocol */}
      <section className="py-24 bg-gray-50 border-y border-gray-100 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-20">
               <div className="md:w-1/3">
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 font-lora">The Curation Audit</h2>
                  <p className="text-sm text-gray-500 leading-loose">We don't accept everyone. Our three-stage audit ensures your property meets the 'TripDekho Standard' for authentic hospitality.</p>
                  <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                     <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Success Rate</p>
                     <p className="text-4xl font-extrabold text-gray-900">&lt; 15%</p>
                     <p className="text-[10px] text-gray-400 font-medium mt-2">Of applicants certified annually.</p>
                  </div>
               </div>
               <div className="md:w-2/3 space-y-4">
                  {auditSteps.map((step, i) => (
                    <div key={i} className="group p-8 bg-white border border-gray-100 rounded-[32px] flex gap-8 items-start hover:border-amber-500 transition-all">
                       <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-amber-500 transition-colors">
                          <step.icon size={28} />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-lg font-bold text-gray-900 uppercase tracking-tight font-lora">{step.title}</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Technology & Finance */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
               <h2 className="text-3xl font-black uppercase tracking-tighter font-lora">Automated Finance</h2>
               <p className="text-gray-500 text-sm">Real-time payments, transparent reporting, and zero hidden fees.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { icon: <DollarSign />, title: "Monthly Payouts", desc: "Settlements are processed on the 5th of every month via automated bank transfer." },
                 { icon: <Calendar />, title: "Live Availability", desc: "Direct sync with your existing PMS (Cloudbeds, Little Hotelier, etc.)" },
                 { icon: <FileText />, title: "Tax Compliance", desc: "Automated GST/VAT invoicing generated for every booking." }
               ].map((item, i) => (
                 <div key={i} className="text-center space-y-6 group cursor-default hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 bg-amber-500 text-black rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                       {item.icon}
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tighter font-lora">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Types Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h2 className="text-xl font-black uppercase tracking-widest text-gray-400 mb-12 font-lora">Supported Properties</h2>
           <div className="flex flex-wrap justify-center gap-10">
              {['Boutique Hotels', 'Luxury Resorts', 'Heritage Villas', 'Eco Glamping'].map((type) => (
                <div key={type} className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm hover:border-amber-400 hover:shadow-md transition-all cursor-default">
                   <CheckCircle2 className="w-4 h-4 text-amber-500" />
                   <span className="text-sm font-bold uppercase tracking-widest text-gray-900">{type}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto bg-amber-500 rounded-3xl p-12 shadow-xl shadow-amber-500/10">
          <h2 className="text-3xl font-black text-black mb-6 uppercase tracking-tighter font-lora">Submit Your Property</h2>
          <p className="text-black/60 font-bold mb-10 text-sm leading-relaxed">Our curation team reviews all applicants within 48 hours for brand alignment and quality standards.</p>
          <Link href="/hotels/apply">
             <button className="h-16 px-12 bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
                Start Audit
             </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HotelsPage;
