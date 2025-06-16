import React from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FeaturedProducts from '@/components/FeaturedProducts'
import CategorySection from '@/components/CategorySection'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedProducts />
      <CategorySection />
      <Newsletter />
      <Footer />
    </main>
  )
}