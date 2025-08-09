const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      bufferCommands: false,
      bufferMaxEntries: 0,
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event handlers
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed due to application termination');
        process.exit(0);
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Database health check
const checkDatabaseHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return {
      status: states[state],
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections).length
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
};

// Create indexes for better performance
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Products collection indexes
    await db.collection('products').createIndex({ name: 'text', description: 'text', tags: 'text' });
    await db.collection('products').createIndex({ category: 1, price: 1 });
    await db.collection('products').createIndex({ 'rating.average': -1 });
    await db.collection('products').createIndex({ isFeatured: 1, isActive: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });
    
    // Orders collection indexes
    await db.collection('orders').createIndex({ user: 1, createdAt: -1 });
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    
    // Carts collection indexes
    await db.collection('carts').createIndex({ user: 1 }, { unique: true });
    await db.collection('carts').createIndex({ lastUpdated: 1 });
    
    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error('Error creating database indexes:', error);
  }
};

// Seed database with initial data
const seedDatabase = async () => {
  try {
    const User = require('../models/User');
    const Product = require('../models/Product');
    
    // Create admin user if not exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        emailVerified: true
      });
      logger.info('Admin user created successfully');
    }
    
    // Seed sample products if none exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'CyberPhone X1',
          description: 'Next-generation smartphone with holographic display and AI assistant. Experience the future of mobile communication.',
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
            'Storage': '1TB + Unlimited Cloud'
          },
          features: ['Holographic Display', 'AI Assistant', 'Quantum Processing'],
          tags: ['smartphone', 'AI', 'holographic'],
          isFeatured: true,
          saleInfo: {
            isOnSale: true,
            salePrice: 89999,
            salePercentage: 10
          }
        }
        // Add more sample products here...
      ];
      
      await Product.insertMany(sampleProducts);
      logger.info('Sample products seeded successfully');
    }
  } catch (error) {
    logger.error('Error seeding database:', error);
  }
};

module.exports = {
  connectDB,
  checkDatabaseHealth,
  createIndexes,
  seedDatabase
};
