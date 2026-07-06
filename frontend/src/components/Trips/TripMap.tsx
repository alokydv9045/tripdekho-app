"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the map component with no SSR
const TripMapContent = dynamic(() => import("./TripMapContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center rounded-2xl border border-gray-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Loading Destination Map
        </span>
      </div>
    </div>
  ),
});

interface TripMapProps {
  lat?: number;
  lng?: number;
  title?: string;
  className?: string;
}

const TripMap: React.FC<TripMapProps> = ({ lat, lng, title, className = "h-[300px] w-full" }) => {
  // Default coordinates if none provided (e.g. India center)
  const finalLat = lat || 20.5937;
  const finalLng = lng || 78.9629;

  return (
    <div className={className} id="trip-map-container">
      <TripMapContent lat={finalLat} lng={finalLng} title={title || "Destination"} />
    </div>
  );
};

export default TripMap;
