'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const CartPage = () => {
  const router = useRouter()
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()

  const handleCheckout = () => {
    // In a real app, this would integrate with a payment processor
    alert('Checkout functionality would be implemented here!')
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-gray-500">
            Start shopping to add items to your cart.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const shippingCost = totalPrice > 50 ? 0 : 9.99
  const tax = totalPrice * 0.08 // 8% tax
  const finalTotal = totalPrice + shippingCost + tax

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/products" className="text-gray-600 hover:text-black">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link href={`/products/${item.id}`} className="hover:text-gray-700">
                          {item.name}
                        </Link>
                      </h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Size: {item.size}</span>
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="mt-2 text-lg font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1, item.color)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1, item.color)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Item Subtotal */}
                    <div className="text-lg font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Free Shipping Notice */}
            {totalPrice < 50 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-700">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="block w-full mt-3 text-center py-3 px-4 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>

            {/* Security & Trust Indicators */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Why shop with us?</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Secure checkout
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Free returns within 30 days
                </li>
                <li className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                  Customer support 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Products */}
      <div className="mt-16 border-t pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Shopping</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Placeholder for recently viewed or recommended products */}
          <Link href="/categories/mens" className="group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Men's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Men's Collection</h3>
          </Link>
          
          <Link href="/categories/womens" className="group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Women's Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Women's Collection</h3>
          </Link>
          
          <Link href="/categories/accessories" className="group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Accessories"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Accessories</h3>
          </Link>
          
          <Link href="/products" className="group">
            <div className="aspect-square bg-gradient-to-br from-black to-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">View All</span>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">All Products</h3>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage 