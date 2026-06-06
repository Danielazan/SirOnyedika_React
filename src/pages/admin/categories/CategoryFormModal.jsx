// // src/pages/admin/categories/CategoryFormModal.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Modal form for creating and editing categories.
// // Used by CategoriesPage for both "Add Category" (no initialData) and
// // "Edit" (initialData = existing category object).
// // Uploads image as multipart/form-data via the existing API.
// // ─────────────────────────────────────────────────────────────────────────────

// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence }            from 'framer-motion';
// import {
//   X, ImagePlus, ChevronDown, Save, AlertCircle, Check,
// } from 'lucide-react';

// import { createCategory, updateCategory, getCategories } from '../../../api/categories.api';
// import client from '../../../api/client';

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
//   if (path.startsWith('data:')) return path; // keep base64 data URLs as-is
//   return `${API_BASE}${path}`;
// };
// // ═══════════════════════════════════════════════════════════════════════════════

// // ── helpers ───────────────────────────────────────────────────────────────────
// function FormField({ label, required, error, children, hint }) {
//   return (
//     <div className="space-y-1.5">
//       <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
//         {label}{required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       {children}
//       {hint  && !error && <p className="text-xs text-gray-400">{hint}</p>}
//       {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
//     </div>
//   );
// }

// function StyledInput({ className = '', ...props }) {
//   return (
//     <input
//       {...props}
//       className={[
//         'w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl',
//         'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20 focus:border-[#AE3E27]',
//         'transition-colors',
//         className,
//       ].join(' ')}
//     />
//   );
// }

// function StyledTextarea({ className = '', ...props }) {
//   return (
//     <textarea
//       {...props}
//       className={[
//         'w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl',
//         'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20 focus:border-[#AE3E27]',
//         'transition-colors resize-none',
//         className,
//       ].join(' ')}
//     />
//   );
// }

// // Parent category selector
// function ParentSelect({ categories, value, onChange, excludeId }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, []);

//   const flat = [];
//   const flatten = (nodes, depth = 0) => {
//     nodes.forEach((n) => {
//       if (n.id !== excludeId) {
//         flat.push({ ...n, depth });
//         if (n.children?.length) flatten(n.children, depth + 1);
//       }
//     });
//   };
//   flatten(categories);

//   const selected = flat.find((c) => c.id === value);

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         type="button"
//         onClick={() => setOpen((v) => !v)}
//         className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-white border border-gray-200
//                    rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20 focus:border-[#AE3E27]
//                    transition-colors text-left"
//       >
//         <span className={value ? 'text-gray-900' : 'text-gray-400'}>
//           {selected?.name || 'None (top-level)'}
//         </span>
//         <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
//       </button>
//       {open && (
//         <div className="absolute top-full mt-1 left-0 right-0 z-40 bg-white border border-gray-100
//                         shadow-xl rounded-xl py-2 max-h-52 overflow-y-auto">
//           {/* None option */}
//           <button
//             type="button"
//             onClick={() => { onChange(null); setOpen(false); }}
//             className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[#fdf2f0] transition-colors text-left"
//           >
//             <span className={['w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
//               !value ? 'bg-[#AE3E27] border-[#AE3E27]' : 'border-gray-300'].join(' ')}>
//               {!value && <Check size={10} className="text-white" strokeWidth={3} />}
//             </span>
//             <span className="text-gray-500 italic">None (top-level)</span>
//           </button>
//           {flat.map((cat) => (
//             <button
//               key={cat.id}
//               type="button"
//               onClick={() => { onChange(cat.id); setOpen(false); }}
//               className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[#fdf2f0] transition-colors text-left"
//               style={{ paddingLeft: `${16 + cat.depth * 16}px` }}
//             >
//               <span className={['w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
//                 value === cat.id ? 'bg-[#AE3E27] border-[#AE3E27]' : 'border-gray-300'].join(' ')}>
//                 {value === cat.id && <Check size={10} className="text-white" strokeWidth={3} />}
//               </span>
//               <span className={value === cat.id ? 'text-[#8f3320] font-medium' : 'text-gray-700'}>{cat.name}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main component ────────────────────────────────────────────────────────────
// export default function CategoryFormModal({ initialData = null, onClose, onSuccess }) {
//   const isEdit = !!initialData;

