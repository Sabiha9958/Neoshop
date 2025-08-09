import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productsAPI } from '../services/api';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      featuredProducts: [],
      categories: [],
      brands: [],
      filters: {
        category: '',
        search: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        page: 1
      },
      pagination: {
        current: 1,
        total: 0,
        hasNext: false,
        hasPrev: false
      },
      isLoading: false,
      error: null,

      // Actions
      setProducts: (products) => set({ products }),
      
      setFeaturedProducts: (products) => set({ featuredProducts: products }),
      
      setCategories: (categories) => set({ categories }),
      
      setBrands: (brands) => set({ brands }),
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),
      
      setPagination: (pagination) => set({ pagination }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearFilters: () => set({
        filters: {
          category: '',
          search: '',
          minPrice: '',
          maxPrice: '',
          sortBy: 'createdAt',
          sortOrder: 'desc',
          page: 1
        }
      }),

      // Fetch actions
      fetchProducts: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await productsAPI.getProducts({
            ...get().filters,
            ...params
          });
          
          set({
            products: response.data.products,
            pagination: response.data.pagination,
            isLoading: false
          });
          
          return response.data;
        } catch (error) {
          set({
            error: error.message || 'Failed to fetch products',
            isLoading: false
          });
          throw error;
        }
      },

      fetchFeaturedProducts: async (limit = 8) => {
        try {
          const response = await productsAPI.getFeaturedProducts(limit);
          set({ featuredProducts: response.data });
          return response.data;
        } catch (error) {
          console.error('Failed to fetch featured products:', error);
          throw error;
        }
      },

      fetchCategories: async () => {
        try {
          const response = await productsAPI.getCategories();
          set({ 
            categories: response.data.categories,
            brands: response.data.brands 
          });
          return response.data;
        } catch (error) {
          console.error('Failed to fetch categories:', error);
          throw error;
        }
      },

      searchProducts: async (query) => {
        set({ isLoading: true });
        try {
          const response = await productsAPI.getProducts({
            search: query,
            page: 1
          });
          
          set({
            products: response.data.products,
            pagination: response.data.pagination,
            filters: { ...get().filters, search: query, page: 1 },
            isLoading: false
          });
          
          return response.data;
        } catch (error) {
          set({
            error: error.message || 'Search failed',
            isLoading: false
          });
          throw error;
        }
      }
    }),
    {
      name: 'neoshop-products',
      partialize: (state) => ({
        featuredProducts: state.featuredProducts,
        categories: state.categories,
        brands: state.brands
      })
    }
  )
);
