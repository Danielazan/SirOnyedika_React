// // src/pages/admin/site-pages/SitePagesPage.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Admin — Site Pages / Policy Editor
// //
// // Allows super_admin, ecommerce_manager, and marketing_admin to view and
// // update the HTML content of all five public-facing policy pages.
// //
// // Left panel: policy selector tabs
// // Right panel: page title input + rich text editor + save controls
// //
// // The editor uses a contentEditable div with an execCommand toolbar.
// // Content is saved as raw HTML to the backend via PUT /pages/:key.
// // ─────────────────────────────────────────────────────────────────────────────

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FileText, Bold, Italic, Underline, List, ListOrdered,
//   Heading2, Heading3, Eye, Edit3, Save, RefreshCw, CheckCircle,
//   AlertCircle, ChevronRight,
// } from 'lucide-react';

// import { getSitePage, updateSitePage } from '../../../api/sitepages.api';
// import { containerVariants, itemVariants } from '../../../utils/animation';

// // ── Policy manifest ─────────────────────────────────────────────────────────
// const POLICIES = [
//   {
//     key:         'privacy_policy',
//     label:       'Privacy Policy',
//     description: 'How we collect, use, and protect personal data.',
//   },
//   {
//     key:         'access_control_policy',
//     label:       'Access Control Policy',
//     description: 'Guidelines for granting and managing system access.',
//   },
//   {
//     key:         'refund_cancellation_policy',
//     label:       'Refund & Cancellation Policy',
//     description: 'Order cancellation windows, returns, and refund timelines.',
//   },
//   {
//     key:         'data_retention_policy',
//     label:       'Data Retention Policy',
//     description: 'How long we retain personal data and secure disposal.',
//   },
//   {
//     key:         'terms_conditions',
//     label:       'Terms of Service',
//     description: 'The binding terms governing use of Atelierselvedge.',
//   },
// ];

// // ── Toolbar button ───────────────────────────────────────────────────────────
// function ToolbarBtn({ onClick, title, children, active = false }) {
//   return (
//     <button
//       type="button"
//       onMouseDown={(e) => { e.preventDefault(); onClick(); }}
//       title={title}
//       className={[
//         'p-1.5 rounded transition-colors text-sm',
//         active
//           ? 'bg-[#fce5e0] text-[#8f3320]'
//           : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
//       ].join(' ')}
//     >
//       {children}
//     </button>
//   );
// }

// // ── Rich text editor ─────────────────────────────────────────────────────────
// function RichEditor({ value, onChange }) {
//   const editorRef = useRef(null);

//   // Sync external value → DOM only on page switch (not on every keystroke)
//   const lastKeyRef = useRef(null);
//   useEffect(() => {
//     if (editorRef.current && lastKeyRef.current !== value) {
//       editorRef.current.innerHTML = value || '';
//       lastKeyRef.current = value;
//     }
//   }, [value]);

//   const exec = useCallback((command, val = null) => {
//     document.execCommand(command, false, val);
//     editorRef.current?.focus();
//   }, []);

//   const handleInput = () => {
//     if (editorRef.current) {
//       onChange(editorRef.current.innerHTML);
//     }
//   };

//   return (
//     <div className="border border-gray-200 rounded-lg overflow-hidden">
//       {/* Toolbar */}
//       <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
//         <ToolbarBtn onClick={() => exec('bold')}      title="Bold (Ctrl+B)">
//           <Bold size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('italic')}    title="Italic (Ctrl+I)">
//           <Italic size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('underline')} title="Underline (Ctrl+U)">
//           <Underline size={14} />
//         </ToolbarBtn>

//         <span className="w-px h-4 bg-gray-200 mx-1" />

//         <ToolbarBtn onClick={() => exec('formatBlock', 'h2')} title="Heading 2">
//           <Heading2 size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'h3')} title="Heading 3">
//           <Heading3 size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('formatBlock', 'p')}  title="Paragraph">
//           <span className="text-xs font-medium px-0.5">P</span>
//         </ToolbarBtn>

