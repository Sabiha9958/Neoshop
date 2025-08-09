import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center font-semibold 
    transition-all duration-300 rounded-lg focus:outline-none 
    focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-dark
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-neon-blue to-neon-purple text-white
      hover:shadow-neon focus:ring-neon-blue
      disabled:hover:shadow-none
    `,
    secondary: `
      bg-cyber-light text-white border border-neon-blue/30
      hover:bg-cyber-accent hover:border-neon-blue focus:ring-neon-blue
    `,
    outline: `
      border-2 border-neon-blue text-neon-blue bg-transparent
      hover:bg-neon-blue hover:text-cyber-dark focus:ring-neon-blue
    `,
    ghost: `
      text-neon-blue bg-transparent
      hover:bg-neon-blue/10 focus:ring-neon-blue
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-pink-500 text-white
      hover:shadow-lg hover:shadow-red-500/25 focus:ring-red-500
    `,
    success: `
      bg-gradient-to-r from-green-500 to-emerald-500 text-white
      hover:shadow-lg hover:shadow-green-500/25 focus:ring-green-500
    `
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  const content = (
    <>
      {isLoading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon size={16} className="mr-2" />
      )}
      
      <span>{children}</span>
      
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon size={16} className="ml-2" />
      )}
    </>
  );

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {content}
      
      {/* Cyber effect overlay */}
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 hover:translate-x-full rounded-lg" />
      )}
    </motion.button>
  );
};

export default Button;
