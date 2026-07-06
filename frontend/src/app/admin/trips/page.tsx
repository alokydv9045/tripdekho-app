"use client";

import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Map, 
  ShieldCheck, 
  Search, 
  Eye, 
  Trash2, 
  Filter,
  Package,
  X,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TripsManagementPage = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [rejectionModal, setRejectionModal] = useState<{ id: string, title: string } | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, statusFilter, debouncedSearch]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const params: any = { 
        search: debouncedSearch, 
        page, 
        limit: 15 
      };
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response = await adminService.getTrips(params);
      setTrips(response.trips || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [categoryFilter, statusFilter, debouncedSearch, page]);

  const handleUpdateStatus = async (id: string, status: string, reason?: string) => {
    try {
      await adminService.updateTripStatus(id, status, reason);
      toast.success(`Trip status updated to ${status}`);
      setRejectionModal(null);
      fetchTrips();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteTrip = async (id: string) => {
    if(!confirm("Are you sure you want to delete this trip permanently?")) return;
    try {
      await adminService.deleteTrip(id);
      toast.success("Trip deleted successfully");
      fetchTrips();
      setSelectedTrip(null);
    } catch (err) {
      toast.error("Failed to delete trip");
    }
  };

  const handleRunAudit = async () => {
    try {
      toast.info("Starting inventory audit...");
      const result = await adminService.auditTrips();
      if(result.count > 0) {
         setTrips(result.defectiveTrips);
         setTotalPages(1);
         setPage(1);
         toast.warning(`Audit Complete: ${result.count} issues found.`);
      } else {
         toast.success("Audit Complete: All trips verified.");
      }
    } catch (err) {
      toast.error("Audit failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <Map className="text-black" size={24} />
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trips</h1>
            </div>
            <p className="text-sm text-gray-500">Manage and moderate platform trip catalog</p>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4 w-full md:w-auto">
            <button 
                onClick={handleRunAudit}
                className="flex-1 md:flex-none justify-center px-4 md:px-6 py-2.5 border border-gray-200 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
            >
                <ShieldCheck size={16} /> Audit Trips
            </button>
            <button 
                onClick={() => fetchTrips()}
                className="flex-1 md:flex-none justify-center bg-black text-white px-4 md:px-8 py-2.5 text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm"
            >
                Refresh List
            </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex border-b border-gray-200 gap-4 overflow-x-auto">
            {[
              { id: 'all', label: 'All Trips' },
              { id: 'pending_review', label: 'Pending Review' },
              { id: 'published', label: 'Published' },
              { id: 'rejected', label: 'Rejected' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-all whitespace-nowrap",
                  statusFilter === tab.id ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"
                )}
              >
                {tab.label}
              </button>
            ))}
        </div>

         <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white border border-gray-200 p-4 rounded-xl">
           <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
              <Filter size={14} className="text-gray-400 shrink-0" />
              {["all", "adventure", "spiritual", "romantic", "group", "family"].map((cat) => (
                  <button 
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={cn(
                          "px-4 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap capitalize",
                          categoryFilter === cat ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-500 hover:border-black hover:text-black"
                      )}
                  >
                      {cat}
                  </button>
              ))}
           </div>
           <div className="relative w-full lg:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search trips by title..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
                />
           </div>
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                   <th className="px-6 py-4">Trip Details</th>
                   <th className="px-6 py-4">Vendor</th>
                   <th className="px-6 py-4 text-center">Price</th>
                   <th className="px-6 py-4 text-center">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center text-gray-400 animate-pulse">Loading catalog...</td></tr>
                ) : trips.length > 0 ? (
                  trips.map((trip: any) => (
                     <tr key={trip.id} className="hover:bg-gray-50/50 transition-colors group text-sm">
                       <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 cursor-pointer" onClick={() => setSelectedTrip(trip)}>
                             {trip.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{trip.location?.city || 'Various Locations'} • {Array.isArray(trip.category) ? trip.category.join(', ') : typeof trip.category === 'string' ? trip.category : ''}</div>
                       </td>
                       <td className="px-6 py-4 text-gray-600 font-medium">
                          {trip.vendor?.businessName || 'Admin'}
                       </td>
                       <td className="px-6 py-4 text-center font-bold text-gray-900">
                          ₹{(trip.price?.amount || 0).toLocaleString()}
                       </td>
                       <td className="px-6 py-4 text-center">
                          <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                trip.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 
                                trip.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                trip.status === 'pending_review' ? 'bg-amber-50 text-amber-700' :
                                'bg-gray-100 text-gray-600'
                             )}>
                                {trip.status.replace('_', ' ')}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             {trip.status === 'pending_review' ? (
                                <>
                                   <button className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all" onClick={() => handleUpdateStatus(trip.id, 'published')}>Approve</button>
                                   <button className="bg-white border border-gray-200 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all" onClick={() => setRejectionModal({ id: trip.id, title: trip.title })}>Reject</button>
                                </>
                             ) : (
                                <>
                                   <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all" onClick={() => setSelectedTrip(trip)}><Eye size={16} /></button>
                                   <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" onClick={() => handleDeleteTrip(trip.id)}><Trash2 size={16} /></button>
                                </>
                             )}
                          </div>
                       </td>
                     </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-medium">No trips found in catalog</td></tr>
                )}
             </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
           <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
           <div className="flex gap-2">
              <button 
                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button 
                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
           </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {rejectionModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                      <h2 className="text-lg font-bold">Reject Trip</h2>
                      <p className="text-sm text-gray-500">Reason for rejecting: <span className="font-semibold">{rejectionModal.title}</span></p>
                  </div>
                  <button onClick={() => setRejectionModal(null)} className="text-gray-400 hover:text-black">
                     <X size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Rejection Reason</label>
                    <textarea 
                        id="rejection-reason"
                        placeholder="Explain why this trip is being rejected..."
                        className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
                    />
                </div>
                <div className="flex gap-3">
                    <button 
                        className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-all"
                        onClick={() => handleUpdateStatus(rejectionModal.id, 'rejected', (document.getElementById('rejection-reason') as HTMLTextAreaElement).value)}
                    >
                        Confirm Rejection
                    </button>
                    <button 
                        className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                        onClick={() => setRejectionModal(null)}
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Trip Modal */}
      <AnimatePresence>
        {selectedTrip && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xll overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold">Edit Trip Details</h2>
                        <h3 className="text-sm text-gray-500">{selectedTrip.title}</h3>
                    </div>
                    <button className="text-gray-400 hover:text-black" onClick={() => setSelectedTrip(null)}>
                       <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trip Title</label>
                           <input id="force-trip-title" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5" defaultValue={selectedTrip.title} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Moderation Status</label>
                            <select id="force-trip-status" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 bg-white" defaultValue={selectedTrip.status}>
                                <option value="published">Published</option>
                                <option value="pending_review">Pending Review</option>
                                <option value="rejected">Rejected</option>
                                <option value="paused">Paused</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (INR)</label>
                            <input id="force-trip-price" type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 font-mono" defaultValue={selectedTrip.price?.amount || 0} />
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Special Settings</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        defaultChecked={selectedTrip.isFeatured} 
                                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" 
                                        onChange={(e) => {
                                            adminService.updateTrip(selectedTrip.id, { isFeatured: e.target.checked })
                                                .then(() => toast.success("Featured status updated"))
                                                .catch(() => toast.error("Failed to update featured status"));
                                        }}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Feature on Homepage</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trip Description</label>
                        <textarea id="force-trip-desc" className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 min-h-[120px] resize-none" defaultValue={selectedTrip.description} />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95" onClick={() => {
                        adminService.forceUpdateTrip(selectedTrip.id, {
                            title: (document.getElementById('force-trip-title') as HTMLInputElement).value,
                            price: { basePrice: Number((document.getElementById('force-trip-price') as HTMLInputElement).value) } as any,
                            description: (document.getElementById('force-trip-desc') as HTMLTextAreaElement).value,
                            status: (document.getElementById('force-trip-status') as HTMLSelectElement).value as any
                         } as any).then(() => {
                            toast.success("Changes saved successfully");
                            fetchTrips();
                            setSelectedTrip(null);
                         }).catch(() => {
                            toast.error("Failed to save changes");
                         });
                    }}>
                        Save Changes
                    </button>

                    <button 
                        className="px-6 border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl font-bold transition-all"
                        onClick={() => handleDeleteTrip(selectedTrip.id)}
                    >
                        Delete Trip
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TripsManagementPage;
