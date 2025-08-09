import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'neon-blue',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    'neon-blue': 'border-neon-blue',
    'neon-purple': 'border-neon-purple',
    'neon-green': 'border-neon-green',
    white: 'border-white'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`
          ${sizeClasses[size]} 
          border-2 
          ${colorClasses[color]} 
          border-t-transparent 
          rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
