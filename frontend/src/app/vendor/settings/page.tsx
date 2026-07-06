"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Lock, Bell, Mail, Shield, CheckCircle } from "lucide-react";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { vendorService } from "@/services/vendorService";

const VendorSettingsPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    vendorService.getCurrentVendor().then((res) => {
      setVendor(res?.data);
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">
            Account <span className="text-amber-500">Settings</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Manage your account security and preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Account Security */}
          <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-amber-500" /> Security
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Account Email</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{user?.email}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-green-500 tracking-widest">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Password</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Last changed 3 months ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                  Change
                </button>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3">
              <Bell className="w-6 h-6 text-amber-500" /> Notifications
            </h3>

            <div className="space-y-4">
              {[
                { title: "New Bookings", desc: "Get notified when a customer books your trip" },
                { title: "Payout Updates", desc: "Receive alerts about processed payouts" },
                { title: "Customer Messages", desc: "Get alerts for new chat messages" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.desc}</p>
                  </div>
                  <div className="w-10 h-6 bg-amber-400 rounded-full relative shadow-inner">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <PrimaryButton className="px-8 h-12 text-sm shadow-xl shadow-amber-500/20">
                Save Preferences
              </PrimaryButton>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default VendorSettingsPage;
