// src/components/admin/SalesChart.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Monthly revenue area chart using Recharts.
// Matches the soft curved line with orange gradient fill in the design.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

// Custom tooltip bubble
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-lg px-3 py-2">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-[#AE3E27]">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export default function SalesChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#AE3E27" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#AE3E27" stopOpacity={0}    />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />

        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `₦${(v / 1_000_000).toFixed(1)}M`}
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          width={52}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#AE3E27"
          strokeWidth={2.5}
          fill="url(#revenueGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#AE3E27', strokeWidth: 2, stroke: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
