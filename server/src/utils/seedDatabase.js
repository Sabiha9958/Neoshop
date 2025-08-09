const Product = require('../models/Product');
const User = require('../models/User');

const sampleProducts = [
  {
    name: "CyberPhone X1",
    description: "Next-generation smartphone with holographic display and AI assistant. Features quantum processing and unlimited cloud storage.",
    shortDescription: "Futuristic smartphone with holographic display",
    price: 89999,
    originalPrice: 99999,
    category: "electronics",
    subcategory: "smartphones",
    brand: "CyberTech",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
        alt: "CyberPhone X1",
        isPrimary: true
      }
    ],
    stock: { quantity: 50, lowStockThreshold: 10 },
    specifications: {
      "Display": "6.8-inch Holographic OLED",
      "Processor": "Quantum Core X1",
      "RAM": "16GB",
      "Storage": "1TB + Unlimited Cloud",
      "Camera": "108MP Triple Camera",
      "Battery": "5000mAh Wireless"
    },
    features: ["Holographic Display", "AI Assistant", "Quantum Processing", "Wireless Charging"],
    tags: ["smartphone", "holographic", "AI", "quantum"],
    isFeatured: true,
    saleInfo: {
      isOnSale: true,
      salePrice: 89999,
      salePercentage: 10
    }
  },
  {
    name: "Neural Gaming Headset",
    description: "Revolutionary gaming headset with direct neural interface. Experience games like never before with mind-controlled gameplay.",
    shortDescription: "Neural interface gaming headset",
    price: 45999,
    category: "electronics",
    subcategory: "gaming",
    brand: "NeuroGear",
    images: [
      {
        url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
        alt: "Neural Gaming Headset",
        isPrimary: true
      }
    ],
    stock: { quantity: 25, lowStockThreshold: 5 },
    specifications: {
      "Interface": "Direct Neural Connection",
      "Audio": "Spatial 3D Audio",
      "Microphone": "Noise-Canceling Neural",
      "Connectivity": "Wireless Neural Link",
      "Battery": "24-hour Continuous Use"
    },
    features: ["Neural Interface", "Mind Control", "Spatial Audio", "Wireless"],
    tags: ["gaming", "neural", "headset", "VR"],
    isFeatured: true
  },
  {
    name: "Cyber Jacket Elite",
    description: "Smart jacket with built-in climate control, LED display, and biometric monitoring. Perfect for the modern cyber citizen.",
    shortDescription: "Smart jacket with climate control",
    price: 25999,
    category: "clothing",
    subcategory: "jackets",
    brand: "CyberFashion",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
        alt: "Cyber Jacket Elite",
        isPrimary: true
      }
    ],
    stock: { quantity: 35, lowStockThreshold: 8 },
    specifications: {
      "Material": "Smart Fiber Composite",
      "Display": "Flexible LED Matrix",
      "Climate Control": "Active Temperature Regulation",
      "Sensors": "Biometric Monitoring",
      "Battery": "7-day Smart Usage"
    },
    features: ["Climate Control", "LED Display", "Biometric Sensors", "Smart Fabric"],
    tags: ["smart clothing", "LED", "climate", "biometric"],
    isFeatured: true
  },
  {
    name: "Quantum Home Assistant",
    description: "AI-powered home automation hub with quantum computing capabilities. Controls all smart devices and predicts your needs.",
    shortDescription: "Quantum AI home automation hub",
    price: 35999,
    category: "home",
    subcategory: "automation",
    brand: "QuantumHome",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        alt: "Quantum Home Assistant",
        isPrimary: true
      }
    ],
    stock: { quantity: 40, lowStockThreshold: 10 },
    specifications: {
      "Processor": "Quantum AI Core",
      "Connectivity": "5G, WiFi 7, Bluetooth 6",
      "Voice Recognition": "Multi-language Neural",
      "Display": "Holographic Interface",
      "Compatibility": "10,000+ Smart Devices"
    },
    features: ["Quantum Computing", "Predictive AI", "Voice Control", "Universal Compatibility"],
    tags: ["home automation", "AI", "quantum", "smart home"],
    isFeatured: false
  },
  {
    name: "Cyberpunk Sneakers",
    description: "Self-lacing sneakers with LED trim and impact absorption technology. Style meets functionality in these futuristic kicks.",
    shortDescription: "Self-lacing LED sneakers",
    price: 18999,
    category: "clothing",
    subcategory: "shoes",
    brand: "FutureStep",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
        alt: "Cyberpunk Sneakers",
        isPrimary: true
      }
    ],
    stock: { quantity: 60, lowStockThreshold: 15 },
    specifications: {
      "Lacing": "Auto-Adjustment System",
      "Lighting": "Programmable LED Strips",
      "Sole": "Shock Absorption Technology",
      "Material": "Breathable Smart Mesh",
      "Battery": "30-day LED Usage"
    },
    features: ["Self-Lacing", "LED Lighting", "Shock Absorption", "Smart Material"],
    tags: ["sneakers", "LED", "self-lacing", "smart"],
    isFeatured: false
  }
];

const seedDatabase = async () => {
  try {
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log('🌱 Database already seeded with products');
      return;
    }

    // Create sample products
    await Product.insertMany(sampleProducts);
    console.log('🌱 Sample products seeded successfully');

    // Create admin user if not exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@neoshop.com' });
    if (!existingAdmin) {
      const admin = new User({
        name: 'NeoShop Admin',
        email: process.env.ADMIN_EMAIL || 'admin@neoshop.com',
        password: process.env.ADMIN_PASSWORD || 'admin123456',
        role: 'admin',
        emailVerified: true
      });
      await admin.save();
      console.log('👑 Admin user created successfully');
    }

  } catch (error) {
    console.error('❌ Database seeding error:', error);
  }
};

module.exports = seedDatabase;
