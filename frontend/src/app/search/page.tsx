"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import { tripService } from "@/services/tripService";
import TripCard from "@/components/Homepage/UpcomingTrips/TripCard";
import FilterSidebar from "@/components/shared/FilterSidebar";
import PageHero from "@/components/shared/PageHero";
import SectionReveal from "@/components/shared/SectionReveal";
import StaggerGroup from "@/components/shared/StaggerGroup";
import { Map as MapIcon, Search, X } from "lucide-react";

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-100" />
    <div className="p-6 space-y-3">
      <div className="h-3 bg-gray-100 rounded-full w-1/3" />
      <div className="h-6 bg-gray-100 rounded-full w-4/5" />
      <div className="h-4 bg-gray-50 rounded-full w-2/3" />
      <div className="flex justify-between items-center pt-4">
        <div className="h-8 bg-gray-100 rounded-full w-24" />
        <div className="h-8 bg-amber-100 rounded-full w-20" />
      </div>
    </div>
  </div>
);

// Suspense wrapper to handle useSearchParams which bails out of static rendering
const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get("q") || "";

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [popularTags, setPopularTags] = useState<{ label: string; icon: string; query: string }[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("newest");
  const [userLat, setUserLat] = useState<number | undefined>();
  const [userLng, setUserLng] = useState<number | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
        },
        () => {
          console.warn("Geolocation permission denied or failed.");
        }
      );
    }
  }, []);

  // Fetch popular tags dynamically from real trip data
  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const data = await tripService.getAllTrips({ limit: 50 });
        const tripsArr = data?.trips || [];
        
        // Extract unique locations from real trips
        const locationMap = new Map<string, number>();
        for (const trip of tripsArr) {
          const city = trip.location?.city || trip.city;
          if (city && typeof city === 'string') {
            const key = city.trim();
            locationMap.set(key, (locationMap.get(key) || 0) + 1);
          }
        }
        
        // Sort by frequency and take top 8
        const sorted = [...locationMap.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8);
        
        const iconMap: Record<string, string> = {
          'manali': '🏔️', 'goa': '🌊', 'kerala': '🌿', 'rajasthan': '🏰', 
          'ladakh': '🦅', 'coorg': '☕', 'rishikesh': '🧘', 'shimla': '❄️',
          'jaipur': '🏰', 'udaipur': '🌅', 'varanasi': '🕉️', 'darjeeling': '🍵',
          'munnar': '🌿', 'ooty': '⛰️', 'andaman': '🏝️', 'leh': '🦅',
          'meghalaya': '🌧️', 'spiti': '🏔️', 'kasol': '🌲', 'mcleodganj': '🙏',
        };
        
        if (sorted.length > 0) {
          setPopularTags(sorted.map(([city, count]) => ({
            label: city,
            icon: iconMap[city.toLowerCase()] || '📍',
            query: city.toLowerCase(),
          })));
        } else {
          // Fallback if no trips exist yet
          setPopularTags([
            { label: "Manali", icon: "🏔️", query: "manali" },
            { label: "Goa", icon: "🌊", query: "goa" },
            { label: "Kerala", icon: "🌿", query: "kerala" },
            { label: "Ladakh", icon: "🦅", query: "ladakh" },
          ]);
        }
      } catch {
        setPopularTags([
          { label: "Manali", icon: "🏔️", query: "manali" },
          { label: "Goa", icon: "🌊", query: "goa" },
        ]);
      }
    };
    fetchPopularTags();
  }, []);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      
      const params: Record<string, any> = {};
      const q = searchParams.get("q");
      const cat = searchParams.get("category");
      
      if (q) params.q = q;
      if (cat) params.category = cat;
      if (sortBy) params.sortBy = sortBy;
      if (userLat) params.userLat = userLat;
      if (userLng) params.userLng = userLng;
      
      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const city = searchParams.get("city");
      if (city) params.city = city;

      const tags = searchParams.get("tags");
      if (tags) params.tags = tags;

      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      // Fetch enough results for browsing
      params.limit = 100;

      const data = await tripService.getAllTrips(params);
      
      // Handle the API response shape: { trips: [...], pagination: {...} }
      // tripService.getAllTrips returns response.data which is the raw body
      const tripsArray = data?.trips || data?.data?.trips || (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
      setTrips(tripsArray);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, sortBy, userLat, userLng]);

  useEffect(() => {
    // Sync search term when URL changes
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Handle manual search form submit
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("q", searchTerm);
    } else {
      params.delete("q");
    }
    
    router.push(`/search?${params.toString()}`);
  };

  const handlePopularClick = (query: string) => {
    router.push(`/search?q=${query}`);
  };

  const handleFilterChange = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`/search?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.push("/search");
  };

  return (
    <main className="grow w-full pt-6 px-4 md:px-8 max-w-[1440px] mx-auto">
      {/* Hero Banner */}
      <PageHero 
        subtitle="Welcome to"
        title="Search"
        backgroundImage="/trips/zanskar-valley.png" 
        altText="Search Trips Hero Background"
      />

      <div className="pb-16">
        <section className="w-full pb-16 pt-8">
          {/* Page Header + Inline Search */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] mb-8">
              {!isMounted || !searchParams.get("q") ? (
                <>All Upcoming <span className="text-amber-500">Adventures</span></>
              ) : (
                <>Search <span className="text-amber-500">Results</span> <br /> <span className="text-gray-400 text-2xl tracking-normal normal-case">&quot;{searchParams.get("q")}&quot;</span></>
              )}
            </h1>

            {/* Inline Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trips, destinations, experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-14 pl-12 pr-12 bg-white border border-gray-200 rounded-2xl text-sm font-bold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm"
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <button 
                type="submit"
                className="h-14 px-8 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-200/50"
              >
                Search
              </button>
            </form>

            {/* Dynamic Popular Tags */}
            {popularTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest self-center mr-2">Popular:</span>
                {popularTags.map((dest) => (
                  <button
                    key={dest.query}
                    onClick={() => handlePopularClick(dest.query)}
                    className={`flex items-center gap-1.5 px-4 py-2 border rounded-full text-xs font-bold transition-all duration-200 ${
                      searchParams.get("q") === dest.query 
                        ? 'bg-amber-50 border-amber-300 text-amber-700' 
                        : 'bg-white border-gray-100 text-gray-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700'
                    }`}
                  >
                    <span>{dest.icon}</span> {dest.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Sidebar filtering area */}
            <div className="w-full lg:w-auto overflow-visible lg:sticky lg:top-8 shrink-0">
              <SectionReveal variant="fadeInLeft">
                <FilterSidebar 
                  searchParams={searchParams}
                  onFilterChange={handleFilterChange}
                />
              </SectionReveal>
            </div>

            {/* Main Grid Area */}
            <div className="flex-grow w-full">
              {/* Sort Controls */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {loading ? 'Loading...' : `${trips.length} trip${trips.length !== 1 ? 's' : ''} found`}
                </p>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold bg-white border border-gray-100 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : trips.length > 0 ? (
                <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
                  {trips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} fullWidth />
                  ))}
                </StaggerGroup>
              ) : (
                <div className="bg-white rounded-[40px] p-16 md:p-24 text-center shadow-2xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center">
                  <div className="w-24 h-24 bg-amber-50 rounded-[32px] flex items-center justify-center mb-8 border border-amber-100">
                    <MapIcon className="w-12 h-12 text-amber-300" />
                  </div>
                  <p className="text-amber-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">No Results Found</p>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">No trips match this search</h3>
                  <p className="text-gray-400 font-medium max-w-sm mx-auto mb-12 leading-relaxed">
                    Try adjusting your filters, or explore one of our popular destinations below.
                  </p>

                  {/* Popular Destinations Quick Search */}
                  <div className="w-full max-w-lg">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-5">Discover Popular Destinations</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {popularTags.map((dest) => (
                        <button
                          key={dest.query}
                          onClick={() => handlePopularClick(dest.query)}
                          className="flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-100 rounded-full text-xs font-black uppercase tracking-wider text-gray-600 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all duration-200"
                        >
                          <span>{dest.icon}</span> {dest.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={clearSearch}
                    className="mt-10 h-14 px-12 bg-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-amber-200"
                  >
                    Clear & Browse All
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const SearchPage = () => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <Header />
      <Suspense
        fallback={
          <div className="flex-grow flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8 max-w-7xl w-full mx-auto">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
};

export default SearchPage;
