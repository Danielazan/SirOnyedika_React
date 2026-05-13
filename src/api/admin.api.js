// // src/api/admin.api.js
// // ─────────────────────────────────────────────────────────────────────────────
// // Admin-only user & admin management endpoints.
// // Super Admin: full CRUD on admin accounts + user management.
// // Other admins: view-only on user list (role-gated on backend).
// // ─────────────────────────────────────────────────────────────────────────────
// import client from './client';

// // ── Admin Accounts ────────────────────────────────────────────────────────────

// /** List all admin accounts (super_admin only) */
// export const getAdmins = (params = {}) =>
//   client.get('/admin/users', { params: { role: 'admin', ...params } }).then((r) => r.data);

// /** Create a new admin account */
// export const createAdmin = (body) =>
//   client.post('/admin/users', body).then((r) => r.data);

// /** Update an admin's role / details */
// export const updateAdmin = (id, body) =>
//   client.patch(`/admin/users/${id}`, body).then((r) => r.data);

// /** Deactivate (soft-disable) an admin account */
// export const deactivateAdmin = (id) =>
//   client.patch(`/admin/users/${id}/deactivate`).then((r) => r.data);

// /** Re-activate a previously deactivated admin */
// export const reactivateAdmin = (id) =>
//   client.patch(`/admin/users/${id}/reactivate`).then((r) => r.data);

// /** Permanently delete an admin account */
// export const deleteAdmin = (id) =>
//   client.delete(`/admin/users/${id}`).then((r) => r.data);

// // ── Regular Users ─────────────────────────────────────────────────────────────

// /** List regular users with optional search / status / page */
// export const getUsers = (params = {}) =>
//   client.get('/admin/customers', { params }).then((r) => r.data);

// /** Deactivate a regular user account */
// export const deactivateUser = (id) =>
//   client.patch(`/admin/customers/${id}/deactivate`).then((r) => r.data);

// /** Re-activate a regular user */
// export const reactivateUser = (id) =>
//   client.patch(`/admin/customers/${id}/reactivate`).then((r) => r.data);

// /** Permanently delete a regular user */
// export const deleteUser = (id) =>
//   client.delete(`/admin/customers/${id}`).then((r) => r.data);


// src/api/admin.api.js
// ─────────────────────────────────────────────────────────────────────────────
// Admin-only user & admin management endpoints.
// Super Admin: full CRUD on admin accounts + user management.
// Other admins: view-only on user list (role-gated on backend).
// ─────────────────────────────────────────────────────────────────────────────
import client from './client';

// ── Admin Accounts ────────────────────────────────────────────────────────────

/** List all admin accounts (super_admin only) */
export const getAdmins = (params = {}) =>
  client.get('/admin/users', { params }).then((r) => r.data);

/** Create a new admin account */
export const createAdmin = (body) =>
  client.post('/admin/users', body).then((r) => r.data);

/** Update an admin's details (name, phone, role) */
export const updateAdmin = (id, body) =>
  client.patch(`/admin/users/${id}`, body).then((r) => r.data);

/** Deactivate (soft-disable) an admin account */
export const deactivateAdmin = (id) =>
  client.patch(`/admin/users/${id}/deactivate`).then((r) => r.data);

/** Re-activate a previously deactivated admin */
export const reactivateAdmin = (id) =>
  client.patch(`/admin/users/${id}/reactivate`).then((r) => r.data);

/** Permanently delete an admin account */
export const deleteAdmin = (id) =>
  client.delete(`/admin/users/${id}`).then((r) => r.data);

// ── Regular Users ─────────────────────────────────────────────────────────────

/** List regular users with optional search / status / page */
export const getUsers = (params = {}) =>
  client.get('/admin/customers', { params }).then((r) => r.data);

/** Deactivate a regular user account */
export const deactivateUser = (id) =>
  client.patch(`/admin/customers/${id}/deactivate`).then((r) => r.data);

/** Re-activate a regular user */
export const reactivateUser = (id) =>
  client.patch(`/admin/customers/${id}/reactivate`).then((r) => r.data);

/** Permanently delete a regular user */
export const deleteUser = (id) =>
  client.delete(`/admin/customers/${id}`).then((r) => r.data);