//         <span className="w-px h-4 bg-gray-200 mx-1" />

//         <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bullet list">
//           <List size={14} />
//         </ToolbarBtn>
//         <ToolbarBtn onClick={() => exec('insertOrderedList')}   title="Numbered list">
//           <ListOrdered size={14} />
//         </ToolbarBtn>

//         <span className="w-px h-4 bg-gray-200 mx-1" />

//         <ToolbarBtn onClick={() => exec('removeFormat')} title="Clear formatting">
//           <span className="text-xs font-medium px-0.5">Tx</span>
//         </ToolbarBtn>
//       </div>

//       {/* Editable area */}
//       <div
//         ref={editorRef}
//         contentEditable
//         suppressContentEditableWarning
//         onInput={handleInput}
//         className="
//           min-h-[420px] max-h-[600px] overflow-y-auto
//           px-5 py-4 text-sm text-gray-800 leading-relaxed
//           focus:outline-none

//           [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-2
//           [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-1
//           [&_p]:mb-3
//           [&_ul]:list-disc  [&_ul]:pl-6 [&_ul]:mb-3
//           [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
//           [&_strong]:font-semibold
//           [&_a]:text-[#AE3E27] [&_a]:underline
//         "
//       />
//     </div>
//   );
// }

// // ── Preview pane ─────────────────────────────────────────────────────────────
// function PreviewPane({ content, title }) {
//   return (
//     <div className="border border-gray-200 rounded-lg overflow-hidden">
//       <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
//         <span className="text-xs text-gray-500 font-medium">Preview — public view</span>
//       </div>
//       <div className="px-5 py-5 min-h-[420px] max-h-[600px] overflow-y-auto bg-white">
//         {title && (
//           <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
//             {title}
//           </h1>
//         )}
//         {content ? (
//           <div
//             className="
//               text-sm text-gray-700 leading-relaxed
//               [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-2
//               [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-1
//               [&_p]:mb-3
//               [&_ul]:list-disc  [&_ul]:pl-6 [&_ul]:mb-3
//               [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
//               [&_strong]:font-semibold
//               [&_a]:text-[#AE3E27] [&_a]:underline
//             "
//             dangerouslySetInnerHTML={{ __html: content }}
//           />
//         ) : (
//           <p className="text-gray-300 text-sm italic">Nothing to preview yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// // ── Save status badge ────────────────────────────────────────────────────────
// function SaveStatus({ status }) {
//   if (status === 'idle') return null;

//   const map = {
//     saving:  { icon: RefreshCw,    text: 'Saving…',        cls: 'text-[#AE3E27] animate-spin' },
//     success: { icon: CheckCircle,  text: 'Saved!',         cls: 'text-green-600' },
//     error:   { icon: AlertCircle,  text: 'Save failed',    cls: 'text-red-600' },
//   };
//   const { icon: Icon, text, cls } = map[status];

//   return (
//     <AnimatePresence>
//       <motion.span
//         key={status}
//         initial={{ opacity: 0, y: 4 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0 }}
//         className={`inline-flex items-center gap-1.5 text-sm font-medium ${cls}`}
//       >
//         <Icon size={14} className={status === 'saving' ? 'animate-spin' : ''} />
//         {text}
//       </motion.span>
//     </AnimatePresence>
//   );
// }

// // ── Main page ────────────────────────────────────────────────────────────────
// export default function SitePagesPage() {
//   const [activeKey,  setActiveKey]  = useState(POLICIES[0].key);
//   const [pageTitle,  setPageTitle]  = useState('');
//   const [content,    setContent]    = useState('');
//   const [loading,    setLoading]    = useState(false);
//   const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'success' | 'error'
//   const [viewMode,   setViewMode]   = useState('edit'); // 'edit' | 'preview'
//   const [lastSaved,  setLastSaved]  = useState(null);

//   // Reset status after 3 seconds
//   useEffect(() => {
//     if (saveStatus === 'success' || saveStatus === 'error') {
//       const t = setTimeout(() => setSaveStatus('idle'), 3000);
//       return () => clearTimeout(t);
//     }
//   }, [saveStatus]);

