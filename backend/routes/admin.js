const express = require('express')
const { body, validationResult } = require('express-validator')
const Product = require('../models/Product')
const Order = require('../models/Order')
const User = require('../models/User')
const { protect, admin } = require('../middleware/auth')

const router = express.Router()

// All routes are protected and require admin role
router.use(protect, admin)

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()
    const activeProducts = await Product.countDocuments({ isActive: true })
    const totalUsers = await User.countDocuments()
    const totalOrders = await Order.countDocuments()

    // Revenue calculation
    const completedOrders = await Order.find({ 
      'paymentDetails.paymentStatus': 'completed' 
    })
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0)

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean()

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        totalUsers,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      },
      recentOrders
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    res.status(500).json({ message: 'Error fetching admin stats' })
  }
})

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
router.post('/products', [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['mens', 'womens', 'accessories', 'shoes', 'bags', 'jewelry']).withMessage('Invalid category'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('sizes').isArray({ min: 1 }).withMessage('At least one size is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const productData = {
      ...req.body,
      createdBy: req.user.id
    }

    const product = new Product(productData)
    const savedProduct = await product.save()

    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Error creating product' })
  }
})

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
router.put('/products/:id', [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().notEmpty().withMessage('Product description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isIn(['mens', 'womens', 'accessories', 'shoes', 'bags', 'jewelry']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key]
      }
    })

    const updatedProduct = await product.save()

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ message: 'Error updating product' })
  }
})

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Soft delete - mark as inactive instead of removing
    product.isActive = false
    await product.save()

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Error deleting product' })
  }
})

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    let filter = {}
    if (req.query.status) {
      filter.status = req.query.status
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'name email')
      .lean()

    const total = await Order.countDocuments(filter)

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
    console.error('Get admin orders error:', error)
    res.status(500).json({ message: 'Error fetching orders' })
  }
})

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await User.countDocuments()

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get admin users error:', error)
    res.status(500).json({ message: 'Error fetching users' })
  }
})

module.exports = router 