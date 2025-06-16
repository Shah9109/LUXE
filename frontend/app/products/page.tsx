'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Filter, Grid, List } from 'lucide-react'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  salePrice?: number
  onSale?: boolean
  category: string
  images: Array<{
    url: string
    alt: string
    isPrimary: boolean
  }>
  sizes: Array<{
    size: string
    stock: number
  }>
  brand: string
  featured?: boolean
  newArrival?: boolean
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Dummy products data
  const dummyProducts: Product[] = [
    {
      _id: '1',
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
      featured: true
    },
    {
      _id: '2',
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
        { size: 'L', stock: 12 }
      ],
      brand: 'LUXE',
      featured: true
    },
    {
      _id: '3',
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
      brand: 'LUXE'
    },
    {
      _id: '4',
      name: 'Leather Crossbody Bag',
      description: 'Premium leather crossbody bag perfect for everyday use.',
      price: 129.99,
      category: 'accessories',
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
      brand: 'LUXE',
      featured: true
    },
    {
      _id: '5',
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
        { size: '36', stock: 12 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '6',
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
      newArrival: true
    },
    {
      _id: '7',
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
      brand: 'LUXE'
    },
    {
      _id: '8',
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
        { size: 'L', stock: 8 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '9',
      name: 'Gold Chain Necklace',
      description: 'Elegant gold-plated chain necklace.',
      price: 39.99,
      category: 'accessories',
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
      newArrival: true
    },
    {
      _id: '10',
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
      brand: 'LUXE'
    },
    {
      _id: '11',
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
        { size: 'L', stock: 10 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '12',
      name: 'Athletic Sneakers',
      description: 'Comfortable athletic sneakers perfect for workouts and casual wear.',
      price: 89.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Athletic Sneakers',
          isPrimary: true
        }
      ],
      sizes: [
        { size: '7', stock: 10 },
        { size: '8', stock: 15 },
        { size: '9', stock: 20 },
        { size: '10', stock: 18 }
      ],
      brand: 'LUXE'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(dummyProducts)
      setFilteredProducts(dummyProducts)
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    )

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, selectedCategory, sortBy, priceRange])

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/products/${product._id}`} className="group cursor-pointer block">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-4 space-y-2">
        {product.newArrival && (
          <span className="text-xs font-medium text-green-600">NEW ARRIVAL</span>
        )}
        {product.onSale && (
          <span className="text-xs font-medium text-red-600">ON SALE</span>
        )}
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <div className="flex items-center space-x-2">
          {product.onSale ? (
            <>
              <span className="font-bold text-gray-900">${product.salePrice}</span>
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            </>
          ) : (
            <span className="font-bold text-gray-900">${product.price}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
      </div>
    </Link>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
        <p className="text-gray-600">Discover our complete collection</p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category</h3>
            <div className="space-y-2">
              {['all', 'mens', 'womens', 'accessories'].map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded-full mr-3 ${
                    selectedCategory === category ? 'border-black bg-black' : 'border-gray-300'
                  }`}>
                    {selectedCategory === category && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="text-gray-700 capitalize">
                    {category === 'all' ? 'All Products' : category === 'mens' ? "Men's" : category === 'womens' ? "Women's" : 'Accessories'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>$0</span>
                <span>${priceRange.max}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort and View Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} products
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-none py-2 px-3 focus:outline-none focus:border-black"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage 