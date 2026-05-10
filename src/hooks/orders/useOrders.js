// Fetches the buyer's order list. Falls back to MOCK_ORDERS when backend unavailable.
import { useState, useEffect } from 'react';
import { getOrders } from '../../api/orders.api';

const IMG = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop&q=80';
const IMG2 = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&q=80';
const IMG3 = 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c58?w=300&h=300&fit=crop&q=80';

export const MOCK_ORDERS = [
  {
    id: 'ord-1', orderNumber: 'ORD-2026-A3F8K',
    status: 'DELIVERED', fulfillmentType: 'delivery',
    subtotal: 150, shippingFee: 0, discountAmount: 0, totalAmount: 150,
    createdAt: '2026-03-10T10:00:00Z',
    items: [
      { id: 'oi-1', productName: 'Classic Tailored Blazer', variantName: 'Black / Size M', qty: 1, unitPrice: 75, lineTotal: 75, image: IMG2 },
      { id: 'oi-2', productName: 'Slim Fit Trousers',       variantName: 'Navy / Size 32', qty: 1, unitPrice: 75, lineTotal: 75, image: IMG3 },
    ],
  },
  {
    id: 'ord-2', orderNumber: 'ORD-2026-B7K2P',
    status: 'CONFIRMED', fulfillmentType: 'delivery',
    subtotal: 75, shippingFee: 5, discountAmount: 0, totalAmount: 80,
    createdAt: '2026-03-28T14:22:00Z',
    items: [
      { id: 'oi-3', productName: 'Classic Tailored Blazer', variantName: 'Red / Size S', qty: 2, unitPrice: 37.5, lineTotal: 75, image: IMG },
    ],
  },
  {
    id: 'ord-3', orderNumber: 'ORD-2026-C9M1Q',
    status: 'PENDING', fulfillmentType: 'pickup',
    subtotal: 75, shippingFee: 0, discountAmount: 0, totalAmount: 75,
    createdAt: '2026-04-01T09:05:00Z',
    items: [
      { id: 'oi-4', productName: 'Bodycon Dress',           variantName: 'Green / Size M', qty: 1, unitPrice: 75, lineTotal: 75, image: IMG },
    ],
  },
  {
    id: 'ord-4', orderNumber: 'ORD-2026-D4R3Z',
    status: 'CANCELLED', fulfillmentType: 'delivery',
    subtotal: 150, shippingFee: 5, discountAmount: 10, totalAmount: 145,
    createdAt: '2026-02-15T11:00:00Z',
    items: [
      { id: 'oi-5', productName: 'Leather Tote Bag',        variantName: 'Brown / One Size', qty: 2, unitPrice: 75, lineTotal: 150, image: IMG3 },
    ],
  },
];

export function useOrders(statusFilter = '') {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    getOrders(params)
      .then((res) => { if (!cancelled) setOrders(res.data ?? []); })
      .catch(() => {
        if (!cancelled) {
          const filtered = statusFilter
            ? MOCK_ORDERS.filter((o) => o.status === statusFilter)
            : MOCK_ORDERS;
          setOrders(filtered);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [statusFilter]);

  return { orders, loading, error };
}
