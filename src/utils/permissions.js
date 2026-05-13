// // /**
// //  * permissions.js — Frontend role-based access control.
// //  *
// //  * Maps each admin sub-role to the modules they are allowed to access.
// //  * Super Admin has implicit access to everything.
// //  *
// //  * Module keys must match the route segments and sidebar identifiers.
// //  */

// // export const ROLE_MODULES = {
// //   super_admin:       ['dashboard', 'orders', 'products', 'customers', 'categories', 'flash-sales', 'messages', 'user-management', 'settings'],
// //   ecommerce_manager: ['dashboard', 'orders', 'products', 'customers', 'categories', 'flash-sales'],
// //   product_admin:     ['dashboard', 'products', 'categories'],
// //   marketing_admin:   ['dashboard', 'products', 'categories', 'flash-sales', 'customers'],
// //   customer_support:  ['dashboard', 'orders', 'customers', 'messages'],
// //   finance_admin:     ['dashboard', 'orders', 'customers'],
// //   it_admin:          ['dashboard', 'user-management', 'settings'],
// //   fulfillment_staff: ['dashboard', 'orders', 'products'],
// // };

// // /**
// //  * Check if an admin role is allowed access to a specific module.
// //  * Super Admin always passes. Buyers (null role) always fail.
// //  *
// //  * @param {string|null} adminRole — e.g. 'super_admin', 'product_admin'
// //  * @param {string}      module    — e.g. 'products', 'user-management'
// //  * @returns {boolean}
// //  */
// // export function canAccessModule(adminRole, module) {
// //   if (!adminRole) return false;
// //   if (adminRole === 'super_admin') return true;
// //   const allowed = ROLE_MODULES[adminRole];
// //   if (!allowed) return false;
// //   return allowed.includes(module);
// // }

// /**
//  * permissions.js — Frontend role-based access control.
//  *
//  * Maps each admin sub-role to the modules they are allowed to access.
//  * Super Admin has implicit access to everything (handled by canAccessModule).
//  *
//  * Module keys must match the route segments and sidebar identifiers.
//  *
//  * site-pages: added for super_admin (implicit), ecommerce_manager,
//  *             and marketing_admin — they manage public-facing content.
//  */
 
// export const ROLE_MODULES = {
//   super_admin:       ['dashboard', 'orders', 'products', 'customers', 'categories', 'flash-sales', 'messages', 'site-pages', 'user-management', 'settings'],
//   ecommerce_manager: ['dashboard', 'orders', 'products', 'customers', 'categories', 'flash-sales', 'site-pages'],
//   product_admin:     ['dashboard', 'products', 'categories'],
//   marketing_admin:   ['dashboard', 'products', 'categories', 'flash-sales', 'customers', 'site-pages'],
//   customer_support:  ['dashboard', 'orders', 'customers', 'messages'],
//   finance_admin:     ['dashboard', 'orders', 'customers'],
//   it_admin:          ['dashboard', 'user-management', 'settings'],
//   fulfillment_staff: ['dashboard', 'orders', 'products'],
// };
 
// /**
//  * Check if an admin role is allowed access to a specific module.
//  * Super Admin always passes. Non-admins (null role) always fail.
//  *
//  * @param {string|null} adminRole — e.g. 'super_admin', 'marketing_admin'
//  * @param {string}      module    — e.g. 'site-pages', 'products'
//  * @returns {boolean}
//  */
// export function canAccessModule(adminRole, module) {
//   if (!adminRole) return false;
//   if (adminRole === 'super_admin') return true;
//   const allowed = ROLE_MODULES[adminRole];
//   if (!allowed) return false;
//   return allowed.includes(module);
// }

/**
 * permissions.js — Frontend role-based access control.
 *
 * Maps each admin sub-role to:
 *   1. MODULES they can navigate to (sidebar/route filtering)
 *   2. ACTIONS they can perform inside each module (UI button/tab gating)
 *
 * Super Admin has implicit access to everything.
 */

// ── Module access (sidebar + route guards) ──────────────────────────────────
export const ROLE_MODULES = {
  super_admin:       ['dashboard', 'orders', 'products', 'customers', 'categories', 'flash-sales', 'messages', 'site-pages', 'user-management', 'settings'],
  ecommerce_manager: ['dashboard', 'orders', 'products', 'customers', 'categories', 'flash-sales', 'site-pages'],
  product_admin:     ['dashboard', 'products', 'categories'],
  marketing_admin:   ['dashboard', 'products', 'categories', 'flash-sales', 'customers', 'site-pages'],
  customer_support:  ['dashboard', 'orders', 'customers', 'messages'],
  finance_admin:     ['dashboard', 'orders', 'customers'],
  it_admin:          ['dashboard', 'user-management', 'settings'],
  fulfillment_staff: ['dashboard', 'orders', 'products'],
};

