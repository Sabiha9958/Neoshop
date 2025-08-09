import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    addToCart(product, 1);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    toast.info('Quick view coming soon!');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    toast.info('Wishlist coming soon!');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  const getPrimaryImage = () => {
    const primaryImage = product.images?.find(img => img.isPrimary);
    return primaryImage?.url || product.images?.[0]?.url || '/placeholder-product.jpg';
  };

  const getDiscountPercentage = () => {
    if (product.originalPrice && product.price < product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className="card-product flex p-4 mb-4"
      >
        <div className="w-32 h-32 flex-shrink-0 mr-4">
          <img
            src={getPrimaryImage()}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold text-white hover:text-neon-blue transition-colors">
                {product.name}
              </h3>
            </Link>
            
            {getDiscountPercentage() > 0 && (
              <span className="badge badge-danger">
                -{getDiscountPercentage()}%
              </span>
            )}
          </div>
          
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
            {product.shortDescription || product.description}
          </p>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-3">
              {renderStars(product.rating?.average || 0)}
              <span className="text-sm text-gray-400 ml-1">
                ({product.rating?.count || 0})
              </span>
            </div>
            
            <span className="badge badge-primary">
              {product.category}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-neon-blue">
                ₹{product.price?.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleQuickView}
                className="p-2 bg-cyber-light hover:bg-neon-blue/20 rounded-lg transition-colors"
                title="Quick View"
              >
                <Eye size={16} className="text-neon-blue" />
              </button>
              
              <button
                onClick={handleWishlist}
                className="p-2 bg-cyber-light hover:bg-red-500/20 rounded-lg transition-colors"
                title="Add to Wishlist"
              >
                <Heart size={16} className="text-red-400" />
              </button>
              
              <button
                onClick={handleAddToCart}
                className="btn-cyber px-4 py-2"
                disabled={product.stock?.quantity === 0}
              >
                <ShoppingCart size={16} className="mr-2" />
                {product.stock?.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="card-product relative group"
    >
      {/* Discount Badge */}
      {getDiscountPercentage() > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <span className="badge badge-danger">
            -{getDiscountPercentage()}%
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Add to Wishlist"
      >
        <Heart size={18} className="text-white hover:text-red-400 transition-colors" />
      </button>

      {/* Product Image */}
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-xl">
          <img
            src={getPrimaryImage()}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
            <button
              onClick={handleQuickView}
              className="btn-ghost p-3 rounded-full"
              title="Quick View"
            >
              <Eye size={20} />
            </button>
            
            <button
              onClick={handleAddToCart}
              className="btn-cyber p-3 rounded-full"
              disabled={product.stock?.quantity === 0}
              title="Add to Cart"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Category & Stock Status */}
        <div className="flex justify-between items-center mb-2">
          <span className="badge badge-primary text-xs">
            {product.category}
          </span>
          
          {product.stock?.quantity <= 5 && product.stock?.quantity > 0 && (
            <span className="text-xs text-orange-400">
              Only {product.stock.quantity} left
            </span>
          )}
          
          {product.stock?.quantity === 0 && (
            <span className="text-xs text-red-400 font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-white mb-2 hover:text-neon-blue transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-gray-400 mb-2">
            by {product.brand}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {renderStars(product.rating?.average || 0)}
          </div>
          <span className="text-sm text-gray-400">
            ({product.rating?.count || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-neon-blue">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock?.quantity === 0}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
            product.stock?.quantity === 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'btn-cyber'
          }`}
        >
          {product.stock?.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Featured Badge */}
      {product.isFeatured && (
        <div className="absolute bottom-4 left-4">
          <span className="badge badge-success text-xs">
            Featured
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard;
