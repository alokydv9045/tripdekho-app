"use client";

import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Search, 
  RefreshCw, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert,
  Settings2,
  X,
  Eye,
  EyeOff,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

const VendorAccountsPage = () => {
  const { user: currentAdmin } = useAppSelector(state => state.auth);
  const isSuperAdmin = currentAdmin?.role === 'super_admin';
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (vendorId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [vendorId]: !prev[vendorId] }));
  };

  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    businessName: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getVendors({ 
        page, 
        limit: 10, 
        status: filter === 'all' ? undefined : filter,
        search: searchQuery 
      });
      setVendors(data.vendors);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (err: any) {
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [page, filter]);

  const handleApprove = async (id: string, type: 'account' | 'kyc') => {
    try {
      if (type === 'account') {
        await adminService.approveVendor(id);
        toast.success("Vendor account approved");
      } else {
        await adminService.verifyKYC(id);
        toast.success("Vendor KYC verified");
      }
      fetchVendors();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await adminService.deleteVendor(id);
      toast.success("Vendor removed");
      fetchVendors();
    } catch (err) {
      toast.error("Deletetion failed");
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await adminService.createVendor(vendorForm);
      toast.success("Vendor created successfully!");
      setIsModalOpen(false);
      setVendorForm({ businessName: '', contactEmail: '', contactPhone: '', description: '', password: '' });
      fetchVendors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <Building2 className="text-black" size={24} />
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Vendors</h1>
            </div>
            <p className="text-sm text-gray-500">Manage and verify platform vendors</p>
        </div>

        <button 
           onClick={() => {
             setVendorForm(prev => ({ 
               ...prev, 
               password: 'Temp@' + Math.random().toString(36).slice(-6) + Math.floor(Math.random() * 100) 
             }));
             setShowPassword(true);
             setIsModalOpen(true);
           }}
           className="w-full md:w-auto bg-black text-white px-6 py-2.5 text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm active:scale-95"
        >
           Add Vendor +
        </button>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="flex border-b border-gray-200 gap-4 overflow-x-auto">
            {[
              { id: 'all', label: 'All Vendors' },
              { id: 'pending', label: 'Pending' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-all whitespace-nowrap",
                  filter === tab.id ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"
                )}
              >
                {tab.label}
              </button>
            ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
           <form onSubmit={(e) => { e.preventDefault(); fetchVendors(); }} className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by business name or email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
                />
           </form>
           <button onClick={() => fetchVendors()} className="p-2 text-gray-400 hover:text-black transition-all self-end md:self-auto">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
           </button>
        </div>
      </div>

      {/* Vendor Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                   <th className="px-6 py-4">Vendor</th>
                   <th className="px-6 py-4">Status</th>
                   {isSuperAdmin && <th className="px-6 py-4"><div className="flex items-center gap-1.5"><Key size={10} /> Password</div></th>}
                   <th className="px-6 py-4 text-center">KYC</th>
                   <th className="px-6 py-4 text-center">Tier</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={isSuperAdmin ? 6 : 5} className="p-20 text-center text-gray-400 animate-pulse">Loading vendors...</td></tr>
                ) : vendors?.length > 0 ? (
                  vendors.map((vendor: any) => (
                     <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{vendor.businessName}</div>
                          <div className="text-xs text-gray-500">{vendor.contactEmail}</div>
                       </td>
                       <td className="px-6 py-4">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium",
                            (vendor.verificationStatus === 'approved' || vendor.verificationStatus === 'verified') ? 'bg-blue-50 text-blue-700' : 
                            vendor.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-700' : 
                            'bg-gray-100 text-gray-600'
                          )}>
                             {vendor.verificationStatus?.charAt(0).toUpperCase() + vendor.verificationStatus?.slice(1) || 'Pending'}
                          </span>
                       </td>
                       {isSuperAdmin && (
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              {vendor.user?.plainTextPassword ? (
                                 <>
                                    <code className={cn(
                                      "text-xs font-mono px-2 py-1 rounded-lg border transition-all select-all",
                                      visiblePasswords[vendor.id] 
                                        ? "bg-amber-50 border-amber-200 text-amber-800" 
                                        : "bg-gray-50 border-gray-100 text-gray-400"
                                    )}>
                                      {visiblePasswords[vendor.id] ? vendor.user.plainTextPassword : '••••••••'}
                                    </code>
                                    <button
                                      onClick={() => togglePasswordVisibility(vendor.id)}
                                      className="p-1.5 text-gray-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                      title={visiblePasswords[vendor.id] ? 'Hide password' : 'Reveal password'}
                                    >
                                      {visiblePasswords[vendor.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                 </>
                              ) : (
                                 <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">N/A</span>
                              )}
                           </div>
                        </td>
                       )}
                       <td className="px-6 py-4 text-center">
                            <div className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                              vendor.kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            )}>
                               {vendor.kycStatus === 'verified' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                               {vendor.kycStatus ? vendor.kycStatus.charAt(0).toUpperCase() + vendor.kycStatus.slice(1) : 'Pending'}
                            </div>
                       </td>
                       <td className="px-6 py-4 text-center">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-xs font-medium">
                              {vendor.subscriptionTier || 'Standard'}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                              {(vendor.verificationStatus !== 'approved' && vendor.verificationStatus !== 'verified') && (
                                  <button 
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                                    onClick={() => handleApprove(vendor.id, 'account')}
                                    title="Approve Account"
                                  >
                                      <ShieldCheck size={16} />
                                  </button>
                               )}
                              <button 
                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all" 
                                onClick={() => router.push(`/admin/vendors/${vendor.id}`)}
                                title="Vendor Settings"
                              >
                                  <Settings2 size={16} />
                              </button>
                              <button 
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                                onClick={() => handleDelete(vendor.id)}
                                title="Delete Vendor"
                              >
                                  <Trash2 size={16} />
                              </button>
                          </div>
                       </td>
                     </tr>
                  ))
                ) : (
                  <tr><td colSpan={isSuperAdmin ? 6 : 5} className="p-20 text-center text-gray-400 font-medium">No vendors found</td></tr>
                )}
             </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
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

      {/* Add Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New Vendor</h2>
              
              <form onSubmit={handleCreateVendor} className="space-y-4">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                    <input 
                      type="text" required
                      value={vendorForm.businessName}
                      onChange={e => setVendorForm({...vendorForm, businessName: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                      placeholder="e.g. Himalayan Treks"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
                    <input 
                      type="email" required
                      value={vendorForm.contactEmail}
                      onChange={e => setVendorForm({...vendorForm, contactEmail: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                      placeholder="vendor@company.com"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone</label>
                    <input 
                      type="tel" required
                      value={vendorForm.contactPhone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setVendorForm({...vendorForm, contactPhone: val});
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      minLength={10}
                      pattern="[0-9]{10}"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Set Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={vendorForm.password}
                        onChange={e => setVendorForm({...vendorForm, password: e.target.value})}
                        className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                        placeholder="Enter password (min 6 characters)"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
                    <textarea 
                      rows={3}
                      value={vendorForm.description}
                      onChange={e => setVendorForm({...vendorForm, description: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                      placeholder="Brief overview of the vendor..."
                    />
                 </div>
                 
                 <div className="pt-4 flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Creating..." : "Create Vendor"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default VendorAccountsPage;
