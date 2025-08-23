/**
 * Dynamic Configuration Loader
 * Handles loading configuration from various sources (files, API, cache)
 */

import { promises as fs } from 'fs'
import path from 'path'
import { ArchitectResumeConfig, validateConfig } from './schema'
import { loadEnvironmentConfig, getRuntimeEnvironment, envLog } from './environment'
import { processConfigurationTemplates } from './template'

export interface ConfigSource {
  type: 'file' | 'url' | 'env' | 'default'
  path?: string
  url?: string
  priority: number
  cache?: boolean
  ttl?: number // Time to live in milliseconds
}

export interface LoadedConfig {
  config: ArchitectResumeConfig
  sources: ConfigSource[]
  loadTime: Date
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface CachedConfig {
  config: ArchitectResumeConfig
  timestamp: number
  ttl: number
  source: ConfigSource
}

// In-memory cache for loaded configurations
const configCache = new Map<string, CachedConfig>()

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Partial<ArchitectResumeConfig> = {
  personal: {
    name: 'Your Name',
    title: 'Architect',
    email: 'your.email@example.com',
    location: 'Your Location',
    bio: 'Professional architect with expertise in sustainable design.',
  },
  social: {},
  seo: {
    title: 'Architect Portfolio',
    description: 'Professional architect portfolio showcasing innovative designs.',
    keywords: ['architect', 'portfolio', 'design'],
    author: 'Your Name',
    siteName: 'Architect Portfolio',
    siteUrl: 'https://yoursite.com',
    locale: 'en-US',
    twitterCard: 'summary_large_image',
  },
  theme: {
    primaryColor: '#8a7855',
    secondaryColor: '#d4af37',
    accentColor: '#b87333',
    backgroundColor: '#ffffff',
    textColor: '#1b1811',
    fonts: {
      primary: 'Inter',
      secondary: 'Playfair Display',
      mono: 'JetBrains Mono',
    },
  },
  features: {
    blog: true,
    chatbot: false,
    contact: true,
    portfolio: true,
    experience: true,
    education: true,
    skills: true,
    analytics: false,
    darkMode: false,
    animations: true,
    lazyLoading: true,
  },
  portfolio: {
    enabled: true,
    projects: [],
    categoriesFilter: true,
    projectsPerPage: 12,
  },
  experience: {
    enabled: true,
    items: [],
  },
  education: {
    enabled: true,
    items: [],
  },
  skills: {
    enabled: true,
    items: [],
    showLevels: true,
    groupByCategory: true,
  },
  blog: {
    enabled: true,
    postsPerPage: 10,
    featuredPostsLimit: 3,
    categories: [],
    showReadTime: true,
    showAuthor: true,
    enableComments: false,
  },
  contact: {
    enabled: true,
    showForm: true,
    showEmail: true,
    showPhone: true,
    showSocial: true,
    mapEnabled: false,
  },
  chatbot: {
    enabled: false,
    name: 'Assistant',
    welcomeMessage: 'Hello! How can I help you today?',
    responses: {},
  },
  analytics: {},
  deployment: {
    platform: 'vercel',
    environment: 'development',
  },
  build: {
    generateSitemap: true,
    generateRobots: true,
    optimizeImages: true,
    minifyCSS: true,
    minifyJS: true,
  },
}

/**
 * Load configuration from a file
 */
async function loadConfigFromFile(filePath: string): Promise<any> {
  try {
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(process.cwd(), filePath)
    
    const fileContent = await fs.readFile(absolutePath, 'utf-8')
    const extension = path.extname(absolutePath).toLowerCase()
    
    switch (extension) {
      case '.json':
        return JSON.parse(fileContent)
      
      case '.js':
      case '.mjs':
        // For ES modules or CommonJS
        delete require.cache[absolutePath]
        const jsModule = await import(absolutePath)
        return jsModule.default || jsModule
      
      case '.ts':
        // TypeScript files need to be compiled first
        // In a real implementation, you might use esbuild or similar
        throw new Error('TypeScript config files need to be pre-compiled')
      
      case '.yaml':
      case '.yml':
        // Would need yaml parser
        throw new Error('YAML config files require yaml parser')
      
      default:
        throw new Error(`Unsupported config file format: ${extension}`)
    }
  } catch (error) {
    envLog('error', `Failed to load config from file: ${filePath}`, error)
    throw error
  }
}

/**
 * Load configuration from URL
 */
async function loadConfigFromURL(url: string): Promise<any> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return await response.json()
    } else {
      const text = await response.text()
      return JSON.parse(text)
    }
  } catch (error) {
    envLog('error', `Failed to load config from URL: ${url}`, error)
    throw error
  }
}

