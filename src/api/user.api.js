// All HTTP calls for /users/me/* endpoints.
// Covers addresses, wishlists, avatar, recently viewed, saved searches.
import client from './client';

// ── Profile ───────────────────────────────────────────────────────────────────
export const getMe = () =>
  client.get('/auth/me').then((r) => r.data);

export const updateProfile = (body) =>
  client.patch('/auth/me', body).then((r) => r.data);

export const uploadAvatar = (formData) =>
  client.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);

export const deleteAvatar = () =>
  client.delete('/users/me/avatar').then((r) => r.data);

// ── Addresses ─────────────────────────────────────────────────────────────────
export const getAddresses = () =>
  client.get('/users/me/addresses').then((r) => r.data);

export const addAddress = (body) =>
  client.post('/users/me/addresses', body).then((r) => r.data);

export const updateAddress = (id, body) =>
  client.patch(`/users/me/addresses/${id}`, body).then((r) => r.data);

export const deleteAddress = (id) =>
  client.delete(`/users/me/addresses/${id}`).then((r) => r.data);

export const setDefaultAddress = (id) =>
  client.patch(`/users/me/addresses/${id}/default`).then((r) => r.data);

// ── Wishlists ─────────────────────────────────────────────────────────────────
export const getWishlists = () =>
  client.get('/users/me/wishlists').then((r) => r.data);

export const createWishlist = (body) =>
  client.post('/users/me/wishlists', body).then((r) => r.data);

export const deleteWishlist = (id) =>
  client.delete(`/users/me/wishlists/${id}`).then((r) => r.data);

export const addToWishlist = (body) =>
  client.post('/users/me/wishlists/items', body).then((r) => r.data);

export const removeFromWishlist = (itemId) =>
  client.delete(`/users/me/wishlists/items/${itemId}`).then((r) => r.data);
