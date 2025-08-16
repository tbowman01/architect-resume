'use client'

import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import Navigation from './components/Navigation'
import Portfolio from './components/Portfolio'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-architect-50 to-white">
      <Navigation isScrolled={isScrolled} />
      <Hero />
      <Portfolio />
      <Experience />
      <Skills />
      <Education />
      <Blog featured={true} limit={3} />
      <Contact />
      <Footer />
      <ChatBot />
    </main>
  )
}