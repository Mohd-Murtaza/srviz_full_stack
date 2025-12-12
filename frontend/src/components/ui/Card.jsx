import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverable = true, ...props }) => {
  const baseClasses = 'bg-white rounded-2xl shadow-lg overflow-hidden';
  const hoverClasses = hoverable ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-2' : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
