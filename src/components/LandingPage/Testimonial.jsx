import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star, Quote } from 'lucide-react';

// TestimonialSection - A client testimonial carousel section with animated elements
const Testimonial = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.7,
      },
    },
  };

  const quoteIconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.9,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 1.1,
      },
    },
  };

  return (
    <section className="w-full h-auto bg-white md:py-16 px-0 md:px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section - Title and Navigation Arrows */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4"
          variants={itemVariants}
        >
          {/* Section Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            What our Clients Say
          </h2>

          {/* Navigation Arrows */}
          <motion.div
            className="flex items-center gap-3"
            variants={itemVariants}
          >
            {/* Left Arrow - Gray background */}
            <motion.button
              className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg transition-all duration-300 hover:bg-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* Right Arrow - Orange background */}
            <motion.button
              className="w-12 h-12 flex items-center justify-center bg-orange-500 rounded-lg transition-all duration-300 hover:bg-orange-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Testimonial Card - Main content container with cream background */}
        <motion.div
          className="relative bg-[#FFF9F0] rounded-2xl p-6 sm:p-10 lg:p-12 border border-orange-100"
          variants={cardVariants}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Client Image Section - Ellipse shaped photo with quote icon */}
            <motion.div
              className="relative flex-shrink-0"
              variants={imageVariants}
            >
              {/* Ellipse shaped client photo */}
              <div className="relative w-48 h-64 sm:w-56 sm:h-72 overflow-hidden rounded-3xl">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face"
                  alt="Emerald Marks - Client"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Orange Quote Icon - Positioned to overlap the image */}
              <motion.div
                className="absolute -top-3 -right-3 w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg"
                variants={quoteIconVariants}
              >
                <Quote className="w-7 h-7 text-white fill-white" />
              </motion.div>
            </motion.div>

            {/* Testimonial Content - Rating, quote text and client name */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              variants={contentVariants}
            >
              {/* Star Rating - 5 yellow stars with 5.0 score */}
              <div className="flex items-center justify-center lg:justify-start gap-1 mb-5">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
                <span className="ml-2 text-gray-800 font-semibold">5.0</span>
              </div>

              {/* Testimonial Quote Text */}
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
                I was genuinely impressed by the quality and fit. They fet premium, and
                the delivery was seamless. This brand has become my favorite.
              </p>

              {/* Client Name */}
              <h4 className="text-gray-900 font-bold text-lg">
                Emerald Marks
              </h4>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Testimonial;