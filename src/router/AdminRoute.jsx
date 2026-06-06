// // src/router/AdminRoute.jsx
// // ─────────────────────────────────────────────────────────────────────────────
// // All admin routes nested under the AdminLayout.
// // Role-based route guarding — unauthorized admins are redirected to /admin.
// // ─────────────────────────────────────────────────────────────────────────────

// import React, { lazy, Suspense } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useAuth }    from '../contexts/AuthContext';
// import AdminLayout    from '../components/admin/AdminLayout';
// import { canAccessModule } from '../utils/permissions';

// // ── Lazy-loaded admin pages ──────────────────────────────────────────────────
// const DashboardPage      = lazy(() => import('../pages/admin/DashboardPage'));
// const OrdersPage         = lazy(() => import('../pages/admin/orders/OrderDetailPage'));
// const ProductsPage       = lazy(() => import('../pages/admin/products/ProductsPage'));
// const ProductCreatePage  = lazy(() => import('../pages/admin/products/ProductCreatePage'));
// const ProductEditPage    = lazy(() => import('../pages/admin/products/ProductEditPage'));
// const CustomersPage      = lazy(() => import('../pages/admin/customers/CustomersPage'));
// const CategoriesPage     = lazy(() => import('../pages/admin/categories/CategoriesPage'));
// const FlashSalesPage     = lazy(() => import('../pages/admin/flash-sales/FlashSalesPage'));
// const MessagesPage       = lazy(() => import('../pages/admin/messages/MessagesPage'));
// const SitePagesPage      = lazy(() => import('../pages/admin/site-pages/SitePagesPage'));
// const SettingsPage       = lazy(() => import('../pages/admin/settings/SettingsPage'));
// const UserManagementPage = lazy(() => import('../pages/admin/user-management/UserManagementPage'));

// // ── Loading spinner ──────────────────────────────────────────────────────────
// function PageLoader() {
//   return (
//     <div className="flex items-center justify-center h-48">
//       <div className="w-8 h-8 border-2 border-[#AE3E27] border-t-transparent rounded-full animate-spin" />
//     </div>
//   );
// }

// // ── Admin-only protection ────────────────────────────────────────────────────
// function AdminProtectedRoute({ children }) {
//   const { isAuthenticated, loading, isAdmin } = useAuth();
//   const location = useLocation();

//   if (loading) return <PageLoader />;
//   if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
//   if (!isAdmin())       return <Navigate to="/account/profile" replace />;

//   return children;
// }

// /**
//  * RoleGuard — redirects to /admin (dashboard) if the current admin's
//  * sub-role does not have permission for the requested module.
//  */
// function RoleGuard({ module, children }) {
//   const { user, loading } = useAuth();

//   if (loading) return <PageLoader />;

//   const role = user?.adminRole || null;
//   if (!canAccessModule(role, module)) {
//     return <Navigate to="/admin" replace />;
//   }

//   return children;
// }

// // ── Route tree ───────────────────────────────────────────────────────────────
// export default function AdminRoutes() {
//   return (
//     <Suspense fallback={<PageLoader />}>
//       <Routes>
//         <Route
//           path="/admin"
//           element={
//             <AdminProtectedRoute>
//               <AdminLayout />
//             </AdminProtectedRoute>
//           }
//         >
//           {/* Dashboard — accessible to every admin */}
//           <Route index element={<DashboardPage />} />

//           {/* Orders */}
//           <Route path="orders" element={<RoleGuard module="orders"><OrdersPage /></RoleGuard>} />

//           {/* Products */}
//           <Route path="products"          element={<RoleGuard module="products"><ProductsPage /></RoleGuard>} />
//           <Route path="products/create"   element={<RoleGuard module="products"><ProductCreatePage /></RoleGuard>} />
//           <Route path="products/:id/edit" element={<RoleGuard module="products"><ProductEditPage /></RoleGuard>} />

//           {/* Customers */}
//           <Route path="customers" element={<RoleGuard module="customers"><CustomersPage /></RoleGuard>} />

//           {/* Categories */}
//           <Route path="categories" element={<RoleGuard module="categories"><CategoriesPage /></RoleGuard>} />

//           {/* Flash Sales */}
//           <Route path="flash-sales" element={<RoleGuard module="flash-sales"><FlashSalesPage /></RoleGuard>} />

//           {/* Messages */}
//           <Route path="messages" element={<RoleGuard module="messages"><MessagesPage /></RoleGuard>} />

