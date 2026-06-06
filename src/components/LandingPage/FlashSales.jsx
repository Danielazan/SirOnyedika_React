// import { motion } from 'framer-motion';
// import CountdownTimer from '../flash-sale/CountdownTimer';
// import FlashSaleCard from '../flash-sale/FlashSaleCard';
// import Img1 from "../../assets/FlashSales/1.png"
// import Img2 from "../../assets/FlashSales/2.png"
// import Img3 from "../../assets/FlashSales/3.png"
// import Img4 from "../../assets/FlashSales/4.png"

// // Mock data matching the design exactly
// const flashSaleProducts = [
//   { id: 1, name: 'Hair Growth Supplement', price: 95.00, itemsLeft: 85, totalItems: 120, image: Img1 },
//   { id: 2, name: 'Classic Tailored Blazer', price: 95.00, itemsLeft: 85, totalItems: 120, image: Img2 },
//   { id: 3, name: 'Brightening Vitamin C Serum', price: 95.00, itemsLeft: 85, totalItems: 120, image: Img3 },
//   { id: 4, name: 'Lounge Set', price: 95.00, itemsLeft: 85, totalItems: 120, image: Img4 },
// ];

// const FlashSalesSection = () => {
//   return (
//     <section className="w-full bg-white py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Row: Title + Timer */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
//           {/* Title with word-by-word animation */}
//           <motion.div 
//             className="flex items-baseline gap-2"
//             initial="hidden"
//             animate="visible"
//           >
//             <motion.h2 
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.4, delay: 0 }}
//               className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight"
//             >
//               Flash
//             </motion.h2>
//             <motion.span 
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.4, delay: 0.1 }}
//               className="text-2xl md:text-3xl font-bold text-[#AE3E27]"
//             >
//               Sales
//             </motion.span>
//           </motion.div>
          
//           {/* Countdown Timer Component */}
//           <CountdownTimer />
//         </div>
        
//         {/* Orange Horizontal Separator Line */}
//         <motion.div 
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ duration: 0.6, delay: 0.7, ease: "easeInOut" }}
//           className="h-0.5 bg-[#AE3E27] origin-left mb-6"
//         />
        
//         {/* Product Grid - 4 columns on desktop, 2 on tablet, 1 on mobile */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-18">
//           {flashSaleProducts.map((product, index) => (
//             <FlashSaleCard key={product.id} product={product} index={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FlashSalesSection;

import { motion } from 'framer-motion';
import CountdownTimer from '../flash-sale/CountdownTimer';
import FlashSaleCard from '../flash-sale/FlashSaleCard';
import Img1 from "../../assets/FlashSales/1.png"
import Img2 from "../../assets/FlashSales/2.png"
import Img3 from "../../assets/FlashSales/3.png"
import Img4 from "../../assets/FlashSales/4.png"

const flashSaleProducts = [
  { id: 1, name: 'Hair Growth Supplement', price: 95.00, itemsLeft: 85, totalItems: 120, image: Img1 },
  { id: 2, name: 'Classic Tailored Blazer', price: 95.00, itemsLeft: 85, totalItems: 120, image: Img2 },
  { id: 3, name: 'Brightening Vitamin C Serum', price: 95.00, itemsLeft: 85, totalItems: 120, image: Img3 },
  { id: 4, name: 'Lounge Set', price: 95.00, itemsLeft: 85, totalItems: 120, image: Img4 },
];

const FlashSalesSection = () => {
  return (
    <section className="w-full bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <motion.div className="flex items-baseline gap-1.5" initial="hidden" animate="visible">
            <motion.h2 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="text-base font-bold text-gray-900 tracking-tight">Flash</motion.h2>
            <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.05 }} className="text-base font-bold text-[#AE3E27]">Sales</motion.span>
          </motion.div>
          <CountdownTimer />
        </div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className="h-0.5 bg-[#AE3E27] origin-left mb-3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {flashSaleProducts.map((product, index) => (
            <FlashSaleCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSalesSection;