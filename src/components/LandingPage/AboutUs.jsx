import { motion } from 'framer-motion';
import DotPattern from '../ui/DotPattern';
import img from "../../assets/hero2.png"

// Staggered container for sequential animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const AboutSection = () => {
  return (
    <section className="w-full bg-white py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className="flex items-baseline gap-2" variants={fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight font-[poppins]">
              About
            </h2>
            <span className="text-2xl md:text-3xl font-bold text-[#AE3E27]">
              Us
            </span>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Left Column: Image with cream background */}
          <motion.div 
            variants={slideFromLeft}
            className="relative"
          >
            <div className="relative aspect-[4/5] md:aspect-[3/4] bg-[#fdf2f0]/50 rounded-3xl overflow-hidden">
              <motion.img
                src={img}
                alt="Fashion model in beige outfit"
                className="w-full h-full object-cover object-center"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-orange-100/20 to-transparent" />
            </div>
            
            {/* Decorative dot pattern - positioned absolute on desktop */}
            <div className="hidden lg:block absolute -right-8 top-0 transform translate-x-full">
              <DotPattern delay={1.2} />
            </div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div 
            className="flex flex-col justify-center space-y-6 md:space-y-8"
            variants={containerVariants}
          >
            {/* Heading */}
            <motion.h3 
              variants={slideFromRight}
              className="text-xl md:text-2xl lg:text-4xl font-bold text-[#AE3E27] leading-tight font-[poppins]"
            >
              Designed for your
              <br />
              everyday confidence
            </motion.h3>

            {/* Body Text - Two paragraphs with stagger */}
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
            >
              <motion.p 
                variants={fadeInUp}
                className="text-base md:text-medium font-[poppins] text-black leading-relaxed"
              >
                Our brand brings fashion and self-care together in one seamless shopping experience. From stylish outfits to skincare and haircare essentials, every product is carefully selected to help you look and feel your best.
              </motion.p>
              
              <motion.p 
                variants={fadeInUp}
                className="text-base md:text-medium  text-black font-[poppins] leading-relaxed"
              >
                We believe confidence starts with how you care for yourself. That&apos;s why we focus on quality, simplicity, and pieces that fit effortlessly into your lifestyle. Whether you&apos;re updating your wardrobe or refreshing your routine, we&apos;re here to make self-expression easy, accessible, and enjoyable.
              </motion.p>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeInUp} className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#AE3E27] hover:bg-[#AE3E27] text-white font-semibold rounded-lg shadow-lg shadow-orange-500/25 transition-all duration-200"
              >
                <span>Explore our Story</span>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.button>
            </motion.div>

            {/* Decorative dots for mobile (bottom right) */}
            <motion.div 
              variants={fadeInUp}
              className="lg:hidden flex justify-end pt-8"
            >
              <DotPattern delay={1.5} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;