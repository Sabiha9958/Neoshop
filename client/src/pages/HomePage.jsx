import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Zap, 
  Shield, 
  Truck, 
  Star, 
  ArrowRight,
  Play,
  Sparkles
} from 'lucide-react';

import { productsAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Hero from '../components/home/Hero';
import FeaturesSection from '../components/home/FeaturesSection';
import CategoryGrid from '../components/home/CategoryGrid';

const HomePage = () => {
  // Fetch featured products
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsAPI.getFeaturedProducts(8),
  });

  const features = [
    {
      icon: Zap,
      title: 'Quantum Speed',
      description: 'Lightning-fast delivery with our quantum logistics network'
    },
    {
      icon: Shield,
      title: 'Cyber Security',
      description: 'Military-grade encryption protects all your transactions'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Handpicked futuristic products from top brands'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery on orders above ₹500 across the galaxy'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '5K+', label: 'Products' },
    { number: '99%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-cyber-light/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-cyber text-neon-blue mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-cyber text-gradient mb-4">
              Why Choose NeoShop?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the future of shopping with our cutting-edge platform designed for the cyber age
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-cyber group hover:scale-105"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mb-6 group-hover:animate-pulse">
                      <Icon className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryGrid />

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-4xl font-cyber text-gradient mb-4">
                Featured Products
              </h2>
              <p className="text-gray-400">
                Discover our handpicked selection of futuristic products
              </p>
            </div>
            <Link
              to="/products?featured=true"
              className="btn-ghost flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card-cyber animate-pulse">
                  <div className="aspect-square bg-cyber-light/20 rounded-lg mb-4"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.data?.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-cyber-dark to-cyber-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="mx-auto text-neon-blue mb-6" size={48} />
            <h2 className="text-4xl font-cyber text-gradient mb-4">
              Stay in the Loop
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Be the first to know about our latest futuristic products, exclusive deals, and cyber events
            </p>
            
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 input-cyber"
              />
              <button
                type="submit"
                className="btn-cyber px-8"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              Join 10,000+ cyber citizens already subscribed
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
