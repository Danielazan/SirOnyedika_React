import React from 'react';
import { usePermissions } from '../../hooks/auth/usePermissions';

/**
 * AdminActionGuard — Declarative permission wrapper for UI elements.
 *
 * Wraps buttons, tabs, form sections, or entire page areas.
 * Renders children only if the current admin has the required permission.
 * Optionally renders a fallback (e.g., disabled button or empty state).
 *
 * Usage:
 *   <AdminActionGuard action="products.create">
 *     <button>Create Product</button>
 *   </AdminActionGuard>
 *
 *   <AdminActionGuard action="orders.process_refund" fallback={<span>Contact finance team</span>}>
 *     <button>Process Refund</button>
 *   </AdminActionGuard>
 *
 *   <AdminActionGuard anyOf={['products.create', 'products.edit']}>
 *     <ProductForm />
 *   </AdminActionGuard>
 */
export default function AdminActionGuard({
  action,           // single action string
  anyOf,            // array of actions — pass if ANY match
  allOf,            // array of actions — pass if ALL match
  fallback = null,  // rendered when permission denied
  children,
}) {
  const { canDo, canDoAny, canDoAll } = usePermissions();

  let hasPermission = false;

  if (action) {
    hasPermission = canDo(action);
  } else if (anyOf && anyOf.length > 0) {
    hasPermission = canDoAny(anyOf);
  } else if (allOf && allOf.length > 0) {
    hasPermission = canDoAll(allOf);
  }

  if (!hasPermission) {
    return fallback;
  }

  return children;
}
