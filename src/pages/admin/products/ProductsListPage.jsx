// import { useState, useMemo, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Truck, Tag, CreditCard, Headphones, ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";

// import Navbar from "../../components/layout/Navbar";
// import FilterSidebar from "../../components/search/FilterSidebar";
// import ProductGrid from "../../components/product/ProductGrid";
// import { useCategories } from "../../hooks/categories/useCategories";
// import { useProducts } from "../../hooks/products/useProducts";

// // ── Animation variants ────────────────────────────────────────────────────────

// // Page hero fades down
// const heroVariants = {
//   hidden: { opacity: 0, y: -20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.55, ease: "easeOut" },
//   },
// };

// // Category tabs slide up after hero
// const tabsVariants = {
//   hidden: { opacity: 0, y: 16 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.45, ease: "easeOut", delay: 0.2 },
//   },
// };

// // Content area (sidebar + grid) fades in after tabs
// const contentVariants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { duration: 0.35, delay: 0.35 } },
// };

// // Trust badges stagger in last
// const badgesContainerVariants = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
// };
// const badgeItemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
// };

// // ── Trust badge data ──────────────────────────────────────────────────────────
// const TRUST_BADGES = [
//   { icon: Truck, label: "Free Shipping", sub: "On all orders above $50" },
//   { icon: Tag, label: "Members Discount", sub: "Up to 20% off for members" },
//   {
//     icon: CreditCard,
//     label: "Flexible Payment",
//     sub: "Pay with any card or bank",
//   },
//   { icon: Headphones, label: "Swift Support", sub: "24/7 customer support" },
// ];

