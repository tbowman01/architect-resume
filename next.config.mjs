/**
 * Next.js Configuration with Dynamic Config Support
 */

import { ConfigUtils } from './config/index.ts'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  
  experimental: {
    optimizeCss: true,
  },
  
  // Load configuration at build time
  async rewrites() {
    try {
      const config = await ConfigUtils.getBuildTimeConfig()
      const rewrites = []
      
      // Add any configuration-based rewrites here
      if (config.blog.enabled) {
        rewrites.push({
          source: '/blog/:path*',
          destination: '/blog/:path*'
        })
      }
      
      return rewrites
    } catch (error) {
      console.warn('Failed to load config for rewrites:', error)
      return []
    }
  },
  
  async redirects() {
    try {
      const config = await ConfigUtils.getBuildTimeConfig()
      const redirects = []
      
      // Add configuration-based redirects
      if (!config.blog.enabled) {
        redirects.push({
          source: '/blog/:path*',
          destination: '/',
          permanent: false,
        })
      }
      
      if (!config.portfolio.enabled) {
        redirects.push({
          source: '/portfolio/:path*',
          destination: '/',
          permanent: false,
        })
      }
      
      return redirects
    } catch (error) {
      console.warn('Failed to load config for redirects:', error)
      return []
    }
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Environment variables
  env: {
    BUILD_TIME: new Date().toISOString(),
    VERSION: process.env.npm_package_version || '1.0.0',
  },
  
  // GitHub Pages deployment configuration
  basePath: process.env.NODE_ENV === 'production' ? process.env.BASE_PATH || '' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.ASSET_PREFIX || '' : '',
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/config': './config',
    }
    
    return config
  },
}

export default nextConfig