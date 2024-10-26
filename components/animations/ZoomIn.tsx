import { motion } from 'framer-motion';

interface ZoomInProps {
  children: React.ReactNode;
  delay?: number;
}

export default function ZoomIn({ children, delay = 0 }: ZoomInProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
}