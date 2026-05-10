// src/components/admin/StatusBadge.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Coloured pill badge for order statuses, customer statuses, product stock, etc.
// Colour map is centralised here so every page stays consistent.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

const STATUS_STYLES = {
  // Order statuses
  delivered:  'bg-green-100  text-green-700',
  processing: 'bg-blue-100   text-blue-700',
  pending:    'bg-yellow-100 text-yellow-700',
  shipped:    'bg-purple-100 text-purple-700',
  cancelled:  'bg-red-100    text-red-700',

  // Customer statuses
  active:     'bg-green-100  text-green-700',
  vip:        'bg-pink-100   text-pink-600',
  new:        'bg-yellow-100 text-yellow-700',
  inactive:   'bg-gray-100   text-gray-500',

  // Product / Flash sale
  active_sale:'bg-green-100  text-green-700',
  upcoming:   'bg-blue-100   text-blue-700',
  ended:      'bg-gray-100   text-gray-500',

  // Generic
  true:       'bg-green-100  text-green-700',
  false:      'bg-gray-100   text-gray-500',
};

export default function StatusBadge({ status, className = '' }) {
  const key       = String(status).toLowerCase();
  const styles    = STATUS_STYLES[key] ?? 'bg-gray-100 text-gray-500';
  const label     = String(status).charAt(0).toUpperCase() + String(status).slice(1);

  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        styles,
        className,
      ].join(' ')}
    >
      {label}
    </span>
  );
}
