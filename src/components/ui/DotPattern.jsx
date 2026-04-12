import { motion } from 'framer-motion';

const DotPattern = ({ className = '', delay = 0 }) => {
  // Generate grid of dots
  const dots = Array.from({ length: 30 }, (_, i) => i);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: 0.02,
      },
    },
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
  };

  return (
    <motion.div 
      className={`grid grid-cols-6 gap-3 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {dots.map((dot) => (
        <motion.div
          key={dot}
          variants={dotVariants}
          className="w-1.5 h-1.5 rounded-full bg-orange-500/40"
        />
      ))}
    </motion.div>
  );
};

export default DotPattern;