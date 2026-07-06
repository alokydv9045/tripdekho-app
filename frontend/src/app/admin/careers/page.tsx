"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Users, FileText, CheckCircle2, Clock, X, Plus, Edit2, Trash2, Power, Image as ImageIcon } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

export default function AdminCareersPage() {
  const [activeTab, setActiveTab] = useState<'positions' | 'applications' | 'gallery'>('positions');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [positions, setPositions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  
  // Modal States
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: 'Remote',
    type: 'full_time',
    description: '',
    requirements: '',
    salary: '',
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'positions') {
        const res = await adminService.getCareerPositions();
        setPositions(res.positions || []);
      } else if (activeTab === 'applications') {
        const res = await adminService.getCareerApplications();
        setApplications(res.applications || []);
      } else if (activeTab === 'gallery') {
        const res = await adminService.getCareerGallery();
        setGallery(res.images || []);
      }
    } catch (error) {
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePositionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPosition) {
        await adminService.updateCareerPosition(selectedPosition.id, formData);
        toast.success('Position updated successfully');
      } else {
        await adminService.createCareerPosition(formData);
        toast.success('Position created successfully');
      }
      setIsPositionModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save position');
    }
  };

  const handleTogglePosition = async (id: string) => {
    try {
      await adminService.toggleCareerPosition(id);
      toast.success('Position status toggled');
      fetchData();
    } catch (error) {
      toast.error('Failed to toggle status');
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (!confirm('Are you sure you want to delete this position?')) return;
    try {
      await adminService.deleteCareerPosition(id);
      toast.success('Position deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete position');
    }
  };

  const handleUpdateAppStatus = async (id: string, status: string) => {
    try {
      await adminService.updateApplicationStatus(id, status);
      toast.success(`Application marked as ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'reviewing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shortlisted': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'hired': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleAddGalleryImage = async () => {
    const url = prompt('Enter Image URL:');
    if (!url) return;
    try {
      await adminService.createGalleryImage({ imageUrl: url, sortOrder: gallery.length });
      toast.success('Image added to gallery');
      fetchData();
    } catch (e) {
      toast.error('Failed to add image');
    }
  };

  const handleToggleGallery = async (id: string) => {
    try {
      await adminService.toggleGalleryImage(id);
      toast.success('Gallery image toggled');
      fetchData();
    } catch (e) {
      toast.error('Failed to toggle image');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await adminService.deleteGalleryImage(id);
      toast.success('Image deleted');
      fetchData();
    } catch (e) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Careers Hub</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Manage open positions, review applicants, and #TripDekhoLife gallery</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'positions' && (
            <button 
              onClick={() => {
                setSelectedPosition(null);
                setFormData({ title: '', department: '', location: 'Remote', type: 'full_time', description: '', requirements: '', salary: '', isActive: true });
                setIsPositionModalOpen(true);
              }}
              className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> New Position
            </button>
          )}
          {activeTab === 'gallery' && (
            <button 
              onClick={handleAddGalleryImage}
              className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> Add Image
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Open Positions', value: positions.filter(p => p.isActive).length || 0, icon: Briefcase, color: 'text-blue-500' },
          { title: 'Total Applications', value: applications.length || 0, icon: Users, color: 'text-amber-500' },
          { title: 'Under Review', value: applications.filter(a => a.status === 'reviewing').length || 0, icon: Clock, color: 'text-purple-500' },
          { title: 'Hired', value: applications.filter(a => a.status === 'hired').length || 0, icon: CheckCircle2, color: 'text-emerald-500' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{kpi.title}</p>
              <h3 className="text-2xl font-black text-gray-900">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {[
          { id: 'positions', label: 'Job Positions', icon: Briefcase },
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'gallery', label: 'Life Gallery', icon: ImageIcon }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'border-amber-500 text-amber-600 bg-amber-50/50 rounded-t-xl' 
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-t-xl'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Loading data...</p>
          </div>
        ) : activeTab === 'positions' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Applications</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No positions found. Create one to get started.</td>
                  </tr>
                ) : positions.map(pos => (
                  <tr key={pos.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{pos.title}</p>
                      <p className="text-xs text-gray-500">{pos.location}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{pos.department}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {pos.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        pos.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {pos.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{pos.applicationCount || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleTogglePosition(pos.id)}
                        title={pos.isActive ? "Deactivate" : "Activate"}
                        className={`p-2 rounded-lg transition-colors ${pos.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      >
                        <Power size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPosition(pos);
                          setFormData({ title: pos.title, department: pos.department, location: pos.location, type: pos.type, description: pos.description, requirements: pos.requirements || '', salary: pos.salary || '', isActive: pos.isActive });
                          setIsPositionModalOpen(true);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeletePosition(pos.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'applications' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Resume</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No applications received yet.</td>
                  </tr>
                ) : applications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{app.name}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {app.position ? app.position.title : 'General Application'}
                    </td>
                    <td className="px-6 py-4">
                      {app.resumeUrl ? (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-xs font-bold">
                          <FileText size={14} /> View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">No File</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={app.status}
                        onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wider border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 ${getStatusColor(app.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.coverLetter && (
                        <button 
                          onClick={() => alert(`Cover Letter:\n\n${app.coverLetter}`)}
                          className="text-xs font-bold text-gray-500 hover:text-amber-600 transition-colors"
                        >
                          Read Cover Letter
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.length === 0 ? (
                <div className="col-span-full py-12 text-center text-gray-400">No images added to gallery yet.</div>
              ) : gallery.map((img) => (
                <div key={img.id} className={`relative group rounded-xl overflow-hidden border-2 ${img.isActive ? 'border-transparent' : 'border-red-500/50 grayscale'}`}>
                  <img src={img.imageUrl} className="w-full h-40 object-cover" alt="Gallery" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button onClick={() => handleToggleGallery(img.id)} className={`p-2 rounded-lg ${img.isActive ? 'bg-amber-500 text-black' : 'bg-gray-700 text-white'}`}>
                      <Power size={18} />
                    </button>
                    <button onClick={() => handleDeleteGallery(img.id)} className="p-2 bg-red-500 text-white rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Position Modal */}
      <AnimatePresence>
        {isPositionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-lg font-black">{selectedPosition ? 'Edit Position' : 'Create New Position'}</h3>
                <button onClick={() => setIsPositionModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <form id="positionForm" onSubmit={handlePositionSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Job Title *</label>
                      <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department *</label>
                      <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
                      <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Type</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none">
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Salary Range</label>
                      <input type="text" placeholder="e.g. $80k - $100k" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description (HTML allowed) *</label>
                      <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none" />
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-amber-500 rounded cursor-pointer" />
                      <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer">Position is Active & Visible</label>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button type="button" onClick={() => setIsPositionModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" form="positionForm" className="px-6 py-2.5 rounded-xl font-bold text-sm bg-black text-white hover:bg-amber-500 hover:text-black transition-colors">
                  {selectedPosition ? 'Save Changes' : 'Create Position'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
