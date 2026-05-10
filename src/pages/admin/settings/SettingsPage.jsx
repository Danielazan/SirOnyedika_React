// src/pages/admin/SettingsPage.jsx
// Placeholder — extend with store/profile settings as needed.

import React      from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../../../utils/animation';

export default function SettingsPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center"
      >
        <p className="text-gray-400 text-sm">Settings page — coming soon.</p>
      </motion.div>
    </motion.div>
  );
}
