const express = require('express')
const { body, validationResult } = require('express-validator')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { protect, admin } = require('../middleware/auth')

const router = express.Router()

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.size').notEmpty().withMessage('Size is required'),
  body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
  body('shippingAddress.street').notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').notEmpty().withMessage('City is required'),
  body('shippingAddress.state').notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('ZIP code is required'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { items, shippingAddress, billingAddress, paymentMethod, paymentDetails } = req.body

    // Validate products and calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product || !product.isActive) {
        return res.status(400).json({ 
          message: `Product ${item.product} not found or unavailable` 
        })
      }

      // Check if size is available
      const sizeOption = product.sizes.find(s => s.size === item.size)
      if (!sizeOption) {
        return res.status(400).json({ 
          message: `Size ${item.size} not available for ${product.name}` 
        })
      }

      if (sizeOption.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name} in size ${item.size}` 
        })
      }

      const itemPrice = product.salePrice || product.price
      subtotal += itemPrice * item.quantity

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: itemPrice,
        size: item.size,
        color: item.color || '',
        quantity: item.quantity
      })

      // Update product stock
      sizeOption.stock -= item.quantity
      await product.save()
    }

    // Calculate totals
    const tax = subtotal * 0.08 // 8% tax
    const shippingCost = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shippingCost

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentDetails: paymentDetails || {},
      subtotal,
      tax,
      shippingCost,
      total
    })

    const savedOrder = await order.save()

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ message: 'Error creating order' })
  }
})

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Order.countDocuments({ user: req.user.id })

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ message: 'Error fetching orders' })
  }
})

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if order belongs to user or user is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' })
    }

    res.json({ order })
  } catch (error) {
    console.error('Get order error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.status(500).json({ message: 'Error fetching order' })
  }
})

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string'),
  body('note').optional().isString().withMessage('Note must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { status, trackingNumber, note } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = status
    if (trackingNumber) order.trackingNumber = trackingNumber
    if (note) {
      order.statusHistory.push({
        status,
        note,
        date: new Date()
      })
    }

    await order.save()

    res.json({
      message: 'Order status updated successfully',
      order
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ message: 'Error updating order status' })
  }
})

module.exports = router 