/**
 * Check if cached config is still valid
 */
function isCacheValid(cached: CachedConfig): boolean {
  return Date.now() - cached.timestamp < cached.ttl
}

/**
 * Load configuration from a single source
 */
async function loadFromSource(source: ConfigSource): Promise<any> {
  const cacheKey = source.path || source.url || 'default'
  
  // Check cache first
  if (source.cache) {
    const cached = configCache.get(cacheKey)
    if (cached && isCacheValid(cached)) {
      envLog('info', `Using cached config from: ${cacheKey}`)
      return cached.config
    }
  }
  
  let config: any
  
  switch (source.type) {
    case 'file':
      if (!source.path) throw new Error('File source requires path')
      config = await loadConfigFromFile(source.path)
      break
    
    case 'url':
      if (!source.url) throw new Error('URL source requires url')
      config = await loadConfigFromURL(source.url)
      break
    
    case 'env':
      config = loadEnvironmentConfig()
      break
    
    case 'default':
      config = DEFAULT_CONFIG
      break
    
    default:
      throw new Error(`Unknown config source type: ${source.type}`)
  }
  
  // Cache the result if caching is enabled
  if (source.cache && config) {
    configCache.set(cacheKey, {
      config,
      timestamp: Date.now(),
      ttl: source.ttl || 300000, // 5 minutes default
      source,
    })
  }
  
  return config
}

/**
 * Merge multiple configuration objects
 */
function mergeConfigs(...configs: any[]): any {
  function isObject(obj: any): obj is Record<string, any> {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
  }
  
  function deepMerge(target: any, source: any): any {
    const result = { ...target }
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (isObject(result[key]) && isObject(source[key])) {
          result[key] = deepMerge(result[key], source[key])
        } else {
          result[key] = source[key]
        }
      }
    }
    
    return result
  }
  
  return configs.reduce((merged, config) => {
    return config ? deepMerge(merged, config) : merged
  }, {})
}

/**
 * Load configuration from multiple sources
 */
export async function loadConfiguration(
  sources: ConfigSource[] = [],
  options: {
    processTemplates?: boolean
    customVars?: Record<string, any>
    validateSchema?: boolean
  } = {}
): Promise<LoadedConfig> {
  const {
    processTemplates = true,
    customVars = {},
    validateSchema = true,
  } = options
  
  const errors: string[] = []
  const warnings: string[] = []
  const loadedConfigs: any[] = []
  
  // Default sources if none provided
  const defaultSources: ConfigSource[] = [
    { type: 'default', priority: 0 },
    { type: 'file', path: 'config/architect-resume.json', priority: 10, cache: true },
    { type: 'file', path: 'config/architect-resume.local.json', priority: 20, cache: true },
    { type: 'env', priority: 30 },
  ]
  
  const allSources = sources.length > 0 ? sources : defaultSources
  
  // Sort sources by priority (lower number = higher priority)
  const sortedSources = [...allSources].sort((a, b) => a.priority - b.priority)
  
  // Load from each source
  for (const source of sortedSources) {
    try {
      envLog('info', `Loading config from ${source.type}:`, source.path || source.url)
      const config = await loadFromSource(source)
      if (config) {
        loadedConfigs.push(config)
      }
    } catch (error) {
      const errorMessage = `Failed to load from ${source.type} ${source.path || source.url}: ${error}`
      envLog('warn', errorMessage)
      warnings.push(errorMessage)
    }
  }
  
  if (loadedConfigs.length === 0) {
    const errorMessage = 'No configuration could be loaded from any source'
    errors.push(errorMessage)
    envLog('error', errorMessage)
    
    return {
      config: DEFAULT_CONFIG as ArchitectResumeConfig,
      sources: sortedSources,
      loadTime: new Date(),
      isValid: false,
      errors,
      warnings,
    }
  }
  
  // Merge all configurations
  let mergedConfig = mergeConfigs(...loadedConfigs)
  
  // Process templates if enabled
  if (processTemplates) {
    try {
      mergedConfig = processConfigurationTemplates(mergedConfig, customVars)
    } catch (error) {
      const errorMessage = `Template processing failed: ${error}`
      warnings.push(errorMessage)
      envLog('warn', errorMessage)
    }
  }
  
  // Validate schema if enabled
  let isValid = true
  if (validateSchema) {
    const validation = validateConfig(mergedConfig)
    if (!validation.success) {
      isValid = false
      if (validation.error) {
        validation.error.issues.forEach(issue => {
          const errorMessage = `${issue.path.join('.')}: ${issue.message}`
          errors.push(errorMessage)
        })
      }
    }
    mergedConfig = validation.data || mergedConfig
  }
  
  envLog('info', `Configuration loaded successfully from ${loadedConfigs.length} sources`)
  
  return {
    config: mergedConfig as ArchitectResumeConfig,
    sources: sortedSources,
    loadTime: new Date(),
    isValid,
    errors,
    warnings,
  }
}

