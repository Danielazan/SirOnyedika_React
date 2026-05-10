// src/components/admin/AdminTopbar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Top header bar: page title left, search + notifications + avatar right.
// Hamburger menu shown on mobile to open the sidebar drawer.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, Bell, MessageSquare } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextInput from '../ui/TextInput';

const PAGE_TITLES = {
  '/admin':            'Dashboard',
  '/admin/orders':     'Orders',
  '/admin/products':   'Products',
  '/admin/customers':  'Customers',
  '/admin/categories': 'Categories',
  '/admin/flash-sales':'Flash Sales',
  '/admin/messages':   'Messages',
  '/admin/settings':   'Settings',
};

export default function AdminTopbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname] ?? 'Admin';

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-gray-100 shadow-sm"
    >
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-700 p-1 -ml-1 rounded-lg hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Right: search, icons, avatar */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search — hidden on small screens */}
        <div className="hidden sm:block w-48 md:w-64">
          <TextInput
            placeholder="Search"
            leftIcon={Search}
            className="!py-0"
            inputClassName="!py-2 !text-xs bg-gray-50 border-gray-200"
          />
        </div>

        {/* Chat icon */}
        <button
          onClick={() => navigate('/admin/messages')}
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <MessageSquare size={18} />
        </button>

        {/* Bell icon */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-600 ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden cursor-pointer ring-2 ring-orange-200 hover:ring-orange-400 transition-all">
          <img
            src="https://i.pravatar.cc/36?img=10"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </motion.header>
  );
}
