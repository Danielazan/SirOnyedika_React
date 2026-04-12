import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaFacebookF, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  // Stagger parent for columns
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.4,
      },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 1.2 },
    },
  };

  const copyrightVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, delay: 1.6 } },
  };

  return (
    <footer className="bg-orange-600 text-white pt-16 pb-10">
      <div className="max-w-7xl mx-auto  ">
        {/* ==================== MAIN COLUMNS ==================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row justify-between w-full mb-16"
        >
          {/* ==================== BRAND / ABOUT COLUMN ==================== */}
          <motion.div variants={columnVariants} className="space-y-6">
              <h3 className="text-3xl md:text-2xl  tracking-tight font-[Pacifico]">
                Fashly
              </h3>
              <p className="text-orange-100 text-base leading-relaxed max-w-xs">
                Where modern design meets with effortless style designed for everyday
                comfort and confidence to express your individuality
              </p>

              {/* ==================== SOCIAL ICONS ==================== */}
              <motion.div
                variants={socialVariants}
                className="flex gap-5 text-2xl"
              >
                <a href="#" className="text-white hover:text-gray-300">
                <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full"> {/* Circle (ellipse approximation) for icons */}
                  <FaLinkedin size={20} />
                </div>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full">
                  <FaFacebookF size={20} />
                </div>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <div className="w-8 h-8 flex items-center justify-center border border-white rounded-full">
                  <FaTwitter size={20} />
                </div>
              </a>
              </motion.div>
            </motion.div>

          <div>
            

            {/* ==================== QUICK LINKS COLUMN ==================== */}
            <div className=' w-full grid grid-cols-3 '>
              <motion.div variants={columnVariants}>
                <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
                <ul className="space-y-3 text-orange-100">
                  <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Offers & Deals</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQS</a></li>
                </ul>
              </motion.div>


              {/* ==================== HELP COLUMN ==================== */}
            <motion.div variants={columnVariants}>
              <h4 className="text-xl font-semibold mb-6">Help</h4>
              <ul className="space-y-3 text-orange-100">
                <li><a href="#" className="hover:text-white transition-colors">Delivery Information</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Payment methods</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Return & Refund Policy</a></li>
                {/* <li><a href="#" className="hover:text-white transition-colors">FAQS</a></li> */}
              </ul>
            </motion.div>

            {/* ==================== CONTACT INFO COLUMN ==================== */}
            <motion.div variants={columnVariants}>
              <h4 className="text-xl font-semibold mb-6">Contact Info</h4>
              <ul className="space-y-4 text-orange-100">
                <li>+0123-345-678</li>
                <li>fahly111@gmail.com</li>
                <li>12 Kingstown rd. New Haven</li>
              </ul>
            </motion.div>
            </div> 
          </div>
        </motion.div>

        {/* ==================== COPYRIGHT BAR ==================== */}
        <motion.div
          variants={copyrightVariants}
          initial="hidden"
          animate="visible"
          className="pt-10 border-t border-white text-center text-sm text-orange-200"
        >
          Copyright 2026 fashion Website Design. All Rights Reserved
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;