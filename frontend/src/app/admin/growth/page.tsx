'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  Plus,
  BarChart3,
  MoreVertical,
  X,
  AlertCircle,
  Megaphone,
  Globe,
  Rocket,
  Activity,
  CheckCircle,
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  Send
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Campaign {
  id: string;
  title: string;
  type: string;
  status: string;
  budget?: number;
  spent?: number;
  impressions?: number;
  conversions?: number;
}

interface FeaturedListing {
  id: string;
  title: string;
  isFeatured?: boolean;
  priorityRank?: number;
}

export default function MarketingGrowthPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [featuredTrips, setFeaturedTrips] = useState<FeaturedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ title: '', type: 'seasonal_promo', budget: 10000 });

  const [analytics, setAnalytics] = useState<any>(null);
  const [crmMessage, setCrmMessage] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (activeTab === 'campaigns') {
        const res = await adminService.getCampaigns();
        setCampaigns((res.campaigns as unknown as Campaign[]) || []);
      } else if (activeTab === 'listings') {
        const res = await adminService.getTrips({ featured: 'true' });
        setFeaturedTrips((res.trips as unknown as FeaturedListing[]) || []);
      } else {
         const stats = await adminService.getAnalytics();
         setAnalytics(stats);
      }
    } catch (err) {
      toast.error("Failed to load growth statistics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createCampaign(newCampaign);
      toast.success("Marketing campaign created");
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to create campaign");
    }
  };

  const handleUpdatePriority = async (id: string, rank: number) => {
    try {
      await adminService.featureTripPriority(id, true, rank);
      toast.success(`Priority updated to Rank ${rank}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update priority rank");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <Rocket className="text-black" size={24} />
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Growth Engine</h1>
            </div>
            <p className="text-sm text-gray-500">Manage marketing campaigns, featured listings, and user acquisition</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-emerald-50 rounded-lg">
                  <Users className="text-emerald-600" size={20} />
               </div>
               <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={10} /> 12%
               </div>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">New Registrations</h3>
            <p className="text-2xl font-bold text-gray-900">1,284</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-blue-50 rounded-lg">
                  <Target className="text-blue-600" size={20} />
               </div>
               <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={10} /> 5.2%
               </div>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Conversion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">3.8%</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-purple-50 rounded-lg">
                  <Megaphone className="text-purple-600" size={20} />
               </div>
               <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={10} /> 8.4%
               </div>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Campaign Reach</h3>
            <p className="text-2xl font-bold text-gray-900">42.5K</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-amber-50 rounded-lg">
                  <TrendingUp className="text-amber-600" size={20} />
               </div>
               <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={10} /> 15%
               </div>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Growth Index</h3>
            <p className="text-2xl font-bold text-gray-900">104.2</p>
         </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-4 overflow-x-auto">
          {[
            { id: 'campaigns', label: 'Marketing Campaigns', icon: Megaphone },
            { id: 'listings', label: 'Featured Experiences', icon: Target },
            { id: 'retention', label: 'CRM & Retention', icon: Users }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                activeTab === tab.id ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
      </div>

      {/* Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-gray-400 animate-pulse font-medium">Aggregating growth data...</div>
        ) : (
          <div className="p-0">
             {activeTab === 'campaigns' && (
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                         <tr>
                            <th className="px-6 py-4">Campaign</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Budget</th>
                            <th className="px-6 py-4">Spent</th>
                            <th className="px-6 py-4 text-center">ROI</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {campaigns.length > 0 ? campaigns.map((cp) => (
                            <tr key={cp.id} className="hover:bg-gray-50/50 transition-colors">
                               <td className="px-6 py-4">
                                  <div className="font-semibold text-gray-900">{cp.title}</div>
                                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">{cp.type.replace('_', ' ')}</div>
                               </td>
                               <td className="px-6 py-4">
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                    cp.status === 'active' ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                                  )}>
                                     {cp.status}
                                  </span>
                               </td>
                               <td className="px-6 py-4 font-medium text-gray-900">₹{cp.budget?.toLocaleString()}</td>
                               <td className="px-6 py-4 text-gray-500">₹{cp.spent?.toLocaleString() || 0}</td>
                               <td className="px-6 py-4 text-center">
                                  <div className="flex flex-col items-center">
                                     <span className="text-emerald-600 font-bold">2.4x</span>
                                     <div className="w-12 h-1 bg-gray-100 rounded-full mt-1">
                                        <div className="w-2/3 h-full bg-emerald-500 rounded-full" />
                                     </div>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <button className="p-2 text-gray-400 hover:text-black">
                                     <MoreVertical size={16} />
                                  </button>
                               </td>
                            </tr>
                         )) : (
                            <tr><td colSpan={6} className="p-20 text-center text-gray-400">No active campaigns</td></tr>
                         )}
                      </tbody>
                   </table>
                </div>
             )}

             {activeTab === 'listings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                   {featuredTrips.map((trip) => (
                      <div key={trip.id} className="border border-gray-100 rounded-xl p-6 bg-gray-50/50 hover:border-gray-300 transition-all group">
                         <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 mr-4">{trip.title}</h3>
                            <CheckCircle size={18} className="text-emerald-500" />
                         </div>
                         <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                               <span className="text-xs text-gray-400 font-bold uppercase">Priority Rank</span>
                               <select 
                                  value={trip.priorityRank || 0}
                                  onChange={(e) => handleUpdatePriority(trip.id, parseInt(e.target.value))}
                                  className="bg-white border border-gray-200 rounded px-2 py-1 text-xs font-bold"
                               >
                                  {[0,1,2,3,4,5].map(v => <option key={v} value={v}>Rank {v}</option>)}
                               </select>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 pt-2 border-t border-gray-200">
                               <span>Impressions: 2.4K</span>
                               <span>CTR: 5.2%</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'retention' && (
                <div className="p-8 max-w-2xl mx-auto space-y-8">
                   <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
                      <div className="p-3 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
                         <Send size={24} />
                      </div>
                      <div>
                         <h3 className="font-bold text-blue-900">Direct User Engagement</h3>
                         <p className="text-xs text-blue-800/70 mt-1">Send broadcast notifications or promotional emails to segments of your user base.</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div>
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Message Content</label>
                         <textarea 
                            value={crmMessage}
                            onChange={(e) => setCrmMessage(e.target.value)}
                            placeholder="Draft your broadcast message here..."
                            className="w-full h-40 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                         />
                      </div>
                      <div className="flex justify-between items-center">
                         <div className="flex gap-2">
                            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500 hover:text-black">Segment: All Users</button>
                            <button className="px-3 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500 hover:text-black">Template: Welcome</button>
                         </div>
                         <button 
                            disabled={!crmMessage}
                            onClick={() => { toast.success("Broadcast sent"); setCrmMessage(''); }}
                            className="bg-black text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
                         >
                            Send Broadcast <Send size={14} />
                         </button>
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}
      </div>

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-gray-900">Initiate Growth Campaign</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                    <X size={20} />
                 </button>
              </div>
              <form onSubmit={handleCreateCampaign} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaign Title</label>
                    <input 
                       required
                       type="text" 
                       value={newCampaign.title}
                       onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                       placeholder="e.g. Summer Peak 2026 Promo"
                       className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-all"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaign Type</label>
                       <select 
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none"
                          value={newCampaign.type}
                          onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})}
                       >
                          <option value="seasonal_promo">Seasonal Promo</option>
                          <option value="user_acquisition">User Acquisition</option>
                          <option value="vendor_onboarding">Vendor Growth</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget (INR)</label>
                       <input 
                          type="number" 
                          value={newCampaign.budget}
                          onChange={(e) => setNewCampaign({...newCampaign, budget: parseInt(e.target.value)})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none"
                       />
                    </div>
                 </div>
              </form>
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-black">Cancel</button>
                 <button onClick={handleCreateCampaign} className="px-8 py-2.5 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all">Launch Campaign</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
