import { motion } from 'framer-motion';
import ProgressBar from '../ui/ProgressBar';

const FlashSaleCard = ({ product, index }) => {
  // Sequential card animation delay based on index
  const cardDelay = 0.8 + (index * 0.15);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: cardDelay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-6">
        <motion.img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Orange Divider Line */}
      <div className="h-0.5 bg-orange-500 w-full" />
      
      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-gray-900 font-medium text-base truncate">
          {product.name}
        </h3>
        
        <p className="text-gray-900 font-bold text-lg">
          ${product.price.toFixed(2)}
        </p>
        
        <div className="pt-1 space-y-1.5">
          <p className="text-gray-500 text-xs font-medium">
            {product.itemsLeft} Items Left
          </p>
          <ProgressBar progress={(product.itemsLeft / product.totalItems) * 100} />
        </div>
      </div>
    </motion.div>
  );
};

export default FlashSaleCard;