'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, Trash2, Edit3, Eye, EyeOff, 
  FileText, UploadCloud, X, Calendar, Clock, User
} from 'lucide-react';
import { cmsService } from '@/services/cmsService';
import { toast } from 'sonner';

const BLOG_CATEGORIES = ['General', 'Trekking', 'Budget Travel', 'Weekend', 'Beaches', 'Spiritual', 'Adventure', 'Culture', 'Tips', 'Destinations'];

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  author: 'TripDekho Team',
  category: 'General',
  readTime: '5 min',
  isPublished: false,
};

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await cmsService.getAllBlogsAdmin();
      if (res.success) {
        setBlogs(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch blogs');
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
        toast.success('Cover image uploaded');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || generateSlug(form.title),
      };

      if (editingId) {
        const res = await cmsService.updateBlog(editingId, payload);
        if (res.success) toast.success('Blog updated');
      } else {
        const res = await cmsService.createBlog(payload);
        if (res.success) toast.success('Blog created');
      }
      resetForm();
      fetchBlogs();
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

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      thumbnail: blog.thumbnail || '',
      author: blog.author || 'TripDekho Team',
      category: blog.category || 'General',
      readTime: blog.readTime || '5 min',
      isPublished: blog.isPublished ?? false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      const res = await cmsService.deleteBlog(id);
      if (res.success) {
        setBlogs(blogs.filter(b => b.id !== id));
        toast.success('Blog deleted');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      await cmsService.updateBlog(id, { isPublished: !isPublished });
      setBlogs(blogs.map(b => b.id === id ? { ...b, isPublished: !isPublished } : b));
      toast.success(!isPublished ? 'Blog published' : 'Blog unpublished');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-black uppercase italic tracking-tighter">Blog Manager</h1>
          <p className="text-gray-500 font-medium text-sm mt-1 uppercase tracking-widest">Create & Manage Blog Articles</p>
        </div>
        <div className="px-4 py-2 bg-gray-50 text-[10px] font-black uppercase text-gray-400 rounded-full">
          {blogs.length} Total Posts
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Editor Form */}
        <div className="xl:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl space-y-6 sticky top-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <FileText size={20} />
              </div>
              <h2 className="text-lg font-black uppercase italic">{editingId ? 'Edit Post' : 'New Blog Post'}</h2>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Blog Title</label>
                <input 
                  type="text"
                  placeholder="Top 10 Treks in Himachal Pradesh"
                  required
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) });
                  }}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">URL Slug</label>
                <input 
                  type="text"
                  placeholder="top-10-treks-himachal-pradesh"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all text-gray-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category</label>
                  <select 
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl px-3 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all appearance-none"
                  >
                    {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Author</label>
                  <input 
                    type="text"
                    placeholder="TripDekho Team"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl px-3 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                  />
                </div>

                {/* Read Time */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Read Time</label>
                  <input 
                    type="text"
                    placeholder="5 min"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-2xl px-3 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cover Image</label>
                {form.thumbnail ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-100">
                    <img src={form.thumbnail} alt="Cover" className="w-full h-40 object-cover" />
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
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Cover Image</span>
                      </>
                    )}
                    <input
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

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Excerpt / Summary</label>
                <textarea 
                  rows={2}
                  placeholder="A short summary that appears in the blog listing..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all resize-none"
                />
              </div>

              {/* Content (HTML) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Content (HTML)</label>
                <textarea 
                  rows={10}
                  placeholder="<h2>Your Blog Heading</h2><p>Write your blog content here. HTML tags are supported.</p>"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-xs font-mono focus:ring-2 focus:ring-black transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Published Toggle */}
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <input 
                  type="checkbox" 
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-emerald-200 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Publish Immediately</span>
              </label>
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
                <Save size={16} /> {isSubmitting ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Blog List */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-black uppercase italic">All Posts</h2>
             </div>

             <div className="space-y-4">
                {isLoading ? (
                   <div className="py-20 text-center text-gray-300 font-black uppercase text-xs">Loading posts...</div>
                ) : blogs.length === 0 ? (
                   <div className="py-20 text-center text-gray-300 font-black uppercase text-xs border-2 border-dashed border-gray-100 rounded-3xl">
                     No blog posts yet — write your first one!
                   </div>
                ) : (
                  blogs.map((blog) => (
                    <div 
                      key={blog.id} 
                      className={`flex gap-5 p-5 rounded-[24px] border transition-all group ${
                        blog.isPublished 
                          ? 'bg-gray-50 border-transparent hover:border-gray-200 hover:bg-white' 
                          : 'bg-amber-50/50 border-amber-100'
                      }`}
                    >
                       {/* Thumbnail */}
                       <div className="w-28 h-20 bg-gray-200 rounded-2xl overflow-hidden flex-shrink-0">
                          {blog.thumbnail ? (
                            <img src={blog.thumbnail} className="w-full h-full object-cover" alt={blog.title} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FileText size={24} />
                            </div>
                          )}
                       </div>

                       {/* Content */}
                       <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-black uppercase tracking-tight mb-1 truncate">{blog.title}</h3>
                          <p className="text-[10px] font-bold text-gray-400 line-clamp-1 mb-3">{blog.excerpt || 'No excerpt'}</p>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                             <span className="flex items-center gap-1"><User size={10} /> {blog.author}</span>
                             <span className="flex items-center gap-1"><Clock size={10} /> {blog.readTime}</span>
                             <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${blog.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                               {blog.isPublished ? 'Published' : 'Draft'}
                             </span>
                          </div>
                       </div>

                       {/* Actions */}
                       <div className="flex items-center gap-2 flex-shrink-0">
                          <button 
                            onClick={() => togglePublish(blog.id, blog.isPublished)}
                            className={`p-2.5 rounded-xl transition-all ${blog.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}
                            title={blog.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {blog.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button 
                            onClick={() => handleEdit(blog)}
                            className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(blog.id)}
                            className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
