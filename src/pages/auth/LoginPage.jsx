// // src/pages/auth/LoginPage.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { GoogleLogin } from '@react-oauth/google';
// import api from '../../api/auth.api';
// import { Button } from '../../components/ui/Button';
// import { TextInput } from '../../components/ui/TextInput';
// import { useAuth } from '../../contexts/AuthContext';
// import { containerVariants, itemVariants } from '../../constants/animationVariants';

// export const LoginPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth(); // Use context instead of manual localStorage

//   const from = location.state?.from?.pathname || '/account/profile';

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError('');
//     setIsLoading(true);

//     try {
//       const response = await api.post('/auth/login', {
//         email: formData.email.toLowerCase().trim(),
//         password: formData.password,
//         rememberMe: formData.rememberMe,
//       });

//       const { accessToken, refreshToken, user } = response.data.data;

//       // Login via context (updates state + localStorage)
//       login(accessToken, refreshToken, user);

//       // Role-based redirect
//       const isAdmin = user.role === 'admin' || user.adminRole;
//       const redirectTo = isAdmin ? '/admin' : from;

//       navigate(redirectTo, { replace: true });
//     } catch (error) {
//       const code = error.response?.data?.code;
//       const message = error.response?.data?.error || 'Login failed. Please try again.';

//       if (code === 'EMAIL_NOT_VERIFIED') {
//         setApiError('Please verify your email before logging in.');
//       } else if (code === 'INVALID_CREDENTIALS') {
//         setApiError('Incorrect email or password.');
//         setErrors({ email: ' ', password: ' ' });
//       } else {
//         setApiError(message);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     setApiError('');
//     setIsLoading(true);
//     try {
//       const response = await api.post('/auth/google', {
//         idToken: credentialResponse.credential,
//       });

//       const { accessToken, refreshToken, user } = response.data.data;
//       login(accessToken, refreshToken, user);

//       const isAdmin = user.role === 'admin' || user.adminRole;
//       navigate(isAdmin ? '/admin' : from, { replace: true });
//     } catch (error) {
//       setApiError('Google sign in failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="w-full max-w-md mx-auto"
//       >
//         {/* Logo */}
//         <motion.div variants={itemVariants} className="mb-8">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
//               <span className="text-white font-bold text-lg">F</span>
//             </div>
//             <span className="text-xl font-bold text-gray-900">Fashly / WillOfGod</span>
//           </div>
//         </motion.div>

//         <motion.div variants={itemVariants} className="mb-8 text-center">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
//           <p className="text-gray-600">Welcome back! Sign in to continue</p>
//         </motion.div>

//         <motion.form onSubmit={handleSubmit} className="space-y-5">
//           <motion.div variants={itemVariants}>
//             <TextInput
//               label="Email Address"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="you@example.com"
//               error={errors.email}
//               required
//             />
//           </motion.div>

//           <motion.div variants={itemVariants}>
//             <TextInput
//               label="Password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               error={errors.password}
//               required
//             />
//           </motion.div>

//           <motion.div variants={itemVariants} className="flex items-center justify-between">
//             <label className="flex items-center gap-2 text-sm cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="rememberMe"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//                 className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
//               />
//               Remember me
//             </label>
//             <Link to="/forgot-password" className="text-sm text-orange-600 hover:underline">
//               Forgot Password?
//             </Link>
//           </motion.div>

//           {apiError && (
//             <motion.div variants={itemVariants} className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
//               {apiError}
//             </motion.div>
//           )}

//           <motion.div variants={itemVariants}>
//             <Button type="submit" fullWidth isLoading={isLoading} className="py-3 text-base">
//               Sign In
//             </Button>
//           </motion.div>

//           {/* Google */}
//           <motion.div variants={itemVariants} className="pt-2">
//             <div className="relative py-3">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200" />
//               </div>
//               <div className="relative flex justify-center">
//                 <span className="px-4 bg-gray-50 text-xs text-gray-500">or continue with</span>
//               </div>
//             </div>

//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={() => setApiError('Google sign in failed')}
//               size="large"
//               width="100%"
//               text="signin_with"
//               shape="rectangular"
//             />
//           </motion.div>

//           <motion.div variants={itemVariants} className="text-center text-sm text-gray-600 pt-4">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-orange-600 font-medium hover:underline">
//               Sign up
//             </Link>
//           </motion.div>
//         </motion.form>
//       </motion.div>
//     </div>
//   );
// };

// src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { useAuth } from '../../contexts/AuthContext';
import { containerVariants, itemVariants } from '../../constants/animationVariants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/account/profile';

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      const { accessToken, refreshToken, user } = res.data.data;

      login(accessToken, refreshToken, user);

      // Redirect based on role
      const redirectPath = user.role === 'admin' || user.adminRole ? '/admin' : from;
      navigate(redirectPath, { replace: true });

    } catch (error) {
      const msg = error.response?.data?.error || 'Invalid credentials';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/google', {
        idToken: credentialResponse.credential,
      });

      const { accessToken, refreshToken, user } = res.data.data;
      login(accessToken, refreshToken, user);

      const redirectPath = user.role === 'admin' || user.adminRole ? '/admin' : from;
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setApiError('Google sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-md mx-auto w-full">
        {/* Logo + Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">F</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
              <span className="text-sm">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-orange-600 text-sm hover:underline">Forgot Password?</Link>
          </div>

          {apiError && <p className="text-red-600 text-center bg-red-50 p-3 rounded-lg">{apiError}</p>}

          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign In
          </Button>

          <div className="relative py-4">
            <div className="border-t border-gray-200 absolute inset-0" />
            <div className="relative text-center">
              <span className="bg-gray-50 px-4 text-gray-500 text-sm">or</span>
            </div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setApiError('Google login failed')}
            size="large"
            width="100%"
            text="signin_with"
          />

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 font-medium">Sign up</Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};