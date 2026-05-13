// sitepages.api.js
// src/api/sitepages.api.js
// ─────────────────────────────────────────────────────────────────────────────
// Public + Admin site page (policy) endpoints.
//
// GET  /pages/:key   — public, no auth required
// PUT  /pages/:key   — admin only (token is attached by client interceptor)
// ─────────────────────────────────────────────────────────────────────────────
import client from './client';

/**
 * Fetch a single site page by key.
 * Used by the public-facing policy pages to render content.
 *
 * @param {string} key — e.g. 'privacy_policy'
 * @returns {Promise<{ success: boolean, data: { key, title, content, updatedAt } }>}
 */
export const getSitePage = (key) =>
  client.get(`/pages/${key}`).then((r) => r.data);

/**
 * Update a site page (admin only).
 * The bearer token in localStorage is attached automatically by the
 * Axios request interceptor in client.js.
 *
 * @param {string} key  — e.g. 'privacy_policy'
 * @param {{ title?: string, content: string }} body
 * @returns {Promise<{ success: boolean, data: SitePage }>}
 */
export const updateSitePage = (key, body) =>
  client.put(`/pages/${key}`, body).then((r) => r.data);