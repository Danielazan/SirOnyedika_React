// OrdersPage — Panel 2 & 3 of the account area.
// Shows order summary stats, status filter tabs, and a list of order cards.
// Each card expands to show all items in that order.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useOrders } from '../../hooks/orders/useOrders';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:          { label: 'Pending',         bg: 'bg-yellow-100',  text: 'text-yellow-700'  },
  CONFIRMED:        { label: 'Confirmed',        bg: 'bg-blue-100',    text: 'text-blue-700'    },
  PACKED:           { label: 'Packed',           bg: 'bg-indigo-100',  text: 'text-indigo-700'  },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', bg: 'bg-[#fce5e0]',  text: 'text-[#8f3320]'  },
  DELIVERED:        { label: 'Delivered',        bg: 'bg-green-100',   text: 'text-green-700'   },
  CANCELLED:        { label: 'Cancelled',        bg: 'bg-red-100',     text: 'text-red-600'     },
  REFUNDED:         { label: 'Refunded',         bg: 'bg-gray-100',    text: 'text-gray-600'    },
};

const TABS = [
  { key: '',          label: 'All Orders'  },
  { key: 'CONFIRMED', label: 'Confirmed'   },
  { key: 'DELIVERED', label: 'Delivered'   },
  { key: 'PENDING',   label: 'Pending'     },
  { key: 'CANCELLED', label: 'Cancelled'   },
];

// Card entrance animation
const cardVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: i * 0.07 },
  }),
};

// Single expanded order item row
function OrderItemRow({ item }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <img
        src={item.image ?? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop'}
        alt={item.productName}
        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-100"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{item.productName}</p>
        <p className="text-xs text-gray-400">{item.variantName}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-gray-500">Qty: <strong>{item.qty}</strong></span>
          <span className="text-xs font-bold text-[#AE3E27]">${Number(item.unitPrice).toFixed(2)}</span>
        </div>
      </div>
      <p className="text-sm font-bold text-gray-900 flex-shrink-0">${Number(item.lineTotal).toFixed(2)}</p>
    </div>
  );
}

// Single order card
function OrderCard({ order, index }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  const date = new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="border border-gray-100 rounded-xl overflow-hidden bg-white"
    >
      {/* Card header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50/60">
        <div className="flex items-start sm:items-center gap-3">
          {/* First item thumbnail */}
          <img
            src={order.items?.[0]?.image ?? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop'}
            alt=""
            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-gray-100"
          />
          <div>
            <p className="text-xs text-gray-400 font-medium">{order.orderNumber}</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {order.items?.[0]?.productName ?? 'Order'}
              {order.items?.length > 1 && (
                <span className="text-gray-400 font-normal"> +{order.items.length - 1} more</span>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 sm:flex-col sm:items-end">
          {/* Status badge */}
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
          {/* Total */}
          <p className="text-base font-bold text-[#AE3E27]">${Number(order.totalAmount).toFixed(2)}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Items: <strong className="text-gray-800">{order.items?.length ?? 0}</strong></span>
          <span>Shipping: <strong className="text-gray-800">${Number(order.shippingFee).toFixed(2)}</strong></span>
          {Number(order.discountAmount) > 0 && (
            <span className="text-green-600">Saved: <strong>-${Number(order.discountAmount).toFixed(2)}</strong></span>
          )}
        </div>

        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 text-xs font-semibold text-[#AE3E27] hover:text-[#8f3320] transition-colors"
        >
          {expanded ? 'Hide' : 'View More'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded items list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              {order.items?.map((item) => <OrderItemRow key={item.id} item={item} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('');
  const { orders, loading } = useOrders(activeTab);

  // Summary stats from all orders
  const stats = {
    total:     orders.length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
    pending:   orders.filter((o) => ['PENDING', 'CONFIRMED', 'PACKED'].includes(o.status)).length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  };

  return (
    <div>
      {/* ── Section heading ── */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100"
      >
        My Orders
      </motion.h2>

      {/* ── Stats row ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"
      >
        {[
          { label: 'Total Orders', value: stats.total,     color: 'bg-[#AE3E27]' },
          { label: 'Delivered',    value: stats.delivered, color: 'bg-green-500'  },
          { label: 'Pending',      value: stats.pending,   color: 'bg-yellow-500' },
          { label: 'Cancelled',    value: stats.cancelled, color: 'bg-red-500'    },
        ].map(({ label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className={`${color} rounded-xl p-3 text-white text-center`}
          >
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs font-medium opacity-90 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Status filter tabs ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === key
                ? 'bg-[#AE3E27] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-[#fdf2f0] hover:text-[#AE3E27]'
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* ── Order cards list ── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No orders found</p>
          <p className="text-gray-400 text-sm mt-1">Your orders will appear here once placed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <OrderCard key={order.id} order={order} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
