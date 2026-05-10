// // src/pages/admin/products/ProductCreatePage.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Admin — Create Product page.
// // Flow: fill product info + categories → add variants → attach images per variant
// // → submit sequentially via API (createProduct → createVariant(s) → uploadImages).
// // ─────────────────────────────────────────────────────────────────────────────

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate }    from 'react-router-dom';
// import { motion }         from 'framer-motion';
// import {
//   ArrowLeft, Plus, Trash2, ImagePlus, X,
//   ChevronDown, Check, Package, Tag, Layers,
//   Save, AlertCircle, CheckCircle2,
// } from 'lucide-react';

// import { createProduct, createVariant, uploadVariantImages } from '../../../api/products.api';
// import { getCategories }                                      from '../../../api/categories.api';

// // ── Animation variants ────────────────────────────────────────────────────────
// const pageVariants = {
//   hidden:  { opacity: 0, y: 16 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.35, staggerChildren: 0.08 } },
// };
// const cardVariants = {
//   hidden:  { opacity: 0, y: 12 },
//   visible: { opacity: 1, y: 0 },
// };

// // ── Helpers ───────────────────────────────────────────────────────────────────
// const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;

// const EMPTY_VARIANT = () => ({
//   _id:        uid(),
//   name:       '',
//   sku:        '',
//   price:      '',
//   salePrice:  '',
//   isOnSale:   false,
//   stockQty:   0,
//   attributes: [{ key: '', value: '' }],
//   images:     [],          // File[]
//   previews:   [],          // data-URL[]
// });

// // ── Sub-components ────────────────────────────────────────────────────────────



// function SectionCard({ icon: Icon, title, subtitle, children, overflow = 'hidden' }) {
//   return (
//     <motion.div
//       variants={cardVariants}
//       className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-${overflow}`}
//     >
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
//         props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : '',
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

//   // Defensive: ensure categories is always an array
//   const safeCategories = Array.isArray(categories) ? categories : [];

//   // Flatten tree for display
//   const flat = [];
//   const flatten = (nodes, depth = 0) => {
//     if (!Array.isArray(nodes)) return;
//     nodes.forEach((n) => {
//       flat.push({ ...n, depth });
//       if (n.children?.length) flatten(n.children, depth + 1);
//     });
//   };
//   flatten(safeCategories);

//   const toggle = (id) => {
//     if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
//     else onChange([...selected, id]);
//   };

//   const selectedNames = flat
//     .filter((c) => selected.includes(c.id))
//     .map((c) => c.name);

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
//           {selectedNames.length
//             ? selectedNames.join(', ')
//             : 'Select categories…'}
//         </span>
//         <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
//       </button>

//       {open && (
//         <div className="absolute top-full mt-1 left-0 right-0 z-30 bg-white border border-gray-100
//                         shadow-xl rounded-xl py-2 max-h-60 overflow-y-auto">
//           {flat.length === 0 ? (
//             <p className="px-4 py-3 text-xs text-gray-400">No categories found. Create one first.</p>
//           ) : flat.map((cat) => (
//             <button
//               key={cat.id}
//               type="button"
//               onClick={() => toggle(cat.id)}
//               className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-orange-50
//                          transition-colors text-left"
//               style={{ paddingLeft: `${16 + cat.depth * 16}px` }}
//             >
//               <span className={[
//                 'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
//                 selected.includes(cat.id)
//                   ? 'bg-orange-600 border-orange-600'
//                   : 'border-gray-300',
//               ].join(' ')}>
//                 {selected.includes(cat.id) && <Check size={10} className="text-white" strokeWidth={3} />}
//               </span>
//               <span className={selected.includes(cat.id) ? 'text-orange-700 font-medium' : 'text-gray-700'}>
//                 {cat.name}
//               </span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// // Category multi-select dropdown
// // function CategorySelect({ categories, selected, onChange }) {
// //   const [open, setOpen] = useState(false);
// //   const ref = useRef(null);

// //   useEffect(() => {
// //     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
// //     document.addEventListener('mousedown', handler);
// //     return () => document.removeEventListener('mousedown', handler);
// //   }, []);

// //   // Flatten tree for display
// //   const flat = [];
// //   const flatten = (nodes, depth = 0) => {
// //     nodes.forEach((n) => {
// //       flat.push({ ...n, depth });
// //       if (n.children?.length) flatten(n.children, depth + 1);
// //     });
// //   };
// //   flatten(categories);

// //   const toggle = (id) => {
// //     if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
// //     else onChange([...selected, id]);
// //   };

