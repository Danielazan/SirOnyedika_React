
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ShopPage from "./pages/Shop";
// import ShoppingCart from "./pages/ShoppingCart";
// import ProductPage from "./components/ShopPages/ProductPage";
// import Home from "./pages/Home";


// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/shop" element={<ShopPage />} />
//         <Route path="/shop/:productId" element={<ProductPage />} />
//         <Route path="/Cart" element={<ShoppingCart />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import ShopPage from "./pages/Shop";
// import ShoppingCart from "./pages/ShoppingCart";
// import ProductPage from "./components/ShopPages/ProductPage";
import Home from "./pages/public/HomePage";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { RegisterPage } from './pages/auth/RegisterPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { VerifyResetCodePage } from './pages/auth/VerifyResetCodePage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Wrap with Google OAuth Provider (replace with your client ID)
const GOOGLE_CLIENT_ID = "161364247766-anf84lnkvn579mh1u90n7ns4jb5noalp.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:productId" element={<ProductPage />} />
        <Route path="/Cart" element={<ShoppingCart />} /> */}
        <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-reset-code" element={<VerifyResetCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* cc */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;