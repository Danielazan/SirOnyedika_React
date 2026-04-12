// src/pages/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { CountrySelect } from '../../constants/countries';
import { containerVariants, itemVariants } from '../../constants/animationVariants';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    agreeToTerms: false,
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
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.toLowerCase(),
        password: formData.password,
        country: formData.country,
      });

      // Show success and redirect to login
      alert('Account created successfully! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      setApiError(message);
      
      if (error.response?.data?.code === 'EMAIL_TAKEN') {
        setErrors((prev) => ({ ...prev, email: 'This email is already registered' }));
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
      setApiError('Google signup failed. Please try again.');
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
        {/* Logo Section */}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h2>
          <p className="text-sm text-gray-600">Fill your information below to register</p>
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields - Side by side on desktop, stacked on mobile */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              error={errors.firstName}
              required
            />
            <TextInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              error={errors.lastName}
              required
            />
          </motion.div>

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

          <motion.div variants={itemVariants}>
            <CountrySelect
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              error={errors.country}
              required
            />
          </motion.div>

          {/* Terms Checkbox */}
          <motion.div variants={itemVariants} className="flex items-start gap-2">
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="agreeToTerms" className="text-xs text-gray-700">
              Agree with{' '}
              <Link to="/terms" className="text-orange-600 hover:underline">
                Terms & Condition
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-orange-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </motion.div>
          {errors.agreeToTerms && (
            <p className="text-xs text-red-600">{errors.agreeToTerms}</p>
          )}

          {/* API Error */}
          {apiError && (
            <motion.div variants={itemVariants} className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{apiError}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign Up
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-gray-50 text-xs text-gray-500">or Sign Up with</span>
            </div>
          </motion.div>

          {/* Google Sign Up */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setApiError('Google signup failed. Please try again.')}
              size="large"
              width="100%"
              text="signup_with"
              shape="rectangular"
              locale="en"
            />
          </motion.div>

          {/* Footer Link */}
          <motion.div variants={itemVariants} className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
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