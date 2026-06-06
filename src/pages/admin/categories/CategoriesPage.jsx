

// // import React, { useState, useMemo, useEffect, useRef } from 'react';
// // import { useNavigate }      from 'react-router-dom';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import {
// //   Plus, Search, ChevronLeft, ChevronRight, Check, Pencil, Trash2, AlertTriangle, MoreHorizontal,
// // } from 'lucide-react';

// // import { useAdminCategories } from '../../../hooks/admin/useAdminData';
// // import { useAdminProducts }   from '../../../hooks/admin/useAdminData';
// // import { deleteCategory }     from '../../../api/categories.api';
// // import CategoryFormModal      from './CategoryFormModal';
// // import { formatCurrency }     from '../../../utils/formatCurrency';
// // import { containerVariants, itemVariants } from '../../../utils/animation';
// // import client                 from '../../../api/client';

// // // ═══════════════════════════════════════════════════════════════════════════════
// // //  Resolve relative image paths to full backend URLs
// // // ═══════════════════════════════════════════════════════════════════════════════
// // const API_BASE = (import.meta.env?.VITE_API_URL || client.defaults?.baseURL || 'http://localhost:1500/api')
// //   .replace(/\/api.*$/, '')
// //   .replace(/\/$/, '');

// // const resolveImageUrl = (path) => {
// //   if (!path) return null;
// //   if (path.startsWith('http')) return path;
// //   if (path.startsWith('data:')) return path;
// //   return `${API_BASE}${path}`;
// // };
// // // ═══════════════════════════════════════════════════════════════════════════════

// // // ── Confirm delete modal ──────────────────────────────────────────────────────
// // function ConfirmDeleteModal({ category, onConfirm, onCancel, loading, error }) {
// //   return (
// //     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
// //       <motion.div
// //         initial={{ opacity: 0, scale: 0.95, y: 10 }}
// //         animate={{ opacity: 1, scale: 1, y: 0 }}
// //         className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 w-full"
// //       >
// //         <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
// //           <AlertTriangle size={22} className="text-red-500" />
// //         </div>
// //         <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Category</h3>
// //         <p className="text-sm text-gray-500 text-center mb-2">
// //           Are you sure you want to delete <strong>{category?.name}</strong>?
// //         </p>
// //         <p className="text-xs text-[#AE3E27] text-center bg-[#fdf2f0] rounded-lg py-2 px-3 mb-4">
// //           Categories with subcategories cannot be deleted. Remove subcategories first.
// //         </p>
// //         {error && (
// //           <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4 text-center">{error}</p>
// //         )}
// //         <div className="flex gap-3">
// //           <button
// //             onClick={onCancel}
// //             className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             onClick={onConfirm}
// //             disabled={loading}
// //             className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
// //           >
// //             {loading ? 'Deleting…' : 'Delete'}
// //           </button>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // }

// // // ── Checkbox component ────────────────────────────────────────────────────────
// // function StyledCheckbox({ checked, onChange, label, actions }) {
// //   return (
// //     <div className="group flex items-center justify-between w-full rounded-lg hover:bg-gray-50 transition-colors">
// //       <button
// //         type="button"
// //         onClick={onChange}
// //         className="flex items-center gap-3 w-full text-left py-2 px-1"
// //       >
// //         <span className={[
// //           'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
// //           checked
// //             ? 'bg-[#AE3E27] border-[#AE3E27]'
// //             : 'border-gray-300 bg-white',
// //         ].join(' ')}>
// //           {checked && <Check size={12} className="text-white" strokeWidth={3} />}
// //         </span>
// //         <span className={['text-sm transition-colors truncate', checked ? 'text-gray-900 font-medium' : 'text-gray-600'].join(' ')}>
// //           {label}
// //         </span>
// //       </button>
// //       {/* Actions — visible on hover */}
// //       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
// //         {actions}
// //       </div>
// //     </div>
// //   );
// // }

// // // ── Parent category tab ───────────────────────────────────────────────────────
// // //  FIXED: Dropdown uses position:fixed. Outside-click handler now checks
// // //  BOTH the button AND the dropdown menu before closing, so clicking
// // //  Edit/Delete inside the menu doesn't prematurely remove the dropdown.
// // // ═══════════════════════════════════════════════════════════════════════════════
// // function ParentTab({ label, active, count, onClick, onEdit, onDelete }) {
// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const btnRef = useRef(null);
// //   const menuRef = useRef(null);
// //   const [pos, setPos] = useState({ top: 0, left: 0 });

// //   // Toggle menu + calculate fixed position from button rect
// //   const toggleMenu = (e) => {
// //     e.stopPropagation();
// //     if (!menuOpen && btnRef.current) {
// //       const rect = btnRef.current.getBoundingClientRect();
// //       setPos({ top: rect.bottom + 6, left: rect.left - 90 });
// //     }
// //     setMenuOpen((v) => !v);
// //   };

// //   // Close on outside click — BUT only if click is outside BOTH button and menu
// //   useEffect(() => {
// //     if (!menuOpen) return;
// //     const handler = (e) => {
// //       const inBtn = btnRef.current?.contains(e.target);
// //       const inMenu = menuRef.current?.contains(e.target);
// //       if (!inBtn && !inMenu) {
// //         setMenuOpen(false);
// //       }
// //     };
// //     document.addEventListener('mousedown', handler);
// //     return () => document.removeEventListener('mousedown', handler);
// //   }, [menuOpen]);

// //   // Handle edit/delete: close menu first, then fire action on next tick
// //   // so React has time to remove the dropdown before parent re-renders
// //   const handleAction = (action) => {
// //     setMenuOpen(false);
// //     setTimeout(() => action?.(), 10);
// //   };

// //   return (
// //     <>
// //       <div className="group relative flex items-center">
// //         <button
// //           onClick={onClick}
// //           className={[
// //             'flex items-center gap-1 text-sm font-medium whitespace-nowrap px-1 pb-2 transition-colors border-b-2',
// //             active
// //               ? 'text-gray-900 border-[#AE3E27]'
// //               : 'text-gray-400 border-transparent hover:text-gray-600',
// //           ].join(' ')}
// //         >
// //           {label}
// //           {count > 0 && (
// //             <span className="text-xs text-gray-400">({count})</span>
// //           )}
// //         </button>

// //         {/* "..." more button */}
// //         <button
// //           ref={btnRef}
// //           onClick={toggleMenu}
// //           className={[
// //             'ml-1 w-5 h-5 flex items-center justify-center rounded transition-all',
// //             menuOpen
// //               ? 'bg-gray-100 text-gray-700 opacity-100'
// //               : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600',
// //           ].join(' ')}
// //           title="Actions"
// //         >
// //           <MoreHorizontal size={14} />
// //         </button>
// //       </div>

// //       {/* FIXED DROPDOWN: position:fixed breaks out of overflow container */}
// //       {menuOpen && (
// //         <div
// //           ref={menuRef}
// //           className="fixed z-[100] bg-white border border-gray-100 shadow-xl rounded-xl py-1 min-w-[120px]"
// //           style={{ top: pos.top, left: pos.left }}
// //         >
// //           <button
// //             onClick={() => handleAction(onEdit)}
// //             className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27] transition-colors text-left"
// //           >
// //             <Pencil size={12} /> Edit
// //           </button>
// //           <button
// //             onClick={() => handleAction(onDelete)}
// //             className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
// //           >
// //             <Trash2 size={12} /> Delete
// //           </button>
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// // // ── Add Product Placeholder Card ──────────────────────────────────────────────
// // function AddProductCard({ onClick }) {
// //   return (
// //     <motion.div
// //       variants={itemVariants}
// //       onClick={onClick}
// //       className="border-2 border-dashed border-gray-300 rounded-2xl bg-white flex flex-col items-center justify-center
// //                  gap-3 p-6 cursor-pointer hover:border-[#AE3E27] hover:bg-[#fdf2f0]/30 transition-all
// //                  min-h-[260px]"
// //     >
// //       <div className="w-12 h-12 rounded-full bg-[#AE3E27] flex items-center justify-center shadow-sm">
// //         <Plus size={24} className="text-white" />
// //       </div>
// //       <p className="text-sm font-medium text-gray-700 text-center leading-snug">
// //         Add New Product<br />to Category
// //       </p>
// //     </motion.div>
// //   );
// // }

