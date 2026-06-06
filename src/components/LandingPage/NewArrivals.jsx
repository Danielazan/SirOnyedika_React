// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useQuery } from '@tanstack/react-query';
// import { getProducts } from '../../api/products.api';
// import NewArrivalCard from './NewArrivalCard';

// // ─── Constants ────────────────────────────────────────────────────────────────
// const AUTOPLAY_MS = 4000;
// const SWIPE_THRESHOLD = 50;

// // ─── SVG Icons ────────────────────────────────────────────────────────────────
// const ChevronLeft = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M15 18l-6-6 6-6" />
//   </svg>
// );
// const ChevronRight = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M9 18l6-6-6-6" />
//   </svg>
// );

// // ─── Slide config ────────────────────────────────────────────────────────────
// const SLIDE_CONFIG = [
//   { layout: 'full-image',    bg: '#AE3E27', description: 'Discover our latest collection of meticulously crafted essentials. Rooted in the principles of New Luxury, every piece is designed for permanence, tactile elegance, and uncompromising comfort.' },
//   { layout: 'product-right',  bg: '#f5e6e0', description: 'Designed for your everyday confidence.' },
//   { layout: 'product-left',   bg: '#e8d5d0', description: 'Designed for your everyday confidence.' },
// ];

// // ─── Resolve product image from API response ─────────────────────────────────
// const resolveProductImage = (product) => {
//   if (!product) return null;
//   if (product.variants?.[0]?.images?.[0]?.imageUrl) {
//     return product.variants[0].images[0].imageUrl;
//   }
//   if (product.variants?.[0]?.images?.[0]?.url) {
//     return product.variants[0].images[0].url;
//   }
//   return product.image || null;
// };

// const resolvePrice = (product) => {
//   if (!product?.variants?.length) return product?.price || 0;
//   const firstVariant = product.variants[0];
//   if (firstVariant.isOnSale && firstVariant.salePrice > 0) {
//     return firstVariant.salePrice;
//   }
//   return firstVariant.price || product.price || 0;
// };

// // ─── 3D Flip Variants ───────────────────────────────────────────────────────
// const slideVariants = {
//   enter: (direction) => ({
//     x: direction > 0 ? 300 : -300,
//     rotateY: direction > 0 ? -45 : 45,
//     opacity: 0,
//     scale: 0.95,
//   }),
//   center: {
//     x: 0,
//     rotateY: 0,
//     opacity: 1,
//     scale: 1,
//     transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
//   },
//   exit: (direction) => ({
//     x: direction > 0 ? -300 : 300,
//     rotateY: direction > 0 ? 45 : -45,
//     opacity: 0,
//     scale: 0.95,
//     transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
//   })
// };

// // ─────────────────────────────────────────────────────────────────────────────
// export default function NewArrivalsSection() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [direction, setDirection] = useState(1);
//   const [isPaused, setIsPaused] = useState(false);
//   const [manualTick, setManualTick] = useState(0);
//   const [touchStartX, setTouchStartX] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   const sliderRef = useRef(null);

//   // ── Fetch new arrivals from backend ───────────────────────────────────────
//   const { data: products = [], isLoading, error } = useQuery({
//     queryKey: ['new-arrivals'],
//     queryFn: () => getProducts({ sort: 'newest', limit: 9 }),
//     select: (res) => {
//       const payload = res?.data ?? res;
//       return Array.isArray(payload) ? payload : [];
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   // ── Detect mobile ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 768);
//     check();
//     window.addEventListener('resize', check);
//     return () => window.removeEventListener('resize', check);
//   }, []);

//   // ── Derived ──────────────────────────────────────────────────────────────
//   const slides = products.slice(0, SLIDE_CONFIG.length);
//   const maxIndex = Math.max(0, slides.length - 1);

//   // ── Guard index when data changes ─────────────────────────────────────────
//   useEffect(() => {
//     setCurrentIndex((i) => Math.min(i, maxIndex));
//   }, [maxIndex]);

//   // ── Manual navigation ─────────────────────────────────────────────────────
//   const goTo = useCallback((idx, dir = 1) => {
//     setDirection(dir);
//     setCurrentIndex((i) => Math.max(0, Math.min(idx, maxIndex)));
//     setManualTick((n) => n + 1);
//   }, [maxIndex]);

