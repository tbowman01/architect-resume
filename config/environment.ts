/**
 * Environment Variable Handler
 * Handles environment variables with fallbacks and type safety
 */

import { EnvironmentConfig, validateEnvironment } from './schema'

// Environment variable prefixes for different contexts
const CLIENT_PREFIX = 'NEXT_PUBLIC_'
const SERVER_PREFIX = ''

/**
 * Get environment variable with fallback
 */
export function getEnvVar(
  key: string,
  fallback?: string,
  required = false
): string | undefined {
  const value = process.env[key] || fallback
  
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  
  return value
}

/**
 * Get client-side environment variable (NEXT_PUBLIC_ prefixed)
 */
export function getClientEnvVar(
  key: string,
  fallback?: string,
  required = false
): string | undefined {
  return getEnvVar(`${CLIENT_PREFIX}${key}`, fallback, required)
}

/**
 * Get server-side environment variable
 */
export function getServerEnvVar(
  key: string,
  fallback?: string,
  required = false
): string | undefined {
  return getEnvVar(key, fallback, required)
}

/**
 * Get boolean environment variable
 */
export function getEnvVarAsBoolean(
  key: string,
  fallback = false
): boolean {
  const value = getEnvVar(key)
  if (!value) return fallback
  
  return ['true', '1', 'yes', 'on'].includes(value.toLowerCase())
}

/**
 * Get number environment variable
 */
export function getEnvVarAsNumber(
  key: string,
  fallback?: number
): number | undefined {
  const value = getEnvVar(key)
  if (!value) return fallback
  
  const num = Number(value)
  return isNaN(num) ? fallback : num
}

/**
 * Get array environment variable (comma-separated)
 */
export function getEnvVarAsArray(
  key: string,
  fallback: string[] = [],
  separator = ','
): string[] {
  const value = getEnvVar(key)
  if (!value) return fallback
  
  return value.split(separator).map(item => item.trim()).filter(Boolean)
}

/**
 * Get JSON environment variable
 */
export function getEnvVarAsJSON<T = any>(
  key: string,
  fallback?: T
): T | undefined {
  const value = getEnvVar(key)
  if (!value) return fallback
  
  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.warn(`Failed to parse JSON from env var ${key}:`, error)
    return fallback
  }
}

/**
 * Load and validate environment configuration
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
  const rawEnv = {
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),
    
    // API Configuration
    NEXT_PUBLIC_API_URL: getClientEnvVar('API_URL'),
    NEXT_PUBLIC_SITE_URL: getClientEnvVar('SITE_URL'),
    
    // Analytics
    NEXT_PUBLIC_GA_ID: getClientEnvVar('GA_ID'),
    NEXT_PUBLIC_GTM_ID: getClientEnvVar('GTM_ID'),
    NEXT_PUBLIC_HOTJAR_ID: getClientEnvVar('HOTJAR_ID'),
    
    // Contact Form
    CONTACT_FORM_ENDPOINT: getServerEnvVar('CONTACT_FORM_ENDPOINT'),
    CONTACT_FORM_API_KEY: getServerEnvVar('CONTACT_FORM_API_KEY'),
    
    // Chatbot
    CHATBOT_API_ENDPOINT: getServerEnvVar('CHATBOT_API_ENDPOINT'),
    CHATBOT_API_KEY: getServerEnvVar('CHATBOT_API_KEY'),
    OPENAI_API_KEY: getServerEnvVar('OPENAI_API_KEY'),
    
    // Maps
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: getClientEnvVar('GOOGLE_MAPS_API_KEY'),
    
    // Email
    EMAIL_HOST: getServerEnvVar('EMAIL_HOST'),
    EMAIL_PORT: getServerEnvVar('EMAIL_PORT'),
    EMAIL_USER: getServerEnvVar('EMAIL_USER'),
    EMAIL_PASS: getServerEnvVar('EMAIL_PASS'),
    
    // Database
    DATABASE_URL: getServerEnvVar('DATABASE_URL'),
    REDIS_URL: getServerEnvVar('REDIS_URL'),
  }
  
  // Add any additional environment variables
  Object.keys(process.env).forEach(key => {
    if (!(key in rawEnv)) {
      rawEnv[key] = process.env[key]
    }
  })
  
  const validation = validateEnvironment(rawEnv)
  
  if (!validation.success) {
    console.error('Environment validation failed:', validation.error?.issues)
    throw new Error('Invalid environment configuration')
  }
  
  return validation.data!
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentDefaults(): Partial<any> {
  const env = getEnvVar('NODE_ENV', 'development')
  
  switch (env) {
    case 'production':
      return {
        build: {
          generateSitemap: true,
          generateRobots: true,
          optimizeImages: true,
          minifyCSS: true,
          minifyJS: true,
        },
        features: {
          analytics: true,
          lazyLoading: true,
          animations: true,
        },
      }
    
    case 'staging':
      return {
        build: {
          generateSitemap: true,
          generateRobots: false,
          optimizeImages: true,
          minifyCSS: false,
          minifyJS: false,
        },
        features: {
          analytics: false,
          lazyLoading: true,
          animations: true,
        },
      }
    
    case 'development':
    default:
      return {
        build: {
          generateSitemap: false,
          generateRobots: false,
          optimizeImages: false,
          minifyCSS: false,
          minifyJS: false,
        },
        features: {
          analytics: false,
          lazyLoading: false,
          animations: true,
        },
      }
  }
}

/**
 * Check if running in client-side context
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Check if running in server-side context
 */
export function isServerSide(): boolean {
  return typeof window === 'undefined'
}

/**
 * Get runtime environment
 */
export function getRuntimeEnvironment() {
  return {
    isClient: isClientSide(),
    isServer: isServerSide(),
    isDevelopment: getEnvVar('NODE_ENV') === 'development',
    isStaging: getEnvVar('NODE_ENV') === 'staging',
    isProduction: getEnvVar('NODE_ENV') === 'production',
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  }
}

/**
 * Environment-aware logging
 */
export function envLog(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  if (getEnvVar('NODE_ENV') === 'production') {
    // In production, only log errors
    if (level === 'error') {
      console.error(message, data)
    }
  } else {
    // In development/staging, log everything
    switch (level) {
      case 'info':
        console.log(message, data)
        break
      case 'warn':
        console.warn(message, data)
        break
      case 'error':
        console.error(message, data)
        break
    }
  }
}

/**
 * Feature flag helper using environment variables
 */
export function isFeatureEnabled(featureName: string): boolean {
  return getEnvVarAsBoolean(`FEATURE_${featureName.toUpperCase()}`)
}

/**
 * Environment variable mapping for Next.js config
 */
export function getNextConfigEnvVars() {
  return {
    env: {
      BUILD_TIME: new Date().toISOString(),
      VERSION: process.env.npm_package_version || '1.0.0',
    },
    publicRuntimeConfig: {
      apiUrl: getClientEnvVar('API_URL'),
      siteUrl: getClientEnvVar('SITE_URL'),
      gaId: getClientEnvVar('GA_ID'),
    },
    serverRuntimeConfig: {
      contactFormEndpoint: getServerEnvVar('CONTACT_FORM_ENDPOINT'),
      chatbotApiKey: getServerEnvVar('CHATBOT_API_KEY'),
      emailConfig: {
        host: getServerEnvVar('EMAIL_HOST'),
        port: getEnvVarAsNumber('EMAIL_PORT', 587),
        user: getServerEnvVar('EMAIL_USER'),
        pass: getServerEnvVar('EMAIL_PASS'),
      },
    },
  }
}