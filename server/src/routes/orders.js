const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, paymentDetails } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and payment method are required'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock availability
    for (const item of cart.items) {
      if (item.product.stock.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0]?.url,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      sku: item.product.sku
    }));

    // Create order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      shipping: {
        address: shippingAddress,
        method: 'standard',
        cost: cart.totals.shipping,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      },
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      totals: cart.totals,
      status: 'pending'
    });

    await order.save();

    // Update product stock and analytics
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          'stock.quantity': -item.quantity,
          'analytics.purchases': item.quantity
        }
      });
    }

    // Clear cart
    cart.items = [];
    cart.totals = {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0
    };
    await cart.save();

    // Send order confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        template: 'orderConfirmation',
        data: {
          orderNumber: order.orderNumber,
          items: orderItems,
          total: cart.totals.total,
          customerName: req.user.name
        }
      });
    } catch (emailError) {
      console.log('Email sending failed:', emailError.message);
    }

    // Emit real-time notification to admin
    const io = req.app.get('io');
    io.to('admin').emit('new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      customer: req.user.name,
      total: order.totals.total
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { user: req.userId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('items.product', 'name images');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    order.cancellation = {
      reason: reason || 'Cancelled by customer',
      cancelledBy: 'customer',
      cancelledAt: new Date()
    };

    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'stock.quantity': item.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order'
    });
  }
});

module.exports = router;
