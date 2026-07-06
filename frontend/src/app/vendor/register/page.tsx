"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, CheckCircle2, ArrowLeft, Send, User, Mail, Phone, Tag, Plane, BaggageClaim, Map, Compass, Camera, Tent, Sun, Palmtree, Navigation, Ticket } from 'lucide-react';
import { authService } from '@/services/index';
import { toast } from 'sonner';
import Header from '@/components/Header';
import PrimaryButton from '@/components/shared/PrimaryButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { openAuthModal } from '@/store/slices/authSlice';

export default function VendorRegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',           // UserEntity.name — contact person
    businessName: '',   // VendorEntity.businessName
    email: '',          // UserEntity.email / VendorEntity.contactEmail
    countryCode: '+91',
    phoneNumber: '',    // UserEntity.phone / VendorEntity.contactPhone
    description: '',    // VendorEntity.description
    referralCode: '',   // RegisterDto.referralCode
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error('Please agree to the vendor terms');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({
        name: formData.name,
        businessName: formData.businessName,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phoneNumber}`,
        description: formData.description || undefined,
        referralCode: formData.referralCode || undefined,
        role: 'vendor',
      });

      if (response.tempPassword) {
        setTempPassword(response.tempPassword);
      }
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Vendor signup failed", err);
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name.trim() || !formData.businessName.trim()) {
        toast.error("Please fill in your name and business name.");
        return;
      }
    } else if (step === 2) {
      if (!formData.email.trim()) {
        toast.error("Please provide your business email.");
        return;
      }
      if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
        toast.error("Please provide a valid 10-digit phone number.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="relative min-h-screen bg-[#FFFBF0] text-gray-900 selection:bg-amber-100 overflow-hidden">
      {/* Hero Section Style Background Enhancements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 -right-48 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        
        {/* Animated Floating Travel Icons */}
        <div className="absolute top-[12%] left-[8%] animate-float-fast">
          <Plane className="w-8 h-8 md:w-14 md:h-14 rotate-[15deg] opacity-50 text-[#d97706]" />
        </div>
        <div className="absolute top-[55%] left-[4%] animate-float-slow">
          <BaggageClaim className="w-6 h-6 md:w-10 md:h-10 -rotate-12 opacity-40 text-[#d97706]" />
        </div>
        <div className="absolute top-[25%] left-[40%] animate-float-diagonal">
          <Compass className="w-10 h-10 md:w-16 md:h-16 rotate-45 opacity-20 text-[#d97706]" />
        </div>
        <div className="absolute bottom-[20%] right-[3%] animate-float-slow">
          <Map className="w-7 h-7 md:w-12 md:h-12 rotate-[10deg] opacity-40 text-[#d97706]" />
        </div>
        <div className="absolute top-[10%] right-[8%] animate-float-fast">
          <Camera className="w-6 h-6 md:w-10 md:h-10 -rotate-[15deg] opacity-30 text-[#d97706]" />
        </div>
        
        {/* Additional Organic Elements */}
        <div className="absolute top-[75%] left-[22%] animate-float">
          <Tent className="w-8 h-8 md:w-12 md:h-12 rotate-[5deg] opacity-30 text-[#d97706]" />
        </div>
        <div className="absolute top-[8%] left-[60%] animate-float-slow">
          <Sun className="w-10 h-10 md:w-16 md:h-16 opacity-25 text-[#d97706]" />
        </div>
        <div className="absolute bottom-[25%] left-[45%] animate-float-diagonal">
          <Palmtree className="w-8 h-8 md:w-14 md:h-14 -rotate-[10deg] opacity-25 text-[#d97706]" />
        </div>
        <div className="absolute top-[40%] right-[35%] animate-float-fast">
          <Navigation className="w-6 h-6 md:w-10 md:h-10 rotate-[45deg] opacity-30 text-[#d97706]" />
        </div>
        <div className="absolute bottom-[10%] right-[30%] animate-float">
          <Ticket className="w-7 h-7 md:w-12 md:h-12 -rotate-[20deg] opacity-40 text-[#d97706]" />
        </div>
      </div>

      <Header />

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-16 md:py-24">
        {isAuthenticated && user ? (
          <div className="bg-white/90 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-amber-900/5 text-center space-y-6 relative z-10 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500">
               <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Already Logged In</h2>
              <p className="text-gray-500 mt-2 font-medium">You are currently logged in as a <strong className="text-amber-500 capitalize">{user.role}</strong>.</p>
            </div>
            {user.role === 'customer' && (
              <p className="text-sm text-gray-600 font-medium">To register as a vendor, please log out of your customer account first.</p>
            )}
            {user.role === 'vendor' && (
              <div className="pt-4">
                <button onClick={() => router.push('/vendor/dashboard')} className="w-full max-w-xs mx-auto">
                  <PrimaryButton className="w-full h-14 text-xs tracking-widest shadow-xl shadow-amber-400/20">
                    Go to Vendor Dashboard
                  </PrimaryButton>
                </button>
              </div>
            )}
            {user.role === 'admin' && (
              <div className="pt-4">
                <button onClick={() => router.push('/admin')} className="w-full max-w-xs mx-auto">
                  <PrimaryButton className="w-full h-14 text-xs tracking-widest shadow-xl shadow-amber-400/20">
                    Go to Admin Dashboard
                  </PrimaryButton>
                </button>
              </div>
            )}
          </div>
        ) : !isSubmitted ? (
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 transition-all uppercase">Become a Vendor</h1>
              <p className="text-gray-500 text-sm font-medium">Join TripDekho's elite network of travel agents and tour operators.</p>
            </div>

            {/* Stepper Header */}
            <div className="flex items-center justify-between px-4 md:px-12">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === i ? 'bg-amber-500 text-black' : step > i ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
                     </div>
                     <span className={`text-[9px] font-bold uppercase tracking-widest ${step === i ? 'text-amber-600' : 'text-gray-300'}`}>
                      {['Identity', 'Contact', 'About'][i-1]}
                     </span>
                  </div>
               ))}
            </div>

            {/* Form Container */}
            <div className="bg-white/90 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-amber-900/5 relative z-10">
               {error && (
                 <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                   <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
                 </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-10">
                  {/* STEP 1 — Identity */}
                   {step === 1 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Contact Person Name</label>
                         <div className="relative">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                             <User className="w-5 h-5" />
                           </div>
                           <input 
                             className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-11 pr-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-medium text-gray-900" 
                             placeholder="e.g. John Doe" 
                             value={formData.name}
                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                             required 
                           />
                         </div>
                         <p className="text-[10px] text-gray-400 ml-1">Your full name as the account owner</p>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Business / Agency Name</label>
                         <div className="relative">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                             <Building2 className="w-5 h-5" />
                           </div>
                           <input 
                             className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-11 pr-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-medium text-gray-900" 
                             placeholder="e.g. Himalayan Adventures Pvt. Ltd." 
                             value={formData.businessName}
                             onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                             required 
                           />
                         </div>
                         <p className="text-[10px] text-gray-400 ml-1">This will be your public vendor profile name</p>
                       </div>
                       
                       <button 
                         type="button" 
                         onClick={nextStep}
                         className="w-full"
                       >
                         <PrimaryButton className="w-full h-14 text-xs tracking-widest shadow-xl shadow-amber-400/20">
                            Next Step
                         </PrimaryButton>
                       </button>

                       <div className="text-center pt-2">
                          <button type="button" onClick={() => dispatch(openAuthModal('login'))} className="text-[10px] font-bold text-gray-400 hover:text-amber-500 transition-colors uppercase tracking-widest">
                            Already have an account? Login
                          </button>
                       </div>
                     </div>
                   )}

                  {/* STEP 2 — Contact */}
                   {step === 2 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Business Email</label>
                         <div className="relative">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                             <Mail className="w-5 h-5" />
                           </div>
                           <input 
                             type="email"
                             className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-11 pr-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-medium text-gray-900" 
                             placeholder="vendor@company.com" 
                             value={formData.email}
                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                             required 
                           />
                         </div>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">WhatsApp Number</label>
                         <div className="flex gap-2">
                           <div className="relative w-28 shrink-0">
                             <select 
                               className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-4 pr-8 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                               value={formData.countryCode}
                               onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                             >
                               <option value="+91">🇮🇳 +91</option>
                               <option value="+1">🇺🇸 +1</option>
                               <option value="+44">🇬🇧 +44</option>
                               <option value="+61">🇦🇺 +61</option>
                               <option value="+971">🇦🇪 +971</option>
                               <option value="+65">🇸🇬 +65</option>
                             </select>
                             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">▼</div>
                           </div>
                           <div className="relative flex-1">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                               <Phone className="w-5 h-5" />
                             </div>
                             <input 
                               type="tel"
                               className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-11 pr-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-mono font-bold text-gray-900 tracking-wide" 
                               placeholder="98765 43210" 
                               value={formData.phoneNumber}
                               maxLength={10}
                               onChange={(e) => {
                                 const val = e.target.value.replace(/\D/g, '');
                                 if (val.length <= 10) setFormData({ ...formData, phoneNumber: val });
                               }}
                               required 
                             />
                           </div>
                         </div>
                         <p className="text-[10px] text-gray-400 ml-1">Your temporary password will be sent to this WhatsApp number.</p>
                       </div>
                       <div className="flex gap-4 mt-6">
                         <button type="button" onClick={prevStep} className="h-14 px-6 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-bold">
                           <ArrowLeft className="w-5 h-5 text-gray-500" />
                         </button>
                         <button type="button" onClick={nextStep} className="flex-1">
                           <PrimaryButton className="w-full h-14 text-xs tracking-widest shadow-xl shadow-amber-400/20">
                             Continue
                           </PrimaryButton>
                         </button>
                       </div>
                     </div>
                   )}

                  {/* STEP 3 — About & Terms */}
                   {step === 3 && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       {/* Description */}
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">About Your Business <span className="text-gray-300">(Optional)</span></label>
                         <textarea
                           className="w-full h-28 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all font-medium text-gray-900 resize-none"
                           placeholder="Tell travelers what makes your agency unique — destinations, specialities, experience..."
                           value={formData.description}
                           maxLength={500}
                           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                         />
                         <p className="text-[10px] text-gray-400 ml-1">{formData.description.length}/500</p>
                       </div>

                       {/* Referral Code */}
                       <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Referral Code <span className="text-gray-300">(Optional)</span></label>
                         <div className="relative">
                           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                             <Tag className="w-5 h-5" />
                           </div>
                           <input 
                             className="w-full h-12 bg-white border border-gray-200 rounded-xl pl-11 pr-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all uppercase font-bold text-gray-900 tracking-widest" 
                             placeholder="TRIP2026" 
                             value={formData.referralCode}
                             maxLength={20}
                             onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                           />
                         </div>
                       </div>

                       {/* Terms */}
                       <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl">
                         <div className="flex items-start gap-4">
                            <div 
                              className="pt-0.5 flex-shrink-0 cursor-pointer"
                              onClick={() => setAgreedToTerms(!agreedToTerms)}
                            >
                              <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${agreedToTerms ? 'bg-amber-500' : 'bg-white border border-amber-300'}`}>
                                {agreedToTerms && (
                                  <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                           <div>
                             <label 
                               className="text-sm font-bold text-gray-900 cursor-pointer"
                               onClick={() => setAgreedToTerms(!agreedToTerms)}
                             >
                               Vendor Terms &amp; Commission Policy
                             </label>
                             <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                               I agree to TripDekho's 15% platform commission policy and vendor code of conduct. All listings will undergo quality review before being published.
                             </p>
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex gap-4 mt-6">
                         <button type="button" onClick={prevStep} className="h-14 px-6 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-bold">
                           <ArrowLeft className="w-5 h-5 text-gray-500" />
                         </button>
                         <button 
                           type="submit"
                           disabled={isLoading || !agreedToTerms}
                           className="flex-1"
                         >
                           <PrimaryButton className="w-full h-14 text-xs tracking-widest shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2" disabled={isLoading || !agreedToTerms}>
                             {isLoading ? (
                               <span className="flex items-center gap-2">
                                 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                 </svg>
                                 Submitting...
                               </span>
                             ) : (
                               <>Submit Application <Send className="w-4 h-4" /></>
                             )}
                           </PrimaryButton>
                         </button>
                       </div>
                     </div>
                   )}
               </form>
            </div>
          </div>
        ) : (
          <div className="py-16 md:py-24 text-center space-y-8 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                <CheckCircle2 className="w-12 h-12 text-black" />
             </div>
             <div className="space-y-4">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Application Submitted!</h2>
                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm max-w-md mx-auto space-y-4">
                  <p className="text-gray-600 font-medium text-sm">Your temporary login credentials are:</p>
                  <div className="flex flex-col gap-3 items-center font-bold text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <div className="text-sm">Email: <span className="text-black font-black">{formData.email}</span></div>
                     <div className="text-sm">Password: <span className="text-amber-600 font-mono font-black text-lg bg-amber-50 px-3 py-1 rounded-md border border-amber-200/50 select-all">{tempPassword || "Sent to WhatsApp"}</span></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Please copy this password. You will be asked to change it upon your first login.</p>
                </div>
             </div>
             <div className="pt-8">
               <button 
                 onClick={() => dispatch(openAuthModal('login'))}
                 className="w-full max-w-xs mx-auto"
               >
                 <PrimaryButton className="w-full h-14 text-xs tracking-widest shadow-xl shadow-amber-400/20">
                    Proceed to Login
                 </PrimaryButton>
               </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
