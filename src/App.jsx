// // src/App.jsx — Route tree for the entire application.
// // Account routes are wrapped in ProtectedRoute so only authenticated users can access them.
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import { AuthProvider }        from "./contexts/AuthContext";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import ProtectedRoute          from "./router/ProtectedRoute";

// // ── Public pages ──────────────────────────────────────────────────────────────
// import Home               from "./pages/public/HomePage";
// import ProductListingPage from "./pages/public/ProductListingPage";
// import ProductDetailPage  from "./pages/public/ProductDetailPage";

// // ── Auth pages ────────────────────────────────────────────────────────────────
// import { RegisterPage }      from "./pages/auth/RegisterPage";
// import { LoginPage }         from "./pages/auth/LoginPage";
// import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
// import { VerifyResetCodePage } from "./pages/auth/VerifyResetCodePage";
// import { ResetPasswordPage }  from "./pages/auth/ResetPasswordPage";
// import VerifyEmailPage        from "./pages/auth/VerifyEmailPage";

// // ── Account pages (protected) ─────────────────────────────────────────────────
// import AccountLayout      from "./pages/account/AccountLayout";
// import ProfilePage        from "./pages/account/ProfilePage";
// import OrdersPage         from "./pages/account/OrdersPage";
// import WishlistPage       from "./pages/account/WishlistPage";
// import AddressesPage      from "./pages/account/AddressesPage";
// import PaymentMethodsPage from "./pages/account/PaymentMethodsPage";
// import LogoutPage         from "./pages/account/LogoutPage";

// // ── Account pages (protected) ─────────────────────────────────────────────────
// // import AdminRoutes       from './router/adminRoutes';
// import AdminRoutes       from './router/AdminRoute';

// const GOOGLE_CLIENT_ID = "161364247766-anf84lnkvn579mh1u90n7ns4jb5noalp.apps.googleusercontent.com";

// function App() {
//   return (
//     <AuthProvider>
//       <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//         <Router>
//           <AdminRoutes />
//           <Routes>
//             {/* ── Public ── */}
//             <Route path="/"     element={<Home />} />
//             <Route path="/shop" element={<ProductListingPage />} />
//             <Route path="/products/:slug" element={<ProductDetailPage />} />

//             {/* ── Auth ── */}
//             <Route path="/register"         element={<RegisterPage />} />
//             <Route path="/login"            element={<LoginPage />} />
//             <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
//             <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
//             <Route path="/reset-password"   element={<ResetPasswordPage />} />
//             <Route path="/verify-email" element={<VerifyEmailPage />} />

//             {/* ── Account (all protected) ───────────────────────────────── */}
//             {/* Each sub-route is wrapped in ProtectedRoute individually so
//                 AccountLayout always receives children.                       */}

//             <Route
//               path="/account/profile"
//               element={
//                 <ProtectedRoute>
//                   <AccountLayout>
//                     <ProfilePage />
//                   </AccountLayout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/account/orders"
//               element={
//                 <ProtectedRoute>
//                   <AccountLayout>
//                     <OrdersPage />
//                   </AccountLayout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/account/wishlist"
//               element={
//                 <ProtectedRoute>
//                   <AccountLayout>
//                     <WishlistPage />
//                   </AccountLayout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/account/addresses"
//               element={
//                 <ProtectedRoute>
//                   <AccountLayout>
//                     <AddressesPage />
//                   </AccountLayout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/account/payment"
//               element={
//                 <ProtectedRoute>
//                   <AccountLayout>
//                     <PaymentMethodsPage />
//                   </AccountLayout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/account/logout"
//               element={
//                 <ProtectedRoute>
//                   <AccountLayout>
//                     <LogoutPage />
//                   </AccountLayout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Default redirect: /account → /account/profile */}
//             <Route path="/account" element={<Navigate to="/account/profile" replace />} />
//           </Routes>
//         </Router>
//       </GoogleOAuthProvider>
//     </AuthProvider>
//   );
// }

// export default App;



// src/App.jsx — Route tree for the entire application.
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider }        from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute          from './router/ProtectedRoute';

