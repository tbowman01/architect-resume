/**
 * Configuration Schema and Validation
 * Zod schemas for validating architect-resume configuration
 */

import { z } from 'zod'

// Personal Information Schema
export const PersonalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  website: z.string().url().optional(),
  linkedIn: z.string().url().optional(),
  github: z.string().url().optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  avatar: z.string().url().optional(),
})

// Social Links Schema
export const SocialLinksSchema = z.object({
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  behance: z.string().url().optional(),
  dribbble: z.string().url().optional(),
  facebook: z.string().url().optional(),
})

// SEO Configuration Schema
export const SEOConfigSchema = z.object({
  title: z.string().min(1).max(60, 'Title should be under 60 characters'),
  description: z.string().min(50).max(160, 'Description should be 50-160 characters'),
  keywords: z.array(z.string()).min(3, 'At least 3 keywords required'),
  author: z.string().min(1, 'Author is required'),
  siteName: z.string().min(1, 'Site name is required'),
  siteUrl: z.string().url('Invalid site URL'),
  locale: z.string().default('en-US'),
  ogImage: z.string().url().optional(),
  twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
})

// Theme Configuration Schema
export const ThemeConfigSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  fonts: z.object({
    primary: z.string().min(1, 'Primary font is required'),
    secondary: z.string().min(1, 'Secondary font is required'),
    mono: z.string().min(1, 'Mono font is required'),
  }),
  customCSS: z.string().optional(),
})

// Portfolio Project Schema
export const PortfolioProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Invalid image URL'),
  galleryImages: z.array(z.string().url()).optional(),
  technologies: z.array(z.string()).optional(),
  client: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 10),
  featured: z.boolean().default(false),
  url: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  status: z.enum(['completed', 'in-progress', 'concept']).default('completed'),
})

// Experience Schema
export const ExperienceSchema = z.object({
  id: z.string().min(1, 'Experience ID is required'),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  achievements: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
})

// Education Schema
export const EducationSchema = z.object({
  id: z.string().min(1, 'Education ID is required'),
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.number().min(0).max(4).optional(),
  honors: z.array(z.string()).optional(),
  description: z.string().optional(),
})

// Skill Schema
export const SkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.number().int().min(1).max(100, 'Skill level must be between 1-100'),
  category: z.string().min(1, 'Category is required'),
  icon: z.string().optional(),
})

// Blog Configuration Schema
export const BlogConfigSchema = z.object({
  enabled: z.boolean().default(true),
  postsPerPage: z.number().int().min(1).max(50).default(10),
  featuredPostsLimit: z.number().int().min(1).max(20).default(3),
  categories: z.array(z.string()).default([]),
  showReadTime: z.boolean().default(true),
  showAuthor: z.boolean().default(true),
  enableComments: z.boolean().default(false),
})

// Contact Configuration Schema
export const ContactConfigSchema = z.object({
  enabled: z.boolean().default(true),
  showForm: z.boolean().default(true),
  formEndpoint: z.string().url().optional(),
  showEmail: z.boolean().default(true),
  showPhone: z.boolean().default(true),
  showSocial: z.boolean().default(true),
  mapEnabled: z.boolean().default(false),
  mapApiKey: z.string().optional(),
  officeAddress: z.string().optional(),
})

// Chatbot Configuration Schema
export const ChatbotConfigSchema = z.object({
  enabled: z.boolean().default(false),
  name: z.string().min(1, 'Chatbot name is required'),
  avatar: z.string().url().optional(),
  welcomeMessage: z.string().min(1, 'Welcome message is required'),
  responses: z.record(z.array(z.string())).default({}),
  apiEndpoint: z.string().url().optional(),
  model: z.string().optional(),
})

// Analytics Configuration Schema
export const AnalyticsConfigSchema = z.object({
  googleAnalytics: z.string().optional(),
  googleTagManager: z.string().optional(),
  hotjar: z.string().optional(),
  mixpanel: z.string().optional(),
  customTracking: z.string().optional(),
})

// Deployment Configuration Schema
export const DeploymentConfigSchema = z.object({
  platform: z.enum(['vercel', 'netlify', 'github-pages', 'aws', 'custom']).default('vercel'),
  basePath: z.string().optional(),
  assetPrefix: z.string().optional(),
  customDomain: z.string().url().optional(),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
})

