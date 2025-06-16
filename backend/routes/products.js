const express = require('express')
const { body, validationResult, query } = require('express-validator')
const Product = require('../models/Product')
const { protect, admin, optionalAuth } = require('../middleware/auth')

const router = express.Router()

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['mens', 'womens', 'accessories', 'shoes', 'bags', 'jewelry']).withMessage('Invalid category'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sort').optional().isIn(['price', '-price', 'name', '-name', 'createdAt', '-createdAt', 'rating', '-rating']).withMessage('Invalid sort field')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

    // Build filter object
    let filter = { isActive: true }

    if (req.query.category) {
      filter.category = req.query.category
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {}
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice)
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice)
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search }
    }

    if (req.query.featured === 'true') {
      filter.featured = true
    }

    if (req.query.onSale === 'true') {
      filter.onSale = true
    }

    if (req.query.newArrival === 'true') {
      filter.newArrival = true
    }

    // Build sort object
    let sort = {}
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') ? req.query.sort.slice(1) : req.query.sort
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1
      
      if (sortField === 'rating') {
        sort['rating.average'] = sortOrder
      } else {
        sort[sortField] = sortOrder
      }
    } else {
      sort.createdAt = -1 // Default sort by newest
    }

    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Product.countDocuments(filter)

    // Format products for response
    const formattedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images?.[0]?.url || '',
      category: product.category,
      rating: product.rating,
      onSale: product.onSale,
      newArrival: product.newArrival,
      sizes: product.sizes?.map(s => s.size) || []
    }))

    res.json({
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Error fetching products' })
  }
})

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      featured: true, 
      isActive: true 
    })
    .limit(8)
    .lean()

    const formattedProducts = products.map(product => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images?.[0]?.url || '',
      category: product.category,
      rating: product.rating,
      sizes: product.sizes?.map(s => s.size) || []
    }))

    res.json({ products: formattedProducts })
  } catch (error) {
    console.error('Get featured products error:', error)
    res.status(500).json({ message: 'Error fetching featured products' })
  }
})

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name')
      .lean()

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (!product.isActive) {
      return res.status(404).json({ message: 'Product not available' })
    }

    res.json({ product })
  } catch (error) {
    console.error('Get product error:', error)
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.status(500).json({ message: 'Error fetching product' })
  }
})

module.exports = router