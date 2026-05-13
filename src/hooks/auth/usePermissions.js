// import { useAuth } from '../../contexts/AuthContext';
// import { canAccessModule } from '../../utils/permissions';

// /**
//  * usePermissions — React hook for role-based UI gating.
//  *
//  * Returns helpers to check if the current admin user is allowed
//  * to view a module, a set of modules, or specific actions.
//  *
//  * Example:
//  *   const { canAccess, isAdmin } = usePermissions();
//  *   if (canAccess('products')) { ... }
//  */
// export function usePermissions() {
//   const { user, isAdmin } = useAuth();
//   const role = user?.adminRole || null;

//   const check = (module) => canAccessModule(role, module);

//   return {
//     role,
//     isAdmin: isAdmin(),
//     canAccess: check,
//     canAccessAny: (modules) => modules.some((m) => check(m)),
//     canAccessAll: (modules) => modules.every((m) => check(m)),
//   };
// }

import { useAuth } from '../../contexts/AuthContext';
import { canAccessModule, canPerformAction, getAllowedActions } from '../../utils/permissions';

/**
 * usePermissions — React hook for role-based UI gating.
 *
 * Returns helpers to check:
 *   - Module access (sidebar, route guards)
 *   - Action permissions (buttons, tabs, forms inside pages)
 *
 * Example:
 *   const { canAccess, canDo, isAdmin, isSuperAdmin } = usePermissions();
 *   if (canAccess('products')) { showProductsLink() }
 *   if (canDo('products.create')) { showCreateButton() }
 */
export function usePermissions() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const role = user?.adminRole || null;

  const checkModule = (module) => canAccessModule(role, module);
  const checkAction = (action) => canPerformAction(role, action);

  return {
    // Identity
    role,
    isAdmin: isAdmin(),
    isSuperAdmin: isSuperAdmin(),

    // Module-level (sidebar, routes)
    canAccess: checkModule,
    canAccessAny: (modules) => modules.some((m) => checkModule(m)),
    canAccessAll: (modules) => modules.every((m) => checkModule(m)),

    // Action-level (buttons, tabs, forms)
    canDo: checkAction,
    canDoAny: (actions) => actions.some((a) => checkAction(a)),
    canDoAll: (actions) => actions.every((a) => checkAction(a)),

    // Get all allowed actions for current module (useful for conditional tabs)
    getActionsForModule: (module) => getAllowedActions(role, module),
  };
}