// Feature Flags Schema
export const FeatureFlagsSchema = z.object({
  blog: z.boolean().default(true),
  chatbot: z.boolean().default(false),
  contact: z.boolean().default(true),
  portfolio: z.boolean().default(true),
  experience: z.boolean().default(true),
  education: z.boolean().default(true),
  skills: z.boolean().default(true),
  analytics: z.boolean().default(false),
  darkMode: z.boolean().default(false),
  animations: z.boolean().default(true),
  lazyLoading: z.boolean().default(true),
})

// Main Configuration Schema
export const ArchitectResumeConfigSchema = z.object({
  // Core configuration
  personal: PersonalInfoSchema,
  social: SocialLinksSchema,
  seo: SEOConfigSchema,
  theme: ThemeConfigSchema,
  features: FeatureFlagsSchema,
  
  // Content configuration
  portfolio: z.object({
    enabled: z.boolean().default(true),
    projects: z.array(PortfolioProjectSchema).default([]),
    categoriesFilter: z.boolean().default(true),
    projectsPerPage: z.number().int().min(1).max(50).default(12),
  }),
  
  experience: z.object({
    enabled: z.boolean().default(true),
    items: z.array(ExperienceSchema).default([]),
  }),
  
  education: z.object({
    enabled: z.boolean().default(true),
    items: z.array(EducationSchema).default([]),
  }),
  
  skills: z.object({
    enabled: z.boolean().default(true),
    items: z.array(SkillSchema).default([]),
    showLevels: z.boolean().default(true),
    groupByCategory: z.boolean().default(true),
  }),
  
  blog: BlogConfigSchema,
  contact: ContactConfigSchema,
  chatbot: ChatbotConfigSchema,
  
  // Technical configuration
  analytics: AnalyticsConfigSchema,
  deployment: DeploymentConfigSchema,
  
  // Build configuration
  build: z.object({
    generateSitemap: z.boolean().default(true),
    generateRobots: z.boolean().default(true),
    optimizeImages: z.boolean().default(true),
    minifyCSS: z.boolean().default(true),
    minifyJS: z.boolean().default(true),
  }),
})

// Environment Configuration Schema
export const EnvironmentConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  
  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  
  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
  NEXT_PUBLIC_HOTJAR_ID: z.string().optional(),
  
  // Contact Form
  CONTACT_FORM_ENDPOINT: z.string().url().optional(),
  CONTACT_FORM_API_KEY: z.string().optional(),
  
  // Chatbot
  CHATBOT_API_ENDPOINT: z.string().url().optional(),
  CHATBOT_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  
  // Maps
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  
  // Email
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  
  // Database
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
}).catchall(z.string().optional())

// Export types derived from schemas
export type ArchitectResumeConfig = z.infer<typeof ArchitectResumeConfigSchema>
export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>
export type SocialLinks = z.infer<typeof SocialLinksSchema>
export type SEOConfig = z.infer<typeof SEOConfigSchema>
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>
export type PortfolioProject = z.infer<typeof PortfolioProjectSchema>
export type Experience = z.infer<typeof ExperienceSchema>
export type Education = z.infer<typeof EducationSchema>
export type Skill = z.infer<typeof SkillSchema>
export type BlogConfig = z.infer<typeof BlogConfigSchema>
export type ContactConfig = z.infer<typeof ContactConfigSchema>
export type ChatbotConfig = z.infer<typeof ChatbotConfigSchema>
export type AnalyticsConfig = z.infer<typeof AnalyticsConfigSchema>
export type DeploymentConfig = z.infer<typeof DeploymentConfigSchema>
export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>

// Validation function
export function validateConfig(config: unknown): { 
  success: boolean
  data?: ArchitectResumeConfig
  error?: z.ZodError 
} {
  try {
    const result = ArchitectResumeConfigSchema.parse(config)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error }
    }
    throw error
  }
}

// Environment validation function
export function validateEnvironment(env: unknown): {
  success: boolean
  data?: EnvironmentConfig
  error?: z.ZodError
} {
  try {
    const result = EnvironmentConfigSchema.parse(env)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error }
    }
    throw error
  }
}