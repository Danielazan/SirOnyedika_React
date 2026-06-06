// import React, { useState, useMemo } from 'react';
// import { useNavigate }      from 'react-router-dom';
// import { motion }           from 'framer-motion';
// import { Search, Plus, ChevronDown, Pencil, Trash2, AlertTriangle } from 'lucide-react';

// import { useAdminProducts, useAdminCategories } from '../../../hooks/admin/useAdminData';
// import { deleteProduct, updateProduct } from '../../../api/products.api';
// import DataTable             from '../../../components/admin/DataTable';
// import Pagination            from '../../../components/admin/Pagination';
// import TextInput             from '../../../components/ui/TextInput';
// import { formatCurrency }    from '../../../utils/formatCurrency';
// import { containerVariants, itemVariants } from '../../../utils/animation';

// // Resolve relative image paths to full backend URLs
// const API_BASE = 'http://localhost:1500';

// const resolveImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith('http')) return path;
//   return `${API_BASE}${path}`;
// };

// // Categories are loaded live from the API via useAdminCategories()

// // ── Confirm delete modal ──────────────────────────────────────────────────────
// function ConfirmDeleteModal({ product, onConfirm, onCancel, loading }) {
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
//         <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Product</h3>
//         <p className="text-sm text-gray-500 text-center mb-6">
//           Are you sure you want to delete <strong>{product?.name}</strong>? This will deactivate it from the storefront.
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

// // ── Status toggle (calls API) ─────────────────────────────────────────────────
// function StatusToggle({ productId, active, onToggle }) {
//   const [on, setOn] = useState(active);
//   const [busy, setBusy] = useState(false);

//   const handleClick = async () => {
//     if (busy) return;
//     setBusy(true);
//     const next = !on;
//     setOn(next);
//     try {
//       await updateProduct(productId, { isActive: next });
//       if (onToggle) onToggle(productId, next);
//     } catch {
//       setOn(!next); // Revert on error
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleClick}
//       disabled={busy}
//       className={[
//         'relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none',
//         on ? 'bg-[#AE3E27]' : 'bg-gray-200',
//         busy ? 'opacity-60 cursor-not-allowed' : '',
//       ].join(' ')}
//     >
//       <span className={[
//         'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
//         on ? 'translate-x-5' : 'translate-x-0',
//       ].join(' ')} />
//     </button>
//   );
// }

// export default function ProductsPage() {
//   const navigate = useNavigate();
//   const [search,   setSearch]   = useState('');
//   const [category, setCategory] = useState('');
//   const [page,     setPage]     = useState(1);
//   const [catOpen,  setCatOpen]  = useState(false);

//   // Delete state
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deleting, setDeleting]         = useState(false);

//   const { products, loading, pagination, refetch } = useAdminProducts(page, search, category);

//   // Load live categories for the filter dropdown
//   const { data: categoryTree = [] } = useAdminCategories();
 
//   const flatCategories = useMemo(() => {
//     const result = [];
//     const flatten = (nodes) => {
//       if (!Array.isArray(nodes)) return;
//       nodes.forEach((n) => {
//         result.push(n);
//         if (n.children?.length) flatten(n.children);
//       });
//     };
//     flatten(categoryTree || []);
//     return result;
//   }, [categoryTree]);

//   const handleSearch   = (e) => { setSearch(e.target.value); setPage(1); };
//   const handleCategory = (cat) => {
//     setCategory(cat === 'All Categories' ? '' : cat);
//     setPage(1);
//     setCatOpen(false);
//   };

//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     try {
//       await deleteProduct(deleteTarget.id);
//       setDeleteTarget(null);
//       if (refetch) refetch();
//     } catch {
//       // silently fail — product stays in list
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // ── Table columns ──────────────────────────────────────────────────────────
//   const COLUMNS = [
//     {
//       key: 'name',
//       header: 'Product',
//       render: (v, row) => (
//         <div className="flex items-center gap-3">
//           {row.image ? (
//             <img src={resolveImageUrl(row.image)} alt={v} className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0" />
//           ) : (
//             <div className="w-9 h-9 rounded-lg bg-[#fdf2f0] flex items-center justify-center shrink-0 text-[#AE3E27] text-xs font-bold">
//               {v?.charAt(0)?.toUpperCase() || '?'}
//             </div>
//           )}
//           <div>
//             <span className="font-medium text-gray-800 text-sm leading-tight block">{v}</span>
//             {row.slug && <span className="text-xs text-gray-400">{row.slug}</span>}
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: 'sku',
//       header: 'SKU',
//       render: (v) => <span className="text-gray-400 text-xs font-mono">{v ?? '—'}</span>,
//     },
//     {
//       key: 'category',
//       header: 'Category',
//       render: (v, row) => {
//         const cats = row.categories?.map((c) => c.name).join(', ') || v || '—';
//         return <span className="text-gray-600 text-sm">{cats}</span>;
//       },
//     },
//     {
//       key: 'price',
//       header: 'Price',
//       render: (v, row) => {
//         const price = v ?? row.variants?.[0]?.price;
//         return <span className="font-semibold text-gray-800">{price ? formatCurrency(price) : '—'}</span>;
//       },
//     },
//     {
//       key: 'stock',
//       header: 'Stock',
//       render: (v, row) => {
//         const qty = v ?? row.variants?.reduce((s, vr) => s + (vr.stockQty || 0), 0) ?? 0;
//         return (
//           <span className={`font-medium text-sm ${qty === 0 ? 'text-red-500' : 'text-gray-700'}`}>
//             {qty === 0 ? 'Out of stock' : qty}
//           </span>
//         );
//       },
//     },
//     {
//       key: 'isActive',
//       header: 'Status',
//       render: (v, row) => <StatusToggle productId={row.id} active={v ?? row.status ?? true} />,
//     },
//     {
//       key: 'id',
//       header: 'Actions',
//       render: (v, row) => (
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => navigate(`/admin/products/${v}/edit`)}
//             className="flex items-center gap-1 text-xs text-[#AE3E27] hover:text-[#8f3320] font-medium transition-colors"
//           >
//             <Pencil size={12} /> Edit
//           </button>
//           <span className="text-gray-200">|</span>
//           <button
//             onClick={() => setDeleteTarget(row)}
//             className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
//           >
//             <Trash2 size={12} /> Delete
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="space-y-5"
//     >
//       {/* ── Toolbar ───────────────────────────────────────────────────── */}
//       <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
//         {/* Search */}
//         <div className="flex-1 min-w-[180px] max-w-xs">
//           <TextInput
//             placeholder="Search products…"
//             leftIcon={Search}
//             value={search}
//             onChange={handleSearch}
//           />
//         </div>

//         {/* Category filter */}
//         <div className="relative">
//           <button
//             onClick={() => setCatOpen((v) => !v)}
//             className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm
//                        text-gray-600 hover:bg-gray-50 transition-colors"
//           >
//             {category || 'Category'}
//             <ChevronDown size={14} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
//           </button>
//           {catOpen && (
//             <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-100 shadow-lg
//                             rounded-lg py-1 min-w-[180px]">
//               {/* All Categories option */}
//               <button
//                 onClick={() => handleCategory('All Categories')}
//                 className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27] transition-colors"
//               >
//                 All Categories
//               </button>
//               {flatCategories.map((cat) => (
//                 <button
//                   key={cat.id}
//                   onClick={() => handleCategory(cat.name)}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27] transition-colors"
//                   style={{ paddingLeft: `${16 + (cat.depth ?? 0) * 12}px` }}
//                 >
//                   {cat.name}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Add Product → navigates to create page */}
//         <button
//           onClick={() => navigate('/admin/products/create')}
//           className="ml-auto flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white
//                      bg-[#AE3E27] rounded-lg hover:bg-[#8f3320] transition-colors shadow-sm"
//         >
//           <Plus size={16} />
//           Add Product
//         </button>
//       </motion.div>

//       {/* ── Table ─────────────────────────────────────────────────────── */}
//       <motion.div
//         variants={itemVariants}
//         className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
//       >
//         <DataTable
//           columns={COLUMNS}
//           data={products}
//           loading={loading}
//           rowKey="id"
//           emptyMessage="No products found. Click 'Add Product' to create one."
//           skeletonRows={8}
//         />

//         {!loading && pagination.pages > 1 && (
//           <motion.div variants={itemVariants} className="px-4 pb-4">
//             <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
//           </motion.div>
//         )}
//       </motion.div>

