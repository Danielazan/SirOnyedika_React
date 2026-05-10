// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { motion }                 from 'framer-motion';
// import {
//   ArrowLeft, Plus, Trash2, ImagePlus, X,
//   ChevronDown, Check, Package, Tag, Layers,
//   Save, AlertCircle, CheckCircle2, RefreshCw,
// } from 'lucide-react';

// import {
//   updateProduct, updateVariant, createVariant, deleteVariant,
//   uploadVariantImages, deleteVariantImage,
// } from '../../../api/products.api';
// import { getCategories } from '../../../api/categories.api';
// import client            from '../../../api/client';

// // ── Animation ─────────────────────────────────────────────────────────────────
// const pageVariants = {
//   hidden:  { opacity: 0, y: 16 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.35, staggerChildren: 0.08 } },
// };
// const cardVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

// const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;

// // ── Shared sub-components (same design as ProductCreatePage) ──────────────────

// function SectionCard({ icon: Icon, title, subtitle, children }) {
//   return (
//     <motion.div variants={cardVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
//         <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
//           <Icon size={16} className="text-orange-600" />
//         </span>
//         <div>
//           <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
//           {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
//         </div>
//       </div>
//       <div className="p-6">{children}</div>
//     </motion.div>
//   );
// }

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
//         'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
//         'transition-colors duration-150',
//         props.disabled ? 'bg-gray-50 text-gray-400' : '',
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
//         'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
//         'transition-colors resize-none',
//         className,
//       ].join(' ')}
//     />
//   );
// }

// function CategorySelect({ categories, selected, onChange }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   const flat = [];
//   const flatten = (nodes, depth = 0) => {
//     nodes.forEach((n) => { flat.push({ ...n, depth }); if (n.children?.length) flatten(n.children, depth + 1); });
//   };
//   flatten(categories);

//   const toggle = (id) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
//   const selectedNames = flat.filter((c) => selected.includes(c.id)).map((c) => c.name);

//   return (
//     <div className="relative" ref={ref}>
//       <button
//         type="button"
//         onClick={() => setOpen((v) => !v)}
//         className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-white border border-gray-200
//                    rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
//                    transition-colors text-left"
//       >
//         <span className={selectedNames.length ? 'text-gray-900' : 'text-gray-400'}>
//           {selectedNames.length ? selectedNames.join(', ') : 'Select categories…'}
//         </span>
//         <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
//       </button>
//       {open && (
//         <div className="absolute top-full mt-1 left-0 right-0 z-30 bg-white border border-gray-100
//                         shadow-xl rounded-xl py-2 max-h-60 overflow-y-auto">
//           {flat.map((cat) => (
//             <button
//               key={cat.id}
//               type="button"
//               onClick={() => toggle(cat.id)}
//               className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-orange-50 transition-colors text-left"
//               style={{ paddingLeft: `${16 + cat.depth * 16}px` }}
//             >
//               <span className={['w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
//                 selected.includes(cat.id) ? 'bg-orange-600 border-orange-600' : 'border-gray-300'].join(' ')}>
//                 {selected.includes(cat.id) && <Check size={10} className="text-white" strokeWidth={3} />}
//               </span>
//               <span className={selected.includes(cat.id) ? 'text-orange-700 font-medium' : 'text-gray-700'}>{cat.name}</span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // Existing images from server + new local uploads
// function VariantImageManager({ existingImages = [], newPreviews = [], onDeleteExisting, onAddNew, onRemoveNew }) {
//   const inputRef = useRef(null);
//   const handleFiles = (files) => {
//     Array.from(files).filter((f) => f.type.startsWith('image/')).forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => onAddNew(file, e.target.result);
//       reader.readAsDataURL(file);
//     });
//   };

//   return (
//     <div className="space-y-3">
//       {(existingImages.length > 0 || newPreviews.length > 0) && (
//         <div className="flex flex-wrap gap-2">
//           {existingImages.map((img) => (
//             <div key={img.id} className="relative group">
//               <img src={img.url} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
//               <button
//                 type="button"
//                 onClick={() => onDeleteExisting(img.id)}
//                 className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center
//                            opacity-0 group-hover:opacity-100 transition-opacity shadow"
//               >
//                 <X size={10} className="text-white" />
//               </button>
//             </div>
//           ))}
//           {newPreviews.map((src, i) => (
//             <div key={i} className="relative group">
//               <img src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-dashed border-orange-300" />
//               <button
//                 type="button"
//                 onClick={() => onRemoveNew(i)}
//                 className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center
//                            opacity-0 group-hover:opacity-100 transition-opacity shadow"
//               >
//                 <X size={10} className="text-white" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//       <button
//         type="button"
//         onClick={() => inputRef.current?.click()}
//         onDragOver={(e) => e.preventDefault()}
//         onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
//         className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-dashed border-gray-200
//                    rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600
//                    hover:bg-orange-50 transition-all cursor-pointer w-full justify-center"
//       >
//         <ImagePlus size={16} /><span>Add images</span>
//       </button>
//       <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
//     </div>
//   );
// }

// function VariantEditCard({ variant, index, onChange, onDelete, isNew, canDelete }) {
//   const update = (key, value) => onChange(index, { ...variant, [key]: value });

//   const addAttr = () => onChange(index, { ...variant, attributes: [...(variant.attributes || []), { key: '', value: '' }] });
//   const updateAttr = (i, field, val) => {
//     const attrs = [...(variant.attributes || [])];
//     attrs[i] = { ...attrs[i], [field]: val };
//     onChange(index, { ...variant, attributes: attrs });
//   };
//   const removeAttr = (i) => onChange(index, { ...variant, attributes: variant.attributes.filter((_, idx) => idx !== i) });

//   const addNewImage   = (file, preview) => onChange(index, { ...variant, newImages: [...(variant.newImages||[]), file], newPreviews: [...(variant.newPreviews||[]), preview] });
//   const removeNewImg  = (i) => onChange(index, { ...variant, newImages: variant.newImages.filter((_,idx)=>idx!==i), newPreviews: variant.newPreviews.filter((_,idx)=>idx!==i) });
//   const deleteExistImg = (imgId) => {
//     deleteVariantImage(imgId).catch(() => {});
//     onChange(index, { ...variant, images: variant.images.filter((img) => img.id !== imgId) });
//   };

//   return (
//     <div className={['border rounded-xl p-5 space-y-5', isNew ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200 bg-gray-50/50'].join(' ')}>
//       <div className="flex items-center justify-between">
//         <span className={['text-xs font-semibold px-2.5 py-1 rounded-full',
//           isNew ? 'text-orange-600 bg-orange-100' : 'text-gray-500 bg-gray-100'].join(' ')}>
//           {isNew ? 'New Variant' : `Variant ${index + 1}`}
//         </span>
//         {canDelete && (
//           <button type="button" onClick={() => onDelete(index)} className="text-gray-400 hover:text-red-500 transition-colors">
//             <Trash2 size={15} />
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <FormField label="Variant Name" required>
//           <StyledInput value={variant.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Black / Small" />
//         </FormField>
//         <FormField label="SKU" required>
//           <StyledInput value={variant.sku} onChange={(e) => update('sku', e.target.value)} placeholder="e.g. BLK-SM-001" />
//         </FormField>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <FormField label="Price (₦)" required>
//           <StyledInput type="number" min="0" step="0.01" value={variant.price} onChange={(e) => update('price', e.target.value)} />
//         </FormField>
//         <FormField label="Sale Price (₦)">
//           <StyledInput type="number" min="0" step="0.01" value={variant.salePrice || ''} onChange={(e) => update('salePrice', e.target.value)} placeholder="Optional" />
//         </FormField>
//         <FormField label="Stock Qty">
//           <StyledInput type="number" min="0" value={variant.stockQty} onChange={(e) => update('stockQty', parseInt(e.target.value)||0)} />
//         </FormField>
//       </div>