// ── Action permissions (granular UI gating inside each module) ──────────────
// Format: module.action → array of roles that can perform it
// Super Admin is NOT listed — they pass all checks automatically
export const ROLE_ACTIONS = {
  // ── Products ─────────────────────────────────────────────────────────────
  'products.view':     ['ecommerce_manager', 'product_admin', 'marketing_admin', 'fulfillment_staff'],
  'products.create':   ['ecommerce_manager', 'product_admin', 'marketing_admin'],
  'products.edit':     ['ecommerce_manager', 'product_admin', 'marketing_admin'],
  'products.delete':   ['ecommerce_manager', 'product_admin'],
  'products.manage_stock': ['ecommerce_manager', 'product_admin', 'fulfillment_staff'],

  // ── Orders ───────────────────────────────────────────────────────────────
  'orders.view':       ['ecommerce_manager', 'customer_support', 'finance_admin', 'fulfillment_staff'],
  'orders.update_status': ['ecommerce_manager', 'fulfillment_staff'],
  'orders.process_refund': ['finance_admin'],
  'orders.cancel':     ['ecommerce_manager', 'customer_support'],

  // ── Customers ────────────────────────────────────────────────────────────
  'customers.view':    ['ecommerce_manager', 'marketing_admin', 'customer_support', 'finance_admin'],
  'customers.edit':    ['ecommerce_manager', 'customer_support'],
  'customers.deactivate': ['super_admin'],  // Only super admin can deactivate buyers
  'customers.delete':  ['super_admin'],

  // ── Categories ───────────────────────────────────────────────────────────
  'categories.view':   ['ecommerce_manager', 'product_admin', 'marketing_admin'],
  'categories.create': ['ecommerce_manager', 'product_admin', 'marketing_admin'],
  'categories.edit':   ['ecommerce_manager', 'product_admin', 'marketing_admin'],
  'categories.delete': ['ecommerce_manager', 'product_admin'],

  // ── Flash Sales ──────────────────────────────────────────────────────────
  'flash-sales.view':  ['ecommerce_manager', 'marketing_admin'],
  'flash-sales.create': ['ecommerce_manager', 'marketing_admin'],
  'flash-sales.edit':  ['ecommerce_manager', 'marketing_admin'],
  'flash-sales.delete': ['ecommerce_manager', 'marketing_admin'],

  // ── Messages ─────────────────────────────────────────────────────────────
  'messages.view':     ['customer_support'],
  'messages.reply':    ['customer_support'],
  'messages.delete':   ['customer_support'],

  // ── Site Pages ─────────────────────────────────────────────────────────────
  'site-pages.view':   ['ecommerce_manager', 'marketing_admin'],
  'site-pages.edit':   ['ecommerce_manager', 'marketing_admin'],

  // ── User Management ──────────────────────────────────────────────────────
  'user-management.view': ['super_admin', 'it_admin'],
  'user-management.create_admin': ['super_admin'],
  'user-management.edit_admin': ['super_admin'],
  'user-management.deactivate_admin': ['super_admin'],
  'user-management.delete_admin': ['super_admin'],

  // ── Settings ───────────────────────────────────────────────────────────────
  'settings.view':     ['super_admin', 'it_admin'],
  'settings.edit':   ['super_admin', 'it_admin'],
};

// ── Helper functions ────────────────────────────────────────────────────────

/**
 * Check if an admin role can access a module (sidebar/route level).
 * Super Admin always passes. Non-admins (null role) always fail.
 */
export function canAccessModule(adminRole, module) {
  if (!adminRole) return false;
  if (adminRole === 'super_admin') return true;
  const allowed = ROLE_MODULES[adminRole];
  if (!allowed) return false;
  return allowed.includes(module);
}

/**
 * Check if an admin role can perform a specific action.
 * Super Admin always passes. Non-admins always fail.
 *
 * @param {string|null} adminRole — e.g. 'ecommerce_manager'
 * @param {string}      action    — dot-notation: 'products.create', 'orders.process_refund'
 * @returns {boolean}
 */
export function canPerformAction(adminRole, action) {
  if (!adminRole) return false;
  if (adminRole === 'super_admin') return true;
  const allowed = ROLE_ACTIONS[action];
  if (!allowed) return false;
  return allowed.includes(adminRole);
}

/**
 * Get all modules an admin can access (for sidebar building).
 */
export function getAllowedModules(adminRole) {
  if (!adminRole) return [];
  if (adminRole === 'super_admin') return ROLE_MODULES.super_admin;
  return ROLE_MODULES[adminRole] || [];
}

/**
 * Get all actions an admin can perform within a module.
 */
export function getAllowedActions(adminRole, module) {
  if (!adminRole) return [];
  if (adminRole === 'super_admin') {
    return Object.keys(ROLE_ACTIONS).filter(a => a.startsWith(`${module}.`));
  }
  return Object.keys(ROLE_ACTIONS).filter(
    action => action.startsWith(`${module}.`) && ROLE_ACTIONS[action].includes(adminRole)
  );
}