
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { containerVariants, itemVariants } from '../../constants/animationVariants';

export const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, token } = location.state || {};

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Redirect if no token
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Invalid or expired reset link.</p>
          <Link to="/forgot-password">
            <Button>Request New Code</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: formData.newPassword,
      });
      
      // Success - redirect to login
      alert('Password updated successfully! Please log in with your new password.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to reset password. Please try again.';
      if (error.response?.data?.code === 'TOKEN_EXPIRED') {
        setApiError('This reset code has expired. Please request a new one.');
      } else {
        setApiError(message);
      }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-sm text-gray-600">Must be at least 8 characters</p>
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={itemVariants}>
            <TextInput
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              error={errors.newPassword}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              error={errors.confirmPassword}
              required
            />
          </motion.div>

          {apiError && (
            <motion.div variants={itemVariants} className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{apiError}</p>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="pt-2">
            <Button type="submit" fullWidth isLoading={isLoading}>
              Reset Password
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-orange-600 font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};