//   // Fetch page whenever the active tab changes
//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     setViewMode('edit');

//     getSitePage(activeKey)
//       .then(({ data }) => {
//         if (cancelled) return;
//         setPageTitle(data.title   || '');
//         setContent(  data.content || '');
//         setLastSaved(data.updatedAt ? new Date(data.updatedAt) : null);
//       })
//       .catch(() => {
//         if (!cancelled) {
//           setPageTitle('');
//           setContent('');
//         }
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => { cancelled = true; };
//   }, [activeKey]);

//   const handleSave = async () => {
//     setSaveStatus('saving');
//     try {
//       await updateSitePage(activeKey, { title: pageTitle, content });
//       setSaveStatus('success');
//       setLastSaved(new Date());
//     } catch {
//       setSaveStatus('error');
//     }
//   };

//   const activePolicy = POLICIES.find((p) => p.key === activeKey);

//   return (
//     <motion.div
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       className="flex gap-6 h-full"
//     >
//       {/* ── Left panel: policy tabs ──────────────────────────────────── */}
//       <motion.aside
//         variants={itemVariants}
//         className="w-64 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm self-start"
//       >
//         <div className="px-4 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <FileText size={16} className="text-[#AE3E27]" />
//             <h2 className="text-sm font-semibold text-gray-800">Policy Pages</h2>
//           </div>
//           <p className="text-xs text-gray-400 mt-0.5">Select a page to edit</p>
//         </div>

//         <nav className="py-2">
//           {POLICIES.map((policy) => (
//             <button
//               key={policy.key}
//               onClick={() => setActiveKey(policy.key)}
//               className={[
//                 'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 group',
//                 activeKey === policy.key
//                   ? 'bg-[#fdf2f0] border-r-2 border-[#AE3E27]'
//                   : 'hover:bg-gray-50',
//               ].join(' ')}
//             >
//               <div className="flex-1 min-w-0">
//                 <p className={[
//                   'text-sm font-medium truncate',
//                   activeKey === policy.key ? 'text-[#8f3320]' : 'text-gray-700',
//                 ].join(' ')}>
//                   {policy.label}
//                 </p>
//                 <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-snug">
//                   {policy.description}
//                 </p>
//               </div>
//               <ChevronRight
//                 size={14}
//                 className={[
//                   'shrink-0 mt-0.5 transition-colors',
//                   activeKey === policy.key ? 'text-[#AE3E27]' : 'text-gray-300',
//                 ].join(' ')}
//               />
//             </button>
//           ))}
//         </nav>
//       </motion.aside>

//       {/* ── Right panel: editor ──────────────────────────────────────── */}
//       <motion.div variants={itemVariants} className="flex-1 min-w-0 space-y-4">

//         {/* Header card */}
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
//           <div className="flex items-center justify-between gap-4 flex-wrap">
//             <div>
//               <h1 className="text-base font-semibold text-gray-900">
//                 {activePolicy?.label}
//               </h1>
//               {lastSaved && (
//                 <p className="text-xs text-gray-400 mt-0.5">
//                   Last saved:{' '}
//                   {lastSaved.toLocaleDateString('en-US', {
//                     year: 'numeric', month: 'short', day: 'numeric',
//                     hour: '2-digit', minute: '2-digit',
//                   })}
//                 </p>
//               )}
//             </div>

//             <div className="flex items-center gap-3">
//               <SaveStatus status={saveStatus} />

//               {/* Edit / Preview toggle */}
//               <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm">
//                 <button
//                   onClick={() => setViewMode('edit')}
//                   className={[
//                     'px-3 py-1.5 flex items-center gap-1.5 transition-colors',
//                     viewMode === 'edit'
//                       ? 'bg-gray-900 text-white'
//                       : 'text-gray-600 hover:bg-gray-50',
//                   ].join(' ')}
//                 >
//                   <Edit3 size={13} /> Edit
//                 </button>
//                 <button
//                   onClick={() => setViewMode('preview')}
//                   className={[
//                     'px-3 py-1.5 flex items-center gap-1.5 transition-colors',
//                     viewMode === 'preview'
//                       ? 'bg-gray-900 text-white'
//                       : 'text-gray-600 hover:bg-gray-50',
//                   ].join(' ')}
//                 >
//                   <Eye size={13} /> Preview
//                 </button>
//               </div>

