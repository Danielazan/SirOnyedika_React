// // src/hooks/admin/useAdminData.js
// // Custom hooks for every admin domain.
// // Each hook attempts a real API call first; on failure it falls back to mock data.
// // This pattern means zero changes needed when the backend is fully running.

// import { useState, useEffect, useCallback } from 'react';
// import {
//   MOCK_DASHBOARD,
//   MOCK_ORDERS,
//   MOCK_PRODUCTS,
//   MOCK_CUSTOMERS,
//   MOCK_CUSTOMER_STATS,
//   MOCK_CATEGORIES,
//   MOCK_FLASH_SALES,
//   MOCK_CONVERSATIONS,
// } from '../../data/mockData';

// // ── Axios client (reuse the one already in the project) ──────────────────────
// let client;
// try {
//   client = (await import('../../api/client.js')).default;
// } catch {
//   // If standalone, create a minimal client
//   const axios = (await import('axios')).default;
//   client = axios.create({
//     baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:1500/api',
//     headers: { 'Content-Type': 'application/json' },
//     timeout: 8_000,
//   });
//   client.interceptors.request.use((config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   });
// }

// // ── Generic fetch helper ────────────────────────────────────────────────────
// function useFetch(endpoint, fallback, deps = []) {
//   const [data, setData]       = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState(null);

//   const fetch = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await client.get(endpoint);
//       setData(res.data?.data ?? res.data);
//     } catch {
//       setData(typeof fallback === 'function' ? fallback() : fallback);
//     } finally {
//       setLoading(false);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [endpoint, ...deps]);

//   useEffect(() => { fetch(); }, [fetch]);

//   return { data, loading, error, refetch: fetch };
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// //  DASHBOARD
// // ═══════════════════════════════════════════════════════════════════════════════
// export function useDashboard() {
//   return useFetch('/admin/dashboard', MOCK_DASHBOARD);
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// //  ORDERS
// // ═══════════════════════════════════════════════════════════════════════════════
// export function useAdminOrders(statusFilter = '', page = 1, search = '') {
//   const [orders, setOrders]         = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     const params = {};
//     if (statusFilter) params.status = statusFilter;
//     if (search) params.search = search;
//     params.page = page;

//     client.get('/admin/orders', { params })
//       .then((res) => {
//         if (!cancelled) {
//           setOrders(res.data?.data?.orders ?? res.data?.orders ?? []);
//           setPagination(res.data?.data?.pagination ?? { total: 0, page: 1, pages: 1 });
//         }
//       })
//       .catch(() => {
//         if (!cancelled) {
//           let filtered = [...MOCK_ORDERS];
//           if (statusFilter) filtered = filtered.filter(o => o.status === statusFilter);
//           if (search) filtered = filtered.filter(o =>
//             o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
//             o.id.toLowerCase().includes(search.toLowerCase())
//           );
//           setOrders(filtered);
//           setPagination({ total: filtered.length, page: 1, pages: 1 });
//         }
//       })
//       .finally(() => { if (!cancelled) setLoading(false); });

//     return () => { cancelled = true; };
//   }, [statusFilter, page, search]);

//   return { orders, loading, pagination };
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// //  PRODUCTS (admin view — all fields)
// // ═══════════════════════════════════════════════════════════════════════════════
// export function useAdminProducts(page = 1, search = '', category = '') {
//   const [products, setProducts]     = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     const params = { page };
//     if (search) params.search = search;
//     if (category) params.category = category;

//     client.get('/admin/products', { params })
//       .then((res) => {
//         if (!cancelled) {
//           setProducts(res.data?.data?.products ?? res.data?.products ?? []);
//           setPagination(res.data?.data?.pagination ?? { total: 0, page: 1, pages: 1 });
//         }
//       })
//       .catch(() => {
//         if (!cancelled) {
//           let filtered = [...MOCK_PRODUCTS];
//           if (search)   filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
//           if (category) filtered = filtered.filter(p => p.category === category);
//           setProducts(filtered);
//           setPagination({ total: filtered.length, page: 1, pages: 1 });
//         }
//       })
//       .finally(() => { if (!cancelled) setLoading(false); });

//     return () => { cancelled = true; };
//   }, [page, search, category]);

