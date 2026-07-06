"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { HelpCircle, Search, ChevronDown, ChevronUp, User, Store, ShieldAlert, CreditCard } from "lucide-react";

const FAQ_DATA = [
  {
    category: "For Travelers",
    icon: User,
    questions: [
      { q: "How do I book a trip on TripDekho?", a: "To book a trip, simply browse our categories, select your favorite journey, choose a date, and follow the checkout process. You'll receive a confirmation email instantly once the payment is verified." },
      { q: "What is the cancellation policy?", a: "Each trip has its own policy set by the vendor: Flexible (full refund 7 days prior), Moderate (partial refund), or Strict (no refund). You can check the specific policy on the trip detail page." },
      { q: "Can I customize an existing trip itinerary?", a: "Yes! Many of our vendors offer customization. Use the 'Chat with Vendor' button on the trip page to discuss your specific requirements." }
    ]
  },
  {
    category: "For Vendors",
    icon: Store,
    questions: [
      { q: "How do I register as a vendor?", a: "Click on 'Become a Vendor' in the header, fill in your business details, and our verification team will review your application within 48 hours." },
      { q: "How do payouts work?", a: "Payouts are automatically initiated 2 days after the trip completion date to your linked bank account, minus the platform service fee." },
      { q: "What are the listing requirements?", a: "We require clear imagery (min 1920x1080), detailed itinerary breakdowns, and verified government ID if you are an independent guide." }
    ]
  },
  {
    category: "Safety & Trust",
    icon: ShieldAlert,
    questions: [
      { q: "Are the vendors on TripDekho verified?", a: "Absolutely. We conduct local background checks and document verification for every single vendor before they can list a trip." },
      { q: "How does the refund process work?", a: "If you cancel within your policy window, the refund is processed automatically within 5-7 business days to your original payment method." }
    ]
  }
];

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggleAccordion = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-900">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
           <h1 className="text-5xl font-black uppercase tracking-tight">How can we <span className="text-amber-500">help</span>?</h1>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Find answers to common questions or reach out to our team</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative mb-16">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
           <input 
             type="text" 
             placeholder="Search for questions (e.g., 'refunds', 'verification')..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full h-16 pl-16 pr-8 bg-white border border-gray-100 rounded-[32px] font-bold text-sm outline-none focus:border-amber-400 shadow-xl shadow-gray-200/50 transition-all"
           />
        </div>

        {/* Categories & Questions */}
        <div className="space-y-16">
           {FAQ_DATA.map((cat, catIdx) => (
             <div key={catIdx} className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                     <cat.icon className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{cat.category}</h2>
               </div>

               <div className="space-y-4">
                  {cat.questions.map((item, qIdx) => {
                    const id = `${catIdx}-${qIdx}`;
                    const isOpen = openIndex === id;
                    
                    if (searchTerm && !item.q.toLowerCase().includes(searchTerm.toLowerCase()) && !item.a.toLowerCase().includes(searchTerm.toLowerCase())) {
                      return null;
                    }

                    return (
                      <div key={qIdx} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <button 
                          onClick={() => toggleAccordion(id)}
                          className="w-full p-8 flex items-center justify-between text-left group"
                        >
                          <span className={`text-base font-black uppercase tracking-tight transition-colors ${isOpen ? 'text-amber-500' : 'group-hover:text-amber-500'}`}>
                            {item.q}
                          </span>
                          {isOpen ? <ChevronUp className="text-amber-500" /> : <ChevronDown className="text-gray-300" />}
                        </button>
                        
                        {isOpen && (
                          <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                             <div className="w-12 h-1 bg-amber-100 mb-6 rounded-full" />
                             <p className="text-gray-500 font-bold leading-relaxed text-sm">
                               {item.a}
                             </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
               </div>
             </div>
           ))}
        </div>

        {/* Still Have Questions? */}
        <div className="mt-24 p-12 bg-gray-900 rounded-[48px] text-white text-center shadow-2xl relative overflow-hidden text-center mx-auto">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl -mr-16 -mt-16" />
           <h3 className="text-2xl font-black uppercase mb-4">Still have questions?</h3>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">Can't find the answer you're looking for? Our team is live and ready</p>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button className="h-14 px-10 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white transition-all">
                 Live Chat
              </button>
              <button className="h-14 px-10 border border-white/20 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                 Email Support
              </button>
           </div>
        </div>
      </main>

      
    </div>
  );
};

export default FAQPage;

