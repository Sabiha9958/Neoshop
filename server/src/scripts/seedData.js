const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const { connectDB } = require('../config/database');

const sampleProducts = [
  {
    name: 'CyberPhone X1',
    description: 'Next-generation smartphone with holographic display and AI assistant. Experience the future of mobile communication with quantum processing power.',
    shortDescription: 'Futuristic smartphone with AI',
    price: 89999,
    originalPrice: 99999,
    category: 'electronics',
    subcategory: 'smartphones',
    brand: 'CyberTech',
    sku: 'ELE-CYBX1-001',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        alt: 'CyberPhone X1',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 50,
      lowStockThreshold: 10
    },
    specifications: {
      'Display': '6.8-inch Holographic OLED',
      'Processor': 'Quantum Core X1',
      'RAM': '16GB',
      'Storage': '1TB + Unlimited Cloud',
      'Camera': '108MP AI Camera',
      'Battery': '5000mAh Wireless'
    },
    features: ['Holographic Display', 'AI Assistant', 'Quantum Processing', 'Wireless Charging'],
    tags: ['smartphone', 'AI', 'holographic', 'quantum'],
    isFeatured: true,
    saleInfo: {
      isOnSale: true,
      salePrice: 89999,
      salePercentage: 10
    }
  },
  {
    name: 'Neural Gaming Headset',
    description: 'Revolutionary gaming headset with neural interface technology. Control games with your thoughts and experience immersive virtual reality.',
    shortDescription: 'Mind-controlled gaming headset',
    price: 45999,
    originalPrice: 49999,
    category: 'electronics',
    subcategory: 'gaming',
    brand: 'NeuroGear',
    sku: 'ELE-NEUR-002',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        alt: 'Neural Gaming Headset',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 25,
      lowStockThreshold: 5
    },
    specifications: {
      'Technology': 'Neural Interface',
      'Frequency': '20Hz - 40,000Hz',
      'Drivers': '50mm Neodymium',
      'Connectivity': 'Wireless + Neural',
      'Battery': '20 hours'
    },
    features: ['Neural Interface', 'Wireless', '7.1 Surround Sound', 'Noise Cancellation'],
    tags: ['gaming', 'headset', 'neural', 'vr'],
    isFeatured: true,
    saleInfo: {
      isOnSale: true,
      salePrice: 45999,
      salePercentage: 8
    }
  },
  {
    name: 'Quantum Fitness Tracker',
    description: 'Advanced fitness tracker with quantum sensors that monitor your health at the cellular level. Track vitals with unprecedented accuracy.',
    shortDescription: 'Quantum health monitoring',
    price: 15999,
    category: 'electronics',
    subcategory: 'wearables',
    brand: 'QuantumHealth',
    sku: 'ELE-QUAN-003',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800',
        alt: 'Quantum Fitness Tracker',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 100,
      lowStockThreshold: 20
    },
    specifications: {
      'Sensors': 'Quantum Biometric',
      'Display': '1.4" AMOLED',
      'Battery': '10 days',
      'Water Resistance': 'IP68',
      'Connectivity': 'Bluetooth 5.2'
    },
    features: ['Quantum Sensors', 'Heart Rate Monitor', 'Sleep Tracking', 'Water Resistant'],
    tags: ['fitness', 'tracker', 'quantum', 'health'],
    isFeatured: false
  },
  {
    name: 'Cyber Fashion Jacket',
    description: 'Stylish cyber-punk inspired jacket with LED accents and smart fabric technology. Perfect for the urban cyber warrior.',
    shortDescription: 'LED-enhanced cyber jacket',
    price: 8999,
    originalPrice: 12999,
    category: 'clothing',
    subcategory: 'jackets',
    brand: 'CyberWear',
    sku: 'CLO-CYBJ-004',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
        alt: 'Cyber Fashion Jacket',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 75,
      lowStockThreshold: 15
    },
    specifications: {
      'Material': 'Smart Fabric Blend',
      'LEDs': 'Programmable RGB',
      'Sizes': 'S, M, L, XL, XXL',
      'Care': 'Machine Washable',
      'Power': 'USB-C Rechargeable'
    },
    features: ['LED Accents', 'Water Resistant', 'Smart Fabric', 'Rechargeable'],
    tags: ['fashion', 'jacket', 'LED', 'cyberpunk'],
    isFeatured: false,
    saleInfo: {
      isOnSale: true,
      salePrice: 8999,
      salePercentage: 30
    }
  },
  {
    name: 'Digital Cookbook: Future Cuisine',
    description: 'Interactive digital cookbook featuring futuristic recipes and holographic cooking instructions. Learn to cook with AI assistance.',
    shortDescription: 'Interactive holographic cookbook',
    price: 2999,
    category: 'books',
    subcategory: 'cooking',
    brand: 'FutureBooks',
    sku: 'BOO-DIGI-005',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
        alt: 'Digital Cookbook',
        isPrimary: true
      }
    ],
    stock: {
      quantity: 200,
      lowStockThreshold: 30
    },
    specifications: {
      'Format': 'Digital + Holographic',
      'Pages': '500+ Interactive',
      'Languages': '12 Languages',
      'Compatibility': 'All Devices',
      'Updates': 'Monthly Recipe Updates'
    },
    features: ['Holographic Instructions', 'AI Chef Assistant', 'Voice Commands', 'Multi-language'],
    tags: ['cookbook', 'digital', 'holographic', 'AI'],
    isFeatured: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Seeding database...');
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    console.log('🗑️  Cleared existing data');
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@neoshop.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
      emailVerified: true,
      profile: {
        phone: '+91 9876543210'
      }
    });
    
    console.log('👑 Admin user created');
    
    // Create sample user
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'user@demo.com',
      password: 'password123',
      role: 'user',
      emailVerified: true,
      profile: {
        phone: '+91 1234567890',
        addresses: [{
          type: 'home',
          name: 'Home Address',
          street: '123 Cyber Street',
          city: 'Neo City',
          state: 'Digital State',
          zipCode: '123456',
          country: 'India',
          isDefault: true
        }]
      }
    });
    
    console.log('👤 Sample user created');
    
    // Create products
    const products = await Product.insertMany(sampleProducts);
    
    console.log(`📦 Created ${products.length} products`);
    
    // Update some products with reviews
    const reviewsData = [
      {
        user: sampleUser._id,
        rating: 5,
        title: 'Amazing product!',
        comment: 'This product exceeded all my expectations. The quality is outstanding and the features work flawlessly.',
        verified: true
      },
      {
        user: adminUser._id,
        rating: 4,
        title: 'Great value for money',
        comment: 'Really impressed with the build quality and performance. Highly recommended!',
        verified: true
      }
    ];
    
    // Add reviews to first product
    if (products.length > 0) {
      products[0].reviews = reviewsData;
      products[0].rating.count = reviewsData.length;
      products[0].rating.average = reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewsData.length;
      await products[0].save();
      
      console.log('⭐ Added sample reviews');
    }
    
    console.log('✅ Database seeded successfully!');
    console.log(`
📊 Seeding Summary:
- Users: 2 (1 admin, 1 regular user)
- Products: ${products.length}
- Reviews: ${reviewsData.length}

🔐 Default Credentials:
Admin: ${process.env.ADMIN_EMAIL || 'admin@neoshop.com'} / ${process.env.ADMIN_PASSWORD || 'admin123456'}
User: user@demo.com / password123
    `);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleProducts };
