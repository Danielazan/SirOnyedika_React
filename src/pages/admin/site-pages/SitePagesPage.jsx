// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FileText, Bold, Italic, Underline, List, ListOrdered,
//   Heading2, Heading3, Eye, Edit3, Save, RefreshCw, CheckCircle,
//   AlertCircle, ChevronRight, Info,
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

// // ── CSS styles for editor and preview content ────────────────────────────────
// const editorStyles = `
//   .editor-content h2 {
//     font-size: 1.25rem;
//     font-weight: 700;
//     color: #111827;
//     margin-top: 1.5rem;
//     margin-bottom: 0.75rem;
//     line-height: 1.3;
//     display: block;
//   }
//   .editor-content h3 {
//     font-size: 1.125rem;
//     font-weight: 600;
//     color: #1f2937;
//     margin-top: 1.25rem;
//     margin-bottom: 0.5rem;
//     line-height: 1.3;
//     display: block;
//   }
//   .editor-content p {
//     margin-bottom: 1rem;
//     display: block;
//   }
//   .editor-content p:empty {
//     display: none;
//   }
//   .editor-content ul {
//     list-style-type: disc;
//     padding-left: 1.5rem;
//     margin-bottom: 1rem;
//     display: block;
//   }
//   .editor-content ol {
//     list-style-type: decimal;
//     padding-left: 1.5rem;
//     margin-bottom: 1rem;
//     display: block;
//   }
//   .editor-content li {
//     margin-bottom: 0.375rem;
//     display: list-item;
//   }
//   .editor-content strong,
//   .editor-content b {
//     font-weight: 600;
//     color: #111827;
//   }
//   .editor-content em,
//   .editor-content i {
//     font-style: italic;
//   }
//   .editor-content u {
//     text-decoration: underline;
//     text-decoration-color: #AE3E27;
//     text-underline-offset: 2px;
//   }
//   .editor-content a {
//     color: #AE3E27;
//     text-decoration: underline;
//   }
//   .editor-content hr {
//     border: none;
//     border-top: 1px solid #e5e7eb;
//     margin: 1.5rem 0;
//   }
//   .editor-content blockquote {
//     border-left: 3px solid #AE3E27;
//     padding-left: 1rem;
//     margin: 1rem 0;
//     color: #6b7280;
//     font-style: italic;
//   }
// `;

// // ── Normalize Word paste HTML into clean semantic HTML ────────────────────
// function normalizeWordHtml(html) {
//   if (!html) return '';

//   const temp = document.createElement('div');
//   temp.innerHTML = html;

//   // Remove all style attributes and classes
//   temp.querySelectorAll('*').forEach((el) => {
//     el.removeAttribute('style');
//     el.removeAttribute('class');
//   });

//   // Convert Word's <b>/<strong> that look like headings to <h2>/<h3>
//   temp.querySelectorAll('b, strong').forEach((el) => {
//     const text = el.textContent.trim();
//     const parentTag = el.parentElement?.tagName;
//     if (text.length < 80 && parentTag !== 'H2' && parentTag !== 'H3' && parentTag !== 'H1') {
//       const parent = el.parentElement;
//       if (parent && (parent.tagName === 'P' || parent.tagName === 'DIV') && 
//           parent.textContent.trim() === text) {
//         const heading = document.createElement('h3');
//         heading.textContent = text;
//         parent.parentElement.replaceChild(heading, parent);
//       }
//     }
//   });

//   // Unwrap unnecessary spans
//   temp.querySelectorAll('span').forEach((span) => {
//     const parent = span.parentNode;
//     while (span.firstChild) {
//       parent.insertBefore(span.firstChild, span);
//     }
//     parent.removeChild(span);
//   });

//   // Clean up empty elements
//   temp.querySelectorAll('p, div').forEach((el) => {
//     if (!el.textContent.trim() && !el.querySelector('img, br, hr')) {
//       el.remove();
//     }
//   });

//   return temp.innerHTML;
// }

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

