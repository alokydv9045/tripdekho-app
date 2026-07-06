"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollableTripRow from "@/components/shared/ScrollableTripRow";
import { tripService } from "@/services/tripService";
import { MapPin, Loader2, RefreshCw } from "lucide-react";

type Status = "idle" | "requesting" | "fetching" | "success" | "no-trips" | "geo-denied" | "error";

const TripsNearbyYou: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [userCity, setUserCity] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const hasFetched = useRef(false);

  const fetchTripsFromCoords = useCallback(async (lat: number, lng: number) => {
    setStatus("fetching");
    try {
      // 1. Reverse geocode to get city name
      let city = "";
      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          city = geoData.city || geoData.locality || geoData.principalSubdivision || "";
        }
      } catch {
        // Geocode failed silently — still fetch trips
      }

      if (city) setUserCity(city);

      // 2. Try city search first (most relevant)
      let data: any[] = [];
      if (city) {
        const res = await tripService.getAllTrips({ city, limit: 10 });
        data = res?.trips || res?.data?.trips || (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
      }

      // 3. Fallback: if city returns 0 trips, fetch by lat/lng proximity so we always show something
      if (data.length === 0) {
        const res = await tripService.getAllTrips({ userLat: lat, userLng: lng, limit: 10 });
        data = res?.trips || res?.data?.trips || (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
      }

      if (data.length > 0) {
        setTrips(data);
        setStatus("success");
      } else {
        setStatus("no-trips");
      }
    } catch (err) {
      console.error("Failed to fetch nearby trips", err);
      setErrorMsg("Failed to load trips. Please try again.");
      setStatus("error");
    }
  }, []);

  const requestLocation = useCallback(() => {
    setStatus("requesting");
    setErrorMsg("");

    if (!("geolocation" in navigator)) {
      setErrorMsg("Location services not supported by your browser.");
      setStatus("geo-denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchTripsFromCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Geolocation error:", error.code, error.message);
        if (error.code === 1) {
          // Permission denied
          setErrorMsg("Location permission denied. Enable it in your browser settings to see trips near you.");
        } else if (error.code === 2) {
          setErrorMsg("Unable to determine your location. Check your connection and try again.");
        } else {
          setErrorMsg("Location request timed out. Please try again.");
        }
        setStatus("geo-denied");
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 600000, // Cache for 10 minutes
      }
    );
  }, [fetchTripsFromCoords]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    requestLocation();
  }, [requestLocation]);

  // Never disappear during loading/requesting — only hide if permanently no location and no trips
  const isLoading = status === "idle" || status === "requesting" || status === "fetching";
  const isDenied = status === "geo-denied" || status === "error";

  return (
    <section
      id="nearby-trips-section"
      className="relative w-full py-12 md:py-16"
      style={{ background: "var(--background, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-6 md:mb-8">
          <SectionHeader
            title={<><MapPin className="inline-block text-amber-500 w-6 h-6 mr-2 -mt-1" />Trips Near</>}
            highlightedWord={userCity || "You"}
            viewAllHref="/search"
            viewAllLabel="View all"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48 w-full bg-gray-50/50 rounded-3xl border-2 border-gray-100">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {status === "requesting" ? "Finding your location..." : "Loading trips..."}
              </span>
            </div>
          </div>
        ) : isDenied ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 w-full bg-amber-50/50 rounded-3xl border-2 border-amber-100 text-center">
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-amber-500" />
            </div>
            <p className="font-bold text-gray-800 text-sm mb-2">
              {status === "error" ? "Something went wrong" : "Location access needed"}
            </p>
            <p className="text-xs text-gray-500 mb-2 max-w-xs leading-relaxed">
              {errorMsg}
            </p>
            {status === "geo-denied" && (
              <p className="text-[11px] text-gray-400 mb-5 max-w-xs">
                On mobile: tap the 🔒 lock icon in your browser address bar → Site Settings → Allow Location.
              </p>
            )}
            <button
              onClick={requestLocation}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-black rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        ) : status === "no-trips" ? (
          <div className="flex flex-col items-center justify-center h-48 w-full bg-gray-50/50 rounded-3xl border-2 border-gray-100 text-gray-500">
            <MapPin className="w-8 h-8 mb-2 opacity-30" />
            <p className="font-semibold text-sm">No trips found near {userCity || "you"}</p>
            <p className="text-xs opacity-70 mt-1">Check back soon for new itineraries in your area!</p>
          </div>
        ) : (
          <ScrollableTripRow
            trips={trips}
            sectionId="nearby-trips"
            loading={false}
          />
        )}
      </div>
    </section>
  );
};

export default TripsNearbyYou;