// //   const selectedNames = flat
// //     .filter((c) => selected.includes(c.id))
// //     .map((c) => c.name);

// //   return (
// //     <div className="relative" ref={ref}>
// //       <button
// //         type="button"
// //         onClick={() => setOpen((v) => !v)}
// //         className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-white border border-gray-200
// //                    rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
// //                    transition-colors text-left"
// //       >
// //         <span className={selectedNames.length ? 'text-gray-900' : 'text-gray-400'}>
// //           {selectedNames.length
// //             ? selectedNames.join(', ')
// //             : 'Select categories…'}
// //         </span>
// //         <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
// //       </button>

// //       {open && (
// //         <div className="absolute top-full mt-1 left-0 right-0 z-30 bg-white border border-gray-100
// //                         shadow-xl rounded-xl py-2 max-h-60 overflow-y-auto">
// //           {flat.length === 0 ? (
// //             <p className="px-4 py-3 text-xs text-gray-400">No categories found. Create one first.</p>
// //           ) : flat.map((cat) => (
// //             <button
// //               key={cat.id}
// //               type="button"
// //               onClick={() => toggle(cat.id)}
// //               className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-orange-50
// //                          transition-colors text-left"
// //               style={{ paddingLeft: `${16 + cat.depth * 16}px` }}
// //             >
// //               <span className={[
// //                 'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
// //                 selected.includes(cat.id)
// //                   ? 'bg-orange-600 border-orange-600'
// //                   : 'border-gray-300',
// //               ].join(' ')}>
// //                 {selected.includes(cat.id) && <Check size={10} className="text-white" strokeWidth={3} />}
// //               </span>
// //               <span className={selected.includes(cat.id) ? 'text-orange-700 font-medium' : 'text-gray-700'}>
// //                 {cat.name}
// //               </span>
// //             </button>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // Image dropzone for a single variant
// function VariantImageUpload({ previews, onAdd, onRemove }) {
//   const inputRef = useRef(null);

//   const handleFiles = (files) => {
//     const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
//     valid.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e) => onAdd(file, e.target.result);
//       reader.readAsDataURL(file);
//     });
//   };

//   return (
//     <div className="space-y-3">
//       {/* Preview grid */}
//       {previews.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           {previews.map((src, i) => (
//             <div key={i} className="relative group">
//               <img src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
//               <button
//                 type="button"
//                 onClick={() => onRemove(i)}
//                 className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full
//                            flex items-center justify-center opacity-0 group-hover:opacity-100
//                            transition-opacity shadow"
//               >
//                 <X size={10} className="text-white" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//       {/* Dropzone */}
//       <button
//         type="button"
//         onClick={() => inputRef.current?.click()}
//         onDragOver={(e) => e.preventDefault()}
//         onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
//         className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-dashed border-gray-200
//                    rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600
//                    hover:bg-orange-50 transition-all cursor-pointer w-full justify-center"
//       >
//         <ImagePlus size={16} />
//         <span>Add images</span>
//       </button>
//       <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
//     </div>
//   );
// }

// // Single variant card
// function VariantCard({ variant, index, onChange, onRemove, canRemove }) {
//   const update = (key, value) => onChange(index, { ...variant, [key]: value });

//   const addAttr = () => onChange(index, {
//     ...variant,
//     attributes: [...variant.attributes, { key: '', value: '' }],
//   });

//   const updateAttr = (i, field, val) => {
//     const attrs = [...variant.attributes];
//     attrs[i] = { ...attrs[i], [field]: val };
//     onChange(index, { ...variant, attributes: attrs });
//   };

//   const removeAttr = (i) => onChange(index, {
//     ...variant,
//     attributes: variant.attributes.filter((_, idx) => idx !== i),
//   });

//   const addImage = (file, preview) => onChange(index, {
//     ...variant,
//     images:   [...variant.images, file],
//     previews: [...variant.previews, preview],
//   });

//   const removeImage = (i) => onChange(index, {
//     ...variant,
//     images:   variant.images.filter((_, idx) => idx !== i),
//     previews: variant.previews.filter((_, idx) => idx !== i),
//   });

//   return (
//     <div className="border border-gray-200 rounded-xl p-5 space-y-5 bg-gray-50/50">
//       {/* Variant header */}
//       <div className="flex items-center justify-between">
//         <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
//           Variant {index + 1}
//         </span>
//         {canRemove && (
//           <button
//             type="button"
//             onClick={() => onRemove(index)}
//             className="text-gray-400 hover:text-red-500 transition-colors"
//           >
//             <Trash2 size={15} />
//           </button>
//         )}
//       </div>

