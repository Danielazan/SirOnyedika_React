

// // src/pages/admin/user-management/UserManagementPage.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // User Management page — two tabs: Admin Accounts | Regular Users.
// //
// // Admin tab  → create / update role / deactivate / reactivate / delete admins
// // Users tab  → deactivate / reactivate / delete regular user accounts
// //
// // All destructive actions go through a confirmation modal.
// // Role-aware: non-super_admin sees the page but write actions are blocked by
// // the backend (403). The UI still renders so they can view the list.
// // ─────────────────────────────────────────────────────────────────────────────

// import React, { useState, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ShieldCheck, Users, UserPlus, Search, ChevronDown,
//   Edit2, Trash2, PowerOff, CheckCircle, X, AlertTriangle,
//   RefreshCw, Mail, Phone,
// } from 'lucide-react';

// import {
//   getAdmins, createAdmin, updateAdmin,
//   deactivateAdmin, reactivateAdmin, deleteAdmin,
//   getUsers, deactivateUser, reactivateUser, deleteUser,
// } from '../../../api/admin.api';
// import DataTable   from '../../../components/admin/DataTable';
// import Pagination  from '../../../components/admin/Pagination';
// import StatusBadge from '../../../components/admin/StatusBadge';
// import { containerVariants, itemVariants } from '../../../utils/animation';

// // ─── Constants ────────────────────────────────────────────────────────────────

// // FIXED: Must match backend User.model.js ENUM exactly
// const ADMIN_ROLES = [
//   'ecommerce_manager',
//   'product_admin',
//   'marketing_admin',
//   'customer_support',
//   'finance_admin',
//   'it_admin',
//   'fulfillment_staff',
// ];

// const TABS = [
//   { key: 'admins', label: 'Admin Accounts', icon: ShieldCheck },
//   { key: 'users',  label: 'Regular Users',  icon: Users       },
// ];

