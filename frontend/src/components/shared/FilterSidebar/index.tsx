"use client";

import React, { useState, useEffect } from "react";
import CalendarWidget from "./CalendarWidget";
import { cn } from "@/lib/utils";
import { tripService } from "@/services/tripService";

const AccordionItem = ({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-100 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span
            className="text-[14px] font-extrabold text-[#191c1d]"
            style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
          >
            {title}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

interface PillProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  count?: number;
}

const Pill = ({ label, icon, isActive, onClick, count }: PillProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium transition-colors",
      isActive 
        ? "border-amber-400 bg-amber-50 text-amber-700" 
        : "border-gray-200 text-gray-700 hover:bg-gray-50"
    )} 
    style={{fontFamily: "var(--font-vietnam), sans-serif"}}
  >
    {icon && <span className="text-[14px]">{icon}</span>}
    <span>{label}</span>
    {count !== undefined && count > 0 && (
      <span className={cn(
        "text-[9px] font-bold rounded-full px-1.5",
        isActive ? "bg-amber-200 text-amber-800" : "bg-gray-100 text-gray-500"
      )}>
        {count}
      </span>
    )}
  </button>
);

interface FilterSidebarProps {
  searchParams?: URLSearchParams;
  onFilterChange?: (updates: Record<string, string | null>) => void;
}

// Full category list synced with backend TripCategory enum
const CATEGORIES = [
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
  { id: 'cultural', label: 'Cultural', icon: '🏛️' },
  { id: 'religious', label: 'Religious', icon: '⛪' },
  { id: 'nature', label: 'Nature', icon: '🌲' },
  { id: 'beach', label: 'Beach', icon: '🌊' },
  { id: 'mountain', label: 'Mountain', icon: '⛰️' },
  { id: 'wildlife', label: 'Wildlife', icon: '🐅' },
  { id: 'heritage', label: 'Heritage', icon: '🏰' },
  { id: 'wellness', label: 'Wellness', icon: '🧘' },
  { id: 'offbeat', label: 'Offbeat', icon: '🗺️' },
  { id: 'hike', label: 'Hike', icon: '🥾' },
  { id: 'spiritual', label: 'Spiritual', icon: '🙏' },
];

