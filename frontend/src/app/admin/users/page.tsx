 "use client";

import React, { useEffect, useState, useCallback } from "react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Search, 
  RefreshCw, 
  Trash2, 
  Settings2,
  Mail,
  UserPlus,
  BadgeCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Eye,
  EyeOff,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from '@/store/hooks';

const UserManagementPage = () => {
  const router = useRouter();
  const { user: currentAdmin } = useAppSelector(state => state.auth);
  const isSuperAdmin = currentAdmin?.role === 'super_admin';
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({ ...prev, [userId]: !prev[userId] }));
  };
  // Data State
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [limit] = useState(20);

  // Filter State
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // UI State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
    city: '',
    country: 'India',
    isActive: true,
    isVerified: false
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async (pageTarget = page) => {
    try {
      setLoading(true);
      const data = await adminService.getUsers({
        role: roleFilter === 'all' ? undefined : roleFilter,
        isVerified: verificationFilter === 'all' ? undefined : (verificationFilter === 'verified'),
        isActive: statusFilter === 'all' ? undefined : (statusFilter === 'active'),
        search: debouncedSearch || undefined,
        page: pageTarget,
        limit: limit
      });
      
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalResults(data.total || 0);
      setLastSynced(new Date());
    } catch (err: any) {
      toast.error("Data synchronization failed");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, verificationFilter, statusFilter, debouncedSearch, page, limit]);

  useEffect(() => {
    fetchUsers(1);
    setPage(1);
  }, [roleFilter, verificationFilter, statusFilter, debouncedSearch, fetchUsers]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchUsers(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) {
        delete (payload as any).password;
      }

      if (editingUser === true) {
        await adminService.createUser(payload as any);
        toast.success("User created successfully");
      } else {
        await adminService.updateUser(editingUser.id, payload as any);
        toast.success("User updated successfully");
      }
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("This will permanently delete this user. Proceed?")) return;
    try {
      await adminService.deleteUser(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const toggleVerification = async (id: string, current: boolean) => {
    try {
      await adminService.updateUser(id, { isVerified: !current });
      toast.success(`Verification ${!current ? 'granted' : 'revoked'}`);
      setUsers(users.map(u => u.id === id ? { ...u, isVerified: !current } : u));
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await adminService.updateUser(id, { isActive: !current });
      toast.success(`User ${!current ? 'activated' : 'suspended'}`);
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !current } : u));
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-gray-50 rounded-xl text-black">
                  <Users size={24} />
               </div>
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
            </div>
            <p className="text-sm text-gray-500 font-medium">Manage platform access, roles, and account status</p>
        </div>

        <div className="flex items-center gap-3">
          {lastSynced && (
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
               <Clock size={12} />
               Updated: {lastSynced.toLocaleTimeString()}
            </div>
          )}
          <button 
             onClick={() => { 
                setEditingUser(true); 
                setFormData({ 
                   name: '', email: '', password: '', phone: '', 
                   role: 'customer', city: '', country: 'India', 
                   isActive: true, isVerified: true 
                }); 
             }}
             className="bg-black text-white px-6 py-2.5 text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
             <UserPlus size={16} />
             Create User
          </button>
        </div>
      </div>

      {/* Primary Filters & Search */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex bg-gray-100/50 p-1 rounded-xl gap-1 overflow-x-auto w-full lg:w-auto">
              {[
                { id: 'all', label: 'All Users' },
                { id: 'customer', label: 'Customers' },
                { id: 'vendor', label: 'Vendors' },
                { id: 'super_admin', label: 'Admins' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap rounded-lg",
                    roleFilter === tab.id ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {tab.label}
                </button>
              ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
             <div className="relative w-full lg:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 pr-4 py-3 w-full bg-white border border-gray-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                  />
             </div>
             
             <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                <select 
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="flex-1 sm:flex-none bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-black/5"
                >
                  <option value="all">Verification</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>

                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 sm:flex-none bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-black/5"
                >
                  <option value="all">Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Suspended</option>
                </select>

                <button 
                  onClick={() => fetchUsers()} 
                  className={cn(
                    "p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-black hover:bg-gray-50 transition-all shadow-sm",
                    loading && "animate-spin"
                  )}
                >
                   <RefreshCw size={18} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                   <th className="px-4 py-4 md:px-8 md:py-5">User Profile</th>
                   <th className="px-4 py-4 md:px-8 md:py-5">Role</th>
                   {isSuperAdmin && <th className="px-4 py-4 md:px-8 md:py-5"><div className="flex items-center gap-1.5"><Key size={10} /> Password</div></th>}
                   <th className="px-4 py-4 md:px-8 md:py-5 text-center">Verification</th>
                   <th className="px-4 py-4 md:px-8 md:py-5 text-center">Status</th>
                   <th className="px-4 py-4 md:px-8 md:py-5 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 6 : 5} className="p-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user: any) => (
                     <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                       <td className="px-4 py-4 md:px-8 md:py-5">
                          <div className="flex items-center gap-3 md:gap-4">
                             <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 text-xs overflow-hidden shrink-0">
                                {user.avatar ? (
                                  <img 
                                    src={typeof user.avatar === 'string' ? user.avatar : user.avatar.url} 
                                    alt={user.name || "User"} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  (user.name || "User").split(' ').map((n: string) => n[0]).join('').toUpperCase()
                                )}
                             </div>
                             <div>
                                <div className="font-bold text-gray-900 group-hover:text-black">{user.name}</div>
                                <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                   <Mail size={10} />
                                   {user.email && !user.email.includes('guest_') ? user.email : "Phone Authenticated"}
                                </div>
                                {(user.phone || (user.profile && user.profile.city)) && (
                                  <div className="text-[10px] text-gray-400 font-bold flex items-center gap-2 mt-1">
                                     {user.phone && <span className="flex items-center gap-1"><Phone size={10} /> {user.phone}</span>}
                                     {user.profile?.city && <span className="flex items-center gap-1 opacity-70">• {user.profile.city}</span>}
                                  </div>
                                )}
                             </div>
                          </div>
                       </td>
                       <td className="px-4 py-4 md:px-8 md:py-5">
                          <span className={cn(
                             "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5",
                             user.role === 'customer' ? 'bg-blue-50 text-blue-600' : 
                             user.role === 'vendor' ? 'bg-purple-50 text-purple-600' : 
                             'bg-amber-50 text-amber-600'
                          )}>
                             <div className={cn("h-1.5 w-1.5 rounded-full", 
                               user.role === 'customer' ? 'bg-blue-400' : 
                               user.role === 'vendor' ? 'bg-purple-400' : 
                               'bg-amber-400'
                             )} />
                             {user.role}
                          </span>
                       </td>
                       {isSuperAdmin && (
                        <td className="px-4 py-4 md:px-8 md:py-5">
                           <div className="flex items-center gap-2">
                              {user.plainTextPassword ? (
                                 <>
                                    <code className={cn(
                                      "text-xs font-mono px-2 py-1 rounded-lg border transition-all select-all",
                                      visiblePasswords[user.id] 
                                        ? "bg-amber-50 border-amber-200 text-amber-800" 
                                        : "bg-gray-50 border-gray-100 text-gray-400"
                                    )}>
                                      {visiblePasswords[user.id] ? user.plainTextPassword : '••••••••'}
                                    </code>
                                    <button
                                      onClick={() => togglePasswordVisibility(user.id)}
                                      className="p-1.5 text-gray-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                      title={visiblePasswords[user.id] ? 'Hide password' : 'Reveal password'}
                                    >
                                      {visiblePasswords[user.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                 </>
                              ) : (
                                 <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">N/A</span>
                              )}
                           </div>
                        </td>
                        )}
                       <td className="px-4 py-4 md:px-8 md:py-5 text-center">
                          <button 
                             onClick={() => toggleVerification(user.id, user.isVerified)}
                             className={cn(
                               "px-4 py-2 rounded-xl transition-all border inline-flex items-center gap-2",
                               user.isVerified 
                                ? "text-emerald-600 bg-emerald-50 border-emerald-100 font-bold text-[10px] uppercase tracking-wider" 
                                : "text-gray-300 border-gray-100 hover:text-amber-500 hover:bg-amber-50 hover:border-amber-100 font-bold text-[10px] uppercase tracking-wider"
                             )}
                          >
                             {user.isVerified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                             {user.isVerified ? "Verified" : "Unverified"}
                          </button>
                       </td>
                       <td className="px-4 py-4 md:px-8 md:py-5 text-center">
                           <div className="flex flex-col items-center gap-1">
                              <button 
                                onClick={() => toggleStatus(user.id, user.isActive)}
                                className={cn(
                                "px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer hover:opacity-80 active:scale-95",
                                user.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100' : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100'
                              )}>
                                 {user.isActive ? 'Active' : 'Suspended'}
                              </button>
                           </div>
                       </td>
                       <td className="px-4 py-4 md:px-8 md:py-5 text-right">
                          <div className="flex justify-end gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                               className="p-2.5 text-blue-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all" 
                               onClick={() => router.push(`/admin/users/${user.id}`)}
                               title="View User Details"
                             >
                                 <Eye size={16} />
                             </button>
                             <button 
                               className="p-2.5 text-gray-400 hover:text-black hover:bg-white hover:shadow-md rounded-xl transition-all" 
                               onClick={() => { 
                                 setEditingUser(user); 
                                 setFormData({ 
                                    name: user.name || '', 
                                    email: user.email || '', 
                                    password: '', 
                                    phone: user.phone || '',
                                    role: user.role || 'customer', 
                                    city: user.profile?.city || '',
                                    country: user.profile?.country || 'India',
                                    isActive: user.isActive, 
                                    isVerified: user.isVerified 
                                 }); 
                               }}
                               title="Edit User"
                             >
                                 <Settings2 size={16} />
                             </button>
                             <button 
                               className="p-2.5 text-rose-300 hover:text-rose-600 hover:bg-white hover:shadow-md rounded-xl transition-all" 
                               onClick={() => handleDelete(user.id)}
                               title="Delete User"
                             >
                                 <Trash2 size={16} />
                             </button>
                          </div>
                       </td>
                     </tr>
                  ))
                ) : (
                  <tr><td colSpan={isSuperAdmin ? 6 : 5} className="p-32 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No matching users found</td></tr>
                )}
             </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-gray-50/50 border-t border-gray-100 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Showing <span className="text-black">{(page - 1) * limit + 1}</span> to <span className="text-black">{Math.min(page * limit, totalResults)}</span> of <span className="text-black">{totalResults}</span> records
           </div>

           <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-black hover:border-black disabled:opacity-30 transition-all shadow-sm"
              >
                 <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = page;
                    if (totalPages <= 5) pageNum = i + 1;
                    else {
                      if (page <= 3) pageNum = i + 1;
                      else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "w-10 h-10 rounded-xl text-xs font-bold transition-all",
                          page === pageNum 
                            ? "bg-black text-white shadow-sm" 
                            : "bg-white border border-gray-200 text-gray-500 hover:border-black hover:text-black"
                        )}
                      >
                        {pageNum}
                      </button>
                    )
                 })}
              </div>

              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading}
                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-black hover:border-black disabled:opacity-30 transition-all shadow-sm"
              >
                 <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setEditingUser(null)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
               <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      {editingUser === true ? 'New User' : 'Edit User'}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">User Management System</p>
                  </div>
                  <button onClick={() => setEditingUser(null)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-colors">
                     <X size={20} />
                  </button>
               </div>
                <form onSubmit={handleUpdateUser} className="p-8 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                         <input 
                            type="text" 
                            required
                            placeholder="Enter full name"
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-medium text-gray-900 transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                         <input 
                            type="email" 
                            required
                            disabled={editingUser !== true}
                            placeholder="email@example.com"
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-medium text-gray-900 disabled:opacity-50 transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {isSuperAdmin && (
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                            {editingUser === true ? 'Initial Password' : 'Reset Password (Optional)'}
                         </label>
                         <input 
                            type="password" 
                            required={editingUser === true}
                            placeholder="••••••••"
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-medium text-gray-900 transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                         />
                      </div>
                      )}
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                         <input 
                            type="tel" 
                            placeholder="10-digit mobile number"
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-medium text-gray-900 transition-all"
                            value={formData.phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setFormData({ ...formData, phone: val });
                            }}
                            maxLength={10}
                            minLength={10}
                            pattern="[0-9]{10}"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">User Role</label>
                          <select 
                             className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-bold text-gray-900 transition-all cursor-pointer"
                             value={formData.role}
                             onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          >
                             <optgroup label="Core Platform">
                                <option value="customer">Customer (Standard access)</option>
                                <option value="vendor">Vendor (Partner access)</option>
                             </optgroup>
                             <optgroup label="System Administration">
                                <option value="super_admin">Super Admin (Master access to all modules and system controls)</option>
                                <option value="tech_admin">Tech Admin (Access to system integrity, audit logs, and controls)</option>
                                <option value="platform_admin">Platform Admin (Access to users, vendors, trips, and reports)</option>
                             </optgroup>
                             <optgroup label="Operations & Support">
                                <option value="finance_admin">Finance Admin (Access to the finance hub, analytics, and reports)</option>
                                <option value="growth_admin">Growth Admin (Access to growth engine and promo codes)</option>
                                <option value="support_admin">Support Admin (Access to the support system and inquiries)</option>
                                <option value="operations_admin">Operations Admin (Access to bookings, trips, and reviews)</option>
                                <option value="onboarding_admin">Onboarding Admin (Access to vendor onboarding and KYC checks)</option>
                                <option value="content_admin">Content Admin (Access to vlog and vibe content management)</option>
                             </optgroup>
                          </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Status</label>
                         <select 
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-bold text-gray-900 transition-all cursor-pointer"
                            value={formData.isActive ? 'active' : 'inactive'}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                         >
                            <option value="active">Active Access</option>
                            <option value="inactive">Suspended / Locked</option>
                         </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                         <input 
                            type="text" 
                            placeholder="e.g. Mumbai"
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-medium text-gray-900 transition-all"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Country</label>
                         <input 
                            type="text" 
                            placeholder="e.g. India"
                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-medium text-gray-900 transition-all"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                         />
                      </div>
                   </div>

                   <div className="pt-6">
                      <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                         {editingUser === true ? <UserPlus size={18} /> : <Settings2 size={18} />}
                         {editingUser === true ? 'Initialize User' : 'Commit Changes'}
                      </button>
                   </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagementPage;
