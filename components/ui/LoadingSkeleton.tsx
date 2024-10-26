import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-3/4 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-1/2 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
      />
    </div>
  );
}