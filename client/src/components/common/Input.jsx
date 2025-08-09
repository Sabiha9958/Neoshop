import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  type = 'text',
  required = false,
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 bg-cyber-light/50 border rounded-lg text-white 
    placeholder-gray-400 transition-all duration-300 focus:outline-none
    ${error 
      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
      : 'border-neon-blue/30 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20'
    }
    ${Icon && iconPosition === 'left' ? 'pl-12' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-12' : ''}
    ${className}
  `;

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className={`
            absolute top-1/2 transform -translate-y-1/2 text-gray-400
            ${iconPosition === 'left' ? 'left-3' : 'right-3'}
          `}>
            <Icon size={20} />
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={inputClasses}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