//   const goNext = useCallback(() => goTo(currentIndex + 1, 1), [currentIndex, goTo]);
//   const goPrev = useCallback(() => goTo(currentIndex - 1, -1), [currentIndex, goTo]);

//   // ── Autoplay ─────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (isPaused || maxIndex === 0) return;
//     const id = setInterval(() => {
//       setDirection(1);
//       setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));
//     }, AUTOPLAY_MS);
//     return () => clearInterval(id);
//   }, [isPaused, maxIndex, manualTick]);

//   // ── Touch / swipe handlers ────────────────────────────────────────────────
//   const onTouchStart = (e) => {
//     setTouchStartX(e.touches[0].clientX);
//   };
//   const onTouchMove = (e) => {
//     if (touchStartX === null) return;
//     const delta = touchStartX - e.touches[0].clientX;
//     if (Math.abs(delta) > SWIPE_THRESHOLD) {
//       if (delta > 0) goNext();
//       else goPrev();
//       setTouchStartX(null);
//     }
//   };
//   const onTouchEnd = () => {
//     setTouchStartX(null);
//   };

//   // ── Mouse drag handlers ──────────────────────────────────────────────────
//   const dragStartX = useRef(null);
//   const onPointerDown = (e) => { dragStartX.current = e.clientX; };
//   const onPointerUp = (e) => {
//     if (dragStartX.current === null) return;
//     const delta = dragStartX.current - e.clientX;
//     if (delta > SWIPE_THRESHOLD) goNext();
//     if (delta < -SWIPE_THRESHOLD) goPrev();
//     dragStartX.current = null;
//   };
//   const onPointerLeave = () => { dragStartX.current = null; };

//   // ── Handle add to cart ───────────────────────────────────────────────────
//   const handleAddToCart = (product) => {
//     console.log('[NewArrivals] Add to cart:', product);
//     // TODO: Wire to your cart store when ready
//     // import { useCart } from '../../hooks/cart/useCart' then call addToCart(product)
//   };

//   // ── Loading state ──────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <section className="relative w-full overflow-hidden py-12 px-4" style={{ background: '#0b0b0f', minHeight: 400 }}>
//         <div className="max-w-5xl mx-auto">
//           <div className="flex items-center gap-2 mb-6">
//             <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
//             <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // ── Error state ──────────────────────────────────────────────────────────
//   if (error) {
//     return (
//       <section className="relative w-full overflow-hidden py-12 px-4" style={{ background: '#0b0b0f' }}>
//         <div className="max-w-5xl mx-auto text-center">
//           <p className="text-white/50 text-sm">Unable to load new arrivals. Please try again later.</p>
//         </div>
//       </section>
//     );
//   }

//   // ── Empty state ────────────────────────────────────────────────────────────
//   if (slides.length === 0) {
//     return (
//       <section className="relative w-full overflow-hidden py-12 px-4" style={{ background: '#0b0b0f' }}>
//         <div className="max-w-5xl mx-auto text-center">
//           <p className="text-white/40 text-sm">No new arrivals at the moment.</p>
//         </div>
//       </section>
//     );
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <section
//       className="relative w-full overflow-hidden py-10 px-4 sm:px-6 lg:px-8"
//       style={{ background: '#0b0b0f', minHeight: 500 }}
//       onMouseEnter={() => setIsPaused(true)}
//       onMouseLeave={() => setIsPaused(false)}
//       onTouchStart={onTouchStart}
//       onTouchMove={onTouchMove}
//       onTouchEnd={onTouchEnd}
//       onPointerDown={onPointerDown}
//       onPointerUp={onPointerUp}
//       onPointerLeave={onPointerLeave}
//     >
//       {/* ━━━ VIDEO BACKGROUND ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
//         <video
//           autoPlay
//           loop
//           muted
//           playsInline
//           className="absolute inset-0 w-full h-full object-cover"
//           style={{ opacity: 0.35 }}
//           poster="/video-poster.jpg"
//         >
//           <source src="/videos/new-arrivals-bg.mp4" type="video/mp4" />
//           <source src="/videos/new-arrivals-bg.webm" type="video/webm" />
//         </video>
//         <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(11,11,15,0.6) 0%, rgba(11,11,15,0.85) 100%)' }} />
//         <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(0,0,0,0.6) 100%)' }} />
//       </div>