//               {/* Save button */}
//               <button
//                 onClick={handleSave}
//                 disabled={saveStatus === 'saving' || loading}
//                 className="flex items-center gap-2 bg-[#AE3E27] hover:bg-[#8f3320] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
//               >
//                 <Save size={14} />
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Title input */}
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
//           <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//             Page Title
//           </label>
//           {loading ? (
//             <div className="h-9 bg-gray-100 rounded animate-pulse" />
//           ) : (
//             <input
//               type="text"
//               value={pageTitle}
//               onChange={(e) => setPageTitle(e.target.value)}
//               placeholder="Enter page title..."
//               className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/30 focus:border-[#AE3E27] transition-colors"
//             />
//           )}
//         </div>

//         {/* Editor / Preview */}
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
//           <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//             {viewMode === 'edit' ? 'Page Content (HTML)' : 'Preview'}
//           </label>

//           {loading ? (
//             <div className="border border-gray-200 rounded-lg min-h-[420px] flex items-center justify-center">
//               <div className="flex flex-col items-center gap-3 text-gray-400">
//                 <RefreshCw size={22} className="animate-spin text-[#AE3E27]" />
//                 <span className="text-sm">Loading content…</span>
//               </div>
//             </div>
//           ) : viewMode === 'edit' ? (
//             <RichEditor value={content} onChange={setContent} />
//           ) : (
//             <PreviewPane content={content} title={pageTitle} />
//           )}
//         </div>

//         {/* HTML hint */}
//         {viewMode === 'edit' && !loading && (
//           <p className="text-xs text-gray-400 px-1">
//             Content is stored as HTML. Use the toolbar for formatting, or paste directly
//             from Word/Google Docs and the browser will convert it automatically.
//           </p>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// }

// src/pages/admin/site-pages/SitePagesPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin — Site Pages / Policy Editor
//
// Allows super_admin, ecommerce_manager, and marketing_admin to view and
// update the HTML content of all five public-facing policy pages.
//
// Left panel: policy selector tabs
// Right panel: page title input + rich text editor + save controls
//
// The editor uses a contentEditable div with an execCommand toolbar.
// Content is saved as raw HTML to the backend via PUT /pages/:key.
//
// NOTE: The backend now auto-formats plain text into semantic HTML
// (headings, lists, paragraphs) if no HTML tags are detected.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Bold, Italic, Underline, List, ListOrdered,
  Heading2, Heading3, Eye, Edit3, Save, RefreshCw, CheckCircle,
  AlertCircle, ChevronRight, Info,
} from 'lucide-react';

import { getSitePage, updateSitePage } from '../../../api/sitepages.api';
import { containerVariants, itemVariants } from '../../../utils/animation';

// ── Policy manifest ─────────────────────────────────────────────────────────
const POLICIES = [
  {
    key:         'privacy_policy',
    label:       'Privacy Policy',
    description: 'How we collect, use, and protect personal data.',
  },
  {
    key:         'access_control_policy',
    label:       'Access Control Policy',
    description: 'Guidelines for granting and managing system access.',
  },
  {
    key:         'refund_cancellation_policy',
    label:       'Refund & Cancellation Policy',
    description: 'Order cancellation windows, returns, and refund timelines.',
  },
  {
    key:         'data_retention_policy',
    label:       'Data Retention Policy',
    description: 'How long we retain personal data and secure disposal.',
  },
  {
    key:         'terms_conditions',
    label:       'Terms of Service',
    description: 'The binding terms governing use of Atelierselvedge.',
  },
];

