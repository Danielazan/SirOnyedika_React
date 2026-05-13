// // src/pages/public/PolicyPage.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Reusable public-facing policy page component.
// // Wraps Navbar + Footer and fetches the page content from the backend by key.
// //
// // Design reference: clean white layout with large serif-style title,
// // decorative asterisk/star icon in brand orange, and rich HTML content below.
// // ─────────────────────────────────────────────────────────────────────────────

// import React, { useEffect, useState } from 'react';
// import { motion }                     from 'framer-motion';
// import Navbar                         from '../../components/layout/Navbar';
// import Footer                         from '../../components/layout/Footer';
// import { getSitePage }                from '../../api/sitepages.api';

// // ── Skeleton loader ────────────────────────────────────────────────────────
// function PolicySkeleton() {
//   return (
//     <div className="animate-pulse space-y-4 max-w-3xl">
//       <div className="h-10 bg-gray-200 rounded w-1/2" />
//       <div className="h-4  bg-gray-100 rounded w-full" />
//       <div className="h-4  bg-gray-100 rounded w-5/6" />
//       <div className="h-4  bg-gray-100 rounded w-full" />
//       <div className="h-4  bg-gray-100 rounded w-4/5" />
//       <div className="h-4  bg-gray-100 rounded w-full" />
//     </div>
//   );
// }

// // ── Decorative star used next to the page title ────────────────────────────
// function StarIcon({ className = '' }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       className={className}
//       aria-hidden="true"
//     >
//       <path d="M12 0l2.37 7.29L22 8.18l-5.82 5.66 1.37 7.98L12 18.07l-5.55 3.75 1.37-7.98L2 8.18l7.63-.89L12 0z" />
//     </svg>
//   );
// }

// // ── Empty state when no content has been saved yet ─────────────────────────
// function EmptyContent({ title }) {
//   return (
//     <div className="py-16 text-center">
//       <StarIcon className="w-10 h-10 text-gray-200 mx-auto mb-4" />
//       <p className="text-gray-400 text-sm">
//         <strong>{title}</strong> content hasn't been published yet.
//       </p>
//       <p className="text-gray-300 text-xs mt-1">Check back soon.</p>
//     </div>
//   );
// }

// // ── Main component ──────────────────────────────────────────────────────────
// export default function PolicyPage({ pageKey }) {
//   const [page,    setPage]    = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error,   setError]   = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     setError(null);

//     getSitePage(pageKey)
//       .then(({ data }) => {
//         if (!cancelled) setPage(data);
//       })
//       .catch(() => {
//         if (!cancelled) setError('Unable to load this page. Please try again.');
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => { cancelled = true; };
//   }, [pageKey]);

//   // Keep browser tab title in sync
//   useEffect(() => {
//     if (page?.title) document.title = `${page.title} — Selvedge Atelier`;
//   }, [page?.title]);

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       <Navbar />

//       <main className="flex-1">
//         {/* ── Hero header ──────────────────────────────────────────────── */}
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: 'easeOut' }}
//           className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 border-b border-gray-100"
//         >
//           <div className="flex items-center gap-3">
//             <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
//               {loading ? (
//                 <span className="inline-block w-64 h-10 bg-gray-200 rounded animate-pulse" />
//               ) : (
//                 page?.title || 'Policy'
//               )}
//             </h1>
//             {/* Decorative orange star — only shown when content is loaded */}
//             {!loading && (
//               <StarIcon className="w-7 h-7 text-orange-500 shrink-0 mt-1" />
//             )}
//           </div>
//         </motion.div>

//         {/* ── Content area ─────────────────────────────────────────────── */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.15 }}
//           className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
//         >
//           {loading && <PolicySkeleton />}

//           {!loading && error && (
//             <div className="rounded-lg bg-red-50 border border-red-100 p-6 text-red-700 text-sm">
//               {error}
//             </div>
//           )}

//           {!loading && !error && !page?.content && (
//             <EmptyContent title={page?.title || 'This page'} />
//           )}

//           {!loading && !error && page?.content && (
//             <div
//               className="
//                 policy-content prose max-w-none
//                 text-gray-700 leading-relaxed text-[15px]

//                 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-8 [&_h1]:mb-3
//                 [&_h2]:text-xl  [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-7 [&_h2]:mb-2
//                 [&_h3]:text-lg  [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-5 [&_h3]:mb-2

//                 [&_p]:mb-4 [&_p]:leading-relaxed

//                 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
//                 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
//                 [&_li]:text-gray-700

//                 [&_strong]:font-semibold [&_strong]:text-gray-900
//                 [&_em]:italic

//                 [&_a]:text-orange-600 [&_a]:underline [&_a]:underline-offset-2
//                 [&_a:hover]:text-orange-700

//                 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-200
//                 [&_blockquote]:pl-5 [&_blockquote]:py-1 [&_blockquote]:my-4
//                 [&_blockquote]:text-gray-600 [&_blockquote]:italic

//                 [&_hr]:my-8 [&_hr]:border-gray-200

