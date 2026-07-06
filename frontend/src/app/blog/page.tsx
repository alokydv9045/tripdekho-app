'use client';

import React from 'react';
import Blogs from '@/components/Homepage/Blogs';
import Header from '@/components/Header';

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <div className="pt-20">
         <Blogs />
      </div>
    </div>
  );
}