// // // ── Product Card ──────────────────────────────────────────────────────────────
// // //  DESIGN MATCH: Images are smaller, centered with padding, rounded-2xl.
// // //  They do NOT fill the full card width — white space surrounds them.
// // // ═══════════════════════════════════════════════════════════════════════════════
// // function ProductCard({ product }) {
// //   const imageSrc = resolveImageUrl(product.image);
// //   const price = product.price ?? product.variants?.[0]?.price;

// //   return (
// //     <motion.div
// //       variants={itemVariants}
// //       className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
// //     >
// //       {/* Image — centered, padded, fixed size, rounded-2xl */}
// //       <div className="p-5 pb-2 flex justify-center">
// //         {imageSrc ? (
// //           <img
// //             src={imageSrc}
// //             alt={product.name}
// //             className="w-36 h-36 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
// //           />
// //         ) : (
// //           <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
// //             <span className="text-2xl font-bold text-gray-200">
// //               {product.name?.charAt(0)?.toUpperCase() || '?'}
// //             </span>
// //           </div>
// //         )}
// //       </div>

// //       {/* Info */}
// //       <div className="px-5 pb-5 pt-1">
// //         <p className="text-sm text-gray-800 font-medium truncate">{product.name}</p>
// //         <p className="text-sm font-bold text-gray-900 mt-1">
// //           {price ? formatCurrency(price) : '—'}
// //         </p>
// //       </div>
// //     </motion.div>
// //   );
// // }

// // // ── Skeleton Product Card ─────────────────────────────────────────────────────
// // function SkeletonProductCard() {
// //   return (
// //     <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
// //       <div className="p-5 pb-2 flex justify-center">
// //         <div className="w-36 h-36 rounded-2xl bg-gray-100 animate-pulse" />
// //       </div>
// //       <div className="px-5 pb-5 pt-1 space-y-2">
// //         <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
// //         <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
// //       </div>
// //     </div>
// //   );
// // }

// // // ═══════════════════════════════════════════════════════════════════════════════
// // //  MAIN PAGE
// // // ═══════════════════════════════════════════════════════════════════════════════
// // export default function CategoriesPage() {
// //   const navigate = useNavigate();
// //   const [search, setSearch] = useState('');

// //   // Modal state
// //   const [modalOpen, setModalOpen]   = useState(false);
// //   const [editTarget, setEditTarget] = useState(null);

// //   // Delete state
// //   const [deleteTarget, setDeleteTarget] = useState(null);
// //   const [deleting, setDeleting]         = useState(false);
// //   const [deleteError, setDeleteError]   = useState('');

// //   // Category data
// //   const { data: categoryTree = [], loading: catLoading, refetch } = useAdminCategories();

// //   // Extract root categories for tabs
// //   const rootCategories = useMemo(() => {
// //     if (!Array.isArray(categoryTree)) return [];
// //     return categoryTree.filter((c) => !c.parentId);
// //   }, [categoryTree]);

// //   // Active parent tab
// //   const [activeParentId, setActiveParentId] = useState(() => {
// //     if (rootCategories.length > 0) {
// //       const men = rootCategories.find((c) => c.name.toLowerCase() === 'men');
// //       return men?.id || rootCategories[0]?.id;
// //     }
// //     return null;
// //   });

// //   useEffect(() => {
// //     if (rootCategories.length > 0 && !activeParentId) {
// //       const men = rootCategories.find((c) => c.name.toLowerCase() === 'men');
// //       setActiveParentId(men?.id || rootCategories[0]?.id);
// //     }
// //   }, [rootCategories, activeParentId]);

// //   const activeParent = useMemo(() =>
// //     rootCategories.find((c) => c.id === activeParentId),
// //   [rootCategories, activeParentId]);

// //   const subcategories = useMemo(() => {
// //     if (!activeParent) return [];
// //     return activeParent.children || [];
// //   }, [activeParent]);

// //   // Selected subcategory IDs
// //   const [selectedSubIds, setSelectedSubIds] = useState([]);

// //   useEffect(() => {
// //     if (subcategories.length > 0) {
// //       setSelectedSubIds([subcategories[0].id]);
// //     } else {
// //       setSelectedSubIds([]);
// //     }
// //   }, [activeParentId, subcategories]);

// //   const toggleSubcategory = (id) => {
// //     setSelectedSubIds((prev) =>
// //       prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
// //     );
// //   };

// //   // Category filter for products API
// //   const categoryFilter = useMemo(() => {
// //     if (selectedSubIds.length > 0) {
// //       const sub = subcategories.find((s) => s.id === selectedSubIds[0]);
// //       return sub?.name || '';
// //     }
// //     return activeParent?.name || '';
// //   }, [selectedSubIds, subcategories, activeParent]);

// //   // Fetch products
// //   const { products, loading: prodLoading } = useAdminProducts(1, search, categoryFilter);

// //   const isLoading = catLoading || prodLoading;

// //   // Tab scroll ref
// //   const tabsRef = useRef(null);
// //   const scrollTabs = (dir) => {
// //     if (tabsRef.current) {
// //       tabsRef.current.scrollBy({ left: dir * 120, behavior: 'smooth' });
// //     }
// //   };

// //   // ── Modal handlers ─────────────────────────────────────────────────────────
// //   const handleAddCategory = () => {
// //     setEditTarget(null);
// //     setModalOpen(true);
// //   };

// //   const handleEditCategory = (category) => {
// //     setEditTarget(category);
// //     setModalOpen(true);
// //   };

// //   const handleDeleteCategory = (category) => {
// //     setDeleteTarget(category);
// //     setDeleteError('');
// //   };

// //   const confirmDelete = async () => {
// //     if (!deleteTarget) return;
// //     setDeleting(true);
// //     setDeleteError('');
// //     try {
// //       await deleteCategory(deleteTarget.id);
// //       setDeleteTarget(null);
// //       // If we deleted the active parent, reset
// //       if (deleteTarget.id === activeParentId) {
// //         const remaining = rootCategories.filter((c) => c.id !== deleteTarget.id);
// //         setActiveParentId(remaining[0]?.id || null);
// //       }
// //       refetch?.();
// //     } catch (err) {
// //       const msg = err?.response?.data?.error || 'Failed to delete category.';
// //       setDeleteError(msg);
// //     } finally {
// //       setDeleting(false);
// //     }
// //   };

// //   const handleModalSuccess = () => {
// //     refetch?.();
// //   };

// //   return (
// //     <motion.div
// //       variants={containerVariants}
// //       initial="hidden"
// //       animate="visible"
// //       className="space-y-5"
// //     >
// //       {/* ═══════════════════════════════════════════════════════════════════ */}
// //       {/*  TOP TOOLBAR                                                       */}
// //       {/* ═══════════════════════════════════════════════════════════════════ */}
// //       <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
// //         {/* Search */}
// //         <div className="relative flex-1 min-w-[200px] max-w-xs">
// //           <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
// //           <input
// //             type="text"
// //             placeholder="Search by name"
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full
// //                        placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20
// //                        focus:border-[#AE3E27] transition-colors"
// //           />
// //         </div>

// //         {/* Add New Category */}
// //         <button
// //           onClick={handleAddCategory}
// //           className="ml-auto flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
// //                      bg-[#AE3E27] rounded-full hover:bg-[#AE3E27] transition-colors shadow-sm"
// //         >
// //           <Plus size={16} />
// //           Add New Category
// //         </button>
// //       </motion.div>

// //       {/* ═══════════════════════════════════════════════════════════════════ */}
// //       {/*  MAIN CONTENT: Left Sidebar + Right Grid                           */}
// //       {/* ═══════════════════════════════════════════════════════════════════ */}
// //       <motion.div variants={itemVariants} className="flex gap-5">
// //         {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
// //         <div className="w-[260px] shrink-0 space-y-5">
// //           {/* Parent category tabs with scroll arrows */}
// //           <div className="flex items-center gap-2">
// //             <button
// //               onClick={() => scrollTabs(-1)}
// //               className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0"
// //             >
// //               <ChevronLeft size={16} />
// //             </button>
// //             <div
// //               ref={tabsRef}
// //               className="flex-1 flex gap-5 overflow-x-auto scrollbar-hide"
// //               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
// //             >
// //               {rootCategories.map((cat) => (
// //                 <ParentTab
// //                   key={cat.id}
// //                   label={cat.name}
// //                   count={cat.children?.length || 0}
// //                   active={cat.id === activeParentId}
// //                   onClick={() => setActiveParentId(cat.id)}
// //                   onEdit={() => handleEditCategory(cat)}
// //                   onDelete={() => handleDeleteCategory(cat)}
// //                 />
// //               ))}
// //             </div>
// //             <button
// //               onClick={() => scrollTabs(1)}
// //               className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0"
// //             >
// //               <ChevronRight size={16} />
// //             </button>
// //           </div>

// //           {/* Subcategory checklist */}
// //           <div className="space-y-0.5">
// //             {subcategories.map((sub) => (
// //               <StyledCheckbox
// //                 key={sub.id}
// //                 checked={selectedSubIds.includes(sub.id)}
// //                 onChange={() => toggleSubcategory(sub.id)}
// //                 label={sub.name}
// //                 actions={
// //                   <>
// //                     <button
// //                       onClick={() => handleEditCategory(sub)}
// //                       className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#AE3E27] rounded hover:bg-[#fdf2f0] transition-colors"
// //                       title="Edit"
// //                     >
// //                       <Pencil size={11} />
// //                     </button>
// //                     <button
// //                       onClick={() => handleDeleteCategory(sub)}
// //                       className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
// //                       title="Delete"
// //                     >
// //                       <Trash2 size={11} />
// //                     </button>
// //                   </>
// //                 }
// //               />
// //             ))}
// //             {subcategories.length === 0 && !catLoading && (
// //               <div className="py-4 text-center">
// //                 <p className="text-sm text-gray-400 mb-2">No subcategories</p>
// //                 <button
// //                   onClick={handleAddCategory}
// //                   className="text-xs text-[#AE3E27] hover:text-[#8f3320] font-medium"
// //                 >
// //                   + Add subcategory
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* ── RIGHT PRODUCT GRID ────────────────────────────────────────── */}
// //         <div className="flex-1 min-w-0">
// //           {isLoading ? (
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //               <SkeletonProductCard />
// //               <SkeletonProductCard />
// //               <SkeletonProductCard />
// //               <SkeletonProductCard />
// //               <SkeletonProductCard />
// //               <SkeletonProductCard />
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //               {/* Add New Product placeholder */}
// //               <AddProductCard onClick={() => navigate('/admin/products/create')} />

// //               {/* Product cards */}
// //               {products.map((product) => (
// //                 <ProductCard key={product.id} product={product} />
// //               ))}
// //             </div>
// //           )}

// //           {!isLoading && products.length === 0 && (
// //             <div className="text-center py-16 text-gray-400">
// //               <p className="font-medium">No products found in this category.</p>
// //               <button
// //                 onClick={() => navigate('/admin/products/create')}
// //                 className="mt-3 text-sm text-[#AE3E27] hover:text-[#8f3320] font-medium"
// //               >
// //                 Add a product →
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </motion.div>

// //       {/* ═══════════════════════════════════════════════════════════════════ */}
// //       {/*  MODALS                                                            */}
// //       {/* ═══════════════════════════════════════════════════════════════════ */}
// //       <AnimatePresence>
// //         {modalOpen && (
// //           <CategoryFormModal
// //             initialData={editTarget}
// //             onClose={() => { setModalOpen(false); setEditTarget(null); }}
// //             onSuccess={handleModalSuccess}
// //           />
// //         )}
// //       </AnimatePresence>

// //       <AnimatePresence>
// //         {deleteTarget && (
// //           <ConfirmDeleteModal
// //             category={deleteTarget}
// //             onConfirm={confirmDelete}
// //             onCancel={() => { setDeleteTarget(null); setDeleteError(''); }}
// //             loading={deleting}
// //             error={deleteError}
// //           />
// //         )}
// //       </AnimatePresence>
// //     </motion.div>
// //   );
// // }


// // src/pages/admin/categories/CategoriesPage.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // FIXED: Now supports arbitrary-depth category nesting.
// // Sub-categories under sub-categories (3rd, 4th level) are now visible
// // and selectable. Product filtering includes all descendants.
// // ─────────────────────────────────────────────────────────────────────────────

// import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Plus, Search, ChevronLeft, ChevronRight, Check, Pencil, Trash2, 
//   AlertTriangle, MoreHorizontal, ChevronDown, ChevronRight as ChevronRightIcon
// } from 'lucide-react';

// import { useAdminCategories } from '../../../hooks/admin/useAdminData';
// import { useAdminProducts } from '../../../hooks/admin/useAdminData';
// import { deleteCategory } from '../../../api/categories.api';
// import CategoryFormModal from './CategoryFormModal';
// import { formatCurrency } from '../../../utils/formatCurrency';
// import { containerVariants, itemVariants } from '../../../utils/animation';
// import client from '../../../api/client';

// // ═══════════════════════════════════════════════════════════════════════════════
// //  Resolve relative image paths to full backend URLs
// // ═══════════════════════════════════════════════════════════════════════════════
// const API_BASE = (import.meta.env?.VITE_API_URL || client.defaults?.baseURL || 'http://localhost:1500/api')
//   .replace(/\/api.*$/, '')
//   .replace(/\/$/, '');

// const resolveImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   if (path.startsWith('data:')) return path;
//   return `${API_BASE}${path}`;
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// //  RECURSIVE TREE HELPERS
// // ═══════════════════════════════════════════════════════════════════════════════

// /**
//  * Recursively collect ALL descendant IDs from a category node.
//  * Used to ensure product filtering includes products from all nested levels.
//  */
// function collectAllDescendantIds(node, result = []) {
//   if (!node?.children?.length) return result;
//   node.children.forEach((child) => {
//     result.push(child.id);
//     collectAllDescendantIds(child, result);
//   });
//   return result;
// }

// /**
//  * Find a category node by ID anywhere in the tree (recursive search).
//  */
// function findNodeById(nodes, id) {
//   if (!Array.isArray(nodes)) return null;
//   for (const node of nodes) {
//     if (node.id === id) return node;
//     if (node.children?.length > 0) {
//       const found = findNodeById(node.children, id);
//       if (found) return found;
//     }
//   }
//   return null;
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// //  UI COMPONENTS
// // ═══════════════════════════════════════════════════════════════════════════════

// function ConfirmDeleteModal({ category, onConfirm, onCancel, loading, error }) {
//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95, y: 10 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 w-full"
//       >
//         <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
//           <AlertTriangle size={22} className="text-red-500" />
//         </div>
//         <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Category</h3>
//         <p className="text-sm text-gray-500 text-center mb-2">
//           Are you sure you want to delete <strong>{category?.name}</strong>?
//         </p>
//         <p className="text-xs text-[#AE3E27] text-center bg-[#fdf2f0] rounded-lg py-2 px-3 mb-4">
//           Categories with subcategories cannot be deleted. Remove subcategories first.
//         </p>
//         {error && (
//           <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4 text-center">{error}</p>
//         )}
//         <div className="flex gap-3">
//           <button
//             onClick={onCancel}
//             className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
//           >
//             {loading ? 'Deleting…' : 'Delete'}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// function StyledCheckbox({ checked, onChange, label, depth = 0, actions, hasChildren, expanded, onToggleExpand }) {
//   return (
//     <div className="group flex items-center justify-between w-full rounded-lg hover:bg-gray-50 transition-colors">
//       <button
//         type="button"
//         onClick={onChange}
//         className="flex items-center gap-3 w-full text-left py-2 px-1"
//         style={{ paddingLeft: `${8 + depth * 16}px` }}
//       >
//         {/* Expand/collapse toggle for nodes with children */}
//         {hasChildren && (
//           <span
//             onClick={(e) => { e.stopPropagation(); onToggleExpand?.(); }}
//             className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
//           >
//             {expanded ? <ChevronDown size={14} /> : <ChevronRightIcon size={14} />}
//           </span>
//         )}
//         {!hasChildren && <span className="w-4 shrink-0" />}

