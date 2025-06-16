'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token')
      if (token) {
        const response = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(response.data.user)
      }
    } catch (error) {
      Cookies.remove('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token, user } = response.data
      
      Cookies.set('token', token, { expires: 7 })
      setUser(user)
      toast.success('Welcome back!')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password })
      const { token, user } = response.data
      
      Cookies.set('token', token, { expires: 7 })
      setUser(user)
      toast.success('Account created successfully!')
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 