import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Home,
  Package,
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const cartItemCount = getItemCount();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Categories', href: '/products?category=all' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-cyber font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-cyber text-glow bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              NeoShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link flex items-center space-x-1 ${
                    isActive ? 'nav-active' : ''
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search futuristic products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-cyber-light/30 border border-neon-blue/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 focus:outline-none transition-all duration-300"
              />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-400 hover:text-neon-blue transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-400 hover:text-neon-blue transition-colors duration-300"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-neon-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:text-neon-blue transition-colors duration-300"
                >
                  <User size={24} />
                  <span className="hidden sm:block text-sm">{user?.name}</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn-ghost px-4 py-2 rounded-lg"
                >
                  Login
                </Link>
              )}

              {/* User Dropdown */}
              <AnimatePresence>
                {isAuthenticated && isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 glass rounded-lg border border-white/10 shadow-xl"
                  >
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-neon-blue hover:bg-white/10 transition-colors duration-300"
                      >
                        <User size={16} className="mr-3" />
                        Profile
                      </Link>
                      
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-neon-blue hover:bg-white/10 transition-colors duration-300"
                        >
                          <Settings size={16} className="mr-3" />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-white/10 transition-colors duration-300"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-neon-blue transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10"
            >
              <div className="py-4 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-cyber-light/30 border border-neon-blue/30 rounded-lg text-white placeholder-gray-400 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 focus:outline-none"
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-neon-blue hover:bg-white/10 rounded-lg transition-all duration-300 ${
                          isActive ? 'text-neon-blue bg-white/10' : ''
                        }`}
                      >
                        {Icon && <Icon size={20} />}
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Auth */}
                {!isAuthenticated && (
                  <div className="px-4 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center btn-ghost py-2"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center btn-cyber py-2"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
