// // Custom hook — fetches category tree from the API.
// // Falls back to MOCK_CATEGORIES when the backend is unreachable (dev mode).
// import { useState, useEffect } from 'react';
// import { getCategories } from '../../api/categories.api';

// // ── Mock data (mirrors the shape returned by GET /categories) ────────────────
// const MOCK_CATEGORIES = [
//   {
//     id: 'cat-men',
//     name: 'Men',
//     slug: 'men',
//     parentId: null,
//     children: [
//       { id: 'sub-men-jackets', name: 'Jackets',  slug: 'men-jackets',  parentId: 'cat-men' },
//       { id: 'sub-men-shirts',  name: 'Shirts',   slug: 'men-shirts',   parentId: 'cat-men' },
//       { id: 'sub-men-pants',   name: 'Pants',    slug: 'men-pants',    parentId: 'cat-men' },
//       { id: 'sub-men-shoes',   name: 'Shoes',    slug: 'men-shoes',    parentId: 'cat-men' },
//     ],
//   },
//   {
//     id: 'cat-women',
//     name: 'Women',
//     slug: 'women',
//     parentId: null,
//     children: [
//       { id: 'sub-women-dresses', name: 'Dresses', slug: 'women-dresses', parentId: 'cat-women' },
//       { id: 'sub-women-tops',    name: 'Tops',    slug: 'women-tops',    parentId: 'cat-women' },
//       { id: 'sub-women-shirts',  name: 'Shirts',  slug: 'women-shirts',  parentId: 'cat-women' },
//       { id: 'sub-women-shoes',   name: 'Shoes',   slug: 'women-shoes',   parentId: 'cat-women' },
//     ],
//   },
//   {
//     id: 'cat-kids',
//     name: 'Kids',
//     slug: 'kids',
//     parentId: null,
//     children: [
//       { id: 'sub-kids-tops',    name: 'Tops',    slug: 'kids-tops',    parentId: 'cat-kids' },
//       { id: 'sub-kids-bottoms', name: 'Bottoms', slug: 'kids-bottoms', parentId: 'cat-kids' },
//       { id: 'sub-kids-shoes',   name: 'Shoes',   slug: 'kids-shoes',   parentId: 'cat-kids' },
//     ],
//   },
//   {
//     id: 'cat-accessories',
//     name: 'Accessories',
//     slug: 'accessories',
//     parentId: null,
//     children: [
//       { id: 'sub-acc-bags',  name: 'Bags',    slug: 'acc-bags',  parentId: 'cat-accessories' },
//       { id: 'sub-acc-belts', name: 'Belts',   slug: 'acc-belts', parentId: 'cat-accessories' },
//       { id: 'sub-acc-hats',  name: 'Hats',    slug: 'acc-hats',  parentId: 'cat-accessories' },
//     ],
//   },
//   {
//     id: 'cat-bath',
//     name: 'Bath & Body',
//     slug: 'bath-body',
//     parentId: null,
//     children: [
//       { id: 'sub-bath-care',   name: 'Skin Care', slug: 'bath-skincare', parentId: 'cat-bath' },
//       { id: 'sub-bath-shower', name: 'Shower',    slug: 'bath-shower',   parentId: 'cat-bath' },
//     ],
//   },
//   {
//     id: 'cat-services',
//     name: 'Services',
//     slug: 'services',
//     parentId: null,
//     children: [
//       { id: 'sub-svc-styling',  name: 'Styling',  slug: 'svc-styling',  parentId: 'cat-services' },
//       { id: 'sub-svc-tailoring', name: 'Tailoring', slug: 'svc-tailoring', parentId: 'cat-services' },
//     ],
//   },
// ];

// export function useCategories() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [error, setError]           = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);

//     getCategories()
//       .then((res) => {
//         if (!cancelled) setCategories(res.data ?? MOCK_CATEGORIES);
//       })
//       .catch(() => {
//         // Backend not available — use mock data so the UI still works
//         if (!cancelled) setCategories(MOCK_CATEGORIES);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => { cancelled = true; };
//   }, []);

//   return { categories, loading, error };
// }


// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import * as api from '../../api/categories.api';

// export const useCategories = () => {
//   return useQuery({
//     queryKey: ['categories'],
//     queryFn: api.getCategories,
//     staleTime: 5 * 60 * 1000, // 5 min
//   });
// };

// export const useCreateCategory = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: api.createCategory,
//     onSuccess: () => queryClient.invalidateQueries(['categories']),
//   });
// };


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../api/categories.api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
    staleTime: 5 * 60 * 1000, // 5 min
    // ═══════════════════════════════════════════════════════════════════════
    //  FIX: Backend wraps response as { success: true, data: [...] }
    //  Extract the actual array so consumers get an array, not an object.
    // ═══════════════════════════════════════════════════════════════════════
    select: (res) => {
      const payload = res?.data ?? res;
      return Array.isArray(payload) ? payload : [];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => queryClient.invalidateQueries(['categories']),
  });
};