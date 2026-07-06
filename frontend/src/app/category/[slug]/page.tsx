"use client";

import React, { use } from 'react';
import { Header, PageHero } from '@/components/index';
import CategoryPageContent from '@/components/category/CategoryPageContent';

/**
 * Maps category slugs to hero section configuration.
 */
const HERO_CONFIG: Record<string, { subtitle: string; title: string; backgroundImage: string }> = {
  'weekend-escapes': {
    subtitle: 'Explore our',
    title: 'Weekend Escapes',
    backgroundImage: '/trips/zanskar-valley.png',
  },
  'budget-friendly': {
    subtitle: 'Discover',
    title: 'Budget Friendly',
    backgroundImage: '/trips/zanskar-valley.png',
  },
  'top-trips': {
    subtitle: 'Our best',
    title: 'Top Trips',
    backgroundImage: '/trips/zanskar-valley.png',
  },
  'explore-offbeat': {
    subtitle: 'Go beyond',
    title: 'Offbeat Trails',
    backgroundImage: '/trips/zanskar-valley.png',
  },
  'beach': {
    subtitle: 'Sun, Sand &',
    title: 'Beach Vibes',
    backgroundImage: '/trips/zanskar-valley.png',
  },
  'mountains': {
    subtitle: 'Conquer the',
    title: 'Mountains',
    backgroundImage: '/trips/roopkund.png',
  },
  'heritage': {
    subtitle: 'Walk through',
    title: 'Heritage',
    backgroundImage: '/trips/zanskar-valley.png',
  },
  'hike': {
    subtitle: 'Trek the',
    title: 'Hiking Trails',
    backgroundImage: '/trips/roopkund.png',
  },
  'spiritual': {
    subtitle: 'Find peace in',
    title: 'Spiritual Journeys',
    backgroundImage: '/trips/zanskar-valley.png',
  },
};

const formatTitle = (slug: string) => {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);

  const heroConfig = HERO_CONFIG[slug] || {
    subtitle: 'Explore our',
    title: `${formatTitle(slug)} Trips`,
    backgroundImage: '/trips/zanskar-valley.png',
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="grow w-full pt-6 px-4 md:px-8 max-w-[1440px] mx-auto">
        <PageHero 
          subtitle={heroConfig.subtitle}
          title={heroConfig.title}
          backgroundImage={heroConfig.backgroundImage} 
          altText={`Trip Dekho ${heroConfig.title}`}
        />
        
        <div className="pb-16">
          <CategoryPageContent categorySlug={slug} />
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
