"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedButton from '@/components/shared/AnimatedButton';
import { axiosPrivate } from '@/lib/axios';
import { setCredentials } from '@/store/slices/authSlice';

const ProfileCompletionModal = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // It should be visible if the user is authenticated but doesn't have a name
  const isVisible = isAuthenticated && user && (!user.name || user.name.trim() === '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = { name };
      if (email.trim()) {
        payload.email = email.trim();
      }

      const response = await axiosPrivate.put(`/customers/profile`, payload);
      
      const updatedUser = response.data.data;
      dispatch(setCredentials({ user: updatedUser }));
      toast.success('Profile updated successfully! Welcome!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-20 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
            className="relative w-full max-w-[420px] bg-[#f4f5f7] border border-gray-200 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] z-10 pointer-events-auto"
          >
            <div className="w-full h-full p-8 sm:p-10 border border-amber-100/50 rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-50/80 to-transparent z-0" />

              <div className="relative z-10 pt-2">
                <div className="space-y-2 text-center mb-8">
                  <h2 className="text-2xl font-black font-jakarta text-[#191c1d] tracking-tight">Complete Profile</h2>
                  <p className="text-[#5e5e5e] text-sm font-medium">
                    Please provide your name to continue exploring TripDekho.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-[#FFD133] focus:ring-4 focus:ring-[#FFD133]/20 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 placeholder:text-gray-400 outline-none transition-all shadow-sm"
                    placeholder="Full Name (Required)"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                  
                  <input
                    className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 focus:border-[#FFD133] focus:ring-4 focus:ring-[#FFD133]/20 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 placeholder:text-gray-400 outline-none transition-all shadow-sm"
                    placeholder="Email Address (Optional)"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <AnimatedButton
                    type="submit"
                    disabled={isLoading || !name.trim()}
                    className="w-full bg-[#FFD133] text-[#715a00] font-black py-4 mt-4 rounded-2xl shadow-[0_8px_20px_-6px_rgba(255,209,51,0.5)] hover:bg-black hover:text-white transition-all duration-300 text-sm uppercase tracking-widest disabled:opacity-50 disabled:shadow-none"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Save & Continue'}
                  </AnimatedButton>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileCompletionModal;