/**
 * Load configuration with common presets
 */
export const ConfigPresets = {
  /**
   * Development preset
   */
  async development(customSources: ConfigSource[] = []) {
    const sources: ConfigSource[] = [
      { type: 'default', priority: 0 },
      { type: 'file', path: 'config/architect-resume.json', priority: 10, cache: false },
      { type: 'file', path: 'config/architect-resume.dev.json', priority: 20, cache: false },
      { type: 'file', path: 'config/architect-resume.local.json', priority: 30, cache: false },
      { type: 'env', priority: 40 },
      ...customSources,
    ]
    
    return loadConfiguration(sources, {
      processTemplates: true,
      validateSchema: true,
      customVars: {
        environment: 'development',
        debug: true,
      },
    })
  },
  
  /**
   * Production preset
   */
  async production(customSources: ConfigSource[] = []) {
    const sources: ConfigSource[] = [
      { type: 'default', priority: 0 },
      { type: 'file', path: 'config/architect-resume.json', priority: 10, cache: true, ttl: 600000 },
      { type: 'file', path: 'config/architect-resume.prod.json', priority: 20, cache: true, ttl: 600000 },
      { type: 'env', priority: 30 },
      ...customSources,
    ]
    
    return loadConfiguration(sources, {
      processTemplates: true,
      validateSchema: true,
      customVars: {
        environment: 'production',
        debug: false,
      },
    })
  },
  
  /**
   * Test preset
   */
  async test(customSources: ConfigSource[] = []) {
    const sources: ConfigSource[] = [
      { type: 'default', priority: 0 },
      { type: 'file', path: 'config/architect-resume.test.json', priority: 10, cache: false },
      { type: 'env', priority: 20 },
      ...customSources,
    ]
    
    return loadConfiguration(sources, {
      processTemplates: false, // Disable templates in tests for predictability
      validateSchema: true,
      customVars: {
        environment: 'test',
        debug: false,
      },
    })
  },
}

/**
 * Watch configuration files for changes
 */
export function watchConfiguration(
  sources: ConfigSource[],
  callback: (config: LoadedConfig) => void
): () => void {
  const watchers: Array<() => void> = []
  
  // Only watch file sources
  const fileSources = sources.filter(source => 
    source.type === 'file' && source.path
  )
  
  for (const source of fileSources) {
    if (!source.path) continue
    
    try {
      const absolutePath = path.isAbsolute(source.path)
        ? source.path
        : path.join(process.cwd(), source.path)
      
      const watcher = require('fs').watch(absolutePath, async (eventType: string) => {
        if (eventType === 'change') {
          envLog('info', `Config file changed: ${source.path}`)
          
          // Clear cache for this file
          configCache.delete(source.path)
          
          // Reload configuration
          try {
            const newConfig = await loadConfiguration(sources)
            callback(newConfig)
          } catch (error) {
            envLog('error', 'Failed to reload configuration:', error)
          }
        }
      })
      
      watchers.push(() => watcher.close())
    } catch (error) {
      envLog('warn', `Failed to watch config file: ${source.path}`, error)
    }
  }
  
  // Return cleanup function
  return () => {
    watchers.forEach(cleanup => cleanup())
  }
}

/**
 * Clear configuration cache
 */
export function clearConfigCache(key?: string): void {
  if (key) {
    configCache.delete(key)
  } else {
    configCache.clear()
  }
  envLog('info', key ? `Cleared cache for: ${key}` : 'Cleared all config cache')
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const stats = {
    size: configCache.size,
    items: [] as Array<{
      key: string
      timestamp: Date
      ttl: number
      isValid: boolean
      source: ConfigSource
    }>
  }
  
  for (const [key, cached] of configCache.entries()) {
    stats.items.push({
      key,
      timestamp: new Date(cached.timestamp),
      ttl: cached.ttl,
      isValid: isCacheValid(cached),
      source: cached.source,
    })
  }
  
  return stats
}