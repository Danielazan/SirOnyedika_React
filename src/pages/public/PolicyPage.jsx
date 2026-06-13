// import React, { useEffect, useState } from 'react';
// import { motion }                     from 'framer-motion';
// import DOMPurify                      from 'dompurify';
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

// // ── Sanitize and prepare HTML for safe rendering ──────────────────────────
// function sanitizePolicyHtml(rawHtml) {
//   if (!rawHtml) return '';

//   // DOMPurify config: strict allow-list for policy documents
//   const config = {
//     ALLOWED_TAGS: [
//       'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
//       'ul', 'ol', 'li', 'strong', 'em', 'a', 'hr',
//       'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
//       'div', 'span', 'br',
//     ],
//     ALLOWED_ATTR: [
//       'href', 'target', 'rel', 'class', 'id', 'title',
//     ],
//     // Strip all event handlers
//     FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
//   };

//   // First pass: sanitize
//   let clean = DOMPurify.sanitize(rawHtml, config);

//   // Second pass: force all links to target="_blank" + rel="noopener noreferrer nofollow"
//   // and validate href protocols
//   const tempDiv = document.createElement('div');
//   tempDiv.innerHTML = clean;

//   const links = tempDiv.querySelectorAll('a');
//   links.forEach((link) => {
//     const href = link.getAttribute('href') || '';

//     // Validate protocol: only allow http, https, mailto, tel, or relative paths
//     const isValid =
//       /^https?:\/\//.test(href) ||
//       /^mailto:/.test(href) ||
//       /^tel:/.test(href) ||
//       /^\//.test(href) ||
//       href === '';

//     if (!isValid) {
//       // Remove invalid href entirely
//       link.removeAttribute('href');
//       link.classList.add('invalid-link');
//     } else {
//       link.setAttribute('target', '_blank');
//       link.setAttribute('rel', 'noopener noreferrer nofollow');
//     }
//   });

//   return tempDiv.innerHTML;
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
//     if (page?.title) document.title = `${page.title} — Atelierselvedge`;
//   }, [page?.title]);

//   // Sanitize content when page loads
//   const safeHtml = React.useMemo(() => {
//     return page?.content ? sanitizePolicyHtml(page.content) : '';
//   }, [page?.content]);

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
//               <StarIcon className="w-7 h-7 text-[#AE3E27] shrink-0 mt-1" />
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

//           {!loading && !error && !safeHtml && (
//             <EmptyContent title={page?.title || 'This page'} />
//           )}

//           {!loading && !error && safeHtml && (
//             <div
//               className="policy-content"
//               dangerouslySetInnerHTML={{ __html: safeHtml }}
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

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getSitePage } from '../../api/sitepages.api';

// ── Skeleton loader ────────────────────────────────────────────────────────
function PolicySkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-2/3 mb-8" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

// ── Decorative star used next to the page title ────────────────────────────
function StarIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="#AE3E27"
      />
    </svg>
  );
}

// ── Empty state when no content has been saved yet ─────────────────────────
function EmptyContent({ title }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">Content hasn't been published yet. Check back soon.</p>
    </div>
  );
}

// ── Sanitize and prepare HTML for safe rendering ──────────────────────────
function sanitizePolicyHtml(rawHtml) {
  if (!rawHtml) return '';

  const config = {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
      'a', 'hr', 'br', 'sub', 'sup',
      'blockquote', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'id', 'title', 'style',
    ],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseenter'],
    KEEP_CONTENT: true,
  };

  let clean = DOMPurify.sanitize(rawHtml, config);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = clean;

  const links = tempDiv.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href') || '';
    const isValid =
      /^https?:\/\//.test(href) ||
      /^mailto:/.test(href) ||
      /^tel:/.test(href) ||
      /^\//.test(href) ||
      href === '';

    if (!isValid) {
      link.removeAttribute('href');
      link.classList.add('invalid-link');
    } else {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  });

  return tempDiv.innerHTML;
}