//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           onClick={() => update('isOnSale', !variant.isOnSale)}
//           className={['relative w-10 h-5 rounded-full transition-colors duration-200', variant.isOnSale ? 'bg-orange-500' : 'bg-gray-200'].join(' ')}
//         >
//           <span className={['absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', variant.isOnSale ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
//         </button>
//         <span className="text-sm text-gray-700">Mark as on sale</span>
//       </div>

//       {/* Attributes */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attributes</span>
//           <button type="button" onClick={addAttr} className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"><Plus size={12} /> Add</button>
//         </div>
//         <div className="space-y-2">
//           {(variant.attributes || []).map((attr, i) => (
//             <div key={i} className="flex items-center gap-2">
//               <StyledInput placeholder="Key" value={attr.key} onChange={(e) => updateAttr(i, 'key', e.target.value)} className="flex-1" />
//               <StyledInput placeholder="Value" value={attr.value} onChange={(e) => updateAttr(i, 'value', e.target.value)} className="flex-1" />
//               <button type="button" onClick={() => removeAttr(i)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0"><X size={14} /></button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Images */}
//       <FormField label="Images">
//         <VariantImageManager
//           existingImages={variant.images || []}
//           newPreviews={variant.newPreviews || []}
//           onDeleteExisting={deleteExistImg}
//           onAddNew={addNewImage}
//           onRemoveNew={removeNewImg}
//         />
//       </FormField>
//     </div>
//   );
// }

// function Toast({ type, message, onClose }) {
//   useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 32, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: 32 }}
//       className={['fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium',
//         type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'].join(' ')}
//     >
//       {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
//       {message}
//       <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
//     </motion.div>
//   );
// }

// // ── Main Page ──────────────────────────────────────────────────────────────────
// export default function ProductEditPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading]         = useState(true);
//   const [name, setName]               = useState('');
//   const [description, setDescription] = useState('');
//   const [isActive, setIsActive]       = useState(true);
//   const [categoryIds, setCategoryIds] = useState([]);
//   const [categories, setCategories]   = useState([]);
//   const [variants, setVariants]       = useState([]);
//   const [deletedVariantIds, setDeletedVariantIds] = useState([]);
//   const [submitting, setSubmitting]   = useState(false);
//   const [errors, setErrors]           = useState({});
//   const [toast, setToast]             = useState(null);

//   // Load product + categories on mount
//   useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       client.get(`/admin/products/${id}`),
//       getCategories(),
//     ]).then(([prodRes, catRes]) => {
//       const p = prodRes.data?.data ?? prodRes.data;
//       setName(p.name ?? '');
//       setDescription(p.description ?? '');
//       setIsActive(p.isActive ?? true);
//       setCategoryIds((p.categories ?? []).map((c) => c.id));

//       // Normalise variants into editable shape
//       setVariants((p.variants ?? []).map((v) => ({
//         id:          v.id,
//         name:        v.name ?? '',
//         sku:         v.sku ?? '',
//         price:       v.price ?? '',
//         salePrice:   v.salePrice ?? '',
//         isOnSale:    v.isOnSale ?? false,
//         stockQty:    v.stockQty ?? 0,
//         attributes:  Object.entries(v.attributes ?? {}).map(([key, value]) => ({ key, value })),
//         images:      v.images ?? [],
//         newImages:   [],
//         newPreviews: [],
//         isNew:       false,
//       })));

//       setCategories(catRes.data ?? []);
//     }).catch(() => {
//       setToast({ type: 'error', message: 'Failed to load product.' });
//     }).finally(() => setLoading(false));
//   }, [id]);

//   const updateVariantState = (index, updated) =>
//     setVariants((vs) => vs.map((v, i) => (i === index ? updated : v)));

//   const removeVariant = async (index) => {
//     const v = variants[index];
//     if (v.id && !v.isNew) {
//       // Mark for deletion — soft delete on save
//       setDeletedVariantIds((ids) => [...ids, v.id]);
//     }
//     setVariants((vs) => vs.filter((_, i) => i !== index));
//   };