//   return { products, loading, pagination };
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// //  CUSTOMERS
// // ═══════════════════════════════════════════════════════════════════════════════
// export function useAdminCustomers(page = 1, search = '', status = '') {
//   const [customers, setCustomers]   = useState([]);
//   const [stats, setStats]           = useState(MOCK_CUSTOMER_STATS);
//   const [loading, setLoading]       = useState(true);
//   const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     const params = { page };
//     if (search) params.search = search;
//     if (status) params.status = status;

//     Promise.all([
//       client.get('/admin/customers', { params }),
//       client.get('/admin/customers/stats'),
//     ])
//       .then(([listRes, statsRes]) => {
//         if (!cancelled) {
//           setCustomers(listRes.data?.data?.customers ?? listRes.data?.customers ?? []);
//           setPagination(listRes.data?.data?.pagination ?? { total: 0, page: 1, pages: 1 });
//           setStats(statsRes.data?.data ?? MOCK_CUSTOMER_STATS);
//         }
//       })
//       .catch(() => {
//         if (!cancelled) {
//           let filtered = [...MOCK_CUSTOMERS];
//           if (search) filtered = filtered.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
//           if (status) filtered = filtered.filter(c => c.status.toLowerCase() === status.toLowerCase());
//           setCustomers(filtered);
//           setPagination({ total: filtered.length, page: 1, pages: 1 });
//         }
//       })
//       .finally(() => { if (!cancelled) setLoading(false); });

//     return () => { cancelled = true; };
//   }, [page, search, status]);

//   return { customers, stats, loading, pagination };
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// //  CATEGORIES
// // ═══════════════════════════════════════════════════════════════════════════════
// export function useAdminCategories() {
//   return useFetch('/admin/categories', MOCK_CATEGORIES);
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// //  FLASH SALES
// // ═══════════════════════════════════════════════════════════════════════════════
// export function useAdminFlashSales() {
//   return useFetch('/admin/flash-sales', MOCK_FLASH_SALES);
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// //  MESSAGES / CONVERSATIONS
// // ═══════════════════════════════════════════════════════════════════════════════
// export function useAdminMessages(search = '') {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading]             = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);

//     client.get('/admin/messages')
//       .then((res) => {
//         if (!cancelled) setConversations(res.data?.data ?? res.data ?? []);
//       })
//       .catch(() => {
//         if (!cancelled) {
//           let filtered = [...MOCK_CONVERSATIONS];
//           if (search) filtered = filtered.filter(c =>
//             c.customer.name.toLowerCase().includes(search.toLowerCase())
//           );
//           setConversations(filtered);
//         }
//       })
//       .finally(() => { if (!cancelled) setLoading(false); });

//     return () => { cancelled = true; };
//   }, [search]);

//   return { conversations, loading };
// }


// src/hooks/admin/useAdminData.js
// Custom hooks for every admin domain.
// Each hook attempts a real API call first; on failure it falls back to mock data.
// This pattern means zero changes needed when the backend is fully running.

import { useState, useEffect, useCallback } from 'react';
import {
  MOCK_DASHBOARD,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_CUSTOMERS,
  MOCK_CUSTOMER_STATS,
  MOCK_CATEGORIES,
  MOCK_FLASH_SALES,
  MOCK_CONVERSATIONS,
} from '../../data/mockData';

