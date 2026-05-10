// import { useState, useEffect } from 'react';
// import { getProducts } from '../../api/products.api';
// import { useQuery } from '@tanstack/react-query';
// import client from '../../api/client';

// export const useProducts = (filters) => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getProducts(filters);
//         setData(response.data);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [filters.subcategory]); // Re-fetch when subcategory changes

//   return { data, isLoading, error };
// };

// export const useProducts = (params = {}) => {
//   return useQuery({
//     queryKey: ['products', params],
//     queryFn: () => client.get('/products', { params }).then(res => res.data.data || res.data),
//     keepPreviousData: true,
//   });
// };


import { useState, useEffect } from 'react';
import { getProducts } from '../../api/products.api';
import { useQuery } from '@tanstack/react-query';
import client from '../../api/client';

// ═══════════════════════════════════════════════════════════════════════════════
//  FIX: Added `select` to extract the actual products array from the
//  backend's { success: true, data: [...], pagination: {...} } wrapper.
// ═══════════════════════════════════════════════════════════════════════════════
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    keepPreviousData: true,
    select: (res) => {
      const payload = res?.data ?? res;
      return Array.isArray(payload) ? payload : [];
    },
  });
};

export const useProductBySlug = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => client.get(`/products/${slug}`).then(res => res.data.data || res.data),
    enabled: !!slug,
  });
};