// src/components/ui/Button.jsx
import React from 'react';

const THEME = {
  primary: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
  outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
};

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
}) => {
  const baseStyles = `
    inline-flex items-center justify-center px-6 py-3 
    text-sm font-semibold rounded-md 
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const widthClass = fullWidth ? 'w-full' : '';
  const variantClass = THEME[variant] || THEME.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantClass} ${widthClass} ${className}`}
    >
      {isLoading ? (
        <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};