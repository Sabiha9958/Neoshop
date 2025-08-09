import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart,
  LogOut,
  Settings,
  Package,
  ChevronDown
} from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import SearchModal from '../search/SearchModal';
import Button from '../common/Button';
import useDebounce from '../../hooks/useDebounce';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems, getItemCount } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Categories for navigation
  const categories = [
    { name: 'Electronics', href: '/products?category=electronics' },
    { name: 'Fashion', href: '/products?category=clothing' },
    { name: 'Books', href: '/products?category=books' },
    { name: 'Home', href: '/products?category=home' },
    { name: 'Sports', href: '/products?category=sports' },
  ];

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Handle search
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(debouncedSearchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  }, [debouncedSearchQuery, navigate]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const cartItemCount = getItemCount();
  const wishlistItemCount = getWishlistCount();

  return (
    <header className="sticky top-0 z-50 bg-cyber-dark/95 backdrop-blur-md border-b border-neon-blue/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-cyber font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-cyber text-gradient hidden sm:block">
              NeoShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="text-gray-300 hover:text-neon-blue transition-colors duration-200"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cyber-light/50 border border-neon-blue/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-neon-blue transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-400 hover:text-neon-blue transition-colors"
              >
                <Heart size={20} />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-neon-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-400 hover:text-neon-blue transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-neon-blue transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <ChevronDown size={16} className="hidden sm:block" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 glass rounded-xl py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-neon-blue/20">
                        <p className="text-white font-semibold">{user?.name}</p>
                        <p className="text-gray-400 text-sm">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package size={16} />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-neon-purple hover:bg-neon-purple/10 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings size={16} />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-neon-blue transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-neon-blue/30 py-4"
            >
              <nav className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="block py-2 text-gray-300 hover:text-neon-blue transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
};

export default Navbar;
