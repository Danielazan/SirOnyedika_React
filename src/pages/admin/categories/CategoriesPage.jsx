
// import React, { useState } from 'react';
// import { motion }           from 'framer-motion';
// import { Plus, Pencil, Trash2, Search, AlertTriangle, FolderOpen } from 'lucide-react';

// import { useAdminCategories } from '../../../hooks/admin/useAdminData';
// import { deleteCategory }      from '../../../api/categories.api';
// import CategoryFormModal       from './CategoryFormModal';
// import Button                  from '../../../components/ui/Button';
// import TextInput               from '../../../components/ui/TextInput';
// import { containerVariants, itemVariants } from '../../../utils/animation';
// import client                  from '../../../api/client';

// // ═══════════════════════════════════════════════════════════════════════════════
// //  FIX: Resolve relative image paths to full backend URLs
// //  Category images are stored as /images/categories/... but served from
// //  localhost:1500 while the frontend runs on localhost:5173.
// // ═══════════════════════════════════════════════════════════════════════════════
// const API_BASE = (import.meta.env?.VITE_API_URL || client.defaults?.baseURL || 'http://localhost:1500/api')
//   .replace(/\/api.*$/, '')
//   .replace(/\/$/, '');

// const resolveImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   return `${API_BASE}${path}`;
// };
// // ═══════════════════════════════════════════════════════════════════════════════

// // ── Confirm delete modal ──────────────────────────────────────────────────────
// function ConfirmDeleteModal({ category, onConfirm, onCancel, loading }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
//         <p className="text-xs text-orange-600 text-center bg-orange-50 rounded-lg py-2 px-3 mb-6">
//           Categories with subcategories cannot be deleted. Remove subcategories first.
//         </p>
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

// // ── Single category card ──────────────────────────────────────────────────────
// function CategoryCard({ category, onEdit, onDelete }) {
//   // FIX: resolve the image URL before rendering
//   const imageSrc = resolveImageUrl(category.imageUrl || category.image);

//   return (
//     <motion.div
//       variants={itemVariants}
//       className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group"
//     >
//       {/* Cover image */}
//       <div className="relative h-40 overflow-hidden bg-gray-100">
//         {imageSrc ? (
//           <img
//             src={imageSrc}
//             alt={category.name}
//             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
//             <FolderOpen size={40} className="text-orange-300" />
//           </div>
//         )}

//         {/* Overlay on hover */}
//         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

//         {/* Action buttons */}
//         <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//           <button
//             onClick={() => onEdit(category)}
//             className="w-7 h-7 rounded-lg bg-white shadow flex items-center justify-center text-gray-600
//                        hover:text-orange-600 transition-colors"
//             title="Edit category"
//           >
//             <Pencil size={13} />
//           </button>
//           <button
//             onClick={() => onDelete(category)}
//             className="w-7 h-7 rounded-lg bg-white shadow flex items-center justify-center text-gray-600
//                        hover:text-red-500 transition-colors"
//             title="Delete category"
//           >
//             <Trash2 size={13} />
//           </button>
//         </div>

//         {/* Inactive badge */}
//         {category.isActive === false && (
//           <div className="absolute top-2 left-2">
//             <span className="text-xs font-medium text-gray-500 bg-white/90 px-2 py-0.5 rounded-full shadow">
//               Inactive
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Info row */}
//       <div className="px-4 py-3 flex items-center justify-between">
//         <div>
//           <p className="text-sm font-semibold text-gray-800">{category.name}</p>
//           <p className="text-xs text-gray-400 mt-0.5">
//             {category.productCount ?? category._count?.products ?? 0} products
//           </p>
//         </div>
//         <span className={[
//           'text-xs font-medium px-2 py-0.5 rounded-full',
//           category.isActive !== false
//             ? 'text-orange-600 bg-orange-50'
//             : 'text-gray-400 bg-gray-100',
//         ].join(' ')}>
//           {category.isActive !== false ? 'Active' : 'Inactive'}
//         </span>
//       </div>
//     </motion.div>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function CategoriesPage() {
//   const [search, setSearch] = useState('');