const BUDGET_BRACKETS = [
  { id: 'below-10k', label: 'Below 10K', min: null, max: '10000' },
  { id: '10k-25k', label: '10K - 25K', min: '10000', max: '25000' },
  { id: '25k-50k', label: '25K - 50K', min: '25000', max: '50000' },
  { id: '50k-plus', label: '50K - 1Lakh +', min: '50000', max: null },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ searchParams, onFilterChange }) => {
  const currentCategory = searchParams?.get("category");
  const currentMinPrice = searchParams?.get("minPrice");
  const currentMaxPrice = searchParams?.get("maxPrice");
  const currentStartDate = searchParams?.get("startDate");
  const currentTags = searchParams?.get("tags");

  // Dynamic tags from real trip data
  const [dynamicTags, setDynamicTags] = useState<{ tag: string; count: number }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await tripService.getAllTrips({ limit: 100 });
        const trips = data?.trips || [];
        
        const tagMap = new Map<string, number>();
        for (const trip of trips) {
          // tags can be a string (comma-separated) or array
          let tripTags: string[] = [];
          if (typeof trip.tags === 'string') {
            tripTags = trip.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
          } else if (Array.isArray(trip.tags)) {
            tripTags = trip.tags;
          }
          
          for (const tag of tripTags) {
            const normalized = tag.toLowerCase().trim();
            if (normalized) {
              tagMap.set(normalized, (tagMap.get(normalized) || 0) + 1);
            }
          }
        }
        
        const sorted = [...tagMap.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 12)
          .map(([tag, count]) => ({ tag, count }));
        
        setDynamicTags(sorted);
      } catch (error) {
        console.error('Failed to fetch dynamic tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    if (!onFilterChange) return;
    if (currentCategory === categoryId) {
      onFilterChange({ category: null });
    } else {
      onFilterChange({ category: categoryId });
    }
  };

  const handleBudgetClick = (min: string | null, max: string | null) => {
    if (!onFilterChange) return;
    
    // Check if this bracket is currently active
    const isActive = currentMinPrice === min && currentMaxPrice === max;
    
    if (isActive) {
      onFilterChange({ minPrice: null, maxPrice: null });
    } else {
      onFilterChange({ minPrice: min, maxPrice: max });
    }
  };

  const handleDateSelect = (dateStr: string) => {
    if (!onFilterChange) return;
    if (dateStr) {
      onFilterChange({ startDate: dateStr });
    } else {
      onFilterChange({ startDate: null });
    }
  };

  const handleTagClick = (tag: string) => {
    if (!onFilterChange) return;
    
    const activeTags = currentTags ? currentTags.split(',') : [];
    
    if (activeTags.includes(tag)) {
      const newTags = activeTags.filter(t => t !== tag);
      onFilterChange({ tags: newTags.length > 0 ? newTags.join(',') : null });
    } else {
      onFilterChange({ tags: [...activeTags, tag].join(',') });
    }
  };

  const getActiveBudgetBracket = () => {
    return BUDGET_BRACKETS.find(b => b.min === currentMinPrice && b.max === currentMaxPrice)?.id;
  };

  const activeTagList = currentTags ? currentTags.split(',') : [];

  // Count active filters for the clear button
  const activeFilterCount = [
    currentCategory,
    currentMinPrice || currentMaxPrice,
    currentStartDate,
    currentTags,
  ].filter(Boolean).length;

  return (
    <aside className="w-[400px] shrink-0 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] p-6 overflow-hidden h-fit">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <h2
            className="text-[16px] font-extrabold text-[#191c1d]"
            style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
          >
            Filters
          </h2>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={() => onFilterChange?.({ category: null, minPrice: null, maxPrice: null, startDate: null, tags: null })}
            className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-700 transition-colors"
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      <AccordionItem
        title="Departure Date"
        icon={<span className="text-blue-500 text-[16px]">📅</span>}
        defaultOpen={true}
      >
        <CalendarWidget 
          onDateSelect={handleDateSelect}
          selectedDate={currentStartDate || null}
        />
      </AccordionItem>

      <AccordionItem
        title="Trip Category"
        icon={<span className="text-orange-400 text-[16px]">🏷️</span>}
        defaultOpen={true}
      >
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Pill 
              key={cat.id}
              label={cat.label} 
              icon={cat.icon} 
              isActive={currentCategory === cat.id}
              onClick={() => handleCategoryClick(cat.id)}
            />
          ))}
        </div>
      </AccordionItem>

      <AccordionItem
        title="Budget"
        icon={<span className="text-orange-500 text-[16px]">💰</span>}
        defaultOpen={true}
      >
        <div className="flex flex-wrap gap-2">
          {BUDGET_BRACKETS.map(bracket => (
            <Pill 
              key={bracket.id}
              label={bracket.label}
              isActive={getActiveBudgetBracket() === bracket.id}
              onClick={() => handleBudgetClick(bracket.min, bracket.max)}
            />
          ))}
        </div>
      </AccordionItem>

      {/* Dynamic Tags from real trip data */}
      {dynamicTags.length > 0 && (
        <AccordionItem
          title="Popular Tags"
          icon={<span className="text-purple-500 text-[16px]">🔖</span>}
          defaultOpen={false}
        >
          <div className="flex flex-wrap gap-2">
            {dynamicTags.map(({ tag, count }) => (
              <Pill 
                key={tag}
                label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                isActive={activeTagList.includes(tag)}
                onClick={() => handleTagClick(tag)}
                count={count}
              />
            ))}
          </div>
        </AccordionItem>
      )}
    </aside>
  );
};

export default FilterSidebar;
