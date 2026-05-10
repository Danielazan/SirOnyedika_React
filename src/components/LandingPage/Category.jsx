// import React from 'react';
// import { motion } from 'framer-motion';
// import Cat1 from "../../assets/Cat1.png"
// import Cat2 from "../../assets/Cat2.png"
// import Cat3 from "../../assets/Cat3.png"
// import Cat4 from "../../assets/Cat4.png"
// import Cat5 from "../../assets/Cat5.png"
// import Cat6 from "../../assets/Cat6.png"


// const Category = () => {
//   const categories = [
//     { name: 'Men', image: Cat1 },
//     { name: 'Women', image: Cat2 },
//     { name: 'Kids', image: Cat3 },
//     { name: 'Haircare', image: Cat4 },
//     { name: 'Accessories', image: Cat5 },
//     { name: 'Skincare', image: Cat6 },
//   ];

//   const container = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15,
//         delayChildren: 0.1,
//       },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 40 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6, ease: 'easeOut' },
//     },
//   };

//   return (
//     <div className="bg-white min-h-screen py-12 px-4 md:px-8 font-sans">
//       <div className="max-w-7xl mx-auto ">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="mb-10"
//         >
//           <h2 className="text-2xl font-semibold text-gray-900 tracking-tight ">
//             Category <span className="text-orange-500">List</span>
//           </h2>
//         </motion.div>

//         <motion.div
//           variants={container}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.1 }}
//           className="grid grid-cols-3 gap-4 w-full mx-auto"
//         >
//           {categories.map((category, index) => (
//             <motion.div
//               key={index}
//               variants={item}
//               className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
//             >
//               {/* Image */}
//               <img
//                 src={category.image}
//                 alt={category.name}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//               />
              
//               {/* Dark transparent overlay - uniform across entire image */}
//               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              
//               {/* Centered text */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <p className="text-white text-lg md:text-xl font-medium tracking-wide drop-shadow-md">
//                   {category.name}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Category;


import React from 'react';
import { motion } from 'framer-motion';
import Cat1 from "../../assets/Cat1.png"
import Cat2 from "../../assets/Cat2.png"
import Cat3 from "../../assets/Cat3.png"
import Cat4 from "../../assets/Cat4.png"
import Cat5 from "../../assets/Cat5.png"
import Cat6 from "../../assets/Cat6.png"

const Category = () => {
  const categories = [
    { name: 'Men', image: Cat1 },
    { name: 'Women', image: Cat2 },
    { name: 'Kids', image: Cat3 },
    { name: 'Haircare', image: Cat4 },
    { name: 'Accessories', image: Cat5 },
    { name: 'Skincare', image: Cat6 },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div className="bg-white py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">
            Category <span className="text-orange-500">List</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-3 gap-2 md:gap-3"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative aspect-[4/3] overflow-hidden cursor-pointer rounded-md"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-xs md:text-sm font-medium tracking-wide drop-shadow-md">
                  {category.name}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Category;