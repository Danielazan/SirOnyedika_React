// src/components/ui/VerifyCodeInput.jsx
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const VerifyCodeInput = ({ length = 6, onComplete, error }) => {
  const [code, setCode] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    const combinedCode = newCode.join('');
    if (combinedCode.length === length) {
      onComplete(combinedCode);
    }

    // Move to next input if current is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d*$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((char, index) => {
      if (index < length) newCode[index] = char;
    });
    setCode(newCode);

    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex].focus();

    if (pastedData.length === length) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-between">
        {code.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`
              w-10 h-12 text-center text-lg font-semibold 
              border rounded-md bg-white
              focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-600
              transition-all duration-200
              ${error ? 'border-red-500' : 'border-gray-300'}
            `}
            whileFocus={{ scale: 1.05 }}
          />
        ))}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-red-600 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};