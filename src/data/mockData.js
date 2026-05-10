// ─────────────────────────────────────────────────────────────────────────────
// src/data/mockData.js
// Centralised mock data used by every admin hook as the API fallback.
// Shapes mirror the real backend response objects so swapping in live data
// requires zero changes to pages or components.
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared avatar placeholder ────────────────────────────────────────────────
const AVATAR = 'https://i.pravatar.cc/40';

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
export const MOCK_DASHBOARD = {
  stats: {
    revenue:   { value: 42_500_000, change: 12.5, trend: 'up' },
    orders:    { value: 842,        change: 8.3,  trend: 'up' },
    customers: { value: 1_240,      change: -2.1, trend: 'down' },
    products:  { value: 364,        change: 5.0,  trend: 'up' },
  },
  salesData: [
    { month: 'Jan', revenue: 2_100_000 },
    { month: 'Feb', revenue: 1_850_000 },
    { month: 'Mar', revenue: 2_430_000 },
    { month: 'Apr', revenue: 2_100_000 },
    { month: 'May', revenue: 2_780_000 },
    { month: 'Jun', revenue: 2_450_000 },
    { month: 'Jul', revenue: 3_100_000 },
    { month: 'Aug', revenue: 2_850_000 },
    { month: 'Sep', revenue: 3_400_000 },
    { month: 'Oct', revenue: 3_200_000 },
    { month: 'Nov', revenue: 3_800_000 },
    { month: 'Dec', revenue: 4_250_000 },
  ],
  trafficSources: [
    { name: 'Organic',  value: 45, color: '#EA580C' },
    { name: 'Social',   value: 30, color: '#F97316' },
    { name: 'Direct',   value: 15, color: '#FDBA74' },
    { name: 'Referral', value: 10, color: '#FED7AA' },
  ],
  recentOrders: [
    { id: '#ORD-7821', customer: 'Sophia Williams', product: 'Classic Blazer',   date: '2026-04-30', amount: 45_000,  paymentMethod: 'Card',     status: 'delivered'  },
    { id: '#ORD-7820', customer: 'John Mark',       product: 'Casual Sneakers',  date: '2026-04-30', amount: 28_500,  paymentMethod: 'Transfer', status: 'processing' },
    { id: '#ORD-7819', customer: 'Harper Anderson', product: 'Summer Dress',     date: '2026-04-29', amount: 18_000,  paymentMethod: 'Card',     status: 'pending'    },
    { id: '#ORD-7818', customer: 'Emma Johnson',    product: 'Leather Bag',      date: '2026-04-29', amount: 65_000,  paymentMethod: 'Paystack', status: 'shipped'    },
    { id: '#ORD-7817', customer: 'James Wilson',    product: 'Formal Shoes',     date: '2026-04-28', amount: 35_000,  paymentMethod: 'Card',     status: 'cancelled'  },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════════════════════════════════
export const MOCK_ORDERS = [
  { id: '#ORD-7821', customer: { name: 'Sophia Williams', avatar: AVATAR }, product: 'Classic Blazer',     date: '2026-04-30', amount: 45_000,  paymentMethod: 'Card',     status: 'delivered'  },
  { id: '#ORD-7820', customer: { name: 'John Mark',       avatar: AVATAR }, product: 'Casual Sneakers',    date: '2026-04-30', amount: 28_500,  paymentMethod: 'Transfer', status: 'processing' },
  { id: '#ORD-7819', customer: { name: 'Harper Anderson', avatar: AVATAR }, product: 'Summer Dress',       date: '2026-04-29', amount: 18_000,  paymentMethod: 'Card',     status: 'pending'    },
  { id: '#ORD-7818', customer: { name: 'Emma Johnson',    avatar: AVATAR }, product: 'Leather Bag',        date: '2026-04-29', amount: 65_000,  paymentMethod: 'Paystack', status: 'shipped'    },
  { id: '#ORD-7817', customer: { name: 'James Wilson',    avatar: AVATAR }, product: 'Formal Shoes',       date: '2026-04-28', amount: 35_000,  paymentMethod: 'Card',     status: 'cancelled'  },
  { id: '#ORD-7816', customer: { name: 'Amara Obi',       avatar: AVATAR }, product: 'Designer Watch',     date: '2026-04-27', amount: 120_000, paymentMethod: 'Card',     status: 'delivered'  },
  { id: '#ORD-7815', customer: { name: 'Chidi Nwosu',     avatar: AVATAR }, product: 'Polo Shirt ×3',      date: '2026-04-27', amount: 21_000,  paymentMethod: 'Transfer', status: 'pending'    },
  { id: '#ORD-7814', customer: { name: 'Zoe Adams',       avatar: AVATAR }, product: 'Ankle Boots',        date: '2026-04-26', amount: 54_000,  paymentMethod: 'Card',     status: 'shipped'    },
  { id: '#ORD-7813', customer: { name: 'Tolu Adeyemi',    avatar: AVATAR }, product: 'Silk Blouse',        date: '2026-04-25', amount: 12_500,  paymentMethod: 'Paystack', status: 'delivered'  },
  { id: '#ORD-7812', customer: { name: 'Femi Okafor',     avatar: AVATAR }, product: 'Slim Fit Chinos',    date: '2026-04-25', amount: 19_800,  paymentMethod: 'Card',     status: 'processing' },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════════
const PROD_IMG = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop&q=80';

export const MOCK_PRODUCTS = [
  { id: 1,  name: 'Classic Blazer',     sku: 'BLZ-001', category: "Men's Fashion",    price: 45_000,  stock: 24, status: true,  image: PROD_IMG },
  { id: 2,  name: 'Casual Sneakers',    sku: 'SNK-002', category: 'Footwear',          price: 28_500,  stock: 56, status: true,  image: PROD_IMG },
  { id: 3,  name: 'Summer Dress',       sku: 'DRS-003', category: "Women's Fashion",   price: 18_000,  stock: 0,  status: false, image: PROD_IMG },
  { id: 4,  name: 'Leather Bag',        sku: 'BAG-004', category: 'Accessories',        price: 65_000,  stock: 12, status: true,  image: PROD_IMG },
  { id: 5,  name: 'Formal Shoes',       sku: 'SHO-005', category: 'Footwear',          price: 35_000,  stock: 8,  status: true,  image: PROD_IMG },
  { id: 6,  name: 'Designer Watch',     sku: 'WTC-006', category: 'Accessories',        price: 120_000, stock: 5,  status: true,  image: PROD_IMG },
  { id: 7,  name: 'Polo Shirt',         sku: 'PLO-007', category: "Men's Fashion",    price: 7_000,   stock: 100,status: true,  image: PROD_IMG },
  { id: 8,  name: 'Ankle Boots',        sku: 'BOT-008', category: 'Footwear',          price: 54_000,  stock: 0,  status: false, image: PROD_IMG },
  { id: 9,  name: 'Silk Blouse',        sku: 'BLS-009', category: "Women's Fashion",   price: 22_000,  stock: 30, status: true,  image: PROD_IMG },
  { id: 10, name: 'Slim Fit Chinos',    sku: 'CHN-010', category: "Men's Fashion",    price: 19_800,  stock: 45, status: true,  image: PROD_IMG },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  CUSTOMERS
// ═══════════════════════════════════════════════════════════════════════════════
export const MOCK_CUSTOMER_STATS = { total: 155, vip: 21, active: 67, newThisMonth: 5 };

export const MOCK_CUSTOMERS = [
  { id: 1, name: 'Sophia Williams', email: 'sophia@email.com',    location: 'New York, USA',     orders: 12, totalSpent: 1_450_00, status: 'Active', joined: 'Jan 15, 2025', avatar: AVATAR },
  { id: 2, name: 'Sophia Williams', email: 'sophia@email.com',    location: 'New York, USA',     orders: 12, totalSpent: 1_450_00, status: 'Active', joined: 'Jan 15, 2025', avatar: AVATAR },
  { id: 3, name: 'John Mark',       email: 'johnmark@email.com',  location: 'Los Angeles, USA',  orders: 21, totalSpent: 2_560_00, status: 'VIP',    joined: 'Mar 12, 2024', avatar: AVATAR },
  { id: 4, name: 'John Mark',       email: 'johnmark@email.com',  location: 'Los Angeles, USA',  orders: 21, totalSpent: 2_560_00, status: 'VIP',    joined: 'Mar 12, 2024', avatar: AVATAR },
  { id: 5, name: 'Harper Anderson', email: 'harper@email.com',    location: 'Phoenix, USA',      orders: 2,  totalSpent:    90_00, status: 'New',    joined: 'Mar 12, 2026', avatar: AVATAR },
  { id: 6, name: 'Harper Anderson', email: 'harper@email.com',    location: 'Phoenix, USA',      orders: 2,  totalSpent:    90_00, status: 'New',    joined: 'Mar 12, 2026', avatar: AVATAR },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════
export const MOCK_CATEGORIES = [
  { id: 1, name: "Men's Fashion",   slug: 'mens-fashion',   productCount: 48, image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=300&fit=crop' },
  { id: 2, name: "Women's Fashion", slug: 'womens-fashion', productCount: 76, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop' },
  { id: 3, name: 'Footwear',        slug: 'footwear',        productCount: 35, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop' },
  { id: 4, name: 'Accessories',     slug: 'accessories',     productCount: 29, image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=400&h=300&fit=crop' },
  { id: 5, name: "Kids' Wear",      slug: 'kids-wear',       productCount: 22, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop' },
  { id: 6, name: 'Sportswear',      slug: 'sportswear',      productCount: 31, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop' },
  { id: 7, name: 'Bags & Purses',   slug: 'bags-purses',     productCount: 18, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop' },
  { id: 8, name: 'Jewelry',         slug: 'jewelry',         productCount: 42, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop' },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  FLASH SALES
// ═══════════════════════════════════════════════════════════════════════════════
const FS_IMG_1 = 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300&h=340&fit=crop';
const FS_IMG_2 = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=340&fit=crop';
const FS_IMG_3 = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=340&fit=crop';
const FS_IMG_4 = 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=300&h=340&fit=crop';
const FS_IMG_5 = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=340&fit=crop';

export const MOCK_FLASH_SALES = [
  {
    id: 1,
    name: 'Weekend Blowout',
    status: 'active',
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    products: [
      { id: 1, name: 'Classic Blazer',  originalPrice: 45_000, salePrice: 28_000, discount: 38, sold: 14, stock: 24, image: FS_IMG_1 },
      { id: 2, name: 'Ankle Boots',     originalPrice: 54_000, salePrice: 32_000, discount: 41, sold: 8,  stock: 12, image: FS_IMG_2 },
      { id: 3, name: 'Leather Bag',     originalPrice: 65_000, salePrice: 45_000, discount: 31, sold: 5,  stock: 10, image: FS_IMG_3 },
      { id: 4, name: 'Designer Watch',  originalPrice: 120_000, salePrice: 85_000, discount: 29, sold: 3, stock: 5,  image: FS_IMG_4 },
    ],
  },
  {
    id: 2,
    name: 'Summer Clearance',
    status: 'upcoming',
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    products: [
      { id: 5, name: 'Summer Dress', originalPrice: 18_000, salePrice: 9_000, discount: 50, sold: 0, stock: 20, image: FS_IMG_5 },
      { id: 6, name: 'Polo Shirt',   originalPrice:  7_000, salePrice: 4_200, discount: 40, sold: 0, stock: 50, image: FS_IMG_1 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  MESSAGES / CONVERSATIONS
// ═══════════════════════════════════════════════════════════════════════════════
export const MOCK_CONVERSATIONS = [
  {
    id: 1,
    customer: { id: 1, name: 'Sophia Williams', avatar: `${AVATAR}?img=1`, isOnline: true },
    lastMessage: 'Hello, I wanted to ask about my order...',
    timestamp: '2 min ago',
    unread: 2,
    messages: [
      { id: 1, text: 'Hello, I placed an order yesterday.',                                   sender: 'customer', time: '10:05 AM' },
      { id: 2, text: 'Hi Sophia! Thanks for reaching out. How can I help you?',              sender: 'admin',    time: '10:12 AM' },
      { id: 3, text: 'Hi, I wanted to ask about my order #ORD-7821. When will it arrive?',  sender: 'customer', time: '10:17 AM' },
    ],
  },
  {
    id: 2,
    customer: { id: 2, name: 'Sophia Williams', avatar: `${AVATAR}?img=2`, isOnline: true },
    lastMessage: 'Hello, I wanted to ask about my order...',
    timestamp: '15 min ago',
    unread: 3,
    messages: [{ id: 1, text: 'I need help with my recent purchase.', sender: 'customer', time: '9:45 AM' }],
  },
  {
    id: 3,
    customer: { id: 3, name: 'Sophia Williams', avatar: `${AVATAR}?img=3`, isOnline: false },
    lastMessage: 'Hello, I wanted to ask about my order...',
    timestamp: '1 hr ago',
    unread: 1,
    messages: [{ id: 1, text: 'When will my order be shipped?', sender: 'customer', time: '9:05 AM' }],
  },
  {
    id: 4,
    customer: { id: 4, name: 'Sophia Williams', avatar: `${AVATAR}?img=4`, isOnline: true },
    lastMessage: 'Hello, I wanted to ask about my order...',
    timestamp: '3 hr ago',
    unread: 1,
    messages: [{ id: 1, text: 'Can I change my delivery address?', sender: 'customer', time: '7:00 AM' }],
  },
  {
    id: 5,
    customer: { id: 5, name: 'Sophia Williams', avatar: `${AVATAR}?img=5`, isOnline: false },
    lastMessage: 'Hello, I wanted to ask about my order...',
    timestamp: '5 hr ago',
    unread: 3,
    messages: [{ id: 1, text: 'I would like to return my item.', sender: 'customer', time: '5:00 AM' }],
  },
];
