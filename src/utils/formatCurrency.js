// export const formatCurrency = (amount) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//   }).format(amount);
// };
// src/utils/formatCurrency.js
// Formats a number value as Nigerian Naira (₦) for display in the admin UI.
// Underlying data values are plain numbers — this function is display-only.

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
