// src/components/admin/StatCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Animated metric card shown on Dashboard (revenue, orders, etc.)
// and Customers page (total, VIP, active, new this month).
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { itemVariants } from '../../utils/animation';

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconBg = 'bg-[#fdf2f0]',
  iconColor = 'text-[#AE3E27]',
  valueColor = 'text-gray-900',
  className = '',
}) {
  const isUp = trend === 'up';

  return (
    <motion.div
      variants={itemVariants}
      className={[
        'bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4',
        className,
      ].join(' ')}
    >
      {/* Icon */}
      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        {Icon && <Icon size={20} className={iconColor} />}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">
          {title}
        </p>
        <p className={`text-2xl font-bold mt-0.5 leading-tight ${valueColor}`}>
          {value}
        </p>
        {change !== undefined && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${isUp ? 'text-green-600' : 'text-red-500'}`}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-400 font-normal">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
