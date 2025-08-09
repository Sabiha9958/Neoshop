import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const features = [
    { icon: Zap, text: "Lightning Fast Delivery" },
    { icon: Shield, text: "Secure Payments" },
    { icon: Truck, text: "Free Shipping Above ₹500" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyber-dark via-cyber-light to-cyber-dark">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-cyber font-bold">
              <span className="text-gradient bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green bg-clip-text text-transparent">
                NeoShop
              </span>
            </h1>
            
            <p className="text-2xl md:text-4xl text-white font-light">
              Experience the{' '}
              <span className="text-neon-blue font-semibold">Future</span>
              {' '}of Shopping
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Step into the cyber age with our cutting-edge e-commerce platform. 
            Discover futuristic products, enjoy seamless shopping, and embrace 
            the digital revolution.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <Link to="/products" className="group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-cyber px-8 py-4 text-lg font-semibold flex items-center space-x-2"
              >
                <span>Explore Products</span>
                <ArrowRight 
                  size={20} 
                  className="group-hover:translate-x-1 transition-transform" 
                />
              </motion.button>
            </Link>
            
            <Link to="/about" className="group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-ghost px-8 py-4 text-lg font-semibold"
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="glass rounded-xl p-6 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg group-hover:animate-pulse">
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className="text-white font-medium">
                      {feature.text}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={itemVariants}
            className="pt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex flex-col items-center space-y-2 text-gray-400"
            >
              <span className="text-sm">Scroll to explore</span>
              <div className="w-px h-8 bg-gradient-to-b from-neon-blue to-transparent"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Cyber Lines Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-50"></div>
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-neon-green to-transparent opacity-30"></div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-neon-blue to-transparent opacity-30"></div>
      </div>
    </section>
  );
};

export default Hero;
