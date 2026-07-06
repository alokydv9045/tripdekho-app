'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Sparkles, Youtube, Instagram } from 'lucide-react';
import { VlogVideo } from './vlogData';
import VlogHero from './VlogHero';
import VlogRow from './VlogRow';
import VlogCard from './VlogCard';
import VideoModal from './VideoModal';
import Header from '@/components/Header';
import { axiosPublic } from "@/lib/axios";

const VlogPageContent = () => {
  const [vlogs, setVlogs] = useState<VlogVideo[]>([]);
  const [groupedVlogs, setGroupedVlogs] = useState<Record<string, VlogVideo[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<any | null>(null);

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vlogsRes, groupedRes, catRes, settingsRes] = await Promise.all([
          axiosPublic.get('/cms/vlogs'),
          axiosPublic.get('/cms/vlogs', { params: { grouped: true } }),
          axiosPublic.get('/cms/vlogs/categories'),
          axiosPublic.get('/cms/settings')
        ]);

        if (vlogsRes.data.success) setVlogs(vlogsRes.data.data);
        if (groupedRes.data.success) setGroupedVlogs(groupedRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (settingsRes.data.success) setSettings(settingsRes.data.data);
        
      } catch (error) {
        console.error('Vlog data fetch failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredVlogs = useMemo(() => {
    return vlogs.filter(v => {
      const matchesCategory = selectedCategory === 'all' || (v.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = (v.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (v.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [vlogs, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <VlogHero />

      {/* Discovery Section */}
      <section id="vlog-content" className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-10">
              <div className="max-w-2xl">
                 <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Discovery Engine
                 </span>
                 <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                    Browse the <span className="text-amber-500">Global</span> <br /> Feed
                 </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                 <div className="relative w-full sm:w-80 group">
                    <input 
                      type="text" 
                      placeholder="Search Destination..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-14 pl-12 pr-6 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold uppercase tracking-widest outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                 </div>
                 
                 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        selectedCategory === 'all' 
                          ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/20' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                       All Feed
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          selectedCategory === cat 
                            ? 'bg-amber-500 text-black shadow-xl shadow-amber-500/20' 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                         {cat}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Dynamic View Logic */}
           <div className="space-y-32">
              {searchQuery || selectedCategory !== 'all' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[400px]">
                   <AnimatePresence mode="popLayout">
                      {filteredVlogs.map((video) => (
                        <VlogCard 
                          key={video.id} 
                          video={video} 
                          onPlay={setActiveVideo} 
                        />
                      ))}
                   </AnimatePresence>
                   {filteredVlogs.length === 0 && (
                     <div className="col-span-full py-40 text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                           <Filter className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No stories match your filter</p>
                     </div>
                   )}
                </div>
              ) : (
                <>
                   {/* Top Featured Row */}
                   {vlogs.some(v => v.isFeatured) && (
                     <VlogRow title="Featured Adventures" videos={vlogs.filter(v => v.isFeatured)} onPlay={setActiveVideo} />
                   )}
                   
                   {/* Dynamic Category Rows */}
                   {Object.entries(groupedVlogs).map(([category, videos]) => (
                     <VlogRow 
                       key={category} 
                       title={`${category} Vibes`} 
                       videos={videos} 
                       onPlay={setActiveVideo} 
                     />
                   ))}
                </>
              )}
           </div>
        </div>
      </section>

      {/* Creator Spotlight */}
      <section className="py-24 bg-[#FFFBF0] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Featured Creators
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9]">
                Creator <span className="text-amber-500">Spotlight</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(settings?.creatorSpotlight || []).map((creator: any, i: number) => (
              <div key={i} className="bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
                <div className={`h-32 bg-gradient-to-br ${creator.cover} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=40&w=400)', backgroundSize: 'cover' }} />
                  <div className="w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center text-black font-black text-3xl border-4 border-white shadow-xl translate-y-10 relative z-10">
                    {creator.avatar}
                  </div>
                </div>
                <div className="p-8 pt-14 text-center">
                  <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">{creator.name}</h3>
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">{creator.handle}</p>
                  <p className="text-gray-400 text-xs font-bold mb-6">{creator.specialty}</p>
                  <div className="flex justify-center gap-6 text-center">
                    <div>
                      <p className="font-black text-gray-900 text-lg">{creator.subs}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Followers</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community / Subscribe Strip */}
      <section className="relative py-32 overflow-hidden">
         {/* Background image */}
         <div className="absolute inset-0">
           <img
             src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=60&w=2000&auto=format&fit=crop"
             className="w-full h-full object-cover"
             alt="Mountain vista"
           />
           <div className="absolute inset-0 bg-gray-950/85" />
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8 block">Join The Movement</span>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
               Join Our <span className="text-amber-500">Visual</span> <br /> Community
            </h2>
            <p className="text-gray-400 font-medium max-w-xl mx-auto mb-16 leading-relaxed">
              Follow along for daily travel inspiration, behind-the-scenes stories, and exclusive destination reveals.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
               <a href={settings?.socialLinks?.youtube || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="h-16 px-10 bg-[#FF0000] text-white rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform shadow-2xl shadow-red-500/30">
                  <Youtube className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[8px] font-bold uppercase opacity-70">Subscribe</p>
                    <p className="text-xs font-black uppercase tracking-widest">YouTube</p>
                  </div>
               </a>
               <a href={settings?.socialLinks?.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="h-16 px-10 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white rounded-2xl flex items-center gap-4 hover:scale-105 transition-transform shadow-2xl">
                  <Instagram className="w-6 h-6" />
                  <div className="text-left">
                    <p className="text-[8px] font-bold uppercase opacity-70">Follow Us</p>
                    <p className="text-xs font-black uppercase tracking-widest">Instagram</p>
                  </div>
               </a>
            </div>
         </div>
      </section>

      <VideoModal 
        video={activeVideo} 
        onClose={() => setActiveVideo(null)} 
      />
    </div>
  );
};

export default VlogPageContent;
