"use client";

import React, { useState } from "react";
import { Globe, ShieldCheck, Zap, ChevronRight, Send, CheckCircle2, MapPin, Users, Briefcase, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { axiosPublic } from "@/lib/axios";
import { toast } from "sonner";

const AgentsApplyPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    agencyName: "",
    gst: "",
    country: "",
    specialization: "Himalayan Expeditions",
    experience: "",
    statement: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosPublic.post("/applications/agent", formData);
      setIsSubmitted(true);
      setTimeout(() => router.push("/"), 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit agent application.");
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
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 transition-all uppercase">Apply as Partner</h1>
              <p className="text-gray-500 text-sm font-medium">Join our global network of verified travel operators.</p>
            </div>

            {/* Stepper Header */}
            <div className="flex items-center justify-between px-4">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === i ? 'bg-amber-500 text-black' : step > i ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                     </div>
                     <span className={`text-[9px] font-bold uppercase tracking-widest ${step === i ? 'text-amber-600' : 'text-gray-300'}`}>
                        {['Identity', 'Operations', 'Review'][i-1]}
                     </span>
                  </div>
               ))}
               <div className="absolute left-0 right-0 top-[calc(50%-1px)] h-px bg-gray-100 -z-10" />
            </div>

            {/* Form Container */}
            <div className="bg-gray-50 border border-gray-100 p-8 md:p-12 rounded-2xl shadow-sm">
               <form onSubmit={handleSubmit} className="space-y-10">
                  {step === 1 && (
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Agency Name</label>
                          <input 
                            className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none transition-all" 
                            placeholder="Legal Entity Name" 
                            value={formData.agencyName}
                            onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                            required 
                          />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">GST / Tax ID</label>
                             <input 
                               className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none" 
                               placeholder="XX-XXXX-XX" 
                               value={formData.gst}
                               onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                               required 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Country</label>
                             <input 
                               className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none" 
                               placeholder="India" 
                               value={formData.country}
                               onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Key Specialization</label>
                          <select 
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none"
                          >
                             <option>Himalayan Expeditions</option>
                             <option>Beach & Water Sports</option>
                             <option>Spiritual Journeys</option>
                             <option>Wildlife & Safari</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Experience (Years)</label>
                          <input 
                            type="number" 
                            className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 focus:border-amber-500 outline-none" 
                            placeholder="5" 
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            required 
                          />
                       </div>
                       <div className="flex gap-4">
                          <button 
                            type="button" 
                            onClick={() => setStep(1)}
                            className="h-14 px-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all"
                          >
                             <ArrowLeft className="w-5 h-5 text-gray-400" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setStep(3)}
                            className="flex-1 h-14 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-black transition-all"
                          >
                             Continue
                          </button>
                       </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Business Statement</label>
                          <textarea 
                            className="w-full h-40 bg-white border border-gray-200 rounded-xl px-4 py-4 focus:border-amber-500 outline-none resize-none" 
                            placeholder="Briefly describe your agency's operations..." 
                            value={formData.statement}
                            onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                            required 
                          />
                       </div>
                       <div className="flex gap-4">
                          <button 
                            type="button" 
                            onClick={() => setStep(2)}
                            className="h-14 px-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all"
                          >
                             <ArrowLeft className="w-5 h-5 text-gray-400" />
                          </button>
                          <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-14 bg-amber-500 text-black rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50"
                          >
                             {loading ? "Submitting..." : "Submit Application"}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Received</h2>
                <p className="text-gray-500">Our team will review your details and contact you soon.</p>
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

export default AgentsApplyPage;
