"use client";

import React, { useState } from "react";
import { Building2, CheckCircle2, ChevronRight, Bed, Waves, Coffee, ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { axiosPublic } from "@/lib/axios";
import { toast } from "sonner";

const HotelsApplyPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "Luxury Resort",
    totalRooms: "",
    address: "",
    website: "",
    experienceStatement: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosPublic.post("/applications/hotel", formData);
      setIsSubmitted(true);
      setTimeout(() => router.push("/"), 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit hotel application audit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-900 selection:bg-amber-100">
      <Header />

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {!isSubmitted ? (
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 transition-all uppercase">Hotel Partnership Audit</h1>
              <p className="text-gray-500 text-sm font-medium">Register your property for the TripDekho elite collection.</p>
            </div>

            {/* Stepper Header */}
            <div className="flex items-center justify-between px-4">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === i ? 'bg-amber-500 text-black' : step > i ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                     </div>
                     <span className={`text-[9px] font-bold uppercase tracking-widest ${step === i ? 'text-amber-600' : 'text-gray-300'}`}>
                        {['Property', 'Location', 'Value'][i-1]}
                     </span>
                  </div>
               ))}
            </div>

            {/* Form Container */}
            <div className="bg-gray-50 border border-gray-100 p-8 md:p-12 rounded-2xl shadow-sm">
               <form onSubmit={handleSubmit} className="space-y-10">
                  {step === 1 && (
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Property Name</label>
                          <input 
                            className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none transition-all" 
                            placeholder="e.g. The Amber Resort" 
                            value={formData.propertyName}
                            onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                            required 
                          />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Property Type</label>
                             <select 
                               value={formData.propertyType}
                               onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                               className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none"
                             >
                                <option>Luxury Resort</option>
                                <option>Boutique Hotel</option>
                                <option>Heritage Villa</option>
                                <option>Eco Glamping</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Total Rooms</label>
                             <input 
                               type="number" 
                               value={formData.totalRooms}
                               onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                               className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none" 
                               placeholder="20" 
                               required 
                             />
                          </div>
                       </div>
                       <button 
                         type="button" 
                         onClick={() => setStep(2)}
                         className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-black transition-all"
                       >
                          Next Step
                       </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Address / Location</label>
                          <input 
                            className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none transition-all uppercase" 
                            placeholder="City, State, Country" 
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Website (Optional)</label>
                          <input 
                            className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none transition-all" 
                            placeholder="https://yourproperty.com" 
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          />
                       </div>
                       <div className="flex gap-4">
                          <button 
                            type="button" 
                            onClick={() => setStep(1)}
                            className="h-14 px-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all font-bold"
                          >
                             <ArrowLeft className="w-5 h-5 text-gray-400" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setStep(3)}
                            className="flex-1 h-14 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-black transition-all"
                          >
                             Continue Audit
                          </button>
                       </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Unique Experience Statement</label>
                          <textarea 
                            className="w-full h-40 bg-white border border-gray-200 rounded-xl px-4 py-4 focus:border-amber-500 outline-none resize-none" 
                            placeholder="Tell us what makes staying at your property unique..." 
                            value={formData.experienceStatement}
                            onChange={(e) => setFormData({ ...formData, experienceStatement: e.target.value })}
                            required 
                          />
                       </div>
                       <div className="flex gap-4">
                          <button 
                            type="button" 
                            onClick={() => setStep(2)}
                            className="h-14 px-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all font-bold"
                          >
                             <ArrowLeft className="w-5 h-5 text-gray-400" />
                          </button>
                          <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-14 bg-amber-500 text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
                          >
                             {loading ? "Submitting..." : "Submit Audit"}
                          </button>
                       </div>
                    </div>
                  )}
               </form>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center space-y-8">
             <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-black" />
             </div>
             <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Audit Submitted</h2>
                <p className="text-gray-500">Our curation team will conduct a review within 48 hours.</p>
             </div>
             <button 
               onClick={() => router.push('/')}
               className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px]"
             >
                Return Home
             </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HotelsApplyPage;