// // ── Footer links data ─────────────────────────────────────────────────────────
// const FOOTER_QUICK_LINKS = ["About Us", "Shop", "Blog", "Contact"];
// const FOOTER_HELP_LINKS = [
//   "FAQs",
//   "Shipping Policy",
//   "Return Policy",
//   "Privacy Policy",
// ];

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function ProductListingPage() {
//   // Fetch category tree from API (or fall back to mock data)
//   const { data: categories = [], isLoading: catsLoading } = useCategories();

//   // Active top-level category (slug) — default to first available
//   const [activeCategorySlug, setActiveCategorySlug] = useState("");

//   // Sync default category to first available once categories load
//   useEffect(() => {
//     if (!activeCategorySlug && categories?.length > 0) {
//       setActiveCategorySlug(categories[0].slug);
//     }
//   }, [categories, activeCategorySlug]);

//   // Active subcategory slugs — multiple selection
//   const [activeSubcategories, setActiveSubcategories] = useState([]);

//   // Derive the active top-level category object
//   const activeCategory = useMemo(
//     () =>
//       categories?.find((c) => c.slug === activeCategorySlug) ?? categories?.[0] ?? null,
//     [categories, activeCategorySlug],
//   );

//   // Build query params for useProducts
//   const productParams = useMemo(() => {
//     const params = {};
//     if (activeCategorySlug) params.categorySlug = activeCategorySlug;
//     if (activeSubcategories.length === 1) {
//       params.subcategorySlug = activeSubcategories[0];
//     }
//     return params;
//   }, [activeCategorySlug, activeSubcategories]);

//   // Fetch products
//   const { data: rawProducts, isLoading: productsLoading } = useProducts(productParams);

//   // Normalize: extract price/image/isOnSale/salePrice from variants[0]
//   const products = useMemo(() => {
//     if (!rawProducts) return [];
//     return rawProducts.map((p) => {
//       const firstVariant = p.variants?.[0];
//       // Image: prioritize variants[0]; only fall back to other variants if [0] has none
//       const image = firstVariant?.images?.[0]?.url
//         || p.variants?.find((v) => v.images?.length > 0)?.images?.[0]?.url
//         || p.image
//         || null;
//       return {
//         ...p,
//         price:      firstVariant?.price      ?? p.price      ?? 0,
//         salePrice:  firstVariant?.salePrice  ?? p.salePrice  ?? 0,
//         isOnSale:   firstVariant?.isOnSale   ?? p.isOnSale   ?? false,
//         image,
//       };
//     });
//   }, [rawProducts]);

//   // Client-side multi-subcategory filter (covers backend mock + real API)
//   // const filteredProducts = useMemo(() => {
//   //   if (!activeSubcategories.length) return products;
//   //   return products.filter((p) =>
//   //     activeSubcategories.includes(p.subcategorySlug)
//   //   );
//   // }, [products, activeSubcategories]);

//   const filteredProducts = useMemo(() => {
//     if (!products || !activeSubcategories.length) return products || [];
//     return products.filter((p) =>
//       activeSubcategories.includes(p.subcategorySlug),
//     );
//   }, [products, activeSubcategories]);

//   // Switch top-level category → reset subcategory filter
//   const handleCategoryChange = (slug) => {
//     setActiveCategorySlug(slug);
//     setActiveSubcategories([]);
//   };

//   // Toggle a subcategory on/off
//   const handleSubcategoryToggle = (slug) => {
//     setActiveSubcategories((prev) =>
//       prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-['Poppins']">
//       {/* ── Navbar (already fixed/sticky in Navbar.jsx) ── */}
//       <Navbar />

//       {/* ── Page hero / breadcrumb ─────────────────────────────────────── */}
//       <motion.section
//         variants={heroVariants}
//         initial="hidden"
//         animate="visible"
//         className="pt-24 pb-8 bg-[#F5EFE6] text-center px-4"
//       >
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
//           Shop
//         </h1>
//         <p className="mt-1 text-base font-semibold text-[#AE3E27]">
//           {activeCategory?.name ?? "Women"}
//         </p>

//         {/* Breadcrumb */}
//         <nav className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500">
//           <Link to="/" className="hover:text-[#AE3E27] transition-colors">
//             Home
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-gray-800 font-medium">Shop</span>
//           {activeCategory && (
//             <>
//               <ChevronRight className="w-3 h-3" />
//               <span className="text-[#AE3E27] font-medium">
//                 {activeCategory.name}
//               </span>
//             </>
//           )}
//         </nav>
//       </motion.section>

//       {/* ── Category tabs ──────────────────────────────────────────────── */}
//       <motion.section
//         variants={tabsVariants}
//         initial="hidden"
//         animate="visible"
//         className="bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Horizontally scrollable tab bar */}
//           <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide -mx-1 px-1">
//             {catsLoading
//               ? Array.from({ length: 6 }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="h-5 w-20 bg-gray-100 rounded animate-pulse mx-2 my-3.5 flex-shrink-0"
//                   />
//                 ))
//               : categories.map((cat) => {
//                   const isActive = cat.slug === activeCategorySlug;
//                   return (
//                     <button
//                       key={cat.id}
//                       onClick={() => handleCategoryChange(cat.slug)}
//                       className={`relative flex-shrink-0 px-4 sm:px-5 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
//                         isActive
//                           ? "text-[#AE3E27]"
//                           : "text-gray-500 hover:text-gray-800"
//                       }`}
//                     >
//                       {cat.name}
//                       {/* Active underline */}
//                       {isActive && (
//                         <motion.span
//                           layoutId="category-underline"
//                           className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AE3E27] rounded-full"
//                         />
//                       )}
//                     </button>
//                   );
//                 })}
//           </div>
//         </div>
//       </motion.section>

//       {/* ── Main content: sidebar + product grid ──────────────────────── */}
//       <motion.main
//         variants={contentVariants}
//         initial="hidden"
//         animate="visible"
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
//       >
//         <div className="flex flex-col lg:flex-row gap-5">
//           {/* ── Left: subcategory filter ── */}
//           <div className="w-full lg:w-44 flex-shrink-0">
//             {/* Mobile filter bar at top */}
//             <div className="lg:hidden mb-3">
//               <FilterSidebar
//                 subcategories={activeCategory?.children ?? []}
//                 activeSubcategories={activeSubcategories}
//                 onToggle={handleSubcategoryToggle}
//                 onClearAll={() => setActiveSubcategories([])}
//               />
//             </div>

//             {/* Desktop sticky sidebar */}
//             <div className="hidden lg:block">
//               <FilterSidebar
//                 subcategories={activeCategory?.children ?? []}
//                 activeSubcategories={activeSubcategories}
//                 onToggle={handleSubcategoryToggle}
//                 onClearAll={() => setActiveSubcategories([])}
//               />
//             </div>
//           </div>

//           {/* ── Right: product grid ── */}
//           <div className="flex-1 min-w-0">
//             {/* Results count */}
//             <AnimatePresence mode="wait">
//               <motion.p
//                 key={`${activeCategorySlug}-${activeSubcategories.join(",")}`}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-xs text-gray-400 mb-3"
//               >
//                 {productsLoading
//                   ? "Loading…"
//                   : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
//               </motion.p>
//             </AnimatePresence>

//             {/* Re-mount grid on category change so stagger re-fires */}
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={`${activeCategorySlug}-${activeSubcategories.join(",")}`}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <ProductGrid
//                   products={filteredProducts}
//                   loading={productsLoading}
//                   onAddToCart={(product) => {
//                     // TODO: wire up to useAddToCart mutation
//                     console.log("Add to cart:", product);
//                   }}
//                 />
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </motion.main>

//       {/* ── Trust badges ───────────────────────────────────────────────── */}
//       <section className="bg-white border-t border-gray-100 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             variants={badgesContainerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-60px" }}
//             className="grid grid-cols-2 sm:grid-cols-4 gap-6"
//           >
//             {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
//               <motion.div
//                 key={label}
//                 variants={badgeItemVariants}
//                 className="flex flex-col items-center text-center gap-2"
//               >
//                 <span className="w-10 h-10 rounded-full bg-[#fdf2f0] flex items-center justify-center">
//                   <Icon className="w-5 h-5 text-[#AE3E27]" />
//                 </span>
//                 <p className="text-sm font-semibold text-gray-800">{label}</p>
//                 <p className="text-xs text-gray-400 leading-snug">{sub}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* ── Footer ─────────────────────────────────────────────────────── */}
//       <footer className="bg-[#AE3E27] text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {/* Brand column */}
//             <div className="lg:col-span-1">
//               <span className="font-['Pacifico'] text-2xl font-bold">
//                 Atelierselvedge
//               </span>
//               <p className="mt-3 text-sm text-[#fce5e0] leading-relaxed max-w-xs">
//                 Your one-stop destination for curated fashion, accessories, and
//                 lifestyle products.
//               </p>
//               {/* Social icons */}
//               <div className="flex gap-3 mt-5">
//                 {["f", "in", "yt"].map((s) => (
//                   <a
//                     key={s}
//                     href="#"
//                     className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-[11px] font-bold transition-colors"
//                   >
//                     {s}
//                   </a>
//                 ))}
//               </div>
//             </div>

//             {/* Quick links */}
//             <div>
//               <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#fce5e0]">
//                 Quick Links
//               </h4>
//               <ul className="space-y-2.5">
//                 {FOOTER_QUICK_LINKS.map((link) => (
//                   <li key={link}>
//                     <a
//                       href="#"
//                       className="text-sm text-[#fce5e0] hover:text-white transition-colors"
//                     >
//                       {link}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Help */}
//             <div>
//               <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#fce5e0]">
//                 Help
//               </h4>
//               <ul className="space-y-2.5">
//                 {FOOTER_HELP_LINKS.map((link) => (
//                   <li key={link}>
//                     <a
//                       href="#"
//                       className="text-sm text-[#fce5e0] hover:text-white transition-colors"
//                     >
//                       {link}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Contact info */}
//             <div>
//               <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#fce5e0]">
//                 Contact Info
//               </h4>
//               <ul className="space-y-2.5 text-sm text-[#fce5e0]">
//                 <li>123 Fashion Street, Lagos</li>
//                 <li>+234 800 ATELIERSELVEDGE</li>
//                 <li>hello@atelierselvedge.com</li>
//                 <li>Mon – Fri, 9am – 6pm</li>
//               </ul>
//             </div>
//           </div>

//           {/* Copyright bar */}
//           <div className="mt-10 pt-6 border-t border-white/20 text-center text-xs text-[#fce5e0]">
//             © {new Date().getFullYear()} Atelierselvedge Website Design. All Rights
//             Reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// import { useState, useMemo, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Truck, Tag, CreditCard, Headphones, ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";

// import Navbar from "../../components/layout/Navbar";
// import FilterSidebar from "../../components/search/FilterSidebar";
// import ProductGrid from "../../components/product/ProductGrid";
// import { useCategories } from "../../hooks/categories/useCategories";
// import { useProducts } from "../../hooks/products/useProducts";

// // ── Animation variants ────────────────────────────────────────────────────────

// const heroVariants = {
//   hidden: { opacity: 0, y: -20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.55, ease: "easeOut" },
//   },
// };

// const tabsVariants = {
//   hidden: { opacity: 0, y: 16 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.45, ease: "easeOut", delay: 0.2 },
//   },
// };

// const contentVariants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { duration: 0.35, delay: 0.35 } },
// };

// const badgesContainerVariants = {
//   hidden: {},
//   visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
// };
// const badgeItemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
// };

// // ── Trust badge data ──────────────────────────────────────────────────────────
// const TRUST_BADGES = [
//   { icon: Truck, label: "Free Shipping", sub: "On all orders above $50" },
//   { icon: Tag, label: "Members Discount", sub: "Up to 20% off for members" },
//   {
//     icon: CreditCard,
//     label: "Flexible Payment",
//     sub: "Pay with any card or bank",
//   },
//   { icon: Headphones, label: "Swift Support", sub: "24/7 customer support" },
// ];

// // ── Footer links data ─────────────────────────────────────────────────────────
// const FOOTER_QUICK_LINKS = ["About Us", "Shop", "Blog", "Contact"];
// const FOOTER_HELP_LINKS = [
//   "FAQs",
//   "Shipping Policy",
//   "Return Policy",
//   "Privacy Policy",
// ];

// // ── Component ─────────────────────────────────────────────────────────────────
// export default function ProductListingPage() {
//   const { data: categories = [], isLoading: catsLoading } = useCategories();

//   const [activeCategorySlug, setActiveCategorySlug] = useState("");

//   useEffect(() => {
//     if (!activeCategorySlug && categories?.length > 0) {
//       setActiveCategorySlug(categories[0].slug);
//     }
//   }, [categories, activeCategorySlug]);

//   const [activeSubcategories, setActiveSubcategories] = useState([]);

//   const activeCategory = useMemo(
//     () =>
//       categories?.find((c) => c.slug === activeCategorySlug) ?? categories?.[0] ?? null,
//     [categories, activeCategorySlug],
//   );

//   const productParams = useMemo(() => {
//     const params = {};
//     if (activeCategorySlug) params.categorySlug = activeCategorySlug;
//     if (activeSubcategories.length === 1) {
//       params.subcategorySlug = activeSubcategories[0];
//     }
//     return params;
//   }, [activeCategorySlug, activeSubcategories]);

//   const { data: rawProducts, isLoading: productsLoading } = useProducts(productParams);

//   // ═══════════════════════════════════════════════════════════════════════════
//   //  FIX: Strictly use the FIRST variant (by creation date) for thumbnail,
//   //  price, and sale status. Removed the fallback that scanned other variants
//   //  for images, which caused the wrong variant's image to display.
//   // ═══════════════════════════════════════════════════════════════════════════
//   const products = useMemo(() => {
//     if (!rawProducts) return [];
//     return rawProducts.map((p) => {
//       const sortedVariants = [...(p.variants || [])].sort(
//         (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//       );
//       const firstVariant = sortedVariants[0];

//       const image = firstVariant?.images?.[0]?.url || null;

//       return {
//         ...p,
//         price:      firstVariant?.price      ?? p.price      ?? 0,
//         salePrice:  firstVariant?.salePrice  ?? p.salePrice  ?? 0,
//         isOnSale:   firstVariant?.isOnSale   ?? p.isOnSale   ?? false,
//         image,
//       };
//     });
//   }, [rawProducts]);

//   const filteredProducts = useMemo(() => {
//     if (!products || !activeSubcategories.length) return products || [];
//     return products.filter((p) =>
//       activeSubcategories.includes(p.subcategorySlug),
//     );
//   }, [products, activeSubcategories]);

//   const handleCategoryChange = (slug) => {
//     setActiveCategorySlug(slug);
//     setActiveSubcategories([]);
//   };

//   const handleSubcategoryToggle = (slug) => {
//     setActiveSubcategories((prev) =>
//       prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-['Poppins']">
//       <Navbar />

//       <motion.section
//         variants={heroVariants}
//         initial="hidden"
//         animate="visible"
//         className="pt-24 pb-8 bg-[#F5EFE6] text-center px-4"
//       >
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
//           Shop
//         </h1>
//         <p className="mt-1 text-base font-semibold text-[#AE3E27]">
//           {activeCategory?.name ?? "Women"}
//         </p>

//         <nav className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-500">
//           <Link to="/" className="hover:text-[#AE3E27] transition-colors">
//             Home
//           </Link>
//           <ChevronRight className="w-3 h-3" />
//           <span className="text-gray-800 font-medium">Shop</span>
//           {activeCategory && (
//             <>
//               <ChevronRight className="w-3 h-3" />
//               <span className="text-[#AE3E27] font-medium">
//                 {activeCategory.name}
//               </span>
//             </>
//           )}
//         </nav>
//       </motion.section>

//       <motion.section
//         variants={tabsVariants}
//         initial="hidden"
//         animate="visible"
//         className="bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide -mx-1 px-1">
//             {catsLoading
//               ? Array.from({ length: 6 }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="h-5 w-20 bg-gray-100 rounded animate-pulse mx-2 my-3.5 flex-shrink-0"
//                   />
//                 ))
//               : categories.map((cat) => {
//                   const isActive = cat.slug === activeCategorySlug;
//                   return (
//                     <button
//                       key={cat.id}
//                       onClick={() => handleCategoryChange(cat.slug)}
//                       className={`relative flex-shrink-0 px-4 sm:px-5 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
//                         isActive
//                           ? "text-[#AE3E27]"
//                           : "text-gray-500 hover:text-gray-800"
//                       }`}
//                     >
//                       {cat.name}
//                       {isActive && (
//                         <motion.span
//                           layoutId="category-underline"
//                           className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AE3E27] rounded-full"
//                         />
//                       )}
//                     </button>
//                   );
//                 })}
//           </div>
//         </div>
//       </motion.section>

//       <motion.main
//         variants={contentVariants}
//         initial="hidden"
//         animate="visible"
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
//       >
//         <div className="flex flex-col lg:flex-row gap-5">
//           <div className="w-full lg:w-44 flex-shrink-0">
//             <div className="lg:hidden mb-3">
//               <FilterSidebar
//                 subcategories={activeCategory?.children ?? []}
//                 activeSubcategories={activeSubcategories}
//                 onToggle={handleSubcategoryToggle}
//                 onClearAll={() => setActiveSubcategories([])}
//               />
//             </div>

//             <div className="hidden lg:block">
//               <FilterSidebar
//                 subcategories={activeCategory?.children ?? []}
//                 activeSubcategories={activeSubcategories}
//                 onToggle={handleSubcategoryToggle}
//                 onClearAll={() => setActiveSubcategories([])}
//               />
//             </div>
//           </div>

//           <div className="flex-1 min-w-0">
//             <AnimatePresence mode="wait">
//               <motion.p
//                 key={`${activeCategorySlug}-${activeSubcategories.join(",")}`}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-xs text-gray-400 mb-3"
//               >
//                 {productsLoading
//                   ? "Loading…"
//                   : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
//               </motion.p>
//             </AnimatePresence>

//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={`${activeCategorySlug}-${activeSubcategories.join(",")}`}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <ProductGrid
//                   products={filteredProducts}
//                   loading={productsLoading}
//                   onAddToCart={(product) => {
//                     console.log("Add to cart:", product);
//                   }}
//                 />
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>
//       </motion.main>

//       <section className="bg-white border-t border-gray-100 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             variants={badgesContainerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-60px" }}
//             className="grid grid-cols-2 sm:grid-cols-4 gap-6"
//           >
//             {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
//               <motion.div
//                 key={label}
//                 variants={badgeItemVariants}
//                 className="flex flex-col items-center text-center gap-2"
//               >
//                 <span className="w-10 h-10 rounded-full bg-[#fdf2f0] flex items-center justify-center">
//                   <Icon className="w-5 h-5 text-[#AE3E27]" />
//                 </span>
//                 <p className="text-sm font-semibold text-gray-800">{label}</p>
//                 <p className="text-xs text-gray-400 leading-snug">{sub}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       <footer className="bg-[#AE3E27] text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             <div className="lg:col-span-1">
//               <span className="font-['Pacifico'] text-2xl font-bold">
//                 Atelierselvedge
//               </span>
//               <p className="mt-3 text-sm text-[#fce5e0] leading-relaxed max-w-xs">
//                 Your one-stop destination for curated fashion, accessories, and
//                 lifestyle products.
//               </p>
//               <div className="flex gap-3 mt-5">
//                 {["f", "in", "yt"].map((s) => (
//                   <a
//                     key={s}
//                     href="#"
//                     className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-[11px] font-bold transition-colors"
//                   >
//                     {s}
//                   </a>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#fce5e0]">
//                 Quick Links
//               </h4>
//               <ul className="space-y-2.5">
//                 {FOOTER_QUICK_LINKS.map((link) => (
//                   <li key={link}>
//                     <a
//                       href="#"
//                       className="text-sm text-[#fce5e0] hover:text-white transition-colors"
//                     >
//                       {link}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div>
//               <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#fce5e0]">
//                 Help
//               </h4>
//               <ul className="space-y-2.5">
//                 {FOOTER_HELP_LINKS.map((link) => (
//                   <li key={link}>
//                     <a
//                       href="#"
//                       className="text-sm text-[#fce5e0] hover:text-white transition-colors"
//                     >
//                       {link}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div>
//               <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#fce5e0]">
//                 Contact Info
//               </h4>
//               <ul className="space-y-2.5 text-sm text-[#fce5e0]">
//                 <li>123 Fashion Street, Lagos</li>
//                 <li>+234 800 ATELIERSELVEDGE</li>
//                 <li>hello@atelierselvedge.com</li>
//                 <li>Mon – Fri, 9am – 6pm</li>
//               </ul>
//             </div>
//           </div>

//           <div className="mt-10 pt-6 border-t border-white/20 text-center text-xs text-[#fce5e0]">
//             © {new Date().getFullYear()} Atelierselvedge Website Design. All Rights
//             Reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Truck, Tag, CreditCard, Headphones } from "lucide-react";
import client from "../../api/client";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useCategories } from "../../hooks/categories/useCategories";
import { useProducts } from "../../hooks/products/useProducts";

