// src/pages/admin/DashboardPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Main admin dashboard: 4 stat cards at top, then a two-column row with
// the monthly revenue area chart and the traffic-source donut chart,
// then the recent orders table at the bottom.
// Every section animates in one after another via Framer Motion stagger.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingCart, Users, Package,
} from 'lucide-react';

import { useDashboard }        from '../../hooks/admin/useAdminData';
import StatCard                from '../../components/admin/StatCard';
import SalesChart              from '../../components/admin/SalesChart';
import DonutChart              from '../../components/admin/DonutChart';
import DataTable               from '../../components/admin/DataTable';
import StatusBadge             from '../../components/admin/StatusBadge';
import { formatCurrency }      from '../../utils/formatCurrency';
import { formatDate }          from '../../utils/formatDate';
import {
  containerVariants,
  itemVariants,
  scaleIn,
} from '../../utils/animation';

// ── Stat card config ─────────────────────────────────────────────────────────
const STAT_CONFIG = [
  { key: 'revenue',   title: 'Total Revenue',   icon: DollarSign,  format: (v) => formatCurrency(v) },
  { key: 'orders',    title: 'Total Orders',     icon: ShoppingCart, format: (v) => v.toLocaleString() },
  { key: 'customers', title: 'Total Customers',  icon: Users,        format: (v) => v.toLocaleString() },
  { key: 'products',  title: 'Total Products',   icon: Package,      format: (v) => v.toLocaleString() },
];

// ── Recent orders table column definitions ───────────────────────────────────
const ORDER_COLUMNS = [
  {
    key: 'id',
    header: 'Order ID',
    render: (v) => <span className="text-orange-600 font-medium">{v}</span>,
  },
  {
    key: 'customer',
    header: 'Customer',
    render: (v) => <span className="font-medium text-gray-800">{v}</span>,
  },
  { key: 'product',  header: 'Product' },
  {
    key: 'date',
    header: 'Date',
    render: (v) => <span className="text-gray-500">{formatDate(v)}</span>,
  },
  {
    key: 'paymentMethod',
    header: 'Payment',
    render: (v) => <span className="text-gray-500">{v}</span>,
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (v) => <span className="font-semibold">{formatCurrency(v)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (v) => <StatusBadge status={v} />,
  },
];

export default function DashboardPage() {
  const { data, loading } = useDashboard();

  const stats        = data?.stats        ?? {};
  const salesData    = data?.salesData    ?? [];
  const traffic      = data?.trafficSources ?? [];
  const recentOrders = data?.recentOrders ?? [];

  return (
    // Outer container — stagger every direct child section
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Section 1: Stat cards ──────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      >
        {STAT_CONFIG.map(({ key, title, icon, format }) => {
          const stat = stats[key];
          return (
            <StatCard
              key={key}
              title={title}
              value={loading ? '—' : format(stat?.value ?? 0)}
              change={stat?.change}
              trend={stat?.trend}
              icon={icon}
            />
          );
        })}
      </motion.div>

      {/* ── Section 2: Charts row ─────────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Revenue area chart — takes 2/3 width on desktop */}
        <motion.div
          variants={scaleIn}
          className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Revenue Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly revenue for 2026</p>
            </div>
            <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">
              2026
            </span>
          </div>
          {loading ? (
            <div className="h-[220px] bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <SalesChart data={salesData} />
          )}
        </motion.div>

        {/* Donut chart — takes 1/3 width on desktop */}
        <motion.div
          variants={scaleIn}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5"
        >
          <h2 className="text-sm font-semibold text-gray-800 mb-1">Traffic Sources</h2>
          <p className="text-xs text-gray-400 mb-4">Sales breakdown by channel</p>
          {loading ? (
            <div className="h-[200px] bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <DonutChart data={traffic} />
          )}
        </motion.div>
      </motion.div>

      {/* ── Section 3: Recent orders ──────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            View all →
          </a>
        </div>

        <DataTable
          columns={ORDER_COLUMNS}
          data={recentOrders}
          loading={loading}
          rowKey="id"
          emptyMessage="No recent orders."
          skeletonRows={5}
        />
      </motion.div>
    </motion.div>
  );
}
