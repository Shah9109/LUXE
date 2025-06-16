const express = require('express')
const { query, validationResult } = require('express-validator')
const Product = require('../models/Product')

const router = express.Router()

// @desc    Get products by category
// @route   GET /api/categories/:category
// @access  Public
router.get('/:category', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
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

    const { category } = req.params
    const validCategories = ['mens', 'womens', 'accessories', 'shoes', 'bags', 'jewelry']
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 12
    const skip = (page - 1) * limit

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
      sort.createdAt = -1
    }

    const products = await Product.find({ 
      category, 
      isActive: true 
    })
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .lean()

    const total = await Product.countDocuments({ 
      category, 
      isActive: true 
    })

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
      category,
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
    console.error('Get category products error:', error)
    res.status(500).json({ message: 'Error fetching category products' })
  }
})

module.exports = router 