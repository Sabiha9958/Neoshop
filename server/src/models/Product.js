const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['electronics', 'clothing', 'books', 'home', 'sports', 'beauty', 'toys', 'gaming', 'automotive'],
      message: 'Please select a valid category'
    }
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    uppercase: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    publicId: String // for Cloudinary
  }],
  stock: {
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    reserved: {
      type: Number,
      default: 0
    }
  },
  specifications: {
    type: Map,
    of: String
  },
  features: [String],
  tags: [String],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch', 'kg', 'lb'],
      default: 'cm'
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      maxlength: 100
    },
    comment: {
      type: String,
      maxlength: 1000
    },
    helpful: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    verified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  saleInfo: {
    isOnSale: {
      type: Boolean,
      default: false
    },
    salePrice: Number,
    saleStartDate: Date,
    saleEndDate: Date,
    salePercentage: Number
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'heavy', 'fragile', 'express'],
      default: 'standard'
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    cartAdds: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Number,
      default: 0
    },
    wishlistAdds: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'seo.slug': 1 });
productSchema.index({ sku: 1 });

// Generate SKU before saving
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const prefix = this.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.sku = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

// Generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Calculate sale percentage
productSchema.pre('save', function(next) {
  if (this.saleInfo.isOnSale && this.saleInfo.salePrice && this.originalPrice) {
    this.saleInfo.salePercentage = Math.round(
      ((this.originalPrice - this.saleInfo.salePrice) / this.originalPrice) * 100
    );
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
