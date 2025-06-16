'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Filter, Grid, List, ArrowLeft } from 'lucide-react'

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

const MensPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Men's products data
  const mensProducts: Product[] = [
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
      _id: '13',
      name: 'Slim Fit Jeans',
      description: 'Modern slim fit jeans with stretch comfort. Perfect for everyday wear.',
      price: 89.99,
      category: 'mens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Slim Fit Jeans',
          isPrimary: true
        }
      ],
      sizes: [
        { size: '30', stock: 12 },
        { size: '32', stock: 18 },
        { size: '34', stock: 15 },
        { size: '36', stock: 10 }
      ],
      brand: 'LUXE',
      newArrival: true
    },
    {
      _id: '14',
      name: 'Polo Shirt',
      description: 'Classic polo shirt in premium pique cotton. Smart casual essential.',
      price: 39.99,
      category: 'mens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Polo Shirt',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'S', stock: 20 },
        { size: 'M', stock: 25 },
        { size: 'L', stock: 18 },
        { size: 'XL', stock: 15 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '15',
      name: 'Leather Belt',
      description: 'Genuine leather belt with classic buckle. Timeless accessory.',
      price: 49.99,
      category: 'mens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Leather Belt',
          isPrimary: true
        }
      ],
      sizes: [
        { size: '32', stock: 8 },
        { size: '34', stock: 12 },
        { size: '36', stock: 10 },
        { size: '38', stock: 6 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '16',
      name: 'Formal Dress Shirt',
      description: 'Crisp white formal dress shirt for business and special occasions.',
      price: 59.99,
      category: 'mens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Formal Dress Shirt',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'S', stock: 12 },
        { size: 'M', stock: 16 },
        { size: 'L', stock: 14 },
        { size: 'XL', stock: 10 }
      ],
      brand: 'LUXE'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mensProducts)
      setFilteredProducts(mensProducts)
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    let filtered = products

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
  }, [products, sortBy, priceRange])

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
        <div className="flex items-center space-x-4 mb-4">
          <Link href="/products" className="text-gray-600 hover:text-black">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Men's Collection</h1>
        </div>
        <p className="text-gray-600">Discover our premium men's clothing and accessories</p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-64 space-y-6">
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

          {/* Size Filter */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sizes</h3>
            <div className="grid grid-cols-3 gap-2">
              {['S', 'M', 'L', 'XL', '30', '32', '34', '36', '38'].map((size) => (
                <button
                  key={size}
                  className="border border-gray-300 py-2 px-3 text-sm hover:border-black transition-colors"
                >
                  {size}
                </button>
              ))}
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

export default MensPage 