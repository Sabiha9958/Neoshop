import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Lock,
  ArrowLeft,
  Check
} from 'lucide-react';

import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  const { items, totals, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
      phone: user?.profile?.phone || '',
    }
  });

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit = async (data) => {
    setIsProcessing(true);
    try {
      const orderData = {
        shippingAddress: {
          name: data.name,
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country || 'India',
          phone: data.phone
        },
        paymentMethod,
        paymentDetails: {
          // In a real app, this would be handled by a payment processor
          transactionId: `txn_${Date.now()}`
        }
      };

      const result = await ordersAPI.createOrder(orderData);
      
      if (result.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${result.data.orderId}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI Payment', icon: CreditCard },
    { id: 'net_banking', name: 'Net Banking', icon: CreditCard },
    { id: 'cod', name: 'Cash on Delivery', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-gray-400 hover:text-neon-blue transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-white">Checkout</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="card-cyber p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Mail className="text-neon-blue" size={20} />
                  <span>Contact Information</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="input-group">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="input-cyber"
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>

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
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                        })}
                        className="input-cyber"
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="input-group">
                      <Phone className="input-icon" size={20} />
                      <input
                        type="tel"
                        {...register('phone', { 
                          required: 'Phone number is required',
                          pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone number' }
                        })}
                        className="input-cyber"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card-cyber p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <MapPin className="text-neon-blue" size={20} />
                  <span>Shipping Address</span>
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      {...register('address', { required: 'Address is required' })}
                      className="input-cyber"
                      placeholder="Enter your street address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        {...register('city', { required: 'City is required' })}
                        className="input-cyber"
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        {...register('state', { required: 'State is required' })}
                        className="input-cyber"
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-400">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        {...register('zipCode', { 
                          required: 'ZIP code is required',
                          pattern: { value: /^[0-9]{6}$/, message: 'Invalid ZIP code' }
                        })}
                        className="input-cyber"
                        placeholder="ZIP Code"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-400">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card-cyber p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <CreditCard className="text-neon-blue" size={20} />
                  <span>Payment Method</span>
                </h3>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-neon-blue bg-neon-blue/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-neon-blue bg-cyber-light border-gray-600 focus:ring-neon-blue focus:ring-2"
                        />
                        <Icon className="ml-3 text-gray-400" size={20} />
                        <span className="ml-3 text-white">{method.name}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Card Details (only show for credit card) */}
                {paymentMethod === 'credit_card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="input-cyber"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="input-cyber"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="input-cyber"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="card-cyber p-6 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.images?.[0]?.url}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-white font-medium">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-600 mb-6" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">₹{totals.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax</span>
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
                  
                  <hr className="border-gray-600" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-neon-blue">₹{totals.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-cyber mt-6 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Lock size={20} />
                      <span>Place Order</span>
                    </>
                  )}
                </motion.button>

                {/* Security Note */}
                <p className="text-xs text-gray-400 text-center mt-4">
                  Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
