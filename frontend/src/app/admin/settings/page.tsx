'use client';
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';
import { cn } from '@/lib/utils';
import { 

  Settings, 
  Globe, 
  Shield, 
  Bell, 
  AlertTriangle,
  Zap,
  Lock,
  MessageSquare,
  ShieldCheck,
  Save,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
  Activity,
  X,
  Share2,
  Info,
  Smartphone,
  Mail,
  FileText,
  RefreshCw,
  Users,
  CreditCard
} from 'lucide-react';

const SystemSettingsPage = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab ] = useState('security');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getSystemSettings();
      setSettings(data);
    } catch (err) {
      toast.error('Failed to load system configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminService.updateSystemSettings(settings);
      toast.success('System settings updated successfully');
    } catch (err) {
      toast.error('Failed to update system parameters');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateNestedField = (parent: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value }
    }));
  };

  if (loading) return <PremiumLoader />;

  const TABS = [
    { id: 'security', icon: Shield, label: 'Platform Status' },
    { id: 'brand', icon: Globe, label: 'Platform Branding' },
    { id: 'metrics', icon: Activity, label: 'Operational Metrics' },
    { id: 'social', icon: Share2, label: 'Social & Metadata' },
    { id: 'permissions', icon: Lock, label: 'Permission Matrix' },
    { id: 'finance', icon: CreditCard, label: 'Finance & Fees' },
  ];

  const SocialIcon = ({ platform }: { platform: string }) => {
    const icons: Record<string, any> = {
      instagram: Instagram,
      youtube: Youtube,
      facebook: Facebook,
      twitter: Twitter,
      linkedin: Linkedin
    };
    const Icon = icons[platform.toLowerCase()] || Globe;
    return <Icon size={18} />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <Settings className="text-black" size={24} />
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Control Panel</h1>
            </div>
            <p className="text-sm text-gray-500">Configure global platform parameters, security policies, and branding</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1 space-y-1">
            {TABS.map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                     "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                     activeTab === tab.id 
                        ? "bg-black text-white shadow-lg" 
                        : "text-gray-500 hover:bg-gray-100 hover:text-black"
                  )}
               >
                  <div className="flex items-center gap-3">
                     <tab.icon size={16} className={activeTab === tab.id ? "text-emerald-400" : "text-gray-300 group-hover:text-black"} />
                     {tab.label}
                  </div>
                  <ChevronRight size={14} className={activeTab === tab.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"} />
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px]">
               <div className="p-10">
                  
                  {activeTab === 'security' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-1.5 h-8 bg-black rounded-full" />
                           <div>
                              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Platform Status</h2>
                              <p className="text-xs text-gray-400 font-medium">Manage global availability and security states</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 group">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                       <Lock size={18} className="text-gray-700" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">Maintenance Mode</span>
                                 </div>
                                 <button 
                                    onClick={() => updateField('maintenanceMode', !settings?.maintenanceMode)}
                                    className={cn(
                                       "w-12 h-6 rounded-full transition-all relative",
                                       settings?.maintenanceMode ? "bg-black" : "bg-gray-200"
                                    )}
                                 >
                                    <div className={cn(
                                       "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                       settings?.maintenanceMode ? "left-7" : "left-1"
                                    )} />
                                 </button>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                 Force global platform-wide maintenance state. All public traffic will be rerouted to the status page.
                              </p>
                           </div>

                           <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                       <ShieldCheck size={18} className="text-emerald-500" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">System Integrity</span>
                                 </div>
                                 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded">Optimal</span>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                 Platform firewall and encryption standards are currently operating at peak parameters.
                              </p>
                           </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-gray-100">
                           <div>
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Platform Policy Context</label>
                              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-4">
                                 <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                                 <p className="text-xs text-amber-900 leading-relaxed font-medium">
                                    Modifying these parameters will affect 100% of platform traffic. Ensure all configuration changes are audited before commitment.
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'brand' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-1.5 h-8 bg-black rounded-full" />
                           <div>
                              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Platform Branding</h2>
                              <p className="text-xs text-gray-400 font-medium">Visual identity and global naming conventions</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Platform Name</label>
                              <input 
                                 type="text" 
                                 value={settings?.platformName || ''}
                                 onChange={(e) => updateField('platformName', e.target.value)}
                                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-black transition-all"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Email</label>
                              <input 
                                 type="email" 
                                 value={settings?.contactEmail || ''}
                                 onChange={(e) => updateField('contactEmail', e.target.value)}
                                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-black transition-all"
                              />
                           </div>
                           <div className="space-y-2 md:col-span-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Description (SEO)</label>
                              <textarea 
                                 value={settings?.platformDescription || ''}
                                 onChange={(e) => updateField('platformDescription', e.target.value)}
                                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-black transition-all h-32 resize-none"
                              />
                           </div>
                           <div className="space-y-2 md:col-span-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vlog Trailer Video URL (MP4)</label>
                              <input 
                                 type="url"
                                 value={settings?.vlogTrailerUrl || ''}
                                 onChange={(e) => updateField('vlogTrailerUrl', e.target.value)}
                                 placeholder="https://assets.mixkit.co/videos/preview/...mp4"
                                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-black transition-all"
                              />
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'metrics' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-1.5 h-8 bg-black rounded-full" />
                           <div>
                              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Operational Metrics</h2>
                              <p className="text-xs text-gray-400 font-medium">Configure publicly displayed platform statistics</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {[
                              { label: 'Display Active Travelers', key: 'showTravelers', icon: Users },
                              { id: 'Display Total Bookings', key: 'showBookings', icon: FileText },
                              { id: 'Display Vendor Count', key: 'showVendors', icon: Globe }
                           ].map((item, i) => (
                              <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <item.icon size={16} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-700">{item.label || item.id}</span>
                                 </div>
                                 <button 
                                    onClick={() => updateNestedField('metrics', item.key, !settings?.metrics?.[item.key])}
                                    className={cn(
                                       "w-10 h-5 rounded-full transition-all relative",
                                       settings?.metrics?.[item.key] ? "bg-black" : "bg-gray-200"
                                    )}
                                 >
                                    <div className={cn(
                                       "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                                       settings?.metrics?.[item.key] ? "left-5.5" : "left-0.5"
                                    )} />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {activeTab === 'social' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-1.5 h-8 bg-black rounded-full" />
                           <div>
                              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Social & Metadata</h2>
                              <p className="text-xs text-gray-400 font-medium">External integration points and social footprint</p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           {Object.entries(settings?.socialLinks || {}).map(([platform, url]: [any, any]) => (
                              <div key={platform} className="flex items-center gap-4 group">
                                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-focus-within:bg-black group-focus-within:text-white transition-all shadow-sm">
                                    <SocialIcon platform={platform} />
                                 </div>
                                 <div className="flex-1">
                                    <input 
                                       type="text" 
                                       value={url}
                                       onChange={(e) => updateNestedField('socialLinks', platform, e.target.value)}
                                       className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-black/10 transition-all"
                                       placeholder={`https://${platform}.com/...`}
                                    />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {activeTab === 'permissions' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-1.5 h-8 bg-black rounded-full" />
                           <div>
                              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Permission Matrix</h2>
                              <p className="text-xs text-gray-400 font-medium">Dynamically control module access for administrative roles</p>
                           </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 flex gap-4">
                           <Info className="text-amber-600 shrink-0" size={20} />
                           <p className="text-xs text-amber-900 leading-relaxed font-medium">
                              Changes made here update the <strong>Global Access Control Matrix</strong>. These settings determine which roles can view and interact with specific admin modules. Super admins always maintain full access.
                           </p>
                        </div>

                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                           {Object.entries(settings?.adminModulePermissions || {}).sort().map(([path, roles]: [any, any]) => (
                              <div key={path} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all space-y-4">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <div className="w-2 h-2 bg-black rounded-full" />
                                       <span className="text-sm font-black text-gray-900 tracking-tight">{path.replace('/admin/', '').replace('/', ' > ').toUpperCase()}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">{path}</span>
                                 </div>
                                 
                                 <div className="flex flex-wrap gap-2">
                                    {[
                                       'super_admin', 'tech_admin', 'platform_admin', 'onboarding_admin', 
                                       'finance_admin', 'growth_admin', 'operations_admin', 'support_admin', 
                                       'content_admin', 'admin'
                                    ].map(role => {
                                       const isSelected = roles.includes(role);
                                       return (
                                          <button
                                             key={role}
                                             onClick={() => {
                                                const newRoles = isSelected 
                                                   ? roles.filter((r: string) => r !== role)
                                                   : [...roles, role];
                                                updateNestedField('adminModulePermissions', path, newRoles);
                                             }}
                                             className={cn(
                                                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border",
                                                isSelected 
                                                   ? "bg-black text-white border-black" 
                                                   : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600"
                                             )}
                                          >
                                             {role.replace('_', ' ')}
                                          </button>
                                       );
                                    })}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {activeTab === 'finance' && (
                     <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-1.5 h-8 bg-black rounded-full" />
                           <div>
                              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Finance & Fees</h2>
                              <p className="text-xs text-gray-400 font-medium">Manage global platform fees and charges applied to bookings.</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                       <CreditCard size={18} className="text-gray-700" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">Platform Fee (INR)</span>
                                 </div>
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">
                                 This flat fee is applied to every booking across the entire platform. This replaces traditional percentage-based taxes and service charges.
                              </p>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                                <input 
                                   type="number" 
                                   value={settings?.commissionRates?.platformFeeAmount || 0}
                                   onChange={(e) => updateNestedField('commissionRates', 'platformFeeAmount', Number(e.target.value))}
                                   className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-black outline-none focus:border-black transition-all"
                                   min="0"
                                />
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
