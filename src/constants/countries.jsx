// src/components/ui/CountrySelect.jsx
import React from 'react';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AE', name: 'United Arab Emirates' },
];

export const CountrySelect = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  className = '',
}) => {
  return (
    <div className={`w-full relative ${className}`}>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-3 py-2.5 text-sm text-gray-900 
          bg-white border rounded-md appearance-none
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-[#AE3E27]/20 focus:border-[#AE3E27]
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'}
        `}
      >
        <option value="">Select country</option>
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      {/* Dropdown Arrow */}
      <svg 
        className="absolute right-3 top-[38px] w-4 h-4 text-gray-500 pointer-events-none" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        style={{ marginTop: label ? '0' : '0' }} // Adjust based on label presence
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};