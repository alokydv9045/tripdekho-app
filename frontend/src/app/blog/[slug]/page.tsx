'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, User, Share2, Bookmark, Sparkles, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Blog } from '@/types/blog';
import PremiumLoader from '@/components/shared/PremiumLoader';
import DOMPurify from 'isomorphic-dompurify';

import { axiosPublic } from '@/lib/axios';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const [blogRes, recentRes] = await Promise.all([
          axiosPublic.get(`/cms/blogs/${slug}`),
          axiosPublic.get('/cms/blogs', { params: { limit: 4 } }),
        ]);
        if (blogRes.data.success) {
          setBlog(blogRes.data.data);
        } else {
           console.error("Blog not found");
        }
        if (recentRes.data.success) {
          // Filter out the current blog, take 3
          const others = (recentRes.data.data || []).filter((b: Blog) => b.slug !== slug);
          setRecentBlogs(others.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) return <PremiumLoader />;

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-12 h-12 text-amber-500 mb-6" />
        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Story Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">This chapter seems to have been lost in the mountains. Why not explore our latest stories?</p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-black transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const dateStr = blog.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
    : "Recently Published";

  const getImageUrl = (src: any) => {
    if (typeof src === 'string') return src;
    if (src && typeof src === 'object' && src.url) return src.url;
    return "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] pb-32">
      <Header />

      {/* Cinematic Hero */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={getImageUrl(blog.thumbnail || blog.image)}
            alt={blog.title}
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
             <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                  {blog.category || "Adventure"}
                </span>
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest border-l border-white/20 pl-3">
                  {blog.readTime || "5 MIN READ"}
                </span>
             </div>
             
             <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
               {blog.title}
             </h1>

             <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{dateStr}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <User className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Elite Guide</span>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative -mt-12 z-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Article Body */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-8 bg-white rounded-[40px] p-8 md:p-16 shadow-2xl shadow-gray-200/50"
          >
             <div 
               className="prose prose-lg prose-amber max-w-none font-medium text-gray-700 leading-relaxed space-y-6"
               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content || "") }}
             />
             
             <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <button className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all">
                      <MessageCircle className="w-5 h-5" />
                   </button>
                   <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Share your thoughts</span>
                </div>
                
                <div className="flex items-center gap-3">
                   <button className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                      <Share2 className="w-5 h-5" />
                   </button>
                   <button className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all">
                      <Bookmark className="w-5 h-5" />
                   </button>
                </div>
             </div>
          </motion.div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-10 h-fit lg:sticky lg:top-32">
             <div className="bg-black rounded-[40px] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-[60px]" />
                <Sparkles className="w-8 h-8 text-amber-500 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-none">Get the Full <br /> <span className="text-amber-500">Experience</span></h3>
                <p className="text-white/60 text-xs font-medium leading-relaxed mb-8">Join our elite community of travelers and get exclusive access to hidden gems and curated stories.</p>
                <button className="w-full py-4 bg-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                  Subscribe Now
                </button>
             </div>

             <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6 pb-4 border-b border-gray-50 flex items-center gap-2">
                   <Clock className="w-4 h-4 text-amber-500" /> Recent Tales
                </h3>
                <div className="space-y-6">
                   {recentBlogs.length > 0 ? recentBlogs.map((rb) => (
                      <div 
                        key={rb.id || rb.slug} 
                        className="flex gap-4 group cursor-pointer"
                        onClick={() => router.push(`/blog/${rb.slug}`)}
                      >
                         <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                            <Image
                              src={getImageUrl(rb.thumbnail || rb.image)}
                              alt={rb.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-amber-500 transition-colors line-clamp-2 uppercase leading-tight">{rb.title}</h4>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {rb.publishedAt ? new Date(rb.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                            </span>
                         </div>
                      </div>
                   )) : (
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center py-4">No other stories yet</p>
                   )}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="fixed bottom-10 left-10 z-50">
         <button 
           onClick={() => router.back()}
           className="h-14 w-14 rounded-full bg-white border border-gray-100 shadow-2xl flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all group"
         >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default BlogDetailPage;
