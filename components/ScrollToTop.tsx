import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-red-600 text-white rounded-sm flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
        >
          <iconify-icon icon="solar:arrow-up-linear" width="24"></iconify-icon>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
export default ScrollToTop;