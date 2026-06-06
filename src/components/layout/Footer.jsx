// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaLinkedin, FaFacebookF, FaTwitter } from 'react-icons/fa';

// const Footer = () => {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
//   };

//   const columnVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
//   };

//   return (
//     <footer className="bg-[#AE3E27] text-white pt-10 pb-6">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col md:flex-row justify-between w-full mb-8 gap-6">
//           <motion.div variants={columnVariants} className="space-y-3">
//             <h3 className="text-xl tracking-tight font-[Pacifico]">Atelierselvedge</h3>
//             <p className="text-[#fce5e0] text-xs leading-relaxed max-w-xs">
//               Where modern design meets with effortless style designed for everyday comfort and confidence to express your individuality
//             </p>
//             <div className="flex gap-3 text-lg">
//               <a href="#" className="w-7 h-7 flex items-center justify-center border border-white rounded-full hover:bg-white/20 transition-colors">
//                 <FaLinkedin size={14} />
//               </a>
//               <a href="#" className="w-7 h-7 flex items-center justify-center border border-white rounded-full hover:bg-white/20 transition-colors">
//                 <FaFacebookF size={14} />
//               </a>
//               <a href="#" className="w-7 h-7 flex items-center justify-center border border-white rounded-full hover:bg-white/20 transition-colors">
//                 <FaTwitter size={14} />
//               </a>
//             </div>
//           </motion.div>

//           <div className="grid grid-cols-3 gap-4 md:gap-8">
//             <motion.div variants={columnVariants}>
//               <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
//               <ul className="space-y-1.5 text-[#fce5e0] text-xs">
//                 <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Offers & Deals</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">FAQS</a></li>
//               </ul>
//             </motion.div>

//             <motion.div variants={columnVariants}>
//               <h4 className="text-sm font-semibold mb-3">Help</h4>
//               <ul className="space-y-1.5 text-[#fce5e0] text-xs">
//                 <li><a href="#" className="hover:text-white transition-colors">Delivery Information</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Payment methods</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Contact us</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Return & Refund Policy</a></li>
//               </ul>
//             </motion.div>

//             <motion.div variants={columnVariants}>
//               <h4 className="text-sm font-semibold mb-3">Contact Info</h4>
//               <ul className="space-y-1.5 text-[#fce5e0] text-xs">
//                 <li>+0123-345-678</li>
//                 <li>fahly111@gmail.com</li>
//                 <li>12 Kingtown rd. New Haven</li>
//               </ul>
//             </motion.div>
//           </div>
//         </motion.div>

//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }} className="pt-6 border-t border-white/20 text-center text-[11px] text-[#f8cec7]">
//           Copyright 2026 fashion Website Design. All Rights Reserved
//         </motion.div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



// src/components/layout/Footer.jsx
// Updated to include a POLICIES column linking to all five public policy pages.

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLinkedin, FaFacebookF, FaTwitter } from 'react-icons/fa';

const POLICY_LINKS = [
  { label: 'Privacy Policy',              to: '/privacy-policy'             },
  { label: 'Access Control Policy',       to: '/access-control-policy'      },
  { label: 'Refund & Cancellation Policy', to: '/refund-cancellation-policy' },
  { label: 'Data Retention Policy',       to: '/data-retention-policy'      },
  { label: 'Terms of Service',            to: '/terms-of-service'           },
];

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const columnVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Footer = () => {
  return (
    <footer className="bg-[#AE3E27] text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8"
        >
          {/* ── Brand column ── */}
          <motion.div variants={columnVariants} className="col-span-2 md:col-span-1 space-y-3">
            <h3 className="text-xl tracking-tight font-[Pacifico]">Atelierselvedge</h3>
            <p className="text-[#fce5e0] text-xs leading-relaxed max-w-xs">
              Premium cosmetics, body care, and fashion crafted for the modern wardrobe.
            </p>
            <div className="flex gap-3 text-lg">
              <a
                href="#"
                className="w-7 h-7 flex items-center justify-center border border-white rounded-full hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={14} />
              </a>
              <a
                href="#"
                className="w-7 h-7 flex items-center justify-center border border-white rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="#"
                className="w-7 h-7 flex items-center justify-center border border-white rounded-full hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={14} />
              </a>
            </div>
          </motion.div>

          {/* ── Quick Links ── */}
          <motion.div variants={columnVariants}>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-1.5 text-[#fce5e0] text-xs">
              <li><Link to="/"      className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop"  className="hover:text-white transition-colors">All Products</Link></li>
              <li><a href="#"       className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#"       className="hover:text-white transition-colors">Offers &amp; Promotions</a></li>
              <li><a href="#"       className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </motion.div>

          {/* ── Policies ── */}
          <motion.div variants={columnVariants}>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider">Policies</h4>
            <ul className="space-y-1.5 text-[#fce5e0] text-xs">
              {POLICY_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Contact ── */}
          <motion.div variants={columnVariants}>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-1.5 text-[#fce5e0] text-xs">
              <li>customercare@selvedgeatelier.com</li>
              <li>Mon – Fri, 9 am – 5 pm EST</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* ── Copyright bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="pt-6 border-t border-white/20 text-center text-[11px] text-[#f8cec7]"
        >
          Copyright &copy; {new Date().getFullYear()} Atelierselvedge. All Rights Reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;