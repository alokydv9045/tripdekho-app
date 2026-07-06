import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { Home, Search, Map } from 'lucide-react';
import PrimaryButton from '@/components/shared/PrimaryButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-24 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-2xl w-full text-center relative z-10">
          {/* Animated Illustration Placeholder / Icon */}
          <div className="mb-12 relative inline-block">
             <div className="text-[180px] font-black text-gray-100 leading-none select-none tracking-tighter">
                404
             </div>
             <div className="absolute inset-0 flex items-center justify-center">
                <Map className="w-24 h-24 text-amber-500 animate-bounce" />
             </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight uppercase">
            Lost in the <span className="text-amber-500">Wild?</span>
          </h1>
          
          <p className="text-xl text-gray-500 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
            Oops! It seems the trail you're looking for doesn't exist. Let's get you back to the base camp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <PrimaryButton className="h-14 px-10 text-base font-black uppercase tracking-widest shadow-xl shadow-amber-200">
                <Home className="mr-2 w-5 h-5" /> Back to Home
              </PrimaryButton>
            </Link>
            
            <Link href="/search">
              <button className="h-14 px-10 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center shadow-xl shadow-gray-200">
                <Search className="mr-2 w-5 h-5" /> Search Trips
              </button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-20 pt-10 border-t border-gray-100">
             <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Popular Destinations</p>
             <div className="flex flex-wrap justify-center gap-4">
                {['Mountains', 'Beach', 'Spiritual', 'Heritage'].map((cat) => (
                   <Link 
                     key={cat} 
                     href={`/${cat.toLowerCase()}`}
                     className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all uppercase tracking-widest"
                   >
                      {cat}
                   </Link>
                ))}
             </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}

