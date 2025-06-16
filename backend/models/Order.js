const mongoose = require('mongoose')

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
    name: {
      type: String,
      required: true
    },
    image: String,
    price: {
      type: Number,
      required: true
    },
    size: String,
    color: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  shippingAddress: {
    fullName: {
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
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'US'
    },
    phone: String
  },
  billingAddress: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery']
  },
  paymentDetails: {
    transactionId: String,
    cardLast4: String,
    paymentProcessor: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  shippingProvider: String,
  notes: String,
  statusHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  estimatedDelivery: Date,
  actualDelivery: Date,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  couponCode: String,
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments()
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

// Virtual for item count
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0)
})

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      date: new Date()
    })
  }
  next()
})

// Indexes
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ 'paymentDetails.paymentStatus': 1 })
orderSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Order', orderSchema) 