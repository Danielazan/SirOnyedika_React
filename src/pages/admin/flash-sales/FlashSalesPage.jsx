// src/pages/admin/flash-sales/FlashSalesPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Flash Sales page.
// Shows each flash sale as a titled section with a live countdown timer,
// followed by a horizontal row of product cards showing original price,
// sale price, discount %, sold count, and remaining stock.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion }                      from 'framer-motion';
import { Plus, Zap, Clock }           from 'lucide-react';

import { useAdminFlashSales }         from '../../../hooks/admin/useAdminData';
import StatusBadge                    from '../../../components/admin/StatusBadge';
import Button                         from '../../../components/ui/Button';
import { formatCurrency }             from '../../../utils/formatCurrency';
import { containerVariants, itemVariants, scaleIn } from '../../../utils/animation';

// ── Live countdown hook ──────────────────────────────────────────────────────
function useCountdown(endDateISO) {
  const calc = () => {
    const diff = new Date(endDateISO) - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86_400_000),
      h: Math.floor((diff % 86_400_000) / 3_600_000),
      m: Math.floor((diff % 3_600_000)  / 60_000),
      s: Math.floor((diff % 60_000)     / 1_000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDateISO]);
  return time;
}

// ── Countdown display component ───────────────────────────────────────────────
function Countdown({ endDate }) {
  const { d, h, m, s } = useCountdown(endDate);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1.5 text-sm font-mono font-semibold text-gray-700">
      <Clock size={14} className="text-[#AE3E27] shrink-0" />
      {d > 0 && <span>{d}d</span>}
      <span>{pad(h)}:{pad(m)}:{pad(s)}</span>
    </div>
  );
}

// ── Individual product card inside a flash sale ───────────────────────────────
function FlashProductCard({ product }) {
  const soldPercent = Math.min(
    Math.round((product.sold / (product.sold + product.stock)) * 100),
    100
  );

  return (
    <motion.div
      variants={scaleIn}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden w-[200px] shrink-0"
    >
      {/* Product image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Discount badge */}
        <span className="absolute top-2 left-2 bg-[#AE3E27] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{product.discount}%
        </span>
      </div>

      {/* Details */}
      <div className="p-3 space-y-2">
        <p className="text-sm font-semibold text-gray-800 leading-tight truncate">
          {product.name}
        </p>

        {/* Prices */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-[#AE3E27]">
            {formatCurrency(product.salePrice)}
          </span>
          <span className="text-xs text-gray-400 line-through">
            {formatCurrency(product.originalPrice)}
          </span>
        </div>

        {/* Sold progress bar */}
        <div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Sold: {product.sold}</span>
            <span>Left: {product.stock}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#AE3E27] rounded-full transition-all"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Flash Sale section ────────────────────────────────────────────────────────
function FlashSaleSection({ sale }) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5"
    >
      {/* Section header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#fce5e0] flex items-center justify-center">
            <Zap size={18} className="text-[#AE3E27]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-800">{sale.name}</h2>
              <StatusBadge status={sale.status === 'active' ? 'active_sale' : sale.status} />
            </div>
            {sale.status === 'active' ? (
              <div className="mt-0.5">
                <Countdown endDate={sale.endDate} />
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-0.5">
                Starts {new Date(sale.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">Edit Sale</Button>
          <Button variant="danger"    size="sm">End Sale</Button>
          <Button size="sm" leftIcon={Plus}>Add Product</Button>
        </div>
      </div>

      {/* Product cards — horizontal scroll on mobile */}
      <motion.div
        variants={containerVariants}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200"
      >
        {sale.products.map((p) => (
          <FlashProductCard key={p.id} product={p} />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function FlashSalesPage() {
  const { data: sales = [], loading } = useAdminFlashSales();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* ── Section 1: Toolbar ─────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <Button leftIcon={Plus}>Create Flash Sale</Button>
      </motion.div>

      {/* ── Section 2: Flash sale sections ─────────────────────────────── */}
      {loading ? (
        <motion.div variants={itemVariants} className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 h-64 animate-pulse" />
          ))}
        </motion.div>
      ) : sales.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-20 text-gray-400">
          No flash sales yet. Create one to get started.
        </motion.div>
      ) : (
        sales.map((sale) => (
          <FlashSaleSection key={sale.id} sale={sale} />
        ))
      )}
    </motion.div>
  );
}