//       {/* Row 1: Name + SKU */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <FormField label="Variant Name" required>
//           <StyledInput
//             value={variant.name}
//             onChange={(e) => update('name', e.target.value)}
//             placeholder="e.g. Black / Small"
//           />
//         </FormField>
//         <FormField label="SKU" required hint="Must be globally unique">
//           <StyledInput
//             value={variant.sku}
//             onChange={(e) => update('sku', e.target.value)}
//             placeholder="e.g. BLK-SM-001"
//           />
//         </FormField>
//       </div>

//       {/* Row 2: Price + Sale Price + Stock */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <FormField label="Price (₦)" required>
//           <StyledInput
//             type="number"
//             min="0"
//             step="0.01"
//             value={variant.price}
//             onChange={(e) => update('price', e.target.value)}
//             placeholder="0.00"
//           />
//         </FormField>
//         <FormField label="Sale Price (₦)">
//           <StyledInput
//             type="number"
//             min="0"
//             step="0.01"
//             value={variant.salePrice}
//             onChange={(e) => update('salePrice', e.target.value)}
//             placeholder="Optional"
//           />
//         </FormField>
//         <FormField label="Stock Qty">
//           <StyledInput
//             type="number"
//             min="0"
//             value={variant.stockQty}
//             onChange={(e) => update('stockQty', parseInt(e.target.value) || 0)}
//             placeholder="0"
//           />
//         </FormField>
//       </div>

//       {/* Row 3: On Sale toggle */}
//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           onClick={() => update('isOnSale', !variant.isOnSale)}
//           className={[
//             'relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none',
//             variant.isOnSale ? 'bg-orange-500' : 'bg-gray-200',
//           ].join(' ')}
//         >
//           <span className={[
//             'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
//             variant.isOnSale ? 'translate-x-5' : 'translate-x-0',
//           ].join(' ')} />
//         </button>
//         <span className="text-sm text-gray-700">Mark as on sale</span>
//       </div>

//       {/* Row 4: Attributes (color, size, etc.) */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attributes</span>
//           <button type="button" onClick={addAttr} className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
//             <Plus size={12} /> Add
//           </button>
//         </div>
//         <div className="space-y-2">
//           {variant.attributes.map((attr, i) => (
//             <div key={i} className="flex items-center gap-2">
//               <StyledInput
//                 placeholder="Key (e.g. color)"
//                 value={attr.key}
//                 onChange={(e) => updateAttr(i, 'key', e.target.value)}
//                 className="flex-1"
//               />
//               <StyledInput
//                 placeholder="Value (e.g. Red)"
//                 value={attr.value}
//                 onChange={(e) => updateAttr(i, 'value', e.target.value)}
//                 className="flex-1"
//               />
//               <button
//                 type="button"
//                 onClick={() => removeAttr(i)}
//                 className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
//               >
//                 <X size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Row 5: Images */}
//       <FormField label="Images" hint="Drag & drop or click to upload. First image is the cover.">
//         <VariantImageUpload
//           previews={variant.previews}
//           onAdd={addImage}
//           onRemove={removeImage}
//         />
//       </FormField>
//     </div>
//   );
// }

// // ── Toast ─────────────────────────────────────────────────────────────────────
// function Toast({ type, message, onClose }) {
//   useEffect(() => {
//     const t = setTimeout(onClose, 4000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 32, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       exit={{ opacity: 0, y: 32, scale: 0.95 }}
//       className={[
//         'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium',
//         type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
//       ].join(' ')}
//     >
//       {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
//       {message}
//       <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
//     </motion.div>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function ProductCreatePage() {
//   const navigate = useNavigate();

//   // Product fields
//   const [name, setName]               = useState('');
//   const [description, setDescription] = useState('');
//   const [isActive, setIsActive]       = useState(true);
//   const [categoryIds, setCategoryIds] = useState([]);

//   // Categories fetched from API
//   const [categories, setCategories]   = useState([]);
//   const [catLoading, setCatLoading]   = useState(true);

//   // Variants
//   const [variants, setVariants] = useState([EMPTY_VARIANT()]);

//   // UI state
//   const [submitting, setSubmitting]   = useState(false);
//   const [errors, setErrors]           = useState({});
//   const [toast, setToast]             = useState(null);

