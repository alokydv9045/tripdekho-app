"use client";

import React, { useState, useEffect } from 'react';
import { publicService } from '@/services/publicService';
import { AlertCircle, AlertTriangle, Info, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const PublicBanner = () => {
    const [settings, setSettings] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await publicService.getGlobalSettings();
                setSettings(data);
            } catch (err) {
                // Fail silently for public users
            }
        };
        fetchSettings();
        
        // Refresh every 5 minutes
        const interval = setInterval(fetchSettings, 300000);
        return () => clearInterval(interval);
    }, []);

    if (!settings?.alertActive || !isVisible) return null;

    const styles = {
        info: "bg-black/90 border-white/10 text-white",
        warning: "bg-[#F15A24] border-orange-600/20 text-white",
        error: "bg-rose-600 border-rose-700/20 text-white"
    };

    const icons = {
        info: <Zap className="h-4 w-4 text-emerald-400" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        error: <AlertCircle className="h-4 w-4" />
    };

    const type = (settings.alertType || 'info') as keyof typeof styles;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                className={cn("w-full relative z-[100] backdrop-blur-md overflow-hidden", styles[type])}
            >
                <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-white/10 p-1 rounded-full">{icons[type]}</div>
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] leading-none antialiased">
                            Site Update: {settings.alertMessage}
                        </span>
                    </div>
                    <button 
                      onClick={() => setIsVisible(false)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-all"
                    >
                        <X className="h-3.5 w-3.5 text-white/50 hover:text-white" />
                    </button>
                </div>
                {/* Decorative scanning line */}
                <motion.div 
                   animate={{ x: ['-100%', '100%'] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
            </motion.div>
        </AnimatePresence>
    );
};
