import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Camera,
  Lock,
  Package,
  Heart
} from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.addresses?.[0] || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const profileData = {
        name: formData.name,
        profile: {
          phone: formData.phone,
          addresses: [formData.address]
        }
      };

      await authAPI.updateProfile(profileData);
      updateProfile(profileData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-neon-blue rounded-full text-white hover:bg-neon-blue/80 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                <p className="text-gray-400">{user?.email}</p>
                <p className="text-sm text-neon-blue">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                icon={User}
              />
              
              <Input
                label="Email Address"
                value={formData.email}
                disabled={true}
                icon={Mail}
              />
              
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                icon={Phone}
              />
              
              <Input
                label="Street Address"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                disabled={!isEditing}
                icon={MapPin}
              />
              
              <Input
                label="City"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                disabled={!isEditing}
              />
              
              <Input
                label="State"
                value={formData.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                disabled={!isEditing}
              />
              
              <Input
                label="ZIP Code"
                value={formData.address.zipCode}
                onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                disabled={!isEditing}
              />
              
              <Input
                label="Country"
                value={formData.address.country}
                onChange={(e) => handleInputChange('address.country', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  icon={Edit3}
                  variant="outline"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.profile?.phone || '',
                        address: user?.profile?.addresses?.[0] || {
                          street: '',
                          city: '',
                          state: '',
                          zipCode: '',
                          country: 'India'
                        }
                      });
                    }}
                    variant="ghost"
                    icon={X}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    isLoading={isLoading}
                    icon={Save}
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        );

      case 'wishlist':
        return (
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">My Wishlist</h3>
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-gray-400">Your wishlist is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="card-cyber p-4">
                    <img
                      src={item.images?.[0]?.url}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-semibold text-white mb-2">{item.name}</h4>
                    <p className="text-neon-blue font-bold mb-4">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">Security Settings</h3>
            
            <div className="card-cyber p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-white">Password</h4>
                  <p className="text-gray-400">Change your password</p>
                </div>
                <Button
                  onClick={() => setShowPasswordModal(true)}
                  variant="outline"
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-neon-blue text-white'
                        : 'text-gray-400 hover:text-white hover:bg-cyber-light'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card-cyber p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                currentPassword: e.target.value
              }))}
            />
            
            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                newPassword: e.target.value
              }))}
            />
            
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
            />
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                onClick={() => setShowPasswordModal(false)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                isLoading={isLoading}
              >
                Change Password
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProfilePage;
