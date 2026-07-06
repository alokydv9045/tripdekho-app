"use client";

import React, { useState } from "react";
import AuthLayout from "@/components/Auth/AuthLayout";
import InputField from "@/components/shared/InputField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { Mail, ArrowLeft, CheckCircle2, Phone, KeyRound, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { openAuthModal } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/");
    setTimeout(() => dispatch(openAuthModal('login')), 100);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return toast.error("Please enter email or phone");
    setIsLoading(true);
    try {
      await authService.forgotPassword(identifier);
      toast.success("OTP sent to your WhatsApp!");
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return toast.error("Enter a valid 6-digit OTP");
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    
    setIsLoading(true);
    try {
      await authService.resetPassword({ identifier, otp, newPassword });
      toast.success("Password reset successfully!");
      setStep(4);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 4) {
    return (
      <AuthLayout
        title="Password Reset!"
        subtitle="Your password has been successfully changed"
        alternateAction={{ text: "Lost your way?", linkText: "Go to Home", href: "/" }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-50 rounded-[32px] flex items-center justify-center mb-8 animate-in zoom-in duration-500">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10 leading-relaxed">
            You can now log in using your new password.
          </p>
          <button onClick={handleLoginClick} className="w-full">
            <PrimaryButton className="w-full h-14 text-sm shadow-xl shadow-amber-400/20">
              Return to Login
            </PrimaryButton>
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle={
        step === 1 ? "Enter your email or phone to receive a WhatsApp OTP" :
        step === 2 ? "Enter the 6-digit OTP sent to your WhatsApp" :
        "Create a new strong password"
      }
      alternateAction={{
        text: "Remember your password?",
        linkText: "Login",
        onClick: handleLoginClick
      }}
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-8">
            <InputField
              label="Email or Phone Number"
              type="text"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. john@example.com or 9876543210"
              required
              leftIcon={<Phone size={18} />}
            />
            <PrimaryButton type="submit" disabled={isLoading} className="w-full h-14 text-sm shadow-xl shadow-amber-400/20">
              {isLoading ? "Sending OTP..." : "Send OTP to WhatsApp"}
            </PrimaryButton>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <InputField
              label="6-Digit OTP"
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\\D/g, ''))}
              placeholder="123456"
              maxLength={6}
              required
              leftIcon={<KeyRound size={18} />}
            />
            <PrimaryButton type="submit" className="w-full h-14 text-sm shadow-xl shadow-amber-400/20">
              Verify OTP
            </PrimaryButton>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-8">
            <InputField
              label="New Password"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              leftIcon={<Lock size={18} />}
            />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              leftIcon={<Lock size={18} />}
            />
            <PrimaryButton type="submit" disabled={isLoading} className="w-full h-14 text-sm shadow-xl shadow-amber-400/20">
              {isLoading ? "Resetting..." : "Reset Password"}
            </PrimaryButton>
          </form>
        )}

        <button 
          onClick={(e) => { 
            e.preventDefault(); 
            if (step > 1) setStep((s) => (s - 1) as any);
            else handleLoginClick();
          }}
          className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-amber-500 transition-colors"
        >
          <ArrowLeft size={14} /> {step > 1 ? "Back" : "Back to Login"}
        </button>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