//         <span className={[
//           'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
//           checked
//             ? 'bg-[#AE3E27] border-[#AE3E27]'
//             : 'border-gray-300 bg-white',
//         ].join(' ')}>
//           {checked && <Check size={12} className="text-white" strokeWidth={3} />}
//         </span>
//         <span className={['text-sm transition-colors truncate', checked ? 'text-gray-900 font-medium' : 'text-gray-600'].join(' ')}>
//           {label}
//         </span>
//       </button>
//       {/* Actions — visible on hover */}
//       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
//         {actions}
//       </div>
//     </div>
//   );
// }

// function ParentTab({ label, active, count, onClick, onEdit, onDelete }) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const btnRef = useRef(null);
//   const menuRef = useRef(null);
//   const [pos, setPos] = useState({ top: 0, left: 0 });

//   const toggleMenu = (e) => {
//     e.stopPropagation();
//     if (!menuOpen && btnRef.current) {
//       const rect = btnRef.current.getBoundingClientRect();
//       setPos({ top: rect.bottom + 6, left: rect.left - 90 });
//     }
//     setMenuOpen((v) => !v);
//   };

//   useEffect(() => {
//     if (!menuOpen) return;
//     const handler = (e) => {
//       const inBtn = btnRef.current?.contains(e.target);
//       const inMenu = menuRef.current?.contains(e.target);
//       if (!inBtn && !inMenu) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [menuOpen]);

//   const handleAction = (action) => {
//     setMenuOpen(false);
//     setTimeout(() => action?.(), 10);
//   };

//   return (
//     <>
//       <div className="group relative flex items-center">
//         <button
//           onClick={onClick}
//           className={[
//             'flex items-center gap-1 text-sm font-medium whitespace-nowrap px-1 pb-2 transition-colors border-b-2',
//             active
//               ? 'text-gray-900 border-[#AE3E27]'
//               : 'text-gray-400 border-transparent hover:text-gray-600',
//           ].join(' ')}
//         >
//           {label}
//           {count > 0 && (
//             <span className="text-xs text-gray-400">({count})</span>
//           )}
//         </button>

//         <button
//           ref={btnRef}
//           onClick={toggleMenu}
//           className={[
//             'ml-1 w-5 h-5 flex items-center justify-center rounded transition-all',
//             menuOpen
//               ? 'bg-gray-100 text-gray-700 opacity-100'
//               : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600',
//           ].join(' ')}
//           title="Actions"
//         >
//           <MoreHorizontal size={14} />
//         </button>
//       </div>

//       {menuOpen && (
//         <div
//           ref={menuRef}
//           className="fixed z-[100] bg-white border border-gray-100 shadow-xl rounded-xl py-1 min-w-[120px]"
//           style={{ top: pos.top, left: pos.left }}
//         >
//           <button
//             onClick={() => handleAction(onEdit)}
//             className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27] transition-colors text-left"
//           >
//             <Pencil size={12} /> Edit
//           </button>
//           <button
//             onClick={() => handleAction(onDelete)}
//             className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
//           >
//             <Trash2 size={12} /> Delete
//           </button>
//         </div>
//       )}
//     </>
//   );
// }

// function AddProductCard({ onClick }) {
//   return (
//     <motion.div
//       variants={itemVariants}
//       onClick={onClick}
//       className="border-2 border-dashed border-gray-300 rounded-2xl bg-white flex flex-col items-center justify-center
//                  gap-3 p-6 cursor-pointer hover:border-[#AE3E27] hover:bg-[#fdf2f0]/30 transition-all
//                  min-h-[260px]"
//     >
//       <div className="w-12 h-12 rounded-full bg-[#AE3E27] flex items-center justify-center shadow-sm">
//         <Plus size={24} className="text-white" />
//       </div>
//       <p className="text-sm font-medium text-gray-700 text-center leading-snug">
//         Add New Product<br />to Category
//       </p>
//     </motion.div>
//   );
// }

// function ProductCard({ product }) {
//   const imageSrc = resolveImageUrl(product.image);
//   const price = product.price ?? product.variants?.[0]?.price;

//   return (
//     <motion.div
//       variants={itemVariants}
//       className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
//     >
//       <div className="p-5 pb-2 flex justify-center">
//         {imageSrc ? (
//           <img
//             src={imageSrc}
//             alt={product.name}
//             className="w-36 h-36 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
//           />
//         ) : (
//           <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//             <span className="text-2xl font-bold text-gray-200">
//               {product.name?.charAt(0)?.toUpperCase() || '?'}
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="px-5 pb-5 pt-1">
//         <p className="text-sm text-gray-800 font-medium truncate">{product.name}</p>
//         <p className="text-sm font-bold text-gray-900 mt-1">
//           {price ? formatCurrency(price) : '—'}
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// function SkeletonProductCard() {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//       <div className="p-5 pb-2 flex justify-center">
//         <div className="w-36 h-36 rounded-2xl bg-gray-100 animate-pulse" />
//       </div>
//       <div className="px-5 pb-5 pt-1 space-y-2">
//         <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
//         <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
//       </div>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MAIN PAGE — FIXED FOR ARBITRARY DEPTH
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function CategoriesPage() {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState('');

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editTarget, setEditTarget] = useState(null);

//   // Delete state
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const [deleteError, setDeleteError] = useState('');

//   // Category data from API
//   const { data: categoryTree = [], loading: catLoading, refetch } = useAdminCategories();

//   // Extract root categories for top tabs
//   const rootCategories = useMemo(() => {
//     if (!Array.isArray(categoryTree)) return [];
//     return categoryTree.filter((c) => !c.parentId);
//   }, [categoryTree]);

//   // Active parent tab (root category)
//   const [activeParentId, setActiveParentId] = useState(() => {
//     if (rootCategories.length > 0) {
//       const men = rootCategories.find((c) => c.name.toLowerCase() === 'men');
//       return men?.id || rootCategories[0]?.id;
//     }
//     return null;
//   });

//   // Sync active parent when tree loads
//   useEffect(() => {
//     if (rootCategories.length > 0 && !activeParentId) {
//       const men = rootCategories.find((c) => c.name.toLowerCase() === 'men');
//       setActiveParentId(men?.id || rootCategories[0]?.id);
//     }
//   }, [rootCategories, activeParentId]);

//   // Get the active root category node
//   const activeParent = useMemo(() =>
//     rootCategories.find((c) => c.id === activeParentId),
//   [rootCategories, activeParentId]);

//   // ═══════════════════════════════════════════════════════════════════════════
//   //  FIX: Track expanded nodes for recursive tree display
//   // ═══════════════════════════════════════════════════════════════════════════
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   // Auto-expand all 2nd-level nodes that have children when parent changes
//   useEffect(() => {
//     if (activeParent?.children) {
//       const newExpanded = new Set();
//       const autoExpand = (nodes) => {
//         nodes.forEach((node) => {
//           if (node.children?.length > 0) {
//             newExpanded.add(node.id);
//             autoExpand(node.children);
//           }
//         });
//       };
//       autoExpand(activeParent.children);
//       setExpandedIds(newExpanded);
//     }
//   }, [activeParentId]);

//   const toggleExpand = useCallback((id) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   }, []);

//   // Selected category IDs for product filtering
//   const [selectedIds, setSelectedIds] = useState([]);

//   // Auto-select first leaf category when parent changes
//   useEffect(() => {
//     if (activeParent?.children?.length > 0) {
//       // Find first leaf node (deepest level with no children)
//       const findFirstLeaf = (nodes) => {
//         for (const node of nodes) {
//           if (!node.children?.length) return node;
//           const leaf = findFirstLeaf(node.children);
//           if (leaf) return leaf;
//         }
//         return nodes[0];
//       };
//       const first = findFirstLeaf(activeParent.children);
//       if (first) {
//         // Select the leaf AND all its ancestors for visual feedback
//         setSelectedIds([first.id]);
//       }
//     } else {
//       setSelectedIds([]);
//     }
//   }, [activeParentId]);

//   const toggleSelection = useCallback((id) => {
//     setSelectedIds((prev) => {
//       const isSelected = prev.includes(id);
//       if (isSelected) {
//         return prev.filter((s) => s !== id);
//       } else {
//         // Single-select mode: replace selection
//         return [id];
//       }
//     });
//   }, []);