// ── Inline styles for policy content (guaranteed to apply) ─────────────────
const policyContentStyles = `
  .policy-content {
    font-size: 1rem;
    line-height: 1.75;
    color: #374151;
  }
  .policy-content h1,
  .policy-content h2,
  .policy-content h3,
  .policy-content h4,
  .policy-content h5,
  .policy-content h6 {
    font-weight: 700;
    color: #111827;
    margin-top: 2rem;
    margin-bottom: 1rem;
    line-height: 1.3;
    display: block;
  }
  .policy-content h1 {
    font-size: 1.875rem;
  }
  .policy-content h2 {
    font-size: 1.5rem;
  }
  .policy-content h3 {
    font-size: 1.25rem;
  }
  .policy-content h4 {
    font-size: 1.125rem;
  }
  .policy-content p {
    margin-bottom: 1.25rem;
    display: block;
  }
  .policy-content p:empty {
    display: none;
  }
  .policy-content ul,
  .policy-content ol {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
    display: block;
  }
  .policy-content ul {
    list-style-type: disc;
  }
  .policy-content ol {
    list-style-type: decimal;
  }
  .policy-content li {
    margin-bottom: 0.5rem;
    display: list-item;
  }
  .policy-content li > ul,
  .policy-content li > ol {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .policy-content strong,
  .policy-content b {
    font-weight: 600;
    color: #111827;
  }
  .policy-content em,
  .policy-content i {
    font-style: italic;
  }
  .policy-content u {
    text-decoration: underline;
    text-decoration-color: #AE3E27;
    text-underline-offset: 2px;
  }
  .policy-content s,
  .policy-content strike {
    text-decoration: line-through;
  }
  .policy-content a {
    color: #AE3E27;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.15s ease;
  }
  .policy-content a:hover {
    color: #8f3320;
  }
  .policy-content a.invalid-link {
    color: #ef4444;
    text-decoration: line-through;
    cursor: not-allowed;
  }
  .policy-content hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 2rem 0;
  }
  .policy-content blockquote {
    border-left: 4px solid #AE3E27;
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: #6b7280;
    font-style: italic;
  }
  .policy-content code {
    background-color: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.875em;
  }
  .policy-content pre {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 1.25rem;
  }
  .policy-content pre code {
    background: none;
    padding: 0;
  }
  .policy-content table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.25rem;
  }
  .policy-content th,
  .policy-content td {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    text-align: left;
  }
  .policy-content th {
    background-color: #f9fafb;
    font-weight: 600;
    color: #111827;
  }
  .policy-content tr:nth-child(even) {
    background-color: #f9fafb;
  }
  .policy-content sup {
    font-size: 0.75em;
    vertical-align: super;
  }
  .policy-content sub {
    font-size: 0.75em;
    vertical-align: sub;
  }
`;

// ── Main component ──────────────────────────────────────────────────────────
export default function PolicyPage({ pageKey }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (page?.title) document.title = `${page.title} — Atelierselvedge`;
  }, [page?.title]);

  const safeHtml = React.useMemo(() => {
    return page?.content ? sanitizePolicyHtml(page.content) : '';
  }, [page?.content]);

  return (
    <div className="min-h-screen bg-white">
      <style>{policyContentStyles}</style>

      <Navbar />

      {/* ── Hero header ──────────────────────────────────────────────── */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 inline-flex items-center gap-3 justify-center"
          >
            {loading ? (
              <span className="inline-block w-48 h-10 bg-gray-200 rounded animate-pulse" />
            ) : (
              <>
                {page?.title || 'Policy'}
                {!loading && <StarIcon className="w-6 h-6 shrink-0" />}
              </>
            )}
          </motion.h1>
        </div>
      </section>

      {/* ── Content area ─────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {loading && <PolicySkeleton />}

          {!loading && error && (
            <div className="text-center py-16">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && !safeHtml && (
            <EmptyContent title={page?.title || 'Policy'} />
          )}

          {!loading && !error && safeHtml && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="policy-content"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          )}

          {/* ── Last updated notice ─────────────────────────────────────── */}
          {!loading && !error && page?.updatedAt && (
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400">
                Last updated:{' '}
                {new Date(page.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}