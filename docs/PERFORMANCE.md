# Performance Optimization Guide

This comprehensive guide covers performance optimization techniques and best practices for the Architect Resume Portfolio to ensure fast loading times, smooth animations, and excellent user experience.

## Table of Contents

- [Performance Overview](#performance-overview)
- [Core Web Vitals](#core-web-vitals)
- [Image Optimization](#image-optimization)
- [Code Splitting](#code-splitting)
- [Bundle Optimization](#bundle-optimization)
- [Font Optimization](#font-optimization)
- [CSS Optimization](#css-optimization)
- [JavaScript Optimization](#javascript-optimization)
- [Animation Performance](#animation-performance)
- [Network Optimization](#network-optimization)
- [Caching Strategies](#caching-strategies)
- [Performance Monitoring](#performance-monitoring)
- [Mobile Optimization](#mobile-optimization)
- [Progressive Enhancement](#progressive-enhancement)

## Performance Overview

### Current Performance Metrics

The Architect Resume Portfolio is optimized for:

- **Lighthouse Score**: 95+ across all categories
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Performance Goals

- **Load Time**: Complete page load in under 3 seconds on 3G
- **Time to Interactive**: Under 5 seconds on mobile devices
- **Bundle Size**: Keep initial JavaScript bundle under 250KB
- **Image Efficiency**: Serve next-gen formats (WebP, AVIF)
- **Accessibility**: Maintain 100% accessibility score

## Core Web Vitals

### Largest Contentful Paint (LCP)

LCP measures loading performance and should occur within 2.5 seconds.

#### Optimization Strategies

```typescript
// 1. Optimize Hero Image Loading
// app/components/Hero.tsx
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="relative min-h-screen">
      <Image
        src="/images/hero-background.jpg"
        alt="Architectural Design Background"
        fill
        priority // Load immediately
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
        sizes="100vw"
        className="object-cover"
      />
      {/* Hero content */}
    </div>
  )
}
```

```typescript
// 2. Preload Critical Resources
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/images/hero-background.jpg"
          as="image"
          type="image/jpeg"
        />
        <link
          rel="preload"
          href="/fonts/playfair-display.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### First Input Delay (FID)

FID measures interactivity and should be less than 100ms.

#### Optimization Techniques

```typescript
// 1. Code Splitting for Interactive Components
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load non-critical interactive components
const ContactForm = dynamic(() => import('./ContactForm'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false // Disable SSR for client-only components
})

const Portfolio = dynamic(() => import('./Portfolio'), {
  loading: () => <PortfolioSkeleton />
})

export default function HomePage() {
  return (
    <main>
      <Hero /> {/* Critical, loaded immediately */}
      <Suspense fallback={<div>Loading...</div>}>
        <Portfolio />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <ContactForm />
      </Suspense>
    </main>
  )
}
```

```typescript
// 2. Optimize Event Handlers
import { useCallback, useMemo } from 'react'

export default function Navigation() {
  // Memoize expensive calculations
  const navigationItems = useMemo(() => [
    { href: '#home', label: 'Home' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#contact', label: 'Contact' }
  ], [])

  // Memoize event handlers
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const handleSmoothScroll = useCallback((targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <nav>
      {navigationItems.map(item => (
        <button
          key={item.href}
          onClick={() => handleSmoothScroll(item.href.slice(1))}
          className="nav-link"
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
```

### Cumulative Layout Shift (CLS)

CLS measures visual stability and should be less than 0.1.

#### Prevention Strategies

```typescript
// 1. Reserve Space for Dynamic Content
// app/components/Portfolio.tsx
export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  return (
    <section className="py-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Maintain layout during loading
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] bg-gray-200 animate-pulse rounded-lg"
              style={{ height: '300px' }} // Fixed height prevents CLS
            />
          ))
        ) : (
          projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </section>
  )
}
```

```typescript
// 2. Use CSS Aspect Ratios
// globals.css
.project-card-image {
  aspect-ratio: 4 / 3;
  width: 100%;
  object-fit: cover;
}

.hero-background {
  aspect-ratio: 16 / 9;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .hero-background {
    aspect-ratio: 3 / 4;
  }
}
```

## Image Optimization

### Next.js Image Component

```typescript
// lib/imageOptimization.ts
import Image, { ImageProps } from 'next/image'

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string
  alt: string
  priority?: boolean
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  priority = false,
  quality = 85,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL={generateBlurDataURL()}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  )
}

function generateBlurDataURL(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIHN0b3AtY29sb3I9IiNmM2Y0ZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+'
}
```

### Image Format Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'], // Serve modern formats first
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'your-cdn-domain.com'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  // Enable experimental image optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion']
  }
}

module.exports = nextConfig
```

### Responsive Images

```typescript
// components/ResponsiveImage.tsx
interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export default function ResponsiveImage({
  src,
  alt,
  className,
  priority = false
}: ResponsiveImageProps) {
  return (
    <picture>
      <source
        srcSet={`${src}?format=avif&w=320 320w, ${src}?format=avif&w=640 640w, ${src}?format=avif&w=1280 1280w`}
        type="image/avif"
      />
      <source
        srcSet={`${src}?format=webp&w=320 320w, ${src}?format=webp&w=640 640w, ${src}?format=webp&w=1280 1280w`}
        type="image/webp"
      />
      <Image
        src={src}
        alt={alt}
        width={1280}
        height={720}
        priority={priority}
        className={className}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </picture>
  )
}
```

## Code Splitting

### Dynamic Imports

```typescript
// app/page.tsx
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Critical components - loaded immediately
import Hero from './components/Hero'
import Navigation from './components/Navigation'

// Non-critical components - lazy loaded
const Portfolio = dynamic(() => import('./components/Portfolio'), {
  loading: () => <PortfolioSkeleton />,
})

const Experience = dynamic(() => import('./components/Experience'), {
  loading: () => <ExperienceSkeleton />,
})

const Skills = dynamic(() => import('./components/Skills'), {
  loading: () => <SkillsSkeleton />,
})

const Contact = dynamic(() => import('./components/Contact'), {
  loading: () => <ContactSkeleton />,
  ssr: false // Client-side only for form interactions
})

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <Hero />
      
      <Suspense fallback={<div>Loading portfolio...</div>}>
        <Portfolio />
      </Suspense>
      
      <Suspense fallback={<div>Loading experience...</div>}>
        <Experience />
      </Suspense>
      
      <Suspense fallback={<div>Loading skills...</div>}>
        <Skills />
      </Suspense>
      
      <Suspense fallback={<div>Loading contact form...</div>}>
        <Contact />
      </Suspense>
    </main>
  )
}
```

### Route-Based Code Splitting

```typescript
// app/layout.tsx
import { Suspense } from 'react'
import LoadingSpinner from './components/LoadingSpinner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
```

## Bundle Optimization

### Webpack Bundle Analyzer

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Your Next.js config
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tabs'
    ]
  },
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
      config.optimization.splitChunks.cacheGroups = {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        }
      }
    }
    return config
  }
})
```

### Tree Shaking Optimization

```typescript
// lib/utils.ts - Use targeted imports
// ❌ Bad - imports entire library
import * as Icons from 'lucide-react'

// ✅ Good - imports only needed icons
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react'

// ❌ Bad - imports entire Framer Motion
import * as Motion from 'framer-motion'

// ✅ Good - imports only needed parts
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
```

### Package Optimization

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "build:production": "NODE_ENV=production npm run build"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^15.0.0"
  }
}
```

## Font Optimization

### Google Fonts Optimization

```typescript
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Improve font loading performance
  preload: true,
  fallback: ['system-ui', 'arial']
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  fallback: ['serif']
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
```

### Local Font Optimization

```typescript
// For custom/local fonts
import localFont from 'next/font/local'

const customFont = localFont({
  src: [
    {
      path: '../public/fonts/CustomFont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CustomFont-Bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-custom',
  display: 'swap',
  preload: true,
  fallback: ['Arial', 'sans-serif']
})
```

### Font Loading Strategy

```css
/* globals.css */
/* Font fallback stack to prevent layout shift */
:root {
  --font-inter: 'Inter', system-ui, -apple-system, sans-serif;
  --font-playfair: 'Playfair Display', Georgia, serif;
}

/* Prevent flash of unstyled text */
.font-serif {
  font-family: var(--font-playfair);
  font-display: swap;
}

.font-sans {
  font-family: var(--font-inter);
  font-display: swap;
}

/* Size adjust to match fallback fonts */
@font-face {
  font-family: 'Inter';
  size-adjust: 107%;
}
```

## CSS Optimization

### Tailwind CSS Optimization

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Only include custom styles you actually use
      colors: {
        architect: {
          // Custom color palette
        }
      },
      fontFamily: {
        // Custom fonts
      }
    },
  },
  plugins: [
    // Only include plugins you use
  ],
  // Remove unused CSS
  purge: {
    content: ['./app/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: [
        // Add classes that might be added dynamically
        'animate-pulse',
        'animate-spin'
      ]
    }
  }
}

export default config
```

### Critical CSS Extraction

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Critical CSS inline */}
        <style jsx>{`
          .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .nav-fixed {
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 50;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

## JavaScript Optimization

### React Performance

```typescript
// components/Portfolio.tsx
import { memo, useMemo, useCallback } from 'react'

interface Project {
  id: number
  title: string
  category: string
  image: string
}

interface PortfolioProps {
  projects: Project[]
}

const Portfolio = memo(function Portfolio({ projects }: PortfolioProps) {
  // Memoize filtered projects
  const [activeFilter, setActiveFilter] = useState('all')
  
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects
    return projects.filter(project => project.category === activeFilter)
  }, [projects, activeFilter])

  // Memoize filter handler
  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter)
  }, [])

  return (
    <section>
      <FilterButtons 
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />
      <ProjectGrid projects={filteredProjects} />
    </section>
  )
})

// Memoize project cards
const ProjectCard = memo(function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card">
      <OptimizedImage
        src={project.image}
        alt={project.title}
        width={400}
        height={300}
      />
      <h3>{project.title}</h3>
    </div>
  )
})
```

### Event Handler Optimization

```typescript
// hooks/useThrottledScroll.ts
import { useCallback, useEffect, useRef } from 'react'

export function useThrottledScroll(callback: () => void, delay: number = 100) {
  const lastRun = useRef(Date.now())

  const throttledCallback = useCallback(() => {
    if (Date.now() - lastRun.current >= delay) {
      callback()
      lastRun.current = Date.now()
    }
  }, [callback, delay])

  useEffect(() => {
    window.addEventListener('scroll', throttledCallback)
    return () => window.removeEventListener('scroll', throttledCallback)
  }, [throttledCallback])
}

// Usage
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 100)
  }, [])

  useThrottledScroll(handleScroll, 100)

  return (
    <nav className={isScrolled ? 'nav-scrolled' : 'nav-top'}>
      {/* Navigation content */}
    </nav>
  )
}
```

## Animation Performance

### Framer Motion Optimization

```typescript
// lib/animations.ts
export const optimizedVariants = {
  // Use transform and opacity for better performance
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  
  // Avoid animating layout properties
  slideIn: {
    initial: { opacity: 0, transform: 'translateX(-20px)' },
    animate: { opacity: 1, transform: 'translateX(0px)' },
    transition: { duration: 0.3 }
  },

  // Use will-change sparingly
  hover: {
    whileHover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.95 }
  }
}

// Use layout animations only when necessary
export const layoutAnimation = {
  layout: true,
  transition: { duration: 0.3, ease: 'easeOut' }
}
```

```typescript
// components/AnimatedSection.tsx
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}
```

### CSS Animations

```css
/* Use CSS animations for simple, repeated animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}

/* Use CSS custom properties for dynamic values */
.animated-element {
  --duration: 0.3s;
  --easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition: transform var(--duration) var(--easing);
}
```

## Network Optimization

### Resource Hints

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        
        {/* Prefetch likely next pages */}
        <link rel="prefetch" href="/portfolio" />
        <link rel="prefetch" href="/contact" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Service Worker

```typescript
// public/sw.js
const CACHE_NAME = 'architect-portfolio-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/images/hero-bg.jpg',
  '/fonts/inter-var.woff2'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})
```

## Caching Strategies

### Next.js Caching

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}
```

### Browser Caching

```typescript
// lib/cache.ts
class CacheManager {
  private cache = new Map()

  set(key: string, value: any, ttl: number = 300000) { // 5 minutes default
    const expires = Date.now() + ttl
    this.cache.set(key, { value, expires })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }

  clear() {
    this.cache.clear()
  }
}

export const cacheManager = new CacheManager()

// Usage in components
export function useProjectsCache() {
  const getCachedProjects = useCallback(() => {
    const cached = cacheManager.get('projects')
    if (cached) return cached
    
    // Fetch and cache
    return fetchProjects().then(data => {
      cacheManager.set('projects', data, 600000) // 10 minutes
      return data
    })
  }, [])

  return { getCachedProjects }
}
```

## Performance Monitoring

### Web Vitals Tracking

```typescript
// lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    })
  }
}

export function initPerformanceMonitoring() {
  getCLS(sendToAnalytics)
  getFID(sendToAnalytics)
  getFCP(sendToAnalytics)
  getLCP(sendToAnalytics)
  getTTFB(sendToAnalytics)
}

// Performance observer for custom metrics
export function trackCustomMetric(name: string, value: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'custom_metric', {
      event_category: 'Performance',
      event_label: name,
      value: Math.round(value),
    })
  }
}
```

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build app
        run: npm run build
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      startServerCommand: 'npm start',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

## Mobile Optimization

### Responsive Design Performance

```css
/* Optimize mobile-specific styles */
@media (max-width: 768px) {
  /* Reduce animations on mobile */
  .animate-on-desktop {
    animation: none;
  }
  
  /* Optimize images for mobile */
  .hero-image {
    content: url('/images/hero-mobile.jpg');
  }
  
  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### Touch Optimization

```typescript
// hooks/useTouch.ts
import { useCallback, useEffect, useRef } from 'react'

export function useTouch() {
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const deltaX = touchStartX.current - touchEndX
    const deltaY = touchStartY.current - touchEndY

    // Handle swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) {
        // Swipe left
      } else if (deltaX < -50) {
        // Swipe right
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchEnd])
}
```

## Progressive Enhancement

### Feature Detection

```typescript
// lib/featureDetection.ts
export const features = {
  webp: typeof window !== 'undefined' && (() => {
    const canvas = document.createElement('canvas')
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  })(),
  
  avif: typeof window !== 'undefined' && (() => {
    const canvas = document.createElement('canvas')
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
  })(),
  
  intersectionObserver: typeof window !== 'undefined' && 'IntersectionObserver' in window,
  
  webGL: typeof window !== 'undefined' && (() => {
    try {
      const canvas = document.createElement('canvas')
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch (e) {
      return false
    }
  })(),
}

// Use features conditionally
export function useOptimalImageFormat() {
  if (features.avif) return 'avif'
  if (features.webp) return 'webp'
  return 'jpg'
}
```

### Fallback Strategies

```typescript
// components/EnhancedImage.tsx
export default function EnhancedImage({ src, alt, ...props }: ImageProps) {
  const [imageError, setImageError] = useState(false)
  const [format, setFormat] = useState('jpg')

  useEffect(() => {
    // Detect optimal format
    const optimalFormat = useOptimalImageFormat()
    setFormat(optimalFormat)
  }, [])

  if (imageError) {
    return (
      <div className="bg-gray-200 flex items-center justify-center">
        <span>Image unavailable</span>
      </div>
    )
  }

  return (
    <picture>
      <source srcSet={`${src}.avif`} type="image/avif" />
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img
        src={`${src}.jpg`}
        alt={alt}
        onError={() => setImageError(true)}
        loading="lazy"
        {...props}
      />
    </picture>
  )
}
```

This comprehensive performance optimization guide provides all the tools and techniques needed to create a fast, efficient, and user-friendly architect portfolio that performs excellently across all devices and network conditions.