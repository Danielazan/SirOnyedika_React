


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
import { useAuth } from '../../contexts/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password || formData.password.length < 8) {
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
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        country: formData.country,
      });

      setSuccessMessage('Account created successfully! Please check your email to verify your account.');
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      setApiError(message);

      if (error.response?.data?.code === 'EMAIL_TAKEN') {
        setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', {
        idToken: credentialResponse.credential,
      });

      const { accessToken, refreshToken, user } = response.data.data;
      login(accessToken, refreshToken, user);

      navigate('/account/profile');
    } catch (error) {
      setApiError('Google sign up failed. Please try again.');
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
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-[#AE3E27] rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">F</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join us and start shopping</p>
        </motion.div>

        {successMessage && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center"
          >
            {successMessage}
          </motion.div>
        )}

        <motion.form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <TextInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>

          <TextInput
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <CountrySelect
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            error={errors.country}
            required
          />

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="agreeToTerms"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
              I agree to the{' '}
              <Link to="/terms" className="text-[#AE3E27] hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-[#AE3E27] hover:underline">Privacy Policy</Link>
            </label>
          </div>
          {errors.agreeToTerms && <p className="text-red-600 text-xs">{errors.agreeToTerms}</p>}

          {apiError && (
            <p className="text-red-600 text-center bg-red-50 p-3 rounded-lg">{apiError}</p>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            Create Account
          </Button>

          <div className="relative py-4">
            <div className="border-t border-gray-200 absolute inset-0" />
            <div className="relative text-center">
              <span className="bg-gray-50 px-4 text-gray-500 text-sm">or</span>
            </div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setApiError('Google signup failed')}
            size="large"
            width="100%"
            text="signup_with"
          />

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[#AE3E27] font-medium hover:underline">Sign in</Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};