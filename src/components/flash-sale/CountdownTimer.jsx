import { motion } from 'framer-motion';

const TimeBox = ({ value, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: "backOut" }}
    className="bg-orange-500 text-white font-bold text-lg md:text-xl px-3 py-2 md:px-4 md:py-2.5 rounded-lg min-w-[40px] md:min-w-[48px] text-center shadow-sm"
  >
    {value}
  </motion.div>
);

const Colon = ({ delay }) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay }}
    className="text-orange-500 font-bold text-lg md:text-xl mx-1"
  >
    :
  </motion.span>
);

const CountdownTimer = () => {
  // Animation sequence: Boxes appear one after another
  const baseDelay = 0.4; // After "Ends in" text
  
  return (
    <div className="flex items-center gap-2">
      <motion.span 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-gray-700 font-medium text-base md:text-lg mr-2"
      >
        Ends in
      </motion.span>
      
      <TimeBox value="02" delay={baseDelay} />
      <Colon delay={baseDelay + 0.1} />
      <TimeBox value="14" delay={baseDelay + 0.2} />
      <Colon delay={baseDelay + 0.3} />
      <TimeBox value="37" delay={baseDelay + 0.4} />
      <Colon delay={baseDelay + 0.5} />
      <TimeBox value="09" delay={baseDelay + 0.6} />
    </div>
  );
};

export default CountdownTimer;