const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [10, 'Maximum quantity per item is 10']
    },
    price: {
      type: Number,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totals: {
    subtotal: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  appliedCoupons: [{
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  let subtotal = 0;
  
  this.items.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  this.totals.subtotal = subtotal;
  this.totals.tax = subtotal * 0.18; // 18% GST
  this.totals.shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
  
  // Apply coupon discounts
  let discount = 0;
  this.appliedCoupons.forEach(coupon => {
    if (coupon.type === 'percentage') {
      discount += subtotal * (coupon.discount / 100);
    } else {
      discount += coupon.discount;
    }
  });
  this.totals.discount = discount;
  
  this.totals.total = subtotal + this.totals.tax + this.totals.shipping - discount;
  this.lastUpdated = new Date();
  
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