//       {/* ━━━ SECTION HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
//       <motion.div
//         className="relative z-10 max-w-5xl mx-auto mb-8"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, margin: '-50px' }}
//         transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
//       >
//         <div className="flex items-baseline gap-2">
//           <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">New</h2>
//           <span className="text-2xl sm:text-3xl font-bold text-[#AE3E27]">Arrivals</span>
//         </div>
//         <p className="text-sm text-white/50 mt-1">Discover our latest collection</p>
//       </motion.div>

//       {/* ━━━ SLIDE CONTENT - Centered narrower container ━━━━━━━━━━━━━━━━━━━━ */}
//       <div className="relative z-10 max-w-5xl mx-auto" style={{ perspective: 1200 }}>
//         <AnimatePresence mode="wait" custom={direction}>
//           {slides.map((product, idx) => {
//             if (idx !== currentIndex) return null;
//             const config = SLIDE_CONFIG[idx % SLIDE_CONFIG.length];
//             const mainImage = resolveProductImage(product);
//             const price = resolvePrice(product);
//             const originalPrice = product?.variants?.[0]?.price || product?.price || 0;
//             const isOnSale = product?.variants?.[0]?.isOnSale && originalPrice > price;

//             const variantImages = (product?.variants || [])
//               .slice(0, 4)
//               .map((v, i) => {
//                 const url = v?.images?.[0]?.imageUrl || v?.images?.[0]?.url || v?.image || mainImage;
//                 return { id: v?.id || i, url, name: v?.name || `Variant ${i + 1}` };
//               });

//             const slideNumber = String(idx + 1).padStart(2, '0');
//             const nameWords = product.name?.split(' ') || ['New', 'Arrival'];
//             const firstWord = nameWords[0];
//             const restWords = nameWords.slice(1).join(' ');

//             return (
//               <motion.div
//                 key={`${product.id}-${idx}`}
//                 custom={direction}
//                 variants={slideVariants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center"
//               >
//                 {/* ── LEFT: Brown Offset + Neon Glow Image ─────────────── */}
//                 <div className="md:col-span-5 relative group">
//                   {/* Brown offset background card (inner card) */}
//                   <div 
//                     className="absolute -top-5 -left-5 w-full h-full rounded-3xl border border-white/5"
//                     style={{ backgroundColor: '#1a0f0f' }}
//                     aria-hidden="true"
//                   />

//                   {/* Main image container with soft neon glow */}
//                   <div 
//                     className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0b0b0f] transition-shadow duration-500 group-hover:shadow-[0_0_60px_-8px_rgba(174,62,39,0.6)]"
//                     style={{ 
//                       aspectRatio: '4 / 5',
//                       boxShadow: '0 0 50px -12px rgba(174, 62, 39, 0.35)',
//                     }}
//                   >
//                     {/* Subtle inner warmth */}
//                     <div className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none bg-gradient-to-br from-[#AE3E27]/10 to-transparent" />
                    
//                     {mainImage ? (
//                       <img
//                         src={mainImage}
//                         alt={product.name}
//                         className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//                         loading="eager"
//                       />
//                     ) : (
//                       <div className="relative w-full h-full flex items-center justify-center text-white/30 text-sm">
//                         No Image
//                       </div>
//                     )}
//                     <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
//                   </div>

//                   {/* Floating index badge */}
//                   <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full bg-[#0b0b0f] border border-white/10 flex items-center justify-center shadow-2xl">
//                     <span className="text-white font-bold text-sm tracking-widest">{slideNumber}</span>
//                   </div>

//                   {isMobile && (
//                     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
//                       {slides.map((_, dotIdx) => (
//                         <button
//                           key={dotIdx}
//                           onClick={() => goTo(dotIdx, dotIdx > currentIndex ? 1 : -1)}
//                           className={`w-2 h-2 rounded-full transition-all ${
//                             dotIdx === currentIndex ? 'bg-[#AE3E27] w-5' : 'bg-white/30'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* ── RIGHT: Editorial Product Info ────────────────────── */}
//                 <div className="md:col-span-7 flex flex-col gap-6 md:gap-8">
//                   {/* Category label */}
//                   <span className="text-[11px] text-[#AE3E27] uppercase tracking-[0.3em] font-semibold">
//                     {product.category || 'The Collection'}
//                   </span>

