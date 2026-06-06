// src/pages/admin/customers/CustomersPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Customers page — matches the design exactly:
//  • 4 stat mini-cards (Total, VIP, Active, New this Month)
//  • Search by name + Status dropdown filter
//  • Customer table (avatar, name, email, location, orders, spent, status, joined)
//  • Pagination strip
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState }      from 'react';
import { motion }               from 'framer-motion';
import { Search, Users, Crown, UserCheck, UserPlus, ChevronDown } from 'lucide-react';

import { useAdminCustomers }    from '../../../hooks/admin/useAdminData';
import DataTable                from '../../../components/admin/DataTable';
import StatusBadge              from '../../../components/admin/StatusBadge';
import Pagination               from '../../../components/admin/Pagination';
import TextInput                from '../../../components/ui/TextInput';
import { formatCurrency }       from '../../../utils/formatCurrency';
import { containerVariants, itemVariants } from '../../../utils/animation';

// ── Mini stat cards config ───────────────────────────────────────────────────
const STAT_CARDS = [
  { key: 'total',        label: 'Total Customers', icon: Users,       iconColor: 'text-[#AE3E27]' },
  { key: 'vip',          label: 'VIP Members',     icon: Crown,       iconColor: 'text-[#AE3E27]' },
  { key: 'active',       label: 'Active',          icon: UserCheck,   iconColor: 'text-[#AE3E27]' },
  { key: 'newThisMonth', label: 'New this Month',  icon: UserPlus,    iconColor: 'text-[#AE3E27]', valueColor: 'text-[#AE3E27]' },
];

const STATUS_OPTIONS = ['All', 'Active', 'VIP', 'New', 'Inactive'];

// ── Table columns ────────────────────────────────────────────────────────────
const COLUMNS = [
  {
    key: 'name',
    header: 'Customer',
    render: (v, row) => (
      <div className="flex items-center gap-2.5">
        <img
          src={row.avatar ?? 'https://i.pravatar.cc/32'}
          alt={v}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <span className="font-medium text-gray-800 text-sm">{v}</span>
      </div>
    ),
  },
  {
    key: 'email',
    header: 'Email',
    render: (v) => <span className="text-gray-500 text-sm">{v}</span>,
  },
  {
    key: 'location',
    header: 'Location',
    render: (v) => <span className="text-gray-600 text-sm">{v}</span>,
  },
  {
    key: 'orders',
    header: 'Orders',
    render: (v) => <span className="font-medium text-gray-700">{v}</span>,
  },
  {
    key: 'totalSpent',
    header: 'Total Spent',
    render: (v) => <span className="font-semibold text-gray-800">{formatCurrency(v)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (v) => <StatusBadge status={v} />,
  },
  {
    key: 'joined',
    header: 'Joined',
    render: (v) => <span className="text-gray-500 text-xs">{v}</span>,
  },
];

export default function CustomersPage() {
  const [search,    setSearch]    = useState('');
  const [status,    setStatus]    = useState('');
  const [page,      setPage]      = useState(1);
  const [statOpen,  setStatOpen]  = useState(false);

  const { customers, stats, loading, pagination } = useAdminCustomers(page, search, status);

  const handleSearch = (e)  => { setSearch(e.target.value); setPage(1); };
  const handleStatus = (val) => {
    setStatus(val === 'All' ? '' : val);
    setPage(1);
    setStatOpen(false);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* ── Section 1: Stat mini-cards ─────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {STAT_CARDS.map(({ key, label, icon: Icon, iconColor, valueColor }) => (
          <motion.div
            key={key}
            variants={itemVariants}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#fdf2f0] flex items-center justify-center shrink-0">
              <Icon size={18} className={iconColor} />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-tight">{label}</p>
              <p className={`text-xl font-bold mt-0.5 ${valueColor ?? 'text-gray-900'}`}>
                {loading ? '—' : stats[key] ?? 0}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Section 2: Search + Status filter ─────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[180px] max-w-xs">
          <TextInput
            placeholder="Search by name"
            leftIcon={Search}
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600
                       hover:bg-gray-50 transition-colors min-w-[120px] justify-between"
          >
            {status || 'Status'}
            <ChevronDown size={14} className={`transition-transform ${statOpen ? 'rotate-180' : ''}`} />
          </button>
          {statOpen && (
            <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-100 shadow-lg rounded-lg py-1 min-w-[140px]">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleStatus(opt)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#fdf2f0] hover:text-[#AE3E27] transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Section 3: Customers table ─────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <DataTable
          columns={COLUMNS}
          data={customers}
          loading={loading}
          rowKey="id"
          emptyMessage="No customers found."
          skeletonRows={6}
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