// ── Axios client (reuse the one already in the project) ──────────────────────
let client;
try {
  client = (await import('../../api/client.js')).default;
} catch {
  // If standalone, create a minimal client
  const axios = (await import('axios')).default;
  client = axios.create({
    baseURL: import.meta.env?.VITE_API_URL || 'http://localhost:1500/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 8_000,
  });
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

// ── Generic fetch helper ────────────────────────────────────────────────────
function useFetch(endpoint, fallback, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await client.get(endpoint);
      setData(res.data?.data ?? res.data);
    } catch {
      setData(typeof fallback === 'function' ? fallback() : fallback);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, ...deps]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
export function useDashboard() {
  return useFetch('/admin/dashboard', MOCK_DASHBOARD);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════════════════════════════════
export function useAdminOrders(statusFilter = '', page = 1, search = '') {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (search) params.search = search;
    params.page = page;

    client.get('/admin/orders', { params })
      .then((res) => {
        if (!cancelled) {
          setOrders(res.data?.data?.orders ?? res.data?.orders ?? []);
          setPagination(res.data?.data?.pagination ?? { total: 0, page: 1, pages: 1 });
        }
      })
      .catch(() => {
        if (!cancelled) {
          let filtered = [...MOCK_ORDERS];
          if (statusFilter) filtered = filtered.filter(o => o.status === statusFilter);
          if (search) filtered = filtered.filter(o =>
            o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
            o.id.toLowerCase().includes(search.toLowerCase())
          );
          setOrders(filtered);
          setPagination({ total: filtered.length, page: 1, pages: 1 });
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [statusFilter, page, search]);

  return { orders, loading, pagination };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PRODUCTS (admin view — all fields)
// ═══════════════════════════════════════════════════════════════════════════════
export function useAdminProducts(page = 1, search = '', category = '') {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  // useCallback so refetch() can be called imperatively from the page
  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    const params = { page };
    if (search)   params.search   = search;
    if (category) params.category = category;

    client.get('/admin/products', { params })
      .then((res) => {
        if (!cancelled) {
          const raw = res.data?.data;
          setProducts(raw?.products ?? res.data?.products ?? []);
          // Backend returns totalPages; normalise to pages for Pagination component
          const pg = raw?.pagination ?? res.data?.pagination ?? {};
          setPagination({
            total: pg.total ?? 0,
            page:  pg.page  ?? 1,
            pages: pg.pages ?? pg.totalPages ?? 1,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          let filtered = [...MOCK_PRODUCTS];
          if (search)   filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
          if (category) filtered = filtered.filter(p => p.category === category);
          setProducts(filtered);
          setPagination({ total: filtered.length, page: 1, pages: 1 });
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, category]);

  useEffect(() => {
    const cancel = load();
    return cancel;
  }, [load]);

  return { products, loading, pagination, refetch: load };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CUSTOMERS
// ═══════════════════════════════════════════════════════════════════════════════
export function useAdminCustomers(page = 1, search = '', status = '') {
  const [customers, setCustomers]   = useState([]);
  const [stats, setStats]           = useState(MOCK_CUSTOMER_STATS);
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = { page };
    if (search) params.search = search;
    if (status) params.status = status;

    Promise.all([
      client.get('/admin/customers', { params }),
      client.get('/admin/customers/stats'),
    ])
      .then(([listRes, statsRes]) => {
        if (!cancelled) {
          setCustomers(listRes.data?.data?.customers ?? listRes.data?.customers ?? []);
          setPagination(listRes.data?.data?.pagination ?? { total: 0, page: 1, pages: 1 });
          setStats(statsRes.data?.data ?? MOCK_CUSTOMER_STATS);
        }
      })
      .catch(() => {
        if (!cancelled) {
          let filtered = [...MOCK_CUSTOMERS];
          if (search) filtered = filtered.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
          if (status) filtered = filtered.filter(c => c.status.toLowerCase() === status.toLowerCase());
          setCustomers(filtered);
          setPagination({ total: filtered.length, page: 1, pages: 1 });
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [page, search, status]);

  return { customers, stats, loading, pagination };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════
// export function useAdminCategories() {
//   return useFetch('/admin/categories', MOCK_CATEGORIES);
// }
export function useAdminCategories() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    client.get('/admin/categories')
      .then((res) => {
        if (cancelled) return;
        const payload = res.data?.data ?? res.data;
        // Defensive: backend may return array directly or wrapped in { data: [...] }
        const normalized = Array.isArray(payload) ? payload : [];
        setData(normalized);
      })
      .catch((err) => {
        if (cancelled) return;
        // Log so you can see auth/network issues in DevTools
        console.error('[useAdminCategories] API error:', err.message);
        const fallback = Array.isArray(MOCK_CATEGORIES) ? MOCK_CATEGORIES : [];
        setData(fallback);
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  return { data, loading, error, refetch: load };
}
// ═══════════════════════════════════════════════════════════════════════════════
//  FLASH SALES
// ═══════════════════════════════════════════════════════════════════════════════
export function useAdminFlashSales() {
  return useFetch('/admin/flash-sales', MOCK_FLASH_SALES);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MESSAGES / CONVERSATIONS
// ═══════════════════════════════════════════════════════════════════════════════
export function useAdminMessages(search = '') {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    client.get('/admin/messages')
      .then((res) => {
        if (!cancelled) setConversations(res.data?.data ?? res.data ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          let filtered = [...MOCK_CONVERSATIONS];
          if (search) filtered = filtered.filter(c =>
            c.customer.name.toLowerCase().includes(search.toLowerCase())
          );
          setConversations(filtered);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [search]);

  return { conversations, loading };
}