//                 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
//                 [&_th]:bg-gray-50 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left
//                 [&_th]:font-semibold [&_th]:text-gray-800 [&_th]:border [&_th]:border-gray-200
//                 [&_td]:px-4 [&_td]:py-2 [&_td]:border [&_td]:border-gray-200
//               "
//               dangerouslySetInnerHTML={{ __html: page.content }}
//             />
//           )}

//           {/* ── Last updated notice ─────────────────────────────────────── */}
//           {!loading && !error && page?.updatedAt && (
//             <p className="mt-12 text-xs text-gray-400 border-t border-gray-100 pt-4">
//               Last updated:{' '}
//               {new Date(page.updatedAt).toLocaleDateString('en-US', {
//                 year: 'numeric', month: 'long', day: 'numeric',
//               })}
//             </p>
//           )}
//         </motion.div>
//       </main>

//       <Footer />
//     </div>
//   );
// }

// src/pages/public/PolicyPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable public-facing policy page component.
// Wraps Navbar + Footer and fetches the page content from the backend by key.
//
// Security: DOMPurify sanitizes HTML before rendering. All links are forced
// to target="_blank" with rel="noopener noreferrer nofollow".
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { motion }                     from 'framer-motion';
import DOMPurify                      from 'dompurify';
import Navbar                         from '../../components/layout/Navbar';
import Footer                         from '../../components/layout/Footer';
import { getSitePage }                from '../../api/sitepages.api';

// ── Skeleton loader ────────────────────────────────────────────────────────
function PolicySkeleton() {
  return (
    <div className="animate-pulse space-y-4 max-w-3xl">
      <div className="h-10 bg-gray-200 rounded w-1/2" />
      <div className="h-4  bg-gray-100 rounded w-full" />
      <div className="h-4  bg-gray-100 rounded w-5/6" />
      <div className="h-4  bg-gray-100 rounded w-full" />
      <div className="h-4  bg-gray-100 rounded w-4/5" />
      <div className="h-4  bg-gray-100 rounded w-full" />
    </div>
  );
}

// ── Decorative star used next to the page title ────────────────────────────
function StarIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0l2.37 7.29L22 8.18l-5.82 5.66 1.37 7.98L12 18.07l-5.55 3.75 1.37-7.98L2 8.18l7.63-.89L12 0z" />
    </svg>
  );
}

// ── Empty state when no content has been saved yet ─────────────────────────
function EmptyContent({ title }) {
  return (
    <div className="py-16 text-center">
      <StarIcon className="w-10 h-10 text-gray-200 mx-auto mb-4" />
      <p className="text-gray-400 text-sm">
        <strong>{title}</strong> content hasn't been published yet.
      </p>
      <p className="text-gray-300 text-xs mt-1">Check back soon.</p>
    </div>
  );
}

// ── Sanitize and prepare HTML for safe rendering ──────────────────────────
function sanitizePolicyHtml(rawHtml) {
  if (!rawHtml) return '';

  // DOMPurify config: strict allow-list for policy documents
  const config = {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'strong', 'em', 'a', 'hr',
      'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'br',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'id', 'title',
    ],
    // Strip all event handlers
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  };

  // First pass: sanitize
  let clean = DOMPurify.sanitize(rawHtml, config);

  // Second pass: force all links to target="_blank" + rel="noopener noreferrer nofollow"
  // and validate href protocols
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = clean;

  const links = tempDiv.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';

    // Validate protocol: only allow http, https, mailto, tel, or relative paths
    const isValid =
      /^https?:\/\//.test(href) ||
      /^mailto:/.test(href) ||
      /^tel:/.test(href) ||
      /^\//.test(href) ||
      href === '';

    if (!isValid) {
      // Remove invalid href entirely
      link.removeAttribute('href');
      link.classList.add('invalid-link');
    } else {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  });

  return tempDiv.innerHTML;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function PolicyPage({ pageKey }) {
  const [page,    setPage]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSitePage(pageKey)
      .then(({ data }) => {
        if (!cancelled) setPage(data);
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load this page. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [pageKey]);

  // Keep browser tab title in sync
  useEffect(() => {
    if (page?.title) document.title = `${page.title} — Selvedge Atelier`;
  }, [page?.title]);

  // Sanitize content when page loads
  const safeHtml = React.useMemo(() => {
    return page?.content ? sanitizePolicyHtml(page.content) : '';
  }, [page?.content]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 border-b border-gray-100"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              {loading ? (
                <span className="inline-block w-64 h-10 bg-gray-200 rounded animate-pulse" />
              ) : (
                page?.title || 'Policy'
              )}
            </h1>
            {/* Decorative orange star — only shown when content is loaded */}
            {!loading && (
              <StarIcon className="w-7 h-7 text-orange-500 shrink-0 mt-1" />
            )}
          </div>
        </motion.div>

        {/* ── Content area ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
        >
          {loading && <PolicySkeleton />}

          {!loading && error && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-6 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && !safeHtml && (
            <EmptyContent title={page?.title || 'This page'} />
          )}

          {!loading && !error && safeHtml && (
            <div
              className="policy-content"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          )}

          {/* ── Last updated notice ─────────────────────────────────────── */}
          {!loading && !error && page?.updatedAt && (
            <p className="mt-12 text-xs text-gray-400 border-t border-gray-100 pt-4">
              Last updated:{' '}
              {new Date(page.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}