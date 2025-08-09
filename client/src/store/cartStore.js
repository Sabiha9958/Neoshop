import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { cartAPI } from '../services/api';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      totals: {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0
      },
      isLoading: false,

      // Actions
      addToCart: async (product, quantity = 1) => {
        try {
          const { items } = get();
          const existingItem = items.find(item => item.product._id === product._id);
          
          if (existingItem) {
            await get().updateQuantity(product._id, existingItem.quantity + quantity);
          } else {
            const newItem = {
              product,
              quantity,
              price: product.saleInfo?.isOnSale ? product.saleInfo.salePrice : product.price
            };
            
            set(state => ({
              items: [...state.items, newItem]
            }));
            
            get().calculateTotals();
            toast.success(`${product.name} added to cart`);
          }
        } catch (error) {
          toast.error('Failed to add item to cart');
        }
      },

      removeFromCart: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.product._id !== productId)
        }));
        get().calculateTotals();
        toast.success('Item removed from cart');
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.product._id === productId
              ? { ...item, quantity }
              : item
          )
        }));
        get().calculateTotals();
      },

      clearCart: () => {
        set({ 
          items: [],
          totals: {
            subtotal: 0,
            tax: 0,
            shipping: 0,
            discount: 0,
            total: 0
          }
        });
        toast.success('Cart cleared');
      },

      calculateTotals: () => {
        const { items } = get();
        
        const subtotal = items.reduce((sum, item) => {
          return sum + (item.price * item.quantity);
        }, 0);
        
        const tax = subtotal * 0.18; // 18% GST
        const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
        const discount = 0; // TODO: Implement coupon system
        const total = subtotal + tax + shipping - discount;
        
        set({
          totals: {
            subtotal,
            tax,
            shipping,
            discount,
            total
          }
        });
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getItemPrice: (productId) => {
        const { items } = get();
        const item = items.find(item => item.product._id === productId);
        return item ? item.price : 0;
      },

      syncWithServer: async () => {
        try {
          set({ isLoading: true });
          const response = await cartAPI.getCart();
          
          if (response.success) {
            set({
              items: response.data.items,
              totals: response.data.totals,
              isLoading: false
            });
          }
        } catch (error) {
          set({ isLoading: false });
          console.error('Failed to sync cart with server:', error);
        }
      }
    }),
    {
      name: 'neoshop-cart',
      partialize: (state) => ({
        items: state.items,
        totals: state.totals
      })
    }
  )
);
