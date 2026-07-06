"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Plane } from "lucide-react";
import SocialIcon from "./components/SocialIcon";
import FooterLinkGroup from "./components/FooterLinkGroup";
import AppDownload from "./components/AppDownload";
import NewsletterForm from "./NewsletterForm";
import { policyLinks, contactLinks } from "./data/footerData";

import { axiosPublic } from "@/lib/axios";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosPublic.get('/cms/settings');
        if (res.data.success) setSettings(res.data.data);
      } catch (err) {
        console.error("Failed to fetch footer settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const socialLinksArr = settings?.socialLinks ? [
    { name: "Instagram", url: settings.socialLinks.instagram, iconD: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
    { name: "YouTube", url: settings.socialLinks.youtube, iconD: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 0 0-2.122 2.136C0 8.186 0 12 0 12s0 3.814.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.814 24 12 24 12s0-3.814-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
    { name: "X (Twitter)", url: settings.socialLinks.twitter, iconD: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  ] : [];

  return (
    <footer className="relative z-20 w-full bg-[#0D0D0D] text-white font-sans mt-16 border-t border-gray-800 isolate">
      {/* Main Container */}
      <div className=" w-full px-6 md:px-12 pt-6 md:pt-10 pb-12 md:pb-16">
        
        {/* 12-Column Responsive Grid layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-12 md:gap-x-8 lg:gap-x-4">
          
          {/* Col 1: Brand Info & App Download (Spans 4 columns) */}
          <div className="lg:col-span-4 flex flex-col items-start lg:pr-8 space-y-8">
            <div>
              <Link 
                href="/" 
                className="flex items-center gap-2 group/logo mb-5 transition-all hover:scale-[1.02] active:scale-95 duration-300 w-fit"
                title="Go to Homepage"
              >
                <div className="relative h-12 w-36 invert brightness-0 filter drop-shadow-sm group-hover/logo:drop-shadow-[0_4px_12px_rgba(255,255,255,0.2)] transition-all duration-300">
                  <Image
                    src="/bg-logo.png"
                    alt="TripDekho"
                    fill
                    sizes="(max-width: 768px) 150px, 200px"
                    className="object-contain"
                    priority
                  />
                </div>
                {/* Sliding Airplane Icon */}
                <Plane 
                  size={16} 
                  className="text-amber-500 opacity-0 -translate-x-4 group-hover/logo:opacity-100 group-hover/logo:translate-x-0 transition-all duration-500 ease-out" 
                />
              </Link>
              
              <p className="text-[#888888] text-sm leading-relaxed mb-6 max-w-[280px]">
                {settings?.brandDescription || 'Find your dream trip, explore beautiful destinations, and book premium experiences with ease. Your modern travel companion.'}
              </p>
  
              <div className="flex items-center gap-3">
                {socialLinksArr.map((social) => (
                  <SocialIcon key={social.name} name={social.name} url={social.url} d={social.iconD} />
                ))}
              </div>
            </div>

            <div className="w-full max-w-[320px]">
              <AppDownload />
            </div>
          </div>
 
          {/* Col 2: Newsletter (Spans 4 columns) */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <NewsletterForm />
          </div>
 
          {/* Col 3: Policies Links (Spans 2 columns) */}
          <div className="lg:col-span-2 lg:pl-4">
            <FooterLinkGroup title="Policies" links={policyLinks} />
          </div>
 
          {/* Col 4: Contact Links (Spans 2 columns) */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-black text-white uppercase tracking-tighter mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-white/5 rounded-lg text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Phone size={14} />
                </div>
                <span className="text-[#888888] text-xs font-bold group-hover:text-white transition-colors">{settings?.brandPhone || '+91 1800-TRIP-DEKHO'}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 bg-white/5 rounded-lg text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Mail size={14} />
                </div>
                <span className="text-[#888888] text-xs font-bold group-hover:text-white transition-colors">{settings?.brandEmail || 'support@tripdekho.com'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright Strip */}
      <div className="border-t border-gray-800 bg-black w-full py-5 px-6">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs text-center md:text-left">
            {settings?.brandName || 'TripDekho'} © <span suppressHydrationWarning>{new Date().getFullYear()}</span> All Rights Reserved
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/admin-login" className="hover:text-amber-500 transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
