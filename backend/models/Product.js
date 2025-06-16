const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['mens', 'womens', 'accessories', 'shoes', 'bags', 'jewelry']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  sizes: [{
    size: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    }
  }],
  colors: [{
    name: String,
    hex: String,
    images: [String]
  }],
  material: String,
  brand: String,
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number
  },
  care: [String],
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  onSale: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Virtual for total stock
productSchema.virtual('totalStock').get(function() {
  return this.sizes.reduce((total, size) => total + size.stock, 0)
})

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary)
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null)
})

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  return this.salePrice || this.price
})

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.salePrice && this.originalPrice) {
    return Math.round(((this.originalPrice - this.salePrice) / this.originalPrice) * 100)
  }
  return 0
})

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 })
productSchema.index({ featured: 1, isActive: 1 })
productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ price: 1 })
productSchema.index({ 'rating.average': -1 })
productSchema.index({ createdAt: -1 })

// Update rating when review is added
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0
    this.rating.count = 0
    return
  }

  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0)
  this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10
  this.rating.count = this.reviews.length
}

module.exports = mongoose.model('Product', productSchema) 