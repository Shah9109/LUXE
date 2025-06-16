'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import toast from 'react-hot-toast'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color?: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string, size: string, color?: string) => void
  updateQuantity: (id: string, size: string, quantity: number, color?: string) => void
  clearCart: () => void
  isInCart: (id: string, size: string, color?: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && 
        item.size === product.size && 
        item.color === product.color
      )
      
      if (existingItem) {
        toast.success('Updated quantity in cart')
        return prev.map(item =>
          item.id === product.id && 
          item.size === product.size && 
          item.color === product.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        toast.success('Added to cart')
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: string, size: string, color?: string) => {
    setItems(prev => prev.filter(item => 
      !(item.id === id && item.size === size && item.color === color)
    ))
    toast.success('Removed from cart')
  }

  const updateQuantity = (id: string, size: string, quantity: number, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color)
      return
    }

    setItems(prev =>
      prev.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    toast.success('Cart cleared')
  }

  const isInCart = (id: string, size: string, color?: string) => {
    return items.some(item => 
      item.id === id && item.size === size && item.color === color
    )
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
} 