// const STATUS_OPTS = ['All', 'Active', 'Inactive'];

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function roleLabel(r) {
//   return r ? r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';
// }

// function initials(name = '') {
//   return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function Avatar({ name, src }) {
//   if (src) {
//     return <img src={src} alt={name} className="w-8 h-8 rounded-full object-cover shrink-0" />;
//   }
//   return (
//     <div className="w-8 h-8 rounded-full bg-[#fce5e0] text-[#8f3320] text-xs font-bold flex items-center justify-center shrink-0">
//       {initials(name)}
//     </div>
//   );
// }

// /** Generic confirm / alert modal */
// function ConfirmModal({ open, title, message, danger, onConfirm, onCancel, loading }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
//       >
//         <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-50' : 'bg-[#fdf2f0]'}`}>
//           <AlertTriangle size={22} className={danger ? 'text-red-500' : 'text-[#AE3E27]'} />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>
//         <p className="text-sm text-gray-500 text-center mt-2 mb-6">{message}</p>
//         <div className="flex gap-3">
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
//               danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#AE3E27] hover:bg-[#8f3320]'
//             }`}
//           >
//             {loading && <RefreshCw size={14} className="animate-spin" />}
//             Confirm
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// /** Create / Edit Admin form modal */
// function AdminFormModal({ open, onClose, onSave, existing }) {
//   const isEdit = Boolean(existing);
//   const [form, setForm]     = useState({ name: '', email: '', phone: '', adminRole: ADMIN_ROLES[0] });
//   const [loading, setLoading] = useState(false);
//   const [error, setError]   = useState('');

//   useEffect(() => {
//     if (existing) {
//       setForm({ name: existing.name || '', email: existing.email || '', phone: existing.phone || '', adminRole: existing.adminRole || ADMIN_ROLES[0] });
//     } else {
//       setForm({ name: '', email: '', phone: '', adminRole: ADMIN_ROLES[0] });
//     }
//     setError('');
//   }, [existing, open]);

//   const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const handleSubmit = async () => {
//     if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
//     setLoading(true); setError('');
//     try {
//       await onSave(form);
//       onClose();
//     } catch (err) {
//       setError(err?.response?.data?.error || 'Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//         className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="text-lg font-semibold text-gray-900">
//             {isEdit ? 'Edit Admin' : 'Create Admin Account'}
//           </h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X size={20} />
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <div className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
//             <input
//               value={form.name}
//               onChange={set('name')}
//               placeholder="e.g. Jane Smith"
//               className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27]"
//             />
//           </div>

//           {/* Email — readonly on edit */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
//             <input
//               type="email"
//               value={form.email}
//               onChange={set('email')}
//               disabled={isEdit}
//               placeholder="e.g. jane@atelierselvedge.com"
//               className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27] ${isEdit ? 'bg-gray-50 text-gray-400' : ''}`}
//             />
//             {isEdit && <p className="text-xs text-gray-400 mt-1">Email cannot be changed after creation.</p>}
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Phone (optional)</label>
//             <input
//               value={form.phone}
//               onChange={set('phone')}
//               placeholder="+234 800 000 0000"
//               className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27]"
//             />
//           </div>

//           {/* Role */}
//           <div>
//             <label className="block text-xs font-medium text-gray-600 mb-1">Admin Role *</label>
//             <select
//               value={form.adminRole}
//               onChange={set('adminRole')}
//               className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27] bg-white"
//             >
//               {ADMIN_ROLES.map((r) => (
//                 <option key={r} value={r}>{roleLabel(r)}</option>
//               ))}
//             </select>
//           </div>

//           {!isEdit && (
//             <p className="text-xs text-gray-400 bg-[#fdf2f0] border border-orange-100 rounded-xl px-3 py-2">
//               A temporary password will be emailed to the new admin. They must change it on first login.
//             </p>
//           )}
//         </div>

//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="flex-1 px-4 py-2.5 rounded-xl bg-[#AE3E27] text-white text-sm font-medium hover:bg-[#8f3320] transition-colors flex items-center justify-center gap-2"
//           >
//             {loading && <RefreshCw size={14} className="animate-spin" />}
//             {isEdit ? 'Save Changes' : 'Create Admin'}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// // ─── Admin Accounts Tab ───────────────────────────────────────────────────────

// function AdminsTab() {
//   const [admins,  setAdmins]  = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page,    setPage]    = useState(1);
//   const [pages,   setPages]   = useState(1);
//   const [search,  setSearch]  = useState('');
//   const [status,  setStatus]  = useState('');
//   const [statOpen, setStatOpen] = useState(false);

//   // Form modal
//   const [formOpen,    setFormOpen]    = useState(false);
//   const [editTarget,  setEditTarget]  = useState(null);

//   // Confirm modal
//   const [confirmOpen,   setConfirmOpen]   = useState(false);
//   const [confirmConfig, setConfirmConfig] = useState({});
//   const [actionLoading, setActionLoading] = useState(false);

//   const [toast, setToast] = useState(null);
//   const showToast = (msg, type = 'success') => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await getAdmins({ page, search, status: status || undefined });
//       const list = res?.data ?? [];
//       const meta = res?.pagination ?? {};
//       setAdmins(list);
//       setPages(meta.pages ?? 1);
//     } catch {
//       setAdmins([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, status]);

//   useEffect(() => { load(); }, [load]);

//   // ── Actions ──────────────────────────────────────────────────────────────────

//   const openConfirm = (cfg) => { setConfirmConfig(cfg); setConfirmOpen(true); };

//   const handleCreate = async (form) => {
//     await createAdmin(form);
//     showToast('Admin account created. Welcome email sent.');
//     load();
//   };

//   const handleEdit = async (form) => {
//     await updateAdmin(editTarget.id, { adminRole: form.adminRole, name: form.name, phone: form.phone });
//     showToast('Admin updated.');
//     load();
//   };

//   const handleDeactivate = (row) => openConfirm({
//     title:   'Deactivate Admin',
//     message: `Deactivate ${row.name}? They will lose panel access immediately.`,
//     danger:  false,
//     onConfirm: async () => {
//       setActionLoading(true);
//       try { await deactivateAdmin(row.id); showToast('Admin deactivated.'); load(); }
//       catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
//       finally { setActionLoading(false); setConfirmOpen(false); }
//     },
//   });

//   const handleReactivate = (row) => openConfirm({
//     title:   'Reactivate Admin',
//     message: `Restore panel access for ${row.name}?`,
//     danger:  false,
//     onConfirm: async () => {
//       setActionLoading(true);
//       try { await reactivateAdmin(row.id); showToast('Admin reactivated.'); load(); }
//       catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
//       finally { setActionLoading(false); setConfirmOpen(false); }
//     },
//   });

//   const handleDelete = (row) => openConfirm({
//     title:   'Delete Admin Account',
//     message: `Permanently delete ${row.name}'s account? This cannot be undone.`,
//     danger:  true,
//     onConfirm: async () => {
//       setActionLoading(true);
//       try { await deleteAdmin(row.id); showToast('Admin deleted.'); load(); }
//       catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
//       finally { setActionLoading(false); setConfirmOpen(false); }
//     },
//   });

//   // ── Columns ───────────────────────────────────────────────────────────────────

//   const COLUMNS = [
//     {
//       key: 'name', header: 'Admin',
//       render: (v, row) => (
//         <div className="flex items-center gap-2.5">
//           <Avatar name={v} src={row.avatar} />
//           <div>
//             <p className="font-medium text-gray-800 text-sm">{v}</p>
//             <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={10} />{row.email}</p>
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: 'adminRole', header: 'Role',
//       render: (v) => (
//         <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#fdf2f0] text-[#8f3320]">
//           {roleLabel(v)}
//         </span>
//       ),
//     },
//     {
//       key: 'phone', header: 'Phone',
//       render: (v) => v
//         ? <span className="text-gray-500 text-xs flex items-center gap-1"><Phone size={10} />{v}</span>
//         : <span className="text-gray-300 text-xs">—</span>,
//     },
//     {
//       key: 'isActive', header: 'Status',
//       render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} />,
//     },
//     {
//       key: 'createdAt', header: 'Created',
//       render: (v) => <span className="text-gray-400 text-xs">{v ? new Date(v).toLocaleDateString() : '—'}</span>,
//     },
//     {
//       key: '_actions', header: 'Actions',
//       render: (_, row) => (
//         <div className="flex items-center gap-1">
//           {/* Edit */}
//           <button
//             title="Edit"
//             onClick={() => { setEditTarget(row); setFormOpen(true); }}
//             className="p-1.5 rounded-lg text-gray-400 hover:text-[#AE3E27] hover:bg-[#fdf2f0] transition-colors"
//           >
//             <Edit2 size={15} />
//           </button>
//           {/* Deactivate / Reactivate */}
//           {row.isActive ? (
//             <button
//               title="Deactivate"
//               onClick={() => handleDeactivate(row)}
//               className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
//             >
//               <PowerOff size={15} />
//             </button>
//           ) : (
//             <button
//               title="Reactivate"
//               onClick={() => handleReactivate(row)}
//               className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
//             >
//               <CheckCircle size={15} />
//             </button>
//           )}
//           {/* Delete */}
//           <button
//             title="Delete"
//             onClick={() => handleDelete(row)}
//             className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
//           >
//             <Trash2 size={15} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Toolbar */}
//       <div className="flex flex-wrap items-center gap-3 mb-4">
//         {/* Search */}
//         <div className="relative flex-1 min-w-[200px] max-w-xs">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//             placeholder="Search admins…"
//             className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27]"
//           />
//         </div>

//         {/* Status filter */}
//         <div className="relative">
//           <button
//             onClick={() => setStatOpen((v) => !v)}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 min-w-[120px] justify-between"
//           >
//             {status || 'Status'}
//             <ChevronDown size={14} className={`transition-transform ${statOpen ? 'rotate-180' : ''}`} />
//           </button>
//           {statOpen && (
//             <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-100 shadow-lg rounded-xl py-1 min-w-[130px]">
//               {STATUS_OPTS.map((opt) => (
//                 <button
//                   key={opt}
//                   onClick={() => { setStatus(opt === 'All' ? '' : opt.toLowerCase()); setPage(1); setStatOpen(false); }}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27] transition-colors"
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Create button */}
//         <button
//           onClick={() => { setEditTarget(null); setFormOpen(true); }}
//           className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#AE3E27] text-white text-sm font-medium hover:bg-[#8f3320] transition-colors"
//         >
//           <UserPlus size={16} />
//           New Admin
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//         <DataTable columns={COLUMNS} data={admins} loading={loading} rowKey="id" emptyMessage="No admin accounts found." skeletonRows={5} />
//         {!loading && pages > 1 && (
//           <div className="px-4 pb-4">
//             <Pagination page={page} pages={pages} onChange={setPage} />
//           </div>
//         )}
//       </div>

