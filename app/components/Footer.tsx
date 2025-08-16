'use client'

import { motion } from 'framer-motion'
import { ArrowUp, Linkedin, Instagram, MessageSquare, Globe, Award, Users, Building } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/johnarchitect',
      color: 'hover:text-blue-600'
    },
    {
      icon: Instagram,
      label: 'Instagram', 
      href: 'https://instagram.com/johnarchitect',
      color: 'hover:text-pink-600'
    },
    {
      icon: MessageSquare,
      label: 'Behance',
      href: 'https://behance.net/johnarchitect',
      color: 'hover:text-blue-500'
    },
    {
      icon: Globe,
      label: 'Portfolio',
      href: 'https://johnarchitect.com',
      color: 'hover:text-accent-gold'
    }
  ]

  const affiliations = [
    'American Institute of Architects (AIA)',
    'LEED Accredited Professional',
    'National Council of Architectural Registration',
    'Sustainable Design Collective'
  ]

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <footer className="bg-architect-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/20 via-transparent to-architect-800/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <Building className="absolute top-10 left-10 w-32 h-32 opacity-10 rotate-12" />
          <Award className="absolute top-20 right-20 w-24 h-24 opacity-10 -rotate-12" />
          <Users className="absolute bottom-20 left-1/4 w-28 h-28 opacity-10 rotate-45" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-3xl font-serif font-bold mb-4">
                <span className="text-white">John</span>
                <span className="text-accent-gold"> Architect</span>
              </h3>
              <p className="text-architect-300 mb-6 leading-relaxed">
                Creating sustainable, innovative spaces that harmonize with nature and enhance human experience through thoughtful design.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`w-10 h-10 bg-architect-800 rounded-full flex items-center justify-center transition-colors ${social.color} hover:bg-architect-700`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-bold text-white mb-6">Quick Links</h4>
              <nav className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className="block text-architect-300 hover:text-accent-gold transition-colors duration-300 hover:translate-x-1 transform"
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}
              </nav>
            </motion.div>

            {/* Professional Affiliations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-bold text-white mb-6">Professional Affiliations</h4>
              <div className="space-y-3">
                {affiliations.map((affiliation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-2"
                  >
                    <div className="w-2 h-2 bg-accent-gold rounded-full mt-2 flex-shrink-0" />
                    <p className="text-architect-300 text-sm leading-relaxed">{affiliation}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-serif font-bold text-white mb-6">Get in Touch</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-architect-400 text-sm">Email</p>
                  <a
                    href="mailto:john@johnarchitect.com"
                    className="text-architect-300 hover:text-accent-gold transition-colors"
                  >
                    john@johnarchitect.com
                  </a>
                </div>
                <div>
                  <p className="text-architect-400 text-sm">Phone</p>
                  <a
                    href="tel:+15551234567"
                    className="text-architect-300 hover:text-accent-gold transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
                <div>
                  <p className="text-architect-400 text-sm">Location</p>
                  <p className="text-architect-300">San Francisco, CA</p>
                </div>
                <div>
                  <p className="text-architect-400 text-sm">Office Hours</p>
                  <p className="text-architect-300">Mon-Fri 9AM-6PM PST</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-architect-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center md:text-left"
              >
                <p className="text-architect-400 text-sm">
                  © {currentYear} John Architect. All rights reserved.
                </p>
                <p className="text-architect-500 text-xs mt-1">
                  Designed with passion for sustainable architecture
                </p>
              </motion.div>

              {/* Back to Top Button */}
              <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
                className="group flex items-center space-x-2 px-4 py-2 bg-architect-800 hover:bg-accent-gold rounded-full transition-colors"
                aria-label="Back to top"
              >
                <span className="text-sm text-architect-300 group-hover:text-architect-900 transition-colors">
                  Back to Top
                </span>
                <ArrowUp className="w-4 h-4 text-architect-300 group-hover:text-architect-900 transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Floating Back to Top Button for Mobile */}
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-accent-gold rounded-full flex items-center justify-center shadow-lg z-20"
          aria-label="Back to top"
        >
          <ArrowUp className="w-6 h-6 text-architect-900" />
        </motion.button>
      </div>
    </footer>
  )
}