//   const [name, setName]               = useState(initialData?.name || '');
//   const [parentId, setParentId]       = useState(initialData?.parentId || null);
//   const [description, setDescription] = useState(initialData?.description || '');
//   const [sortOrder, setSortOrder]     = useState(initialData?.sortOrder ?? 0);
//   const [isActive, setIsActive]       = useState(initialData?.isActive ?? true);

//   // Image
//   const [imageFile, setImageFile]     = useState(null);
//   // FIX: resolve the initial image URL so the preview works on edit
//   const [imagePreview, setImagePreview] = useState(
//     resolveImageUrl(initialData?.imageUrl || initialData?.image) || null
//   );
//   const imageInputRef = useRef(null);

//   // Other categories for parent select
//   const [categories, setCategories]   = useState([]);

//   const [submitting, setSubmitting]   = useState(false);
//   const [errors, setErrors]           = useState({});
//   const [apiError, setApiError]       = useState('');

//   useEffect(() => {
//     getCategories().then((res) => setCategories(res.data ?? [])).catch(() => {});
//   }, []);

//   const handleImageSelect = (file) => {
//     if (!file || !file.type.startsWith('image/')) return;
//     setImageFile(file);
//     const reader = new FileReader();
//     reader.onload = (e) => setImagePreview(e.target.result);
//     reader.readAsDataURL(file);
//   };

//   const validate = () => {
//     const errs = {};
//     if (!name.trim()) errs.name = 'Category name is required';
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setSubmitting(true);
//     setApiError('');
//     try {
//       const fd = new FormData();
//       fd.append('name', name.trim());
//       fd.append('description', description.trim());
//       fd.append('sortOrder', sortOrder);
//       fd.append('isActive', isActive);
//       if (parentId) fd.append('parentId', parentId);
//       if (imageFile) fd.append('image', imageFile);

//       if (isEdit) {
//         await updateCategory(initialData.id, fd);
//       } else {
//         await createCategory(fd);
//       }

//       onSuccess?.();
//       onClose?.();
//     } catch (err) {
//       setApiError(err?.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} category.`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {/* Backdrop */}
//       <motion.div
//         key="backdrop"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
//         onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
//       >
//         {/* Modal */}
//         <motion.div
//           key="modal"
//           initial={{ opacity: 0, scale: 0.95, y: 12 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.95, y: 12 }}
//           transition={{ type: 'spring', stiffness: 320, damping: 28 }}
//           className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Modal header */}
//           <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//             <div>
//               <h2 className="text-base font-bold text-gray-900">
//                 {isEdit ? 'Edit Category' : 'Add New Category'}
//               </h2>
//               <p className="text-xs text-gray-400 mt-0.5">
//                 {isEdit ? 'Update category details' : 'Create a new product category'}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400
//                          hover:text-gray-700 hover:bg-gray-100 transition-all"
//             >
//               <X size={16} />
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
//             {/* Image upload */}
//             <FormField label="Cover Image" hint="Recommended: 800×600px, JPEG or PNG, max 2MB">
//               <div className="flex items-start gap-4">
//                 {imagePreview ? (
//                   <div className="relative shrink-0">
//                     <img src={imagePreview} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
//                     <button
//                       type="button"
//                       onClick={() => { setImageFile(null); setImagePreview(null); }}
//                       className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow"
//                     >
//                       <X size={10} className="text-white" />
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     type="button"
//                     onClick={() => imageInputRef.current?.click()}
//                     className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center
//                                text-gray-400 hover:border-[#AE3E27] hover:text-[#AE3E27] hover:bg-[#fdf2f0] transition-all shrink-0"
//                   >
//                     <ImagePlus size={20} />
//                     <span className="text-[10px] mt-1">Upload</span>
//                   </button>
//                 )}
//                 <div className="flex-1 pt-2">
//                   <p className="text-xs text-gray-500 mb-2">
//                     {imagePreview ? 'Image selected. Click the × to remove.' : 'Click the box to select an image.'}
//                   </p>
//                   {!imagePreview && (
//                     <button
//                       type="button"
//                       onClick={() => imageInputRef.current?.click()}
//                       className="text-xs text-[#AE3E27] hover:text-[#8f3320] font-medium"
//                     >
//                       Choose file
//                     </button>
//                   )}
//                 </div>
//               </div>
//               <input
//                 ref={imageInputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => handleImageSelect(e.target.files?.[0])}
//               />
//             </FormField>

