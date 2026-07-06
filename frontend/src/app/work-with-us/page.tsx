"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ArrowRight, X, Heart, Globe, Zap, Users, Loader2, FileText, Send } from 'lucide-react';
import { careersService, CareerPosition } from '@/services/careersService';
import Header from '@/components/Header';
import { toast } from 'sonner';

export default function WorkWithUsPage() {
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [gallery, setGallery] = useState<{id: string, imageUrl: string, sortOrder: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<CareerPosition | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resumeUrl: '',
    coverLetter: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [posData, galData] = await Promise.all([
        careersService.getActivePositions(),
        careersService.getGalleryImages().catch(() => ({ images: [] }))
      ]);
      setPositions(posData.positions || []);
      setGallery(galData.images || []);
    } catch (error) {
      toast.error('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await careersService.submitApplication({
        ...formData,
        positionId: selectedJob?.id,
      });
      toast.success('Application submitted successfully! We will get back to you soon.');
      setSelectedJob(null);
      setFormData({ name: '', email: '', phone: '', resumeUrl: '', coverLetter: '' });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="bg-white overflow-hidden relative pt-16 md:pt-24">
        <div className="max-w-[1224px] w-full mx-auto px-4 xl:px-0 pb-16 lg:pb-24">
          <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-10 flex flex-col items-center lg:items-start lg:mb-0 relative z-10"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center lg:text-left text-5xl md:text-6xl font-black pb-4 text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-lora, serif)' }}
              >
                Join Our <span className="text-amber-500 italic">Dream Team</span>
              </motion.h1>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl font-bold text-center lg:text-left pb-6 text-gray-600"
              >
                Live your best life; <span className="text-amber-500">Live it now!</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-gray-500 text-center max-w-lg lg:text-left text-lg leading-relaxed"
              >
                The ultimate travel platform is run by a close-knit team of travellers, creators, and hustlers. Put young, passionate, party-loving people together. Give them an uninhibited environment to ideate and execute. Add the spirit of following your heart. That's TripDekho for you.
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                className="shrink-0 h-14 whitespace-nowrap flex items-center text-white justify-center font-bold transition-colors bg-amber-500 hover:bg-amber-400 mt-8 w-fit px-8 cursor-pointer shadow-xl shadow-amber-500/20" 
                style={{ borderRadius: '16px', clipPath: 'path("M 176 0 c 11.2357 0 16.8535 0 20.8891 2.6965 a 16 16 0 0 1 4.4144 4.4144 c 2.6965 4.0356 2.6965 9.6534 2.6965 20.8891 L 204 28 c 0 11.2357 0 16.8535 -2.6965 20.8891 a 16 16 0 0 1 -4.4144 4.4144 c -4.0356 2.6965 -9.6534 2.6965 -20.8891 2.6965 L 28 56 c -11.2357 0 -16.8535 0 -20.8891 -2.6965 a 16 16 0 0 1 -4.4144 -4.4144 c -2.6965 -4.0356 -2.6965 -9.6534 -2.6965 -20.8891 L 0 28 c 0 -11.2357 0 -16.8535 2.6965 -20.8891 a 16 16 0 0 1 4.4144 -4.4144 c 4.0356 -2.6965 9.6534 -2.6965 20.8891 -2.6965 Z")' }}
              >
                View Open Positions
              </motion.button>
            </motion.div>
            
            {/* Right Images (Zostel squircle style) */}
            <div className="flex flex-col items-center md:items-end gap-4 -ml-12 md:-ml-0 relative">
              <div className="flex items-end justify-center space-x-4 lg:justify-start">
                <div style={{ position: 'relative' }}>
                  <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -5 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, type: "spring", bounce: 0.4 }} className="w-48 h-56 group" style={{ overflow: 'hidden', display: 'block', position: 'relative', borderRadius: '16px', clipPath: 'path("M 160 0 c 15.0849 0 22.6274 0 27.3137 4.6863 a 16 16 0 0 1 0 0 c 4.6863 4.6863 4.6863 12.2288 4.6863 27.3137 L 192 192 c 0 15.0849 0 22.6274 -4.6863 27.3137 a 16 16 0 0 1 0 0 c -4.6863 4.6863 -12.2288 4.6863 -27.3137 4.6863 L 32 224 c -15.0849 0 -22.6274 0 -27.3137 -4.6863 a 16 16 0 0 1 0 0 c -4.6863 -4.6863 -4.6863 -12.2288 -4.6863 -27.3137 L 0 32 c 0 -15.0849 0 -22.6274 4.6863 -27.3137 a 16 16 0 0 1 0 0 c 4.6863 -4.6863 12.2288 -4.6863 27.3137 -4.6863 Z")' }}>
                    <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} src="https://proxy.cdn.zostel.com/branding/career/zostel-join-us.jpg?w=360" alt="TripDekho Team 1" loading="lazy" className="w-48 h-56 object-cover" style={{ visibility: 'visible', display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                </div>
                <div style={{ position: 'relative' }}>
                  <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 5 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }} className="w-40 h-48 group" style={{ overflow: 'hidden', display: 'block', position: 'relative', borderRadius: '16px', clipPath: 'path("M 128 0 c 15.0849 0 22.6274 0 27.3137 4.6863 a 16 16 0 0 1 0 0 c 4.6863 4.6863 4.6863 12.2288 4.6863 27.3137 L 160 160 c 0 15.0849 0 22.6274 -4.6863 27.3137 a 16 16 0 0 1 0 0 c -4.6863 4.6863 -12.2288 4.6863 -27.3137 4.6863 L 32 192 c -15.0849 0 -22.6274 0 -27.3137 -4.6863 a 16 16 0 0 1 0 0 c -4.6863 -4.6863 -4.6863 -12.2288 -4.6863 -27.3137 L 0 32 c 0 -15.0849 0 -22.6274 4.6863 -27.3137 a 16 16 0 0 1 0 0 c 4.6863 -4.6863 12.2288 -4.6863 27.3137 -4.6863 Z")' }}>
                    <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} src="https://proxy.cdn.zostel.com/branding/career/zostel-career1_2.jpg?w=360" alt="TripDekho Team 2" loading="lazy" className="w-40 h-48 object-cover" style={{ visibility: 'visible', display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                </div>
              </div>
              <div className="flex items-start justify-center ml-12 space-x-4 lg:justify-start">
                <div style={{ position: 'relative' }}>
                  <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -5 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.4 }} className="w-40 h-48 group" style={{ overflow: 'hidden', display: 'block', position: 'relative', borderRadius: '16px', clipPath: 'path("M 128 0 c 15.0849 0 22.6274 0 27.3137 4.6863 a 16 16 0 0 1 0 0 c 4.6863 4.6863 4.6863 12.2288 4.6863 27.3137 L 160 160 c 0 15.0849 0 22.6274 -4.6863 27.3137 a 16 16 0 0 1 0 0 c -4.6863 4.6863 -12.2288 4.6863 -27.3137 4.6863 L 32 192 c -15.0849 0 -22.6274 0 -27.3137 -4.6863 a 16 16 0 0 1 0 0 c -4.6863 -4.6863 -4.6863 -12.2288 -4.6863 -27.3137 L 0 32 c 0 -15.0849 0 -22.6274 4.6863 -27.3137 a 16 16 0 0 1 0 0 c 4.6863 -4.6863 12.2288 -4.6863 27.3137 -4.6863 Z")' }}>
                    <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} src="https://proxy.cdn.zostel.com/branding/career/zostel-join-us3.jpg?w=360" alt="TripDekho Team 3" loading="lazy" className="w-40 h-48 object-cover" style={{ visibility: 'visible', display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                </div>
                <div style={{ position: 'relative' }}>
                  <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 5 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.4 }} className="w-48 h-56 group" style={{ overflow: 'hidden', display: 'block', position: 'relative', borderRadius: '16px', clipPath: 'path("M 160 0 c 15.0849 0 22.6274 0 27.3137 4.6863 a 16 16 0 0 1 0 0 c 4.6863 4.6863 4.6863 12.2288 4.6863 27.3137 L 192 192 c 0 15.0849 0 22.6274 -4.6863 27.3137 a 16 16 0 0 1 0 0 c -4.6863 4.6863 -12.2288 4.6863 -27.3137 4.6863 L 32 224 c -15.0849 0 -22.6274 0 -27.3137 -4.6863 a 16 16 0 0 1 0 0 c -4.6863 -4.6863 -4.6863 -12.2288 -4.6863 -27.3137 L 0 32 c 0 -15.0849 0 -22.6274 4.6863 -27.3137 a 16 16 0 0 1 0 0 c 4.6863 -4.6863 12.2288 -4.6863 27.3137 -4.6863 Z")' }}>
                    <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} src="https://proxy.cdn.zostel.com/branding/career/zostel-join-us1.jpg?w=360" alt="TripDekho Team 4" loading="lazy" className="w-48 h-56 object-cover" style={{ visibility: 'visible', display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                  </motion.div>
                </div>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.2, scale: 1 }} transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }} className="absolute -top-4 -right-4 w-32 h-32 bg-amber-400 rounded-full blur-2xl"></motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.2, scale: 1 }} transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }} className="absolute -bottom-4 -left-4 w-40 h-40 bg-pink-400 rounded-full blur-2xl"></motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-lora, serif)' }}>
              Why <span className="text-amber-500 italic">TripDekho?</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We take care of our people so they can take care of our travelers.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: 'Work Anywhere', desc: 'Remote-first culture with flexible hours.' },
              { icon: Zap, title: 'Fast Growth', desc: 'Accelerated career paths and learning budgets.' },
              { icon: Users, title: 'Great Culture', desc: 'Annual retreats and amazing teammates.' },
              { icon: Briefcase, title: 'Transportation System', desc: 'Join as a transportation partner and grow with us.' },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:bg-amber-50 transition-all">
                  <benefit.icon className="text-amber-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-lora, serif)' }}>
                Open <span className="text-amber-500 italic">Roles</span>
              </h2>
              <p className="text-gray-500">Find your next big opportunity.</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 shadow-sm">
              {positions.length} Positions Available
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-amber-500" size={40} />
            </div>
          ) : positions.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Open Roles Currently</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                We're not actively hiring right now, but we're always looking for great talent. Send us your resume anyway!
              </p>
              <button 
                onClick={() => setSelectedJob({ id: 'general', title: 'General Application', department: 'Any', location: 'Remote', type: 'full_time', description: '', isActive: true, createdAt: '' })}
                className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                Submit General Application
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {positions.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                  onClick={() => setSelectedJob(job)}
                >
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-amber-600 transition-colors mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-500">
                      <span className="bg-gray-50 px-3 py-1 rounded-lg">{job.department}</span>
                      <span className="bg-gray-50 px-3 py-1 rounded-lg">{job.location}</span>
                      <span className="bg-gray-50 px-3 py-1 rounded-lg capitalize">{job.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <button className="bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 w-fit">
                    Apply Now <ArrowRight size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Experience TripDekho Life Gallery */}
      <section className="py-24 bg-white text-black overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-lora, serif)' }}>
              Experience <span className="text-amber-500 italic">#TripDekho</span> Life
            </h2>
          </div>
          
          {/* Masonry Layout for images */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {(gallery.length > 0 ? gallery : [
              { id: 'd1', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80', sortOrder: 1 },
              { id: 'd2', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80', sortOrder: 2 },
              { id: 'd3', imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80', sortOrder: 3 },
              { id: 'd4', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80', sortOrder: 4 },
              { id: 'd5', imageUrl: 'https://images.unsplash.com/photo-1528148343865-51218c4a13e6?auto=format&fit=crop&q=80', sortOrder: 5 }
            ]).map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 5) * 0.1 }}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={img.imageUrl} 
                  alt={`TripDekho Life ${i+1}`} 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedJob(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-[600px] h-[90vh] md:h-auto max-h-[90vh] bg-white rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Applying For</p>
                  <h3 className="text-xl font-black">{selectedJob.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {selectedJob.description && selectedJob.id !== 'general' && (
                  <div className="mb-8 prose prose-sm max-w-none text-gray-600">
                    <h4 className="text-black font-bold text-base mb-2">Role Description</h4>
                    <div dangerouslySetInnerHTML={{ __html: selectedJob.description }} />
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({...formData, phone: val});
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      minLength={10}
                      pattern="[0-9]{10}"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Resume Link / Portfolio</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="url" 
                        value={formData.resumeUrl}
                        onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        placeholder="https://linkedin.com/in/yourprofile or Google Drive link"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Please provide a link to your resume or portfolio.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Cover Letter (Optional)</label>
                    <textarea 
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none"
                      placeholder="Tell us why you'd be a great fit..."
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-black text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <><Loader2 className="animate-spin" size={18} /> Submitting...</>
                      ) : (
                        <><Send size={18} /> Submit Application</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
