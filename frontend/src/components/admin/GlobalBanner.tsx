"use client";

import React, { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalBanner = () => {
    const [settings, setSettings] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await publicService.getGlobalSettings();
                setSettings(data);
            } catch {
                // Banner is optional; fail silently if API is unavailable
            }
        };
        fetchSettings();
        
        // Refresh every 5 minutes
        const interval = setInterval(fetchSettings, 300000);
        return () => clearInterval(interval);
    }, []);

    if (!settings?.alertActive || !isVisible) return null;

    const styles = {
        info: "bg-blue-600 border-blue-700 text-white",
        warning: "bg-amber-500 border-amber-600 text-white",
        error: "bg-red-600 border-red-700 text-white"
    };

    const icons = {
        info: <Info className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        error: <AlertCircle className="h-4 w-4" />
    };

    const type = (settings.alertType || 'info') as keyof typeof styles;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("w-full border-b flex items-center justify-between px-4 md:px-8 py-2 md:py-3 gap-2", styles[type])}
            >
                <div className="flex items-center gap-3">
                    {icons[type]}
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                        Protocol Alert: {settings.alertMessage}
                    </span>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="hover:scale-110 transition-transform"
                >
                    <X className="h-4 w-4 text-white/60 hover:text-white" />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};