//             {/* Name */}
//             <FormField label="Category Name" required error={errors.name}>
//               <StyledInput
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="e.g. Women's Fashion"
//               />
//             </FormField>

//             {/* Parent */}
//             <FormField label="Parent Category" hint="Leave empty for a top-level category">
//               <ParentSelect
//                 categories={categories}
//                 value={parentId}
//                 onChange={setParentId}
//                 excludeId={initialData?.id}
//               />
//             </FormField>

//             {/* Description */}
//             <FormField label="Description">
//               <StyledTextarea
//                 rows={3}
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Optional category description…"
//               />
//             </FormField>

//             {/* Sort order + Active toggle */}
//             <div className="grid grid-cols-2 gap-4">
//               <FormField label="Sort Order" hint="Lower = earlier">
//                 <StyledInput
//                   type="number"
//                   min="0"
//                   value={sortOrder}
//                   onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
//                 />
//               </FormField>
//               <FormField label="Status">
//                 <div className="flex items-center gap-2.5 mt-1.5">
//                   <button
//                     type="button"
//                     onClick={() => setIsActive((v) => !v)}
//                     className={['relative w-10 h-5 rounded-full transition-colors duration-200', isActive ? 'bg-[#AE3E27]' : 'bg-gray-200'].join(' ')}
//                   >
//                     <span className={['absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', isActive ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
//                   </button>
//                   <span className="text-sm text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
//                 </div>
//               </FormField>
//             </div>

//             {/* API error */}
//             {apiError && (
//               <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
//                 <AlertCircle size={14} />{apiError}
//               </p>
//             )}
//           </form>

//           {/* Footer */}
//           <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={submitting}
//               className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
//                          bg-[#AE3E27] rounded-xl hover:bg-[#8f3320] transition-colors
//                          disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
//             >
//               {submitting ? (
//                 <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
//               ) : (
//                 <><Save size={15} />{isEdit ? 'Save Changes' : 'Create Category'}</>
//               )}
//             </button>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// src/pages/admin/categories/CategoryFormModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Modal form for creating and editing categories.
// NEW: "Sibling Order" section appears when editing — allows reordering
//      all categories that share the same parent via up/down buttons.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ImagePlus, ChevronDown, Save, AlertCircle, Check,
  ArrowUp, ArrowDown, GripVertical, Loader2,
} from 'lucide-react';

import { createCategory, updateCategory, getCategories, reorderCategories } from '../../../api/categories.api';
import client from '../../../api/client';

// ═══════════════════════════════════════════════════════════════════════════════
//  FIX: Resolve relative image paths to full backend URLs
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
//  HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function FormField({ label, required, error, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint  && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

function StyledInput({ className = '', ...props }) {
  return (
    <input
      {...props}
      className={[
        'w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl',
        'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20 focus:border-[#AE3E27]',
        'transition-colors',
        className,
      ].join(' ')}
    />
  );
}

function StyledTextarea({ className = '', ...props }) {
  return (
    <textarea
      {...props}
      className={[
        'w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl',
        'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20 focus:border-[#AE3E27]',
        'transition-colors resize-none',
        className,
      ].join(' ')}
    />
  );
}