//   // Build category filter string for API from the selected node
//   // The backend's getDescendantCategoryIds will include all nested descendants
//   const categoryFilter = useMemo(() => {
//     if (selectedIds.length === 0) return activeParent?.name || '';
//     // Find the selected node anywhere in the active parent's tree
//     const selectedNode = findNodeById(activeParent?.children, selectedIds[0]);
//     return selectedNode?.name || activeParent?.name || '';
//   }, [selectedIds, activeParent]);

//   // Fetch products
//   const { products, loading: prodLoading } = useAdminProducts(1, search, categoryFilter);
//   const isLoading = catLoading || prodLoading;

//   // Tab scroll ref
//   const tabsRef = useRef(null);
//   const scrollTabs = (dir) => {
//     if (tabsRef.current) {
//       tabsRef.current.scrollBy({ left: dir * 120, behavior: 'smooth' });
//     }
//   };

//   // ── Modal handlers ─────────────────────────────────────────────────────────
//   const handleAddCategory = () => {
//     setEditTarget(null);
//     setModalOpen(true);
//   };

//   const handleEditCategory = (category) => {
//     setEditTarget(category);
//     setModalOpen(true);
//   };

//   const handleDeleteCategory = (category) => {
//     setDeleteTarget(category);
//     setDeleteError('');
//   };

//   const confirmDelete = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     setDeleteError('');
//     try {
//       await deleteCategory(deleteTarget.id);
//       setDeleteTarget(null);
//       if (deleteTarget.id === activeParentId) {
//         const remaining = rootCategories.filter((c) => c.id !== deleteTarget.id);
//         setActiveParentId(remaining[0]?.id || null);
//       }
//       refetch?.();
//     } catch (err) {
//       const msg = err?.response?.data?.error || 'Failed to delete category.';
//       setDeleteError(msg);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleModalSuccess = () => {
//     refetch?.();
//   };

//   // ═══════════════════════════════════════════════════════════════════════════
//   //  RECURSIVE RENDER: Render a category node and ALL its descendants
//   // ═══════════════════════════════════════════════════════════════════════════
//   const renderCategoryNode = (node, depth = 0) => {
//     const hasChildren = node.children?.length > 0;
//     const isExpanded = expandedIds.has(node.id);
//     const isSelected = selectedIds.includes(node.id);

//     return (
//       <React.Fragment key={node.id}>
//         <StyledCheckbox
//           checked={isSelected}
//           onChange={() => toggleSelection(node.id)}
//           label={node.name}
//           depth={depth}
//           hasChildren={hasChildren}
//           expanded={isExpanded}
//           onToggleExpand={() => toggleExpand(node.id)}
//           actions={
//             <>
//               <button
//                 onClick={(e) => { e.stopPropagation(); handleEditCategory(node); }}
//                 className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#AE3E27] rounded hover:bg-[#fdf2f0] transition-colors"
//                 title="Edit"
//               >
//                 <Pencil size={11} />
//               </button>
//               <button
//                 onClick={(e) => { e.stopPropagation(); handleDeleteCategory(node); }}
//                 className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
//                 title="Delete"
//               >
//                 <Trash2 size={11} />
//               </button>
//             </>
//           }
//         />
//         {/* RECURSIVELY render children if expanded */}
//         {hasChildren && isExpanded && (
//           <div>
//             {node.children.map((child) => renderCategoryNode(child, depth + 1))}
//           </div>
//         )}
//       </React.Fragment>
//     );
//   };

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="space-y-5"
//     >
//       {/* ═══════════════════════════════════════════════════════════════════ */}
//       {/*  TOP TOOLBAR                                                       */}
//       {/* ═══════════════════════════════════════════════════════════════════ */}
//       <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
//         <div className="relative flex-1 min-w-[200px] max-w-xs">
//           <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full
//                        placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20
//                        focus:border-[#AE3E27] transition-colors"
//           />
//         </div>

//         <button
//           onClick={handleAddCategory}
//           className="ml-auto flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
//                      bg-[#AE3E27] rounded-full hover:bg-[#AE3E27] transition-colors shadow-sm"
//         >
//           <Plus size={16} />
//           Add New Category
//         </button>
//       </motion.div>

//       {/* ═══════════════════════════════════════════════════════════════════ */}
//       {/*  MAIN CONTENT: Left Sidebar + Right Grid                           */}
//       {/* ═══════════════════════════════════════════════════════════════════ */}
//       <motion.div variants={itemVariants} className="flex gap-5">
//         {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
//         <div className="w-[280px] shrink-0 space-y-5">
//           {/* Parent category tabs with scroll arrows */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => scrollTabs(-1)}
//               className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0"
//             >
//               <ChevronLeft size={16} />
//             </button>
//             <div
//               ref={tabsRef}
//               className="flex-1 flex gap-5 overflow-x-auto scrollbar-hide"
//               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//             >
//               {rootCategories.map((cat) => (
//                 <ParentTab
//                   key={cat.id}
//                   label={cat.name}
//                   count={cat.children?.length || 0}
//                   active={cat.id === activeParentId}
//                   onClick={() => setActiveParentId(cat.id)}
//                   onEdit={() => handleEditCategory(cat)}
//                   onDelete={() => handleDeleteCategory(cat)}
//                 />
//               ))}
//             </div>
//             <button
//               onClick={() => scrollTabs(1)}
//               className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>

//           {/* Recursive subcategory tree — THIS IS THE FIX */}
//           <div className="space-y-0.5">
//             {activeParent?.children?.map((node) => renderCategoryNode(node, 0))}

//             {(!activeParent?.children || activeParent.children.length === 0) && !catLoading && (
//               <div className="py-4 text-center">
//                 <p className="text-sm text-gray-400 mb-2">No subcategories</p>
//                 <button
//                   onClick={handleAddCategory}
//                   className="text-xs text-[#AE3E27] hover:text-[#8f3320] font-medium"
//                 >
//                   + Add subcategory
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── RIGHT PRODUCT GRID ────────────────────────────────────────── */}
//         <div className="flex-1 min-w-0">
//           {isLoading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonProductCard key={i} />)}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               <AddProductCard onClick={() => navigate('/admin/products/create')} />
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           )}

//           {!isLoading && products.length === 0 && (
//             <div className="text-center py-16 text-gray-400">
//               <p className="font-medium">No products found in this category.</p>
//               <button
//                 onClick={() => navigate('/admin/products/create')}
//                 className="mt-3 text-sm text-[#AE3E27] hover:text-[#8f3320] font-medium"
//               >
//                 Add a product →
//               </button>
//             </div>
//           )}
//         </div>
//       </motion.div>

//       {/* ═══════════════════════════════════════════════════════════════════ */}
//       {/*  MODALS                                                            */}
//       {/* ═══════════════════════════════════════════════════════════════════ */}
//       <AnimatePresence>
//         {modalOpen && (
//           <CategoryFormModal
//             initialData={editTarget}
//             onClose={() => { setModalOpen(false); setEditTarget(null); }}
//             onSuccess={handleModalSuccess}
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {deleteTarget && (
//           <ConfirmDeleteModal
//             category={deleteTarget}
//             onConfirm={confirmDelete}
//             onCancel={() => { setDeleteTarget(null); setDeleteError(''); }}
//             loading={deleting}
//             error={deleteError}
//           />
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// src/pages/admin/categories/CategoriesPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// FIXED v2: Drag-and-drop now works correctly.
// Changes:
//   - Entire row surface is draggable (no inner button swallowing events)
//   - Drop direction stored in dataTransfer (no stale closure issues)
//   - Simplified reorder math
//   - Console logging for debugging
//   - Children collapsed during reorder to prevent nested drag conflicts
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, ChevronLeft, ChevronRight, Check, Pencil, Trash2,
  AlertTriangle, MoreHorizontal, ChevronDown, ChevronRight as ChevronRightIcon,
  GripVertical, Loader2,
} from 'lucide-react';

import { useAdminCategories, useReorderCategories } from '../../../hooks/admin/useAdminData';
import { useAdminProducts } from '../../../hooks/admin/useAdminData';
import { deleteCategory } from '../../../api/categories.api';
import CategoryFormModal from './CategoryFormModal';
import { formatCurrency } from '../../../utils/formatCurrency';
import { containerVariants, itemVariants } from '../../../utils/animation';
import client from '../../../api/client';

// ═══════════════════════════════════════════════════════════════════════════════
//  Resolve relative image paths to full backend URLs
// ═══════════════════════════════════════════════════════════════════════════════
const API_BASE = (import.meta.env?.VITE_API_URL || client.defaults?.baseURL || 'http://localhost:1500/api')
  .replace(/\/api.*$/, '')
  .replace(/\/$/, '');

const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('data:')) return path;
  return `${API_BASE}${path}`;
};

