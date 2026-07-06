"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { tripService } from "@/services/tripService";
import { aiService } from "@/services/aiService";
import { POPULAR_DESTINATIONS } from "@/components/shared/cityData";
import { toast } from "react-toastify";

import { 
  ChevronRight, ChevronLeft, MapPin, 
  Calendar, Info, DollarSign, Image as ImageIcon,
  Check, List, Layers, Plus, Trash2, Clock, Phone, UploadCloud, Sparkles
} from "lucide-react";
import PrimaryButton from "@/components/shared/PrimaryButton";

const CATEGORIES = ['adventure', 'cultural', 'religious', 'nature', 'beach', 'mountain', 'wildlife', 'heritage', 'wellness', 'other', 'multiple'];
const DIFFICULTIES = ['easy', 'moderate', 'challenging', 'extreme'];

const TripCreationPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleAIGenerate = async () => {
    if (!formData.title || formData.title.trim().length < 3) {
      toast.warning('Please enter a trip title first (at least 3 characters).');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const result = await aiService.generateTripDetails(formData.title, formData.location?.city);
      setFormData((prev: any) => ({
        ...prev,
        description: result.description,
        shortDescription: result.shortDescription,
        catchphrase: result.catchphrase,
      }));
      toast.success('✨ AI filled in your trip details!');
    } catch (err) {
      toast.error('AI generation failed. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    category: ["adventure"],
    shortDescription: "",
    description: "",
    location: { city: "", country: "India" },
    duration: { days: 1, nights: 0 },
    difficulty: "moderate",
    groupSize: { min: 1, max: 20 },
    price: { amount: 0, currency: "INR", occupancyOptions: [{ type: "Triple Sharing", price: 0, originalPrice: 0 }, { type: "Double Sharing", price: 0, originalPrice: 0 }] },
    highlights: ["", "", ""],
    inclusions: ["", "", ""],
    exclusions: ["", "", ""],
    pickupLocations: ["", "", ""],
    travelingLocations: ["", "", ""],
    thumbnail: { url: "" },
    routeMapImage: { url: "" },
    importantNote: "",
    dates: [{ startDate: "", endDate: "", price: 0 }],
    itinerary: [{ day: 1, title: "", description: "", accommodation: "", meals: { breakfast: false, lunch: false, dinner: false }, activities: [] }],
    isCustomizable: false,
    contactWhatsApp: "",
    status: "draft"
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index: number, value: string, field: 'highlights' | 'inclusions') => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData((prev: any) => ({ ...prev, [field]: newArr }));
  };

  const handleItineraryChange = (index: number, field: string, value: any) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, itinerary: newItinerary }));
  };

  const handleDateChange = (index: number, field: string, value: any) => {
    const newDates = [...formData.dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, dates: newDates }));
  };

  const addArrayField = (field: 'highlights' | 'inclusions' | 'itinerary' | 'dates' | 'exclusions' | 'pickupLocations' | 'travelingLocations') => {
    if (field === 'itinerary') {
        const nextDay = formData.itinerary.length + 1;
        setFormData((prev: any) => ({ ...prev, itinerary: [...prev.itinerary, { day: nextDay, title: "", description: "", accommodation: "", meals: { breakfast: false, lunch: false, dinner: false }, activities: [] }] }));
    } else if (field === 'dates') {
        setFormData((prev: any) => ({ ...prev, dates: [...prev.dates, { startDate: "", endDate: "", price: formData.price.amount }] }));
    } else {
        setFormData((prev: any) => ({ ...prev, [field]: [...prev[field], ""] }));
    }
  };

  const removeArrayField = (index: number, field: 'highlights' | 'inclusions' | 'itinerary' | 'dates' | 'exclusions' | 'pickupLocations' | 'travelingLocations') => {
    setFormData((prev: any) => ({ ...prev, [field]: prev[field].filter((_: any, i: number) => i !== index) }));
  };

  const generateRouteMap = async () => {
    const prompt = formData.routeMapImage?.url || formData.title;
    if (!prompt) {
      alert("Please type a prompt, or enter Trip Title first.");
      return;
    }
    try {
      setIsGeneratingMap(true);
      const { axiosPrivate } = await import('@/lib/axios');
      const res = await axiosPrivate.post('/ai/generate-map', {
        title: formData.title,
        locations: formData.travelingLocations.filter((l: string) => l.trim() !== ''),
        prompt: prompt
      });
      if (res.data.success) {
        setFormData((prev: any) => ({ ...prev, routeMapImage: { url: res.data.data.url } }));
        alert("Route map generated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate route map.");
    } finally {
      setIsGeneratingMap(false);
    }
  };

  const generateTripImage = async () => {
    const prompt = formData.thumbnail?.url || formData.title;
    if (!prompt) {
      alert("Please type a prompt, or enter a title first");
      return;
    }
    
    setIsGeneratingImage(true);
    
    try {
      const { axiosPrivate } = await import('@/lib/axios');
      const response = await axiosPrivate.post('/ai/generate-trip-image', {
        title: formData.title,
        destination: formData.location.city,
        prompt: prompt,
        vibe: formData.category || 'scenic'
      });
      
      if (response.data.success) {
        setFormData((prev: any) => ({
          ...prev,
          thumbnail: { url: response.data.data.url }
        }));
        alert("Trip image generated successfully!");
      }
    } catch (error) {
      alert("Failed to generate trip image");
      console.error(error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Construct slug if empty
      if (!formData.slug) {
        formData.slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }
      
      const mappedOccupancyOptions = formData.price.occupancyOptions?.map((o: any) => {
        const basePrice = Number(o.price);
        const discountPct = Number(o.discountPercent) || 0;
        const finalPrice = discountPct > 0 ? Math.round(basePrice - (basePrice * discountPct) / 100) : basePrice;
        return {
          type: o.type,
          price: finalPrice,
          originalPrice: discountPct > 0 ? basePrice : undefined,
        };
      });
      const topOpt = mappedOccupancyOptions?.[0] || { price: Number(formData.price.amount) };

      const payload = {
        title: formData.title,
        category: formData.category,
        shortDescription: formData.shortDescription,
        description: formData.description,
        difficulty: formData.difficulty,
        durationDays: Number(formData.duration.days),
        durationNights: Number(formData.duration.nights),
        location: {
          city: formData.location.city,
          state: formData.location.state,
          country: formData.location.country,
          address: formData.location.address,
        },
        price: { 
          amount: topOpt.price,
          currency: formData.price.currency,
          originalPrice: topOpt.originalPrice,
          priceType: formData.price.priceType,
          occupancyOptions: mappedOccupancyOptions,
        },
        highlights: formData.highlights.filter((h: string) => h.trim() !== ""),
        inclusions: formData.inclusions.filter((i: string) => i.trim() !== ""),
        exclusions: formData.exclusions.filter((e: string) => e.trim() !== ""),
        pickupLocations: formData.pickupLocations.filter((p: string) => p.trim() !== ""),
        travelingLocations: formData.travelingLocations.filter((t: string) => t.trim() !== ""),
        thumbnail: formData.thumbnail,
        routeMapImage: formData.routeMapImage,
        importantNote: formData.importantNote,
        isCustomizable: formData.isCustomizable,
        contactWhatsApp: formData.contactWhatsApp,
        itinerary: formData.itinerary.filter((it: any) => it.title.trim() !== "").map((it: any) => ({
          dayNumber: it.day || it.dayNumber,
          title: it.title,
          description: it.description,
          accommodation: it.accommodation || null,
          meals: it.meals || null,
          activities: (it.activities || []).filter((a: any) => a.title?.trim() !== ''),
        })),
        dates: formData.dates.filter((d: any) => d.startDate !== "").map((d: any) => ({
          startDate: d.startDate,
          endDate: d.endDate,
          price: Number(d.price) || Number(formData.price.amount),
        })),
      };

      await tripService.createTrip(payload);
      alert("Trip created successfully!");
      router.push("/vendor/trips");
    } catch (err: any) {
      console.error("Creation error:", err);
      alert(err.response?.data?.message || "Failed to create trip.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12 max-w-3xl mx-auto">
      {[1, 2, 3, 4, 5].map((i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${
              step >= i ? 'bg-amber-400 text-black shadow-lg shadow-amber-200' : 'bg-white text-gray-300 border border-gray-100'
            }`}>
              {step > i ? <Check className="w-5 h-5" /> : i}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${step >= i ? 'text-gray-900' : 'text-gray-300'}`}>
              {i === 1 ? 'Basic' : i === 2 ? 'Logistics' : i === 3 ? 'Details' : i === 4 ? 'Plan' : 'Final'}
            </span>
          </div>
          {i < 5 && <div className={`flex-1 h-px mx-2 ${step > i ? 'bg-amber-400' : 'bg-gray-100'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      <main className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12 space-y-2">
          <h1 className="text-4xl font-black tracking-tight uppercase">Launch Your Journey</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fill in the details to publish your next big trip</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white border border-gray-100 rounded-[48px] shadow-2xl shadow-gray-200/50 p-12">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trip Title</label>
                  <div className="relative flex items-center">
                    <input 
                      name="title" value={formData.title} onChange={handleChange}
                      className="w-full h-14 pl-6 pr-24 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-amber-400 font-bold transition-all text-sm"
                      placeholder="e.g., Hidden Gems of Spiti Valley"
                    />
                    {formData.title?.trim().length > 3 && (
                      <button
                        type="button"
                        onClick={handleAIGenerate}
                        disabled={isGeneratingAI}
                        title="Auto-fill description with AI"
                        className="absolute right-2 h-10 px-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-[10px] uppercase tracking-wide rounded-2xl shrink-0 hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait shadow-md shadow-purple-200 animate-in fade-in slide-in-from-right-2"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isGeneratingAI ? 'AI...' : 'Fill'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Category</label>
                  <div className="flex flex-wrap gap-2 px-2">
                    {(formData.category || []).map((cat: string) => (
                      <span key={cat} className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2">
                        {cat}
                        <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, category: prev.category.filter((c: string) => c !== cat) }))} className="hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      list="categories-list"
                      placeholder="Type or select a genre (press Enter to add)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim().toLowerCase();
                          if (val && !(formData.category || []).includes(val)) {
                            setFormData((prev: any) => ({ ...prev, category: [...(prev.category || []), val] }));
                          }
                          e.currentTarget.value = "";
                        }
                      }}
                      className="flex-1 h-14 px-6 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-amber-400 font-bold transition-all text-sm"
                    />
                    <datalist id="categories-list">
                      {CATEGORIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                    <button 
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLInputElement;
                        const val = input?.value?.trim().toLowerCase();
                        if (val && !(formData.category || []).includes(val)) {
                          setFormData((prev: any) => ({ ...prev, category: [...(prev.category || []), val] }));
                        }
                        if (input) input.value = "";
                      }}
                      className="h-14 px-6 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-3xl shrink-0 hover:bg-amber-500 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Short Catchphrase</label>
                <input 
                  name="shortDescription" value={formData.shortDescription} onChange={handleChange}
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-amber-400 font-bold transition-all text-sm"
                  placeholder="Summarize the vibe in one sentence..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trip Blueprint (Detailed Description)</label>
                <textarea 
                  name="description" value={formData.description} onChange={handleChange}
                  className="w-full h-40 p-6 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-amber-400 font-bold transition-all text-sm resize-none"
                  placeholder="Tell the story of this trip. What makes it special?"
                />
              </div>
            </div>
          )}

          {/* Step 2: Logistics */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destination City</label>
                  <input 
                    name="location.city" value={formData.location.city} onChange={handleChange}
                    list="city-suggestions"
                    autoComplete="off"
                    className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-3xl"
                    placeholder="e.g., Manali"
                  />
                  <datalist id="city-suggestions">
                    {POPULAR_DESTINATIONS.map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Difficulty</label>
                    <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, difficulty: prev.difficulty === 'none' ? 'moderate' : 'none' }))} className={`w-8 h-4 rounded-full transition-all flex items-center px-0.5 ${formData.difficulty !== 'none' ? 'bg-amber-400 justify-end' : 'bg-gray-200 justify-start'}`}><div className="w-3 h-3 bg-white rounded-full shadow" /></button>
                  </div>
                  {formData.difficulty !== 'none' ? (
                    <select 
                      name="difficulty" value={formData.difficulty} onChange={handleChange}
                      className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-3xl font-black uppercase text-xs"
                    >
                      {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  ) : (
                    <div className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-3xl flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Hidden
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Days</label>
                  <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} name="duration.days" value={formData.duration.days} onChange={handleChange} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase">Nights</label>
                  <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} name="duration.nights" value={formData.duration.nights} onChange={handleChange} className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl font-bold" />
                </div>
              </div>

              {/* Customizable Toggle */}
              <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Customizable Itinerary</p>
                  <p className="text-[10px] font-bold text-amber-700 mt-1">Allow travellers to see this trip as &ldquo;Customizable&rdquo;</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, isCustomizable: !prev.isCustomizable }))}
                  className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${
                    formData.isCustomizable ? 'bg-amber-400 justify-end' : 'bg-gray-200 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow" />
                </button>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup Points (e.g. New Delhi - Terminal 3)</label>
                    <button onClick={() => addArrayField('pickupLocations')} className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Add Point</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {formData.pickupLocations.map((p: string, i: number) => (
                     <div key={i} className="relative">
                       <input 
                         value={p} onChange={(e) => {
                           const newArr = [...formData.pickupLocations];
                           newArr[i] = e.target.value;
                           setFormData((prev: any) => ({ ...prev, pickupLocations: newArr }));
                         }}
                         list="city-suggestions"
                         autoComplete="off"
                         className="w-full h-12 pl-4 pr-12 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-amber-400 focus:bg-white transition-all"
                         placeholder="Pickup point..."
                       />
                       <button onClick={() => removeArrayField(i, 'pickupLocations')} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destinations Covered (Traveling Locations)</label>
                    <button onClick={() => addArrayField('travelingLocations')} className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Add Location</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {formData.travelingLocations.map((t: string, i: number) => (
                     <div key={i} className="relative">
                       <input 
                         value={t} onChange={(e) => {
                           const newArr = [...formData.travelingLocations];
                           newArr[i] = e.target.value;
                           setFormData((prev: any) => ({ ...prev, travelingLocations: newArr }));
                         }}
                         list="city-suggestions"
                         autoComplete="off"
                         className="w-full h-12 pl-4 pr-14 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-amber-400 focus:bg-white transition-all"
                         placeholder="e.g., Sissu"
                       />
                       <button onClick={() => removeArrayField(i, 'travelingLocations')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {/* Step 3: Highlights & Inclusions */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Highlights (USP)</label>
                   <button onClick={() => addArrayField('highlights')} className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Add Highlight</button>
                </div>
                {formData.highlights.map((h: string, i: number) => (
                  <div key={i} className="relative">
                    <input 
                      value={h} onChange={(e) => handleArrayChange(i, e.target.value, 'highlights')}
                      className="w-full h-12 pl-4 pr-14 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:border-amber-400 focus:bg-white transition-all"
                      placeholder={`Highlight #${i+1}`}
                    />
                    {formData.highlights.length > 1 && <button onClick={() => removeArrayField(i, 'highlights')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>}
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inclusions (What's included?)</label>
                   <button onClick={() => addArrayField('inclusions')} className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Add Inclusion</button>
                </div>
                {formData.inclusions.map((inc: string, i: number) => (
                  <div key={i} className="relative">
                    <input 
                      value={inc} onChange={(e) => handleArrayChange(i, e.target.value, 'inclusions')}
                      className="w-full h-12 pl-4 pr-14 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:border-amber-400 focus:bg-white transition-all"
                      placeholder={`Inclusion #${i+1}`}
                    />
                    {formData.inclusions.length > 1 && <button onClick={() => removeArrayField(i, 'inclusions')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exclusions (What's NOT included?)</label>
                   <button onClick={() => addArrayField('exclusions')} className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Add Exclusion</button>
                </div>
                {formData.exclusions.map((exc: string, i: number) => (
                  <div key={i} className="relative">
                    <input 
                      value={exc} onChange={(e) => {
                        const newArr = [...formData.exclusions];
                        newArr[i] = e.target.value;
                        setFormData((prev: any) => ({ ...prev, exclusions: newArr }));
                      }}
                      className="w-full h-12 pl-4 pr-14 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:border-amber-400 focus:bg-white transition-all"
                      placeholder={`Exclusion #${i+1}`}
                    />
                    {formData.exclusions.length > 1 && <button onClick={() => removeArrayField(i, 'exclusions')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Itinerary */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Day-by-Day Experience</label>
                   <button onClick={() => addArrayField('itinerary')} className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Add Day</button>
                </div>
                <div className="space-y-6">
                   {formData.itinerary.map((day: any, i: number) => (
                     <div key={i} className="bg-gray-50 border border-gray-100 rounded-3xl p-6 relative group">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black text-sm">D{day.day}</div>
                           <input 
                             placeholder="Title for this day..."
                             value={day.title} 
                             onChange={(e) => handleItineraryChange(i, 'title', e.target.value)}
                             className="flex-1 h-12 px-6 bg-white border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:border-amber-400"
                           />
                           {formData.itinerary.length > 1 && <button onClick={() => removeArrayField(i, 'itinerary')} className="text-red-400 p-2"><Trash2 className="w-4 h-4"/></button>}
                        </div>
                        <textarea 
                          placeholder="What will travelers do on this day?"
                          value={day.description} 
                          onChange={(e) => handleItineraryChange(i, 'description', e.target.value)}
                          className="w-full h-24 p-4 bg-white border border-gray-100 rounded-2xl font-bold text-xs outline-none focus:border-amber-400 resize-none ml-14 w-[calc(100%-56px)]"
                        />

                        {/* Accommodation */}
                        <div className="mt-3 ml-14">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Accommodation</label>
                          <input
                            placeholder="e.g., Hotel / Camp / Homestay at Manali"
                            value={day.accommodation || ''}
                            onChange={(e) => handleItineraryChange(i, 'accommodation', e.target.value)}
                            className="w-full h-10 px-4 bg-white border border-gray-100 rounded-xl font-bold text-xs outline-none focus:border-amber-400 mt-1"
                          />
                        </div>

                        {/* Meals */}
                        <div className="mt-3 ml-14 flex items-center gap-4">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Meals:</span>
                          {['breakfast', 'lunch', 'dinner'].map((meal) => (
                            <label key={meal} className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.meals?.[meal] || false}
                                onChange={(e) => {
                                  const newMeals = { ...(day.meals || { breakfast: false, lunch: false, dinner: false }), [meal]: e.target.checked };
                                  handleItineraryChange(i, 'meals', newMeals);
                                }}
                                className="w-3.5 h-3.5 rounded accent-amber-500"
                              />
                              <span className="text-[10px] font-bold text-gray-600 capitalize">{meal}</span>
                            </label>
                          ))}
                        </div>

                        {/* Activities */}
                        <div className="mt-3 ml-14">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Activities</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newItinerary = [...formData.itinerary];
                                const activities = [...(newItinerary[i].activities || []), { title: '', description: '' }];
                                newItinerary[i] = { ...newItinerary[i], activities };
                                setFormData((prev: any) => ({ ...prev, itinerary: newItinerary }));
                              }}
                              className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          </div>
                          {(day.activities || []).map((act: any, actIdx: number) => (
                            <div key={actIdx} className="flex gap-2 mb-2">
                              <input
                                placeholder="Activity title"
                                value={act.title}
                                onChange={(e) => {
                                  const newItinerary = [...formData.itinerary];
                                  const activities = [...newItinerary[i].activities];
                                  activities[actIdx] = { ...activities[actIdx], title: e.target.value };
                                  newItinerary[i] = { ...newItinerary[i], activities };
                                  setFormData((prev: any) => ({ ...prev, itinerary: newItinerary }));
                                }}
                                className="flex-1 h-9 px-3 bg-white border border-gray-100 rounded-lg text-xs font-bold outline-none focus:border-amber-400"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newItinerary = [...formData.itinerary];
                                  const activities = newItinerary[i].activities.filter((_: any, idx: number) => idx !== actIdx);
                                  newItinerary[i] = { ...newItinerary[i], activities };
                                  setFormData((prev: any) => ({ ...prev, itinerary: newItinerary }));
                                }}
                                className="text-red-400 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                     </div>
                   ))}
                </div>
            </div>
          )}

          {/* Step 5: Pricing, Dates & Finalize */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <div className="flex items-center justify-between mb-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Occupancy & Transportation Pricing</label>
                       <button type="button" onClick={() => {
                         const newOpts = [...(formData.price.occupancyOptions || []), { type: "", price: 0 }];
                         setFormData((prev: any) => ({ ...prev, price: { ...prev.price, occupancyOptions: newOpts } }));
                       }} className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Add Option</button>
                     </div>
                     {(formData.price.occupancyOptions || []).map((opt: any, i: number) => (
                       <div key={i} className="flex flex-col md:flex-row gap-4 items-end mb-4">
                         <div className="space-y-2 flex-1 w-full md:w-auto">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Sharing Type</label>
                           <input value={opt.type} onChange={(e) => {
                             const newOpts = [...formData.price.occupancyOptions];
                             newOpts[i].type = e.target.value;
                             setFormData((prev: any) => ({ ...prev, price: { ...prev.price, occupancyOptions: newOpts } }));
                           }} className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold text-sm outline-none focus:border-amber-400" placeholder="e.g. Triple Sharing" />
                         </div>
                         <div className="space-y-2 w-full md:w-48">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (INR)</label>
                           <input 
                             type="number" 
                             max="9999999"
                             onInput={(e: any) => { if (e.target.value.length > 7) e.target.value = e.target.value.slice(0, 7) }}
                             value={opt.price} 
                             onChange={(e) => {
                               const newOpts = [...formData.price.occupancyOptions];
                               newOpts[i].price = e.target.value;
                               setFormData((prev: any) => ({ ...prev, price: { ...prev.price, occupancyOptions: newOpts }, ...(i === 0 ? { price: { ...prev.price, amount: e.target.value, occupancyOptions: newOpts } } : {}) }));
                             }} 
                             className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-3xl font-bold text-sm outline-none focus:border-amber-400" 
                           />
                         </div>
                         <button type="button" onClick={() => {
                           const newOpts = formData.price.occupancyOptions.filter((_: any, idx: number) => idx !== i);
                           setFormData((prev: any) => ({ ...prev, price: { ...prev.price, occupancyOptions: newOpts } }));
                         }} className="h-14 w-14 bg-red-50 text-red-400 rounded-3xl flex items-center justify-center mb-0 md:mb-0 shrink-0"><Trash2 className="w-4 h-4"/></button>
                       </div>
                     ))}
                     {(!formData.price.occupancyOptions || formData.price.occupancyOptions.length === 0) && (
                       <p className="text-[10px] text-gray-400 font-bold italic">Add at least one occupancy option (e.g. Double Sharing, Triple Sharing)</p>
                     )}
                     
                      {/* Discount per option */}
                      {(formData.price.occupancyOptions || []).length > 0 && (
                        <div className="space-y-2 mt-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount % (Optional — per option)</label>
                          {(formData.price.occupancyOptions || []).map((opt: any, i: number) => {
                            const base = Number(opt.price) || 0;
                            const disc = Number(opt.discountPercent) || 0;
                            const final = disc > 0 ? Math.round(base - (base * disc) / 100) : base;
                            return (
                              <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                                <span className="text-xs font-black text-gray-500 w-36 truncate">{opt.type || `Option ${i + 1}`}</span>
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-[10px] text-gray-400 font-bold">Discount</span>
                                  <input
                                    type="number"
                                    min="0" max="90"
                                    value={opt.discountPercent || ''}
                                    onWheel={(e) => (e.target as HTMLElement).blur()}
                                    onChange={(e) => {
                                      const newOpts = [...formData.price.occupancyOptions];
                                      newOpts[i] = { ...newOpts[i], discountPercent: e.target.value };
                                      setFormData((prev: any) => ({ ...prev, price: { ...prev.price, occupancyOptions: newOpts } }));
                                    }}
                                    className="w-16 h-8 px-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none focus:border-amber-400 text-center"
                                    placeholder="0"
                                  />
                                  <span className="text-[10px] text-gray-400 font-bold">%</span>
                                </div>
                                {disc > 0 ? (
                                  <div className="text-right">
                                    <span className="text-[10px] text-gray-400 line-through">₹{base.toLocaleString()}</span>
                                    <span className="text-sm font-black text-emerald-600 ml-2">₹{final.toLocaleString()}</span>
                                  </div>
                                ) : (
                                  <span className="text-sm font-black text-gray-700">₹{base.toLocaleString()}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                     
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thumbnail Image URL</label>
                     <div className="space-y-3">
                        <textarea 
                          name="thumbnail.url" value={formData.thumbnail.url} onChange={handleChange}
                          className="w-full h-24 p-4 px-6 bg-gray-50 border border-gray-100 rounded-3xl font-bold text-sm outline-none focus:border-amber-400 focus:bg-white transition-all resize-none"
                          placeholder="Describe image to generate with AI or paste URL..."
                        />
                        <div className="flex gap-2">
                          <label className="flex-1 h-12 px-4 bg-amber-400 text-black rounded-2xl flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-amber-500 transition-colors shadow-sm">
                            <UploadCloud className="w-5 h-5 mr-2" /> Upload Image
                            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                 if (e.target.files && e.target.files[0]) {
                                   const toastId = toast.loading("Uploading image...");
                                   try {
                                     const file = e.target.files[0];
                                     const formDataObj = new FormData();
                                     formDataObj.append('media', file);
                                     formDataObj.append('type', 'thumbnail');
                                     const { axiosPrivate } = await import('@/lib/axios');
                                     const res = await axiosPrivate.post('/vendor/media/upload', formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });
                                     if (res.data.success) {
                                       setFormData((prev: any) => ({ ...prev, thumbnail: { url: res.data.data.url } }));
                                       toast.update(toastId, { render: "Image uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
                                     }
                                   } catch(err) { toast.update(toastId, { render: "Upload failed", type: "error", isLoading: false, autoClose: 3000 }); }
                                 }
                               }}/>
                          </label>
                          <button type="button" onClick={generateTripImage} disabled={isGeneratingImage} className="flex-1 h-12 px-4 bg-amber-400 text-black font-bold text-sm rounded-2xl whitespace-nowrap hover:bg-amber-500 transition-colors disabled:opacity-50">
                            {isGeneratingImage ? "Generating..." : "Generate"}
                          </button>
                        </div>
                     </div>
                     {formData.thumbnail.url && formData.thumbnail.url.startsWith('http') && (
                        <div className="mt-2 ml-2">
                          <img src={formData.thumbnail.url} alt="Thumbnail preview" className="h-20 object-cover rounded-xl border border-gray-200" />
                        </div>
                     )}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Route Map Image URL</label>
                     <div className="space-y-3">
                        <textarea 
                          name="routeMapImage.url" value={formData.routeMapImage?.url || ''} onChange={handleChange}
                          className="w-full h-24 p-4 px-6 bg-gray-50 border border-gray-100 rounded-3xl font-bold text-sm outline-none focus:border-amber-400 focus:bg-white transition-all resize-none"
                          placeholder="Describe map to generate with AI or paste URL..."
                        />
                        <div className="flex gap-2">
                          <label className="flex-1 h-12 px-4 bg-amber-400 text-black rounded-2xl flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-amber-500 transition-colors shadow-sm">
                            <UploadCloud className="w-5 h-5 mr-2" /> Upload Image
                            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                 if (e.target.files && e.target.files[0]) {
                                   const toastId = toast.loading("Uploading map...");
                                   try {
                                     const file = e.target.files[0];
                                     const formDataObj = new FormData();
                                     formDataObj.append('media', file);
                                     formDataObj.append('type', 'routemap');
                                     const { axiosPrivate } = await import('@/lib/axios');
                                     const res = await axiosPrivate.post('/vendor/media/upload', formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });
                                     if (res.data.success) {
                                       setFormData((prev: any) => ({ ...prev, routeMapImage: { url: res.data.data.url } }));
                                       toast.update(toastId, { render: "Map uploaded!", type: "success", isLoading: false, autoClose: 3000 });
                                     }
                                   } catch(err) { toast.update(toastId, { render: "Upload failed", type: "error", isLoading: false, autoClose: 3000 }); }
                                 }
                               }}/>
                          </label>
                          <button type="button" onClick={generateRouteMap} disabled={isGeneratingMap} className="flex-1 h-12 px-4 bg-amber-400 text-black font-bold text-sm rounded-2xl whitespace-nowrap hover:bg-amber-500 transition-colors disabled:opacity-50">
                            {isGeneratingMap ? "Generating..." : "Generate"}
                          </button>
                        </div>
                     </div>
                     {formData.routeMapImage?.url && formData.routeMapImage.url.startsWith('http') && (
                        <div className="mt-2 ml-2">
                          <img src={formData.routeMapImage.url} alt="Map preview" className="h-20 object-cover rounded-xl border border-gray-200" />
                        </div>
                     )}
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trip Disclaimer / Important Notice</label>
                     <textarea 
                       name="importantNote" value={formData.importantNote} onChange={handleChange}
                       className="w-full h-14 p-4 px-6 bg-gray-50 border border-gray-100 rounded-3xl font-bold text-sm outline-none focus:border-amber-400 resize-none"
                       placeholder="Emergency caveats, weather notes, etc."
                     />
                   </div>
                </div>

                <div className="space-y-2 md:w-1/2 pr-0 md:pr-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">WhatsApp Contact Number</label>
                  <div className="relative">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                     <input 
                       name="contactWhatsApp" value={formData.contactWhatsApp} onChange={handleChange}
                       className="w-full h-14 pl-12 pr-6 bg-gray-50 border border-gray-100 rounded-3xl font-bold text-sm"
                       placeholder="e.g. 919876543210"
                     />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departure Dates</label>
                     <button onClick={() => addArrayField('dates')} className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Add Batch</button>
                  </div>
                  {formData.dates.map((d: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-gray-400 uppercase">Start Date</label>
                          <input type="date" value={d.startDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => {
                            handleDateChange(i, 'startDate', e.target.value);
                            // Auto-adjust end date if it's before start date
                            if (d.endDate && e.target.value > d.endDate) {
                              handleDateChange(i, 'endDate', e.target.value);
                            }
                          }} className="w-full h-10 px-3 bg-white border border-gray-100 rounded-xl text-xs font-bold" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[8px] font-black text-gray-400 uppercase">End Date</label>
                          <input type="date" value={d.endDate} min={d.startDate || new Date().toISOString().split('T')[0]} onChange={(e) => handleDateChange(i, 'endDate', e.target.value)} className="w-full h-10 px-3 bg-white border border-gray-100 rounded-xl text-xs font-bold" />
                       </div>
                       <div className="flex items-end gap-2">
                          <div className="space-y-1 flex-1">
                            <label className="text-[8px] font-black text-gray-400 uppercase">Price (INR)</label>
                            <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} value={d.price} onChange={(e) => handleDateChange(i, 'price', e.target.value)} className="w-full h-10 px-3 bg-white border border-gray-100 rounded-xl text-xs font-bold" />
                          </div>
                          {formData.dates.length > 1 && <button onClick={() => removeArrayField(i, 'dates')} className="p-2.5 text-red-400"><Trash2 className="w-4 h-4"/></button>}
                       </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-amber-50 rounded-[32px] border border-amber-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-400 text-black rounded-2xl flex items-center justify-center">
                         <Info className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-xs font-black uppercase text-amber-900 tracking-widest">Trip visibility</p>
                         <p className="text-[10px] font-bold text-amber-700 uppercase">Control if this trip is live on the marketplace</p>
                      </div>
                   </div>
                   <select 
                     name="status" value={formData.status} onChange={handleChange}
                     className="h-12 px-6 bg-white border border-amber-200 rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-amber-400"
                   >
                     <option value="draft">Save as Draft</option>
                     <option value="published">Publish Now</option>
                   </select>
                </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-50">
            <button 
              onClick={() => { if (step > 1) { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
              disabled={step === 1}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all hover:text-amber-500 disabled:opacity-0"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            
            {step < 5 ? (
              <PrimaryButton onClick={() => { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="h-14 px-10 font-black uppercase tracking-widest shadow-xl">
                Continue <ChevronRight className="ml-2 w-5 h-5" />
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={handleSubmit} disabled={loading} className="h-14 px-10 font-black uppercase tracking-widest shadow-xl bg-gray-900 text-white hover:bg-black">
                {loading ? "Publishing..." : "Launch Trip"} <Check className="ml-2 w-5 h-5" />
              </PrimaryButton>
            )}
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default TripCreationPage;


