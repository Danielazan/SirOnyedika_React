// Fetches the buyer's wishlists and items. Falls back to MOCK_WISHLIST when backend unavailable.
import { useState, useEffect, useCallback } from 'react';
import { getWishlists, removeFromWishlist } from '../../api/user.api';

const IMG = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&q=80';

export const MOCK_WISHLIST_ITEMS = [
  { id: 'wi-1', variantId: 'v1', variant: { name: 'Black / M', price: 75, salePrice: null, isOnSale: false, product: { name: 'Classic Tailored Blazer', slug: 'classic-tailored-blazer' }, images: [{ url: IMG }] } },
  { id: 'wi-2', variantId: 'v2', variant: { name: 'Red / S',   price: 75, salePrice: 60,  isOnSale: true,  product: { name: 'Midi Red Dress',          slug: 'midi-red-dress'          }, images: [{ url: IMG }] } },
  { id: 'wi-3', variantId: 'v3', variant: { name: 'Navy / 32', price: 75, salePrice: null, isOnSale: false, product: { name: 'Slim Fit Trousers',        slug: 'slim-fit-trousers'       }, images: [{ url: IMG }] } },
  { id: 'wi-4', variantId: 'v4', variant: { name: 'Brown / OS',price: 75, salePrice: null, isOnSale: false, product: { name: 'Leather Tote Bag',          slug: 'leather-tote-bag'        }, images: [{ url: IMG }] } },
  { id: 'wi-5', variantId: 'v5', variant: { name: 'Green / M', price: 75, salePrice: 55,  isOnSale: true,  product: { name: 'Bodycon Dress',             slug: 'bodycon-dress'           }, images: [{ url: IMG }] } },
  { id: 'wi-6', variantId: 'v6', variant: { name: 'White / L', price: 75, salePrice: null, isOnSale: false, product: { name: 'Satin Blouse',              slug: 'satin-blouse'            }, images: [{ url: IMG }] } },
];

export function useWishlists() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlists = useCallback(() => {
    setLoading(true);
    getWishlists()
      .then((res) => {
        const allItems = (res.data ?? []).flatMap((wl) => wl.items ?? []);
        setItems(allItems);
      })
      .catch(() => setItems(MOCK_WISHLIST_ITEMS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchWishlists(); }, [fetchWishlists]);

  const handleRemove = async (itemId) => {
    try {
      await removeFromWishlist(itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      return true;
    } catch {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      return false;
    }
  };

  return { items, loading, handleRemove };
}