// ── Toolbar button ───────────────────────────────────────────────────────────
function ToolbarBtn({ onClick, title, children, active = false }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={[
        'p-1.5 rounded transition-colors text-sm',
        active
          ? 'bg-[#fce5e0] text-[#8f3320]'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

// ── Rich text editor ─────────────────────────────────────────────────────────
function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);

  // Sync external value → DOM only on page switch (not on every keystroke)
  const lastKeyRef = useRef(null);
  useEffect(() => {
    if (editorRef.current && lastKeyRef.current !== value) {
      editorRef.current.innerHTML = value || '';
      lastKeyRef.current = value;
    }
  }, [value]);

  const exec = useCallback((command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <ToolbarBtn onClick={() => exec('bold')}      title="Bold (Ctrl+B)">
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('italic')}    title="Italic (Ctrl+I)">
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('underline')} title="Underline (Ctrl+U)">
          <Underline size={14} />
        </ToolbarBtn>

        <span className="w-px h-4 bg-gray-200 mx-1" />

        <ToolbarBtn onClick={() => exec('formatBlock', 'h2')} title="Heading 2">
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'h3')} title="Heading 3">
          <Heading3 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'p')}  title="Paragraph">
          <span className="text-xs font-medium px-0.5">P</span>
        </ToolbarBtn>

        <span className="w-px h-4 bg-gray-200 mx-1" />

        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bullet list">
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')}   title="Numbered list">
          <ListOrdered size={14} />
        </ToolbarBtn>

        <span className="w-px h-4 bg-gray-200 mx-1" />

        <ToolbarBtn onClick={() => exec('removeFormat')} title="Clear formatting">
          <span className="text-xs font-medium px-0.5">Tx</span>
        </ToolbarBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="
          min-h-[420px] max-h-[600px] overflow-y-auto
          px-5 py-4 text-sm text-gray-800 leading-relaxed
          focus:outline-none

          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-2
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-4 [&_h3]:mb-1
          [&_p]:mb-3
          [&_ul]:list-disc  [&_ul]:pl-6 [&_ul]:mb-3
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
          [&_strong]:font-semibold
          [&_a]:text-[#AE3E27] [&_a]:underline
        "
      />
    </div>
  );
}

// ── Preview pane (now matches public page styling) ──────────────────────────
function PreviewPane({ content, title }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <span className="text-xs text-gray-500 font-medium">Preview — public view</span>
      </div>
      <div className="px-5 py-5 min-h-[420px] max-h-[600px] overflow-y-auto bg-white">
        {title && (
          <h1 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
            {title}
          </h1>
        )}
        {content ? (
          <div
            className="policy-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-gray-300 text-sm italic">Nothing to preview yet.</p>
        )}
      </div>
    </div>
  );
}

