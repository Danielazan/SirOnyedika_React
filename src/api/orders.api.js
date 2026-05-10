// All HTTP calls for the /orders resource.
// Components never call these directly — use hooks/orders/* instead.
import client from './client';

/** GET /orders — buyer's own orders, optional ?status= filter */
export const getOrders = (params = {}) =>
  client.get('/orders', { params }).then((r) => r.data);

/** GET /orders/:id — single order with items, timeline, payments */
export const getOrderById = (id) =>
  client.get(`/orders/${id}`).then((r) => r.data);

/** POST /orders — create a new order from current cart */
export const createOrder = (body) =>
  client.post('/orders', body).then((r) => r.data);

/** GET /orders/:id/invoice — download PDF invoice */
export const downloadInvoice = (id) =>
  client.get(`/orders/${id}/invoice`, { responseType: 'blob' }).then((r) => r.data);
