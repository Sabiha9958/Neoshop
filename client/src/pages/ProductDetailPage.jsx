import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Shield,
  Truck,
  RotateCcw,
  Check
} from 'lucide-react';

import { productsAPI } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/product/ProductCard';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProduct(id),
    enabled: !!id
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', product?.data?.category],
    queryFn: () => productsAPI.getProducts({ 
      category: product?.data?.category,
      limit: 4
    }),
    enabled: !!product?.data?.category
  });

  const productData = product?.data;
  const relatedProductsData = relatedProducts?.data?.products?.filter(p => p.id !== id) || [];

  useEffect(() => {
    if (productData?.images?.length > 0) {
      setSelectedImageIndex(0);
    }
  }, [productData]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (quantity > productData.stock.quantity) {
      toast.error('Insufficient stock available');
      return;
    }

    addToCart(productData, quantity);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= Math.min(10, productData.stock.quantity)) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.name,
          text: productData.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product URL copied to clipboard!');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  const getDiscountPercentage = () => {
    if (productData?.originalPrice && productData.price < productData.originalPrice) {
      return Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
    }
    return 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-cyber"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <button onClick={() => navigate('/products')} className="hover:text-neon-blue">
            Products
          </button>
          <span>/</span>
          <span className="text-white capitalize">{productData.category}</span>
          <span>/</span>
          <span className="text-neon-blue">{productData.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-cyber-light rounded-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={productData.images[selectedImageIndex]?.url}
                  alt={productData.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {productData.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(
                      selectedImageIndex === 0 ? productData.images.length - 1 : selectedImageIndex - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <button
                    onClick={() => setSelectedImageIndex(
                      selectedImageIndex === productData.images.length - 1 ? 0 : selectedImageIndex + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {getDiscountPercentage() > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="badge badge-danger">
                    -{getDiscountPercentage()}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {productData.images.length > 1 && (
              <div className="flex space-x-3">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-neon-blue' 
                        : 'border-transparent hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${productData.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-primary">
                  {productData.category}
                </span>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-neon-blue transition-colors"
                  title="Share Product"
                >
                  <Share2 size={20} />
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {productData.name}
              </h1>
              
              {productData.brand && (
                <p className="text-gray-400">
                  by <span className="text-neon-blue">{productData.brand}</span>
                </p>
              )}
              
              {productData.sku && (
                <p className="text-sm text-gray-500">
                  SKU: {productData.sku}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(productData.rating?.average || 0)}
                <span className="text-white font-medium ml-2">
                  {productData.rating?.average?.toFixed(1) || '0.0'}
                </span>
              </div>
              <span className="text-gray-400">
                ({productData.rating?.count || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-neon-blue">
                  ₹{productData.price?.toLocaleString()}
                </span>
                {productData.originalPrice && productData.originalPrice > productData.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{productData.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              {getDiscountPercentage() > 0 && (
                <p className="text-green-400 text-sm">
                  You save ₹{(productData.originalPrice - productData.price).toLocaleString()} 
                  ({getDiscountPercentage()}% off)
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {productData.stock.quantity > 0 ? (
                <>
                  <Check className="text-green-400" size={16} />
                  <span className="text-green-400">In Stock</span>
                  {productData.stock.quantity <= 10 && (
                    <span className="text-orange-400 text-sm">
                      (Only {productData.stock.quantity} left)
                    </span>
                  )}
                </>
              ) : (
                <span className="text-red-400">Out of Stock</span>
              )}
            </div>

            {/* Short Description */}
            {productData.shortDescription && (
              <p className="text-gray-300 leading-relaxed">
                {productData.shortDescription}
              </p>
            )}

            {/* Quantity and Add to Cart */}
            {productData.stock.quantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">Quantity:</span>
                  <div className="flex items-center border border-neon-blue/30 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 text-neon-blue hover:bg-neon-blue/20 disabled:text-gray-500 disabled:hover:bg-transparent transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 text-white font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= Math.min(10, productData.stock.quantity)}
                      className="p-2 text-neon-blue hover:bg-neon-blue/20 disabled:text-gray-500 disabled:hover:bg-transparent transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-cyber flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button className="p-3 border border-neon-blue/30 rounded-lg text-neon-blue hover:bg-neon-blue/20 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neon-blue/20">
              <div className="flex items-center space-x-2">
                <Shield className="text-neon-blue" size={20} />
                <span className="text-sm text-gray-300">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="text-neon-blue" size={20} />
                <span className="text-sm text-gray-300">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="text-neon-blue" size={20} />
                <span className="text-sm text-gray-300">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12">
          <div className="border-b border-neon-blue/20 mb-6">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-neon-blue text-neon-blue'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="glass rounded-xl p-6">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  {productData.description}
                </p>
                
                {productData.features && productData.features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-white font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {productData.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="text-neon-green" size={16} />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                {productData.specifications && Object.keys(productData.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(productData.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-600 last:border-b-0">
                        <span className="text-gray-400 font-medium">{key}:</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {productData.reviews && productData.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {productData.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-600 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <img
                              src={review.user.avatar || '/default-avatar.png'}
                              alt={review.user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="text-white font-medium">{review.user.name}</p>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {review.title && (
                          <h5 className="text-white font-medium mb-2">{review.title}</h5>
                        )}
                        
                        <p className="text-gray-300">{review.comment}</p>
                        
                        {review.verified && (
                          <span className="inline-flex items-center mt-2 text-xs text-green-400">
                            <Check size={12} className="mr-1" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProductsData.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProductsData.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
