import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.login(credentials);
          
          if (response.success) {
            const { token, user } = response;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            });
            
            // Set token in API headers
            authAPI.setAuthToken(token);
            
            toast.success(`Welcome back, ${user.name}! 🚀`);
            return { success: true };
          }
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Login failed';
          toast.error(message);
          return { success: false, message };
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.register(userData);
          
          if (response.success) {
            const { token, user } = response;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false
            });
            
            authAPI.setAuthToken(token);
            toast.success(`Welcome to NeoShop, ${user.name}! 🎉`);
            return { success: true };
          }
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Registration failed';
          toast.error(message);
          return { success: false, message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        
        authAPI.setAuthToken(null);
        toast.success('Logged out successfully');
      },

      updateProfile: async (profileData) => {
        try {
          const response = await authAPI.updateProfile(profileData);
          
          if (response.success) {
            set({ user: response.user });
            toast.success('Profile updated successfully');
            return { success: true };
          }
        } catch (error) {
          const message = error.response?.data?.message || 'Profile update failed';
          toast.error(message);
          return { success: false, message };
        }
      },

      fetchProfile: async () => {
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            set({ user: response.user });
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          // Don't show error toast for profile fetch failures
        }
      },

      initializeAuth: () => {
        const { token } = get();
        if (token) {
          authAPI.setAuthToken(token);
          // Optionally fetch fresh user data
          get().fetchProfile();
        }
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        authAPI.setAuthToken(null);
      }
    }),
    {
      name: 'neoshop-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
