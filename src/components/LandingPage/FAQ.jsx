import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Assume FAQs fetched from backend – example structure
// In real app: useEffect to fetch, or props from parent
const faqs = [
  {
    question: 'How long does delivery take?',
    answer: 'Delivery typically takes 3-5 business days within the US, and 7-14 days internationally depending on the location.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes, once your order ships, you will receive a tracking number via email to monitor your package.',
  },
  {
    question: 'Do You Ship Internationally?',
    answer: 'Yes, we ship to over 50 countries worldwide. Shipping fees and times vary by destination.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle accordion item
  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Label animation
  const labelVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Title animation – after label
  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.3 } },
  };

  // FAQ list container – staggers each item
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.8 },
    },
  };

  // Individual FAQ item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* ==================== SMALL LABEL ==================== */}
        {/* "FAQ" – appears first */}
        <motion.p
          variants={labelVariants}
          initial="hidden"
          animate="visible"
          className="text-center text-orange-500 uppercase tracking-widest text-sm md:text-base font-medium mb-3"
        >
          FAQ
        </motion.p>

        {/* ==================== MAIN TITLE ==================== */}
        {/* "Frequently Asked Questions" – appears after label */}
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="text-center text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 md:mb-16"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* ==================== FAQ ACCORDION LIST ==================== */}
        {/* Stacked vertically, each item animates sequentially */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onClick={() => toggleItem(index)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden"
            >
              {/* Question row – always visible */}
              <div className="flex justify-between items-center px-6 py-5">
                <p className="text-base md:text-lg font-medium text-gray-900">
                  {faq.question}
                </p>
                <span className={`text-gray-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>

              {/* Answer – expands/collapses */}
              <motion.div
                initial={false}
                animate={{ height: openIndex === index ? 'auto' : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="px-6 py-4 text-gray-700 text-base border-t border-gray-200">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;