//   // Modal state
//   const [modalOpen, setModalOpen]       = useState(false);
//   const [editTarget, setEditTarget]     = useState(null);

//   // Delete state
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting]         = useState(false);
//   const [deleteError, setDeleteError]   = useState('');

//   const { data, loading, refetch } = useAdminCategories();
//   const categories = data ?? [];

//   const filtered = categories.filter((c) =>
//     c.name.toLowerCase().includes(search.toLowerCase())
//   );

//   // Flatten nested tree for display
//   const flat = [];
//   const flatten = (nodes) => {
//     nodes.forEach((n) => {
//       flat.push(n);
//       if (n.children?.length) flatten(n.children);
//     });
//   };
//   flatten(filtered);

//   const handleEdit = (category) => {
//     setEditTarget(category);
//     setModalOpen(true);
//   };

//   const handleDelete = (category) => {
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

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="space-y-5"
//     >
//       {/* ── Toolbar ───────────────────────────────────────────────────── */}
//       <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
//         <div className="flex-1 min-w-[180px] max-w-xs">
//           <TextInput
//             placeholder="Search categories…"
//             leftIcon={Search}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <Button
//           leftIcon={Plus}
//           className="ml-auto"
//           onClick={() => { setEditTarget(null); setModalOpen(true); }}
//         >
//           Add Category
//         </Button>
//       </motion.div>

//       {/* ── Category cards grid ───────────────────────────────────────── */}
//       {loading ? (
//         <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
//               <div className="h-40 bg-gray-100 animate-pulse" />
//               <div className="p-3 space-y-2">
//                 <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
//                 <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
//               </div>
//             </div>
//           ))}
//         </motion.div>
//       ) : flat.length === 0 ? (
//         <motion.div variants={itemVariants} className="text-center py-16 text-gray-400">
//           <FolderOpen size={40} className="mx-auto mb-3 text-gray-200" />
//           <p className="font-medium">
//             {search ? 'No categories match your search.' : 'No categories yet.'}
//           </p>
//           {!search && (
//             <button
//               onClick={() => { setEditTarget(null); setModalOpen(true); }}
//               className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
//             >
//               Create your first category →
//             </button>
//           )}
//         </motion.div>
//       ) : (
//         <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//           {flat.map((cat) => (
//             <CategoryCard
//               key={cat.id}
//               category={cat}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))}
//         </motion.div>
//       )}

//       {/* ── Category Form Modal ───────────────────────────────────────── */}
//       {modalOpen && (
//         <CategoryFormModal
//           initialData={editTarget}
//           onClose={() => { setModalOpen(false); setEditTarget(null); }}
//           onSuccess={handleModalSuccess}
//         />
//       )}

//       {/* ── Delete Confirm ────────────────────────────────────────────── */}
//       {deleteTarget && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95, y: 10 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 w-full"
//           >
//             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
//               <AlertTriangle size={22} className="text-red-500" />
//             </div>
//             <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Category</h3>
//             <p className="text-sm text-gray-500 text-center mb-2">
//               Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
//             </p>
//             <p className="text-xs text-orange-600 text-center bg-orange-50 rounded-lg py-2 px-3 mb-4">
//               Categories with subcategories cannot be deleted. Remove subcategories first.
//             </p>
//             {deleteError && (
//               <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4 text-center">{deleteError}</p>
//             )}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => { setDeleteTarget(null); setDeleteError(''); }}
//                 className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 disabled={deleting}
//                 className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
//               >
//                 {deleting ? 'Deleting…' : 'Delete'}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </motion.div>
//   );
// }

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate }      from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, ChevronLeft, ChevronRight, Check, Pencil, Trash2, AlertTriangle, MoreHorizontal,
} from 'lucide-react';

