import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Shirt, 
  BookOpen, 
  Home, 
  Dumbbell, 
  Sparkles, 
  Gamepad2,
  Car
} from 'lucide-react';

const CategoryGrid = () => {
  const categories = [
    {
      name: 'Electronics',
      icon: Smartphone,
      count: '500+ Products',
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400',
      gradient: 'from-blue-500 to-cyan-500',
      href: '/products?category=electronics'
    },
    {
      name: 'Fashion',
      icon: Shirt,
      count: '300+ Products',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      gradient: 'from-pink-500 to-purple-500',
      href: '/products?category=clothing'
    },
    {
      name: 'Books',
      icon: BookOpen,
      count: '200+ Products',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      gradient: 'from-green-500 to-emerald-500',
      href: '/products?category=books'
    },
    {
      name: 'Home & Garden',
      icon: Home,
      count: '150+ Products',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      gradient: 'from-orange-500 to-red-500',
      href: '/products?category=home'
    },
    {
      name: 'Sports',
      icon: Dumbbell,
      count: '100+ Products',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      gradient: 'from-yellow-500 to-orange-500',
      href: '/products?category=sports'
    },
    {
      name: 'Beauty',
      icon: Sparkles,
      count: '80+ Products',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      gradient: 'from-pink-500 to-rose-500',
      href: '/products?category=beauty'
    },
    {
      name: 'Gaming',
      icon: Gamepad2,
      count: '120+ Products',
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
      gradient: 'from-purple-500 to-indigo-500',
      href: '/products?category=gaming'
    },
    {
      name: 'Automotive',
      icon: Car,
      count: '50+ Products',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
      gradient: 'from-gray-500 to-slate-500',
      href: '/products?category=automotive'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-cyber-light/10">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-cyber text-gradient mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our futuristic product categories and discover the latest in technology, 
            fashion, and lifestyle products designed for the cyber age.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            
            return (
              <motion.div
                key={category.name}
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Link to={category.href}>
                  <div className="relative overflow-hidden rounded-xl glass hover:bg-white/20 transition-all duration-300">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}></div>
                    </div>

                    {/* Content */}
                    <div className="relative p-6 h-48 flex flex-col justify-between">
                      {/* Icon */}
                      <div className="self-start">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg group-hover:bg-white/30 transition-all duration-300">
                          <Icon size={32} className="text-white" />
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="text-white">
                        <h3 className="text-xl font-semibold mb-1 group-hover:text-yellow-200 transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/80 group-hover:text-white transition-colors duration-300">
                          {category.count}
                        </p>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Cyber Lines */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-ghost px-8 py-3 font-semibold"
            >
              View All Categories
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
