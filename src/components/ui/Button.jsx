// // src/components/ui/Button.jsx
// import React from 'react';

// const THEME = {
//   primary: 'bg-[#AE3E27] hover:bg-[#8f3320] focus:ring-[#AE3E27] text-white',
//   secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
//   outline: 'border-2 border-[#AE3E27] text-[#AE3E27] hover:bg-[#fdf2f0]',
//   danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
// };

// export const Button = ({
//   children,
//   type = 'button',
//   variant = 'primary',
//   fullWidth = false,
//   isLoading = false,
//   disabled = false,
//   className = '',
//   onClick,
// }) => {
//   const baseStyles = `
//     inline-flex items-center justify-center px-6 py-3 
//     text-sm font-semibold rounded-md 
//     transition-all duration-200 ease-in-out
//     focus:outline-none focus:ring-2 focus:ring-offset-2
//     disabled:opacity-50 disabled:cursor-not-allowed
//   `;

//   const widthClass = fullWidth ? 'w-full' : '';
//   const variantClass = THEME[variant] || THEME.primary;

//   return (
//     <button
//       type={type}
//       onClick={onClick}
//       disabled={disabled || isLoading}
//       className={`${baseStyles} ${variantClass} ${widthClass} ${className}`}
//     >
//       {isLoading ? (
//         <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//         </svg>
//       ) : null}
//       {children}
//     </button>
//   );
// };


// // import React from 'react';
// // import { motion } from 'framer-motion';

// // export const Button = ({ children, className = '', variant = 'primary', ...props }) => {
// //   const baseStyle = "px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2";
// //   const variants = {
// //     primary: "bg-[#AE3E27] hover:bg-[#8f3320] text-white shadow-lg shadow-orange-500/30",
// //     outline: "border-2 border-gray-200 hover:border-[#AE3E27] hover:text-[#AE3E27] text-gray-600 bg-white",
// //     ghost: "hover:bg-gray-100 text-gray-600"
// //   };

// //   return (
// //     <motion.button 
// //       whileHover={{ y: -2 }}
// //       whileTap={{ scale: 0.95 }}
// //       className={`${baseStyle} ${variants[variant]} ${className}`} 
// //       {...props}
// //     >
// //       {children}
// //     </motion.button>
// //   );
// // };

// src/components/ui/Button.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable button used throughout the entire app and admin.
// Combines:
//  - type, onClick, isLoading prop name (from original)
//  - named export so existing imports don't break (from original)
//  - forwardRef support (new)
//  - sm / md / lg size variants (new)
//  - leftIcon / rightIcon slots (new)
//  - Lucide Loader2 spinner — replaces the inline SVG (new)
//  - ghost + outline variants added alongside original primary/secondary/danger
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Loader2 } from 'lucide-react';

// ── Variant styles ────────────────────────────────────────────────────────────
const VARIANTS = {
  primary:   'bg-[#AE3E27] hover:bg-[#8f3320] focus:ring-[#AE3E27] text-white border border-[#AE3E27] shadow-sm',
  secondary: 'bg-gray-200   hover:bg-gray-300   focus:ring-gray-500   text-gray-800 border border-gray-200',
  outline:   'bg-transparent hover:bg-[#fdf2f0] focus:ring-[#AE3E27] text-[#AE3E27] border-2 border-[#AE3E27]',
  danger:    'bg-red-600    hover:bg-red-700    focus:ring-red-500    text-white border border-red-600 shadow-sm',
  ghost:     'bg-transparent hover:bg-[#fdf2f0] focus:ring-[#AE3E27] text-[#AE3E27] border border-transparent',
};

// ── Size styles ───────────────────────────────────────────────────────────────
const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',       // closest to original px-6 py-3 feel
  lg: 'px-6 py-3   text-sm gap-2',       // matches original exactly
};

export const Button = React.forwardRef(
  (
    {
      children,

      // ── Behaviour ────────────────────────────────────────────────────────
      type = 'button',
      onClick,

      // ── Appearance ───────────────────────────────────────────────────────
      variant  = 'primary',
      size     = 'lg',          // default lg keeps parity with original px-6 py-3
      fullWidth = false,

      // ── State ────────────────────────────────────────────────────────────
      isLoading = false,        // original prop name
      loading   = false,        // alias — admin code uses `loading`
      disabled  = false,

      // ── Icon slots ───────────────────────────────────────────────────────
      leftIcon:  LeftIcon,
      rightIcon: RightIcon,

      // ── Style overrides ───────────────────────────────────────────────────
      className = '',

      // ── Everything else ───────────────────────────────────────────────────
      ...props
    },
    ref
  ) => {
    // Accept both `isLoading` (original) and `loading` (admin) prop names
    const isSpinning = isLoading || loading;
    const isDisabled = disabled || isSpinning;

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={[
          // Base
          'inline-flex items-center justify-center font-semibold rounded-md',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'active:scale-[0.98] select-none',
          // Variant + size
          VARIANTS[variant] ?? VARIANTS.primary,
          SIZES[size]       ?? SIZES.lg,
          // Modifiers
          fullWidth  ? 'w-full'                     : '',
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className,
        ].join(' ')}
        {...props}
      >
        {/* Spinner replaces left icon while loading */}
        {isSpinning ? (
          <Loader2 size={16} className="animate-spin shrink-0" />
        ) : (
          LeftIcon && <LeftIcon size={14} className="shrink-0" />
        )}

        {children}

        {/* Right icon — hidden while loading */}
        {RightIcon && !isSpinning && (
          <RightIcon size={14} className="shrink-0" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Both named and default export so no existing import breaks
export default Button;