import { useAdminCategories } from '../../../hooks/admin/useAdminData';
import { useAdminProducts }   from '../../../hooks/admin/useAdminData';
import { deleteCategory }     from '../../../api/categories.api';
import CategoryFormModal      from './CategoryFormModal';
import { formatCurrency }     from '../../../utils/formatCurrency';
import { containerVariants, itemVariants } from '../../../utils/animation';
import client                 from '../../../api/client';

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

// ── Confirm delete modal ──────────────────────────────────────────────────────
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
        <p className="text-xs text-orange-600 text-center bg-orange-50 rounded-lg py-2 px-3 mb-4">
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

// ── Checkbox component ────────────────────────────────────────────────────────
function StyledCheckbox({ checked, onChange, label, actions }) {
  return (
    <div className="group flex items-center justify-between w-full rounded-lg hover:bg-gray-50 transition-colors">
      <button
        type="button"
        onClick={onChange}
        className="flex items-center gap-3 w-full text-left py-2 px-1"
      >
        <span className={[
          'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
          checked
            ? 'bg-orange-500 border-orange-500'
            : 'border-gray-300 bg-white',
        ].join(' ')}>
          {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </span>
        <span className={['text-sm transition-colors truncate', checked ? 'text-gray-900 font-medium' : 'text-gray-600'].join(' ')}>
          {label}
        </span>
      </button>
      {/* Actions — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
        {actions}
      </div>
    </div>
  );
}

// ── Parent category tab ───────────────────────────────────────────────────────
//  FIXED: Dropdown uses position:fixed. Outside-click handler now checks
//  BOTH the button AND the dropdown menu before closing, so clicking
//  Edit/Delete inside the menu doesn't prematurely remove the dropdown.
// ═══════════════════════════════════════════════════════════════════════════════
function ParentTab({ label, active, count, onClick, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Toggle menu + calculate fixed position from button rect
  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!menuOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left - 90 });
    }
    setMenuOpen((v) => !v);
  };

  // Close on outside click — BUT only if click is outside BOTH button and menu
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      const inBtn = btnRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inBtn && !inMenu) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Handle edit/delete: close menu first, then fire action on next tick
  // so React has time to remove the dropdown before parent re-renders
  const handleAction = (action) => {
    setMenuOpen(false);
    setTimeout(() => action?.(), 10);
  };

  return (
    <>
      <div className="group relative flex items-center">
        <button
          onClick={onClick}
          className={[
            'flex items-center gap-1 text-sm font-medium whitespace-nowrap px-1 pb-2 transition-colors border-b-2',
            active
              ? 'text-gray-900 border-orange-500'
              : 'text-gray-400 border-transparent hover:text-gray-600',
          ].join(' ')}
        >
          {label}
          {count > 0 && (
            <span className="text-xs text-gray-400">({count})</span>
          )}
        </button>

        {/* "..." more button */}
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
      </div>

      {/* FIXED DROPDOWN: position:fixed breaks out of overflow container */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed z-[100] bg-white border border-gray-100 shadow-xl rounded-xl py-1 min-w-[120px]"
          style={{ top: pos.top, left: pos.left }}
        >
          <button
            onClick={() => handleAction(onEdit)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left"
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

// ── Add Product Placeholder Card ──────────────────────────────────────────────
function AddProductCard({ onClick }) {
  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      className="border-2 border-dashed border-gray-300 rounded-2xl bg-white flex flex-col items-center justify-center
                 gap-3 p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all
                 min-h-[260px]"
    >
      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-sm">
        <Plus size={24} className="text-white" />
      </div>
      <p className="text-sm font-medium text-gray-700 text-center leading-snug">
        Add New Product<br />to Category
      </p>
    </motion.div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
//  DESIGN MATCH: Images are smaller, centered with padding, rounded-2xl.
//  They do NOT fill the full card width — white space surrounds them.
// ═══════════════════════════════════════════════════════════════════════════════
function ProductCard({ product }) {
  const imageSrc = resolveImageUrl(product.image);
  const price = product.price ?? product.variants?.[0]?.price;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
    >
      {/* Image — centered, padded, fixed size, rounded-2xl */}
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

      {/* Info */}
      <div className="px-5 pb-5 pt-1">
        <p className="text-sm text-gray-800 font-medium truncate">{product.name}</p>
        <p className="text-sm font-bold text-gray-900 mt-1">
          {price ? formatCurrency(price) : '—'}
        </p>
      </div>
    </motion.div>
  );
}

// ── Skeleton Product Card ─────────────────────────────────────────────────────
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
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function CategoriesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Modal state
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState('');

  // Category data
  const { data: categoryTree = [], loading: catLoading, refetch } = useAdminCategories();

  // Extract root categories for tabs
  const rootCategories = useMemo(() => {
    if (!Array.isArray(categoryTree)) return [];
    return categoryTree.filter((c) => !c.parentId);
  }, [categoryTree]);

  // Active parent tab
  const [activeParentId, setActiveParentId] = useState(() => {
    if (rootCategories.length > 0) {
      const men = rootCategories.find((c) => c.name.toLowerCase() === 'men');
      return men?.id || rootCategories[0]?.id;
    }
    return null;
  });

  useEffect(() => {
    if (rootCategories.length > 0 && !activeParentId) {
      const men = rootCategories.find((c) => c.name.toLowerCase() === 'men');
      setActiveParentId(men?.id || rootCategories[0]?.id);
    }
  }, [rootCategories, activeParentId]);

  const activeParent = useMemo(() =>
    rootCategories.find((c) => c.id === activeParentId),
  [rootCategories, activeParentId]);

  const subcategories = useMemo(() => {
    if (!activeParent) return [];
    return activeParent.children || [];
  }, [activeParent]);

  // Selected subcategory IDs
  const [selectedSubIds, setSelectedSubIds] = useState([]);

  useEffect(() => {
    if (subcategories.length > 0) {
      setSelectedSubIds([subcategories[0].id]);
    } else {
      setSelectedSubIds([]);
    }
  }, [activeParentId, subcategories]);

  const toggleSubcategory = (id) => {
    setSelectedSubIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Category filter for products API
  const categoryFilter = useMemo(() => {
    if (selectedSubIds.length > 0) {
      const sub = subcategories.find((s) => s.id === selectedSubIds[0]);
      return sub?.name || '';
    }
    return activeParent?.name || '';
  }, [selectedSubIds, subcategories, activeParent]);

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
      // If we deleted the active parent, reset
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
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full
                       placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20
                       focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Add New Category */}
        <button
          onClick={handleAddCategory}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
                     bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-sm"
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
        <div className="w-[260px] shrink-0 space-y-5">
          {/* Parent category tabs with scroll arrows */}
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
                <ParentTab
                  key={cat.id}
                  label={cat.name}
                  count={cat.children?.length || 0}
                  active={cat.id === activeParentId}
                  onClick={() => setActiveParentId(cat.id)}
                  onEdit={() => handleEditCategory(cat)}
                  onDelete={() => handleDeleteCategory(cat)}
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

          {/* Subcategory checklist */}
          <div className="space-y-0.5">
            {subcategories.map((sub) => (
              <StyledCheckbox
                key={sub.id}
                checked={selectedSubIds.includes(sub.id)}
                onChange={() => toggleSubcategory(sub.id)}
                label={sub.name}
                actions={
                  <>
                    <button
                      onClick={() => handleEditCategory(sub)}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-orange-500 rounded hover:bg-orange-50 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(sub)}
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </>
                }
              />
            ))}
            {subcategories.length === 0 && !catLoading && (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-400 mb-2">No subcategories</p>
                <button
                  onClick={handleAddCategory}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
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
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Add New Product placeholder */}
              <AddProductCard onClick={() => navigate('/admin/products/create')} />

              {/* Product cards */}
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
                className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
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