//   // Fetch categories on mount
//   // useEffect(() => {
//   //   setCatLoading(true);
//   //   getCategories()
//   //     .then((res) => setCategories(res.data ?? []))
//   //     .catch(() => setCategories([]))
//   //     .finally(() => setCatLoading(false));
//   // }, []);
//   useEffect(() => {
//     setCatLoading(true);
//     getCategories()
//       .then((res) => {
//         // Normalize: backend may return { data: [...] } wrapper or [...] directly
//         const payload = res?.data ?? res;
//         const normalized = Array.isArray(payload) ? payload : [];
//         setCategories(normalized);
//       })
//       .catch((err) => {
//         console.error('[ProductCreatePage] Failed to load categories:', err.message);
//         setCategories([]);
//       })
//       .finally(() => setCatLoading(false));
//   }, []);

//   // Variant helpers
//   const updateVariant = (index, updated) =>
//     setVariants((vs) => vs.map((v, i) => (i === index ? updated : v)));

//   const removeVariant = (index) =>
//     setVariants((vs) => vs.filter((_, i) => i !== index));

//   const addVariant = () =>
//     setVariants((vs) => [...vs, EMPTY_VARIANT()]);

//   // Validation
//   const validate = () => {
//     const errs = {};
//     if (!name.trim()) errs.name = 'Product name is required';
//     if (categoryIds.length === 0) errs.categories = 'Select at least one category';

//     variants.forEach((v, i) => {
//       if (!v.name.trim())  errs[`v${i}_name`]  = 'Variant name required';
//       if (!v.sku.trim())   errs[`v${i}_sku`]   = 'SKU required';
//       if (!v.price || isNaN(parseFloat(v.price)) || parseFloat(v.price) <= 0)
//         errs[`v${i}_price`] = 'Valid price required';
//     });

