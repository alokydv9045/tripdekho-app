"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CityPickerModal from "../shared/CityPickerModal";
import { City } from "../shared/cityData";
import { MapPin } from 'lucide-react';
import AnimatedButton from "../shared/AnimatedButton";

export default function HeroSearchBox() {
  const router = useRouter();
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedPickup, setSelectedPickup] = useState("");
  
  const [isCityPickerOpen, setIsCityPickerOpen] = useState(false);
  const [activePickerField, setActivePickerField] = useState<'destination' | 'pickup' | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDestination) params.set("q", selectedDestination);
    if (selectedPickup) params.set("pickup", selectedPickup);
    router.push(`/search?${params.toString()}`);
  };

  const openCityPicker = (field: 'destination' | 'pickup') => {
    setActivePickerField(field);
    setIsCityPickerOpen(true);
  };

  const handleCitySelect = (city: City) => {
    if (activePickerField === 'destination') {
      setSelectedDestination(city.name);
    } else {
      setSelectedPickup(city.name);
    }
    setIsCityPickerOpen(false);
  };

  return (
    <>
      <CityPickerModal 
        isOpen={isCityPickerOpen} 
        onClose={() => setIsCityPickerOpen(false)} 
        onSelect={handleCitySelect}
        title={activePickerField === 'destination' ? "Where to go?" : "Where to start?"}
        type={activePickerField === 'destination' ? 'destination' : 'pickup'}
      />
      <div className="space-y-3 backdrop-blur-xl bg-white/70 rounded-2xl p-5 border border-white/40" style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        {/* Destination City – button style, same as Pickup */}
        <div className="relative group">
          <button
            id="hero-destination-trigger"
            onClick={() => openCityPicker('destination')}
            className="w-full text-left bg-white/80 backdrop-blur-sm rounded-xl px-4 py-[14px] text-[13px] font-bold tracking-wide outline-none cursor-pointer transition-all duration-150 border-2 border-transparent focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/30 hover:bg-white pl-10"
            style={{
              color: "#191c1d",
              fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              boxShadow: "0 2px 8px -2px rgba(0,0,0,0.06)",
            }}
          >
            {selectedDestination ? selectedDestination.toUpperCase() : "DESTINATION"}
          </button>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MapPin className="w-[16px] h-[16px] text-[#191c1d] opacity-70" />
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg
              className="w-[16px] h-[16px] text-[#191c1d] opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Pickup City */}
        <div className="relative group">
          <button
            id="hero-pickup-trigger"
            onClick={() => openCityPicker('pickup')}
            className="w-full text-left bg-white/80 backdrop-blur-sm rounded-xl px-4 py-[14px] text-[13px] font-bold tracking-wide outline-none cursor-pointer transition-all duration-150 border-2 border-transparent focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/30 hover:bg-white pl-10"
            style={{
              color: "#191c1d",
              fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              boxShadow: "0 2px 8px -2px rgba(0,0,0,0.06)",
            }}
          >
            {selectedPickup ? selectedPickup.toUpperCase() : "PICKUP"}
          </button>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MapPin className="w-[16px] h-[16px] text-[#191c1d] opacity-70" />
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg
              className="w-[16px] h-[16px] text-[#191c1d] opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <AnimatedButton
          id="hero-search-button"
          onClick={handleSearch}
          className="w-full rounded-xl flex justify-center items-center py-[14px] text-[14px] font-extrabold tracking-widest cursor-pointer mt-1.5 relative overflow-hidden"
          style={{
            background: "var(--gold-primary)",
            color: "var(--charcoal)",
            fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
            boxShadow: "var(--shadow-button)",
          }}
        >
          <span className="relative z-10">SEARCH</span>
        </AnimatedButton>
      </div>
    </>
  );
}
