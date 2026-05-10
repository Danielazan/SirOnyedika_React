// // Individual product card — image, name, price badge, sale indicator, add-to-cart button.
// // Receives a `product` prop shaped by useProducts mock / API response.
// import { motion } from 'framer-motion';
// import { ShoppingCart, Heart } from 'lucide-react';
// import { useState } from 'react';

// // Animation variant — used by ProductGrid to stagger each card
// export const cardVariants = {
//   hidden:  { opacity: 0, y: 28 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
//   },
// };

// export default function ProductCard({ product, onAddToCart }) {
//   const [wishlisted, setWishlisted] = useState(false);
//   const [addedFeedback, setAddedFeedback] = useState(false);

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     if (onAddToCart) onAddToCart(product);
//     setAddedFeedback(true);
//     setTimeout(() => setAddedFeedback(false), 1600);
//   };

//   const displayPrice = product.isOnSale && product.salePrice
//     ? product.salePrice
//     : product.price;

//   return (
//     <motion.article
//       variants={cardVariants}
//       whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
//       transition={{ duration: 0.22 }}
//       className="bg-white rounded-xl overflow-hidden flex flex-col group cursor-pointer border border-gray-100"
//     >
//       {/* Product image */}
//       <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
//         <img
//           src={product.image}
//           alt={product.name}
//           loading="lazy"
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//         />

//         {/* Sale badge */}
//         {product.isOnSale && (
//           <span className="absolute top-2.5 left-2.5 bg-[#DA5605] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
//             Sale
//           </span>
//         )}

//         {/* Wishlist heart */}
//         <button
//           aria-label="Add to wishlist"
//           onClick={(e) => { e.preventDefault(); setWishlisted((w) => !w); }}
//           className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//         >
//           <Heart
//             className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-[#DA5605] text-[#DA5605]' : 'text-gray-500'}`}
//           />
//         </button>
//       </div>

//       {/* Card body */}
//       <div className="p-3 flex flex-col gap-2 flex-1">
//         {/* Product name */}
//         <p className="text-[13px] text-gray-800 font-medium leading-tight line-clamp-2 font-['Poppins']">
//           {product.name}
//         </p>

//         {/* Price row */}
//         <div className="flex items-center gap-2 mt-auto">
//           <span className="text-[15px] font-bold text-gray-900 font-['Poppins']">
//             ${displayPrice.toFixed(2)}
//           </span>
//           {product.isOnSale && product.salePrice && (
//             <span className="text-[12px] text-gray-400 line-through">
//               ${product.price.toFixed(2)}
//             </span>
//           )}
//         </div>

//         {/* Add to Cart button */}
//         <motion.button
//           whileTap={{ scale: 0.96 }}
//           onClick={handleAddToCart}
//           className={`mt-1 w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-white rounded-lg py-2 transition-all duration-300 font-['Poppins'] ${
//             addedFeedback
//               ? 'bg-green-500'
//               : 'bg-[#DA5605] hover:bg-[#c04a04]'
//           }`}
//         >
//           <ShoppingCart className="w-3.5 h-3.5" />
//           {addedFeedback ? 'Added!' : 'Add to Cart'}
//         </motion.button>
//       </div>
//     </motion.article>
//   );
// }


// Individual product card — image, name, price badge, sale indicator, add-to-cart button.
// Receives a `product` prop shaped by useProducts mock / API response.

import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

// Resolve relative image paths to full backend URLs
const API_BASE = (import.meta.env?.VITE_API_URL || client.defaults?.baseURL || 'http://localhost:1500/api')
  .replace(/\/api.*$/, '')
  .replace(/\/$/, '');

const resolveImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

const safePrice = (val) => {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

export const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ProductCard({ product, onAddToCart }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1600);
  };

  const price     = safePrice(product.price);
  const salePrice = safePrice(product.salePrice);
  const isOnSale  = Boolean(product.isOnSale) && salePrice > 0 && salePrice < price;
  const displayPrice = isOnSale ? salePrice : price;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.22 }}
      className="bg-white rounded-xl overflow-hidden flex flex-col group border border-gray-100"
    >
      {/* Clickable area — image + name + price */}
      <Link to={`/products/${product.slug}`} className="flex flex-col flex-1">
        {/* Product image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
          <img
            src={resolveImageUrl(product.image) || '/placeholder-product.png'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {isOnSale && (
            <span className="absolute top-2.5 left-2.5 bg-[#DA5605] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Sale
            </span>
          )}

          {/* Wishlist heart */}
          <button
            aria-label="Add to wishlist"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted((w) => !w); }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-[#DA5605] text-[#DA5605]' : 'text-gray-500'}`}
            />
          </button>
        </div>

        {/* Card body */}
        <div className="p-3 flex flex-col gap-2 flex-1">
          <p className="text-[13px] text-gray-800 font-medium leading-tight line-clamp-2 font-['Poppins']">
            {product.name}
          </p>

          <div className="flex items-center gap-2 mt-auto">
            <span className="text-[15px] font-bold text-gray-900 font-['Poppins']">
              ₦{displayPrice.toFixed(2)}
            </span>
            {isOnSale && price > 0 && (
              <span className="text-[12px] text-gray-400 line-through">
                ₦{price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart button — outside Link so it doesn't navigate */}
      <div className="px-3 pb-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-white rounded-lg py-2 transition-all duration-300 font-['Poppins'] ${
            addedFeedback
              ? 'bg-green-500'
              : 'bg-[#DA5605] hover:bg-[#c04a04]'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {addedFeedback ? 'Added!' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.article>
  );
}