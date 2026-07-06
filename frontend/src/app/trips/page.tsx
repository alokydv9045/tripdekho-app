"use client";

import React, { useEffect, useState, useMemo } from "react";
import { tripService } from "@/services/index";
import { Header, PageHero } from '@/components/index';
import TripCard from "@/components/Homepage/UpcomingTrips/TripCard";
import {
  Plane, BaggageClaim, Compass, Camera, Tent, Sun, Palmtree, Map as MapIcon,
  Search, SlidersHorizontal, X, ChevronDown
} from "lucide-react";

const CATEGORIES = ['all', 'adventure', 'cultural', 'religious', 'nature', 'beach', 'mountain', 'wildlife', 'heritage', 'wellness'];
const DIFFICULTIES = ['all', 'easy', 'moderate', 'challenging', 'extreme'];
const DURATIONS = [
  { label: 'All', value: 'all' },
  { label: '1-3 Days', value: '1-3' },
  { label: '4-6 Days', value: '4-6' },
  { label: '7+ Days', value: '7+' },
];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Duration: Short to Long', value: 'duration-asc' },
];
const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹5,000', value: '0-5000' },
  { label: '₹5,000 - ₹10,000', value: '5000-10000' },
  { label: '₹10,000 - ₹20,000', value: '10000-20000' },
  { label: '₹20,000 - ₹50,000', value: '20000-50000' },
  { label: 'Above ₹50,000', value: '50000-999999' },
];

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await tripService.getAllTrips({ limit: 200 });
        const tripsArray = res?.trips || res?.data?.trips || (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        setTrips(tripsArray);
      } catch (error) {
        console.error("Failed to fetch all trips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Extract unique locations for destination filter
  const uniqueLocations = useMemo(() => {
    const locations = trips.map(t => t.location?.city).filter(Boolean);
    return [...new Set(locations)].sort();
  }, [trips]);

  const filteredTrips = useMemo(() => {
    let result = [...trips];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title?.toLowerCase().includes(q) ||
        t.location?.city?.toLowerCase().includes(q) ||
        t.shortDescription?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(t => {
        const cats = Array.isArray(t.category) ? t.category : (typeof t.category === 'string' ? t.category.split(',').map((c: string) => c.trim()) : []);
        return cats.some((c: string) => c.toLowerCase() === selectedCategory.toLowerCase());
      });
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter(t => t.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase());
    }

    // Duration filter
    if (selectedDuration !== 'all') {
      const [min, max] = selectedDuration.split('-').map(Number);
      result = result.filter(t => {
        const days = t.durationDays || t.duration?.days || 0;
        if (selectedDuration === '7+') return days >= 7;
        return days >= min && days <= max;
      });
    }

    // Price range filter
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      result = result.filter(t => {
        const price = t.price?.amount || 0;
        return price >= min && price <= max;
      });
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
        break;
      case 'duration-asc':
        result.sort((a, b) => (a.durationDays || a.duration?.days || 0) - (b.durationDays || b.duration?.days || 0));
        break;
      default: // newest
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [trips, searchQuery, selectedCategory, selectedDifficulty, selectedDuration, selectedPriceRange, sortBy]);

  const activeFilterCount = [selectedCategory, selectedDifficulty, selectedDuration, selectedPriceRange].filter(f => f !== 'all').length;

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedDuration('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search trips, destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-200'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Price Range</label>
        <div className="space-y-1.5">
          {PRICE_RANGES.map(pr => (
            <button
              key={pr.value}
              onClick={() => setSelectedPriceRange(pr.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPriceRange === pr.value
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {pr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Duration</label>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map(d => (
            <button
              key={d.value}
              onClick={() => setSelectedDuration(d.value)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                selectedDuration === d.value
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-200'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Difficulty</label>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all ${
                selectedDifficulty === diff
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-200'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full h-10 bg-red-50 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-[#FFFBF0] min-h-screen font-sans selection:bg-amber-100 selection:text-amber-900 relative">
      {/* Subtle decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-48 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
      </div>

      {/* Floating Icons */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[12%] left-[8%] animate-fade-in-up delay-300">
          <Plane className="w-8 h-8 md:w-14 md:h-14 rotate-[15deg] opacity-50 text-[#d97706] animate-float-fast" />
        </div>
        <div className="absolute top-[55%] left-[4%] animate-fade-in-left delay-500">
          <BaggageClaim className="w-6 h-6 md:w-10 md:h-10 -rotate-12 opacity-40 text-[#d97706] animate-float-slow" />
        </div>
        <div className="absolute bottom-[20%] right-[8%] animate-fade-in-right delay-500">
          <MapIcon className="w-7 h-7 md:w-12 md:h-12 rotate-[10deg] opacity-40 text-[#d97706] animate-float-slow" />
        </div>
        <div className="absolute top-[15%] right-[15%] animate-fade-in-left delay-200">
          <Camera className="w-6 h-6 md:w-10 md:h-10 -rotate-[15deg] opacity-30 text-[#d97706] animate-float-fast" />
        </div>
      </div>

      <div className="relative z-10 block">
        <Header />
        <PageHero
          subtitle="Welcome to"
          title="All Trips"
          backgroundImage="/trips/zanskar-valley.png"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Top bar: Sort + Mobile Filter Toggle */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                All Experiences
              </h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                {filteredTrips.length} trips
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none h-10 pl-4 pr-10 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-amber-400 cursor-pointer shadow-sm"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden h-10 px-4 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2 shadow-sm relative"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-black text-[10px] font-black rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  Filters
                </h3>
                <FilterSection />
              </div>
            </aside>

            {/* Mobile Filter Drawer */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
                <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
                  <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterSection />
                  </div>
                </div>
              </div>
            )}

            {/* Trips Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex justify-center py-20 text-xl font-medium text-gray-500">
                  Loading trips...
                </div>
              ) : filteredTrips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTrips.map((trip: any) => (
                    <TripCard key={trip.id || trip.id} trip={trip} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Compass className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No trips found</h3>
                  <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search query</p>
                  <button
                    onClick={clearFilters}
                    className="h-10 px-6 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
