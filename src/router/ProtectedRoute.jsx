// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// export default function ProtectedRoute({ children }) {
//   const { isAuthenticated, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AE3E27]"></div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     // Redirect to login and save the page they tried to visit
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// }

// src/router/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#AE3E27]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/account/profile" replace />;
  }

  return children;
}