//       {/* ── Delete Confirm ────────────────────────────────────────────── */}
//       {deleteTarget && (
//         <ConfirmDeleteModal
//           product={deleteTarget}
//           onConfirm={handleDelete}
//           onCancel={() => setDeleteTarget(null)}
//           loading={deleting}
//         />
//       )}
//     </motion.div>
//   );
// }

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate }      from 'react-router-dom';
import { motion }           from 'framer-motion';
import {
  Search, Plus, ChevronDown, Pencil, Trash2, AlertTriangle,
  Package, CheckCircle2, XCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

import { useAdminProducts, useAdminCategories } from '../../../hooks/admin/useAdminData';
import { deleteProduct, updateProduct } from '../../../api/products.api';
import { formatCurrency }    from '../../../utils/formatCurrency';
import { containerVariants, itemVariants } from '../../../utils/animation';
import client            from '../../../api/client';

// Resolve relative image paths to full backend URLs
// const API_BASE = 'http://localhost:1500';
const API_BASE = (import.meta.env?.VITE_API_URL || client.defaults?.baseURL || 'http://localhost:1500/api')
  .replace(/\/api.*$/, '')
  .replace(/\/$/, '');

const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

// ── Stats Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// ── Confirm delete modal ──────────────────────────────────────────────────────
function ConfirmDeleteModal({ product, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 w-full"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Delete Product</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete <strong>{product?.name}</strong>? This will deactivate it from the storefront.
        </p>
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

// ── Status toggle ─────────────────────────────────────────────────────────────
function StatusToggle({ productId, active, onToggle }) {
  const [on, setOn] = useState(active);
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    const next = !on;
    setOn(next);
    try {
      await updateProduct(productId, { isActive: next });
      if (onToggle) onToggle(productId, next);
    } catch {
      setOn(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={[
        'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
        on ? 'bg-[#AE3E27]' : 'bg-gray-300',
        busy ? 'opacity-60 cursor-not-allowed' : '',
      ].join(' ')}
    >
      <span className={[
        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
        on ? 'translate-x-5' : 'translate-x-0',
      ].join(' ')} />
    </button>
  );
}

// ── Stock Badge ───────────────────────────────────────────────────────────────
function StockBadge({ qty, lowThreshold = 5 }) {
  if (qty === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500">
        Out of Stock
      </span>
    );
  }
  if (qty <= lowThreshold) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#fdf2f0] text-[#AE3E27]">
        Low Stock: {qty}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-500">
      In Stock: {qty}
    </span>
  );
}

// ── Filter Dropdown ───────────────────────────────────────────────────────────
function FilterDropdown({ label, value, options, open, setOpen, onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm
                   text-gray-500 hover:bg-gray-50 transition-colors min-w-[130px] justify-between"
      >
        <span className="truncate">{value || label}</span>
        <ChevronDown size={14} className={`transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-100 shadow-lg
                        rounded-xl py-1 min-w-[180px]">
          {options.map((opt) => (
            <button
              key={opt.key || opt}
              onClick={() => { onSelect(opt); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27] transition-colors"
            >
              {opt.label || opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      <td className="px-4 py-4"><div className="w-4 h-4 bg-gray-100 rounded animate-pulse" /></td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-32 animate-pulse" />
        </div>
      </td>
      <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-20 animate-pulse" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-8 animate-pulse" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-16 animate-pulse" /></td>
      <td className="px-4 py-4"><div className="h-6 bg-gray-100 rounded-full w-20 animate-pulse" /></td>
      <td className="px-4 py-4"><div className="h-6 bg-gray-100 rounded-full w-11 animate-pulse" /></td>
      <td className="px-4 py-4"><div className="h-4 bg-gray-100 rounded w-16 animate-pulse" /></td>
    </tr>
  );
}

// ── Pagination Component ──────────────────────────────────────────────────────
function CustomPagination({ page, pages, onChange }) {
  const getPageNumbers = () => {
    const nums = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) nums.push(i);
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) nums.push(i);
        nums.push('...');
        nums.push(pages);
      } else if (page >= pages - 3) {
        nums.push(1);
        nums.push('...');
        for (let i = pages - 4; i <= pages; i++) nums.push(i);
      } else {
        nums.push(1);
        nums.push('...');
        for (let i = page - 1; i <= page + 1; i++) nums.push(i);
        nums.push('...');
        nums.push(pages);
      }
    }
    return nums;
  };

  return (
    <div className="flex items-center justify-between px-2">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-full
                   hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={14} />
        Previous
      </button>

      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((num, idx) => (
          num === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-2 text-sm text-gray-400">...</span>
          ) : (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={[
                'w-9 h-9 rounded-full text-sm font-medium transition-colors',
                num === page
                  ? 'bg-[#AE3E27] text-white'
                  : 'text-gray-600 hover:bg-gray-100',
              ].join(' ')}
            >
              {num}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-full
                   hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProductsPage() {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [page,     setPage]     = useState(1);
  const [catOpen,  setCatOpen]  = useState(false);
  const [stockOpen, setStockOpen] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const { products, loading, pagination, refetch } = useAdminProducts(page, search, category);

  // Load live categories for the filter dropdown
  const { data: categoryTree = [] } = useAdminCategories();

  const flatCategories = useMemo(() => {
    const result = [];
    const flatten = (nodes, depth = 0) => {
      if (!Array.isArray(nodes)) return;
      nodes.forEach((n) => {
        result.push({ ...n, depth });
        if (n.children?.length) flatten(n.children, depth + 1);
      });
    };
    flatten(categoryTree || []);
    return result;
  }, [categoryTree]);

  // ── Stats computation ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!products?.length) return { total: 0, inStock: 0, outOfStock: 0 };
    const total = pagination.total || products.length;
    const inStock = products.filter(p => (p.totalStock ?? 0) > 5).length;
    const outOfStock = products.filter(p => (p.totalStock ?? 0) === 0).length;
    return { total, inStock, outOfStock };
  }, [products, pagination.total]);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  const handleCategory = (cat) => {
    setCategory(cat === 'All Categories' ? '' : cat);
    setPage(1);
    setCatOpen(false);
  };

  const handleStockFilter = (filter) => {
    setStockFilter(filter === 'All' ? '' : filter);
    setPage(1);
    setStockOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      if (refetch) refetch();
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  };

  // ── Filtered products (client-side stock filter) ───────────────────────────
  const filteredProducts = useMemo(() => {
    if (!stockFilter) return products;
    return products.filter(p => {
      const qty = p.totalStock ?? 0;
      if (stockFilter === 'In Stock') return qty > 5;
      if (stockFilter === 'Low Stock') return qty > 0 && qty <= 5;
      if (stockFilter === 'Out of Stock') return qty === 0;
      return true;
    });
  }, [products, stockFilter]);

  const categoryOptions = [
    { key: 'all', label: 'All Categories' },
    ...flatCategories.map((cat) => ({ key: cat.id, label: cat.name, depth: cat.depth })),
  ];

  const stockOptions = [
    { key: 'all', label: 'All' },
    { key: 'in', label: 'In Stock' },
    { key: 'low', label: 'Low Stock' },
    { key: 'out', label: 'Out of Stock' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Stats Cards ─────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.total}
          iconBg="bg-[#fdf2f0]"
          iconColor="text-[#AE3E27]"
        />
        <StatCard
          icon={CheckCircle2}
          label="In Stock"
          value={stats.inStock}
          iconBg="bg-green-50"
          iconColor="text-green-500"
        />
        <StatCard
          icon={XCircle}
          label="Out of Stock"
          value={stats.outOfStock}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </motion.div>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full
                       placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20
                       focus:border-[#AE3E27] transition-colors"
          />
        </div>

        {/* Category filter */}
        <FilterDropdown
          label="Category"
          value={category}
          open={catOpen}
          setOpen={setCatOpen}
          onSelect={(opt) => handleCategory(opt.label)}
          options={categoryOptions}
        />

        {/* Stock filter */}
        <FilterDropdown
          label="Stock"
          value={stockFilter}
          open={stockOpen}
          setOpen={setStockOpen}
          onSelect={(opt) => handleStockFilter(opt.label)}
          options={stockOptions}
        />

        {/* Add Product */}
        <button
          onClick={() => navigate('/admin/products/create')}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white
                     bg-[#AE3E27] rounded-full hover:bg-[#AE3E27] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Product
        </button>
      </motion.div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="bg-[#fdf2f0]">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#AE3E27] focus:ring-[#AE3E27]" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8f3320] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8f3320] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8f3320] uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8f3320] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8f3320] uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8f3320] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8f3320] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((row) => {
                  const qty = row.totalStock ?? row.variants?.reduce((s, vr) => s + (vr.stockQty || 0), 0) ?? 0;
                  const variantCount = row.variants?.length || 1;
                  const price = row.price ?? row.variants?.[0]?.price;

                  return (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      {/* Checkbox */}
                      <td className="px-4 py-4">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#AE3E27] focus:ring-[#AE3E27]" />
                      </td>

                      {/* Product */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {row.image ? (
                            <img
                              src={resolveImageUrl(row.image)}
                              alt={row.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#fdf2f0] flex items-center justify-center shrink-0 text-[#AE3E27] text-xs font-bold">
                              {row.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                          <span className="font-medium text-gray-800 text-sm">{row.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span className="text-gray-600 text-sm">
                          {row.categories?.map((c) => c.name).join(', ') || '—'}
                        </span>
                      </td>

                      {/* Variants */}
                      <td className="px-4 py-4">
                        <span className="text-gray-600 text-sm">{variantCount}</span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-4">
                        <span className="text-gray-800 text-sm font-medium">
                          {price ? formatCurrency(price) : '—'}
                        </span>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-4">
                        <StockBadge qty={qty} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <StatusToggle productId={row.id} active={row.isActive ?? row.status ?? true} />
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/admin/products/${row.id}/edit`)}
                            className="text-gray-400 hover:text-[#AE3E27] transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(row)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <motion.div variants={itemVariants} className="px-4 py-4 border-t border-gray-100">
            <CustomPagination
              page={pagination.page}
              pages={pagination.pages}
              onChange={setPage}
            />
          </motion.div>
        )}
      </motion.div>

      {/* ── Delete Confirm ──────────────────────────────────────────────────── */}
      {deleteTarget && (
        <ConfirmDeleteModal
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </motion.div>
  );
}