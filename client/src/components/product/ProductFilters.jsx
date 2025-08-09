import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';

const ProductFilters = ({ 
  filters, 
  categories, 
  brands, 
  onFilterChange, 
  onClearFilters 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true,
    features: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({
      [type]: value || '',
      page: 1
    });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({
      category: filters.category === category ? '' : category,
      page: 1
    });
  };

  const handleBrandChange = (brand) => {
    onFilterChange({
      brand: filters.brand === brand ? '' : brand,
      page: 1
    });
  };

  const handleFeatureChange = (feature) => {
    const newFeatures = filters.features ? filters.features.split(',') : [];
    const index = newFeatures.indexOf(feature);
    
    if (index > -1) {
      newFeatures.splice(index, 1);
    } else {
      newFeatures.push(feature);
    }
    
    onFilterChange({
      features: newFeatures.join(','),
      page: 1
    });
  };

  const priceRanges = [
    { label: 'Under ₹1,000', min: 0, max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
    { label: '₹25,000 - ₹50,000', min: 25000, max: 50000 },
    { label: 'Above ₹50,000', min: 50000, max: null }
  ];

  const ratings = [5, 4, 3, 2, 1];

  const features = [
    'Free Shipping',
    'On Sale',
    'Featured',
    'New Arrival',
    'Best Seller',
    'Eco Friendly'
  ];

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-neon-blue/20 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left py-2 text-white hover:text-neon-blue transition-colors"
      >
        <span className="font-medium">{title}</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== '' && value !== 'all'
  ).length;

  return (
    <div className="glass rounded-xl p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="text-neon-blue" size={20} />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="badge badge-primary">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
          >
            <X size={14} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2">
          {categories.map(category => (
            <label
              key={category}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 text-neon-blue bg-cyber-light border-gray-600 focus:ring-neon-blue focus:ring-2"
              />
              <span className="text-gray-300 group-hover:text-white transition-colors capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Price Range"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-3">
          {/* Quick Price Ranges */}
          <div className="space-y-2">
            {priceRanges.map((range, index) => {
              const isSelected = 
                filters.minPrice == range.min && 
                (range.max ? filters.maxPrice == range.max : !filters.maxPrice);
              
              return (
                <label
                  key={index}
                  className="flex items-center space-x-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={isSelected}
                    onChange={() => {
                      onFilterChange({
                        minPrice: range.min,
                        maxPrice: range.max || '',
                        page: 1
                      });
                    }}
                    className="w-4 h-4 text-neon-blue bg-cyber-light border-gray-600 focus:ring-neon-blue focus:ring-2"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {range.label}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Custom Price Range */}
          <div className="pt-3 border-t border-gray-600">
            <p className="text-sm text-gray-400 mb-2">Custom Range</p>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className="flex-1 input-cyber text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className="flex-1 input-cyber text-sm"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <FilterSection
          title="Brand"
          isExpanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {brands.map(brand => (
              <label
                key={brand}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand}
                  onChange={() => handleBrandChange(brand)}
                  className="w-4 h-4 text-neon-blue bg-cyber-light border-gray-600 focus:ring-neon-blue focus:ring-2"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Rating Filter */}
      <FilterSection
        title="Customer Rating"
        isExpanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        <div className="space-y-2">
          {ratings.map(rating => (
            <label
              key={rating}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating == rating}
                onChange={() => onFilterChange({
                  minRating: filters.minRating == rating ? '' : rating,
                  page: 1
                })}
                className="w-4 h-4 text-neon-blue bg-cyber-light border-gray-600 focus:ring-neon-blue focus:ring-2"
              />
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
                  & Up
                </span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Features Filter */}
      <FilterSection
        title="Features"
        isExpanded={expandedSections.features}
        onToggle={() => toggleSection('features')}
      >
        <div className="space-y-2">
          {features.map(feature => {
            const isSelected = filters.features?.split(',').includes(feature) || false;
            
            return (
              <label
                key={feature}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFeatureChange(feature)}
                  className="w-4 h-4 text-neon-blue bg-cyber-light border-gray-600 rounded focus:ring-neon-blue focus:ring-2"
                />
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {feature}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
};

export default ProductFilters;
