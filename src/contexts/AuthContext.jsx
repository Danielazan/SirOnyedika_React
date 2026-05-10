

// import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import api from '../api/auth.api'; // Your axios instance

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Check authentication status on app start
//   const checkAuth = useCallback(async () => {
//     const accessToken = localStorage.getItem('accessToken');

//     // No token → user is not logged in
//     if (!accessToken) {
//       setUser(null);
//       setIsAuthenticated(false);
//       setLoading(false);
//       return;
//     }

//     try {
//       // Verify token with backend
//       const res = await api.get('/auth/me');
//       setUser(res.data.data);
//       setIsAuthenticated(true);
//     } catch (error) {
//       // Token is invalid, expired, or revoked → treat as logged out
//       // Only clear the bad access token (keep refreshToken for future use)
//       localStorage.removeItem('accessToken');
//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Auto-check auth when app loads
//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   // Logout function (used from Navbar, Account pages, etc.)
//   const logout = useCallback(() => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
//     setUser(null);
//     setIsAuthenticated(false);
//   }, []);

//   // Login helper (call this after successful login/register)
//   const login = useCallback((accessToken, refreshToken, userData) => {
//     localStorage.setItem('accessToken', accessToken);
//     if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
//     localStorage.setItem('user', JSON.stringify(userData));

//     setUser(userData);
//     setIsAuthenticated(true);
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated,
//         loading,
//         login,
//         logout,
//         checkAuth,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Load user from localStorage on initial mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const savedUser = localStorage.getItem('user');

        if (accessToken && savedUser && !isTokenExpired(accessToken)) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Clear invalid session
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = (accessToken, refreshToken, userData) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile (for profile edits, avatar change, etc.)
  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  // Check if user is admin
  const isAdmin = () => {
    if (!user) return false;
    return user.role === 'admin' || Boolean(user.adminRole);
  };

  // Check if user is super admin
  const isSuperAdmin = () => {
    return user?.adminRole === 'super_admin';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};