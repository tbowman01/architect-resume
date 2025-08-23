/**
 * Configuration System Types
 * Type-safe interfaces for the architect-resume configuration system
 */

export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone?: string
  location: string
  website?: string
  linkedIn?: string
  github?: string
  bio: string
  avatar?: string
}

export interface SocialLinks {
  linkedin?: string
  github?: string
  twitter?: string
  instagram?: string
  behance?: string
  dribbble?: string
  facebook?: string
}

export interface SEOConfig {
  title: string
  description: string
  keywords: string[]
  author: string
  siteName: string
  siteUrl: string
  locale: string
  ogImage?: string
  twitterCard: 'summary' | 'summary_large_image'
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fonts: {
    primary: string
    secondary: string
    mono: string
  }
  customCSS?: string
}

export interface PortfolioProject {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string
  galleryImages?: string[]
  technologies?: string[]
  client?: string
  year: number
  featured: boolean
  url?: string
  githubUrl?: string
  status: 'completed' | 'in-progress' | 'concept'
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  achievements?: string[]
  technologies?: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: number
  honors?: string[]
  description?: string
}

export interface Skill {
  name: string
  level: number // 1-100
  category: string
  icon?: string
}

export interface BlogConfig {
  enabled: boolean
  postsPerPage: number
  featuredPostsLimit: number
  categories: string[]
  showReadTime: boolean
  showAuthor: boolean
  enableComments: boolean
}

export interface ContactConfig {
  enabled: boolean
  showForm: boolean
  formEndpoint?: string
  showEmail: boolean
  showPhone: boolean
  showSocial: boolean
  mapEnabled: boolean
  mapApiKey?: string
  officeAddress?: string
}

export interface ChatbotConfig {
  enabled: boolean
  name: string
  avatar?: string
  welcomeMessage: string
  responses: Record<string, string[]>
  apiEndpoint?: string
  model?: string
}

export interface AnalyticsConfig {
  googleAnalytics?: string
  googleTagManager?: string
  hotjar?: string
  mixpanel?: string
  customTracking?: string
}

export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'github-pages' | 'aws' | 'custom'
  basePath?: string
  assetPrefix?: string
  customDomain?: string
  environment: 'development' | 'staging' | 'production'
}

export interface FeatureFlags {
  blog: boolean
  chatbot: boolean
  contact: boolean
  portfolio: boolean
  experience: boolean
  education: boolean
  skills: boolean
  analytics: boolean
  darkMode: boolean
  animations: boolean
  lazyLoading: boolean
}

export interface ArchitectResumeConfig {
  // Core configuration
  personal: PersonalInfo
  social: SocialLinks
  seo: SEOConfig
  theme: ThemeConfig
  features: FeatureFlags
  
  // Content configuration
  portfolio: {
    enabled: boolean
    projects: PortfolioProject[]
    categoriesFilter: boolean
    projectsPerPage: number
  }
  
  experience: {
    enabled: boolean
    items: Experience[]
  }
  
  education: {
    enabled: boolean
    items: Education[]
  }
  
  skills: {
    enabled: boolean
    items: Skill[]
    showLevels: boolean
    groupByCategory: boolean
  }
  
  blog: BlogConfig
  contact: ContactConfig
  chatbot: ChatbotConfig
  
  // Technical configuration
  analytics: AnalyticsConfig
  deployment: DeploymentConfig
  
  // Build configuration
  build: {
    generateSitemap: boolean
    generateRobots: boolean
    optimizeImages: boolean
    minifyCSS: boolean
    minifyJS: boolean
  }
}

// Environment variable mappings
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'staging' | 'production'
  
  // API Configuration
  NEXT_PUBLIC_API_URL?: string
  NEXT_PUBLIC_SITE_URL?: string
  
  // Analytics
  NEXT_PUBLIC_GA_ID?: string
  NEXT_PUBLIC_GTM_ID?: string
  NEXT_PUBLIC_HOTJAR_ID?: string
  
  // Contact Form
  CONTACT_FORM_ENDPOINT?: string
  CONTACT_FORM_API_KEY?: string
  
  // Chatbot
  CHATBOT_API_ENDPOINT?: string
  CHATBOT_API_KEY?: string
  OPENAI_API_KEY?: string
  
  // Maps
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string
  
  // Email
  EMAIL_HOST?: string
  EMAIL_PORT?: string
  EMAIL_USER?: string
  EMAIL_PASS?: string
  
  // Database
  DATABASE_URL?: string
  REDIS_URL?: string
  
  // Custom
  [key: string]: string | undefined
}

// Template variable types
export interface TemplateVariables {
  personal: PersonalInfo
  social: SocialLinks
  seo: SEOConfig
  theme: ThemeConfig
  currentYear: number
  buildTime: string
  version: string
  [key: string]: any
}

// Configuration validation result
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  config?: ArchitectResumeConfig
}

// Configuration source types
export type ConfigSource = 'file' | 'env' | 'default' | 'runtime'

export interface ConfigSourceInfo {
  source: ConfigSource
  path?: string
  timestamp: Date
}

// Dynamic configuration updates
export interface ConfigUpdateEvent {
  key: string
  oldValue: any
  newValue: any
  source: ConfigSource
  timestamp: Date
}

export type ConfigUpdateListener = (event: ConfigUpdateEvent) => void

// Configuration schema validation
export interface ConfigSchema {
  required: string[]
  optional: string[]
  types: Record<string, string>
  defaults: Partial<ArchitectResumeConfig>
  validation: Record<string, (value: any) => boolean>
}