//   const addVariant = () =>
//     setVariants((vs) => [...vs, {
//       _id: uid(), name: '', sku: '', price: '', salePrice: '', isOnSale: false,
//       stockQty: 0, attributes: [{ key: '', value: '' }],
//       images: [], newImages: [], newPreviews: [], isNew: true,
//     }]);

//   const validate = () => {
//     const errs = {};
//     if (!name.trim()) errs.name = 'Product name is required';
//     if (categoryIds.length === 0) errs.categories = 'Select at least one category';
//     variants.forEach((v, i) => {
//       if (!v.name.trim()) errs[`v${i}_name`] = 'Variant name required';
//       if (!v.sku.trim())  errs[`v${i}_sku`]  = 'SKU required';
//       if (!v.price || parseFloat(v.price) <= 0) errs[`v${i}_price`] = 'Valid price required';
//     });
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) { setToast({ type: 'error', message: 'Fix validation errors first.' }); return; }

//     setSubmitting(true);
//     try {
//       // 1. Update product core
//       await updateProduct(id, {
//         name: name.trim(),
//         description: description.trim() || null,
//         categoryIds,
//         isActive,
//       });

//       // 2. Soft-delete removed variants
//       for (const vid of deletedVariantIds) {
//         await deleteVariant(vid).catch(() => {});
//       }

//       // 3. Update existing variants / create new ones
//       for (const v of variants) {
//         const attrs = {};
//         (v.attributes || []).forEach(({ key, value }) => { if (key.trim()) attrs[key.trim()] = value.trim(); });
//         const payload = {
//           name: v.name.trim(), sku: v.sku.trim(),
//           price: parseFloat(v.price),
//           salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
//           isOnSale: v.isOnSale, stockQty: parseInt(v.stockQty) || 0,
//           attributes: attrs,
//         };

//         let variantId = v.id;
//         if (v.isNew || !v.id) {
//           const res = await createVariant(id, payload);
//           variantId = res.data.id;
//         } else {
//           await updateVariant(v.id, payload);
//         }

//         // Upload any new images
//         if (v.newImages?.length > 0) {
//           const fd = new FormData();
//           v.newImages.forEach((file) => fd.append('images', file));
//           try {
//             await uploadVariantImages(variantId, fd);
//           } catch (err) {
//             console.error('Image upload failed for variant', variantId, err);
//             throw new Error(
//               err?.response?.data?.error || `Failed to upload images for variant "${v.name}"`
//             );
//           }
//         }
//       }

//       setToast({ type: 'success', message: 'Product updated successfully!' });
//       setTimeout(() => navigate('/admin/products'), 1500);
//     } catch (err) {
//       setToast({ type: 'error', message: err?.response?.data?.error || 'Failed to update product.' });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-3xl mx-auto space-y-6">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//             <div className="h-4 bg-gray-100 rounded-full animate-pulse w-1/3 mb-4" />
//             <div className="space-y-3">
//               <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
//               <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-6">
//       {/* Header */}
//       <motion.div variants={cardVariants} className="flex items-center gap-4">
//         <button
//           onClick={() => navigate('/admin/products')}
//           className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
//                      text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all shadow-sm"
//         >
//           <ArrowLeft size={17} />
//         </button>
//         <div>
//           <h1 className="text-lg font-bold text-gray-900">Edit Product</h1>
//           <p className="text-xs text-gray-400 mt-0.5">Update product details, variants, and images</p>
//         </div>
//       </motion.div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Info */}
//         <SectionCard icon={Package} title="Product Information" subtitle="Name, description, and status">
//           <div className="space-y-4">
//             <FormField label="Product Name" required error={errors.name}>
//               <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
//             </FormField>
//             <FormField label="Description">
//               <StyledTextarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed product description…" />
//             </FormField>
//             <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
//               <div>
//                 <p className="text-sm font-medium text-gray-800">Published</p>
//                 <p className="text-xs text-gray-400">Visible to customers on the storefront</p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setIsActive((v) => !v)}
//                 className={['relative w-11 h-6 rounded-full transition-colors duration-200', isActive ? 'bg-orange-500' : 'bg-gray-200'].join(' ')}
//               >
//                 <span className={['absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200', isActive ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
//               </button>
//             </div>
//           </div>
//         </SectionCard>

