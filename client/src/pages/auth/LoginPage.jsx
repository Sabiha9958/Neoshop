import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    const result = await login(data);
    // Navigation handled in store
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-cyber font-bold text-xl">N</span>
            </div>
            <span className="text-2xl font-cyber text-gradient">NeoShop</span>
          </Link>
          
          <h2 className="text-3xl font-cyber text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-400">
            Sign in to your cyber account
          </p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit(onSubmit)}
          className="card-cyber"
        >
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="input-group">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-cyber"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="input-cyber pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-blue"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-neon-blue bg-cyber-light border-gray-600 rounded focus:ring-neon-blue focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-neon-blue hover:text-neon-purple transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-cyber flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              state={{ from: location.state?.from }}
              className="text-neon-blue hover:text-neon-purple transition-colors font-medium"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card-cyber border-neon-purple/30"
        >
          <h3 className="text-sm font-medium text-neon-purple mb-3">
            Demo Credentials
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">User:</span>
              <span className="text-white ml-2">user@demo.com / password123</span>
            </div>
            <div>
              <span className="text-gray-400">Admin:</span>
              <span className="text-white ml-2">admin@neoshop.com / admin123456</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
