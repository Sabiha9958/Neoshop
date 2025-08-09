const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  image: String,
  sku: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const shippingSchema = new mongoose.Schema({
  address: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' },
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
});

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentGateway: String,
  paidAt: Date,
  refundedAt: Date,
  refundAmount: Number,
  failureReason: String
});

const trackingSchema = new mongoose.Schema({
  number: String,
  carrier: String,
  url: String,
  status: String,
  lastUpdated: { type: Date, default: Date.now }
});

const timelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const totalsSchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'processing', 'packed', 
      'shipped', 'out_for_delivery', 'delivered', 
      'cancelled', 'returned', 'refunded'
    ],
    default: 'pending'
  },
  shipping: shippingSchema,
  payment: paymentSchema,
  totals: totalsSchema,
  coupon: {
    code: String,
    discount: Number,
    type: { type: String, enum: ['percentage', 'fixed'] }
  },
  tracking: trackingSchema,
  timeline: [timelineSchema],
  notes: String,
  cancellationReason: String,
  returnReason: String,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin'],
    default: 'web'
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order age
orderSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update timeline
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      status: this.status,
      timestamp: new Date(),
      note: `Order status changed to ${this.status}`
    });
  }
  next();
});

// Methods
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
};

orderSchema.methods.canBeReturned = function() {
  return this.status === 'delivered' && 
         Date.now() - this.createdAt < 30 * 24 * 60 * 60 * 1000; // 30 days
};

orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note: note || `Status updated to ${newStatus}`,
    updatedBy
  });
  return this.save();
};

// Static methods
orderSchema.statics.getRevenueByPeriod = async function(startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $nin: ['cancelled', 'refunded'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totals.total' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totals.total' }
      }
    }
  ]);
  
  return result[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
};

module.exports = mongoose.model('Order', orderSchema);
