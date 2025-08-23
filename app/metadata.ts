/**
 * Metadata Generation from Configuration
 * Generates Next.js metadata from configuration system
 */

import type { Metadata } from 'next'
import { ConfigUtils } from '@/config'

/**
 * Generate metadata from configuration
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Load configuration at build time
    const config = await ConfigUtils.getBuildTimeConfig()
    
    const { personal, seo, social } = config
    
    const metadata: Metadata = {
      title: {
        default: seo.title,
        template: `%s | ${personal.name}`,
      },
      description: seo.description,
      keywords: seo.keywords.join(', '),
      authors: [{ name: seo.author, url: personal.website }],
      creator: seo.author,
      publisher: seo.author,
      
      // Open Graph
      openGraph: {
        type: 'website',
        locale: seo.locale,
        url: seo.siteUrl,
        siteName: seo.siteName,
        title: seo.title,
        description: seo.description,
        images: seo.ogImage ? [
          {
            url: seo.ogImage,
            width: 1200,
            height: 630,
            alt: `${personal.name} - ${personal.title}`,
          },
        ] : [],
      },
      
      // Twitter
      twitter: {
        card: seo.twitterCard,
        site: social.twitter,
        creator: social.twitter,
        title: seo.title,
        description: seo.description,
        images: seo.ogImage ? [seo.ogImage] : [],
      },
      
      // Verification and robots
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      
      // Icons and manifest
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
      },
      
      manifest: '/site.webmanifest',
      
      // Additional metadata
      category: 'Architecture',
      classification: 'Portfolio',
      
      // Canonical URL
      alternates: {
        canonical: seo.siteUrl,
      },
    }
    
    return metadata
  } catch (error) {
    console.error('Failed to generate metadata from configuration:', error)
    
    // Fallback metadata
    return {
      title: 'Architect Portfolio',
      description: 'Professional architect portfolio showcasing innovative designs and sustainable architecture',
      keywords: 'architect, portfolio, design, sustainable architecture, urban planning',
    }
  }
}

/**
 * Generate page-specific metadata
 */
export function generatePageMetadata(
  title: string,
  description?: string,
  image?: string,
  noIndex = false
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
    },
    twitter: {
      title,
      description,
      images: image ? [image] : [],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  }
}