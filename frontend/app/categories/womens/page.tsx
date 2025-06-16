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

const WomensPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Women's products data
  const womensProducts: Product[] = [
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
      _id: '17',
      name: 'Silk Blouse',
      description: 'Luxurious silk blouse perfect for office and evening wear.',
      price: 79.99,
      category: 'womens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Silk Blouse',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'XS', stock: 6 },
        { size: 'S', stock: 10 },
        { size: 'M', stock: 12 },
        { size: 'L', stock: 8 }
      ],
      brand: 'LUXE',
      newArrival: true
    },
    {
      _id: '18',
      name: 'High-Waisted Jeans',
      description: 'Classic high-waisted jeans with a flattering fit.',
      price: 69.99,
      category: 'womens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc6b029?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'High-Waisted Jeans',
          isPrimary: true
        }
      ],
      sizes: [
        { size: '26', stock: 8 },
        { size: '28', stock: 12 },
        { size: '30', stock: 15 },
        { size: '32', stock: 10 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '19',
      name: 'Cashmere Sweater',
      description: 'Ultra-soft cashmere sweater for cozy elegance.',
      price: 149.99,
      category: 'womens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Cashmere Sweater',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'XS', stock: 4 },
        { size: 'S', stock: 8 },
        { size: 'M', stock: 10 },
        { size: 'L', stock: 6 }
      ],
      brand: 'LUXE',
      featured: true
    },
    {
      _id: '20',
      name: 'Wrap Dress',
      description: 'Flattering wrap dress perfect for any occasion.',
      price: 64.99,
      category: 'womens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Wrap Dress',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'XS', stock: 7 },
        { size: 'S', stock: 11 },
        { size: 'M', stock: 14 },
        { size: 'L', stock: 9 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '21',
      name: 'Wide-Leg Trousers',
      description: 'Elegant wide-leg trousers for a sophisticated look.',
      price: 74.99,
      category: 'womens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Wide-Leg Trousers',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'XS', stock: 5 },
        { size: 'S', stock: 9 },
        { size: 'M', stock: 12 },
        { size: 'L', stock: 8 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '22',
      name: 'Knit Cardigan',
      description: 'Cozy knit cardigan perfect for layering.',
      price: 54.99,
      category: 'womens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Knit Cardigan',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'XS', stock: 6 },
        { size: 'S', stock: 10 },
        { size: 'M', stock: 13 },
        { size: 'L', stock: 8 }
      ],
      brand: 'LUXE'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(womensProducts)
      setFilteredProducts(womensProducts)
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
          <h1 className="text-3xl font-bold text-gray-900">Women's Collection</h1>
        </div>
        <p className="text-gray-600">Discover our elegant women's fashion and accessories</p>
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
              {['XS', 'S', 'M', 'L', 'XL', '26', '28', '30', '32'].map((size) => (
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

export default WomensPage 