// ── Save status badge ────────────────────────────────────────────────────────
function SaveStatus({ status }) {
  if (status === 'idle') return null;

  const map = {
    saving:  { icon: RefreshCw,    text: 'Saving…',        cls: 'text-[#AE3E27] animate-spin' },
    success: { icon: CheckCircle,  text: 'Saved!',         cls: 'text-green-600' },
    error:   { icon: AlertCircle,  text: 'Save failed',    cls: 'text-red-600' },
  };
  const { icon: Icon, text, cls } = map[status];

  return (
    <AnimatePresence>
      <motion.span
        key={status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`inline-flex items-center gap-1.5 text-sm font-medium ${cls}`}
      >
        <Icon size={14} className={status === 'saving' ? 'animate-spin' : ''} />
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function SitePagesPage() {
  const [activeKey,  setActiveKey]  = useState(POLICIES[0].key);
  const [pageTitle,  setPageTitle]  = useState('');
  const [content,    setContent]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'success' | 'error'
  const [viewMode,   setViewMode]   = useState('edit'); // 'edit' | 'preview'
  const [lastSaved,  setLastSaved]  = useState(null);

  // Reset status after 3 seconds
  useEffect(() => {
    if (saveStatus === 'success' || saveStatus === 'error') {
      const t = setTimeout(() => setSaveStatus('idle'), 3000);
      return () => clearTimeout(t);
    }
  }, [saveStatus]);

  // Fetch page whenever the active tab changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setViewMode('edit');

    getSitePage(activeKey)
      .then(({ data }) => {
        if (cancelled) return;
        setPageTitle(data.title   || '');
        setContent(  data.content || '');
        setLastSaved(data.updatedAt ? new Date(data.updatedAt) : null);
      })
      .catch(() => {
        if (!cancelled) {
          setPageTitle('');
          setContent('');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeKey]);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await updateSitePage(activeKey, { title: pageTitle, content });
      setSaveStatus('success');
      setLastSaved(new Date());
    } catch {
      setSaveStatus('error');
    }
  };

  const activePolicy = POLICIES.find((p) => p.key === activeKey);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex gap-6 h-full"
    >
      {/* ── Left panel: policy tabs ──────────────────────────────────── */}
      <motion.aside
        variants={itemVariants}
        className="w-64 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm self-start"
      >
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#AE3E27]" />
            <h2 className="text-sm font-semibold text-gray-800">Policy Pages</h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Select a page to edit</p>
        </div>

        <nav className="py-2">
          {POLICIES.map((policy) => (
            <button
              key={policy.key}
              onClick={() => setActiveKey(policy.key)}
              className={[
                'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 group',
                activeKey === policy.key
                  ? 'bg-[#fdf2f0] border-r-2 border-[#AE3E27]'
                  : 'hover:bg-gray-50',
              ].join(' ')}
            >
              <div className="flex-1 min-w-0">
                <p className={[
                  'text-sm font-medium truncate',
                  activeKey === policy.key ? 'text-[#8f3320]' : 'text-gray-700',
                ].join(' ')}>
                  {policy.label}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-snug">
                  {policy.description}
                </p>
              </div>
              <ChevronRight
                size={14}
                className={[
                  'shrink-0 mt-0.5 transition-colors',
                  activeKey === policy.key ? 'text-[#AE3E27]' : 'text-gray-300',
                ].join(' ')}
              />
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* ── Right panel: editor ──────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex-1 min-w-0 space-y-4">

        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-base font-semibold text-gray-900">
                {activePolicy?.label}
              </h1>
              {lastSaved && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Last saved:{' '}
                  {lastSaved.toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <SaveStatus status={saveStatus} />

              {/* Edit / Preview toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm">
                <button
                  onClick={() => setViewMode('edit')}
                  className={[
                    'px-3 py-1.5 flex items-center gap-1.5 transition-colors',
                    viewMode === 'edit'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-50',
                  ].join(' ')}
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={[
                    'px-3 py-1.5 flex items-center gap-1.5 transition-colors',
                    viewMode === 'preview'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-50',
                  ].join(' ')}
                >
                  <Eye size={13} /> Preview
                </button>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving' || loading}
                className="flex items-center gap-2 bg-[#AE3E27] hover:bg-[#8f3320] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Save size={14} />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Title input */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Page Title
          </label>
          {loading ? (
            <div className="h-9 bg-gray-100 rounded animate-pulse" />
          ) : (
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Enter page title..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/30 focus:border-[#AE3E27] transition-colors"
            />
          )}
        </div>

        {/* Editor / Preview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {viewMode === 'edit' ? 'Page Content' : 'Preview'}
          </label>

          {loading ? (
            <div className="border border-gray-200 rounded-lg min-h-[420px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-gray-400">
                <RefreshCw size={22} className="animate-spin text-[#AE3E27]" />
                <span className="text-sm">Loading content…</span>
              </div>
            </div>
          ) : viewMode === 'edit' ? (
            <RichEditor value={content} onChange={setContent} />
          ) : (
            <PreviewPane content={content} title={pageTitle} />
          )}
        </div>

        {/* Auto-format info note */}
        {viewMode === 'edit' && !loading && (
          <div className="flex items-start gap-2 px-1">
            <Info size={14} className="text-[#AE3E27] shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-600">Auto-format enabled:</strong> If you type or paste plain text
              (no HTML tags), the backend will automatically detect headings, lists, paragraphs, emails,
              and URLs and convert them into properly formatted HTML. Use the toolbar above if you want
              to write raw HTML manually.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}