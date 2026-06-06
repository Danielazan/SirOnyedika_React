// src/components/product/SubcategoryFilter.jsx
// Exact subcategory sidebar from the design (checkboxes + orange check)

import { motion } from 'framer-motion';

const subcats = [
  { name: 'Dresses', checked: true },
  { name: 'Tops', checked: false },
  { name: 'Skirts', checked: false },
  { name: 'Shoes', checked: false },
];

export default function SubcategoryFilter({ selected, onChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
      <h2 className="font-semibold text-lg mb-5">Subcategory</h2>

      <motion.div className="space-y-4" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
        {subcats.map((item) => (
          <motion.label
            key={item.name}
            className="flex items-center gap-3 cursor-pointer group"
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="checkbox"
              checked={selected.includes(item.name)}
              onChange={() => {
                if (selected.includes(item.name)) {
                  onChange(selected.filter((s) => s !== item.name));
                } else {
                  onChange([...selected, item.name]);
                }
              }}
              className="w-5 h-5 accent-orange-500 border-2 border-gray-300 rounded focus:ring-0"
            />
            <span className="text-gray-700 group-hover:text-[#AE3E27] transition-colors">
              {item.name}
            </span>
          </motion.label>
        ))}
      </motion.div>
    </div>
  );
}