//           {/* Site Pages — policy editor */}
//           <Route path="site-pages" element={<RoleGuard module="site-pages"><SitePagesPage /></RoleGuard>} />

//           {/* User Management */}
//           <Route path="user-management" element={<RoleGuard module="user-management"><UserManagementPage /></RoleGuard>} />

//           {/* Settings */}
//           <Route path="settings" element={<RoleGuard module="settings"><SettingsPage /></RoleGuard>} />

//           {/* Catch-all */}
//           <Route path="*" element={<Navigate to="/admin" replace />} />
//         </Route>
//       </Routes>
//     </Suspense>
//   );
// }

// src/router/AdminRoute.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All admin routes nested under the AdminLayout.
// Role-based route guarding + 403 page for unauthorized access.
// ─────────────────────────────────────────────────────────────────────────────

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import { canAccessModule } from '../utils/permissions';

// ── Lazy-loaded admin pages ──────────────────────────────────────────────────
const DashboardPage      = lazy(() => import('../pages/admin/DashboardPage'));
const OrdersPage         = lazy(() => import('../pages/admin/orders/OrderDetailPage'));
const ProductsPage       = lazy(() => import('../pages/admin/products/ProductsPage'));
const ProductCreatePage  = lazy(() => import('../pages/admin/products/ProductCreatePage'));
const ProductEditPage    = lazy(() => import('../pages/admin/products/ProductEditPage'));
const CustomersPage      = lazy(() => import('../pages/admin/customers/CustomersPage'));
const CategoriesPage     = lazy(() => import('../pages/admin/categories/CategoriesPage'));
const FlashSalesPage     = lazy(() => import('../pages/admin/flash-sales/FlashSalesPage'));
const MessagesPage       = lazy(() => import('../pages/admin/messages/MessagesPage'));
const SitePagesPage      = lazy(() => import('../pages/admin/site-pages/SitePagesPage'));
const SettingsPage       = lazy(() => import('../pages/admin/settings/SettingsPage'));
const UserManagementPage = lazy(() => import('../pages/admin/user-management/UserManagementPage'));
const ForbiddenPage      = lazy(() => import('../pages/admin/ForbiddenPage'));

// ── Loading spinner ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-[#AE3E27] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── Admin-only protection ────────────────────────────────────────────────────
function AdminProtectedRoute({ children }) {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin())       return <Navigate to="/account/profile" replace />;

  return children;
}

/**
 * RoleGuard — checks module access.
 *   - Authorized → renders children
 *   - Unauthorized → renders ForbiddenPage (403) instead of silent redirect
 * This gives the user feedback instead of confusingly bouncing them to dashboard.
 */
function RoleGuard({ module, children }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  const role = user?.adminRole || null;
  if (!canAccessModule(role, module)) {
    return <ForbiddenPage />;
  }

  return children;
}

// ── Route tree ───────────────────────────────────────────────────────────────
export default function AdminRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          {/* Dashboard — accessible to every admin */}
          <Route index element={<DashboardPage />} />

          {/* Orders */}
          <Route path="orders" element={<RoleGuard module="orders"><OrdersPage /></RoleGuard>} />

          {/* Products */}
          <Route path="products"          element={<RoleGuard module="products"><ProductsPage /></RoleGuard>} />
          <Route path="products/create"   element={<RoleGuard module="products"><ProductCreatePage /></RoleGuard>} />
          <Route path="products/:id/edit" element={<RoleGuard module="products"><ProductEditPage /></RoleGuard>} />

          {/* Customers */}
          <Route path="customers" element={<RoleGuard module="customers"><CustomersPage /></RoleGuard>} />

          {/* Categories */}
          <Route path="categories" element={<RoleGuard module="categories"><CategoriesPage /></RoleGuard>} />

          {/* Flash Sales */}
          <Route path="flash-sales" element={<RoleGuard module="flash-sales"><FlashSalesPage /></RoleGuard>} />

          {/* Messages */}
          <Route path="messages" element={<RoleGuard module="messages"><MessagesPage /></RoleGuard>} />

          {/* Site Pages */}
          <Route path="site-pages" element={<RoleGuard module="site-pages"><SitePagesPage /></RoleGuard>} />

          {/* User Management */}
          <Route path="user-management" element={<RoleGuard module="user-management"><UserManagementPage /></RoleGuard>} />

          {/* Settings */}
          <Route path="settings" element={<RoleGuard module="settings"><SettingsPage /></RoleGuard>} />

          {/* 403 page — accessible to all admins */}
          <Route path="forbidden" element={<ForbiddenPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}