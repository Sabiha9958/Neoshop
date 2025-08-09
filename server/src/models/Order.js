const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String, // Store product name at time of order
    image: String, // Store primary image URL
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    sku: String
  }],
  shipping: {
    address: {
      name: {
        type: String,
        required: true
      },
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: String,
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      phone: String
    },
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0
    },
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'cod', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    gatewayResponse: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    },
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  totals: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    shipping: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  tracking: {
    number: String,
    url: String,
    carrier: String,
    updates: [{
      status: String,
      message: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      location: String
    }]
  },
  notes: {
    customer: String,
    admin: String
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['customer', 'admin', 'system']
    },
    cancelledAt: Date,
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed']
    }
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `NS${year}${month}${day}${random}`;
  }
  next();
});

// Add timeline entry when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: `Order status changed to ${this.status}`
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