//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   // Submit sequence: product → variants → images
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) {
//       setToast({ type: 'error', message: 'Please fix validation errors before saving.' });
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // 1. Create product
//       const productRes = await createProduct({
//         name: name.trim(),
//         description: description.trim() || null,
//         categoryIds,
//         isActive,
//       });
//       const product = productRes.data;

//       // 2. Create variants (sequentially to avoid SKU race conditions)
//       const createdVariants = [];
//       for (const v of variants) {
//         const attrs = {};
//         v.attributes.forEach(({ key, value }) => {
//           if (key.trim()) attrs[key.trim()] = value.trim();
//         });

//         const varRes = await createVariant(product.id, {
//           name:      v.name.trim(),
//           sku:       v.sku.trim(),
//           price:     parseFloat(v.price),
//           salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
//           isOnSale:  v.isOnSale,
//           stockQty:  parseInt(v.stockQty) || 0,
//           attributes: attrs,
//         });
//         createdVariants.push({ variantId: varRes.data.id, images: v.images });
//       }

//       // 3. Upload images for each variant that has them
//       for (const { variantId, images } of createdVariants) {
//         if (images.length > 0) {
//           const fd = new FormData();
//           images.forEach((file) => fd.append('images', file));
//           await uploadVariantImages(variantId, fd).catch(() => {
//             // Non-fatal — product still created; images can be added later
//             console.warn('Image upload failed for variant', variantId);
//           });
//         }
//       }

//       setToast({ type: 'success', message: 'Product created successfully!' });
//       setTimeout(() => navigate('/admin/products'), 1500);
//     } catch (err) {
//       const msg = err?.response?.data?.error || 'Failed to create product. Please try again.';
//       setToast({ type: 'error', message: msg });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <motion.div
//       variants={pageVariants}
//       initial="hidden"
//       animate="visible"
//       className="max-w-3xl mx-auto space-y-6"
//     >
//       {/* ── Header ─────────────────────────────────────────────────────── */}
//       <motion.div variants={cardVariants} className="flex items-center gap-4">
//         <button
//           onClick={() => navigate('/admin/products')}
//           className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
//                      text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all shadow-sm"
//         >
//           <ArrowLeft size={17} />
//         </button>
//         <div>
//           <h1 className="text-lg font-bold text-gray-900">Add New Product</h1>
//           <p className="text-xs text-gray-400 mt-0.5">Fill in the details, add variants and images</p>
//         </div>
//       </motion.div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* ── Section 1: Basic Info ─────────────────────────────────────── */}
//         <SectionCard icon={Package} title="Product Information" subtitle="Name, description, and status" overflow="visible">
//           <div className="space-y-4">
//             <FormField label="Product Name" required error={errors.name}>
//               <StyledInput
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="e.g. Classic Linen Shirt"
//               />
//             </FormField>

//             <FormField label="Description" hint="Markdown supported. Describe the product in detail.">
//               <StyledTextarea
//                 rows={4}
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Write a detailed product description…"
//               />
//             </FormField>

//             {/* Status toggle */}
//             <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
//               <div>
//                 <p className="text-sm font-medium text-gray-800">Published</p>
//                 <p className="text-xs text-gray-400">Visible to customers on the storefront</p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setIsActive((v) => !v)}
//                 className={[
//                   'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
//                   isActive ? 'bg-orange-500' : 'bg-gray-200',
//                 ].join(' ')}
//               >
//                 <span className={[
//                   'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
//                   isActive ? 'translate-x-5' : 'translate-x-0',
//                 ].join(' ')} />
//               </button>
//             </div>
//           </div>
//         </SectionCard>

//         {/* ── Section 2: Categories ─────────────────────────────────────── */}
//         <SectionCard icon={Tag} title="Categories" subtitle="Assign to one or more categories" overflow="visible">
//           <FormField label="Categories" required error={errors.categories}>
//             {catLoading ? (
//               <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
//             ) : (
//               <CategorySelect
//                 categories={categories}
//                 selected={categoryIds}
//                 onChange={setCategoryIds}
//               />
//             )}
//           </FormField>
//           {categoryIds.length > 0 && (
//             <p className="text-xs text-gray-400 mt-2">
//               {categoryIds.length} categor{categoryIds.length === 1 ? 'y' : 'ies'} selected
//             </p>
//           )}
//         </SectionCard>

//         {/* ── Section 3: Variants ───────────────────────────────────────── */}
//         <SectionCard icon={Layers} title="Variants" subtitle="Every product needs at least one variant (SKU, price, stock)" overflow="visible">
//           <div className="space-y-4">
//             {variants.map((variant, index) => (
//               <VariantCard
//                 key={variant._id}
//                 variant={variant}
//                 index={index}
//                 onChange={updateVariant}
//                 onRemove={removeVariant}
//                 canRemove={variants.length > 1}
//               />
//             ))}

//             {/* Variant errors summary */}
//             {Object.keys(errors).some((k) => k.startsWith('v')) && (
//               <p className="text-xs text-red-500 flex items-center gap-1">
//                 <AlertCircle size={12} /> Some variant fields are incomplete
//               </p>
//             )}

//             <button
//               type="button"
//               onClick={addVariant}
//               className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200
//                          rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600
//                          hover:bg-orange-50 transition-all font-medium"
//             >
//               <Plus size={16} />
//               Add Another Variant
//             </button>
//           </div>
//         </SectionCard>

//         {/* ── Action bar ────────────────────────────────────────────────── */}
//         <motion.div
//           variants={cardVariants}
//           className="flex items-center justify-end gap-3 pt-2 pb-6"
//         >
//           <button
//             type="button"
//             onClick={() => navigate('/admin/products')}
//             className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200
//                        rounded-xl hover:bg-gray-50 transition-colors"
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
//               <>
//                 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 Saving…
//               </>
//             ) : (
//               <>
//                 <Save size={15} />
//                 Save Product
//               </>
//             )}
//           </button>
//         </motion.div>
//       </form>

//       {/* ── Toast ─────────────────────────────────────────────────────── */}
//       {toast && (
//         <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
//       )}
//     </motion.div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate }    from 'react-router-dom';
import { motion }         from 'framer-motion';
import {
  ArrowLeft, Plus, Trash2, ImagePlus, X,
  ChevronDown, Check, Package, Tag, Layers,
  Save, AlertCircle, CheckCircle2,
} from 'lucide-react';

import { createProduct, createVariant, uploadVariantImages } from '../../../api/products.api';
import { getCategories }                                      from '../../../api/categories.api';

// ── Animation variants ────────────────────────────────────────────────────────
const pageVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const uid = () => `_${Math.random().toString(36).slice(2, 9)}`;

const EMPTY_VARIANT = () => ({
  _id:        uid(),
  name:       '',
  sku:        '',
  price:      '',
  salePrice:  '',
  isOnSale:   false,
  stockQty:   0,
  attributes: [{ key: '', value: '' }],
  images:     [],          // File[]
  previews:   [],          // data-URL[]
});

// ── Sub-components ────────────────────────────────────────────────────────────



function SectionCard({ icon: Icon, title, subtitle, children, overflow = 'hidden' }) {
  return (
    <motion.div
      variants={cardVariants}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-${overflow}`}
    >
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
        props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : '',
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

  // Defensive: ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Flatten tree for display
  const flat = [];
  const flatten = (nodes, depth = 0) => {
    if (!Array.isArray(nodes)) return;
    nodes.forEach((n) => {
      flat.push({ ...n, depth });
      if (n.children?.length) flatten(n.children, depth + 1);
    });
  };
  flatten(safeCategories);

  const toggle = (id) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
    else onChange([...selected, id]);
  };

  const selectedNames = flat
    .filter((c) => selected.includes(c.id))
    .map((c) => c.name);

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
          {selectedNames.length
            ? selectedNames.join(', ')
            : 'Select categories…'}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-30 bg-white border border-gray-100
                        shadow-xl rounded-xl py-2 max-h-60 overflow-y-auto">
          {flat.length === 0 ? (
            <p className="px-4 py-3 text-xs text-gray-400">No categories found. Create one first.</p>
          ) : flat.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-orange-50
                         transition-colors text-left"
              style={{ paddingLeft: `${16 + cat.depth * 16}px` }}
            >
              <span className={[
                'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                selected.includes(cat.id)
                  ? 'bg-orange-600 border-orange-600'
                  : 'border-gray-300',
              ].join(' ')}>
                {selected.includes(cat.id) && <Check size={10} className="text-white" strokeWidth={3} />}
              </span>
              <span className={selected.includes(cat.id) ? 'text-orange-700 font-medium' : 'text-gray-700'}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


// Category multi-select dropdown
// function CategorySelect({ categories, selected, onChange }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   // Flatten tree for display
//   const flat = [];
//   const flatten = (nodes, depth = 0) => {
//     nodes.forEach((n) => {
//       flat.push({ ...n, depth });
//       if (n.children?.length) flatten(n.children, depth + 1);
//     });
//   };
//   flatten(categories);

//   const toggle = (id) => {
//     if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
//     else onChange([...selected, id]);
//   };

//   const selectedNames = flat
//     .filter((c) => selected.includes(c.id))
//     .map((c) => c.name);

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
//           {selectedNames.length
//             ? selectedNames.join(', ')
//             : 'Select categories…'}
//         </span>
//         <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
//       </button>

//       {open && (
//         <div className="absolute top-full mt-1 left-0 right-0 z-30 bg-white border border-gray-100
//                         shadow-xl rounded-xl py-2 max-h-60 overflow-y-auto">
//           {flat.length === 0 ? (
//             <p className="px-4 py-3 text-xs text-gray-400">No categories found. Create one first.</p>
//           ) : flat.map((cat) => (
//             <button
//               key={cat.id}
//               type="button"
//               onClick={() => toggle(cat.id)}
//               className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-orange-50
//                          transition-colors text-left"
//               style={{ paddingLeft: `${16 + cat.depth * 16}px` }}
//             >
//               <span className={[
//                 'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
//                 selected.includes(cat.id)
//                   ? 'bg-orange-600 border-orange-600'
//                   : 'border-gray-300',
//               ].join(' ')}>
//                 {selected.includes(cat.id) && <Check size={10} className="text-white" strokeWidth={3} />}
//               </span>
//               <span className={selected.includes(cat.id) ? 'text-orange-700 font-medium' : 'text-gray-700'}>
//                 {cat.name}
//               </span>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// Image dropzone for a single variant
function VariantImageUpload({ previews, onAdd, onRemove }) {
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => onAdd(file, e.target.result);
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full
                           flex items-center justify-center opacity-0 group-hover:opacity-100
                           transition-opacity shadow"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-dashed border-gray-200
                   rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600
                   hover:bg-orange-50 transition-all cursor-pointer w-full justify-center"
      >
        <ImagePlus size={16} />
        <span>Add images</span>
      </button>
      <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}

// Single variant card
function VariantCard({ variant, index, onChange, onRemove, canRemove }) {
  const update = (key, value) => onChange(index, { ...variant, [key]: value });

  const addAttr = () => onChange(index, {
    ...variant,
    attributes: [...variant.attributes, { key: '', value: '' }],
  });

  const updateAttr = (i, field, val) => {
    const attrs = [...variant.attributes];
    attrs[i] = { ...attrs[i], [field]: val };
    onChange(index, { ...variant, attributes: attrs });
  };

  const removeAttr = (i) => onChange(index, {
    ...variant,
    attributes: variant.attributes.filter((_, idx) => idx !== i),
  });

  const addImage = (file, preview) => onChange(index, {
    ...variant,
    images:   [...variant.images, file],
    previews: [...variant.previews, preview],
  });

  const removeImage = (i) => onChange(index, {
    ...variant,
    images:   variant.images.filter((_, idx) => idx !== i),
    previews: variant.previews.filter((_, idx) => idx !== i),
  });

  return (
    <div className="border border-gray-200 rounded-xl p-5 space-y-5 bg-gray-50/50">
      {/* Variant header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
          Variant {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Row 1: Name + SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Variant Name" required>
          <StyledInput
            value={variant.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Black / Small"
          />
        </FormField>
        <FormField label="SKU" required hint="Must be globally unique">
          <StyledInput
            value={variant.sku}
            onChange={(e) => update('sku', e.target.value)}
            placeholder="e.g. BLK-SM-001"
          />
        </FormField>
      </div>

      {/* Row 2: Price + Sale Price + Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Price (₦)" required>
          <StyledInput
            type="number"
            min="0"
            step="0.01"
            value={variant.price}
            onChange={(e) => update('price', e.target.value)}
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Sale Price (₦)">
          <StyledInput
            type="number"
            min="0"
            step="0.01"
            value={variant.salePrice}
            onChange={(e) => update('salePrice', e.target.value)}
            placeholder="Optional"
          />
        </FormField>
        <FormField label="Stock Qty">
          <StyledInput
            type="number"
            min="0"
            value={variant.stockQty}
            onChange={(e) => update('stockQty', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </FormField>
      </div>

      {/* Row 3: On Sale toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update('isOnSale', !variant.isOnSale)}
          className={[
            'relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none',
            variant.isOnSale ? 'bg-orange-500' : 'bg-gray-200',
          ].join(' ')}
        >
          <span className={[
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
            variant.isOnSale ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')} />
        </button>
        <span className="text-sm text-gray-700">Mark as on sale</span>
      </div>

      {/* Row 4: Attributes (color, size, etc.) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attributes</span>
          <button type="button" onClick={addAttr} className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {variant.attributes.map((attr, i) => (
            <div key={i} className="flex items-center gap-2">
              <StyledInput
                placeholder="Key (e.g. color)"
                value={attr.key}
                onChange={(e) => updateAttr(i, 'key', e.target.value)}
                className="flex-1"
              />
              <StyledInput
                placeholder="Value (e.g. Red)"
                value={attr.value}
                onChange={(e) => updateAttr(i, 'value', e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeAttr(i)}
                className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Row 5: Images */}
      <FormField label="Images" hint="Drag & drop or click to upload. First image is the cover.">
        <VariantImageUpload
          previews={variant.previews}
          onAdd={addImage}
          onRemove={removeImage}
        />
      </FormField>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ type, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 32, scale: 0.95 }}
      className={[
        'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium',
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
      ].join(' ')}
    >
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductCreatePage() {
  const navigate = useNavigate();

  // Product fields
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive]       = useState(true);
  const [categoryIds, setCategoryIds] = useState([]);

  // Categories fetched from API
  const [categories, setCategories]   = useState([]);
  const [catLoading, setCatLoading]   = useState(true);

  // Variants
  const [variants, setVariants] = useState([EMPTY_VARIANT()]);

  // UI state
  const [submitting, setSubmitting]   = useState(false);
  const [errors, setErrors]           = useState({});
  const [toast, setToast]             = useState(null);

  // Fetch categories on mount
  // useEffect(() => {
  //   setCatLoading(true);
  //   getCategories()
  //     .then((res) => setCategories(res.data ?? []))
  //     .catch(() => setCategories([]))
  //     .finally(() => setCatLoading(false));
  // }, []);
  useEffect(() => {
    setCatLoading(true);
    getCategories()
      .then((res) => {
        // Normalize: backend may return { data: [...] } wrapper or [...] directly
        const payload = res?.data ?? res;
        const normalized = Array.isArray(payload) ? payload : [];
        setCategories(normalized);
      })
      .catch((err) => {
        console.error('[ProductCreatePage] Failed to load categories:', err.message);
        setCategories([]);
      })
      .finally(() => setCatLoading(false));
  }, []);

  // Variant helpers
  const updateVariant = (index, updated) =>
    setVariants((vs) => vs.map((v, i) => (i === index ? updated : v)));

  const removeVariant = (index) =>
    setVariants((vs) => vs.filter((_, i) => i !== index));

  const addVariant = () =>
    setVariants((vs) => [...vs, EMPTY_VARIANT()]);

  // Validation
  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Product name is required';
    if (categoryIds.length === 0) errs.categories = 'Select at least one category';

    variants.forEach((v, i) => {
      if (!v.name.trim())  errs[`v${i}_name`]  = 'Variant name required';
      if (!v.sku.trim())   errs[`v${i}_sku`]   = 'SKU required';
      if (!v.price || isNaN(parseFloat(v.price)) || parseFloat(v.price) <= 0)
        errs[`v${i}_price`] = 'Valid price required';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit sequence: product → variants → images
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ type: 'error', message: 'Please fix validation errors before saving.' });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create product
      const productRes = await createProduct({
        name: name.trim(),
        description: description.trim() || null,
        categoryIds,
        isActive,
      });
      const product = productRes.data;

      // 2. Create variants (sequentially to avoid SKU race conditions)
      const createdVariants = [];
      for (const v of variants) {
        const attrs = {};
        v.attributes.forEach(({ key, value }) => {
          if (key.trim()) attrs[key.trim()] = value.trim();
        });

        const varRes = await createVariant(product.id, {
          name:      v.name.trim(),
          sku:       v.sku.trim(),
          price:     parseFloat(v.price),
          salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
          isOnSale:  v.isOnSale,
          stockQty:  parseInt(v.stockQty) || 0,
          attributes: attrs,
        });
        createdVariants.push({ variantId: varRes.data.id, images: v.images });
      }

      // 3. Upload images for each variant that has them
      const uploadErrors = [];
      for (const { variantId, images } of createdVariants) {
        if (images.length > 0) {
          const fd = new FormData();
          images.forEach((file) => fd.append('images', file));
          try {
            await uploadVariantImages(variantId, fd);
          } catch (err) {
            uploadErrors.push(variantId);
            console.warn('Image upload failed for variant', variantId, err);
          }
        }
      }
      if (uploadErrors.length > 0) {
        setToast({
          type: 'error',
          message: `Product created, but ${uploadErrors.length} variant image upload(s) failed.`,
        });
        setSubmitting(false);
        return;
      }

      setToast({ type: 'success', message: 'Product created successfully!' });
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to create product. Please try again.';
      setToast({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div variants={cardVariants} className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center
                     text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all shadow-sm"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Add New Product</h1>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the details, add variants and images</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Section 1: Basic Info ─────────────────────────────────────── */}
        <SectionCard icon={Package} title="Product Information" subtitle="Name, description, and status" overflow="visible">
          <div className="space-y-4">
            <FormField label="Product Name" required error={errors.name}>
              <StyledInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Classic Linen Shirt"
              />
            </FormField>

            <FormField label="Description" hint="Markdown supported. Describe the product in detail.">
              <StyledTextarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a detailed product description…"
              />
            </FormField>

            {/* Status toggle */}
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-800">Published</p>
                <p className="text-xs text-gray-400">Visible to customers on the storefront</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className={[
                  'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
                  isActive ? 'bg-orange-500' : 'bg-gray-200',
                ].join(' ')}
              >
                <span className={[
                  'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                  isActive ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')} />
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 2: Categories ─────────────────────────────────────── */}
        <SectionCard icon={Tag} title="Categories" subtitle="Assign to one or more categories" overflow="visible">
          <FormField label="Categories" required error={errors.categories}>
            {catLoading ? (
              <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <CategorySelect
                categories={categories}
                selected={categoryIds}
                onChange={setCategoryIds}
              />
            )}
          </FormField>
          {categoryIds.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {categoryIds.length} categor{categoryIds.length === 1 ? 'y' : 'ies'} selected
            </p>
          )}
        </SectionCard>

        {/* ── Section 3: Variants ───────────────────────────────────────── */}
        <SectionCard icon={Layers} title="Variants" subtitle="Every product needs at least one variant (SKU, price, stock)" overflow="visible">
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <VariantCard
                key={variant._id}
                variant={variant}
                index={index}
                onChange={updateVariant}
                onRemove={removeVariant}
                canRemove={variants.length > 1}
              />
            ))}

            {/* Variant errors summary */}
            {Object.keys(errors).some((k) => k.startsWith('v')) && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> Some variant fields are incomplete
              </p>
            )}

            <button
              type="button"
              onClick={addVariant}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200
                         rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600
                         hover:bg-orange-50 transition-all font-medium"
            >
              <Plus size={16} />
              Add Another Variant
            </button>
          </div>
        </SectionCard>

        {/* ── Action bar ────────────────────────────────────────────────── */}
        <motion.div
          variants={cardVariants}
          className="flex items-center justify-end gap-3 pt-2 pb-6"
        >
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200
                       rounded-xl hover:bg-gray-50 transition-colors"
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
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={15} />
                Save Product
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </motion.div>
  );
}