// ═══════════════════════════════════════════════════════════════════════════════
//  TREE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function collectAllDescendantIds(node, result = []) {
  if (!node?.children?.length) return result;
  node.children.forEach((child) => {
    result.push(child.id);
    collectAllDescendantIds(child, result);
  });
  return result;
}

function findNodeById(nodes, id) {
  if (!Array.isArray(nodes)) return null;
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children?.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function ConfirmDeleteModal({ category, onConfirm, onCancel, loading, error }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 w-full"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Category</h3>
        <p className="text-sm text-gray-500 text-center mb-2">
          Are you sure you want to delete <strong>{category?.name}</strong>?
        </p>
        <p className="text-xs text-[#AE3E27] text-center bg-[#fdf2f0] rounded-lg py-2 px-3 mb-4">
          Categories with subcategories cannot be deleted. Remove subcategories first.
        </p>
        {error && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4 text-center">{error}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DRAGGABLE SIDEBAR ROW — FIXED
//  The ENTIRE row is a single draggable surface. No inner button.
//  Drop direction is stored in dataTransfer so onDrop has it immediately.
// ═══════════════════════════════════════════════════════════════════════════════
function DraggableCategoryRow({
  node,
  depth = 0,
  isSelected,
  isExpanded,
  isReordering,
  onToggleSelect,
  onToggleExpand,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  dragOverId,
  dragDirection,
}) {
  const hasChildren = node.children?.length > 0;
  const isDragOver = dragOverId === node.id;
  const rowRef = useRef(null);

  // During reorder mode: the ENTIRE row is draggable.
  // During normal mode: clicking selects the category.
  const handleClick = (e) => {
    if (isReordering) return; // Don't select while reordering
    onToggleSelect(node.id);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    onToggleExpand(node.id);
  };

  return (
    <React.Fragment>
      <div
        ref={rowRef}
        draggable={isReordering}
        onDragStart={(e) => {
          console.log('[DND] dragStart sidebar:', node.id, node.name);
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', JSON.stringify({ id: node.id, source: 'sidebar' }));
          // Visual feedback
          e.dataTransfer.setDragImage(e.currentTarget, 10, 10);
          onDragStart?.(node.id);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          const rect = e.currentTarget.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          const dir = e.clientY < midY ? 'before' : 'after';
          if (dragOverId !== node.id || dragDirection !== dir) {
            onDragOver?.(node.id, dir);
          }
        }}
        onDragLeave={() => {
          onDragOver?.(null, null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const raw = e.dataTransfer.getData('text/plain');
          console.log('[DND] drop sidebar raw:', raw);
          let draggedData;
          try {
            draggedData = JSON.parse(raw);
          } catch {
            draggedData = { id: raw, source: 'sidebar' };
          }
          if (draggedData.id && draggedData.id !== node.id) {
            // Read direction from the current drag state (set by onDragOver just before drop)
            const dir = dragDirection || 'before';
            console.log('[DND] drop sidebar:', draggedData.id, '→', node.id, 'direction:', dir);
            onDragEnd?.(draggedData.id, node.id, dir);
          }
          onDragOver?.(null, null);
        }}
        onClick={handleClick}
        className={[
          'group flex items-center w-full rounded-lg transition-colors select-none',
          isDragOver
            ? dragDirection === 'before'
              ? 'border-t-2 border-[#AE3E27] bg-[#fdf2f0]/30'
              : 'border-b-2 border-[#AE3E27] bg-[#fdf2f0]/30'
            : 'hover:bg-gray-50',
          isReordering ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        ].join(' ')}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <div className="flex items-center gap-2 w-full text-left py-2 px-1">
          {/* Drag handle (only visible in reorder mode) */}
          {isReordering && (
            <span className="text-gray-300 hover:text-gray-500 shrink-0">
              <GripVertical size={14} />
            </span>
          )}

          {/* Expand/collapse toggle (normal mode only) */}
          {hasChildren && !isReordering && (
            <span
              onClick={handleExpandClick}
              className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRightIcon size={14} />}
            </span>
          )}
          {(hasChildren && isReordering) && <span className="w-4 shrink-0" />}
          {!hasChildren && <span className="w-4 shrink-0" />}

          {/* Checkbox (normal mode only) */}
          {!isReordering && (
            <span className={[
              'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
              isSelected
                ? 'bg-[#AE3E27] border-[#AE3E27]'
                : 'border-gray-300 bg-white',
            ].join(' ')}>
              {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
            </span>
          )}
          {isReordering && <span className="w-1 shrink-0" />}

          <span className={['text-sm transition-colors truncate', isSelected && !isReordering ? 'text-gray-900 font-medium' : 'text-gray-600'].join(' ')}>
            {node.name}
          </span>
        </div>

        {/* Actions — hidden during reorder mode */}
        {!isReordering && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(node); }}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-[#AE3E27] rounded hover:bg-[#fdf2f0] transition-colors"
              title="Edit"
            >
              <Pencil size={11} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(node); }}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Render children if expanded and NOT in reorder mode */}
      {hasChildren && isExpanded && !isReordering && (
        <div>
          {node.children.map((child) => (
            <DraggableCategoryRow
              key={child.id}
              node={child}
              depth={depth + 1}
              isSelected={isSelected}
              isExpanded={isExpanded}
              isReordering={isReordering}
              onToggleSelect={onToggleSelect}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              dragOverId={dragOverId}
              dragDirection={dragDirection}
            />
          ))}
        </div>
      )}
    </React.Fragment>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DRAGGABLE PARENT TAB — FIXED
//  Same fix: entire tab surface draggable, direction in dataTransfer.
// ═══════════════════════════════════════════════════════════════════════════════
function DraggableParentTab({
  label,
  active,
  count,
  onClick,
  onEdit,
  onDelete,
  isReordering,
  onDragStart,
  onDragOver,
  onDragEnd,
  dragOverId,
  dragDirection,
  tabId,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const isDragOver = dragOverId === tabId;

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!menuOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left - 90 });
    }
    setMenuOpen((v) => !v);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      const inBtn = btnRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inBtn && !inMenu) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleAction = (action) => {
    setMenuOpen(false);
    setTimeout(() => action?.(), 10);
  };

  return (
    <>
      <div
        draggable={isReordering}
        onDragStart={(e) => {
          console.log('[DND] dragStart tab:', tabId, label);
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', JSON.stringify({ id: tabId, source: 'tab' }));
          e.dataTransfer.setDragImage(e.currentTarget, 10, 10);
          onDragStart?.(tabId);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          const rect = e.currentTarget.getBoundingClientRect();
          const midX = rect.left + rect.width / 2;
          const dir = e.clientX < midX ? 'before' : 'after';
          if (dragOverId !== tabId || dragDirection !== dir) {
            onDragOver?.(tabId, dir);
          }
        }}
        onDragLeave={() => onDragOver?.(null, null)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const raw = e.dataTransfer.getData('text/plain');
          console.log('[DND] drop tab raw:', raw);
          let draggedData;
          try {
            draggedData = JSON.parse(raw);
          } catch {
            draggedData = { id: raw, source: 'tab' };
          }
          if (draggedData.id && draggedData.id !== tabId) {
            const dir = dragDirection || 'before';
            console.log('[DND] drop tab:', draggedData.id, '→', tabId, 'direction:', dir);
            onDragEnd?.(draggedData.id, tabId, dir);
          }
          onDragOver?.(null, null);
        }}
        onClick={() => {
          if (!isReordering) onClick();
        }}
        className={[
          'group relative flex items-center transition-colors select-none',
          isReordering ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
          isDragOver
            ? dragDirection === 'before'
              ? 'border-l-2 border-[#AE3E27]'
              : 'border-r-2 border-[#AE3E27]'
            : '',
        ].join(' ')}
      >
        {isReordering && (
          <span className="text-gray-300 hover:text-gray-500 mr-1">
            <GripVertical size={14} />
          </span>
        )}
        <span
          className={[
            'flex items-center gap-1 text-sm font-medium whitespace-nowrap px-1 pb-2 transition-colors border-b-2',
            active && !isReordering
              ? 'text-gray-900 border-[#AE3E27]'
              : 'text-gray-400 border-transparent hover:text-gray-600',
          ].join(' ')}
        >
          {label}
          {count > 0 && (
            <span className="text-xs text-gray-400">({count})</span>
          )}
        </span>

        {!isReordering && (
          <button
            ref={btnRef}
            onClick={toggleMenu}
            className={[
              'ml-1 w-5 h-5 flex items-center justify-center rounded transition-all',
              menuOpen
                ? 'bg-gray-100 text-gray-700 opacity-100'
                : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600',
            ].join(' ')}
            title="Actions"
          >
            <MoreHorizontal size={14} />
          </button>
        )}
      </div>

      {menuOpen && !isReordering && (
        <div
          ref={menuRef}
          className="fixed z-[100] bg-white border border-gray-100 shadow-xl rounded-xl py-1 min-w-[120px]"
          style={{ top: pos.top, left: pos.left }}
        >
          <button
            onClick={() => handleAction(onEdit)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27] transition-colors text-left"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => handleAction(onDelete)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}
    </>
  );
}

function AddProductCard({ onClick }) {
  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      className="border-2 border-dashed border-gray-300 rounded-2xl bg-white flex flex-col items-center justify-center
                 gap-3 p-6 cursor-pointer hover:border-[#AE3E27] hover:bg-[#fdf2f0]/30 transition-all
                 min-h-[260px]"
    >
      <div className="w-12 h-12 rounded-full bg-[#AE3E27] flex items-center justify-center shadow-sm">
        <Plus size={24} className="text-white" />
      </div>
      <p className="text-sm font-medium text-gray-700 text-center leading-snug">
        Add New Product<br />to Category
      </p>
    </motion.div>
  );
}

function ProductCard({ product }) {
  const imageSrc = resolveImageUrl(product.image);
  const price = product.price ?? product.variants?.[0]?.price;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
    >
      <div className="p-5 pb-2 flex justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-36 h-36 rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-200">
              {product.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}
      </div>

      <div className="px-5 pb-5 pt-1">
        <p className="text-sm text-gray-800 font-medium truncate">{product.name}</p>
        <p className="text-sm font-bold text-gray-900 mt-1">
          {price ? formatCurrency(price) : '—'}
        </p>
      </div>
    </motion.div>
  );
}