//       {/* Form modal */}
//       <AnimatePresence>
//         {formOpen && (
//           <AdminFormModal
//             open={formOpen}
//             existing={editTarget}
//             onClose={() => { setFormOpen(false); setEditTarget(null); }}
//             onSave={editTarget ? handleEdit : handleCreate}
//           />
//         )}
//       </AnimatePresence>

//       {/* Confirm modal */}
//       <AnimatePresence>
//         {confirmOpen && (
//           <ConfirmModal
//             open={confirmOpen}
//             title={confirmConfig.title}
//             message={confirmConfig.message}
//             danger={confirmConfig.danger}
//             loading={actionLoading}
//             onConfirm={confirmConfig.onConfirm}
//             onCancel={() => setConfirmOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Toast */}
//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             key="toast"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 30 }}
//             className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${
//               toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
//             }`}
//           >
//             {toast.msg}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// // ─── Regular Users Tab ────────────────────────────────────────────────────────

// function UsersTab() {
//   const [users,   setUsers]   = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page,    setPage]    = useState(1);
//   const [pages,   setPages]   = useState(1);
//   const [search,  setSearch]  = useState('');
//   const [status,  setStatus]  = useState('');
//   const [statOpen, setStatOpen] = useState(false);

//   const [confirmOpen,   setConfirmOpen]   = useState(false);
//   const [confirmConfig, setConfirmConfig] = useState({});
//   const [actionLoading, setActionLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   const showToast = (msg, type = 'success') => {
//     setToast({ msg, type }); setTimeout(() => setToast(null), 3500);
//   };

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await getUsers({ page, search, status: status || undefined });
//       const list = res?.data ?? [];
//       const meta = res?.pagination ?? {};
//       setUsers(list);
//       setPages(meta.pages ?? 1);
//     } catch {
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, search, status]);

