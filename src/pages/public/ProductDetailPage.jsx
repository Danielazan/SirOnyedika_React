// ProductDetailPage — Variant-linked image gallery implementation
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, Share2, Star, Package, BadgePercent, CreditCard, Headphones,
  Plus, Minus, Check,
} from 'lucide-react';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useProductBySlug } from '../../hooks/products/useProducts';
import client from '../../api/client';
import { formatCurrency } from '../../utils/formatCurrency';

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

// ── Image Gallery (shows current variant's images) ───────────────────────────
function ImageGallery({ variant, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = variant?.images?.filter((img) => img?.url) || [];

  // Reset to first image when variant changes
  useEffect(() => {
    setActiveIndex(0);
  }, [variant?.id]);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/2] max-h-[420px] bg-gray-50 rounded-lg flex items-center justify-center">
        <span className="text-3xl font-bold text-gray-200">
          {productName?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-[3/2] max-h-[420px] bg-white rounded-lg overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={`${variant?.id}-${activeIndex}`}
            src={resolveImageUrl(images[activeIndex].url)}
            alt={productName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-contain"
          />
        </AnimatePresence>
      </div>

      {/* Variant's own image thumbnails (if variant has multiple images) */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                i === activeIndex
                  ? 'border-[#AE3E27]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={resolveImageUrl(img.url)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Variant Thumbnails (one per variant — acts as variant selector) ──────────
function VariantThumbnails({ variants, selectedVariant, onSelect }) {
  // Build list: one thumbnail per variant (first image only)
  const items = useMemo(() => {
    return (variants || [])
      .map((v) => ({ variant: v, image: v.images?.find((img) => img?.url) }))
      .filter((item) => item.image);
  }, [variants]);

  if (items.length <= 1) return null;

  return (
    <div className="flex gap-2 pt-2">
      {items.map(({ variant, image }) => {
        const isActive = variant.id === selectedVariant?.id;
        return (
          <button
            key={variant.id}
            onClick={() => onSelect(variant)}
            className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
              isActive
                ? 'border-[#AE3E27] ring-1 ring-[#AE3E27]'
                : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
            }`}
            title={variant.name}
          >
            <img
              src={resolveImageUrl(image.url)}
              alt={variant.name}
              className="w-full h-full object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Variant Selector (size buttons) ──────────────────────────────────────────
function VariantSelector({ variants, selected, onSelect }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-gray-900 uppercase tracking-wide">SIZE</p>
        <button className="text-[11px] text-gray-500 hover:text-[#AE3E27] transition-colors">Size Guide</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isActive = v.id === selected?.id;
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v)}
              className={`min-w-[32px] h-8 px-2 rounded-md text-[11px] font-medium border transition-all flex items-center justify-center whitespace-nowrap ${
                isActive
                  ? 'border-[#AE3E27] text-[#AE3E27]'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {v.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Quantity Stepper ──────────────────────────────────────────────────────────
function QuantityStepper({ value, onChange, max }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-md h-8 w-24">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
      >
        <Minus size={12} />
      </button>
      <span className="flex-1 text-center text-[11px] font-medium text-gray-900">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-30 transition-colors"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

// ── Features Row ──────────────────────────────────────────────────────────────
function FeaturesRow() {
  const items = [
    { icon: Package, title: 'Free Shipping', desc: 'Free shipping for order above $185' },
    { icon: BadgePercent, title: 'Members Discount', desc: 'Discount for elite members' },
    { icon: CreditCard, title: 'Flexible Payment', desc: 'Secured payment options' },
    { icon: Headphones, title: 'Swift Support', desc: '24/7 customer support' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
      {items.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="flex flex-col items-center text-center gap-1.5">
          <Icon size={18} className="text-[#AE3E27]" strokeWidth={1.5} />
          <div>
            <p className="text-[11px] font-semibold text-gray-900">{title}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading } = useProductBySlug(slug);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Set default variant when product loads
  useMemo(() => {
    if (product?.variants?.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  // Reset qty when variant changes (optional safety)
  useEffect(() => {
    setQty(1);
  }, [selectedVariant?.id]);

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="bg-[#FDF6EC] py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-7 bg-[#f8cec7]/30 rounded w-48 mx-auto animate-pulse" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[3/2] bg-gray-100 rounded-lg animate-pulse" />
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-px bg-gray-200" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">Product not found.</p>
          <button
            onClick={() => navigate('/shop')}
            className="mt-3 px-4 py-2 bg-[#AE3E27] text-white rounded-full text-xs font-semibold hover:bg-[#8f3320] transition-colors"
          >
            Back to Shop
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const price = safePrice(selectedVariant?.price ?? product.variants?.[0]?.price);
  const salePrice = safePrice(selectedVariant?.salePrice ?? product.variants?.[0]?.salePrice);
  const isOnSale = Boolean(selectedVariant?.isOnSale ?? product.variants?.[0]?.isOnSale) && salePrice > 0 && salePrice < price;
  const displayPrice = isOnSale ? salePrice : price;
  const stockQty = selectedVariant?.stockQty ?? product.variants?.[0]?.stockQty ?? 0;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    console.log('Add to cart:', { product, variant: selectedVariant, qty });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="bg-[#FDF6EC] py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Product Details</h1>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ImageGallery
                variant={selectedVariant}
                productName={product.name}
              />
              <VariantThumbnails
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={handleSelectVariant}
              />
            </motion.div>

            {/* Right: Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-lg md:text-xl font-bold text-gray-900">{product.name}</h1>

              <div className="flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-bold text-[#AE3E27]">
                  {formatCurrency(displayPrice)}
                </span>
                {isOnSale && price > 0 && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatCurrency(price)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="text-gray-300" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">(No ratings available)</span>
              </div>

              <div className="h-px bg-gray-200" />

              {product.variants?.length > 0 && (
                <VariantSelector
                  variants={product.variants}
                  selected={selectedVariant}
                  onSelect={handleSelectVariant}
                />
              )}

              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description || 'No description available.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <QuantityStepper value={qty} onChange={setQty} max={stockQty} />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="h-8 px-5 rounded-md text-xs font-semibold border border-gray-300 text-gray-700 hover:border-[#AE3E27] hover:text-[#AE3E27] transition-all"
                >
                  BUY
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={stockQty === 0}
                  className={`h-8 px-5 rounded-md text-xs font-semibold transition-all ${
                    added
                      ? 'bg-green-500 text-white'
                      : stockQty === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#AE3E27] text-white hover:bg-[#8f3320]'
                  }`}
                >
                  {added ? (
                    <span className="flex items-center gap-1">
                      <Check size={12} /> ADDED
                    </span>
                  ) : (
                    'ADD TO CART'
                  )}
                </motion.button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setWishlisted((w) => !w)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                    wishlisted
                      ? 'border-[#AE3E27] bg-[#fdf2f0] text-[#AE3E27]'
                      : 'border-gray-300 text-gray-600 hover:border-[#AE3E27] hover:text-[#AE3E27]'
                  }`}
                >
                  <Heart size={12} className={wishlisted ? 'fill-[#AE3E27]' : ''} />
                  {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-xs font-medium text-gray-600 hover:border-[#AE3E27] hover:text-[#AE3E27] transition-all">
                  <Share2 size={12} />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturesRow />
        </div>

      </main>

      <Footer />
    </div>
  );
}