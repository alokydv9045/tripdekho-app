"use client";

import React, { useState, useCallback } from "react";
import { contactService } from "@/services/contactService";
import { Send, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const validateEmail = (value: string): string | undefined => {
  if (!value.trim()) return "Email address is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
  return undefined;
};

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((value: string) => {
    setEmail(value);
    if (touched) {
      setError(validateEmail(value));
    }
  }, [touched]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    setError(validateEmail(email));
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    const validationError = validateEmail(email);
    setTouched(true);
    setError(validationError);
    if (validationError) return;

    try {
      setStatus("loading");
      await contactService.subscribeNewsletter(email);
      setStatus("success");
      setEmail("");
      setError(undefined);
      setTouched(false);
      toast.success("Welcome to the elite traveler club!");
    } catch (error) {
      console.error("Subscription failed:", error);
      toast.error("Subscription failed. Please check your email.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-amber-400/10 border border-amber-400/20 rounded-3xl p-6 text-center animate-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-400 rounded-full text-black mb-4 shadow-lg shadow-amber-400/20">
          <CheckCircle2 size={24} />
        </div>
        <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">You're In!</h4>
        <p className="text-gray-400 text-xs font-bold leading-relaxed uppercase tracking-widest">
          Check your inbox soon for your exclusive travel guide and first deal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
         <Sparkles size={16} className="text-amber-400 animate-pulse" />
         <h4 className="text-sm font-black text-white uppercase tracking-widest">Exclusive Deals</h4>
      </div>
      <p className="text-[#888888] text-xs font-medium leading-relaxed max-w-[280px]">
        Get the most beautiful travel stories and deals delivered to your inbox every week.
      </p>
      
      <form onSubmit={handleSubmit} noValidate className="max-w-sm">
        <div className="relative group">
          <input 
            type="email"
            value={email}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="ENTER YOUR EMAIL"
            suppressHydrationWarning={true}
            className={`w-full h-14 bg-white/5 border rounded-2xl px-6 text-xs font-black uppercase tracking-widest text-white outline-none transition-all placeholder:text-gray-600 ${
              touched && error
                ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 bg-red-400/5"
                : "border-white/10 focus:bg-white/10 focus:border-amber-400"
            }`}
          />
          <button 
            type="submit"
            disabled={status === "loading"}
            suppressHydrationWarning={true}
            className="absolute right-2 top-2 h-10 px-6 bg-amber-400 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white transition-all disabled:opacity-50 shadow-lg shadow-amber-400/20"
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                Join <Send size={12} />
              </div>
            )}
          </button>
        </div>
        {touched && error && (
          <p className="mt-2 text-xs font-semibold text-red-400 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default NewsletterForm;
