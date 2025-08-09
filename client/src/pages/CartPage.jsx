import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';

import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    totals, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    isLoading 
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleQuantityUpdate = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  const cartItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="mx-auto text-gray-400 mb-6" size={80} />
          <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            Looks like you haven't added anything to your cart yet. 
            Start shopping to fill it up!
          </p>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-cyber px-8 py-3"
            >
              Start Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
            <p className="text-gray-400">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  variants={cartItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="card-cyber p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <Link 
                      to={`/products/${item.product.id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.product.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link 
                            to={`/products/${item.product.id}`}
                            className="text-lg font-semibold text-white hover:text-neon-blue transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          
                          {item.product.brand && (
                            <p className="text-sm text-gray-400">
                              by {item.product.brand}
                            </p>
                          )}
                          
                          <span className="badge badge-primary text-xs mt-1">
                            {item.product.category}
                          </span>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Price and Quantity Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-neon-blue">
                            ₹{item.price.toLocaleString()}
                          </span>
                          
                          {item.product.originalPrice && item.product.originalPrice > item.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-neon-blue/30 rounded-lg">
                            <button
                              onClick={() => handleQuantityUpdate(item.product.id, item.quantity - 1)}
                              className="p-2 text-neon-blue hover:bg-neon-blue/20 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            
                            <span className="px-4 py-2 text-white font-medium min-w-[60px] text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityUpdate(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= Math.min(10, item.product.stock?.quantity || 0)}
                              className="p-2 text-neon-blue hover:bg-neon-blue/20 disabled:text-gray-500 disabled:hover:bg-transparent transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <span className="text-lg font-bold text-white">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.product.stock?.quantity <= 5 && (
                        <p className="text-orange-400 text-sm">
                          Only {item.product.stock.quantity} left in stock
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="card-cyber p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">₹{totals.subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (18% GST)</span>
                  <span className="text-white">₹{totals.tax.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-white">
                    {totals.shipping === 0 ? (
                      <span className="text-green-400">Free</span>
                    ) : (
                      `₹${totals.shipping.toLocaleString()}`
                    )}
                  </span>
                </div>
                
                {totals.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-green-400">-₹{totals.discount.toLocaleString()}</span>
                  </div>
                )}
                
                <hr className="border-neon-blue/20" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-neon-blue">₹{totals.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Info */}
              {totals.subtotal < 500 && (
                <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                  <p className="text-orange-400 text-sm">
                    Add ₹{(500 - totals.subtotal).toLocaleString()} more for free shipping!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full btn-cyber mt-6 flex items-center justify-center space-x-2"
              >
                <CreditCard size={20} />
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </motion.button>

              {/* Security Features */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Shield size={16} className="text-neon-blue" />
                  <span>Secure SSL Encryption</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-400">
                  <Truck size={16} className="text-neon-blue" />
                  <span>Free shipping on orders above ₹500</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-400">
                  <ShoppingCart size={16} className="text-neon-blue" />
                  <span>Easy returns within 30 days</span>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-ghost flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={20} />
                <span>Continue Shopping</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