// // ── Rich text editor (uncontrolled contentEditable) ────────────────────────
// function RichEditor({ value, onChange }) {
//   const editorRef = useRef(null);

//   // Set initial content when editor mounts
//   useEffect(() => {
//     if (editorRef.current) {
//       editorRef.current.innerHTML = value || '<p><br></p>';
//     }
//   }, []); // Empty deps — only run once on mount

//   const exec = useCallback((command, val = null) => {
//     document.execCommand(command, false, val);
//     editorRef.current?.focus();
//     // Sync state after execCommand
//     const html = editorRef.current?.innerHTML || '';
//     onChange(html);
//   }, [onChange]);

//   const handleInput = () => {
//     if (editorRef.current) {
//       onChange(editorRef.current.innerHTML);
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const clipboardData = e.clipboardData || window.clipboardData;
//     const html = clipboardData.getData('text/html');
//     const text = clipboardData.getData('text/plain');

//     let contentToInsert;
//     if (html) {
//       contentToInsert = normalizeWordHtml(html);
//     } else {
//       const paragraphs = text.split(/\n{2,}/);
//       contentToInsert = paragraphs
//         .map((para) => {
//           const trimmed = para.trim();
//           if (!trimmed) return '';
//           const withBreaks = trimmed.replace(/\n/g, '<br>');
//           return `<p>${withBreaks}</p>`;
//         })
//         .filter(Boolean)
//         .join('');
//     }

//     document.execCommand('insertHTML', false, contentToInsert);
//     handleInput();
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Tab') {
//       e.preventDefault();
//       document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
//       handleInput();
//     }
//   };

//   return (
//     <div className="border border-gray-200 rounded-lg overflow-hidden">
//       {/* Inject editor styles */}
//       <style>{editorStyles}</style>

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
//         onPaste={handlePaste}
//         onKeyDown={handleKeyDown}
//         className="editor-content min-h-[420px] max-h-[600px] overflow-y-auto px-5 py-4 text-sm text-gray-800 leading-relaxed focus:outline-none"
//       />
//     </div>
//   );
// }

// // ── Preview pane ─────────────────────────────────────────────────────────────
// function PreviewPane({ content, title }) {
//   return (
//     <div className="border border-gray-200 rounded-lg overflow-hidden">
//       <style>{editorStyles}</style>
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
//           <div className="editor-content" dangerouslySetInnerHTML={{ __html: content }} />
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
//     saving:  { icon: RefreshCw,    text: 'Saving…',        cls: 'text-[#AE3E27]' },
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
//   const [saveStatus, setSaveStatus] = useState('idle');
//   const [viewMode,   setViewMode]   = useState('edit');
//   const [lastSaved,  setLastSaved]  = useState(null);
//   const [editorKey,  setEditorKey]  = useState(0);

//   useEffect(() => {
//     if (saveStatus === 'success' || saveStatus === 'error') {
//       const t = setTimeout(() => setSaveStatus('idle'), 3000);
//       return () => clearTimeout(t);
//     }
//   }, [saveStatus]);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     setViewMode('edit');
//     setEditorKey((k) => k + 1);

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
//             {viewMode === 'edit' ? 'Page Content' : 'Preview'}
//           </label>

//           {loading ? (
//             <div className="border border-gray-200 rounded-lg min-h-[420px] flex items-center justify-center">
//               <div className="flex flex-col items-center gap-3 text-gray-400">
//                 <RefreshCw size={22} className="animate-spin text-[#AE3E27]" />
//                 <span className="text-sm">Loading content…</span>
//               </div>
//             </div>
//           ) : viewMode === 'edit' ? (
//             <RichEditor key={editorKey} value={content} onChange={setContent} />
//           ) : (
//             <PreviewPane content={content} title={pageTitle} />
//           )}
//         </div>