//   useEffect(() => { load(); }, [load]);

//   const openConfirm = (cfg) => { setConfirmConfig(cfg); setConfirmOpen(true); };

//   const handleDeactivate = (row) => openConfirm({
//     title: 'Deactivate User',
//     message: `Deactivate ${row.name}'s account? They won't be able to log in.`,
//     danger: false,
//     onConfirm: async () => {
//       setActionLoading(true);
//       try { await deactivateUser(row.id); showToast('User deactivated.'); load(); }
//       catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
//       finally { setActionLoading(false); setConfirmOpen(false); }
//     },
//   });

//   const handleReactivate = (row) => openConfirm({
//     title: 'Reactivate User',
//     message: `Restore access for ${row.name}?`,
//     danger: false,
//     onConfirm: async () => {
//       setActionLoading(true);
//       try { await reactivateUser(row.id); showToast('User reactivated.'); load(); }
//       catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
//       finally { setActionLoading(false); setConfirmOpen(false); }
//     },
//   });

//   const handleDelete = (row) => openConfirm({
//     title: 'Delete User Account',
//     message: `Permanently delete ${row.name}'s account? Order history will be retained but the account will be gone.`,
//     danger: true,
//     onConfirm: async () => {
//       setActionLoading(true);
//       try { await deleteUser(row.id); showToast('User deleted.'); load(); }
//       catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
//       finally { setActionLoading(false); setConfirmOpen(false); }
//     },
//   });

//   const COLUMNS = [
//     {
//       key: 'name', header: 'User',
//       render: (v, row) => (
//         <div className="flex items-center gap-2.5">
//           <Avatar name={v} src={row.avatar} />
//           <div>
//             <p className="font-medium text-gray-800 text-sm">{v}</p>
//             <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={10} />{row.email}</p>
//           </div>
//         </div>
//       ),
//     },
//     { key: 'phone', header: 'Phone', render: (v) => <span className="text-gray-500 text-sm">{v || '—'}</span> },
//     { key: 'orders', header: 'Orders', render: (v) => <span className="font-medium text-gray-700">{v ?? 0}</span> },
//     {
//       key: 'isActive', header: 'Status',
//       render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} />,
//     },
//     {
//       key: 'createdAt', header: 'Joined',
//       render: (v) => <span className="text-gray-400 text-xs">{v ? new Date(v).toLocaleDateString() : '—'}</span>,
//     },
//     {
//       key: '_actions', header: 'Actions',
//       render: (_, row) => (
//         <div className="flex items-center gap-1">
//           {row.isActive ? (
//             <button title="Deactivate" onClick={() => handleDeactivate(row)}
//               className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors">
//               <PowerOff size={15} />
//             </button>
//           ) : (
//             <button title="Reactivate" onClick={() => handleReactivate(row)}
//               className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
//               <CheckCircle size={15} />
//             </button>
//           )}
//           <button title="Delete" onClick={() => handleDelete(row)}
//             className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
//             <Trash2 size={15} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Toolbar */}
//       <div className="flex flex-wrap items-center gap-3 mb-4">
//         <div className="relative flex-1 min-w-[200px] max-w-xs">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//             placeholder="Search users…"
//             className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27]"
//           />
//         </div>
//         <div className="relative">
//           <button onClick={() => setStatOpen((v) => !v)}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 min-w-[120px] justify-between">
//             {status || 'Status'}
//             <ChevronDown size={14} className={`transition-transform ${statOpen ? 'rotate-180' : ''}`} />
//           </button>
//           {statOpen && (
//             <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-100 shadow-lg rounded-xl py-1 min-w-[130px]">
//               {STATUS_OPTS.map((opt) => (
//                 <button key={opt} onClick={() => { setStatus(opt === 'All' ? '' : opt.toLowerCase()); setPage(1); setStatOpen(false); }}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27] transition-colors">
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//         <DataTable columns={COLUMNS} data={users} loading={loading} rowKey="id" emptyMessage="No users found." skeletonRows={6} />
//         {!loading && pages > 1 && (
//           <div className="px-4 pb-4"><Pagination page={page} pages={pages} onChange={setPage} /></div>
//         )}
//       </div>

