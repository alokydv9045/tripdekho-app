"use client";

import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Plane } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  alternateAction: {
    text: string;
    linkText: string;
    href?: string;
    onClick?: () => void;
  };
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  alternateAction 
}) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Illustration / Image - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/mountains.png"
          alt="Travel Background"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-60 mix-blend-overlay scale-110 animate-slow-zoom"
          priority
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-12 text-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 group/logo mb-12 transition-all hover:scale-[1.02] active:scale-95 duration-300 w-fit"
            title="Go to Homepage"
          >
            <div className="relative h-14 w-48 invert brightness-0 filter drop-shadow-sm group-hover/logo:drop-shadow-[0_4px_12px_rgba(255,255,255,0.25)] transition-all duration-300">
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
              size={18} 
              className="text-amber-500 opacity-0 -translate-x-4 group-hover/logo:opacity-100 group-hover/logo:translate-x-0 transition-all duration-500 ease-out" 
            />
          </Link>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Discover the world's <br />
            <span className="text-amber-400">most beautiful</span> places.
          </h2>
          
          <p className="text-lg text-gray-200 max-w-md mx-auto leading-relaxed">
            Join 100,000+ travelers exploring hidden gems and unforgettable adventures across the globe.
          </p>

          <div className="mt-12 flex gap-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">500+</span>
              <span className="text-sm text-gray-400">Destinations</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">10k+</span>
              <span className="text-sm text-gray-400">Happy Travelers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">4.8</span>
              <span className="text-sm text-gray-400">Average Rating</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-10 lg:px-16 py-8">
        {/* Back Button */}
        <div className="flex-shrink-0 mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 group transition-all"
          >
            <div className="p-2 rounded-full bg-gray-50 group-hover:bg-amber-100 transition-colors">
              <ArrowLeft size={18} className="text-gray-600 group-hover:text-amber-600 transition-colors" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-amber-600 transition-colors">
              Back to Home
            </span>
          </Link>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden mb-12 flex justify-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 group/logo transition-all hover:scale-[1.02] active:scale-95 duration-300 w-fit"
            title="Go to Homepage"
          >
            <div className="relative h-10 w-32 filter drop-shadow-sm group-hover/logo:drop-shadow-[0_4px_12px_rgba(255,209,51,0.25)] transition-all duration-300">
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
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <p className="text-gray-500 font-medium">{subtitle}</p>
            </div>

            {children}

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-medium">
                {alternateAction.text}{' '}
                {alternateAction.onClick ? (
                  <button 
                    type="button"
                    onClick={alternateAction.onClick}
                    className="text-amber-500 hover:text-amber-600 font-bold ml-1 transition-colors hover:underline"
                  >
                    {alternateAction.linkText}
                  </button>
                ) : alternateAction.href ? (
                  <Link 
                    href={alternateAction.href} 
                    className="text-amber-500 hover:text-amber-600 font-bold ml-1 transition-colors hover:underline"
                  >
                    {alternateAction.linkText}
                  </Link>
                ) : null}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
