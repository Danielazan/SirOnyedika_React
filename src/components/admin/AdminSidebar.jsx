// // src/components/admin/AdminSidebar.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Sidebar navigation for the admin panel.
// // On mobile it slides in as a drawer. On desktop it is always visible.
// // Active route highlighted with orange left border + tinted background.
// // Logo click → navigates to the public landing page (/).
// // NOW WITH ROLE-BASED FILTERING — only shows items the admin is allowed to see.
// // ─────────────────────────────────────────────────────────────────────────────

// import React from 'react';
// import { NavLink, Link, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   LayoutDashboard,
//   ShoppingCart,
//   Package,
//   Users,
//   Tag,
//   Zap,
//   MessageSquare,
//   Settings,
//   X,
//   UserCog,
// } from 'lucide-react';
// import { usePermissions } from '../../hooks/auth/usePermissions';

// const NAV_ITEMS = [
//   { label: 'Dashboard',       path: '/admin',                 icon: LayoutDashboard, module: 'dashboard' },
//   { label: 'Orders',          path: '/admin/orders',          icon: ShoppingCart,    module: 'orders' },
//   { label: 'Products',        path: '/admin/products',        icon: Package,         module: 'products' },
//   { label: 'Customers',       path: '/admin/customers',       icon: Users,           module: 'customers' },
//   { label: 'Categories',      path: '/admin/categories',      icon: Tag,             module: 'categories' },
//   { label: 'Flash Sales',     path: '/admin/flash-sales',     icon: Zap,             module: 'flash-sales' },
//   { label: 'Messages',        path: '/admin/messages',        icon: MessageSquare,   module: 'messages' },
//   { label: 'User Management', path: '/admin/user-management', icon: UserCog,         module: 'user-management' },
//   { label: 'Settings',        path: '/admin/settings',        icon: Settings,        module: 'settings' },
// ];

// function SidebarContent({ onClose }) {
//   const location = useLocation();
//   const { canAccess } = usePermissions();

//   // Filter nav items by the current admin's sub-role
//   const visibleItems = NAV_ITEMS.filter(({ module }) => canAccess(module));

//   return (
//     <div className="flex flex-col h-full bg-white">
//       {/* Logo — clickable, routes to public landing page */}
//       <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
//         <Link
//           to="/"
//           onClick={onClose}
//           className="flex items-center gap-2 hover:opacity-80 transition-opacity"
//           title="Back to store"
//         >
//           <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center">
//             <span className="text-white font-bold text-base">F</span>
//           </div>
//           <span className="text-xl font-bold text-gray-900 tracking-tight">Fashly</span>
//         </Link>
//         {/* Close button — mobile only */}
//         {onClose && (
//           <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
//             <X size={20} />
//           </button>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
//         {visibleItems.map(({ label, path, icon: Icon }) => {
//           // Exact match for dashboard to avoid highlighting on sub-routes
//           const isActive =
//             path === '/admin'
//               ? location.pathname === '/admin' || location.pathname === '/admin/'
//               : location.pathname.startsWith(path);

//           return (
//             <NavLink
//               key={path}
//               to={path}
//               onClick={onClose}
//               className={[
//                 'flex items-center gap-3.5 px-3 py-3 rounded-lg text-[15px] font-medium transition-all duration-150',
//                 'group relative',
//                 isActive
//                   ? 'bg-orange-50 text-orange-600'
//                   : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
//               ].join(' ')}
//             >
//               {/* Active left border */}
//               {isActive && (
//                 <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-orange-600 rounded-l-full" />
//               )}

//               <Icon
//                 size={20}
//                 className={isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}
//               />
//               <span>{label}</span>
//             </NavLink>
//           );
//         })}
//       </nav>
//     </div>
//   );
// }

// export default function AdminSidebar({ mobileOpen, onClose }) {
//   return (
//     <>
//       {/* Desktop sidebar — always visible ≥ md */}
//       <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-gray-100 bg-white z-20">
//         <SidebarContent />
//       </aside>

//       {/* Mobile drawer */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               key="backdrop"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="fixed inset-0 bg-black/40 z-30 md:hidden"
//               onClick={onClose}
//             />
//             {/* Drawer */}
//             <motion.aside
//               key="drawer"
//               initial={{ x: -260 }}
//               animate={{ x: 0 }}
//               exit={{ x: -260 }}
//               transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//               className="fixed top-0 left-0 h-full w-60 bg-white shadow-xl z-40 md:hidden"
//             >
//               <SidebarContent onClose={onClose} />
//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }


// src/components/admin/AdminSidebar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Sidebar navigation for the admin panel.
// On mobile it slides in as a drawer. On desktop it is always visible.
// Active route highlighted with orange left border + tinted background.
// Logo click → navigates to the public landing page (/).
// Role-based filtering — only shows items the admin is allowed to see.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Tag,
  Zap,
  MessageSquare,
  Settings,
  X,
  UserCog,
  FileText,
} from 'lucide-react';
import { usePermissions } from '../../hooks/auth/usePermissions';

const NAV_ITEMS = [
  { label: 'Dashboard',       path: '/admin',                 icon: LayoutDashboard, module: 'dashboard'       },
  { label: 'Orders',          path: '/admin/orders',          icon: ShoppingCart,    module: 'orders'          },
  { label: 'Products',        path: '/admin/products',        icon: Package,         module: 'products'        },
  { label: 'Customers',       path: '/admin/customers',       icon: Users,           module: 'customers'       },
  { label: 'Categories',      path: '/admin/categories',      icon: Tag,             module: 'categories'      },
  { label: 'Flash Sales',     path: '/admin/flash-sales',     icon: Zap,             module: 'flash-sales'     },
  { label: 'Messages',        path: '/admin/messages',        icon: MessageSquare,   module: 'messages'        },
  { label: 'Site Pages',      path: '/admin/site-pages',      icon: FileText,        module: 'site-pages'      },
  { label: 'User Management', path: '/admin/user-management', icon: UserCog,         module: 'user-management' },
  { label: 'Settings',        path: '/admin/settings',        icon: Settings,        module: 'settings'        },
];

function SidebarContent({ onClose }) {
  const location = useLocation();
  const { canAccess } = usePermissions();

  const visibleItems = NAV_ITEMS.filter(({ module }) => canAccess(module));

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          title="Back to store"
        >
          <div className="w-9 h-9 rounded-full bg-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-base">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Selvedge</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map(({ label, path, icon: Icon }) => {
          const isActive =
            path === '/admin'
              ? location.pathname === '/admin' || location.pathname === '/admin/'
              : location.pathname.startsWith(path);

          return (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={[
                'flex items-center gap-3.5 px-3 py-3 rounded-lg text-[15px] font-medium transition-all duration-150',
                'group relative',
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
              ].join(' ')}
            >
              {isActive && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-orange-600 rounded-l-full" />
              )}
              <Icon
                size={20}
                className={isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}
              />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default function AdminSidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-gray-100 bg-white z-20">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              onClick={onClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-60 bg-white shadow-xl z-40 md:hidden"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}