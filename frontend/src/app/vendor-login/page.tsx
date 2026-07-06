"use client";

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Plane, BaggageClaim, Map, Compass, Camera, Tent, Sun, Palmtree, Navigation, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/index';
import { setCredentials } from '@/store/slices/authSlice';
import { authUtils } from '@/lib/authUtils';
import AnimatedButton from '@/components/shared/AnimatedButton';
import Image from 'next/image';

export default function VendorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleVendorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.login({ email, password });
      const responseData = result?.data || result;
      const { user, access_token, token, refreshToken } = responseData;
      const finalToken = access_token || token;

      authUtils.setAuthData({ token: finalToken, refreshToken, role: user.role, user });
      dispatch(setCredentials({ user }));
      
      toast.success(`Welcome back, Vendor ${user.name || ''}!`);
      router.push('/vendor/dashboard');
    } catch (error: any) {
      let errorMessage = "Invalid vendor credentials.";
      const responseMessage = error.response?.data?.message;
      if (responseMessage) {
        errorMessage = Array.isArray(responseMessage) ? responseMessage[0] : responseMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#FFFBF0" }}
    >
      {/* Subtle decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
      </div>

      {/* Floating Icons from Hero Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[12%] left-[8%] animate-fade-in-up delay-300">
          <Plane className="w-8 h-8 md:w-14 md:h-14 rotate-[15deg] opacity-50 text-[#d97706] animate-float-fast" />
        </div>
        <div className="absolute top-[55%] left-[4%] animate-fade-in-left delay-500">
          <BaggageClaim className="w-6 h-6 md:w-10 md:h-10 -rotate-12 opacity-40 text-[#d97706] animate-float-slow" />
        </div>
        <div className="absolute top-[25%] left-[25%] animate-fade-in-up delay-400">
          <Compass className="w-10 h-10 md:w-16 md:h-16 rotate-45 opacity-20 text-[#d97706] animate-float-diagonal" />
        </div>
        <div className="absolute bottom-[20%] right-[8%] animate-fade-in-right delay-500">
          <Map className="w-7 h-7 md:w-12 md:h-12 rotate-[10deg] opacity-40 text-[#d97706] animate-float-slow" />
        </div>
        <div className="absolute top-[15%] right-[15%] animate-fade-in-left delay-200">
          <Camera className="w-6 h-6 md:w-10 md:h-10 -rotate-[15deg] opacity-30 text-[#d97706] animate-float-fast" />
        </div>
        <div className="absolute bottom-[15%] left-[20%] animate-fade-in-up delay-400">
          <Tent className="w-8 h-8 md:w-12 md:h-12 rotate-[5deg] opacity-30 text-[#d97706] animate-float" />
        </div>
        <div className="absolute top-[35%] right-[5%] animate-fade-in-up delay-500">
          <Sun className="w-10 h-10 md:w-16 md:h-16 opacity-25 text-[#d97706] animate-float-slow" />
        </div>
        <div className="absolute bottom-[25%] left-[45%] animate-fade-in-left delay-300">
          <Palmtree className="w-8 h-8 md:w-14 md:h-14 -rotate-[10deg] opacity-25 text-[#d97706] animate-float-diagonal" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] p-8 sm:p-10 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="relative h-12 w-32 filter drop-shadow-sm">
            <Image
              src="/bg-logo.png"
              alt="TripDekho"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="space-y-2 text-center mb-8">
          <h1 className="text-2xl font-black font-jakarta text-[#191c1d] tracking-tight">Vendor Portal</h1>
          <p className="text-[#5e5e5e] text-sm font-semibold">Manage your trips and bookings</p>
        </div>

        <form onSubmit={handleVendorLogin} className="space-y-4">
          <input
            className="w-full bg-[#f4f5f7] border-2 border-transparent hover:border-gray-300 focus:border-[#FFD133] focus:ring-4 focus:ring-[#FFD133]/20 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 placeholder:text-gray-400 outline-none transition-all shadow-sm"
            placeholder="Vendor Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <div className="relative">
            <input
              className="w-full bg-[#f4f5f7] border-2 border-transparent hover:border-gray-300 focus:border-[#FFD133] focus:ring-4 focus:ring-[#FFD133]/20 rounded-2xl py-4 px-5 pr-12 text-sm font-bold text-gray-900 placeholder:text-gray-400 outline-none transition-all shadow-sm"
              placeholder="Vendor Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <AnimatedButton
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-black py-4 mt-4 rounded-2xl shadow-lg hover:bg-[#FFD133] hover:text-[#715a00] transition-all duration-300 text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Secure Login'}
          </AnimatedButton>
        </form>
      </motion.div>
    </div>
  );
}
