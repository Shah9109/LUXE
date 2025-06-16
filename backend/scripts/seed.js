const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('../models/User')
const Product = require('../models/Product')

const users = [
  {
    name: 'Admin User',
    email: 'admin@luxe.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
]

const products = [
  {
    name: 'Classic White T-Shirt',
    description: 'Premium cotton t-shirt with a classic fit. Perfect for everyday wear.',
    price: 29.99,
    category: 'mens',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Classic White T-Shirt',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 }
    ],
    brand: 'LUXE',
    material: '100% Cotton',
    featured: true,
    tags: ['basic', 'casual', 'cotton']
  },
  {
    name: 'Elegant Black Dress',
    description: 'Sophisticated black dress perfect for evening events and special occasions.',
    price: 89.99,
    originalPrice: 129.99,
    salePrice: 89.99,
    onSale: true,
    category: 'womens',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Elegant Black Dress',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'XS', stock: 10 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 }
    ],
    brand: 'LUXE',
    material: 'Polyester Blend',
    featured: true,
    tags: ['formal', 'elegant', 'evening']
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket with a modern twist. Versatile piece for any wardrobe.',
    price: 79.99,
    category: 'mens',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Denim Jacket',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'S', stock: 12 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 10 }
    ],
    brand: 'LUXE',
    material: '100% Cotton Denim',
    tags: ['denim', 'casual', 'outerwear']
  },
  {
    name: 'Floral Summer Dress',
    description: 'Light and airy summer dress with beautiful floral print.',
    price: 54.99,
    category: 'womens',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Floral Summer Dress',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 10 }
    ],
    brand: 'LUXE',
    material: 'Cotton Blend',
    featured: true,
    newArrival: true,
    tags: ['floral', 'summer', 'casual']
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Premium leather crossbody bag perfect for everyday use.',
    price: 129.99,
    category: 'accessories',
    subcategory: 'bags',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Leather Crossbody Bag',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'One Size', stock: 25 }
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#8B4513' }
    ],
    brand: 'LUXE',
    material: 'Genuine Leather',
    featured: true,
    tags: ['leather', 'bag', 'accessory']
  },
  {
    name: 'Cotton Chinos',
    description: 'Comfortable cotton chinos suitable for both casual and semi-formal occasions.',
    price: 69.99,
    category: 'mens',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506629905607-21e199f7a9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Cotton Chinos',
        isPrimary: true
      }
    ],
    sizes: [
      { size: '30', stock: 10 },
      { size: '32', stock: 15 },
      { size: '34', stock: 20 },
      { size: '36', stock: 12 },
      { size: '38', stock: 8 }
    ],
    colors: [
      { name: 'Khaki', hex: '#F0E68C' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Black', hex: '#000000' }
    ],
    brand: 'LUXE',
    material: '100% Cotton',
    tags: ['chinos', 'casual', 'pants']
  },
  {
    name: 'Silk Scarf',
    description: 'Luxurious silk scarf with elegant pattern.',
    price: 45.99,
    category: 'accessories',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Silk Scarf',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'One Size', stock: 30 }
    ],
    brand: 'LUXE',
    material: '100% Silk',
    tags: ['silk', 'scarf', 'luxury']
  },
  {
    name: 'Wool Blend Coat',
    description: 'Elegant wool blend coat perfect for cold weather.',
    price: 199.99,
    category: 'womens',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544460736-ca0fd5f34e8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Wool Blend Coat',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 8 },
      { size: 'XL', stock: 5 }
    ],
    brand: 'LUXE',
    material: '80% Wool, 20% Polyester',
    tags: ['coat', 'winter', 'wool']
  },
  {
    name: 'Casual Sneakers',
    description: 'Comfortable and stylish sneakers for everyday wear.',
    price: 89.99,
    category: 'shoes',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Casual Sneakers',
        isPrimary: true
      }
    ],
    sizes: [
      { size: '7', stock: 10 },
      { size: '8', stock: 15 },
      { size: '9', stock: 20 },
      { size: '10', stock: 18 },
      { size: '11', stock: 12 },
      { size: '12', stock: 8 }
    ],
    brand: 'LUXE',
    material: 'Canvas and Rubber',
    featured: true,
    tags: ['sneakers', 'casual', 'shoes']
  },
  {
    name: 'Gold Chain Necklace',
    description: 'Elegant gold-plated chain necklace.',
    price: 39.99,
    category: 'accessories',
    subcategory: 'jewelry',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Gold Chain Necklace',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'One Size', stock: 50 }
    ],
    brand: 'LUXE',
    material: 'Gold-plated Steel',
    newArrival: true,
    tags: ['jewelry', 'necklace', 'gold']
  },
  {
    name: 'Striped Long Sleeve Shirt',
    description: 'Classic striped long sleeve shirt for a timeless look.',
    price: 49.99,
    category: 'mens',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Striped Long Sleeve Shirt',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 18 },
      { size: 'XL', stock: 12 }
    ],
    brand: 'LUXE',
    material: 'Cotton Blend',
    tags: ['striped', 'shirt', 'casual']
  },
  {
    name: 'A-Line Midi Skirt',
    description: 'Versatile A-line midi skirt suitable for work and casual wear.',
    price: 59.99,
    category: 'womens',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'A-Line Midi Skirt',
        isPrimary: true
      }
    ],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 6 }
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Gray', hex: '#808080' }
    ],
    brand: 'LUXE',
    material: 'Polyester Blend',
    tags: ['skirt', 'midi', 'work']
  }
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany()
    await Product.deleteMany()
    console.log('Cleared existing data')

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)
        return { ...user, password: hashedPassword }
      })
    )

    // Create users
    const createdUsers = await User.create(hashedUsers)
    console.log(`Created ${createdUsers.length} users`)

    // Add createdBy field to products (assign to admin user)
    const adminUser = createdUsers.find(user => user.role === 'admin')
    const productsWithCreator = products.map(product => ({
      ...product,
      createdBy: adminUser._id
    }))

    // Create products
    const createdProducts = await Product.create(productsWithCreator)
    console.log(`Created ${createdProducts.length} products`)

    console.log('\n🌱 Database seeded successfully!')
    console.log('\n👤 Login credentials:')
    console.log('Admin: admin@luxe.com / admin123')
    console.log('User: john@example.com / password123')
    console.log('User: jane@example.com / password123')

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase() 