// Parent category selector
function ParentSelect({ categories, value, onChange, excludeId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const flat = [];
  const flatten = (nodes, depth = 0) => {
    nodes.forEach((n) => {
      if (n.id !== excludeId) {
        flat.push({ ...n, depth });
        if (n.children?.length) flatten(n.children, depth + 1);
      }
    });
  };
  flatten(categories);

  const selected = flat.find((c) => c.id === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-white border border-gray-200
                   rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20 focus:border-[#AE3E27]
                   transition-colors text-left"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {selected?.name || 'None (top-level)'}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-40 bg-white border border-gray-100
                        shadow-xl rounded-xl py-2 max-h-52 overflow-y-auto">
          <button
            type="button"
            onClick={() => { onChange(null); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[#fdf2f0] transition-colors text-left"
          >
            <span className={['w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
              !value ? 'bg-[#AE3E27] border-[#AE3E27]' : 'border-gray-300'].join(' ')}>
              {!value && <Check size={10} className="text-white" strokeWidth={3} />}
            </span>
            <span className="text-gray-500 italic">None (top-level)</span>
          </button>
          {flat.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { onChange(cat.id); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[#fdf2f0] transition-colors text-left"
              style={{ paddingLeft: `${16 + cat.depth * 16}px` }}
            >
              <span className={['w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
                value === cat.id ? 'bg-[#AE3E27] border-[#AE3E27]' : 'border-gray-300'].join(' ')}>
                {value === cat.id && <Check size={10} className="text-white" strokeWidth={3} />}
              </span>
              <span className={value === cat.id ? 'text-[#8f3320] font-medium' : 'text-gray-700'}>{cat.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SIBLING ORDER LIST — NEW COMPONENT
//  Shows all categories with the same parent, allows reordering via up/down.
// ═══════════════════════════════════════════════════════════════════════════════
function SiblingOrderList({ currentCategoryId, allCategories, onReordered }) {
  const [siblings, setSiblings] = useState([]);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState('');

  // Derive siblings from the full category tree
  useEffect(() => {
    if (!allCategories?.length || !currentCategoryId) {
      setSiblings([]);
      return;
    }

    // Find the current category to know its parent
    const findCategory = (nodes, id) => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children?.length) {
          const found = findCategory(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const current = findCategory(allCategories, currentCategoryId);
    if (!current) {
      setSiblings([]);
      return;
    }

    // Collect all siblings (same parent)
    const targetParentId = current.parentId || null;
    const siblingList = [];

    const collectSiblings = (nodes, parentId = null) => {
      nodes.forEach((node) => {
        const nodeParentId = node.parentId || null;
        if (nodeParentId === targetParentId) {
          siblingList.push(node);
        }
        if (node.children?.length) {
          collectSiblings(node.children, node.id);
        }
      });
    };

    collectSiblings(allCategories);

    // Sort by sortOrder (fallback to name for stability)
    siblingList.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    setSiblings(siblingList);
  }, [allCategories, currentCategoryId]);

  const moveItem = useCallback((index, direction) => {
    setSiblings((prev) => {
      const newOrder = [...prev];
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= newOrder.length) return prev;
      [newOrder[index], newOrder[swapWith]] = [newOrder[swapWith], newOrder[index]];
      return newOrder;
    });
  }, []);

  const saveOrder = useCallback(async () => {
    setReordering(true);
    setError('');
    try {
      const orderedIds = siblings.map((c, idx) => ({ id: c.id, sortOrder: idx }));
      console.log('[SiblingOrderList] saving order:', orderedIds);
      await reorderCategories(orderedIds);
      console.log('[SiblingOrderList] order saved successfully');
      onReordered?.();
    } catch (err) {
      console.error('[SiblingOrderList] save failed:', err);
      setError(err?.response?.data?.error || 'Failed to save category order.');
    } finally {
      setReordering(false);
    }
  }, [siblings, onReordered]);

  if (siblings.length <= 1) {
    return (
      <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
        No other categories at this level to reorder.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
        {siblings.map((cat, idx) => {
          const isCurrent = cat.id === currentCategoryId;
          return (
            <div
              key={cat.id}
              className={[
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                isCurrent
                  ? 'bg-[#fdf2f0] border border-[#f8cec7] text-orange-800 font-medium'
                  : 'bg-gray-50 border border-transparent text-gray-700',
              ].join(' ')}
            >
              <GripVertical size={14} className="text-gray-300 shrink-0" />
              <span className="flex-1 truncate">{cat.name}</span>
              {isCurrent && <span className="text-[10px] text-[#AE3E27] uppercase tracking-wide shrink-0">Current</span>}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'up')}
                  disabled={idx === 0 || reordering}
                  className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700
                             hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Move up"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(idx, 'down')}
                  disabled={idx === siblings.length - 1 || reordering}
                  className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700
                             hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Move down"
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 flex items-center gap-1">
          <AlertCircle size={11} />{error}
        </p>
      )}

      <button
        type="button"
        onClick={saveOrder}
        disabled={reordering}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold
                   text-[#8f3320] bg-[#fdf2f0] border border-[#f8cec7] rounded-lg
                   hover:bg-[#fce5e0] transition-colors disabled:opacity-60"
      >
        {reordering ? (
          <><Loader2 size={12} className="animate-spin" /> Saving order…</>
        ) : (
          <><Save size={12} /> Save Category Order</>
        )}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CategoryFormModal({ initialData = null, onClose, onSuccess }) {
  const isEdit = !!initialData;

  const [name, setName]               = useState(initialData?.name || '');
  const [parentId, setParentId]       = useState(initialData?.parentId || null);
  const [description, setDescription] = useState(initialData?.description || '');
  const [sortOrder, setSortOrder]     = useState(initialData?.sortOrder ?? 0);
  const [isActive, setIsActive]       = useState(initialData?.isActive ?? true);

  // Image
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(
    resolveImageUrl(initialData?.imageUrl || initialData?.image) || null
  );
  const imageInputRef = useRef(null);

  // Other categories for parent select + sibling order
  const [categories, setCategories]   = useState([]);
  const [categoriesVersion, setCategoriesVersion] = useState(0); // bump to refresh sibling list

  const [submitting, setSubmitting]   = useState(false);
  const [errors, setErrors]           = useState({});
  const [apiError, setApiError]       = useState('');

  const loadCategories = useCallback(() => {
    getCategories().then((res) => {
      setCategories(res.data ?? []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories, categoriesVersion]);

  const handleImageSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Category name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');
    try {
      const fd = new FormData();
      fd.append('name', name.trim());
      fd.append('description', description.trim());
      fd.append('sortOrder', sortOrder);
      fd.append('isActive', isActive);
      if (parentId) fd.append('parentId', parentId);
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) {
        await updateCategory(initialData.id, fd);
      } else {
        await createCategory(fd);
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      setApiError(err?.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} category.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isEdit ? 'Edit Category' : 'Add New Category'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {isEdit ? 'Update category details' : 'Create a new product category'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400
                         hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Image upload */}
            <FormField label="Cover Image" hint="Recommended: 800×600px, JPEG or PNG, max 2MB">
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative shrink-0">
                    <img src={imagePreview} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center
                               text-gray-400 hover:border-[#AE3E27] hover:text-[#AE3E27] hover:bg-[#fdf2f0] transition-all shrink-0"
                  >
                    <ImagePlus size={20} />
                    <span className="text-[10px] mt-1">Upload</span>
                  </button>
                )}
                <div className="flex-1 pt-2">
                  <p className="text-xs text-gray-500 mb-2">
                    {imagePreview ? 'Image selected. Click the × to remove.' : 'Click the box to select an image.'}
                  </p>
                  {!imagePreview && (
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="text-xs text-[#AE3E27] hover:text-[#8f3320] font-medium"
                    >
                      Choose file
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageSelect(e.target.files?.[0])}
              />
            </FormField>

            {/* Name */}
            <FormField label="Category Name" required error={errors.name}>
              <StyledInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Women's Fashion"
              />
            </FormField>

            {/* Parent */}
            <FormField label="Parent Category" hint="Leave empty for a top-level category">
              <ParentSelect
                categories={categories}
                value={parentId}
                onChange={setParentId}
                excludeId={initialData?.id}
              />
            </FormField>

            {/* Description */}
            <FormField label="Description">
              <StyledTextarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional category description…"
              />
            </FormField>

            {/* Sort order + Active toggle */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Sort Order" hint="Lower = earlier">
                <StyledInput
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="Status">
                <div className="flex items-center gap-2.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setIsActive((v) => !v)}
                    className={['relative w-10 h-5 rounded-full transition-colors duration-200', isActive ? 'bg-[#AE3E27]' : 'bg-gray-200'].join(' ')}
                  >
                    <span className={['absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', isActive ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
                  </button>
                  <span className="text-sm text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </FormField>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/*  NEW: Sibling Order Section (edit mode only)                     */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {isEdit && (
              <div className="border-t border-gray-100 pt-4">
                <FormField
                  label="Sibling Order"
                  hint={`Reorder all categories at the ${parentId ? 'same subcategory' : 'top'} level`}
                >
                  <SiblingOrderList
                    currentCategoryId={initialData.id}
                    allCategories={categories}
                    onReordered={() => {
                      setCategoriesVersion((v) => v + 1); // refresh sibling list
                      onSuccess?.(); // notify parent page to refetch too
                    }}
                  />
                </FormField>
              </div>
            )}

            {/* API error */}
            {apiError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 flex items-center gap-2">
                <AlertCircle size={14} />{apiError}
              </p>
            )}
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
                         bg-[#AE3E27] rounded-xl hover:bg-[#8f3320] transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
              ) : (
                <><Save size={15} />{isEdit ? 'Save Changes' : 'Create Category'}</>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}