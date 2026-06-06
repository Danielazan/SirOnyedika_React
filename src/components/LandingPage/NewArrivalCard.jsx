import React from 'react';
import { motion } from 'framer-motion';
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

/**
 * NewArrivalCard — Reusable card for the New Arrivals slider
 *
 * Props:
 *   layout        : 'full-image' | 'product-right' | 'product-left'
 *   backgroundColor: CSS color for the card background (e.g., '#AE3E27', '#f5e6e0')
 *   productImage  : URL/path to the product image
 *   modelImage    : URL/path to the model image (for bottom section)
 *   title         : Product name
 *   price         : Product price (number)
 *   description   : Short description text (for bottom section)
 *   slug          : Product slug for navigation
 *   onAddToCart   : Callback when Add to Cart is clicked
 */
export default function NewArrivalCard({
  layout = 'product-right',
  backgroundColor = '#AE3E27',
  productImage,
  modelImage,
  title,
  price,
  description,
  slug,
  onAddToCart,
}) {
  const resolvedProductImage = resolveImageUrl(productImage);
  const resolvedModelImage = resolveImageUrl(modelImage);
  const displayPrice = safePrice(price);

  const isLightBg = isLightColor(backgroundColor);
  const textColor = isLightBg ? '#1a1a1a' : '#ffffff';
  const subTextColor = isLightBg ? 'rgba(26,26,26,0.65)' : 'rgba(255,255,255,0.75)';
  const btnBg = isLightBg ? '#1a1a1a' : '#ffffff';
  const btnText = isLightBg ? '#ffffff' : '#AE3E27';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) onAddToCart({ slug, name: title, price: displayPrice, image: productImage });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col h-full rounded-xl overflow-hidden select-none"
      style={{ backgroundColor }}
    >
      {/* ── Top bar: "New Arrivals" label ── */}
      <div
        className="px-4 py-2.5 flex items-center"
        style={{ borderBottom: `1px solid ${isLightBg ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'}` }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: textColor, opacity: 0.85 }}
        >
          New Arrivals
        </span>
      </div>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col">
        {layout === 'full-image' ? (
          /* ━━━ Full-image layout (like Card 1 in image) ━━━ */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
              <motion.img
                src={resolvedProductImage || '/placeholder-product.png'}
                alt={title}
                className="w-full h-full object-contain"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4 }}
                draggable={false}
              />
            </div>
            {/* Right-side info overlay */}
            <div className="px-4 pb-4 flex items-end justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate" style={{ color: textColor }}>
                  {title}
                </h3>
                <p className="text-xs font-bold mt-0.5" style={{ color: textColor, opacity: 0.9 }}>
                  ₦{displayPrice.toFixed(2)}
                </p>
              </div>
              <Link to={`/products/${slug}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="shrink-0 px-4 py-2 text-[11px] font-semibold rounded-full transition-colors"
                  style={{ background: btnBg, color: btnText }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </motion.button>
              </Link>
            </div>
          </div>
        ) : (
          /* ━━━ Product-right / product-left layout (Cards 2 & 3 in image) ━━━ */
          <div className={`flex-1 flex ${layout === 'product-left' ? 'flex-row-reverse' : 'flex-row'} items-center gap-3 px-4 py-3`}>
            {/* Product image */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center" style={{ minHeight: 140 }}>
              <motion.img
                src={resolvedProductImage || '/placeholder-product.png'}
                alt={title}
                className="w-full h-full object-contain max-h-[160px]"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.4 }}
                draggable={false}
              />
            </div>
            {/* Info panel */}
            <div className="w-[45%] flex flex-col justify-center gap-2">
              <h3 className="text-[13px] font-semibold leading-tight" style={{ color: textColor }}>
                {title}
              </h3>
              <p className="text-xs font-bold" style={{ color: textColor, opacity: 0.9 }}>
                ₦{displayPrice.toFixed(2)}
              </p>
              <Link to={`/products/${slug}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-3 py-2 text-[10px] font-semibold rounded-full transition-colors"
                  style={{ background: btnBg, color: btnText }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </motion.button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom section: Model + description ── */}
      {description && (
        <div
          className="px-4 py-3 flex items-start gap-3"
          style={{
            borderTop: `1px solid ${isLightBg ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.10)'}`,
            background: isLightBg ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
          }}
        >
          {resolvedModelImage && (
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-200/20">
              <img
                src={resolvedModelImage}
                alt="Model"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium leading-relaxed" style={{ color: subTextColor }}>
              {description}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Helper: determine if a color is light or dark ──
function isLightColor(color) {
  if (!color) return false;
  // Handle hex colors
  const hex = color.replace('#', '');
  if (hex.length === 3 || hex.length === 6) {
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 160;
  }
  // Default: assume dark for non-hex
  return false;
}