//       <AnimatePresence>
//         {confirmOpen && (
//           <ConfirmModal open={confirmOpen} title={confirmConfig.title} message={confirmConfig.message}
//             danger={confirmConfig.danger} loading={actionLoading}
//             onConfirm={confirmConfig.onConfirm} onCancel={() => setConfirmOpen(false)} />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {toast && (
//           <motion.div key="toast" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
//             className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
//             {toast.msg}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function UserManagementPage() {
//   const [activeTab, setActiveTab] = useState('admins');

//   return (
//     <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
//       {/* Page header */}
//       <motion.div variants={itemVariants}>
//         <h1 className="text-xl font-bold text-gray-900">User Management</h1>
//         <p className="text-sm text-gray-500 mt-0.5">Manage admin accounts and regular users across the platform.</p>
//       </motion.div>

//       {/* Tab bar */}
//       <motion.div variants={itemVariants} className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
//         {TABS.map(({ key, label, icon: Icon }) => (
//           <button
//             key={key}
//             onClick={() => setActiveTab(key)}
//             className={[
//               'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
//               activeTab === key
//                 ? 'bg-white text-[#AE3E27] shadow-sm'
//                 : 'text-gray-500 hover:text-gray-700',
//             ].join(' ')}
//           >
//             <Icon size={16} />
//             {label}
//           </button>
//         ))}
//       </motion.div>

//       {/* Tab content */}
//       <motion.div variants={itemVariants} key={activeTab}>
//         {activeTab === 'admins' ? <AdminsTab /> : <UsersTab />}
//       </motion.div>
//     </motion.div>
//   );
// }

// src/pages/admin/user-management/UserManagementPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// User Management page — two tabs: Admin Accounts | Regular Users.
//
// Admin tab  → create / update role / deactivate / reactivate / delete admins
// Users tab  → deactivate / reactivate / delete regular user accounts
//
// All destructive actions go through a confirmation modal.
// Role-aware: non-super_admin sees the page but write actions are blocked by
// the backend (403). The UI still renders so they can view the list.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Users, UserPlus, Search,
  Edit2, Trash2, PowerOff, CheckCircle, X, AlertTriangle,
  RefreshCw, Mail, Phone, Lock, UserCheck, UserX, Crown,
} from 'lucide-react';

import {
  getAdmins, createAdmin, updateAdmin,
  deactivateAdmin, reactivateAdmin, deleteAdmin,
  getUsers, deactivateUser, reactivateUser, deleteUser,
} from '../../../api/admin.api';
import Pagination  from '../../../components/admin/Pagination';
import StatusBadge from '../../../components/admin/StatusBadge';
import { containerVariants, itemVariants } from '../../../utils/animation';

// ─── Constants ────────────────────────────────────────────────────────────────

const ADMIN_ROLES = [
  'ecommerce_manager',
  'product_admin',
  'marketing_admin',
  'customer_support',
  'finance_admin',
  'it_admin',
  'fulfillment_staff',
];

const TABS = [
  { key: 'admins', label: 'Admin Accounts', icon: ShieldCheck },
  { key: 'users',  label: 'Regular Users',  icon: Users       },
];