//         {viewMode === 'edit' && !loading && (
//           <div className="flex items-start gap-2 px-1">
//             <Info size={14} className="text-[#AE3E27] shrink-0 mt-0.5" />
//             <p className="text-xs text-gray-400 leading-relaxed">
//               <strong className="text-gray-600">Paste from Word:</strong> Content pasted from Microsoft Word
//               will be automatically cleaned and converted to semantic HTML (headings, lists, paragraphs).
//               Use the toolbar above for manual formatting.
//             </p>
//           </div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// }

SitePagesPage.jsx
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

// ── CSS styles for editor and preview content ────────────────────────────────
const editorStyles = `
  /* FIX: Reset inherited letter-spacing and word-spacing */
  .editor-content {
    letter-spacing: normal !important;
    word-spacing: normal !important;
  }

  .editor-content h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
    display: block;
  }
  .editor-content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
    line-height: 1.3;
    display: block;
  }
  .editor-content p {
    margin-bottom: 1rem;
    display: block;
  }
  .editor-content p:empty {
    display: none;
  }
  .editor-content ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    display: block;
  }
  .editor-content ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    display: block;
  }
  .editor-content li {
    margin-bottom: 0.375rem;
    display: list-item;
  }
  .editor-content strong,
  .editor-content b {
    font-weight: 600;
    color: #111827;
  }
  .editor-content em,
  .editor-content i {
    font-style: italic;
  }
  .editor-content u {
    text-decoration: underline;
    text-decoration-color: #AE3E27;
    text-underline-offset: 2px;
  }
  .editor-content a {
    color: #AE3E27;
    text-decoration: underline;
  }
  .editor-content hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 1.5rem 0;
  }
  .editor-content blockquote {
    border-left: 3px solid #AE3E27;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #6b7280;
    font-style: italic;
  }
`;

// ── Normalize Word paste HTML into clean semantic HTML ────────────────────
function normalizeWordHtml(html) {
  if (!html) return '';

  const temp = document.createElement('div');
  temp.innerHTML = html;

  // ── Strip Word-specific style properties and class names only ──────────
  // We do NOT remove all styles/classes — that strips legitimate formatting
  // (bold, italic, etc.) that Word encodes inline.
  // Only remove mso-* CSS properties and Word class names (MsoNormal, etc).
  temp.querySelectorAll('*').forEach((el) => {
    const cls = el.getAttribute('class') || '';
    if (/\bMso/i.test(cls)) el.removeAttribute('class');

    const style = el.getAttribute('style') || '';
    if (style) {
      const cleaned = style
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s && !/^mso-/i.test(s))
        .join('; ');
      if (cleaned) el.setAttribute('style', cleaned);
      else el.removeAttribute('style');
    }
  });

  // ── Do NOT auto-promote bold text to headings ──────────────────────────
  // Word uses bold paragraphs for sub-headings like "Before Fulfilment",
  // "Return Shipping", etc. These are intentionally bold text, not semantic
  // headings. Auto-promoting them to <h3> produces wrong output.
  // Admins can use the H2/H3 toolbar buttons if a real heading is needed.

  // ── Unwrap spans that carry no meaningful style after mso cleanup ──────
  temp.querySelectorAll('span').forEach((span) => {
    const style = span.getAttribute('style') || '';
    const hasClass = span.hasAttribute('class');
    if (!style && !hasClass) {
      const parent = span.parentNode;
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
    }
  });

  // ── Remove truly empty block elements ─────────────────────────────────
  temp.querySelectorAll('p, div').forEach((el) => {
    if (!el.textContent.trim() && !el.querySelector('img, br, hr')) {
      el.remove();
    }
  });

  return temp.innerHTML;
}

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

