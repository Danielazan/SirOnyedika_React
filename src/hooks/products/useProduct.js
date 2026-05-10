// Custom hook — fetches a paginated product list from the API.
// Falls back to MOCK_PRODUCTS filtered by subcategoryIds when backend is unreachable.
import { useState, useEffect } from 'react';
import { getProducts } from '../../api/products.api';

// Single placeholder image repeated across all mock products (as instructed)
const IMG = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&q=80';

// ── Mock products (shape mirrors GET /products response) ─────────────────────
const MOCK_PRODUCTS = [
  // Women — Dresses
  { id: 'p1',  slug: 'long-black-dress-1',     name: 'Long Black Dress 1_Set',      price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-dresses', categorySlug: 'women', image: IMG },
  { id: 'p2',  slug: 'midi-red-dress',          name: 'Midi Red Dress',              price: 75, salePrice: 60,  isOnSale: true,  subcategorySlug: 'women-dresses', categorySlug: 'women', image: IMG },
  { id: 'p3',  slug: 'elegant-evening-gown',    name: 'Elegant Evening Gown',        price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-dresses', categorySlug: 'women', image: IMG },
  { id: 'p4',  slug: 'bodycon-bandage-dress',   name: 'Bodycon Bandage Dress 2_Set', price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-dresses', categorySlug: 'women', image: IMG },
  { id: 'p5',  slug: 'wrap-floral-dress',       name: 'Wrap Floral Dress',           price: 75, salePrice: 55,  isOnSale: true,  subcategorySlug: 'women-dresses', categorySlug: 'women', image: IMG },
  { id: 'p6',  slug: 'long-sleeve-maxi',        name: 'Long Sleeve Maxi Dress',      price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-dresses', categorySlug: 'women', image: IMG },
  { id: 'p7',  slug: 'satin-slip-dress',        name: 'Satin Slip Dress',            price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-dresses', categorySlug: 'women', image: IMG },
  { id: 'p8',  slug: 'off-shoulder-dress',      name: 'Off Shoulder Mini Dress',     price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-dresses', categorySlug: 'women', image: IMG },
  { id: 'p9',  slug: 'lace-bodycon-dress',      name: 'Lace Bodycon Dress',          price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-dresses', categorySlug: 'women', image: IMG },
  // Women — Tops
  { id: 'p10', slug: 'basic-crop-top',          name: 'Basic Crop Top',              price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-tops',    categorySlug: 'women', image: IMG },
  { id: 'p11', slug: 'v-neck-blouse',           name: 'V-Neck Floral Blouse',        price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-tops',    categorySlug: 'women', image: IMG },
  { id: 'p12', slug: 'puff-sleeve-top',         name: 'Puff Sleeve Satin Top',       price: 75, salePrice: 60,  isOnSale: true,  subcategorySlug: 'women-tops',    categorySlug: 'women', image: IMG },
  // Women — Shirts
  { id: 'p13', slug: 'oversized-button-shirt',  name: 'Oversized Button Shirt',      price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-shirts',  categorySlug: 'women', image: IMG },
  { id: 'p14', slug: 'striped-casual-shirt',    name: 'Striped Casual Shirt',        price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-shirts',  categorySlug: 'women', image: IMG },
  { id: 'p15', slug: 'silk-button-down',        name: 'Silk Button Down Shirt',      price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-shirts',  categorySlug: 'women', image: IMG },
  // Women — Shoes
  { id: 'p16', slug: 'stiletto-heel-pump',      name: 'Stiletto Heel Pump',          price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-shoes',   categorySlug: 'women', image: IMG },
  { id: 'p17', slug: 'block-heel-mule',         name: 'Block Heel Mule',             price: 75, salePrice: 60,  isOnSale: true,  subcategorySlug: 'women-shoes',   categorySlug: 'women', image: IMG },
  { id: 'p18', slug: 'strappy-sandal',          name: 'Strappy Sandal',              price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'women-shoes',   categorySlug: 'women', image: IMG },
  // Men
  { id: 'p19', slug: 'classic-suit-jacket',     name: 'Classic Suit Jacket',         price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'men-jackets',   categorySlug: 'men',   image: IMG },
  { id: 'p20', slug: 'bomber-jacket',           name: 'Bomber Jacket',               price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'men-jackets',   categorySlug: 'men',   image: IMG },
  { id: 'p21', slug: 'slim-fit-chinos',         name: 'Slim Fit Chinos',             price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'men-pants',     categorySlug: 'men',   image: IMG },
  { id: 'p22', slug: 'oxford-dress-shirt',      name: 'Oxford Dress Shirt',          price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'men-shirts',    categorySlug: 'men',   image: IMG },
  { id: 'p23', slug: 'men-leather-loafer',      name: 'Leather Loafer',              price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'men-shoes',     categorySlug: 'men',   image: IMG },
  { id: 'p24', slug: 'men-sneakers',            name: 'Classic White Sneaker',       price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'men-shoes',     categorySlug: 'men',   image: IMG },
  // Kids
  { id: 'p25', slug: 'kids-graphic-tee',        name: 'Kids Graphic Tee',            price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'kids-tops',     categorySlug: 'kids',  image: IMG },
  { id: 'p26', slug: 'kids-denim-shorts',       name: 'Kids Denim Shorts',           price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'kids-bottoms',  categorySlug: 'kids',  image: IMG },
  // Accessories
  { id: 'p27', slug: 'leather-tote-bag',        name: 'Leather Tote Bag',            price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'acc-bags',      categorySlug: 'accessories', image: IMG },
  { id: 'p28', slug: 'woven-belt',              name: 'Woven Leather Belt',          price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'acc-belts',     categorySlug: 'accessories', image: IMG },
  // Bath & Body
  { id: 'p29', slug: 'moisturising-lotion',     name: 'Moisturising Body Lotion',    price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'bath-skincare', categorySlug: 'bath-body', image: IMG },
  // Services
  { id: 'p30', slug: 'personal-styling-session', name: 'Personal Styling Session',   price: 75, salePrice: null, isOnSale: false, subcategorySlug: 'svc-styling',   categorySlug: 'services', image: IMG },
];

export function useProducts(params = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getProducts(params)
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data ?? []);
          setPagination(res.pagination ?? { total: res.data?.length ?? 0, page: 1, pages: 1 });
        }
      })
      .catch(() => {
        // Backend unavailable — filter mock data by categorySlug + subcategorySlug
        if (!cancelled) {
          let filtered = MOCK_PRODUCTS;

          if (params.categorySlug) {
            filtered = filtered.filter((p) => p.categorySlug === params.categorySlug);
          }
          if (params.subcategorySlug) {
            filtered = filtered.filter((p) => p.subcategorySlug === params.subcategorySlug);
          }
          if (params.onSale === 'true') {
            filtered = filtered.filter((p) => p.isOnSale);
          }

          setProducts(filtered);
          setPagination({ total: filtered.length, page: 1, pages: 1 });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey]);

  return { products, loading, error, pagination };
}
