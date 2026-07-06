"use client";
import React from 'react';
import Link from 'next/link';
import WeatherWidget from '@/components/shared/WeatherWidget';

export default function LiveWeatherForecasts() {
  const destinations = ['Manali', 'Goa', 'Jaipur', 'Gulmarg'];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-16 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl text-gray-900 font-bold mb-3" style={{ fontFamily: "var(--font-caveat), cursive" }}>
            Live Weather Forecasts
          </h2>
          <p className="text-gray-500 font-medium text-sm md:text-base max-w-xl">
            Check the live weather and upcoming 3-day forecast for some of our most popular destinations before you pack your bags!
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map(loc => (
          <Link key={loc} href={`/search?q=${loc}`} className="block h-full group">
            <WeatherWidget location={loc} className="h-full cursor-pointer group-hover:border-amber-400 group-hover:shadow-md transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}
