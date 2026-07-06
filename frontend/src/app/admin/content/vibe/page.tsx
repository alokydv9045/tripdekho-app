'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Instagram, Save, Trash2, ArrowUp, ArrowDown, 
  Edit3, MapPin, Link as LinkIcon, UploadCloud, X, Image as ImageIcon
} from 'lucide-react';
import { cmsService } from '@/services/cmsService';
import { toast } from 'sonner';

interface VibeReel {
  id: string;
  title: string;
  instagramUrl: string;
  thumbnail: string;
  location: string;
  isActive: boolean;
  order: number;
}

const emptyForm = {
  title: '',
  instagramUrl: '',
  thumbnail: '',
  location: '',
  isActive: true,
};

export default function VibeManagementPage() {
  const [videos, setVideos] = useState<VibeReel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await cmsService.getVlogs();
      if (res.success) {
        const sorted = (res.data as VibeReel[]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setVideos(sorted);
      }
    } catch (error) {
      toast.error('Failed to fetch reels');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('type', 'thumbnail');
      const { axiosPrivate } = await import('@/lib/axios');
      const res = await axiosPrivate.post('/vendor/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setForm(prev => ({ ...prev, thumbnail: res.data.data.url }));
        toast.success('Thumbnail uploaded');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.instagramUrl && !form.thumbnail) {
      toast.error('Please provide an Instagram URL or upload a thumbnail');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const res = await cmsService.updateVlog(editingId, form);
        if (res.success) toast.success('Reel updated');
      } else {
        const res = await cmsService.createVlog({
          ...form,
          category: 'Adventure',
          isFeatured: false,
        });
        if (res.success) toast.success('Reel published');
      }
      resetForm();
      fetchVideos();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (video: VibeReel) => {
    setEditingId(video.id);
    setForm({
      title: video.title || '',
      instagramUrl: video.instagramUrl || '',
      thumbnail: video.thumbnail || '',
      location: video.location || '',
      isActive: video.isActive ?? true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this reel?')) return;
    try {
      const res = await cmsService.deleteVlog(id);
      if (res.success) {
        setVideos(videos.filter(v => v.id !== id));
        toast.success('Reel removed');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleToggleActive = async (id: string, currentValue: boolean) => {
    try {
      await cmsService.updateVlog(id, { isActive: !currentValue });
      setVideos(videos.map(v => v.id === id ? { ...v, isActive: !currentValue } : v));
      toast.success(!currentValue ? 'Reel activated' : 'Reel hidden');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newVideos = [...videos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newVideos.length) return;

    const temp = newVideos[index];
    newVideos[index] = newVideos[targetIndex];
    newVideos[targetIndex] = temp;

    const orders = newVideos.map((v, i) => ({ id: v.id, order: i }));
    setVideos(newVideos);

    try {
      await cmsService.reorderVibeVideos(orders);
      toast.success('Order saved');
    } catch (error) {
      toast.error('Reordering failed');
      fetchVideos();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-black uppercase italic tracking-tighter">Vibe Control</h1>
          <p className="text-gray-500 font-medium text-sm mt-1 uppercase tracking-widest">Manage Homepage Instagram Reels — Vibe With Us</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Editor Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl space-y-6 sticky top-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl">
                <Instagram size={20} />
              </div>
              <h2 className="text-lg font-black uppercase italic">{editingId ? 'Edit Reel' : 'Add New Reel'}</h2>
            </div>

            <div className="space-y-4">
              {/* Instagram URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Instagram Reel Link</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="https://www.instagram.com/reel/ABC123/"
                    value={form.instagramUrl}
                    onChange={(e) => setForm({...form, instagramUrl: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-pink-500 transition-all pl-12"
                  />
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Reel Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Sunset in Manali"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Location Tag</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Manali, Himachal Pradesh"
                    value={form.location}
                    onChange={(e) => setForm({...form, location: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all pl-12"
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cover Thumbnail</label>
                {form.thumbnail ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100">
                    <img src={form.thumbnail} alt="Thumbnail" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, thumbnail: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
                    ) : (
                      <>
                        <UploadCloud size={24} className="text-gray-300 mb-2" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload to MinIO</span>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleThumbnailUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] bg-black text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Syncing...' : editingId ? <><Save size={16} /> Update Reel</> : <><Plus size={16} /> Publish Reel</>}
              </button>
            </div>
          </form>
        </div>

        {/* Live List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black uppercase italic">Arrangement Order</h2>
                <span className="px-4 py-2 bg-gray-50 text-[10px] font-black uppercase text-gray-400 rounded-full">{videos.length} Reels</span>
             </div>

             <div className="space-y-4">
               {isLoading ? (
                 <div className="py-20 text-center animate-pulse text-gray-300 font-black uppercase text-xs tracking-widest">Loading Reels...</div>
               ) : videos.length === 0 ? (
                 <div className="py-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest border-2 border-dashed border-gray-100 rounded-3xl">No reels added yet — add your first one!</div>
               ) : (
                 videos.map((video, index) => (
                   <motion.div 
                     layout
                     key={video.id}
                     className={`flex items-center gap-4 p-4 rounded-[24px] group border transition-all ${
                       video.isActive 
                         ? 'bg-gray-50 border-transparent hover:border-gray-200 hover:bg-white' 
                         : 'bg-red-50/50 border-red-100 opacity-60'
                     }`}
                   >
                     {/* Preview */}
                     <div className="w-16 h-24 bg-gray-200 rounded-xl overflow-hidden relative flex-shrink-0">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                             <Instagram size={20} />
                          </div>
                        )}
                     </div>

                     {/* Info */}
                     <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-black uppercase truncate">{video.title || 'Untitled Reel'}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                           <MapPin size={10} /> {video.location || 'Unknown Location'}
                        </p>
                        {video.instagramUrl && (
                          <p className="text-[10px] font-bold text-pink-400 truncate mt-1 flex items-center gap-1">
                            <Instagram size={10} /> {video.instagramUrl.replace('https://www.instagram.com/', '').replace('https://instagram.com/', '')}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                           <span className={`px-2 py-1 text-[8px] font-black uppercase rounded-md ${video.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                             {video.isActive ? 'Live' : 'Hidden'}
                           </span>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex items-center gap-2">
                        {/* Order Arrows */}
                        <div className="flex flex-col gap-1 mr-2 border-r border-gray-200 pr-3">
                           <button 
                             onClick={() => handleMove(index, 'up')}
                             disabled={index === 0}
                             className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black disabled:opacity-30 transition-all"
                           >
                             <ArrowUp size={14} />
                           </button>
                           <button 
                             onClick={() => handleMove(index, 'down')}
                             disabled={index === videos.length - 1}
                             className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black disabled:opacity-30 transition-all"
                           >
                             <ArrowDown size={14} />
                           </button>
                        </div>

                        {/* Toggle Active */}
                        <button 
                          onClick={() => handleToggleActive(video.id, video.isActive)}
                          className={`p-3 rounded-2xl transition-all ${video.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                          title={video.isActive ? 'Hide from homepage' : 'Show on homepage'}
                        >
                          {video.isActive ? <ImageIcon size={18} /> : <X size={18} />}
                        </button>

                        {/* Edit */}
                        <button 
                          onClick={() => handleEdit(video)}
                          className="p-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all"
                        >
                           <Edit3 size={18} />
                        </button>

                        {/* Delete */}
                        <button 
                          onClick={() => handleDelete(video.id)}
                          className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                     </div>
                   </motion.div>
                 ))
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
