'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Award, Building, Users } from 'lucide-react'
import { useConfig } from '@/config'

export default function Hero() {
  const { config } = useConfig()
  
  const stats = config.hero?.stats || [
    { icon: Building, value: '50+', label: 'Projects Completed' },
    { icon: Award, value: '15+', label: 'Awards Won' },
    { icon: Users, value: '100+', label: 'Happy Clients' },
  ]

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-architect-100 via-transparent to-accent-gold/10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-architect-900 mb-4">
            {config.content?.hero?.heading || config.personal?.name || 'Your Name'}
          </h1>
          <p className="text-xl md:text-2xl text-architect-600 mb-8">
            {config.content?.hero?.subheading || config.personal?.title || 'Your Professional Title'}
          </p>
          <p className="text-lg text-architect-500 max-w-2xl mx-auto mb-12">
            {config.content?.hero?.description || config.personal?.bio || 'Your professional bio and mission statement goes here.'}
          </p>
          
          <div className="flex justify-center gap-4 mb-16">
            <a
              href="#portfolio"
              className="px-8 py-3 bg-architect-800 text-white rounded-full hover:bg-architect-700 transition-colors"
            >
              View Portfolio
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-architect-800 text-architect-800 rounded-full hover:bg-architect-800 hover:text-white transition-colors"
            >
              Get in Touch
            </a>
          </div>
          
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-accent-gold" />
                <div className="text-3xl font-bold text-architect-800">{stat.value}</div>
                <div className="text-sm text-architect-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="w-6 h-6 text-architect-400 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}