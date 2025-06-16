const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const { protect, generateToken } = require('../middleware/auth')

const router = express.Router()

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { name, email, password } = req.body

    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    })

    if (user) {
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Server error during registration' })
  }
})

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Check for user and include password for comparison
    const user = await User.findOne({ email }).select('+password')

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      })
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
})

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist')
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ message: 'Error fetching profile' })
  }
})

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please include a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const user = await User.findById(req.user.id)

    if (user) {
      user.name = req.body.name || user.name
      
      // Check if email is being updated and doesn't already exist
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email })
        if (emailExists) {
          return res.status(400).json({ message: 'Email already in use' })
        }
        user.email = req.body.email
        user.isEmailVerified = false // Reset verification if email changes
      }

      const updatedUser = await user.save()

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          isEmailVerified: updatedUser.isEmailVerified
        }
      })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Error updating profile' })
  }
})

// @desc    Add address to user profile
// @route   POST /api/auth/addresses
// @access  Private
router.post('/addresses', protect, [
  body('type').isIn(['shipping', 'billing']).withMessage('Address type must be shipping or billing'),
  body('street').notEmpty().withMessage('Street address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('ZIP code is required'),
  body('country').notEmpty().withMessage('Country is required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const user = await User.findById(req.user.id)
    
    const newAddress = {
      type: req.body.type,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      country: req.body.country,
      isDefault: req.body.isDefault || false
    }

    // If this is set as default, unset other default addresses of the same type
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => {
        if (addr.type === newAddress.type) {
          addr.isDefault = false
        }
      })
    }

    user.addresses.push(newAddress)
    await user.save()

    res.status(201).json({
      message: 'Address added successfully',
      addresses: user.addresses
    })
  } catch (error) {
    console.error('Add address error:', error)
    res.status(500).json({ message: 'Error adding address' })
  }
})

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword
      await user.save()

      res.json({ message: 'Password updated successfully' })
    } else {
      res.status(400).json({ message: 'Current password is incorrect' })
    }
  } catch (error) {
    console.error('Password update error:', error)
    res.status(500).json({ message: 'Error updating password' })
  }
})

module.exports = router 