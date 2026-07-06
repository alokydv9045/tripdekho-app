'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Search, SearchX } from 'lucide-react';
import { City } from './cityData';
import { useState, useEffect, useMemo, useRef } from 'react';
import { getIcon } from './iconMap';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { axiosPublic } from '@/lib/axios';

interface CityPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (city: City) => void;
  title?: string;
  type?: 'destination' | 'pickup';
}

const CityPickerModal = ({ isOpen, onClose, onSelect, title = "Choose Your City", type = "destination" }: CityPickerModalProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchCities = async () => {
        setLoading(true);
        try {
          const res = await axiosPublic.get(`/cms/destinations?type=${type}`);
          if (res.data.success) {
            setCities(res.data.data.map((item: any) => ({
              id: item.id,
              name: item.label,
              value: item.value,
              icon: getIcon(item.icon),
              isNewlyAdded: item.isNewlyAdded
            })));
          }
        } catch (error) {
          console.error('Fetch cities failed:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCities();
    }
  }, [isOpen, type]);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    const query = searchQuery.toLowerCase();
    return cities.filter(city => 
      city.name.toLowerCase().includes(query) ||
      (city.value && city.value.toLowerCase().includes(query)) ||
      (city.label && city.label.toLowerCase().includes(query))
    );
  }, [cities, searchQuery]);

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await axiosPublic.post('/location/reverse-geocode', { latitude, longitude });
          
          if (res.data.success && res.data.data.city) {
            const detectedCityName = res.data.data.city;
            
            // Try to find matching city in our list (fuzzy match)
            const matchedCity = cities.find(c => 
              c.name.toLowerCase().includes(detectedCityName.toLowerCase()) ||
              detectedCityName.toLowerCase().includes(c.name.toLowerCase())
            );

            if (matchedCity) {
              toast.success(`Detected: ${detectedCityName}. Selecting ${matchedCity.name}...`);
              onSelect(matchedCity);
            } else {
              toast.info(`Detected: ${detectedCityName}. We don't serve this area yet!`);
            }
          } else {
            toast.error("Could not resolve your city name.");
          }
        } catch (error) {
          console.error("Location detection failed:", error);
          toast.error("Failed to detect location. Please try manually.");
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Please allow location access to use this feature.");
        } else {
          toast.error("Error getting your coordinates.");
        }
      }
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-[8px] z-[200] transition-all"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 lg:p-10 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="bg-white w-full max-w-xl rounded-[32px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 flex items-start justify-between relative bg-white/80 backdrop-blur-md z-10">
                <div>
                   <h2 className="text-[24px] font-black text-gray-900 tracking-tighter uppercase leading-none mb-1.5 pt-1">
                     {title}
                   </h2>
                   <p className="text-gray-400 text-[8px] font-black uppercase tracking-[0.25em]">
                     Tailoring elite experiences for your coordinates.
                   </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2.5 bg-gray-50 rounded-xl hover:bg-sync-active hover:text-white transition-all group"
                >
                  <X className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Country / Tabs & Search */}
              <div className="px-6 py-3 border-b border-gray-50 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-sync-active">
                     <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" className="w-5 h-3.5 shadow-xs" />
                     <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">India</span>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full max-w-[200px] group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-hover:text-sync-active transition-colors" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="FIND CITY..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border border-transparent rounded-lg py-2.5 pl-9 pr-3 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-sync-active/10 focus:bg-white focus:border-sync-active/20 transition-all placeholder:text-gray-300 pointer-events-auto"
                    />
                  </div>
              </div>

              {/* Scrollable City Grid */}
              <div className="px-6 pb-6 overflow-y-auto flex-1 scrollbar-hide">
                 {filteredCities.length > 0 ? (
                   <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-y-8 gap-x-4 pt-2"
                   >
                      {filteredCities.map((city) => (
                        <motion.div
                          key={city.id}
                          variants={itemVariants}
                          onClick={() => onSelect(city)}
                          className="flex flex-col items-center group cursor-pointer"
                          whileHover={{ y: -3 }}
                        >
                           <div className="relative mb-3">
                              <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center text-[#715a00] shadow-lg shadow-sync-active/5 group-hover:rotate-6 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
                                 <city.icon className="w-7 h-7" strokeWidth={1} />
                              </div>
                              {city.isNewlyAdded && (
                                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gray-900 text-[6px] font-black uppercase tracking-tighter text-white rounded shadow-md ring-2 ring-white">
                                  NEW
                                </span>
                              )}
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 group-hover:text-sync-active transition-colors text-center truncate w-full px-1">
                              {city.name}
                           </span>
                        </motion.div>
                      ))}
                   </motion.div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
                     <div className="p-5 bg-gray-50 rounded-full mb-3">
                       <SearchX className="w-10 h-10 text-gray-200" />
                     </div>
                     <h4 className="text-gray-900 text-base font-black tracking-tight mb-1 uppercase text-center">No Match</h4>
                     <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest text-center">Your dream city is loading...</p>
                     <button 
                       onClick={() => setSearchQuery("")}
                       className="mt-4 text-[8px] font-black uppercase tracking-widest text-sync-active hover:underline"
                     >
                       RESET
                     </button>
                   </div>
                 )}
              </div>

              {/* Footer */}
              <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-center">
                 <button 
                  onClick={handleDetectLocation}
                  disabled={isDetecting}
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-200 rounded-[16px] shadow-sm hover:shadow-md hover:border-sync-active/30 transition-all group overflow-hidden relative disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    <div className="absolute inset-y-0 left-0 w-0.5 bg-sync-active opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isDetecting ? (
                      <Loader2 className="w-4 h-4 text-sync-active animate-spin" />
                    ) : (
                      <div className="relative">
                        <Navigation className="w-4 h-4 text-sync-active group-hover:animate-bounce" />
                        <div className="absolute inset-0 bg-sync-active/20 rounded-full animate-ping" />
                      </div>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">
                       {isDetecting ? "Detecting..." : "Detect Location"}
                    </span>
                 </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CityPickerModal;
