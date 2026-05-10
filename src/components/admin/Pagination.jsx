// src/components/admin/Pagination.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Pagination strip matching the design: Previous ← 1 2 3 … 8 9 10 Next →
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  // Build visible page numbers with ellipsis
  const getPages = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const result = [1, 2, 3];
    if (page > 5) result.push('…');
    if (page > 4 && page < pages - 3) { result.push(page - 1, page, page + 1); }
    if (page <= 4) result.push(4, 5);
    if (page < pages - 3) result.push('…');
    result.push(pages - 2, pages - 1, pages);
    return [...new Set(result)];
  };

  return (
    <div className="flex items-center justify-between px-2 pt-4 pb-1">
      {/* Previous */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} /> Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {getPages().map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={[
                'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                p === page
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100',
              ].join(' ')}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}
