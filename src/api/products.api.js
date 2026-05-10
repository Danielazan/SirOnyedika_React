
// import client from './client';


// export const getProducts = (params = {}) =>
//   client.get('/products', { params }).then(r => r.data);

// export const getProductBySlug = (slug) =>
//   client.get(`/products/${slug}`).then(r => r.data);

// // Admin
// export const getAdminProducts = (params = {}) =>
//   client.get('/admin/products', { params }).then(r => r.data);

// export const createProduct = (body) => client.post('/products', body).then(r => r.data);
// export const updateProduct = (id, body) => client.patch(`/products/${id}`, body).then(r => r.data);
// export const deleteProduct = (id) => client.delete(`/products/${id}`).then(r => r.data);

// // Variants
// export const createVariant = (productId, body) =>
//   client.post(`/products/${productId}/variants`, body).then(r => r.data);

// export const uploadVariantImages = (variantId, formData) =>
//   client.post(`/products/variants/${variantId}/images`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }).then(r => r.data);

// export const deleteVariant = (variantId) =>
//   client.delete(`/products/variants/${variantId}`).then(r => r.data);

// export const deleteVariantImage = (imageId) =>
//   client.delete(`/products/images/${imageId}`).then(r => r.data);


// src/api/products.api.js
// All HTTP calls for the /products resource.
import client from './client';

export const getProducts = (params = {}) =>
  client.get('/products', { params }).then(r => r.data);

export const getProductBySlug = (slug) =>
  client.get(`/products/${slug}`).then(r => r.data);

// Admin
export const getAdminProducts = (params = {}) =>
  client.get('/admin/products', { params }).then(r => r.data);

export const createProduct = (body) => client.post('/products', body).then(r => r.data);
export const updateProduct = (id, body) => client.patch(`/products/${id}`, body).then(r => r.data);
export const deleteProduct = (id) => client.delete(`/products/${id}`).then(r => r.data);

// Variants
export const createVariant = (productId, body) =>
  client.post(`/products/${productId}/variants`, body).then(r => r.data);

export const updateVariant = (variantId, body) =>
  client.patch(`/products/variants/${variantId}`, body).then(r => r.data);

export const deleteVariant = (variantId) =>
  client.delete(`/products/variants/${variantId}`).then(r => r.data);

// Images — DO NOT manually set Content-Type for FormData.
// Axios automatically injects the correct multipart boundary.
export const uploadVariantImages = (variantId, formData) =>
  client.post(`/products/variants/${variantId}/images`, formData).then(r => r.data);

export const deleteVariantImage = (imageId) =>
  client.delete(`/products/images/${imageId}`).then(r => r.data);