// ── Resolve image URLs ────────────────────────────────────────────────────────
const API_BASE = (import.meta.env?.VITE_API_URL || client.defaults?.baseURL || "http://localhost:1500/api")
  .replace(/\/api.*$/, "")
  .replace(/\/$/, "");

const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

// ── Trust badge data (matches design exactly) ─────────────────────────────────
const TRUST_BADGES = [
  { icon: Truck, label: "Free Shipping", sub: "Free shipping for order above $185" },
  { icon: Tag, label: "Members Discount", sub: "Discount for elite members" },
  { icon: CreditCard, label: "Flexible Payment", sub: "Secured payment options" },
  { icon: Headphones, label: "Swift Support", sub: "24/7 customer support" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProductListingPage() {
  const { data: categories = [], isLoading: catsLoading } = useCategories();

  const [activeCategorySlug, setActiveCategorySlug] = useState("");

  useEffect(() => {
    if (!activeCategorySlug && categories?.length > 0) {
      setActiveCategorySlug(categories[0].slug);
    }
  }, [categories, activeCategorySlug]);

  const [activeSubcategories, setActiveSubcategories] = useState([]);

  const activeCategory = useMemo(
    () =>
      categories?.find((c) => c.slug === activeCategorySlug) ?? categories?.[0] ?? null,
    [categories, activeCategorySlug],
  );

  const productParams = useMemo(() => {
    const params = {};
    if (activeCategorySlug) params.categorySlug = activeCategorySlug;
    if (activeSubcategories.length === 1) {
      params.subcategorySlug = activeSubcategories[0];
    } else if (activeSubcategories.length > 1) {
      params.subcategorySlugs = activeSubcategories.join(',');
    }
    return params;
  }, [activeCategorySlug, activeSubcategories]);

  const { data: rawProducts, isLoading: productsLoading } = useProducts(productParams);

  // ═══════════════════════════════════════════════════════════════════════════
  //  FIX: Strictly use the FIRST variant (by creation date) for thumbnail,
  //  price, and sale status. Removed the fallback that scanned other variants
  //  for images, which caused the wrong variant's image to display.
  // ═══════════════════════════════════════════════════════════════════════════
  const products = useMemo(() => {
    if (!rawProducts) return [];
    return rawProducts.map((p) => {
      const sortedVariants = [...(p.variants || [])].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const firstVariant = sortedVariants[0];

      const image = firstVariant?.images?.[0]?.url || null;

      return {
        ...p,
        price:      firstVariant?.price      ?? p.price      ?? 0,
        salePrice:  firstVariant?.salePrice  ?? p.salePrice  ?? 0,
        isOnSale:   firstVariant?.isOnSale   ?? p.isOnSale   ?? false,
        image,
      };
    });
  }, [rawProducts]);

  // Backend already filters by subcategorySlug/subcategorySlugs (including all descendants
  // via getDescendantCategoryIds), so no client-side subcategory filter is needed.
  const filteredProducts = products || [];

  const handleCategoryChange = (slug) => {
    setActiveCategorySlug(slug);
    setActiveSubcategories([]);
  };

  const handleSubcategoryToggle = (slug) => {
    setActiveSubcategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero / Page Header ─────────────────────────────────────────────── */}
      <section
        className="pt-10 pb-5 text-center"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage:
            "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
          backgroundSize: "10px 10px",
          backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
        }}
      >
        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">Shop</h1>
        <p className="mt-1 text-[15px] font-semibold text-[#AE3E27]">
          {activeCategory?.name ?? "Men"}
        </p>

        <nav className="mt-2 flex items-center justify-center gap-1 text-[11px] text-gray-500">
          <Link to="/" className="hover:text-[#AE3E27] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium">Shop</span>
          {activeCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#AE3E27] font-medium">
                {activeCategory.name}
              </span>
            </>
          )}
        </nav>
      </section>

      {/* ── Category Pills ─────────────────────────────────────────────────── */}
      <section className="py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {catsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-gray-100 rounded-full animate-pulse"
                  />
                ))
              : categories.map((cat) => {
                  const isActive = cat.slug === activeCategorySlug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`px-5 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-200 ${
                        isActive
                          ? "bg-[#AE3E27] text-white border-[#AE3E27]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
          </div>
        </div>
      </section>

      {/* ── Main Content: Sidebar + Product Grid ───────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Subcategory Filter */}
          <aside className="w-full lg:w-44 flex-shrink-0">
            <h3 className="text-[15px] font-semibold text-gray-900 mb-4">
              Subcategory
            </h3>

            {activeCategory?.children?.length > 0 ? (
              <div className="space-y-3">
                {activeCategory.children.map((sub) => (
                  <div key={sub.id}>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeSubcategories.includes(sub.slug)}
                        onChange={() => handleSubcategoryToggle(sub.slug)}
                        className="h-3.5 w-3.5 border border-gray-300 text-[#AE3E27] focus:ring-[#AE3E27] cursor-pointer rounded-none"
                      />
                      <span className="text-[13px] text-gray-700">{sub.name}</span>
                    </label>

                    {/* Level-3: show children nested under this level-2 item when it's checked */}
                    {activeSubcategories.includes(sub.slug) || sub.children?.length > 0 || (
                      <div className="mt-2 ml-5 space-y-2">
                        {sub.children.map((child) => (
                          <label key={child.id} className="flex items-center gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={activeSubcategories.includes(child.slug)}
                              onChange={() => handleSubcategoryToggle(child.slug)}
                              className="h-3.5 w-3.5 border border-gray-300 text-[#AE3E27] focus:ring-[#AE3E27] cursor-pointer rounded-none"
                            />
                            <span className="text-[12px] text-gray-600">{child.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-gray-400">No subcategories available</p>
            )}
          </aside>

          {/* Right: Product Grid */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400 mb-3">
              {productsLoading
                ? "Loading…"
                : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
            </p>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square max-h-[220px] bg-gray-200 mb-1.5" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-1.5" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white">
                    <Link to={`/products/${product.slug}`} className="block">
                      <div className="aspect-square max-h-[220px] bg-gray-50 overflow-hidden mb-1.5">
                        <img
                          src={resolveImageUrl(product.image) || "/placeholder-product.png"}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-[11px] text-gray-900 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-[11px] font-bold text-gray-900 mt-0.5 mb-1.5">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </Link>
                    <button
                      onClick={() => {
                        console.log("Add to cart:", product);
                      }}
                      className="w-full bg-[#AE3E27] hover:bg-[#8f3320] text-white text-[10px] font-medium py-1.5 rounded transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Trust Badges ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon className="w-4 h-4 text-[#AE3E27] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}