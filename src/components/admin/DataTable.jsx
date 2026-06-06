// src/components/admin/DataTable.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Generic animated table used by Orders, Products, and Customers pages.
// Accepts column definitions and row data — no page-specific logic inside.
// On mobile, horizontally scrollable with sticky first column.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../utils/animation';

// Skeleton loader row
function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found.',
  rowKey = 'id',
  onRowClick,
  skeletonRows = 5,
}) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-sm">
        {/* Table header — orange-tinted background matching design */}
        <thead>
          <tr className="bg-[#AE3E27]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  'px-4 py-3 text-left text-xs font-semibold text-[#AE3E27] uppercase tracking-wider whitespace-nowrap',
                  col.headerClassName ?? '',
                ].join(' ')}
                style={col.width ? { width: col.width } : {}}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-gray-400 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            <motion.tbody
              key="table-body"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              // Render as React fragment inside motion — trick to animate rows
              as={React.Fragment}
            >
              {data.map((row, rowIdx) => (
                <motion.tr
                  key={row[rowKey] ?? rowIdx}
                  variants={itemVariants}
                  onClick={() => onRowClick?.(row)}
                  className={[
                    'border-t border-gray-50 bg-white',
                    'hover:bg-[#fdf2f0]/30 transition-colors duration-150',
                    onRowClick ? 'cursor-pointer' : '',
                  ].join(' ')}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={[
                        'px-4 py-3 text-gray-700 whitespace-nowrap',
                        col.className ?? '',
                      ].join(' ')}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] ?? '—'}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </motion.tbody>
          )}
        </tbody>
      </table>
    </div>
  );
}
