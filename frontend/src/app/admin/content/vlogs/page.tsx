'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Save, Trash2, Edit3, 
  Eye, EyeOff, Star, MapPin, Tag, ListFilter, Instagram, UploadCloud, X
} from 'lucide-react';
import { cmsService } from '@/services/cmsService';
import { adminService } from '@/services/adminService';
import { tripService } from '@/services/tripService';
import { toast } from 'sonner';

export default function VlogManagementPage() {
  const [vlogs, setVlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    instagramUrl: '',
    videoUrl: '',
    thumbnail: '',
    category: 'Adventure',
    location: '',
    duration: '',
    description: '',
    isFeatured: false,
    isActive: true,
    linkedTripId: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [creators, setCreators] = useState<any[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string>('');
  const [isUploadingTrailer, setIsUploadingTrailer] = useState(false);
  
  const [isSavingCreators, setIsSavingCreators] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<any>(null);

  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vlogsRes, catRes, settingsRes, tripsRes] = await Promise.all([
        cmsService.getVlogs(),
        cmsService.getVlogCategories(),
        cmsService.getSettings(),
        tripService.getAllTrips({ limit: 100 })
      ]);
      if (vlogsRes.success) setVlogs(vlogsRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (tripsRes && (tripsRes.data?.trips || tripsRes.trips)) {
        setTrips(tripsRes.data?.trips || tripsRes.trips);
      }
      
      if (settingsRes.success && settingsRes.data) {
        setGlobalSettings(settingsRes.data);
        setCreators((settingsRes.data.creatorSpotlight as any[]) || []);
        setTrailerUrl((settingsRes.data.vlogTrailerUrl as string) || '');
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'thumbnail' | 'video') => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('type', type);
      const { axiosPrivate } = await import('@/lib/axios');
      const res = await axiosPrivate.post('/vendor/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        if (type === 'thumbnail') {
          setForm(prev => ({ ...prev, thumbnail: res.data.data.url }));
        } else {
          setForm(prev => ({ ...prev, videoUrl: res.data.data.url }));
        }
        toast.success(`${type} uploaded to MinIO`);
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const res = await cmsService.updateVlog(editingId, form);
        if (res.success) toast.success('Vlog updated');
      } else {
        const res = await cmsService.createVlog(form);
        if (res.success) toast.success('Vlog published');
      }
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '', instagramUrl: '', videoUrl: '', thumbnail: '', category: 'Adventure',
      location: '', duration: '', description: '', isFeatured: false, isActive: true, linkedTripId: ''
    });
    setEditingId(null);
  };

  const handleEdit = (vlog: any) => {
    setEditingId(vlog.id);
    setForm({
      title: vlog.title || '',
      instagramUrl: vlog.instagramUrl || '',
      videoUrl: vlog.videoUrl || '',
      thumbnail: vlog.thumbnail || '',
      category: vlog.category || 'Adventure',
      location: vlog.location || '',
      duration: vlog.duration || '',
      description: vlog.description || '',
      isFeatured: vlog.isFeatured ?? false,
      isActive: vlog.isActive ?? true,
      linkedTripId: vlog.linkedTripId || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this vlog?')) return;
    try {
      const res = await cmsService.deleteVlog(id);
      if (res.success) {
        setVlogs(vlogs.filter(v => v.id !== id));
        toast.success('Vlog removed');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const toggleStatus = async (id: string, field: string, value: boolean) => {
    try {
      await cmsService.updateVlog(id, { [field]: !value });
      setVlogs(vlogs.map(v => v.id === id ? { ...v, [field]: !value } : v));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveCreators = async () => {
    setIsSavingCreators(true);
    try {
      await cmsService.updateSettings({ creatorSpotlight: creators });
      toast.success('Creator Spotlight updated');
    } catch (error: any) {
      console.error('Save creators error:', error?.response?.data || error);
      toast.error('Failed to update creators');
    } finally {
      setIsSavingCreators(false);
    }
  };

  const updateCreator = (index: number, field: string, value: string | number) => {
    const newCreators = [...creators];
    newCreators[index] = { ...newCreators[index], [field]: value };
    setCreators(newCreators);
  };

  const addCreator = () => {
    if (creators.length >= 3) {
      toast.error('Maximum 3 creators allowed in spotlight');
      return;
    }
    setCreators([...creators, { name: '', handle: '', specialty: '', subs: '', avatar: '', cover: 'from-amber-400 to-orange-500' }]);
  };

  const removeCreator = (index: number) => {
    const newCreators = [...creators];
    newCreators.splice(index, 1);
    setCreators(newCreators);
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await cmsService.updateSettings({ 
        vlogTrailerUrl: trailerUrl,
      });
      toast.success('Trailer video updated');
    } catch (error: any) {
      console.error('Save settings error:', error?.response?.data || error);
      toast.error('Failed to update settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleTrailerUpload = async (file: File) => {
    setIsUploadingTrailer(true);
    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('type', 'video');
      const { axiosPrivate } = await import('@/lib/axios');
      const res = await axiosPrivate.post('/vendor/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setTrailerUrl(res.data.data.url);
        toast.success('Trailer video uploaded');
      }
    } catch (error) {
      toast.error('Trailer upload failed');
    } finally {
      setIsUploadingTrailer(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-black uppercase italic tracking-tighter">Vlog Registry</h1>
          <p className="text-gray-500 font-medium text-sm mt-1 uppercase tracking-widest">Manage Visual Stories — Instagram Reels & Content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Editor Form */}
        <div className="xl:col-span-4">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl space-y-6 sticky top-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl">
                <Instagram size={20} />
              </div>
              <h2 className="text-lg font-black uppercase italic">{editingId ? 'Edit Story' : 'New Visual Story'}</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Vlog Title</label>
                <input 
                  type="text"
                  placeholder="Sunset Trek in Manali"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category</label>
                  <select 
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all appearance-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Duration</label>
                  <input 
                    type="text"
                    placeholder="0:45"
                    value={form.duration}
                    onChange={(e) => setForm({...form, duration: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Linked Trip (Optional)</label>
                <select 
                  value={form.linkedTripId || ''}
                  onChange={(e) => setForm({...form, linkedTripId: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all appearance-none"
                >
                  <option value="">-- No Linked Trip --</option>
                  {trips.map(trip => (
                    <option key={trip.id} value={trip.id}>{trip.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Instagram Reel Link</label>
                <div className="relative">
                  <input 
                    type="url"
                    placeholder="https://www.instagram.com/reel/ABC123/"
                    value={form.instagramUrl}
                    onChange={(e) => setForm({...form, instagramUrl: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-pink-500 transition-all pl-12"
                  />
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                </div>
              </div>



              {/* Thumbnail Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Thumbnail</label>
                {form.thumbnail ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100">
                    <img src={form.thumbnail} alt="Thumbnail" className="w-full h-36 object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, thumbnail: '' })}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-28 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
                    ) : (
                      <>
                        <UploadCloud size={22} className="text-gray-300 mb-2" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload to MinIO</span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], 'thumbnail');
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Location</label>
                <input 
                  type="text"
                  placeholder="Manali, Himachal Pradesh"
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Brief Description</label>
                <textarea 
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all resize-none"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="rounded text-black" />
                  <span className="text-[10px] font-black uppercase text-gray-500">Active</span>
                </label>
              </div>
            </div>

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
                <Save size={16} /> {isSubmitting ? 'Syncing...' : editingId ? 'Update Story' : 'Publish Story'}
              </button>
            </div>
          </form>
        </div>

        {/* Vlog List */}
        <div className="xl:col-span-8 space-y-10">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black uppercase italic">Published Registry</h2>
                <div className="flex items-center gap-4">
                   <div className="px-4 py-2 bg-gray-50 text-[10px] font-black uppercase text-gray-400 rounded-full flex items-center gap-2">
                      <ListFilter size={12} /> {vlogs.length} Vlogs
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                   <div className="col-span-full py-20 text-center text-gray-300 font-black uppercase text-xs">Accessing Data Vault...</div>
                ) : vlogs.length === 0 ? (
                   <div className="col-span-full py-20 text-center text-gray-300 font-black uppercase text-xs border-2 border-dashed border-gray-100 rounded-3xl">Registry empty</div>
                ) : (
                  vlogs.map((vlog) => (
                    <div key={vlog.id} className={`bg-gray-50 rounded-[32px] overflow-hidden border border-transparent hover:border-gray-200 hover:bg-white transition-all group p-4 ${!vlog.isActive ? 'opacity-50' : ''}`}>
                       <div className="aspect-[9/16] rounded-2xl overflow-hidden relative mb-4">
                          {vlog.thumbnail ? (
                            <img src={vlog.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={vlog.title} />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Instagram size={32} className="text-gray-300" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-[8px] font-black uppercase rounded-lg">
                             {vlog.category}
                          </div>
                          {vlog.videoUrl && (
                            <div className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg">
                               <Tag size={12} />
                            </div>
                          )}
                       </div>
                       
                       <div className="px-2">
                          <h3 className="text-sm font-black uppercase tracking-tight mb-1 truncate">{vlog.title}</h3>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                             <span className="flex items-center gap-1"><MapPin size={10} /> {vlog.location || 'N/A'}</span>
                             {vlog.duration && <span className="flex items-center gap-1"><Tag size={10} /> {vlog.duration}</span>}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => toggleStatus(vlog.id, 'isActive', vlog.isActive)}
                                  className={`p-2.5 rounded-xl transition-all ${vlog.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}
                                >
                                   {vlog.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                             </div>
                             
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEdit(vlog)}
                                  className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
                                >
                                   <Edit3 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(vlog.id)}
                                  className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                >
                                   <Trash2 size={16} />
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>

          {/* Vlog Page Settings — Trailer Video */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black uppercase italic">Vlog Hero Trailer</h2>
                <button 
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="px-6 py-2 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  <Save size={14} /> {isSavingSettings ? 'Saving...' : 'Save Trailer'}
                </button>
             </div>

             <div className="space-y-6">
                {/* Current Trailer Preview */}
                {trailerUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-black">
                    <video src={trailerUrl} className="w-full h-40 object-cover" muted autoPlay loop playsInline />
                    <button
                      type="button"
                      onClick={() => setTrailerUrl('')}
                      className="absolute top-3 right-3 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                      Current Trailer
                    </div>
                  </div>
                )}

                {/* Paste URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Paste Video Link (.mp4)</label>
                  <input 
                    type="url"
                    placeholder="https://example.com/trailer.mp4"
                    value={trailerUrl}
                    onChange={(e) => setTrailerUrl(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                  />
                </div>

                {/* OR Upload */}
                <div className="relative">
                  <div className="absolute inset-x-0 top-0 flex items-center justify-center -mt-3">
                    <span className="bg-white px-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">or upload</span>
                  </div>
                  <label className="flex flex-col items-center justify-center h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all mt-2">
                    {isUploadingTrailer ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" />
                    ) : (
                      <>
                        <UploadCloud size={20} className="text-gray-300 mb-1" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload .mp4 Video</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="video/mp4,video/webm,video/*" 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && handleTrailerUpload(e.target.files[0])}
                    />
                  </label>
                </div>
             </div>
          </div>

          {/* Creator Spotlight Config */}
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black uppercase italic">Creator Spotlight (Vlog Page)</h2>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={addCreator}
                    className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-all"
                  >
                    <Plus size={14} /> Add Creator
                  </button>
                  <button 
                    onClick={handleSaveCreators}
                    disabled={isSavingCreators}
                    className="px-6 py-2 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    <Save size={14} /> {isSavingCreators ? 'Saving...' : 'Save Creators'}
                  </button>
                </div>
             </div>

             <div className="space-y-6">
                {creators.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">No creators added yet</p>
                    <button onClick={addCreator} className="text-amber-500 font-bold hover:underline">Add First Creator</button>
                  </div>
                )}
                {creators.map((creator, index) => (
                  <div key={index} className="relative grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <button 
                      onClick={() => removeCreator(index)}
                      className="absolute -top-3 -right-3 p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Remove Creator"
                    >
                      <X size={14} />
                    </button>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Creator Name</label>
                      <input 
                        type="text"
                        value={creator.name}
                        onChange={(e) => updateCreator(index, 'name', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Handle</label>
                      <input 
                        type="text"
                        value={creator.handle}
                        onChange={(e) => updateCreator(index, 'handle', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Specialty</label>
                      <input 
                        type="text"
                        value={creator.specialty}
                        onChange={(e) => updateCreator(index, 'specialty', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Subscribers</label>
                      <input 
                        type="text"
                        value={creator.subs}
                        onChange={(e) => updateCreator(index, 'subs', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Avatar Letter</label>
                      <input 
                        type="text"
                        maxLength={1}
                        value={creator.avatar}
                        onChange={(e) => updateCreator(index, 'avatar', e.target.value.toUpperCase())}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-black transition-all text-center"
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
