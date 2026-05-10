// // src/router/AdminRoute.jsx
// import React, { lazy, Suspense } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import AdminLayout from '../components/admin/AdminLayout';

// // ── Lazy-loaded admin pages ─────────────────────────────────────────────────
// const DashboardPage   = lazy(() => import('../pages/admin/DashboardPage'));
// const OrdersPage      = lazy(() => import('../pages/admin/orders/OrderDetailPage'));
// const ProductsPage    = lazy(() => import('../pages/admin/products/ProductsPage'));
// const CustomersPage   = lazy(() => import('../pages/admin/customers/CustomersPage'));
// const CategoriesPage  = lazy(() => import('../pages/admin/categories/CategoriesPage'));
// const FlashSalesPage  = lazy(() => import('../pages/admin/flash-sales/FlashSalesPage'));
// const MessagesPage    = lazy(() => import('../pages/admin/messages/MessagesPage'));
// const SettingsPage    = lazy(() => import('../pages/admin/settings/SettingsPage'));

// // Loading spinner
// function PageLoader() {
//   return (
//     <div className="flex items-center justify-center h-48">
//       <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );
// }

// // Admin Protection Wrapper
// function AdminProtectedRoute({ children }) {
//   const { isAuthenticated, loading, isAdmin } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <PageLoader />;
//   }

//   // Not logged in → redirect to login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Not an admin → redirect to user dashboard
//   if (!isAdmin()) {
//     return <Navigate to="/account/profile" replace />;
//   }

//   return children;
// }

// // ── Main Admin Routes ───────────────────────────────────────────────────────
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
//           <Route index element={<DashboardPage />} />
//           <Route path="orders" element={<OrdersPage />} />
//           <Route path="products" element={<ProductsPage />} />
//           <Route path="customers" element={<CustomersPage />} />
//           <Route path="categories" element={<CategoriesPage />} />
//           <Route path="flash-sales" element={<FlashSalesPage />} />
//           <Route path="messages" element={<MessagesPage />} />
//           <Route path="settings" element={<SettingsPage />} />

//           {/* Catch all unknown admin routes */}
//           <Route path="*" element={<Navigate to="/admin" replace />} />
//         </Route>
//       </Routes>
//     </Suspense>
//   );
// }

// src/router/AdminRoute.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All admin routes nested under the AdminLayout.
// Includes product create/edit routes wired to full-form pages.
// ─────────────────────────────────────────────────────────────────────────────

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth }    from '../contexts/AuthContext';
import AdminLayout    from '../components/admin/AdminLayout';

// ── Lazy-loaded admin pages ──────────────────────────────────────────────────
const DashboardPage    = lazy(() => import('../pages/admin/DashboardPage'));
const OrdersPage       = lazy(() => import('../pages/admin/orders/OrderDetailPage'));
const ProductsPage     = lazy(() => import('../pages/admin/products/ProductsPage'));
const ProductCreatePage = lazy(() => import('../pages/admin/products/ProductCreatePage'));
const ProductEditPage  = lazy(() => import('../pages/admin/products/ProductEditPage'));
const CustomersPage    = lazy(() => import('../pages/admin/customers/CustomersPage'));
const CategoriesPage   = lazy(() => import('../pages/admin/categories/CategoriesPage'));
const FlashSalesPage   = lazy(() => import('../pages/admin/flash-sales/FlashSalesPage'));
const MessagesPage     = lazy(() => import('../pages/admin/messages/MessagesPage'));
const SettingsPage     = lazy(() => import('../pages/admin/settings/SettingsPage'));

// ── Loading spinner ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── Admin-only protection ────────────────────────────────────────────────────
function AdminProtectedRoute({ children }) {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/account/profile" replace />;
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
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Orders */}
          <Route path="orders" element={<OrdersPage />} />

          {/* ── Products ───────────────────────────────────────────── */}
          {/* List page must come BEFORE :id/edit so "create" isn't caught as :id */}
          <Route path="products"         element={<ProductsPage />} />
          <Route path="products/create"  element={<ProductCreatePage />} />
          <Route path="products/:id/edit" element={<ProductEditPage />} />

          {/* Customers */}
          <Route path="customers" element={<CustomersPage />} />

          {/* Categories */}
          <Route path="categories" element={<CategoriesPage />} />

          {/* Flash Sales */}
          <Route path="flash-sales" element={<FlashSalesPage />} />

          {/* Messages */}
          <Route path="messages" element={<MessagesPage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />

          {/* Catch-all — redirect to dashboard */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}