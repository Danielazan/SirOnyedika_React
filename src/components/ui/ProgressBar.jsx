import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 65, className = '' }) => {
  return (
    <div className={`w-full h-1.5 bg-orange-100 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-orange-500 rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: `${progress}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
};

export default ProgressBar;