'use client';

import React, { useEffect } from 'react';
import Header from '@/components/Header';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import PrimaryButton from '@/components/shared/PrimaryButton';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Runtime Error caught by Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full bg-white border border-gray-100 rounded-[40px] p-12 shadow-2xl shadow-gray-200/50 text-center relative overflow-hidden">
          {/* Decorative Corner Icon */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <ShieldAlert className="w-24 h-24 text-red-500" />
          </div>

          <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-red-50 text-red-500 rounded-3xl animate-pulse">
            <AlertTriangle className="w-12 h-12" />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            Something went <span className="text-red-500">Wrong</span>
          </h1>
          
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10 leading-relaxed max-w-sm mx-auto">
             An unexpected internal error occurred. Our team has been notified.
          </p>

          {/* Error Message Tooltip */}
          {error.message && (
             <div className="mb-12 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-mono text-gray-400 break-all">
                Error ID: {error.digest || 'REF-8392-X'} <br />
                {error.message.substring(0, 100)}...
             </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <PrimaryButton 
              onClick={() => reset()}
              className="h-14 px-10 text-base font-black uppercase tracking-widest shadow-xl shadow-amber-200 w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 w-5 h-5" /> Try Again
            </PrimaryButton>
            
            <Link href="/" className="w-full sm:w-auto">
              <button className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center shadow-xl shadow-gray-200 w-full sm:w-auto">
                <Home className="mr-2 w-5 h-5" /> Go Home
              </button>
            </Link>
          </div>
        </div>
      </main>

      
    </div>
  );
}

