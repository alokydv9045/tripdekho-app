"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { tripService } from "@/services/tripService";
import { aiService } from "@/services/aiService";
import { POPULAR_DESTINATIONS } from "@/components/shared/cityData";

import { 
  ChevronRight, ChevronLeft, MapPin, 
  Calendar, Info, DollarSign, Image as ImageIcon,
  Check, List, Layers, Plus, Trash2, Clock, Phone, Route, UploadCloud, Sparkles
} from "lucide-react";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { toast } from "react-toastify";

const CATEGORIES = ['adventure', 'cultural', 'religious', 'nature', 'beach', 'mountain', 'wildlife', 'heritage', 'wellness', 'other', 'offbeat', 'hike', 'spiritual', 'multiple'];
const DIFFICULTIES = ['easy', 'moderate', 'challenging', 'extreme'];

const TripEditPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    price: { amount: 0, currency: "INR", originalPrice: 0 },
    highlights: ["", "", ""],
    inclusions: ["", "", ""],
    exclusions: ["", "", ""],
    pickupLocations: ["", "", ""],
    travelingLocations: ["", "", ""],
    thumbnail: { url: "" },
    routeMapImage: { url: "" },
    importantNote: "",
    contactWhatsApp: "",
    dates: [{ startDate: "", endDate: "", price: 0, seats: 20 }],
    itinerary: [{ day: 1, title: "", description: "", accommodation: "", meals: { breakfast: false, lunch: false, dinner: false }, activities: [] }],
    isCustomizable: false,
    status: "draft"
  });

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await tripService.getTripById(id as string);
        const trip = response.data;
        
        const formattedDates = trip.dates?.map((d: any) => ({
          ...d,
          startDate: d.startDate ? new Date(d.startDate).toISOString().split('T')[0] : "",
          endDate: d.endDate ? new Date(d.endDate).toISOString().split('T')[0] : "",
          seats: d.availableSeats != null ? d.availableSeats : d.seats
        })) || [{ startDate: "", endDate: "", price: 0, seats: 20 }];

        setFormData({
          ...trip,
          category: Array.isArray(trip.category) ? trip.category : (trip.category ? (typeof trip.category === 'string' ? trip.category.split(',').map((c: string) => c.trim()) : [trip.category]) : ["adventure"]),
          price: trip.price || { amount: 0, currency: "INR", originalPrice: 0 },
          duration: { days: trip.durationDays || 1, nights: trip.durationNights || 0 },
          location: trip.location || { city: "", state: "", country: "", address: "" },
          groupSize: { min: trip.minGroupSize || 1, max: trip.maxGroupSize || 10 },
          highlights: trip.highlights?.length ? trip.highlights : ["", "", ""],
          inclusions: trip.inclusions?.length ? trip.inclusions : ["", "", ""],
          exclusions: trip.exclusions?.length ? trip.exclusions : ["", "", ""],
          pickupLocations: trip.pickupLocations?.length ? trip.pickupLocations : ["", "", ""],
          travelingLocations: trip.travelingLocations?.length ? trip.travelingLocations : ["", "", ""],
          thumbnail: trip.thumbnail || { url: "" },
          routeMapImage: trip.routeMapImage || { url: "" },
          importantNote: trip.importantNote || "",
          contactWhatsApp: trip.contactWhatsApp || "",
          isCustomizable: trip.isCustomizable || false,
          dates: formattedDates,
          itinerary: trip.itinerary?.length ? trip.itinerary.map((it: any) => ({
            day: it.dayNumber || it.day,
            title: it.title,
            description: it.description || '',
            accommodation: it.accommodation || '',
            meals: it.meals || { breakfast: false, lunch: false, dinner: false },
            activities: it.activities || [],
          })) : [{ day: 1, title: "", description: "", accommodation: "", meals: { breakfast: false, lunch: false, dinner: false }, activities: [] }]
        });
      } catch (err) {
        console.error("Error fetching trip:", err);
        toast.error("Failed to load trip data.");
        router.push("/vendor/trips");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id, router]);

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

  const handleArrayChange = (index: number, value: string, field: string) => {
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

  const addArrayField = (field: string) => {
    if (field === 'itinerary') {
        const nextDay = formData.itinerary.length + 1;
        setFormData((prev: any) => ({ ...prev, itinerary: [...prev.itinerary, { day: nextDay, title: "", description: "", accommodation: "", meals: { breakfast: false, lunch: false, dinner: false }, activities: [] }] }));
    } else if (field === 'dates') {
        setFormData((prev: any) => ({ ...prev, dates: [...prev.dates, { startDate: "", endDate: "", price: formData.price.amount, seats: 20 }] }));
    } else {
        setFormData((prev: any) => ({ ...prev, [field]: [...prev[field], ""] }));
    }
  };

  const removeArrayField = (index: number, field: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: prev[field].filter((_: any, i: number) => i !== index) }));
  };

  const generateRouteMap = async () => {
    const prompt = formData.routeMapImage?.url || formData.title;
    if (!prompt) {
      toast.warning("Please type a prompt, or enter Trip Title first.");
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
        toast.success("Route map generated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate route map.");
    } finally {
      setIsGeneratingMap(false);
    }
  };

  const generateTripImage = async () => {
    const prompt = formData.thumbnail?.url || formData.title;
    if (!prompt) {
      toast.warning("Please type a prompt, or enter a title first");
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
        toast.success("Trip image generated successfully!");
      }
    } catch (error) {
      toast.error("Failed to generate trip image");
      console.error(error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
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
        durationDays: Number(formData.duration?.days ?? 1),
        durationNights: Number(formData.duration?.nights ?? 0),
        location: {
          ...(formData.location?.id?.trim() ? { id: formData.location.id } : {}),
          city: formData.location.city,
          state: formData.location.state,
          country: formData.location.country,
          address: formData.location.address,
        },
        price: { 
          ...(formData.price?.id?.trim() ? { id: formData.price.id } : {}),
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
          ...(it.id?.trim() ? { id: it.id } : {}),
          dayNumber: it.day || it.dayNumber,
          title: it.title,
          description: it.description,
          accommodation: it.accommodation || null,
          meals: it.meals || null,
          activities: (it.activities || []).filter((a: any) => a.title?.trim() !== ''),
        })),
        dates: formData.dates.filter((d: any) => d.startDate !== "").map((d: any) => ({
          ...(d.id?.trim() ? { id: d.id } : {}),
          startDate: d.startDate,
          endDate: d.endDate,
          price: Number(d.price) || Number(formData.price.amount),
          totalSeats: Number(d.seats || d.totalSeats),
        })),
      };

      await tripService.updateTrip(id as string, payload);
      toast.success("Trip updated successfully!");
      router.push("/vendor/trips");
    } catch (err: any) {
      console.error("Update error:", err);
      const msg = err.response?.data?.message;
      if (Array.isArray(msg) && msg.length > 0) {
        toast.error(msg[0]);
        const errStr = msg[0].toLowerCase();
        if (errStr.includes('duration') || errStr.includes('group') || errStr.includes('location') || errStr.includes('title')) {
          setStep(1);
        } else if (errStr.includes('itinerary') || errStr.includes('highlight') || errStr.includes('inclusion') || errStr.includes('exclusion')) {
          setStep(2);
        } else if (errStr.includes('price') || errStr.includes('date') || errStr.includes('seat')) {
          setStep(3);
        }
      } else {
        toast.error(msg || "Failed to update trip.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto px-4">
      {[
        { num: 1, label: 'Trip Identity' },
        { num: 2, label: 'The Experience' },
        { num: 3, label: 'Availability & Pricing' }
      ].map((s, idx) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-lg font-black transition-all duration-300 ${
              step >= s.num ? 'bg-amber-400 text-black shadow-xl shadow-amber-400/30 -translate-y-1' : 'bg-white text-gray-400 border-2 border-gray-100 shadow-sm'
            }`}>
              {step > s.num ? <Check className="w-7 h-7" /> : s.num}
            </div>
            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
          {idx < 2 && <div className={`flex-1 h-1.5 mx-4 rounded-full transition-all duration-500 ${step > s.num ? 'bg-amber-400' : 'bg-gray-100'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  if (loading) return <PremiumLoader />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans pb-32">
      <main className="max-w-5xl mx-auto px-4 pt-20">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-black tracking-tight uppercase">Edit Trip</h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-sm">Modifying: <span className="text-amber-500">{formData.title}</span></p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white border-2 border-gray-100 rounded-[48px] shadow-2xl shadow-gray-200/50 p-10 md:p-14">
          
          {/* STEP 1: TRIP IDENTITY */}
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
              
              <div className="space-y-6">
                 <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                   <MapPin className="w-6 h-6 text-amber-500" /> Basic Details
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Trip Title</label>
                     <div className="relative flex items-center">
                       <input 
                         name="title" value={formData.title} onChange={handleChange}
                         className="w-full h-16 pl-6 pr-24 bg-gray-50/50 border-2 border-gray-100 rounded-3xl outline-none focus:border-amber-400 focus:bg-white font-black transition-all text-base text-gray-900"
                       />
                       {formData.title?.trim().length > 3 && (
                         <button
                           type="button"
                           onClick={handleAIGenerate}
                           disabled={isGeneratingAI}
                           title="Auto-fill description with AI"
                           className="absolute right-2 h-12 px-4 bg-gradient-to-r from-amber-400 to-orange-400 text-black font-black text-[11px] uppercase tracking-wide rounded-2xl shrink-0 hover:from-amber-500 hover:to-orange-500 transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait shadow-sm shadow-amber-200/50 animate-in fade-in slide-in-from-right-2"
                         >
                           <Sparkles className="w-4 h-4" />
                           {isGeneratingAI ? 'AI...' : 'Fill'}
                         </button>
                       )}
                     </div>
                   </div>
                   <div className="space-y-3">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Category (Multiple)</label>
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
                         list="categories-list-edit"
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
                         className="flex-1 h-16 px-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl outline-none focus:border-amber-400 focus:bg-white font-bold transition-all text-sm text-gray-900"
                       />
                       <datalist id="categories-list-edit">
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
                         className="h-16 px-6 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-3xl shrink-0 hover:bg-amber-500 transition-colors"
                       >
                         Add
                       </button>
                     </div>
                   </div>
                 </div>
                 
                 <div className="space-y-3">
                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Short Catchphrase</label>
                   <input 
                     name="shortDescription" value={formData.shortDescription} onChange={handleChange}
                     className="w-full h-16 px-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl outline-none focus:border-amber-400 focus:bg-white font-bold transition-all text-base text-gray-900"
                   />
                 </div>
                 
                 <div className="space-y-3">
                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Trip Blueprint (Detailed Description)</label>
                   <textarea 
                     name="description" value={formData.description} onChange={handleChange}
                     className="w-full h-48 p-6 bg-gray-50/50 border-2 border-gray-100 rounded-[32px] outline-none focus:border-amber-400 focus:bg-white font-bold transition-all text-base text-gray-900 resize-none leading-relaxed"
                   />
                 </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-6">
                 <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                   <Clock className="w-6 h-6 text-amber-500" /> Trip Logistics
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Destination City</label>
                     <input 
                       name="location.city" value={formData.location.city} onChange={handleChange}
                       list="city-suggestions-edit"
                       autoComplete="off"
                       className="w-full h-16 px-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl font-black text-base focus:bg-white focus:border-amber-400 outline-none transition-all"
                     />
                     <datalist id="city-suggestions-edit">
                       {POPULAR_DESTINATIONS.map(city => (
                         <option key={city} value={city} />
                       ))}
                     </datalist>
                   </div>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Difficulty</label>
                       <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, difficulty: prev.difficulty === 'none' ? 'moderate' : 'none' }))} className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${formData.difficulty !== 'none' ? 'bg-amber-400 justify-end' : 'bg-gray-200 justify-start'}`}><div className="w-4 h-4 bg-white rounded-full shadow" /></button>
                     </div>
                     {formData.difficulty !== 'none' ? (
                       <select 
                         name="difficulty" value={formData.difficulty} onChange={handleChange}
                         className="w-full h-16 px-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl font-black uppercase tracking-widest text-sm focus:bg-white focus:border-amber-400 outline-none transition-all cursor-pointer"
                       >
                         {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                     ) : (
                       <div className="w-full h-16 px-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl flex items-center font-black uppercase tracking-widest text-xs text-gray-400">
                         Hidden
                       </div>
                     )}
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Days</label>
                     <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} name="duration.days" value={formData.duration.days} onChange={handleChange} className="w-full h-16 px-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl font-black text-lg focus:bg-white focus:border-amber-400 outline-none transition-all text-center" />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Nights</label>
                     <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} name="duration.nights" value={formData.duration.nights} onChange={handleChange} className="w-full h-16 px-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl font-black text-lg focus:bg-white focus:border-amber-400 outline-none transition-all text-center" />
                   </div>
                 </div>
              </div>

              <hr className="border-gray-100" />
              
              <div className="space-y-8">
                 <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                   <Route className="w-6 h-6 text-amber-500" /> Locations & Maps
                 </h2>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Pickup Points</label>
                       <button onClick={() => addArrayField('pickupLocations')} className="text-[11px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus className="w-4 h-4" /> Add Point</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.pickupLocations.map((p: string, i: number) => (
                        <div key={i} className="relative">
                          <input 
                            value={p} onChange={(e) => handleArrayChange(i, e.target.value, 'pickupLocations')}
                            list="city-suggestions-edit"
                            autoComplete="off"
                            placeholder="e.g. Delhi ISBT"
                            className="w-full h-14 pl-6 pr-14 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-base font-bold focus:bg-white focus:border-amber-400 outline-none transition-all"
                          />
                          <button onClick={() => removeArrayField(i, 'pickupLocations')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Destinations Covered</label>
                       <button onClick={() => addArrayField('travelingLocations')} className="text-[11px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus className="w-4 h-4" /> Add Location</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.travelingLocations.map((t: string, i: number) => (
                        <div key={i} className="relative">
                          <input 
                            value={t} onChange={(e) => handleArrayChange(i, e.target.value, 'travelingLocations')}
                            list="city-suggestions-edit"
                            autoComplete="off"
                            placeholder="e.g. Manali"
                            className="w-full h-14 pl-6 pr-16 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-base font-bold focus:bg-white focus:border-amber-400 outline-none transition-all"
                          />
                          <button onClick={() => removeArrayField(i, 'travelingLocations')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors shrink-0">
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                     <div className="space-y-3">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Thumbnail Image URL</label>
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
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Route Map Image URL</label>
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
                                        toast.update(toastId, { render: "Map uploaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
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
                 </div>
              </div>
            </div>
          )}

          {/* STEP 2: THE EXPERIENCE */}
          {step === 2 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
              
              <div className="space-y-8">
                 <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                   <Layers className="w-6 h-6 text-amber-500" /> Key Details
                 </h2>
                 
                 <div className="space-y-4">
                   <div className="flex items-center justify-between px-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Highlights (USP)</label>
                      <button onClick={() => addArrayField('highlights')} className="text-[11px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-1"><Plus className="w-4 h-4" /> Add Highlight</button>
                   </div>
                   <div className="space-y-3">
                         {formData.highlights.map((h: string, i: number) => (
                           <div key={i} className="relative">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 z-10" />
                             <input 
                               value={h} onChange={(e) => handleArrayChange(i, e.target.value, 'highlights')}
                               className="w-full h-14 pl-12 pr-14 bg-gray-50/50 border-2 border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:border-amber-400 outline-none transition-all"
                               placeholder={`Highlight #${i+1}`}
                             />
                             {formData.highlights.length > 1 && <button onClick={() => removeArrayField(i, 'highlights')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>}
                           </div>
                         ))}
                       </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                     <div className="flex items-center justify-between px-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Inclusions</label>
                        <button onClick={() => addArrayField('inclusions')} className="text-[11px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
                     </div>
                     <div className="space-y-3">
                         {formData.inclusions.map((inc: string, i: number) => (
                           <div key={i} className="relative">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center z-10"><Check className="w-2.5 h-2.5" /></div>
                             <input 
                               value={inc} onChange={(e) => handleArrayChange(i, e.target.value, 'inclusions')}
                               className="w-full h-14 pl-12 pr-14 bg-gray-50/50 border-2 border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:border-amber-400 outline-none transition-all"
                               placeholder={`Inclusion #${i+1}`}
                             />
                             {formData.inclusions.length > 1 && <button onClick={() => removeArrayField(i, 'inclusions')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>}
                           </div>
                         ))}
                       </div>
                   </div>

                   <div className="space-y-4">
                     <div className="flex items-center justify-between px-2">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Exclusions</label>
                        <button onClick={() => addArrayField('exclusions')} className="text-[11px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
                     </div>
                     <div className="space-y-3">
                         {formData.exclusions.map((exc: string, i: number) => (
                           <div key={i} className="relative">
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-400 z-10" />
                             <input 
                               value={exc} onChange={(e) => handleArrayChange(i, e.target.value, 'exclusions')}
                               className="w-full h-14 pl-12 pr-14 bg-gray-50/50 border-2 border-gray-100 rounded-2xl font-bold text-sm focus:bg-white focus:border-amber-400 outline-none transition-all"
                               placeholder={`Exclusion #${i+1}`}
                             />
                             {formData.exclusions.length > 1 && <button onClick={() => removeArrayField(i, 'exclusions')} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>}
                           </div>
                         ))}
                       </div>
                   </div>
                 </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-8">
                 <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                      <List className="w-6 h-6 text-amber-500" /> Day-by-Day Itinerary
                    </h2>
                    <button onClick={() => addArrayField('itinerary')} className="text-xs font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl transition-colors"><Plus className="w-4 h-4" /> Add Day</button>
                 </div>
                 
                 <div className="space-y-8">
                    {formData.itinerary.map((day: any, i: number) => (
                      <div key={i} className="bg-gray-50/50 border-2 border-gray-100 rounded-[32px] p-8 relative group">
                         
                         <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gray-900 text-white rounded-[20px] flex items-center justify-center font-black text-lg shadow-lg shrink-0">D{day.day}</div>
                            <input 
                              placeholder="Title for this day..."
                              value={day.title} 
                              onChange={(e) => handleItineraryChange(i, 'title', e.target.value)}
                              className="flex-1 h-14 px-6 bg-white border-2 border-gray-100 rounded-2xl font-black text-base outline-none focus:border-amber-400 transition-all"
                            />
                            {formData.itinerary.length > 1 && (
                              <button onClick={() => removeArrayField(i, 'itinerary')} className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"><Trash2 className="w-5 h-5"/></button>
                            )}
                         </div>
                         
                         <div className="ml-0 sm:ml-18 space-y-6 pl-0 sm:pl-2">
                           <div className="space-y-2">
                             <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Description</label>
                             <textarea 
                               placeholder="What will travelers do on this day?"
                               value={day.description} 
                               onChange={(e) => handleItineraryChange(i, 'description', e.target.value)}
                               className="w-full h-32 p-5 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm outline-none focus:border-amber-400 resize-none transition-all leading-relaxed"
                             />
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                               <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Accommodation</label>
                               <input
                                 placeholder="e.g., Hotel / Camp at Manali"
                                 value={day.accommodation || ''}
                                 onChange={(e) => handleItineraryChange(i, 'accommodation', e.target.value)}
                                 className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm outline-none focus:border-amber-400 transition-all"
                               />
                             </div>

                             <div className="space-y-3">
                               <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2 block">Included Meals</label>
                               <div className="flex flex-wrap items-center gap-6 h-14 bg-white border-2 border-gray-100 rounded-2xl px-6">
                                 {['breakfast', 'lunch', 'dinner'].map((meal) => (
                                   <label key={meal} className="flex items-center gap-2 cursor-pointer group/meal">
                                     <input
                                       type="checkbox"
                                       checked={day.meals?.[meal] || false}
                                       onChange={(e) => {
                                         const newMeals = { ...(day.meals || { breakfast: false, lunch: false, dinner: false }), [meal]: e.target.checked };
                                         handleItineraryChange(i, 'meals', newMeals);
                                       }}
                                       className="w-5 h-5 rounded-md border-2 border-gray-200 accent-amber-500 cursor-pointer"
                                     />
                                     <span className="text-xs font-black text-gray-500 group-hover/meal:text-gray-900 uppercase tracking-wider transition-colors">{meal}</span>
                                   </label>
                                 ))}
                               </div>
                             </div>
                           </div>

                           {/* Activities */}
                           <div className="space-y-3 bg-white p-5 border-2 border-gray-100 rounded-2xl">
                             <div className="flex items-center justify-between">
                               <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Key Activities</span>
                               <button
                                 type="button"
                                 onClick={() => {
                                   const newItinerary = [...formData.itinerary];
                                   const activities = [...(newItinerary[i].activities || []), { title: '', description: '' }];
                                   newItinerary[i] = { ...newItinerary[i], activities };
                                   setFormData((prev: any) => ({ ...prev, itinerary: newItinerary }));
                                 }}
                                 className="text-[10px] font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-1 transition-colors bg-amber-50 px-3 py-1.5 rounded-lg"
                               >
                                 <Plus className="w-3 h-3" /> Add Activity
                               </button>
                             </div>
                             {(day.activities || []).map((act: any, actIdx: number) => (
                               <div key={actIdx} className="flex gap-3 mt-3">
                                 <input
                                   placeholder="Activity title (e.g. Paragliding)"
                                   value={act.title}
                                   onChange={(e) => {
                                     const newItinerary = [...formData.itinerary];
                                     const activities = [...newItinerary[i].activities];
                                     activities[actIdx] = { ...activities[actIdx], title: e.target.value };
                                     newItinerary[i] = { ...newItinerary[i], activities };
                                     setFormData((prev: any) => ({ ...prev, itinerary: newItinerary }));
                                   }}
                                   className="flex-1 h-12 px-4 bg-gray-50/50 border-2 border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-amber-400 transition-all"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => {
                                     const newItinerary = [...formData.itinerary];
                                     const activities = newItinerary[i].activities.filter((_: any, idx: number) => idx !== actIdx);
                                     newItinerary[i] = { ...newItinerary[i], activities };
                                     setFormData((prev: any) => ({ ...prev, itinerary: newItinerary }));
                                   }}
                                   className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </div>
                             ))}
                             {!(day.activities?.length) && <p className="text-xs font-bold text-gray-300 italic pt-2">No special activities added for this day.</p>}
                           </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <hr className="border-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Important Notice / Terms</label>
                  <textarea 
                    name="importantNote" value={formData.importantNote} onChange={handleChange}
                    className="w-full h-32 p-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl font-bold text-sm outline-none focus:border-amber-400 focus:bg-white resize-none transition-all leading-relaxed"
                    placeholder="Any special terms or conditions for this trip..."
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">WhatsApp Contact Number</label>
                  <div className="relative">
                     <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                     <input 
                       name="contactWhatsApp" value={formData.contactWhatsApp} onChange={handleChange}
                       className="w-full h-16 pl-14 pr-6 bg-gray-50/50 border-2 border-gray-100 rounded-3xl font-black text-base focus:bg-white focus:border-amber-400 outline-none transition-all"
                       placeholder="e.g. 919876543210"
                     />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AVAILABILITY & PUBLISHING */}
          {step === 3 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                       <DollarSign className="w-6 h-6 text-amber-500" /> Occupancy & Transportation Pricing
                     </h2>
                     <button type="button" onClick={() => {
                       const newOpts = [...(formData.price.occupancyOptions || []), { type: "", price: 0 }];
                       setFormData((prev: any) => ({ ...prev, price: { ...prev.price, occupancyOptions: newOpts } }));
                     }} className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"><Plus className="w-4 h-4" /> Add Option</button>
                   </div>
                   <div className="space-y-4">
                     {(formData.price.occupancyOptions || []).map((opt: any, i: number) => (
                       <div key={i} className="flex flex-col md:flex-row gap-4 items-end bg-gray-50/50 p-6 rounded-3xl border-2 border-gray-100">
                         <div className="space-y-2 flex-1 w-full md:w-auto">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Room Sharing Type</label>
                           <input value={opt.type} onChange={(e) => {
                             const newOpts = [...formData.price.occupancyOptions];
                             newOpts[i].type = e.target.value;
                             setFormData((prev: any) => ({ ...prev, price: { ...prev.price, occupancyOptions: newOpts } }));
                           }} className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-amber-400" placeholder="e.g. Triple Sharing" />
                         </div>
                         <div className="space-y-2 w-full md:w-48">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Price (INR)</label>
                           <input 
                             type="number"
                             max="99999"
                             onInput={(e: any) => { if (e.target.value.length > 5) e.target.value = e.target.value.slice(0, 5) }} 
                             value={opt.price} 
                             onChange={(e) => {
                               const newOpts = [...formData.price.occupancyOptions];
                               newOpts[i].price = e.target.value;
                               setFormData((prev: any) => ({ ...prev, price: { ...prev.price, occupancyOptions: newOpts }, ...(i === 0 ? { price: { ...prev.price, amount: e.target.value, occupancyOptions: newOpts } } : {}) }));
                             }} 
                             className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-amber-400" 
                           />
                         </div>

                         <button type="button" onClick={() => {
                           const newOpts = formData.price.occupancyOptions.filter((_: any, idx: number) => idx !== i);
                           setFormData((prev: any) => ({ ...prev, price: { ...prev.price, occupancyOptions: newOpts } }));
                         }} className="h-14 w-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-0 md:mb-0 shrink-0 hover:bg-red-100 transition-colors"><Trash2 className="w-5 h-5"/></button>
                       </div>
                     ))}
                     {(!formData.price.occupancyOptions || formData.price.occupancyOptions.length === 0) && (
                       <p className="text-[11px] text-gray-400 font-bold italic ml-2">Add at least one occupancy option (e.g. Double Sharing, Triple Sharing)</p>
                     )}
                     
                      {/* Discount per option */}
                      {(formData.price.occupancyOptions || []).length > 0 && (
                        <div className="space-y-2 mt-4">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Discount % (Optional — per option)</label>
                          {(formData.price.occupancyOptions || []).map((opt: any, i: number) => {
                            const base = Number(opt.price) || 0;
                            const disc = Number(opt.discountPercent) || 0;
                            const final = disc > 0 ? Math.round(base - (base * disc) / 100) : base;
                            return (
                              <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-3xl px-6 py-4">
                                <span className="text-sm font-black text-gray-500 w-40 truncate">{opt.type || `Option ${i + 1}`}</span>
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-[11px] text-gray-400 font-bold">Discount</span>
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
                                    className="w-20 h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-amber-400 text-center"
                                    placeholder="0"
                                  />
                                  <span className="text-[11px] text-gray-400 font-bold">%</span>
                                </div>
                                {disc > 0 ? (
                                  <div className="text-right">
                                    <span className="text-xs text-gray-400 line-through">₹{base.toLocaleString()}</span>
                                    <span className="text-base font-black text-emerald-600 ml-3">₹{final.toLocaleString()}</span>
                                  </div>
                                ) : (
                                  <span className="text-base font-black text-gray-700">₹{base.toLocaleString()}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                </div>

                <hr className="border-gray-100" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                       <Calendar className="w-6 h-6 text-amber-500" /> Departure Batches
                     </h2>
                     <button onClick={() => addArrayField('dates')} className="text-xs font-black text-amber-500 hover:text-amber-600 uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl transition-colors"><Plus className="w-4 h-4" /> Add Batch</button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.dates.map((d: any, i: number) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-gray-50/50 p-6 rounded-3xl border-2 border-gray-100 items-end group">
                         <div className="space-y-2 md:col-span-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Start Date</label>
                            <input type="date" value={d.startDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => {
                              handleDateChange(i, 'startDate', e.target.value);
                              if (d.endDate && e.target.value > d.endDate) {
                                handleDateChange(i, 'endDate', e.target.value);
                              }
                            }} className="w-full h-14 px-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-black focus:border-amber-400 outline-none transition-all text-gray-700 uppercase" />
                         </div>
                         <div className="space-y-2 md:col-span-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">End Date</label>
                            <input type="date" value={d.endDate} min={d.startDate || new Date().toISOString().split('T')[0]} onChange={(e) => handleDateChange(i, 'endDate', e.target.value)} className="w-full h-14 px-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-black focus:border-amber-400 outline-none transition-all text-gray-700 uppercase" />
                         </div>
                         <div className="space-y-2 md:col-span-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Batch Price</label>
                            <input type="number" onWheel={(e) => (e.target as HTMLElement).blur()} value={d.price} onChange={(e) => handleDateChange(i, 'price', e.target.value)} className="w-full h-14 px-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-black focus:border-amber-400 outline-none transition-all" />
                         </div>
                         <div className="md:col-span-1 flex justify-end h-14">
                            <button onClick={() => removeArrayField(i, 'dates')} className="w-full h-full bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-5 h-5"/></button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-amber-50 rounded-[32px] border-2 border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-amber-400 text-black rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20">
                         <Info className="w-8 h-8" />
                      </div>
                      <div>
                         <p className="text-base font-black uppercase text-amber-900 tracking-widest mb-1">Trip Visibility</p>
                         <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Control if this trip is live on the marketplace</p>
                      </div>
                   </div>
                   <select 
                     name="status" value={formData.status} onChange={handleChange}
                     className="w-full sm:w-auto h-16 px-8 bg-white border-2 border-amber-200 rounded-2xl font-black text-sm uppercase tracking-[0.2em] cursor-pointer outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all text-amber-900 shadow-sm"
                   >
                     <option value="draft">Save as Draft</option>
                     <option value="published">Publish Now</option>
                   </select>
                </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-10 border-t-2 border-gray-100">
            <button 
              onClick={() => { if (step > 1) { setStep(step - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
              disabled={step === 1}
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all hover:text-amber-500 disabled:opacity-0"
            >
              <ChevronLeft className="w-5 h-5" /> Previous Step
            </button>
            
            {step < 3 ? (
              <PrimaryButton onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(step + 1); }} className="w-full sm:w-auto h-16 px-12 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-400/30 rounded-2xl">
                Continue <ChevronRight className="ml-3 w-5 h-5" />
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={handleSubmit} disabled={submitting} className="w-full sm:w-auto h-16 px-12 text-sm font-black uppercase tracking-[0.2em] shadow-2xl rounded-2xl bg-gray-900 text-white hover:bg-black border border-gray-800 disabled:opacity-70 disabled:cursor-not-allowed">
                {submitting ? "Saving changes..." : "Save & Finish"} <Check className="ml-3 w-5 h-5" />
              </PrimaryButton>
            )}
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default TripEditPage;
