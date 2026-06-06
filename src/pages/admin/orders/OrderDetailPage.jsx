// src/pages/admin/orders/OrdersPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Orders list page.
// Features: status tab filters, search bar, sortable data table, pagination.
// All sections stagger in one-after-another with Framer Motion.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion }           from 'framer-motion';
import { Search }           from 'lucide-react';

import { useAdminOrders }   from '../../../hooks/admin/useAdminData';
import DataTable            from '../../../components/admin/DataTable';
import StatusBadge          from '../../../components/admin/StatusBadge';
import Pagination           from '../../../components/admin/Pagination';
import TextInput            from '../../../components/ui/TextInput';
import { formatCurrency }   from '../../../utils/formatCurrency';
import { formatDate }       from '../../../utils/formatDate';
import { containerVariants, itemVariants } from '../../../utils/animation';

// ── Tab filter options ───────────────────────────────────────────────────────
const STATUS_TABS = [
  { label: 'All',        value: ''           },
  { label: 'Pending',    value: 'pending'    },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped',    value: 'shipped'    },
  { label: 'Delivered',  value: 'delivered'  },
  { label: 'Cancelled',  value: 'cancelled'  },
];

// ── Table column definitions ─────────────────────────────────────────────────
const COLUMNS = [
  {
    key: 'id',
    header: 'Order ID',
    render: (v) => <span className="text-[#AE3E27] font-medium text-xs">{v}</span>,
  },
  {
    key: 'customer',
    header: 'Customer',
    render: (_, row) => (
      <div className="flex items-center gap-2.5">
        <img
          src={row.customer?.avatar ?? 'https://i.pravatar.cc/32'}
          alt={row.customer?.name}
          className="w-7 h-7 rounded-full object-cover shrink-0"
        />
        <span className="font-medium text-gray-800 text-sm">{row.customer?.name}</span>
      </div>
    ),
  },
  { key: 'product', header: 'Product',
    render: (v) => <span className="text-gray-600 text-sm">{v}</span> },
  {
    key: 'date',
    header: 'Date',
    render: (v) => <span className="text-gray-500 text-xs">{formatDate(v)}</span>,
  },
  {
    key: 'paymentMethod',
    header: 'Payment',
    render: (v) => <span className="text-gray-500 text-xs">{v}</span>,
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (v) => <span className="font-semibold text-gray-800">{formatCurrency(v)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (v) => <StatusBadge status={v} />,
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('');
  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);

  const { orders, loading, pagination } = useAdminOrders(activeTab, page, search);

  // Reset to page 1 whenever filters change
  const handleTabChange = (val) => { setActiveTab(val); setPage(1); };
  const handleSearch    = (e)   => { setSearch(e.target.value); setPage(1); };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* ── Section 1: Status tab filters ──────────────────────────── */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={[
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150',
                activeTab === value
                  ? 'bg-[#AE3E27] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Section 2: Search bar + action row ─────────────────────── */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="flex-1 max-w-xs">
          <TextInput
            placeholder="Search orders…"
            leftIcon={Search}
            value={search}
            onChange={handleSearch}
          />
        </div>
      </motion.div>

      {/* ── Section 3: Orders table ─────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <DataTable
          columns={COLUMNS}
          data={orders}
          loading={loading}
          rowKey="id"
          emptyMessage="No orders found."
          skeletonRows={8}
        />

        {/* ── Section 4: Pagination ──────────────────────────────────── */}
        {!loading && pagination.pages > 1 && (
          <motion.div variants={itemVariants} className="px-4 pb-4">
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              onChange={setPage}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