//                   {/* Artistic Headline */}
//                   <div className="flex flex-col gap-1">
//                     <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight leading-[0.9]">
//                       {firstWord}
//                     </span>
//                     <span className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-[#f5e6e0] tracking-tight leading-[0.9]">
//                       {restWords || 'Essential.'}
//                     </span>
//                   </div>

//                   {/* Price block with rule */}
//                   <div className="flex items-baseline gap-4">
//                     <span className="text-2xl md:text-3xl font-light text-white tracking-tight">
//                       ${Number(price).toFixed(2)}
//                     </span>
//                     {isOnSale && (
//                       <span className="text-lg text-white/30 line-through font-light">
//                         ${Number(originalPrice).toFixed(2)}
//                       </span>
//                     )}
//                     <div className="h-px w-16 bg-[#AE3E27]" />
//                   </div>

//                   {/* Description */}
//                   <p className="text-white/50 text-base md:text-lg leading-relaxed font-light">
//                     {config.description || product.description || 'Designed for your everyday confidence.'}
//                   </p>

//                   {/* Variant Thumbnails */}
//                   {variantImages.length > 1 && (
//                     <div className="flex flex-col gap-3">
//                       <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
//                         Variants
//                       </span>
//                       <div className="flex gap-3">
//                         {variantImages.map((variant) => (
//                           <button
//                             key={variant.id}
//                             className="relative w-14 h-18 md:w-16 md:h-20 rounded-lg overflow-hidden border border-white/10 hover:border-[#AE3E27]/70 transition-all duration-300 hover:-translate-y-1 group/v"
//                             title={variant.name}
//                           >
//                             {variant.url ? (
//                               <img
//                                 src={variant.url}
//                                 alt={variant.name}
//                                 className="w-full h-full object-cover opacity-70 group-hover/v:opacity-100 transition-opacity"
//                               />
//                             ) : (
//                               <div className="w-full h-full bg-white/5" />
//                             )}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* CTA Row */}
//                   <div className="flex items-center gap-4 pt-2">
//                     <button
//                       onClick={() => handleAddToCart(product)}
//                       className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#AE3E27] text-white text-sm font-medium tracking-wider uppercase hover:bg-[#943322] active:scale-[0.97] transition-all shadow-lg shadow-[#AE3E27]/20"
//                     >
//                       <span className="relative z-10">Shop Collection</span>
//                       <svg
//                         className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <path d="M5 12h14M12 5l7 7-7 7" />
//                       </svg>
//                     </button>

//                     <button
//                       onClick={goNext}
//                       className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
//                       aria-label="Next product"
//                     >
//                       <ChevronRight />
//                     </button>
//                   </div>

//                   {/* Editorial accent card */}
//                   <div className="relative mt-2 md:ml-8">
//                     <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 max-w-sm relative overflow-hidden">
//                       <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#AE3E27]/20 rounded-full blur-3xl pointer-events-none" />
//                       <h4 className="relative text-xl md:text-2xl font-serif text-white leading-tight">
//                         Curated for<br />the discerning.
//                       </h4>
//                       <div className="relative w-12 h-px bg-[#AE3E27] my-4" />
//                       <p className="relative text-white/50 text-sm leading-relaxed">
//                         Experience the intersection of digital minimalism and sartorial excellence.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>

//         {/* ── DESKTOP DOTS & ARROWS ───────────────────────────────────────── */}
//         {!isMobile && slides.length > 1 && (
//           <div className="flex items-center justify-center gap-6 mt-12">
//             <button
//               onClick={goPrev}
//               disabled={currentIndex === 0}
//               className="p-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//               aria-label="Previous slide"
//             >
//               <ChevronLeft />
//             </button>

//             <div className="flex items-center gap-2">
//               {slides.map((_, dotIdx) => (
//                 <button
//                   key={dotIdx}
//                   onClick={() => goTo(dotIdx, dotIdx > currentIndex ? 1 : -1)}
//                   className={`h-2 rounded-full transition-all ${
//                     dotIdx === currentIndex ? 'bg-[#AE3E27] w-6' : 'bg-white/20 w-2 hover:bg-white/40'
//                   }`}
//                   aria-label={`Go to slide ${dotIdx + 1}`}
//                 />
//               ))}
//             </div>

//             <button
//               onClick={goNext}
//               disabled={currentIndex === maxIndex}
//               className="p-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//               aria-label="Next slide"
//             >
//               <ChevronRight />
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/products.api';
import NewArrivalCard from './NewArrivalCard';