const FILTER_OPTS = ['All', 'Active', 'Inactive'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function roleLabel(r) {
  return r ? r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';
}

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, src }) {
  if (src) {
    return <img src={src} alt={name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100" />;
  }
  return (
    <div className="w-9 h-9 rounded-full bg-[#fce5e0] text-[#8f3320] text-xs font-bold flex items-center justify-center shrink-0 border border-[#f8cec7]">
      {initials(name)}
    </div>
  );
}

/** Stat card */
function StatCard({ icon: Icon, label, value, color = 'orange' }) {
  const colorMap = {
    orange: 'bg-[#fdf2f0] text-[#AE3E27]',
    green:  'bg-green-50 text-green-600',
    red:    'bg-red-50 text-red-600',
    blue:   'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.orange}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

/** Confirm modal */
function ConfirmModal({ open, title, message, danger, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-50' : 'bg-[#fdf2f0]'}`}>
          <AlertTriangle size={22} className={danger ? 'text-red-500' : 'text-[#AE3E27]'} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>
        <p className="text-sm text-gray-500 text-center mt-2 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#AE3E27] hover:bg-[#8f3320]'
            }`}
          >
            {loading && <RefreshCw size={14} className="animate-spin" />}
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/** Create / Edit Admin form modal */
function AdminFormModal({ open, onClose, onSave, existing }) {
  const isEdit = Boolean(existing);
  const [form, setForm]     = useState({ name: '', email: '', phone: '', adminRole: ADMIN_ROLES[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (existing) {
      setForm({ name: existing.name || '', email: existing.email || '', phone: existing.phone || '', adminRole: existing.adminRole || ADMIN_ROLES[0] });
    } else {
      setForm({ name: '', email: '', phone: '', adminRole: ADMIN_ROLES[0] });
    }
    setError('');
  }, [existing, open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    setLoading(true); setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Admin' : 'Create Admin Account'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
            <input
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Jane Smith"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              disabled={isEdit}
              placeholder="e.g. jane@atelierselvedge.com"
              className={`w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27] ${isEdit ? 'bg-gray-50 text-gray-400' : ''}`}
            />
            {isEdit && <p className="text-xs text-gray-400 mt-1">Email cannot be changed after creation.</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone (optional)</label>
            <input
              value={form.phone}
              onChange={set('phone')}
              placeholder="+234 800 000 0000"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Admin Role *</label>
            <select
              value={form.adminRole}
              onChange={set('adminRole')}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27] bg-white"
            >
              {ADMIN_ROLES.map((r) => (
                <option key={r} value={r}>{roleLabel(r)}</option>
              ))}
            </select>
          </div>

          {!isEdit && (
            <p className="text-xs text-gray-400 bg-[#fdf2f0] border border-orange-100 rounded-xl px-3 py-2">
              A temporary password will be emailed to the new admin. They must change it on first login.
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#AE3E27] text-white text-sm font-medium hover:bg-[#8f3320] transition-colors flex items-center justify-center gap-2"
          >
            {loading && <RefreshCw size={14} className="animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Admin'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Admin Accounts Tab ───────────────────────────────────────────────────────

function AdminsTab() {
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [pages,   setPages]   = useState(1);
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('');

  // Stats
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, mustChange: 0 });

  // Form modal
  const [formOpen,    setFormOpen]    = useState(false);
  const [editTarget,  setEditTarget]  = useState(null);

  // Confirm modal
  const [confirmOpen,   setConfirmOpen]   = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdmins({ page, search, status: status || undefined });
      const list = res?.data ?? [];
      const meta = res?.pagination ?? {};
      setAdmins(list);
      setPages(meta.pages ?? 1);
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  const loadStats = useCallback(async () => {
    try {
      const [allRes, activeRes, inactiveRes] = await Promise.all([
        getAdmins({ page: 1, limit: 1 }),
        getAdmins({ page: 1, limit: 1, status: 'active' }),
        getAdmins({ page: 1, limit: 1, status: 'inactive' }),
      ]);
      setStats((s) => ({
        ...s,
        total:    allRes.pagination?.total    || 0,
        active:   activeRes.pagination?.total   || 0,
        inactive: inactiveRes.pagination?.total || 0,
      }));
    } catch { /* silent */ }
  }, []);

  useEffect(() => { load(); loadStats(); }, [load, loadStats]);

  // Update mustChange count whenever admins data changes
  useEffect(() => {
    setStats((s) => ({
      ...s,
      mustChange: admins.filter((a) => a.mustChangePassword).length,
    }));
  }, [admins]);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const openConfirm = (cfg) => { setConfirmConfig(cfg); setConfirmOpen(true); };

  const handleCreate = async (form) => {
    await createAdmin(form);
    showToast('Admin account created. Welcome email sent.');
    load(); loadStats();
  };

  const handleEdit = async (form) => {
    await updateAdmin(editTarget.id, { adminRole: form.adminRole, name: form.name, phone: form.phone });
    showToast('Admin updated.');
    load();
  };

  const handleDeactivate = (row) => openConfirm({
    title:   'Deactivate Admin',
    message: `Deactivate ${row.name}? They will lose panel access immediately.`,
    danger:  false,
    onConfirm: async () => {
      setActionLoading(true);
      try { await deactivateAdmin(row.id); showToast('Admin deactivated.'); load(); loadStats(); }
      catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
      finally { setActionLoading(false); setConfirmOpen(false); }
    },
  });

  const handleReactivate = (row) => openConfirm({
    title:   'Reactivate Admin',
    message: `Restore panel access for ${row.name}?`,
    danger:  false,
    onConfirm: async () => {
      setActionLoading(true);
      try { await reactivateAdmin(row.id); showToast('Admin reactivated.'); load(); loadStats(); }
      catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
      finally { setActionLoading(false); setConfirmOpen(false); }
    },
  });

  const handleDelete = (row) => openConfirm({
    title:   'Delete Admin Account',
    message: `Permanently delete ${row.name}'s account? This cannot be undone.`,
    danger:  true,
    onConfirm: async () => {
      setActionLoading(true);
      try { await deleteAdmin(row.id); showToast('Admin deleted.'); load(); loadStats(); }
      catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
      finally { setActionLoading(false); setConfirmOpen(false); }
    },
  });

  const COLUMNS = [
    {
      key: 'name', header: 'Admin',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={v} src={row.avatarUrl} />
          <div>
            <p className="font-medium text-gray-900 text-sm">{v}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={10} />{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'adminRole', header: 'Role',
      render: (v) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#fdf2f0] text-[#8f3320] border border-orange-100">
          {roleLabel(v)}
        </span>
      ),
    },
    {
      key: 'phone', header: 'Phone',
      render: (v) => v
        ? <span className="text-gray-600 text-xs flex items-center gap-1"><Phone size={10} />{v}</span>
        : <span className="text-gray-300 text-xs">—</span>,
    },
    {
      key: 'isActive', header: 'Status',
      render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} />,
    },
    {
      key: 'createdAt', header: 'Created',
      render: (v) => <span className="text-gray-500 text-xs">{v ? new Date(v).toLocaleDateString() : '—'}</span>,
    },
    {
      key: '_actions', header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            title="Edit"
            onClick={() => { setEditTarget(row); setFormOpen(true); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#AE3E27] hover:bg-[#fdf2f0] transition-colors"
          >
            <Edit2 size={15} />
          </button>
          {row.isActive ? (
            <button
              title="Deactivate"
              onClick={() => handleDeactivate(row)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
            >
              <PowerOff size={15} />
            </button>
          ) : (
            <button
              title="Reactivate"
              onClick={() => handleReactivate(row)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
            >
              <CheckCircle size={15} />
            </button>
          )}
          <button
            title="Delete"
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Admins" value={stats.total} color="orange" />
        <StatCard icon={UserCheck} label="Active" value={stats.active} color="green" />
        <StatCard icon={UserX} label="Inactive" value={stats.inactive} color="red" />
        <StatCard icon={Lock} label="Must Change Password" value={stats.mustChange} color="purple" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search admins…"
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27] bg-white"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {FILTER_OPTS.map((opt) => {
            const val = opt === 'All' ? '' : opt.toLowerCase();
            const active = status === val;
            return (
              <button
                key={opt}
                onClick={() => { setStatus(val); setPage(1); }}
                className={[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-[#AE3E27] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50',
                ].join(' ')}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
          className="sm:ml-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#AE3E27] text-white text-sm font-medium hover:bg-[#8f3320] transition-colors shadow-sm"
        >
          <UserPlus size={16} />
          New Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-[#AE3E27] text-white">
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-semibold whitespace-nowrap text-xs uppercase tracking-wide">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="bg-white">
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                admins.map((row) => (
                  <tr key={row.id} className="bg-white hover:bg-[#fdf2f0]/30 transition-colors">
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100">
            <Pagination page={page} pages={pages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {formOpen && (
          <AdminFormModal
            open={formOpen}
            existing={editTarget}
            onClose={() => { setFormOpen(false); setEditTarget(null); }}
            onSave={editTarget ? handleEdit : handleCreate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmOpen && (
          <ConfirmModal
            open={confirmOpen}
            title={confirmConfig.title}
            message={confirmConfig.message}
            danger={confirmConfig.danger}
            loading={actionLoading}
            onConfirm={confirmConfig.onConfirm}
            onCancel={() => setConfirmOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${
              toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Regular Users Tab ────────────────────────────────────────────────────────

function UsersTab() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [pages,   setPages]   = useState(1);
  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('');

  // Stats
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, verified: 0 });

  const [confirmOpen,   setConfirmOpen]   = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, search, status: status || undefined });
      const list = res?.data ?? [];
      const meta = res?.pagination ?? {};
      setUsers(list);
      setPages(meta.pages ?? 1);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  const loadStats = useCallback(async () => {
    try {
      const [allRes, activeRes, inactiveRes] = await Promise.all([
        getUsers({ page: 1, limit: 1 }),
        getUsers({ page: 1, limit: 1, status: 'active' }),
        getUsers({ page: 1, limit: 1, status: 'inactive' }),
      ]);
      setStats((s) => ({
        ...s,
        total:    allRes.pagination?.total    || 0,
        active:   activeRes.pagination?.total   || 0,
        inactive: inactiveRes.pagination?.total || 0,
      }));
    } catch { /* silent */ }
  }, []);

  useEffect(() => { load(); loadStats(); }, [load, loadStats]);

  useEffect(() => {
    setStats((s) => ({
      ...s,
      verified: users.filter((u) => u.isVerified).length,
    }));
  }, [users]);

  const openConfirm = (cfg) => { setConfirmConfig(cfg); setConfirmOpen(true); };

  const handleDeactivate = (row) => openConfirm({
    title: 'Deactivate User',
    message: `Deactivate ${row.name}'s account? They won't be able to log in.`,
    danger: false,
    onConfirm: async () => {
      setActionLoading(true);
      try { await deactivateUser(row.id); showToast('User deactivated.'); load(); loadStats(); }
      catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
      finally { setActionLoading(false); setConfirmOpen(false); }
    },
  });

  const handleReactivate = (row) => openConfirm({
    title: 'Reactivate User',
    message: `Restore access for ${row.name}?`,
    danger: false,
    onConfirm: async () => {
      setActionLoading(true);
      try { await reactivateUser(row.id); showToast('User reactivated.'); load(); loadStats(); }
      catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
      finally { setActionLoading(false); setConfirmOpen(false); }
    },
  });

  const handleDelete = (row) => openConfirm({
    title: 'Delete User Account',
    message: `Permanently delete ${row.name}'s account? This cannot be undone.`,
    danger: true,
    onConfirm: async () => {
      setActionLoading(true);
      try { await deleteUser(row.id); showToast('User deleted.'); load(); loadStats(); }
      catch (e) { showToast(e?.response?.data?.error || 'Failed.', 'error'); }
      finally { setActionLoading(false); setConfirmOpen(false); }
    },
  });

  const COLUMNS = [
    {
      key: 'name', header: 'User',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={v} src={row.avatarUrl} />
          <div>
            <p className="font-medium text-gray-900 text-sm">{v}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={10} />{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (v) => <span className="text-gray-600 text-sm">{v || '—'}</span> },
    {
      key: 'isActive', header: 'Status',
      render: (v) => <StatusBadge status={v ? 'active' : 'inactive'} />,
    },
    {
      key: 'isVerified', header: 'Verified',
      render: (v) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
          {v ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'createdAt', header: 'Joined',
      render: (v) => <span className="text-gray-500 text-xs">{v ? new Date(v).toLocaleDateString() : '—'}</span>,
    },
    {
      key: '_actions', header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          {row.isActive ? (
            <button title="Deactivate" onClick={() => handleDeactivate(row)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors">
              <PowerOff size={15} />
            </button>
          ) : (
            <button title="Reactivate" onClick={() => handleReactivate(row)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
              <CheckCircle size={15} />
            </button>
          )}
          <button title="Delete" onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Users" value={stats.total} color="orange" />
        <StatCard icon={UserCheck} label="Active" value={stats.active} color="green" />
        <StatCard icon={UserX} label="Inactive" value={stats.inactive} color="red" />
        <StatCard icon={Crown} label="Verified" value={stats.verified} color="blue" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users…"
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#AE3E27] bg-white"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {FILTER_OPTS.map((opt) => {
            const val = opt === 'All' ? '' : opt.toLowerCase();
            const active = status === val;
            return (
              <button
                key={opt}
                onClick={() => { setStatus(val); setPage(1); }}
                className={[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-[#AE3E27] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50',
                ].join(' ')}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-[#AE3E27] text-white">
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-semibold whitespace-nowrap text-xs uppercase tracking-wide">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="bg-white">
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((row) => (
                  <tr key={row.id} className="bg-white hover:bg-[#fdf2f0]/30 transition-colors">
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100">
            <Pagination page={page} pages={pages} onChange={setPage} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {confirmOpen && (
          <ConfirmModal open={confirmOpen} title={confirmConfig.title} message={confirmConfig.message}
            danger={confirmConfig.danger} loading={actionLoading}
            onConfirm={confirmConfig.onConfirm} onCancel={() => setConfirmOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState('admins');

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
      {/* Page header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage admin accounts and regular users across the platform.</p>
      </motion.div>

      {/* Tab bar */}
      <motion.div variants={itemVariants} className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={[
              'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              activeTab === key
                ? 'bg-white text-[#AE3E27] shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </motion.div>

      {/* Tab content */}
      <motion.div variants={itemVariants} key={activeTab}>
        {activeTab === 'admins' ? <AdminsTab /> : <UsersTab />}
      </motion.div>
    </motion.div>
  );
}