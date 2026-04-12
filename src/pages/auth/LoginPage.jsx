
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { containerVariants, itemVariants } from '../../constants/animationVariants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email.toLowerCase(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/');
    } catch (error) {
      const code = error.response?.data?.code;
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      
      if (code === 'EMAIL_NOT_VERIFIED') {
        setApiError('Please verify your email before logging in.');
      } else if (code === 'INVALID_CREDENTIALS') {
        setApiError('Incorrect email or password.');
        setErrors({ email: ' ', password: ' ' }); // Show error state on fields
      } else {
        setApiError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/google', {
        idToken: credentialResponse.credential,
      });
      
      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate('/');
    } catch (error) {
      setApiError('Google sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-auto"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Fashly</span>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-sm text-gray-600">Sign in with your email and password</p>
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <TextInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              error={errors.email}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              error={errors.password}
              required
            />
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-xs text-gray-700">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-orange-600 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </motion.div>

          {/* API Error */}
          {apiError && (
            <motion.div variants={itemVariants} className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{apiError}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign In
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-gray-50 text-xs text-gray-500">or Sign In with</span>
            </div>
          </motion.div>

          {/* Google Sign In */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setApiError('Google sign in failed. Please try again.')}
              size="large"
              width="100%"
              text="signin_with"
              shape="rectangular"
              locale="en"
            />
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-600 font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};