function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-5 pb-2 flex justify-center">
        <div className="w-36 h-36 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
      <div className="px-5 pb-5 pt-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE — FIXED DRAG-AND-DROP
// ═══════════════════════════════════════════════════════════════════════════════
export default function CategoriesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // ── Reorder mode state ──────────────────────────────────────────────────────
  const [isReordering, setIsReordering] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);

  // Drag-and-drop visual state
  const [dragOverId, setDragOverId] = useState(null);
  const [dragDirection, setDragDirection] = useState(null);

  // Category data from API
  const { data: categoryTree = [], loading: catLoading, refetch } = useAdminCategories();
  const { reorder } = useReorderCategories();

  // Extract root categories for top tabs
  const rootCategories = useMemo(() => {
    if (!Array.isArray(categoryTree)) return [];
    return categoryTree.filter((c) => !c.parentId);
  }, [categoryTree]);

  // Active parent tab (root category)
  const [activeParentId, setActiveParentId] = useState(() => {
    if (rootCategories.length > 0) {
      const men = rootCategories.find((c) => c.name.toLowerCase() === 'men');
      return men?.id || rootCategories[0]?.id;
    }
    return null;
  });

  // Sync active parent when tree loads
  useEffect(() => {
    if (rootCategories.length > 0 && !activeParentId) {
      const men = rootCategories.find((c) => c.name.toLowerCase() === 'men');
      setActiveParentId(men?.id || rootCategories[0]?.id);
    }
  }, [rootCategories, activeParentId]);

  // Get the active root category node
  const activeParent = useMemo(() =>
    rootCategories.find((c) => c.id === activeParentId),
  [rootCategories, activeParentId]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  EXPANDED NODES (sidebar tree)
  //  During reorder mode: ALL children are collapsed to prevent nested drag conflicts.
  // ═══════════════════════════════════════════════════════════════════════════
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Auto-expand when NOT in reorder mode
  useEffect(() => {
    if (activeParent?.children && !isReordering) {
      const newExpanded = new Set();
      const autoExpand = (nodes) => {
        nodes.forEach((node) => {
          if (node.children?.length > 0) {
            newExpanded.add(node.id);
            autoExpand(node.children);
          }
        });
      };
      autoExpand(activeParent.children);
      setExpandedIds(newExpanded);
    }
    if (isReordering) {
      // Collapse everything during reorder for clean drag surface
      setExpandedIds(new Set());
    }
  }, [activeParentId, isReordering]);

  const toggleExpand = useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Selected category IDs for product filtering
  const [selectedIds, setSelectedIds] = useState([]);

  // Auto-select first leaf category when parent changes (normal mode only)
  useEffect(() => {
    if (isReordering) {
      setSelectedIds([]);
      return;
    }
    if (activeParent?.children?.length > 0) {
      const findFirstLeaf = (nodes) => {
        for (const node of nodes) {
          if (!node.children?.length) return node;
          const leaf = findFirstLeaf(node.children);
          if (leaf) return leaf;
        }
        return nodes[0];
      };
      const first = findFirstLeaf(activeParent.children);
      if (first) {
        setSelectedIds([first.id]);
      }
    } else {
      setSelectedIds([]);
    }
  }, [activeParentId, isReordering]);

  const toggleSelection = useCallback((id) => {
    setSelectedIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter((s) => s !== id);
      } else {
        return [id]; // Single-select mode
      }
    });
  }, []);

  // Build category filter string for API
  const categoryFilter = useMemo(() => {
    if (selectedIds.length === 0) return activeParent?.name || '';
    const selectedNode = findNodeById(activeParent?.children, selectedIds[0]);
    return selectedNode?.name || activeParent?.name || '';
  }, [selectedIds, activeParent]);

  // Fetch products
  const { products, loading: prodLoading } = useAdminProducts(1, search, categoryFilter);
  const isLoading = catLoading || prodLoading;

  // Tab scroll ref
  const tabsRef = useRef(null);
  const scrollTabs = (dir) => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: dir * 120, behavior: 'smooth' });
    }
  };

  // ── Modal handlers ─────────────────────────────────────────────────────────
  const handleAddCategory = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditTarget(category);
    setModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setDeleteTarget(category);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      if (deleteTarget.id === activeParentId) {
        const remaining = rootCategories.filter((c) => c.id !== deleteTarget.id);
        setActiveParentId(remaining[0]?.id || null);
      }
      refetch?.();
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to delete category.';
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalSuccess = () => {
    refetch?.();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  DRAG-AND-DROP: ROOT CATEGORY TABS
  //  Simplified: just move dragged item to the target's position.
  // ═══════════════════════════════════════════════════════════════════════════
  const handleTabDragStart = useCallback((id) => {
    setDragOverId(null);
    setDragDirection(null);
  }, []);

  const handleTabDragOver = useCallback((id, dir) => {
    setDragOverId(id);
    setDragDirection(dir);
  }, []);

  const handleTabDragEnd = useCallback(async (draggedId, targetId, direction) => {
    console.log('[DND] handleTabDragEnd:', draggedId, '→', targetId, 'dir:', direction);
    if (draggedId === targetId) return;

    const currentOrder = [...rootCategories];
    const draggedIdx = currentOrder.findIndex((c) => c.id === draggedId);
    const targetIdx = currentOrder.findIndex((c) => c.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) {
      console.error('[DND] Could not find dragged or target in rootCategories');
      return;
    }

    // Remove dragged from current position
    const [moved] = currentOrder.splice(draggedIdx, 1);

    // Calculate insert position
    let insertAt = targetIdx;
    if (direction === 'after') {
      insertAt = targetIdx + 1;
    }
    // Adjust if we removed before the target
    if (draggedIdx < targetIdx) {
      insertAt -= 1;
    }

    currentOrder.splice(insertAt, 0, moved);

    // Build payload
    const orderedIds = currentOrder.map((c, idx) => ({ id: c.id, sortOrder: idx }));
    console.log('[DND] tab orderedIds:', orderedIds);

    setReorderLoading(true);
    try {
      await reorder(orderedIds);
      console.log('[DND] tab reorder success');
      refetch?.();
    } catch (err) {
      console.error('[DND] tab reorder failed:', err);
      refetch?.();
    } finally {
      setReorderLoading(false);
      setDragOverId(null);
      setDragDirection(null);
    }
  }, [rootCategories, reorder, refetch]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  DRAG-AND-DROP: SIDEBAR SUBCATEGORIES
  //  Simplified: collect all siblings at the same parent level, reorder them.
  // ═══════════════════════════════════════════════════════════════════════════
  const handleNodeDragStart = useCallback((id) => {
    setDragOverId(null);
    setDragDirection(null);
  }, []);

  const handleNodeDragOver = useCallback((id, dir) => {
    setDragOverId(id);
    setDragDirection(dir);
  }, []);

  // Flatten the active parent's children to find siblings
  const handleNodeDragEnd = useCallback(async (draggedId, targetId, direction) => {
    console.log('[DND] handleNodeDragEnd:', draggedId, '→', targetId, 'dir:', direction);
    if (draggedId === targetId) return;

    // Build a flat list of all nodes under the active parent with parent info
    const flat = [];
    const walk = (nodes, parentId = activeParentId, depth = 0) => {
      nodes.forEach((n) => {
        flat.push({ id: n.id, parentId, depth, name: n.name });
        if (n.children?.length) walk(n.children, n.id, depth + 1);
      });
    };
    if (activeParent?.children) {
      walk(activeParent.children);
    }

    const draggedNode = flat.find((n) => n.id === draggedId);
    const targetNode = flat.find((n) => n.id === targetId);

    if (!draggedNode || !targetNode) {
      console.error('[DND] Could not find dragged or target node');
      return;
    }

    // Only allow reordering within the same parent
    if (draggedNode.parentId !== targetNode.parentId) {
      console.log('[DND] Cross-parent drop rejected. Dragged parent:', draggedNode.parentId, 'Target parent:', targetNode.parentId);
      return;
    }

    // Get siblings
    const siblings = flat.filter((n) => n.parentId === draggedNode.parentId);
    console.log('[DND] siblings:', siblings.map((s) => s.name));

    const draggedIdx = siblings.findIndex((n) => n.id === draggedId);
    const targetIdx = siblings.findIndex((n) => n.id === targetId);
    if (draggedIdx === -1 || targetIdx === -1) {
      console.error('[DND] Could not find indices');
      return;
    }

    // Remove dragged
    const [moved] = siblings.splice(draggedIdx, 1);

    // Calculate insert position
    let insertAt = targetIdx;
    if (direction === 'after') {
      insertAt = targetIdx + 1;
    }
    if (draggedIdx < targetIdx) {
      insertAt -= 1;
    }

    siblings.splice(insertAt, 0, moved);

    const orderedIds = siblings.map((c, idx) => ({ id: c.id, sortOrder: idx }));
    console.log('[DND] node orderedIds:', orderedIds);

    setReorderLoading(true);
    try {
      await reorder(orderedIds);
      console.log('[DND] node reorder success');
      refetch?.();
    } catch (err) {
      console.error('[DND] node reorder failed:', err);
      refetch?.();
    } finally {
      setReorderLoading(false);
      setDragOverId(null);
      setDragDirection(null);
    }
  }, [activeParent, reorder, refetch]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  RECURSIVE RENDER
  //  During reorder mode: render ONLY top-level children (no nesting) for clean drag.
  // ═══════════════════════════════════════════════════════════════════════════
  const renderCategoryNode = (node, depth = 0) => {
    const hasChildren = node.children?.length > 0;
    const isExpanded = expandedIds.has(node.id);
    const isSelected = selectedIds.includes(node.id);

    return (
      <React.Fragment key={node.id}>
        <DraggableCategoryRow
          node={node}
          depth={depth}
          isSelected={isSelected}
          isExpanded={isExpanded}
          isReordering={isReordering}
          onToggleSelect={toggleSelection}
          onToggleExpand={toggleExpand}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onDragStart={handleNodeDragStart}
          onDragOver={handleNodeDragOver}
          onDragEnd={handleNodeDragEnd}
          dragOverId={dragOverId}
          dragDirection={dragDirection}
        />
        {/* Render children if expanded and NOT in reorder mode */}
        {hasChildren && isExpanded && !isReordering && (
          <div>
            {node.children.map((child) => renderCategoryNode(child, depth + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  TOP TOOLBAR                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full
                       placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20
                       focus:border-[#AE3E27] transition-colors"
          />
        </div>

        {/* Reorder toggle button */}
        <button
          onClick={() => setIsReordering((v) => !v)}
          disabled={reorderLoading}
          className={[
            'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-full transition-colors shadow-sm',
            isReordering
              ? 'bg-[#AE3E27] text-white hover:bg-[#8f3320]'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
          ].join(' ')}
        >
          {reorderLoading ? (
            <><Loader2 size={14} className="animate-spin" /> Saving…</>
          ) : (
            <><GripVertical size={14} /> {isReordering ? 'Done Reordering' : 'Reorder Categories'}</>
          )}
        </button>

        <button
          onClick={handleAddCategory}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
                     bg-[#AE3E27] rounded-full hover:bg-[#AE3E27] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add New Category
        </button>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  MAIN CONTENT: Left Sidebar + Right Grid                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants} className="flex gap-5">
        {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
        <div className="w-[280px] shrink-0 space-y-5">
          {/* Parent category tabs with scroll arrows + drag-and-drop */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollTabs(-1)}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0"
            >
              <ChevronLeft size={16} />
            </button>
            <div
              ref={tabsRef}
              className="flex-1 flex gap-5 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {rootCategories.map((cat) => (
                <DraggableParentTab
                  key={cat.id}
                  tabId={cat.id}
                  label={cat.name}
                  count={cat.children?.length || 0}
                  active={cat.id === activeParentId}
                  onClick={() => setActiveParentId(cat.id)}
                  onEdit={() => handleEditCategory(cat)}
                  onDelete={() => handleDeleteCategory(cat)}
                  isReordering={isReordering}
                  onDragStart={handleTabDragStart}
                  onDragOver={handleTabDragOver}
                  onDragEnd={handleTabDragEnd}
                  dragOverId={dragOverId}
                  dragDirection={dragDirection}
                />
              ))}
            </div>
            <button
              onClick={() => scrollTabs(1)}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 shrink-0"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Reorder mode hint */}
          {isReordering && (
            <div className="text-xs text-[#AE3E27] bg-[#fdf2f0] rounded-lg px-3 py-2">
              <strong>Reorder mode:</strong> Drag and drop categories to change their display order. Click "Done Reordering" when finished.
            </div>
          )}

          {/* Recursive subcategory tree */}
          <div className="space-y-0.5">
            {activeParent?.children?.map((node) => renderCategoryNode(node, 0))}

            {(!activeParent?.children || activeParent.children.length === 0) && !catLoading && (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-400 mb-2">No subcategories</p>
                <button
                  onClick={handleAddCategory}
                  className="text-xs text-[#AE3E27] hover:text-[#8f3320] font-medium"
                >
                  + Add subcategory
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PRODUCT GRID ────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonProductCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AddProductCard onClick={() => navigate('/admin/products/create')} />
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="font-medium">No products found in this category.</p>
              <button
                onClick={() => navigate('/admin/products/create')}
                className="mt-3 text-sm text-[#AE3E27] hover:text-[#8f3320] font-medium"
              >
                Add a product →
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  MODALS                                                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modalOpen && (
          <CategoryFormModal
            initialData={editTarget}
            onClose={() => { setModalOpen(false); setEditTarget(null); }}
            onSuccess={handleModalSuccess}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDeleteModal
            category={deleteTarget}
            onConfirm={confirmDelete}
            onCancel={() => { setDeleteTarget(null); setDeleteError(''); }}
            loading={deleting}
            error={deleteError}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
