// Left sidebar — shows subcategories for the active top-level category.
// Each checkbox toggles that subcategory in/out of the active filter set.
// On mobile it collapses into an accordion.
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const sidebarVariants = {
  hidden:  { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
};

export default function FilterSidebar({
  subcategories = [],       // children of the active top-level category
  activeSubcategories = [], // array of selected subcategory slugs
  onToggle,                 // (slug) => void — flip a subcategory on/off
  onClearAll,               // () => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <div className="flex flex-col gap-1.5">
      {subcategories.map((sub) => {
        const checked = activeSubcategories.includes(sub.slug);
        return (
          <label
            key={sub.id}
            className="flex items-center gap-3 cursor-pointer group py-1 px-1 rounded-lg hover:bg-orange-50 transition-colors"
          >
            {/* Custom checkbox */}
            <span
              className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                checked
                  ? 'bg-[#DA5605] border-[#DA5605]'
                  : 'border-gray-300 group-hover:border-[#DA5605]'
              }`}
              onClick={() => onToggle(sub.slug)}
            >
              {checked && (
                <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span
              onClick={() => onToggle(sub.slug)}
              className={`text-sm transition-colors font-['Poppins'] ${
                checked ? 'text-[#DA5605] font-semibold' : 'text-gray-700'
              }`}
            >
              {sub.name}
            </span>
          </label>
        );
      })}

      {/* Clear all */}
      {activeSubcategories.length > 0 && (
        <button
          onClick={onClearAll}
          className="mt-2 text-xs text-[#DA5605] hover:text-[#c04a04] font-medium underline underline-offset-2 text-left transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-full lg:w-44 flex-shrink-0"
    >
      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-100 p-4 sticky top-28">
        <h3 className="text-sm font-bold text-gray-900 mb-3 font-['Poppins'] uppercase tracking-wide">
          Subcategory
        </h3>
        {subcategories.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No subcategories</p>
        ) : content}
      </div>

      {/* ── Mobile accordion ── */}
      <div className="lg:hidden bg-white rounded-xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="w-full flex items-center justify-between p-4"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-gray-900 font-['Poppins'] uppercase tracking-wide">
            <SlidersHorizontal className="w-4 h-4 text-[#DA5605]" />
            Filter
            {activeSubcategories.length > 0 && (
              <span className="ml-1 bg-[#DA5605] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {activeSubcategories.length}
              </span>
            )}
          </span>
          <motion.div animate={{ rotate: mobileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              key="mobile-filter"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">{content}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
