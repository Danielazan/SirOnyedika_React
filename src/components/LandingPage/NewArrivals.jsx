// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import img1 from "../../assets/New Arrivals/1.png"
// import img2 from "../../assets/New Arrivals/2.png"
// import img3 from "../../assets/New Arrivals/3.png"
// import img4 from "../../assets/New Arrivals/4.png"

// // import img1 from "../../assets/New Arrivals/1.png"

// // Animation variants for staggered entrance (one after another)
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.15, // Delay between each child animation
//       delayChildren: 0.2,   // Initial delay before first animation starts
//     },
//   },
// };

// const itemVariants = {
//   hidden: { 
//     opacity: 0, 
//     y: 30 
//   },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.5,
//       ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing
//     },
//   },
// };

// const tabVariants = {
//   hidden: { opacity: 0, scale: 0.9 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.3,
//       ease: "easeOut",
//     },
//   },
// };

// // Mock data matching the design image
// const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories', 'Skincare', 'Hair care'];

// const products = [
//   { id: 1, name: 'Barel Jeans', price: 70.00, image: img1 },
//   { id: 2, name: 'Moisturizer', price: 70.00, image: img2 },
//   { id: 3, name: 'Knit Sweater', price: 70.00, image: img3 },
//   { id: 4, name: 'Hair Growth', price: 70.00, image: img4 },
//   { id: 5, name: 'Barel Jeans', price: 70.00, image: img1 },
//   { id: 6, name: 'Moisturizer', price: 70.00, image: img2 },
//   { id: 7, name: 'Knit Sweater', price: 70.00, image: img3 },
//   { id: 8, name: 'Hair Growth', price: 70.00, image: img4 },
// ];

// export default function NewArrivalsSection() {
//   const [activeCategory, setActiveCategory] = useState('All');

//   return (
//     <section className="w-full bg-white py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-12">
//       {/* Header Section: Title and Category Tabs */}
//       <motion.div 
//         className="max-w-7xl mx-auto mb-10 md:mb-14"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-100px" }}
//         variants={containerVariants}
//       >
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-4">
//           {/* Section Title with "New" in black and "Arrivals" in orange */}
//           <motion.div 
//             className="flex items-baseline gap-2"
//             variants={itemVariants}
//           >
//             <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">
//               New
//             </h2>
//             <span className="text-xl md:text-2xl font-bold text-orange-500">
//               Arrivals
//             </span>
//           </motion.div>

//           {/* Category Filter Tabs - Horizontal scrollable on mobile, flex wrap on desktop */}
//           <motion.div 
//             className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide"
//             variants={containerVariants}
//           >
//             {categories.map((category) => (
//               <motion.button
//                 key={category}
//                 variants={tabVariants}
//                 onClick={() => setActiveCategory(category)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`
//                   px-5 py-2.5 rounded-lg text-sm md:text-base font-medium whitespace-nowrap
//                   transition-colors duration-200 ease-in-out
//                   ${activeCategory === category 
//                     ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
//                     : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
//                   }
//                 `}
//               >
//                 {category}
//               </motion.button>
//             ))}
//           </motion.div>
//         </div>
//       </motion.div>

//       {/* Product Grid Section */}
//       <motion.div 
//         className="max-w-7xl mx-auto"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-50px" }}
//         variants={containerVariants}
//       >
//         {/* Responsive Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//           {products.map((product, index) => (
//             <motion.div
//               key={`${product.id}-${index}`}
//               variants={itemVariants}
//               whileHover={{ y: -8 }}
//               className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
//             >
//               {/* Product Image Container */}
//               <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
//                 <motion.img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-full object-contain p-4"
//                   whileHover={{ scale: 1.08 }}
//                   transition={{ duration: 0.4, ease: "easeOut" }}
//                 />
//               </div>

//               {/* Product Info & Actions Row */}
//               <div className="p-4 md:p-5 border-t border-gray-100">
//                 <div className="flex items-center justify-between gap-4">
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate mb-1">
//                       {product.name}
//                     </h3>
//                     <p className="text-lg font-bold text-gray-900">
//                       ${product.price.toFixed(2)}
//                     </p>
//                   </div>
                  
//                   {/* Add to Cart Button - Orange with rounded-full */}
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="shrink-0 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg shadow-orange-500/20 transition-all duration-200 whitespace-nowrap"
//                   >
//                     Add to Cart
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </section>
//   );
// }
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import img1 from "../../assets/New Arrivals/1.png"
import img2 from "../../assets/New Arrivals/2.png"
import img3 from "../../assets/New Arrivals/3.png"
import img4 from "../../assets/New Arrivals/4.png"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories', 'Skincare', 'Hair care'];

const products = [
  { id: 1, name: 'Barel Jeans', price: 70.00, image: img1 },
  { id: 2, name: 'Moisturizer', price: 70.00, image: img2 },
  { id: 3, name: 'Knit Sweater', price: 70.00, image: img3 },
  { id: 4, name: 'Hair Growth', price: 70.00, image: img4 },
  { id: 5, name: 'Barel Jeans', price: 70.00, image: img1 },
  { id: 6, name: 'Moisturizer', price: 70.00, image: img2 },
  { id: 7, name: 'Knit Sweater', price: 70.00, image: img3 },
  { id: 8, name: 'Hair Growth', price: 70.00, image: img4 },
];

export default function NewArrivalsSection() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <section className="w-full bg-white py-6 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-7xl mx-auto mb-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <motion.div className="flex items-baseline gap-1.5" variants={itemVariants}>
            <h2 className="text-base font-bold text-black tracking-tight">New</h2>
            <span className="text-base font-bold text-orange-500">Arrivals</span>
          </motion.div>

          <motion.div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide" variants={containerVariants}>
            {categories.map((category) => (
              <motion.button
                key={category}
                variants={itemVariants}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-3 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeCategory === category 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} variants={containerVariants}>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {products.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
              </div>
              <div className="p-2 border-t border-gray-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[11px] font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs font-bold text-gray-900">${product.price.toFixed(2)}</p>
                  </div>
                  <button className="shrink-0 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-semibold rounded-full transition-all duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}