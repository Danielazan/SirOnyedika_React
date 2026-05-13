import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

/**
 * ForbiddenPage — 403 Access Denied screen for admin panel.
 * Shown when an admin tries to access a module or perform an action
 * their sub-role does not permit.
 */
export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md px-6"
      >
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          Your admin role does not have permission to access this area.
          If you believe this is an error, contact your Super Admin.
        </p>

        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
