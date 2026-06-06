// src/pages/auth/VerifyResetCodePage.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/auth.api';
import { Button } from '../../components/ui/Button';
import { VerifyCodeInput } from '../../components/ui/VerifyCodeInput';
import { containerVariants, itemVariants } from '../../constants/animationVariants';

export const VerifyResetCodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeComplete = (completedCode) => {
    setCode(completedCode);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    // Navigate to reset password with the code (token)
    navigate('/reset-password', { state: { email, token: code } });
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    try {
      await api.post('/auth/forgot-password', { email: email.toLowerCase() });
      alert('A new code has been sent to your email.');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
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
            <div className="w-8 h-8 bg-[#AE3E27] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Atelierselvedge</span>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Code</h2>
          <p className="text-sm text-gray-600">
            Please enter the code sent to <span className="font-medium text-gray-900">{email || 'your email'}</span>
          </p>
        </motion.div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <VerifyCodeInput
              length={6}
              onComplete={handleCodeComplete}
              error={error}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-2">
            <Button type="submit" fullWidth isLoading={isLoading}>
              Submit
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive code?{' '}
              <button
                type="button"
                onClick={handleResend}
                className="text-[#AE3E27] font-medium hover:underline"
              >
                Resend Code
              </button>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center pt-2">
            <Link to="/login" className="text-sm text-[#AE3E27] font-medium hover:underline">
              Back to Sign In
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};