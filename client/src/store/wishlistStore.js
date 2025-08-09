import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Actions
      addToWishlist: (product) => {
        const { items } = get();
        
        // Check if product already exists
        const existingItem = items.find(item => item.id === product.id);
        
        if (existingItem) {
          toast.error('Product already in wishlist');
          return;
        }

        set({
          items: [...items, product]
        });
        
        toast.success('Added to wishlist');
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
        
        toast.success('Removed from wishlist');
      },

      clearWishlist: () => {
        set({ items: [] });
        toast.success('Wishlist cleared');
      },

      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item.id === productId);
      },

      getItemCount: () => {
        const { items } = get();
        return items.length;
      },

      moveToCart: (productId, addToCart) => {
        const { items } = get();
        const item = items.find(item => item.id === productId);
        
        if (item) {
          addToCart(item, 1);
          get().removeFromWishlist(productId);
          toast.success('Moved to cart');
        }
      }
    }),
    {
      name: 'neoshop-wishlist'
    }
  )
);
