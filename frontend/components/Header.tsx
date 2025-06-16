'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import AuthModal from './AuthModal'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout, isAuthenticated } = useAuth()
  const { totalItems } = useCart()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-black">
                LUXE
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-black transition-colors">
                All Products
              </Link>
              <Link href="/categories/mens" className="text-gray-700 hover:text-black transition-colors">
                Men's
              </Link>
              <Link href="/categories/womens" className="text-gray-700 hover:text-black transition-colors">
                Women's
              </Link>
              <Link href="/categories/accessories" className="text-gray-700 hover:text-black transition-colors">
                Accessories
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xs mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-black">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block">{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-gray-700 hover:text-black"
                >
                  <User className="h-5 w-5" />
                </button>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative text-gray-700 hover:text-black">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden text-gray-700 hover:text-black"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:border-black"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>

              <Link
                href="/products"
                className="block px-3 py-2 text-gray-700 hover:text-black"
                onClick={closeMenu}
              >
                All Products
              </Link>
              <Link
                href="/categories/mens"
                className="block px-3 py-2 text-gray-700 hover:text-black"
                onClick={closeMenu}
              >
                Men's
              </Link>
              <Link
                href="/categories/womens"
                className="block px-3 py-2 text-gray-700 hover:text-black"
                onClick={closeMenu}
              >
                Women's
              </Link>
              <Link
                href="/categories/accessories"
                className="block px-3 py-2 text-gray-700 hover:text-black"
                onClick={closeMenu}
              >
                Accessories
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}

export default Header 