// ── Rich text editor (uncontrolled contentEditable) ────────────────────────
function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);

  // FIX: Hydrate editor when value arrives from API (not just on mount)
  const hasHydrated = useRef(false);
  useEffect(() => {
    if (editorRef.current && value && !hasHydrated.current) {
      editorRef.current.innerHTML = value;
      hasHydrated.current = true;
    }
  }, [value]); // ← responds to API data arriving after mount

  const exec = useCallback((command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    // Sync state after execCommand
    const html = editorRef.current?.innerHTML || '';
    onChange(html);
  }, [onChange]);

  // clearFormat: removes BOTH inline formatting (bold, italic, underline)
  // AND block-level formatting (h2, h3 → p).
  // execCommand('removeFormat') only handles inline — it cannot change block tags.
  const clearFormat = useCallback(() => {
    // Step 1: strip inline formatting via execCommand
    document.execCommand('removeFormat', false, null);

    // Step 2: convert any heading block that intersects the selection to <p>
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      editorRef.current?.focus();
      onChange(editorRef.current?.innerHTML || '');
      return;
    }

    const range = selection.getRangeAt(0);
    const editor = editorRef.current;
    if (!editor) return;

    // Collect all heading nodes inside the editor that overlap the selection
    const headings = Array.from(editor.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    headings.forEach((heading) => {
      const headingRange = document.createRange();
      headingRange.selectNode(heading);
      if (
        range.compareBoundaryPoints(Range.END_TO_START, headingRange) <= 0 &&
        range.compareBoundaryPoints(Range.START_TO_END, headingRange) >= 0
      ) {
        const p = document.createElement('p');
        p.innerHTML = heading.innerHTML;
        heading.parentNode.replaceChild(p, heading);
      }
    });

    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');

    let contentToInsert;
    if (html) {
      contentToInsert = normalizeWordHtml(html);
    } else {
      const paragraphs = text.split(/\n{2,}/);
      contentToInsert = paragraphs
        .map((para) => {
          const trimmed = para.trim();
          if (!trimmed) return '';
          const withBreaks = trimmed.replace(/\n/g, '<br>');
          return `<p>${withBreaks}</p>`;
        })
        .filter(Boolean)
        .join('');
    }

    document.execCommand('insertHTML', false, contentToInsert);
    handleInput();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      handleInput();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Inject editor styles */}
      <style>{editorStyles}</style>

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

        <ToolbarBtn onClick={clearFormat} title="Clear formatting (inline + headings)">
          <span className="text-xs font-medium px-0.5">Tx</span>
        </ToolbarBtn>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="editor-content min-h-[420px] max-h-[600px] overflow-y-auto px-5 py-4 text-sm text-gray-800 leading-relaxed focus:outline-none"
      />
    </div>
  );
}

// ── Preview pane ─────────────────────────────────────────────────────────────
function PreviewPane({ content, title }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <style>{editorStyles}</style>
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
          <div className="editor-content" dangerouslySetInnerHTML={{ __html: content }} />
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
    saving:  { icon: RefreshCw,    text: 'Saving\u2026',        cls: 'text-[#AE3E27]' },
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
  const [saveStatus, setSaveStatus] = useState('idle');
  const [viewMode,   setViewMode]   = useState('edit');
  const [lastSaved,  setLastSaved]  = useState(null);
  const [editorKey,  setEditorKey]  = useState(0);

  useEffect(() => {
    if (saveStatus === 'success' || saveStatus === 'error') {
      const t = setTimeout(() => setSaveStatus('idle'), 3000);
      return () => clearTimeout(t);
    }
  }, [saveStatus]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setViewMode('edit');
    setEditorKey((k) => k + 1);

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
                  Last saved:{" "}
                  {lastSaved.toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <SaveStatus status={saveStatus} />

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
                <span className="text-sm">Loading content\u2026</span>
              </div>
            </div>
          ) : viewMode === 'edit' ? (
            <RichEditor key={editorKey} value={content} onChange={setContent} />
          ) : (
            <PreviewPane content={content} title={pageTitle} />
          )}
        </div>

        {viewMode === 'edit' && !loading && (
          <div className="flex items-start gap-2 px-1">
            <Info size={14} className="text-[#AE3E27] shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-600">Paste from Word:</strong> Content pasted from Microsoft Word
              will be automatically cleaned and converted to semantic HTML (headings, lists,
              paragraphs). Use the toolbar above for manual formatting.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}