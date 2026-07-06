"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { authService } from '@/services/index';
import { setCredentials, closeAuthModal } from '@/store/slices/authSlice';
import { authUtils } from '@/lib/authUtils';
import { RootState } from '@/store/store';
import { toast } from 'sonner';
import AnimatedButton from '@/components/shared/AnimatedButton';

const AuthModal = () => {
  const dispatch = useDispatch();
  const { isAuthModalOpen, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  useEffect(() => {
    if (isAuthenticated && isAuthModalOpen) {
      dispatch(closeAuthModal());
    }
  }, [isAuthenticated, isAuthModalOpen, dispatch]);

  const handleClose = () => {
    dispatch(closeAuthModal());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    try {
      const result = await authService.loginWithPhone({ phone: phone });
      const { user: responseUser, token, refreshToken } = result.data;

      authUtils.setAuthData({ token, refreshToken, role: responseUser.role, user: responseUser });
      dispatch(setCredentials({ user: responseUser }));
      
      if (result.isNewUser) {
        toast.success(`Account created! Welcome to TripDekho!`);
      } else {
        toast.success(`Welcome back!`);
      }
      
      dispatch(closeAuthModal());
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";
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
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-20 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 transition-opacity"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
            className="relative w-full max-w-[420px] bg-[#f4f5f7] border border-gray-200 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] z-10"
          >
            <div className="w-full h-full p-8 sm:p-10 border border-amber-100/50 rounded-[2.5rem] relative overflow-hidden">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors z-[100]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-50/80 to-transparent z-0" />

              <div className="relative z-10 pt-2">
                <div className="space-y-2 text-center mb-8">
                  <h2 className="text-3xl font-black font-jakarta text-[#191c1d] tracking-tight">TripDekho</h2>
                  <p className="text-[#5e5e5e] text-sm font-semibold">Login / Signup</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="flex gap-2">
                    <select 
                      className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl px-3 text-sm font-bold outline-none focus:border-[#FFD133] text-gray-900 shadow-sm cursor-pointer"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <input 
                      className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-[#FFD133] focus:ring-4 focus:ring-[#FFD133]/20 rounded-2xl py-4 px-4 text-sm font-bold text-gray-900 placeholder:text-gray-400 outline-none transition-all shadow-sm" 
                      placeholder="Mobile Number"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      required
                      autoFocus
                    />
                  </div>

                  <AnimatedButton
                    type="submit"
                    disabled={isLoading || phone.length !== 10}
                    className="w-full bg-[#FFD133] text-[#715a00] font-black py-4 mt-4 rounded-2xl shadow-[0_8px_20px_-6px_rgba(255,209,51,0.5)] hover:bg-black hover:text-white transition-all duration-300 text-sm uppercase tracking-widest disabled:opacity-50 disabled:shadow-none"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Get OTP / Login'}
                  </AnimatedButton>
                  
                  <div className="text-center mt-6">
                    <p className="text-sm font-semibold text-gray-500">
                      Are you a vendor? <a href="/vendor-login" className="text-amber-500 hover:text-black transition-colors">Login here</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
