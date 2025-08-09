import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  Search,
  X
} from 'lucide-react';

import { productsAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Get filters from URL
  const filters = {
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    featured: searchParams.get('featured') || '',
    brand: searchParams.get('brand') || ''
  };

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsAPI.getProducts(filters),
    keepPreviousData: true,
  });

  // Fetch categories for filters
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsAPI.getCategories(),
  });

  const updateFilters = (newFilters) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (!newFilters.page) {
      updatedParams.delete('page');
    }

    setSearchParams(updatedParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const sortOptions = [
    { label: 'Latest', value: 'createdAt-desc' },
    { label: 'Oldest', value: 'createdAt-asc' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating: High to Low', value: 'rating.average-desc' },
    { label: 'Name: A to Z', value: 'name-asc' },
  ];

  const handleSortChange = (sortValue) => {
    const [sortBy, sortOrder] = sortValue.split('-');
    updateFilters({ sortBy, sortOrder, page: 1 });
  };

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || {};
  const totalProducts = pagination.totalProducts || 0;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-cyber text-gradient mb-4">
            Products
          </h1>
          <p className="text-gray-400">
            Discover our collection of futuristic products
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
              className="w-full pl-10 pr-4 py-3 input-cyber"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              {/* Filter Toggle */}
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="btn-ghost flex items-center space-x-2"
              >
                <Filter size={16} />
                <span>Filters</span>
              </button>

              {/* Results Count */}
              <span className="text-gray-400">
                {totalProducts} products found
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input-cyber min-w-[200px]"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border border-neon-blue/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-neon-blue text-cyber-dark' : 'text-gray-400 hover:text-neon-blue'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-neon-blue text-cyber-dark' : 'text-gray-400 hover:text-neon-blue'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="shrink-0 overflow-hidden"
              >
                <ProductFilters
                  filters={filters}
                  categories={categoriesData?.data?.categories || []}
                  brands={categoriesData?.data?.brands || []}
                  onFilterChange={updateFilters}
                  onClearFilters={clearFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="card-cyber animate-pulse">
                    <div className="aspect-square bg-cyber-light/20 rounded-lg mb-4"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 text-lg mb-4">
                  Error loading products
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-cyber"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No products found
                </div>
                <button
                  onClick={clearFilters}
                  className="btn-ghost"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  layout
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}
                >
                  <AnimatePresence>
                    {products.map((product, index) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard 
                          product={product} 
                          viewMode={viewMode}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {pagination.total > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={pagination.current}
                      totalPages={pagination.total}
                      onPageChange={(page) => updateFilters({ page })}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
