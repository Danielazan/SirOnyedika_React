// // src/components/ui/TextInput.jsx
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// export const TextInput = ({
//   label,
//   type = 'text',
//   name,
//   value,
//   onChange,
//   placeholder,
//   error,
//   required = false,
//   disabled = false,
//   className = '',
// }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const isPassword = type === 'password';
//   const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

//   return (
//     <div className={`w-full ${className}`}>
//       <label className="block text-xs font-medium text-gray-700 mb-1.5">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <div className="relative">
//         <input
//           type={inputType}
//           name={name}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           disabled={disabled}
//           className={`
//             w-full px-3 py-2.5 text-sm text-gray-900 
//             bg-white border rounded-md 
//             placeholder:text-gray-400
//             transition-colors duration-200
//             focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600
//             disabled:bg-gray-50 disabled:text-gray-500
//             ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'}
//           `}
//         />
//         {isPassword && (
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//           >
//             {showPassword ? (
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//               </svg>
//             ) : (
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//               </svg>
//             )}
//           </button>
//         )}
//       </div>
//       {error && (
//         <motion.p
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mt-1 text-xs text-red-600"
//         >
//           {error}
//         </motion.p>
//       )}
//     </div>
//   );
// };

// src/components/ui/TextInput.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable text input used throughout the entire app and admin.
// Combines:
//  - Password show/hide toggle (from original)
//  - Required asterisk + label (from original)
//  - Disabled state styling (from original)
//  - Framer Motion error animation (from original)
//  - forwardRef support (new)
//  - Left icon slot (new)
//  - Right icon slot with optional click handler (new)
//  - helperText below input (new)
//  - wrapperClassName / inputClassName / className overrides (new)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const TextInput = React.forwardRef(
  (
    {
      // ── Label / meta ───────────────────────────────────────────────────────
      label,
      required = false,
      helperText,
      error,

      // ── Icons ──────────────────────────────────────────────────────────────
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,

      // ── Input core ─────────────────────────────────────────────────────────
      id,
      type = 'text',
      name,
      value,
      onChange,
      placeholder,
      disabled = false,

      // ── Styling overrides ──────────────────────────────────────────────────
      className = '',          // wraps the inner input+icons div
      inputClassName = '',     // applied directly to <input>
      wrapperClassName = '',   // outermost container div

      // ── Everything else passed straight to <input> ─────────────────────────
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;

    // Stable id: prefer explicit id, fall back to name
    const inputId = id || name;

    // Determine padding based on which icons are present
    // Password toggle lives on the right just like RightIcon
    const hasRightSlot = RightIcon || isPassword;
    const paddingLeft  = LeftIcon    ? 'pl-9' : 'pl-3';
    const paddingRight = hasRightSlot ? 'pr-9' : 'pr-3';

    return (
      <div className={`w-full flex flex-col gap-1 ${wrapperClassName}`}>

        {/* ── Label ─────────────────────────────────────────────────────── */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* ── Input row ─────────────────────────────────────────────────── */}
        <div className={`relative flex items-center ${className}`}>

          {/* Left icon */}
          {LeftIcon && (
            <span className="absolute left-3 text-gray-400 pointer-events-none z-10">
              <LeftIcon size={16} />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={[
              // Base
              'w-full rounded-lg border bg-white text-sm text-gray-900',
              'placeholder:text-gray-400 transition-colors duration-200',
              // Focus ring
              'focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600',
              // Disabled
              'disabled:bg-gray-50 disabled:text-gray-500',
              // Padding
              paddingLeft,
              paddingRight,
              'py-2.5',
              // Error state
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300',
              inputClassName,
            ].join(' ')}
            {...props}
          />

          {/* Right icon — custom (only when NOT password) */}
          {RightIcon && !isPassword && (
            <span
              className={[
                'absolute right-3 text-gray-400 z-10',
                onRightIconClick
                  ? 'cursor-pointer hover:text-gray-600'
                  : 'pointer-events-none',
              ].join(' ')}
              onClick={onRightIconClick}
            >
              <RightIcon size={16} />
            </span>
          )}

          {/* Password toggle — always on right for password inputs */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              {showPassword ? (
                // Eye open
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                // Eye closed
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* ── Error message (animated) ───────────────────────────────────── */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-600"
          >
            {error}
          </motion.p>
        )}

        {/* ── Helper text (shown only when no error) ─────────────────────── */}
        {helperText && !error && (
          <p className="text-xs text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

// Both named and default export so existing imports don't break
export default TextInput;