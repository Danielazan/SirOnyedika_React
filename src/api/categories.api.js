// // All HTTP calls for the /categories resource.
// // Components never call these directly — use hooks/categories/* instead.
// import client from './client';

// /** GET /categories — returns nested tree */
// // export const getCategories = () =>
// //   client.get('/categories').then((r) => r.data);

// // /** GET /categories/:slug — single category with children + size guide */
// // export const getCategoryBySlug = (slug) =>
// //   client.get(`/categories/${slug}`).then((r) => r.data);

// export const getCategories = () => 
//   client.get('/categories').then(r => r.data);

// export const getCategoryBySlug = (slug) => 
//   client.get(`/categories/${slug}`).then(r => r.data);

// /** POST /categories (admin) */
// export const createCategory = (formData) =>
//   client.post('/categories', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }).then((r) => r.data);

// /** PATCH /categories/:id (admin) */
// export const updateCategory = (id, formData) =>
//   client.patch(`/categories/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }).then((r) => r.data);

// /** DELETE /categories/:id (admin) */
// export const deleteCategory = (id) =>
//   client.delete(`/categories/${id}`).then((r) => r.data);

// /** PATCH /categories/reorder (admin) */
// export const reorderCategories = (orderedIds) =>
//   client.patch('/categories/reorder', { orderedIds }).then((r) => r.data);
import client from './client';

export const getCategories = () => client.get('/categories').then(r => r.data);

export const getCategoryBySlug = (slug) =>
  client.get(`/categories/${slug}`).then(r => r.data);

export const createCategory = (formData) =>
  client.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);

export const updateCategory = (id, formData) =>
  client.patch(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);

export const deleteCategory = (id) => client.delete(`/categories/${id}`).then(r => r.data);

export const reorderCategories = (orderedIds) =>
  client.patch('/categories/reorder', { orderedIds }).then(r => r.data);