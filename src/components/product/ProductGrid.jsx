// Renders a responsive grid of ProductCard components.
// Applies a staggered entrance animation: each card enters one after another.
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

// Skeleton placeholder for loading state
function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-8 bg-gray-200 rounded mt-1" />
      </div>
    </div>
  );
}

// Container drives the stagger — children receive cardVariants from ProductCard
const gridVariants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export default function ProductGrid({ products, loading, onAddToCart }) {
  // Show 9 skeleton cards while loading
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">👗</span>
        <p className="text-gray-500 text-base font-medium">No products found in this category.</p>
        <p className="text-gray-400 text-sm mt-1">Try selecting a different subcategory.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </motion.div>
  );
}
