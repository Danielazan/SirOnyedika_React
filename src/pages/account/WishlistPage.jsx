// WishlistPage — Panel 4 of the account area.
// Displays all wishlisted product variants in a responsive grid.
// Each card has an image, product name, price, and Add to Cart + Remove buttons.
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, HeartOff } from 'lucide-react';
import { useState } from 'react';
import { useWishlists } from '../../hooks/user/useWishlists';

const cardVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
  }),
};

const gridVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
};

function WishlistCard({ item, index, onRemove }) {
  const [added, setAdded] = useState(false);
  const variant  = item.variant ?? {};
  const product  = variant.product ?? {};
  const image    = variant.images?.[0]?.url ?? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop';
  const price    = variant.isOnSale && variant.salePrice ? variant.salePrice : variant.price ?? 75;
  const origPrice = variant.price ?? 75;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    // TODO: wire to useAddToCart mutation
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col group cursor-pointer"
    >
      {/* Product image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {variant.isOnSale && (
          <span className="absolute top-2 left-2 bg-[#DA5605] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Sale
          </span>
        )}
        {/* Remove from wishlist */}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-red-50 transition-colors group/btn"
        >
          <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-[13px] font-semibold text-gray-800 leading-tight line-clamp-2 font-['Poppins']">
          {product.name ?? 'Product'}
        </p>
        <p className="text-xs text-gray-400">{variant.name}</p>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">${Number(price).toFixed(2)}</span>
          {variant.isOnSale && (
            <span className="text-xs text-gray-400 line-through">${Number(origPrice).toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleAddToCart}
          className={`mt-auto w-full flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white rounded-lg py-2 transition-all ${
            added ? 'bg-green-500' : 'bg-[#DA5605] hover:bg-[#c04a04]'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {added ? 'Added!' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function WishlistPage() {
  const { items, loading, handleRemove } = useWishlists();

  return (
    <div>
      {/* ── Section heading ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100"
      >
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#DA5605] fill-[#DA5605]" />
          Wishlist
          {!loading && items.length > 0 && (
            <span className="text-sm text-gray-400 font-normal">({items.length} items)</span>
          )}
        </h2>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <HeartOff className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Your wishlist is empty</p>
          <p className="text-gray-400 text-sm mt-1">Save products you love to find them easily later.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {items.map((item, i) => (
            <WishlistCard key={item.id} item={item} index={i} onRemove={handleRemove} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