// ── Public pages ──────────────────────────────────────────────────────────────
import Home                        from './pages/public/HomePage';
import ProductListingPage          from './pages/public/ProductListingPage';
import ProductDetailPage           from './pages/public/ProductDetailPage';

// ── Policy pages (public) ─────────────────────────────────────────────────────
import PrivacyPolicyPage           from './pages/public/PrivacyPolicyPage';
import AccessControlPolicyPage     from './pages/public/AccessControlPolicyPage';
import RefundCancellationPolicyPage from './pages/public/RefundCancellationPolicyPage';
import DataRetentionPolicyPage     from './pages/public/DataRetentionPolicyPage';
import TermsPage                   from './pages/public/TermsPage';

// ── Auth pages ────────────────────────────────────────────────────────────────
import { RegisterPage }       from './pages/auth/RegisterPage';
import { LoginPage }          from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { VerifyResetCodePage } from './pages/auth/VerifyResetCodePage';
import { ResetPasswordPage }  from './pages/auth/ResetPasswordPage';
import VerifyEmailPage        from './pages/auth/VerifyEmailPage';

// ── Account pages (protected) ─────────────────────────────────────────────────
import AccountLayout      from './pages/account/AccountLayout';
import ProfilePage        from './pages/account/ProfilePage';
import OrdersPage         from './pages/account/OrdersPage';
import WishlistPage       from './pages/account/WishlistPage';
import AddressesPage      from './pages/account/AddressesPage';
import PaymentMethodsPage from './pages/account/PaymentMethodsPage';
import LogoutPage         from './pages/account/LogoutPage';

// ── Admin routes ──────────────────────────────────────────────────────────────
import AdminRoutes from './router/AdminRoute';

const GOOGLE_CLIENT_ID = '161364247766-anf84lnkvn579mh1u90n7ns4jb5noalp.apps.googleusercontent.com';

function App() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <AdminRoutes />
          <Routes>
            {/* ── Public ── */}
            <Route path="/"                  element={<Home />} />
            <Route path="/shop"              element={<ProductListingPage />} />
            <Route path="/products/:slug"    element={<ProductDetailPage />} />

            {/* ── Policy pages ── */}
            <Route path="/privacy-policy"            element={<PrivacyPolicyPage />} />
            <Route path="/access-control-policy"     element={<AccessControlPolicyPage />} />
            <Route path="/refund-cancellation-policy" element={<RefundCancellationPolicyPage />} />
            <Route path="/data-retention-policy"     element={<DataRetentionPolicyPage />} />
            <Route path="/terms-of-service"          element={<TermsPage />} />

            {/* ── Auth ── */}
            <Route path="/register"          element={<RegisterPage />} />
            <Route path="/login"             element={<LoginPage />} />
            <Route path="/forgot-password"   element={<ForgotPasswordPage />} />
            <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
            <Route path="/reset-password"    element={<ResetPasswordPage />} />
            <Route path="/verify-email"      element={<VerifyEmailPage />} />

            {/* ── Account (protected) ── */}
            <Route
              path="/account/profile"
              element={<ProtectedRoute><AccountLayout><ProfilePage /></AccountLayout></ProtectedRoute>}
            />
            <Route
              path="/account/orders"
              element={<ProtectedRoute><AccountLayout><OrdersPage /></AccountLayout></ProtectedRoute>}
            />
            <Route
              path="/account/wishlist"
              element={<ProtectedRoute><AccountLayout><WishlistPage /></AccountLayout></ProtectedRoute>}
            />
            <Route
              path="/account/addresses"
              element={<ProtectedRoute><AccountLayout><AddressesPage /></AccountLayout></ProtectedRoute>}
            />
            <Route
              path="/account/payment"
              element={<ProtectedRoute><AccountLayout><PaymentMethodsPage /></AccountLayout></ProtectedRoute>}
            />
            <Route
              path="/account/logout"
              element={<ProtectedRoute><AccountLayout><LogoutPage /></AccountLayout></ProtectedRoute>}
            />

            <Route path="/account" element={<Navigate to="/account/profile" replace />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;