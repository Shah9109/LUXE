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

const AccessoriesPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Accessories products data
  const accessoriesProducts: Product[] = [
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
    },
    {
      _id: '23',
      name: 'Leather Wallet',
      description: 'Premium leather wallet with multiple card slots.',
      price: 59.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Leather Wallet',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'One Size', stock: 35 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '24',
      name: 'Sunglasses',
      description: 'Stylish sunglasses with UV protection.',
      price: 79.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Sunglasses',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'One Size', stock: 40 }
      ],
      brand: 'LUXE',
      featured: true
    },
    {
      _id: '25',
      name: 'Silver Bracelet',
      description: 'Elegant silver bracelet with minimalist design.',
      price: 49.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Silver Bracelet',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'One Size', stock: 25 }
      ],
      brand: 'LUXE',
      newArrival: true
    },
    {
      _id: '26',
      name: 'Leather Handbag',
      description: 'Spacious leather handbag perfect for work and travel.',
      price: 159.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Leather Handbag',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'One Size', stock: 20 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '27',
      name: 'Classic Watch',
      description: 'Timeless classic watch with leather strap.',
      price: 199.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Classic Watch',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'One Size', stock: 15 }
      ],
      brand: 'LUXE',
      featured: true
    },
    {
      _id: '28',
      name: 'Baseball Cap',
      description: 'Comfortable cotton baseball cap with embroidered logo.',
      price: 24.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Baseball Cap',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'One Size', stock: 45 }
      ],
      brand: 'LUXE'
    },
    {
      _id: '29',
      name: 'Pearl Earrings',
      description: 'Elegant pearl earrings for sophisticated looks.',
      price: 34.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Pearl Earrings',
          isPrimary: true
        }
      ],
      sizes: [
        { size: 'One Size', stock: 30 }
      ],
      brand: 'LUXE',
      newArrival: true
    },
    {
      _id: '30',
      name: 'Leather Belt',
      description: 'Classic leather belt with gold buckle.',
      price: 44.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Leather Belt',
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
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(accessoriesProducts)
      setFilteredProducts(accessoriesProducts)
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
          <h1 className="text-3xl font-bold text-gray-900">Accessories Collection</h1>
        </div>
        <p className="text-gray-600">Complete your look with our premium accessories</p>
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

          {/* Category Filter */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Type</h3>
            <div className="space-y-2">
              {['Bags', 'Jewelry', 'Shoes', 'Watches', 'Sunglasses', 'Belts'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{type}</span>
                </label>
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

export default AccessoriesPage 