// ─── Constants ────────────────────────────────────────────────────────────────
const AUTOPLAY_MS = 4000;
const SWIPE_THRESHOLD = 50;
const PAUSE_RESUME_DELAY_MS = 3000; // Resume autoplay after 3s of mouse inactivity

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ─── Slide config ────────────────────────────────────────────────────────────
const SLIDE_CONFIG = [
  { layout: 'full-image',    bg: '#AE3E27', description: 'Discover our latest collection of meticulously crafted essentials. Rooted in the principles of New Luxury, every piece is designed for permanence, tactile elegance, and uncompromising comfort.' },
  { layout: 'product-right',  bg: '#f5e6e0', description: 'Designed for your everyday confidence.' },
  { layout: 'product-left',   bg: '#e8d5d0', description: 'Designed for your everyday confidence.' },
];

// ─── Resolve product image from API response ─────────────────────────────────
const resolveProductImage = (product) => {
  if (!product) return null;
  if (product.variants?.[0]?.images?.[0]?.imageUrl) {
    return product.variants[0].images[0].imageUrl;
  }
  if (product.variants?.[0]?.images?.[0]?.url) {
    return product.variants[0].images[0].url;
  }
  return product.image || null;
};

const resolvePrice = (product) => {
  if (!product?.variants?.length) return product?.price || 0;
  const firstVariant = product.variants[0];
  if (firstVariant.isOnSale && firstVariant.salePrice > 0) {
    return firstVariant.salePrice;
  }
  return firstVariant.price || product.price || 0;
};

// ─── 3D Flip Variants ───────────────────────────────────────────────────────
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    rotateY: direction > 0 ? -45 : 45,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    rotateY: direction > 0 ? 45 : -45,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  })
};

// ─────────────────────────────────────────────────────────────────────────────
export default function NewArrivalsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [manualTick, setManualTick] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const sliderRef = useRef(null);
  const pauseTimerRef = useRef(null);

  // ── Fetch new arrivals from backend ───────────────────────────────────────
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => getProducts({ sort: 'newest', limit: 9 }),
    select: (res) => {
      const payload = res?.data ?? res;
      return Array.isArray(payload) ? payload : [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // ── Detect mobile ─────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────
  const slides = products.slice(0, SLIDE_CONFIG.length);
  const maxIndex = Math.max(0, slides.length - 1);

  // ── Guard index when data changes ─────────────────────────────────────────
  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  // ── Manual navigation ─────────────────────────────────────────────────────
  const goTo = useCallback((idx, dir = 1) => {
    setDirection(dir);
    setCurrentIndex((i) => Math.max(0, Math.min(idx, maxIndex)));
    setManualTick((n) => n + 1);
  }, [maxIndex]);

  const goNext = useCallback(() => goTo(currentIndex + 1, 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1, -1), [currentIndex, goTo]);

  // ── Autoplay ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || maxIndex === 0) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, maxIndex, manualTick]);

  // ── Smart pause handlers: pause on enter, resume after 3s of inactivity ──
  const handleMouseEnter = () => {
    setIsPaused(true);
    // Clear any existing timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  };

  const handleMouseMove = () => {
    // Mouse is moving — stay paused and reset the timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, PAUSE_RESUME_DELAY_MS);
  };

  const handleMouseLeave = () => {
    // Clear timer and resume immediately
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    setIsPaused(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  // ── Touch / swipe handlers ────────────────────────────────────────────────
  const onTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const onTouchMove = (e) => {
    if (touchStartX === null) return;
    const delta = touchStartX - e.touches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) goNext();
      else goPrev();
      setTouchStartX(null);
    }
  };
  const onTouchEnd = () => {
    setTouchStartX(null);
  };

  // ── Mouse drag handlers ──────────────────────────────────────────────────
  const dragStartX = useRef(null);
  const onPointerDown = (e) => { dragStartX.current = e.clientX; };
  const onPointerUp = (e) => {
    if (dragStartX.current === null) return;
    const delta = dragStartX.current - e.clientX;
    if (delta > SWIPE_THRESHOLD) goNext();
    if (delta < -SWIPE_THRESHOLD) goPrev();
    dragStartX.current = null;
  };
  const onPointerLeave = () => { dragStartX.current = null; };

  // ── Handle add to cart ───────────────────────────────────────────────────
  const handleAddToCart = (product) => {
    console.log('[NewArrivals] Add to cart:', product);
    // TODO: Wire to your cart store when ready
    // import { useCart } from '../../hooks/cart/useCart' then call addToCart(product)
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="relative w-full overflow-hidden py-8 px-4" style={{ background: '#0b0b0f', minHeight: 320 }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <section className="relative w-full overflow-hidden py-8 px-4" style={{ background: '#0b0b0f' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/50 text-sm">Unable to load new arrivals. Please try again later.</p>
        </div>
      </section>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (slides.length === 0) {
    return (
      <section className="relative w-full overflow-hidden py-8 px-4" style={{ background: '#0b0b0f' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/40 text-sm">No new arrivals at the moment.</p>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      className="relative w-full overflow-hidden py-6 px-4 sm:px-6 lg:px-8"
      style={{ background: '#0b0b0f', minHeight: 380 }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      {/* ━━━ VIDEO BACKGROUND ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35 }}
          poster="/video-poster.jpg"
        >
          <source src="/videos/new-arrivals-bg.mp4" type="video/mp4" />
          <source src="/videos/new-arrivals-bg.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(11,11,15,0.6) 0%, rgba(11,11,15,0.85) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      {/* ━━━ SECTION HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">New</h2>
          <span className="text-2xl sm:text-3xl font-bold text-[#AE3E27]">Arrivals</span>
        </div>
        <p className="text-sm text-white/50 mt-1">Discover our latest collection</p>
      </motion.div>

      {/* ━━━ SLIDE CONTENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative z-10 max-w-7xl mx-auto" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait" custom={direction}>
          {slides.map((product, idx) => {
            if (idx !== currentIndex) return null;
            const config = SLIDE_CONFIG[idx % SLIDE_CONFIG.length];
            const mainImage = resolveProductImage(product);
            const price = resolvePrice(product);
            const originalPrice = product?.variants?.[0]?.price || product?.price || 0;
            const isOnSale = product?.variants?.[0]?.isOnSale && originalPrice > price;

            const variantImages = (product?.variants || [])
              .slice(0, 4)
              .map((v, i) => {
                const url = v?.images?.[0]?.imageUrl || v?.images?.[0]?.url || v?.image || mainImage;
                return { id: v?.id || i, url, name: v?.name || `Variant ${i + 1}` };
              });

            const slideNumber = String(idx + 1).padStart(2, '0');
            const nameWords = product.name?.split(' ') || ['New', 'Arrival'];
            const firstWord = nameWords[0];
            const restWords = nameWords.slice(1).join(' ');

            return (
              <motion.div
                key={`${product.id}-${idx}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-20 items-center"
              >
                {/* ── FAR RIGHT: Decorative background elements ────────── */}
                {/* Large typographic watermark */}
                <div className="hidden lg:block absolute -right-20 top-1/2 -translate-y-1/2 pointer-events-none select-none">
                  <span 
                    className="text-[20rem] font-bold leading-none tracking-tighter"
                    style={{ color: 'rgba(174, 62, 39, 0.03)' }}
                  >
                    {slideNumber}
                  </span>
                </div>

                {/* Soft terracotta gradient orb */}
                <div 
                  className="hidden lg:block absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                  style={{ 
                    background: 'radial-gradient(circle, rgba(174,62,39,0.08) 0%, rgba(174,62,39,0.02) 50%, transparent 70%)',
                    filter: 'blur(40px)'
                  }}
                />

                {/* Secondary smaller orb */}
                <div 
                  className="hidden lg:block absolute right-20 bottom-20 w-48 h-48 rounded-full pointer-events-none"
                  style={{ 
                    background: 'radial-gradient(circle, rgba(193,80,192,0.05) 0%, transparent 70%)',
                    filter: 'blur(30px)'
                  }}
                />

                {/* ── LEFT: Brown Offset + Neon Glow Image ─────────────── */}
                <div className="md:col-span-5 relative group">
                  {/* Brown offset background card (inner card) */}
                  <div 
                    className="absolute -top-5 -left-5 w-full h-full rounded-3xl border border-white/5"
                    style={{ backgroundColor: '#1a0f0f' }}
                    aria-hidden="true"
                  />

                  {/* Main image container with soft neon glow */}
                  <div 
                    className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0b0b0f] transition-shadow duration-500 group-hover:shadow-[0_0_60px_-8px_rgba(174,62,39,0.6)]"
                    style={{ 
                      aspectRatio: '4 / 5',
                      boxShadow: '0 0 50px -12px rgba(174, 62, 39, 0.35)',
                    }}
                  >
                    {/* Subtle inner warmth */}
                    <div className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none bg-gradient-to-br from-[#AE3E27]/10 to-transparent" />
                    
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="eager"
                      />
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center text-white/30 text-sm">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Floating index badge */}
                  <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full bg-[#0b0b0f] border border-white/10 flex items-center justify-center shadow-2xl">
                    <span className="text-white font-bold text-sm tracking-widest">{slideNumber}</span>
                  </div>

                  {isMobile && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {slides.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => goTo(dotIdx, dotIdx > currentIndex ? 1 : -1)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            dotIdx === currentIndex ? 'bg-[#AE3E27] w-5' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* ── RIGHT: Editorial Product Info ────────────────────── */}
                <div className="md:col-span-7 flex flex-col gap-4 md:gap-6">
                  {/* Category label */}
                  <span className="text-[11px] text-[#AE3E27] uppercase tracking-[0.3em] font-semibold">
                    {product.category || 'The Collection'}
                  </span>

                  {/* Artistic Headline */}
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tight leading-[0.9]">
                      {firstWord}
                    </span>
                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-[#f5e6e0] tracking-tight leading-[0.9]">
                      {restWords || 'Essential.'}
                    </span>
                  </div>

                  {/* Price block with rule */}
                  <div className="flex items-baseline gap-4">
                    <span className="text-xl md:text-2xl font-light text-white tracking-tight">
                      ${Number(price).toFixed(2)}
                    </span>
                    {isOnSale && (
                      <span className="text-base text-white/30 line-through font-light">
                        ${Number(originalPrice).toFixed(2)}
                      </span>
                    )}
                    <div className="h-px w-16 bg-[#AE3E27]" />
                  </div>

                  {/* Description */}
                  <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-lg font-light">
                    {config.description || product.description || 'Designed for your everyday confidence.'}
                  </p>

                  {/* Variant Thumbnails */}
                  {variantImages.length > 1 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-white/30 uppercase tracking-[0.2em]">
                        Variants
                      </span>
                      <div className="flex gap-3">
                        {variantImages.map((variant) => (
                          <button
                            key={variant.id}
                            className="relative w-12 h-16 md:w-14 md:h-18 rounded-lg overflow-hidden border border-white/10 hover:border-[#AE3E27]/70 transition-all duration-300 hover:-translate-y-1 group/v"
                            title={variant.name}
                          >
                            {variant.url ? (
                              <img
                                src={variant.url}
                                alt={variant.name}
                                className="w-full h-full object-cover opacity-70 group-hover/v:opacity-100 transition-opacity"
                              />
                            ) : (
                              <div className="w-full h-full bg-white/5" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Row */}
                  <div className="flex items-center gap-4 pt-1">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#AE3E27] text-white text-sm font-medium tracking-wider uppercase hover:bg-[#943322] active:scale-[0.97] transition-all shadow-lg shadow-[#AE3E27]/20"
                    >
                      <span className="relative z-10">Shop Collection</span>
                      <svg
                        className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>

                    <button
                      onClick={goNext}
                      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
                      aria-label="Next product"
                    >
                      <ChevronRight />
                    </button>
                  </div>

                  {/* Editorial accent card */}
                  <div className="relative mt-1 md:ml-8">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 max-w-sm relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#AE3E27]/20 rounded-full blur-3xl pointer-events-none" />
                      <h4 className="relative text-lg md:text-xl font-serif text-white leading-tight">
                        Curated for<br />the discerning.
                      </h4>
                      <div className="relative w-12 h-px bg-[#AE3E27] my-3" />
                      <p className="relative text-white/50 text-xs md:text-sm leading-relaxed">
                        Experience the intersection of digital minimalism and sartorial excellence.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* ── DESKTOP DOTS & ARROWS ───────────────────────────────────────── */}
        {!isMobile && slides.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => goTo(dotIdx, dotIdx > currentIndex ? 1 : -1)}
                  className={`h-2 rounded-full transition-all ${
                    dotIdx === currentIndex ? 'bg-[#AE3E27] w-6' : 'bg-white/20 w-2 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              disabled={currentIndex === maxIndex}
              className="p-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next slide"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}