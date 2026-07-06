"use client";

import React, { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';
import { ShieldAlert, Clock, Mail, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export const LockdownShield = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    const isAdminPath = pathname?.startsWith('/admin');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const data = await publicService.getGlobalSettings();
                setSettings(data);
            } catch (err) {
                // Default to allowing if fetch fails
            } finally {
                setIsLoading(false);
            }
        };
        checkStatus();
    }, []);

    // Bypassing for Admin dashboard
    if (isAdminPath) return <>{children}</>;

    if (settings?.isMaintenanceMode) {
        return (
            <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center p-8 font-sans antialiased text-black">
                <div className="max-w-xl w-full text-center space-y-12">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex p-4 bg-gray-50 rounded-full border border-gray-100"
                    >
                        <ShieldAlert className="h-10 w-10 text-black" />
                    </motion.div>
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">System Under<br />Construction</h1>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">{settings.maintenanceMessage}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl text-left space-y-2">
                           <Clock className="h-5 w-5 text-gray-400" />
                           <p className="text-[10px] font-black uppercase text-gray-400">Status</p>
                           <p className="text-sm font-bold">Planned Maintenance</p>
                        </div>
                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl text-left space-y-2">
                           <Mail className="h-5 w-5 text-gray-400" />
                           <p className="text-[10px] font-black uppercase text-gray-400">Inquiries</p>
                           <p className="text-sm font-bold">{settings.brandEmail}</p>
                        </div>
                    </div>

                    <div className="pt-8 flex items-center justify-center gap-2">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Core Engine Online - Access Restricted</span>
                    </div>
                </div>
                
                {/* Visual Flair */}
                <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100"></div>
            </div>
        );
    }

    return <>{children}</>;
};
