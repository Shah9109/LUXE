const express = require('express')
const { body, validationResult } = require('express-validator')

const router = express.Router()

// Simple in-memory storage for demo purposes
// In production, you would use a database or email service like Mailchimp
let subscribers = []

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
router.post('/subscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email } = req.body

    // Check if email already exists
    const existingSubscriber = subscribers.find(sub => sub.email === email)
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email already subscribed' })
    }

    // Add to subscribers list
    const subscriber = {
      email,
      subscribedAt: new Date(),
      isActive: true
    }

    subscribers.push(subscriber)

    console.log(`New newsletter subscription: ${email}`)

    res.status(201).json({
      message: 'Successfully subscribed to newsletter',
      email
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    res.status(500).json({ message: 'Error subscribing to newsletter' })
  }
})

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email } = req.body

    // Find and mark as inactive
    const subscriberIndex = subscribers.findIndex(sub => sub.email === email)
    if (subscriberIndex === -1) {
      return res.status(404).json({ message: 'Email not found in subscription list' })
    }

    subscribers[subscriberIndex].isActive = false
    subscribers[subscriberIndex].unsubscribedAt = new Date()

    console.log(`Newsletter unsubscription: ${email}`)

    res.json({
      message: 'Successfully unsubscribed from newsletter',
      email
    })
  } catch (error) {
    console.error('Newsletter unsubscription error:', error)
    res.status(500).json({ message: 'Error unsubscribing from newsletter' })
  }
})

// @desc    Get subscriber count (for admin dashboard)
// @route   GET /api/newsletter/stats
// @access  Public (could be protected in production)
router.get('/stats', async (req, res) => {
  try {
    const activeSubscribers = subscribers.filter(sub => sub.isActive).length
    const totalSubscribers = subscribers.length

    res.json({
      activeSubscribers,
      totalSubscribers,
      unsubscribed: totalSubscribers - activeSubscribers
    })
  } catch (error) {
    console.error('Newsletter stats error:', error)
    res.status(500).json({ message: 'Error fetching newsletter stats' })
  }
})

module.exports = router 