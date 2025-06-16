'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Star, Plus, Minus, ShoppingCart, Zap, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

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
  colors?: Array<{
    name: string
    hex: string
  }>
  brand: string
  material?: string
  featured?: boolean
  newArrival?: boolean
  rating?: number
  reviewCount?: number
  features?: string[]
}

const ProductDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // All products data (comprehensive product database)
  const allProducts: Product[] = [
    {
      _id: '1',
      name: 'Classic White T-Shirt',
      description: 'Premium cotton t-shirt with a classic fit. Perfect for everyday wear. Made from 100% organic cotton with superior breathability and comfort. Features reinforced seams and pre-shrunk fabric.',
      price: 29.99,
      category: 'mens',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Classic White T-Shirt',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1583743814966-8936f37f1ddf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Classic White T-Shirt Back View',
          isPrimary: false
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
      rating: 4.5,
      reviewCount: 128,
      features: ['100% Organic Cotton', 'Pre-shrunk', 'Reinforced Seams', 'Breathable Fabric']
    },
    {
      _id: '2',
      name: 'Elegant Black Dress',
      description: 'Sophisticated black dress perfect for evening events and special occasions. Features elegant draping and premium fabric blend for ultimate comfort and style.',
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
        },
        {
          url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Elegant Black Dress Side View',
          isPrimary: false
        }
      ],
      sizes: [
        { size: 'XS', stock: 10 },
        { size: 'S', stock: 15 },
        { size: 'M', stock: 20 },
        { size: 'L', stock: 12 }
      ],
      brand: 'LUXE',
      material: 'Polyester Blend',
      featured: true,
      rating: 4.7,
      reviewCount: 89,
      features: ['Elegant Draping', 'Premium Fabric', 'Perfect Fit', 'Evening Wear']
    },
    {
      _id: '3',
      name: 'Denim Jacket',
      description: 'Classic denim jacket with a modern twist. Versatile piece for any wardrobe. Features premium denim construction with vintage-inspired details.',
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
      rating: 4.4,
      reviewCount: 67,
      features: ['Premium Denim', 'Vintage Details', 'Versatile Style', 'Durable Construction']
    },
    {
      _id: '4',
      name: 'Leather Crossbody Bag',
      description: 'Premium leather crossbody bag perfect for everyday use. Handcrafted from genuine leather with multiple compartments and adjustable strap.',
      price: 129.99,
      category: 'accessories',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Leather Crossbody Bag',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Leather Crossbody Bag Interior',
          isPrimary: false
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
      rating: 4.6,
      reviewCount: 156,
      features: ['Genuine Leather', 'Multiple Compartments', 'Adjustable Strap', 'Handcrafted']
    },
    {
      _id: '5',
      name: 'Cotton Chinos',
      description: 'Comfortable cotton chinos suitable for both casual and semi-formal occasions. Perfect fit with premium cotton blend fabric.',
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
      colors: [
        { name: 'Khaki', hex: '#F0E68C' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Black', hex: '#000000' }
      ],
      brand: 'LUXE',
      material: '100% Cotton',
      rating: 4.3,
      reviewCount: 92,
      features: ['Premium Cotton', 'Versatile Style', 'Perfect Fit', 'Easy Care']
    },
    {
      _id: '6',
      name: 'Floral Summer Dress',
      description: 'Light and airy summer dress with beautiful floral print. Perfect for warm weather with breathable fabric and comfortable fit.',
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
      newArrival: true,
      rating: 4.5,
      reviewCount: 74,
      features: ['Floral Print', 'Breathable Fabric', 'Summer Ready', 'Comfortable Fit']
    }
  ]

  useEffect(() => {
    const productId = params.id as string
    // Simulate API call
    setTimeout(() => {
      const foundProduct = allProducts.find(p => p._id === productId)
      setProduct(foundProduct || null)
      setLoading(false)
      if (foundProduct?.sizes.length) {
        setSelectedSize(foundProduct.sizes[0].size)
      }
      if (foundProduct?.colors?.length) {
        setSelectedColor(foundProduct.colors[0].name)
      }
    }, 500)
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    
    addToCart({
      id: product._id,
      name: product.name,
      price: product.onSale ? product.salePrice! : product.price,
      image: product.images[0].url,
      size: selectedSize,
      color: selectedColor,
      quantity
    })
    
    // Show success message (you can implement a toast notification)
    alert('Product added to cart!')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/cart')
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/products" className="text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  const currentPrice = product.onSale ? product.salePrice! : product.price
  const hasDiscount = product.onSale && product.originalPrice
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - currentPrice) / product.originalPrice!) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-black">Products</Link>
        <span>/</span>
        <Link href={`/categories/${product.category}`} className="hover:text-black capitalize">
          {product.category === 'mens' ? "Men's" : product.category === 'womens' ? "Women's" : 'Accessories'}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 overflow-hidden">
            <img
              src={product.images[selectedImageIndex]?.url}
              alt={product.images[selectedImageIndex]?.alt}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden ${
                    selectedImageIndex === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          <div className="text-sm font-medium text-gray-600 uppercase">
            {product.brand}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating!) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                ${currentPrice}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>
            {product.onSale && (
              <p className="text-sm text-red-600 font-medium">Limited time offer</p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Features */}
          {product.features && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Color: {selectedColor}</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color.name ? 'border-black' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Size: {selectedSize}</h3>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((sizeOption) => (
                <button
                  key={sizeOption.size}
                  onClick={() => setSelectedSize(sizeOption.size)}
                  disabled={sizeOption.stock === 0}
                  className={`py-2 px-4 border text-sm font-medium transition-colors ${
                    selectedSize === sizeOption.size
                      ? 'border-black bg-black text-white'
                      : sizeOption.stock === 0
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  {sizeOption.size}
                  {sizeOption.stock === 0 && (
                    <div className="text-xs">Out of Stock</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={decreaseQuantity}
                className="p-2 border border-gray-300 hover:border-black transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 border border-gray-300 min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="p-2 border border-gray-300 hover:border-black transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
            
            <button
              onClick={handleBuyNow}
              className="w-full bg-blue-600 text-white py-3 px-6 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>Buy Now</span>
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 py-2 px-4 border font-medium transition-colors flex items-center justify-center space-x-2 ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-700 hover:border-black'
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>
              
              <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium hover:border-black transition-colors flex items-center justify-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Shipping & Returns */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-start space-x-3">
              <Truck className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Free Shipping</p>
                <p className="text-sm text-gray-600">Free shipping on orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <RotateCcw className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Easy Returns</p>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Secure Payment</p>
                <p className="text-sm text-gray-600">Your payment information is secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Product Details */}
      <div className="mt-16 border-t pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                {product.description}
              </p>
              {product.material && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900">Material</h3>
                  <p className="text-gray-600">{product.material}</p>
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">Care Instructions</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Machine wash cold with similar colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Size Guide</h3>
            <div className="border border-gray-200 rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Size</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Chest</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="px-4 py-2 border-t">S</td><td className="px-4 py-2 border-t">36"</td></tr>
                  <tr><td className="px-4 py-2 border-t">M</td><td className="px-4 py-2 border-t">38"</td></tr>
                  <tr><td className="px-4 py-2 border-t">L</td><td className="px-4 py-2 border-t">40"</td></tr>
                  <tr><td className="px-4 py-2 border-t">XL</td><td className="px-4 py-2 border-t">42"</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage 