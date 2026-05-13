
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { getCategories } from '../../api/categories.api';
// import { ArrowRight, ImageOff } from 'lucide-react';
// import client from "../../api/client"

// const container = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
// };

// const item = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
// };

// /** Build a full image URL from a possibly-relative path */
// function resolveImageUrl(rawUrl) {
//   if (!rawUrl) return null;
//   if (rawUrl.startsWith('http')) return rawUrl;
//   // Backend serves images from its own origin; strip /api suffix from API base
//   // const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:1500/api';
//   const apiBase = import.meta.env?.VITE_API_URL || client.defaults?.baseURL || 'http://localhost:1500/api';
//   const origin = apiBase.replace(/\/api\/?$/, '');
//   return `${origin}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
// }


// const Category = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     getCategories()
//       .then((res) => {
//         if (cancelled) return;
//         // Handle { success: true, data: [...] } or raw array
//         const payload = res?.data ?? res ?? [];
//         const list = Array.isArray(payload) ? payload : [];
//         const active = list
//           .filter((c) => c.isActive !== false)
//           .slice(0, 6);
//         setCategories(active);
//       })
//       .catch((err) => {
//         if (!cancelled) {
//           console.error('[CategoryList] Failed to load categories:', err);
//           setCategories([]);
//         }
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });
//     return () => { cancelled = true; };
//   }, []);

//   const displayed = categories;
//   const hasMore = categories.length >= 6;

//   return (
//     <div className="bg-white py-6 px-4 md:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.4 }}
//           className="mb-4 flex items-center justify-between"
//         >
//           <h2 className="text-base font-semibold text-gray-900 tracking-tight">
//             Category <span className="text-orange-500">List</span>
//           </h2>
//           {hasMore && (
//             <Link
//               to="/shop"
//               className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
//             >
//               View All <ArrowRight size={14} />
//             </Link>
//           )}
//         </motion.div>

//         {/* Grid */}
//         <motion.div
//           variants={container}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.1 }}
//           className="grid grid-cols-3 gap-2 md:gap-3"
//         >
//           {loading
//             ? Array.from({ length: 6 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="aspect-[4/3] rounded-md bg-gray-100 animate-pulse"
//                 />
//               ))
//             : displayed.length === 0
//               ? (
//                 <div className="col-span-3 text-center py-8 text-gray-400 text-sm">
//                   No categories available.
//                 </div>
//               )
//               : displayed.map((category) => {
//                   const imgUrl = resolveImageUrl(category.imageUrl || category.image || category.coverImage);
//                   return (
//                     <motion.div
//                       key={category.id || category.slug}
//                       variants={item}
//                       className="group relative aspect-[4/3] overflow-hidden cursor-pointer rounded-md bg-gray-200"
//                     >
//                       {/* Image — absolute fill so the card never collapses */}
//                       {imgUrl ? (
//                         <img
//                           src={imgUrl}
//                           alt={category.name}
//                           className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                           onError={(e) => {
//                             // Replace broken image with a gray placeholder icon
//                             e.target.style.display = 'none';
//                             const placeholder = e.target.nextElementSibling;
//                             if (placeholder) placeholder.style.display = 'flex';
//                           }}
//                         />
//                       ) : null}

//                       {/* Fallback placeholder (hidden by default, shown on error) */}
//                       <div
//                         className="absolute inset-0 hidden flex-col items-center justify-center bg-gray-200 text-gray-400"
//                         style={{ display: imgUrl ? 'none' : 'flex' }}
//                       >
//                         <ImageOff size={24} />
//                         <span className="text-[10px] mt-1">No image</span>
//                       </div>

//                       {/* Dark overlay */}
//                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

//                       {/* Centered text */}
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <p className="text-white text-xs md:text-sm font-medium tracking-wide drop-shadow-md">
//                           {category.name}
//                         </p>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//         </motion.div>

//         {/* View More */}
//         {!loading && hasMore && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="mt-4 flex justify-center md:justify-end"
//           >
//             <Link
//               to="/shop"
//               className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-orange-200 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors"
//             >
//               View More Categories <ArrowRight size={16} />
//             </Link>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Category;

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getCategories } from '../../api/categories.api';
import { ArrowRight, ImageOff } from 'lucide-react';
import client from "../../api/client";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/** Build a full image URL from a possibly-relative path */
function resolveImageUrl(rawUrl) {
  if (!rawUrl) return null;
  if (rawUrl.startsWith('http')) return rawUrl;

  const apiBase =
    import.meta.env?.VITE_API_URL ||
    client.defaults?.baseURL ||
    'http://localhost:1500/api';

  const origin = apiBase.replace(/\/api\/?$/, '');
  return `${origin}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
}

/** Safely extract category array from various API response shapes */
function extractCategoryList(res) {
  // Axios response: res.data = payload
  const payload = res?.data ?? res ?? [];

  if (Array.isArray(payload)) return payload;

  // Wrapped shape: { success: true, data: [...] }
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

/* ------------------------------------------------------------------ */
// Individual card to safely manage image-error state per item
const CategoryCard = ({ category }) => {
  const [imgError, setImgError] = useState(false);
  const imgUrl = resolveImageUrl(
    category.imageUrl || category.image || category.coverImage
  );

  return (
    <motion.div
      variants={itemVariants}
      className="group relative aspect-[4/3] overflow-hidden cursor-pointer rounded-md bg-gray-200"
    >
      {/* Image */}
      {imgUrl && !imgError && (
        <img
          src={imgUrl}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      )}

      {/* Fallback placeholder */}
      {(!imgUrl || imgError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-400">
          <ImageOff size={24} />
          <span className="text-[10px] mt-1">No image</span>
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

      {/* Centered text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-xs md:text-sm font-medium tracking-wide drop-shadow-md">
          {category.name}
        </p>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ref + useInView for the grid (more reliable than whileInView on hard refresh)
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.1 });

  // Safety net: force visible after 1.2s if observer somehow misses
  const [forceVisible, setForceVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForceVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const shouldAnimate = isInView || forceVisible;

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((res) => {
        if (cancelled) return;

        const list = extractCategoryList(res);
        const active = list
          .filter((c) => c.isActive !== false)
          .slice(0, 6);

        // DEBUG: remove after fix confirmed
        console.log('[Category] API raw response:', res);
        console.log('[Category] Extracted list:', active);

        setCategories(active);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[Category] Failed to load categories:', err);
          setCategories([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayed = categories;
  const hasMore = categories.length >= 6;

  return (
    <div className="bg-white py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-4 flex items-center justify-between"
        >
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">
            Category <span className="text-orange-500">List</span>
          </h2>
          {hasMore && (
            <Link
              to="/shop"
              className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          )}
        </motion.div>

        {/* Grid — uses useInView + forced fallback */}
        <motion.div
          ref={gridRef}
          variants={containerVariants}
          initial="hidden"
          animate={shouldAnimate ? 'visible' : 'hidden'}
          className="grid grid-cols-3 gap-2 md:gap-3"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="aspect-[4/3] rounded-md bg-gray-100 animate-pulse"
              />
            ))
          ) : displayed.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-400 text-sm">
              No categories available.
            </div>
          ) : (
            displayed.map((category) => (
              <CategoryCard
                key={category.id ?? category.slug ?? category.name}
                category={category}
              />
            ))
          )}
        </motion.div>

        {/* View More */}
        {!loading && hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-4 flex justify-center md:justify-end"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-orange-200 text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors"
            >
              View More Categories <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Category;