//         {/* Categories */}
//         <SectionCard icon={Tag} title="Categories" subtitle="Assign to one or more categories">
//           <FormField label="Categories" required error={errors.categories}>
//             <CategorySelect categories={categories} selected={categoryIds} onChange={setCategoryIds} />
//           </FormField>
//         </SectionCard>

//         {/* Variants */}
//         <SectionCard icon={Layers} title="Variants" subtitle="Edit existing variants or add new ones">
//           <div className="space-y-4">
//             {variants.map((variant, index) => (
//               <VariantEditCard
//                 key={variant.id || variant._id}
//                 variant={variant}
//                 index={index}
//                 onChange={updateVariantState}
//                 onDelete={removeVariant}
//                 isNew={variant.isNew}
//                 canDelete={variants.length > 1}
//               />
//             ))}
//             <button
//               type="button"
//               onClick={addVariant}
//               className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200
//                          rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600
//                          hover:bg-orange-50 transition-all font-medium"
//             >
//               <Plus size={16} />Add Another Variant
//             </button>
//           </div>
//         </SectionCard>

//         {/* Actions */}
//         <motion.div variants={cardVariants} className="flex items-center justify-end gap-3 pt-2 pb-6">
//           <button
//             type="button"
//             onClick={() => navigate('/admin/products')}
//             className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white
//                        bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors
//                        disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
//           >
//             {submitting ? (
//               <><RefreshCw size={15} className="animate-spin" />Saving…</>
//             ) : (
//               <><Save size={15} />Save Changes</>
//             )}
//           </button>
//         </motion.div>
//       </form>

//       {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
//     </motion.div>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion }                 from 'framer-motion';
import {
  ArrowLeft, Plus, Trash2, ImagePlus, X,
  ChevronDown, Check, Package, Tag, Layers,
  Save, AlertCircle, CheckCircle2, RefreshCw,
} from 'lucide-react';

import {
  updateProduct, updateVariant, createVariant, deleteVariant,
  uploadVariantImages, deleteVariantImage,
} from '../../../api/products.api';
import { getCategories } from '../../../api/categories.api';
import client            from '../../../api/client';

// ═══════════════════════════════════════════════════════════════════════════════
//  FIX: Resolve relative image paths to full backend URLs
//  Images are stored as /images/products/... but served from localhost:1500
//  while the frontend runs on localhost:5173. Without this, images 404.
// ═══════════════════════════════════════════════════════════════════════════════
const API_BASE = (import.meta.env?.VITE_API_URL || client.defaults?.baseURL || 'http://localhost:1500/api')
  .replace(/\/api.*$/, '')
  .replace(/\/$/, '');

const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};
// ═══════════════════════════════════════════════════════════════════════════════

// ── Animation ─────────────────────────────────────────────────────────────────
const pageVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, staggerChildren: 0.08 } },
};
const cardVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;

// ── Shared sub-components (same design as ProductCreatePage) ──────────────────

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <motion.div variants={cardVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-orange-600" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

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
        'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
        'transition-colors duration-150',
        props.disabled ? 'bg-gray-50 text-gray-400' : '',
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
        'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500',
        'transition-colors resize-none',
        className,
      ].join(' ')}
    />
  );
}

function CategorySelect({ categories, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const flat = [];
  const flatten = (nodes, depth = 0) => {
    nodes.forEach((n) => { flat.push({ ...n, depth }); if (n.children?.length) flatten(n.children, depth + 1); });
  };
  flatten(categories);

  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  const selectedNames = flat.filter((c) => selected.includes(c.id)).map((c) => c.name);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-white border border-gray-200
                   rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                   transition-colors text-left"
      >
        <span className={selectedNames.length ? 'text-gray-900' : 'text-gray-400'}>
          {selectedNames.length ? selectedNames.join(', ') : 'Select categories…'}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-30 bg-white border border-gray-100
                        shadow-xl rounded-xl py-2 max-h-60 overflow-y-auto">
          {flat.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-orange-50 transition-colors text-left"
              style={{ paddingLeft: `${16 + cat.depth * 16}px` }}
            >
              <span className={['w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                selected.includes(cat.id) ? 'bg-orange-600 border-orange-600' : 'border-gray-300'].join(' ')}>
                {selected.includes(cat.id) && <Check size={10} className="text-white" strokeWidth={3} />}
              </span>
              <span className={selected.includes(cat.id) ? 'text-orange-700 font-medium' : 'text-gray-700'}>{cat.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FIX: Existing images from server + new local uploads
//  Uses resolveImageUrl() so backend paths become full URLs.
// ═══════════════════════════════════════════════════════════════════════════════
function VariantImageManager({ existingImages = [], newPreviews = [], onDeleteExisting, onAddNew, onRemoveNew }) {
  const inputRef = useRef(null);
  const handleFiles = (files) => {
    Array.from(files).filter((f) => f.type.startsWith('image/')).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => onAddNew(file, e.target.result);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-3">
      {(existingImages.length > 0 || newPreviews.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {existingImages.map((img) => (
            <div key={img.id} className="relative group">
              {/* FIX: wrap img.url with resolveImageUrl */}
              <img src={resolveImageUrl(img.url)} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
              <button
                type="button"
                onClick={() => onDeleteExisting(img.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
          {newPreviews.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-dashed border-orange-300" />
              <button
                type="button"
                onClick={() => onRemoveNew(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity shadow"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-dashed border-gray-200
                   rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600
                   hover:bg-orange-50 transition-all cursor-pointer w-full justify-center"
      >
        <ImagePlus size={16} /><span>Add images</span>
      </button>
      <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}

function VariantEditCard({ variant, index, onChange, onDelete, isNew, canDelete }) {
  const update = (key, value) => onChange(index, { ...variant, [key]: value });

  const addAttr = () => onChange(index, { ...variant, attributes: [...(variant.attributes || []), { key: '', value: '' }] });
  const updateAttr = (i, field, val) => {
    const attrs = [...(variant.attributes || [])];
    attrs[i] = { ...attrs[i], [field]: val };
    onChange(index, { ...variant, attributes: attrs });
  };
  const removeAttr = (i) => onChange(index, { ...variant, attributes: variant.attributes.filter((_, idx) => idx !== i) });

  const addNewImage   = (file, preview) => onChange(index, { ...variant, newImages: [...(variant.newImages||[]), file], newPreviews: [...(variant.newPreviews||[]), preview] });
  const removeNewImg  = (i) => onChange(index, { ...variant, newImages: variant.newImages.filter((_,idx)=>idx!==i), newPreviews: variant.newPreviews.filter((_,idx)=>idx!==i) });
  const deleteExistImg = (imgId) => {
    deleteVariantImage(imgId).catch(() => {});
    onChange(index, { ...variant, images: variant.images.filter((img) => img.id !== imgId) });
  };

  return (
    <div className={['border rounded-xl p-5 space-y-5', isNew ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200 bg-gray-50/50'].join(' ')}>
      <div className="flex items-center justify-between">
        <span className={['text-xs font-semibold px-2.5 py-1 rounded-full',
          isNew ? 'text-orange-600 bg-orange-100' : 'text-gray-500 bg-gray-100'].join(' ')}>
          {isNew ? 'New Variant' : `Variant ${index + 1}`}
        </span>
        {canDelete && (
          <button type="button" onClick={() => onDelete(index)} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Variant Name" required>
          <StyledInput value={variant.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Black / Small" />
        </FormField>
        <FormField label="SKU" required>
          <StyledInput value={variant.sku} onChange={(e) => update('sku', e.target.value)} placeholder="e.g. BLK-SM-001" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Price (₦)" required>
          <StyledInput type="number" min="0" step="0.01" value={variant.price} onChange={(e) => update('price', e.target.value)} />
        </FormField>
        <FormField label="Sale Price (₦)">
          <StyledInput type="number" min="0" step="0.01" value={variant.salePrice || ''} onChange={(e) => update('salePrice', e.target.value)} placeholder="Optional" />
        </FormField>
        <FormField label="Stock Qty">
          <StyledInput type="number" min="0" value={variant.stockQty} onChange={(e) => update('stockQty', parseInt(e.target.value)||0)} />
        </FormField>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update('isOnSale', !variant.isOnSale)}
          className={['relative w-10 h-5 rounded-full transition-colors duration-200', variant.isOnSale ? 'bg-orange-500' : 'bg-gray-200'].join(' ')}
        >
          <span className={['absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', variant.isOnSale ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
        </button>
        <span className="text-sm text-gray-700">Mark as on sale</span>
      </div>

      {/* Attributes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attributes</span>
          <button type="button" onClick={addAttr} className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"><Plus size={12} /> Add</button>
        </div>
        <div className="space-y-2">
          {(variant.attributes || []).map((attr, i) => (
            <div key={i} className="flex items-center gap-2">
              <StyledInput placeholder="Key" value={attr.key} onChange={(e) => updateAttr(i, 'key', e.target.value)} className="flex-1" />
              <StyledInput placeholder="Value" value={attr.value} onChange={(e) => updateAttr(i, 'value', e.target.value)} className="flex-1" />
              <button type="button" onClick={() => removeAttr(i)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0"><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <FormField label="Images">
        <VariantImageManager
          existingImages={variant.images || []}
          newPreviews={variant.newPreviews || []}
          onDeleteExisting={deleteExistImg}
          onAddNew={addNewImage}
          onRemoveNew={removeNewImg}
        />
      </FormField>
    </div>
  );
}

function Toast({ type, message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 32 }}
      className={['fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium',
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'].join(' ')}
    >
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]         = useState(true);
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive]       = useState(true);
  const [categoryIds, setCategoryIds] = useState([]);
  const [categories, setCategories]   = useState([]);
  const [variants, setVariants]       = useState([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState([]);
  const [submitting, setSubmitting]   = useState(false);
  const [errors, setErrors]           = useState({});
  const [toast, setToast]             = useState(null);

  // Load product + categories on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([
      client.get(`/admin/products/${id}`),
      getCategories(),
    ]).then(([prodRes, catRes]) => {
      const p = prodRes.data?.data ?? prodRes.data;
      setName(p.name ?? '');
      setDescription(p.description ?? '');
      setIsActive(p.isActive ?? true);
      setCategoryIds((p.categories ?? []).map((c) => c.id));

      // Normalise variants into editable shape
      setVariants((p.variants ?? []).map((v) => ({
        id:          v.id,
        name:        v.name ?? '',
        sku:         v.sku ?? '',
        price:       v.price ?? '',
        salePrice:   v.salePrice ?? '',
        isOnSale:    v.isOnSale ?? false,
        stockQty:    v.stockQty ?? 0,
        attributes:  Object.entries(v.attributes ?? {}).map(([key, value]) => ({ key, value })),
        images:      v.images ?? [],
        newImages:   [],
        newPreviews: [],
        isNew:       false,
      })));

      setCategories(catRes.data ?? []);
    }).catch(() => {
      setToast({ type: 'error', message: 'Failed to load product.' });
    }).finally(() => setLoading(false));
  }, [id]);

  const updateVariantState = (index, updated) =>
    setVariants((vs) => vs.map((v, i) => (i === index ? updated : v)));

  const removeVariant = async (index) => {
    const v = variants[index];
    if (v.id && !v.isNew) {
      // Mark for deletion — soft delete on save
      setDeletedVariantIds((ids) => [...ids, v.id]);
    }
    setVariants((vs) => vs.filter((_, i) => i !== index));
  };

  const addVariant = () =>
    setVariants((vs) => [...vs, {
      _id: uid(), name: '', sku: '', price: '', salePrice: '', isOnSale: false,
      stockQty: 0, attributes: [{ key: '', value: '' }],
      images: [], newImages: [], newPreviews: [], isNew: true,
    }]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (categoryIds.length === 0) errs.categories = 'Select at least one category';
    variants.forEach((v, i) => {
      if (!v.name.trim()) errs[`v${i}_name`] = 'Variant name required';
      if (!v.sku.trim())  errs[`v${i}_sku`]  = 'SKU required';
      if (!v.price || parseFloat(v.price) <= 0) errs[`v${i}_price`] = 'Valid price required';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { setToast({ type: 'error', message: 'Fix validation errors first.' }); return; }

    setSubmitting(true);
    try {
      // 1. Update product core
      await updateProduct(id, {
        name: name.trim(),
        description: description.trim() || null,
        categoryIds,
        isActive,
      });

      // 2. Soft-delete removed variants
      for (const vid of deletedVariantIds) {
        await deleteVariant(vid).catch(() => {});
      }

      // 3. Update existing variants / create new ones
      for (const v of variants) {
        const attrs = {};
        (v.attributes || []).forEach(({ key, value }) => { if (key.trim()) attrs[key.trim()] = value.trim(); });
        const payload = {
          name: v.name.trim(), sku: v.sku.trim(),
          price: parseFloat(v.price),
          salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
          isOnSale: v.isOnSale, stockQty: parseInt(v.stockQty) || 0,
          attributes: attrs,
        };

        let variantId = v.id;
        if (v.isNew || !v.id) {
          const res = await createVariant(id, payload);
          variantId = res.data.id;
        } else {
          await updateVariant(v.id, payload);
        }

        // Upload any new images
        if (v.newImages?.length > 0) {
          const fd = new FormData();
          v.newImages.forEach((file) => fd.append('images', file));
          try {
            await uploadVariantImages(variantId, fd);
          } catch (err) {
            console.error('Image upload failed for variant', variantId, err);
            throw new Error(
              err?.response?.data?.error || `Failed to upload images for variant "${v.name}"`
            );
          }
        }
      }

      setToast({ type: 'success', message: 'Product updated successfully!' });
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setToast({ type: 'error', message: err?.response?.data?.error || 'Failed to update product.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="h-4 bg-gray-100 rounded-full animate-pulse w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={cardVariants} className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
                     text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all shadow-sm"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Edit Product</h1>
          <p className="text-xs text-gray-400 mt-0.5">Update product details, variants, and images</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <SectionCard icon={Package} title="Product Information" subtitle="Name, description, and status">
          <div className="space-y-4">
            <FormField label="Product Name" required error={errors.name}>
              <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
            </FormField>
            <FormField label="Description">
              <StyledTextarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed product description…" />
            </FormField>
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">Published</p>
                <p className="text-xs text-gray-400">Visible to customers on the storefront</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className={['relative w-11 h-6 rounded-full transition-colors duration-200', isActive ? 'bg-orange-500' : 'bg-gray-200'].join(' ')}
              >
                <span className={['absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200', isActive ? 'translate-x-5' : 'translate-x-0'].join(' ')} />
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Categories */}
        <SectionCard icon={Tag} title="Categories" subtitle="Assign to one or more categories">
          <FormField label="Categories" required error={errors.categories}>
            <CategorySelect categories={categories} selected={categoryIds} onChange={setCategoryIds} />
          </FormField>
        </SectionCard>

        {/* Variants */}
        <SectionCard icon={Layers} title="Variants" subtitle="Edit existing variants or add new ones">
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <VariantEditCard
                key={variant.id || variant._id}
                variant={variant}
                index={index}
                onChange={updateVariantState}
                onDelete={removeVariant}
                isNew={variant.isNew}
                canDelete={variants.length > 1}
              />
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200
                         rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600
                         hover:bg-orange-50 transition-all font-medium"
            >
              <Plus size={16} />Add Another Variant
            </button>
          </div>
        </SectionCard>

        {/* Actions */}
        <motion.div variants={cardVariants} className="flex items-center justify-end gap-3 pt-2 pb-6">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white
                       bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? (
              <><RefreshCw size={15} className="animate-spin" />Saving…</>
            ) : (
              <><Save size={15} />Save Changes</>
            )}
          </button>
        </motion.div>
      </form>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </motion.div>
  );
}