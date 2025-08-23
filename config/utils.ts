/**
 * Configuration Management Utilities
 * CLI and programmatic utilities for managing configuration
 */

import { promises as fs } from 'fs'
import path from 'path'
import { ArchitectResumeConfig, validateConfig } from './schema'
import { loadConfiguration, ConfigSource } from './loader'
import { replaceTemplateVariables, createTemplateContext } from './template'

/**
 * Validate configuration file
 */
export async function validateConfigFile(filePath: string): Promise<{
  isValid: boolean
  errors: string[]
  warnings: string[]
  config?: ArchitectResumeConfig
}> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const rawConfig = JSON.parse(content)
    
    const validation = validateConfig(rawConfig)
    
    return {
      isValid: validation.success,
      errors: validation.error?.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ) || [],
      warnings: [],
      config: validation.data,
    }
  } catch (error) {
    return {
      isValid: false,
      errors: [`Failed to validate config file: ${error}`],
      warnings: [],
    }
  }
}

/**
 * Generate configuration template
 */
export async function generateConfigTemplate(
  outputPath: string,
  includeExamples = true
): Promise<void> {
  const template: Partial<ArchitectResumeConfig> = {
    personal: {
      name: 'Your Name',
      title: 'Your Title',
      email: 'your.email@example.com',
      location: 'Your Location',
      bio: 'Your professional bio goes here...',
      website: '{{env.NEXT_PUBLIC_SITE_URL}}',
    },
    
    seo: {
      title: '{{personal.name}} - {{personal.title}}',
      description: '{{personal.bio|truncate:155}}',
      keywords: ['architect', 'portfolio', 'design'],
      author: '{{personal.name}}',
      siteName: '{{personal.name}} Portfolio',
      siteUrl: '{{env.NEXT_PUBLIC_SITE_URL}}',
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
  }
  
  if (includeExamples) {
    template.portfolio = {
      enabled: true,
      categoriesFilter: true,
      projectsPerPage: 12,
      projects: [
        {
          id: 'example-project',
          title: 'Example Project',
          description: 'This is an example project. Replace with your own projects.',
          category: 'Example Category',
          imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
          year: new Date().getFullYear(),
          featured: true,
          status: 'completed',
          technologies: ['Technology 1', 'Technology 2'],
        },
      ],
    }
    
    template.experience = {
      enabled: true,
      items: [
        {
          id: 'example-job',
          company: 'Example Company',
          position: 'Example Position',
          location: 'City, State',
          startDate: '2020-01',
          current: true,
          description: 'Description of your role and responsibilities.',
          achievements: ['Achievement 1', 'Achievement 2'],
          technologies: ['Technology 1', 'Technology 2'],
        },
      ],
    }
  }
  
  await fs.writeFile(
    outputPath,
    JSON.stringify(template, null, 2),
    'utf-8'
  )
}

/**
 * Preview configuration with template variables resolved
 */
export async function previewConfiguration(
  sources?: ConfigSource[]
): Promise<{
  config: ArchitectResumeConfig
  processedConfig: ArchitectResumeConfig
  templateVariables: string[]
}> {
  const loaded = await loadConfiguration(sources, {
    processTemplates: false,
    validateSchema: true,
  })
  
  const context = createTemplateContext(loaded.config)
  const processedConfig = JSON.parse(JSON.stringify(loaded.config))
  
  // Process template variables
  function processValue(obj: any, path: string[] = []): any {
    if (typeof obj === 'string') {
      return replaceTemplateVariables(obj, context)
    } else if (Array.isArray(obj)) {
      return obj.map((item, index) => processValue(item, [...path, index.toString()]))
    } else if (obj && typeof obj === 'object') {
      const result: any = {}
      for (const [key, value] of Object.entries(obj)) {
        result[key] = processValue(value, [...path, key])
      }
      return result
    }
    return obj
  }
  
  const processed = processValue(processedConfig)
  
  // Extract template variables
  const templateVariables: Set<string> = new Set()
  
  function extractVariables(obj: any): void {
    if (typeof obj === 'string') {
      const matches = obj.match(/\{\{\s*([^}]+)\s*\}\}/g)
      if (matches) {
        matches.forEach(match => {
          const variable = match.replace(/\{\{\s*|\s*\}\}/g, '')
          templateVariables.add(variable)
        })
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(extractVariables)
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(extractVariables)
    }
  }
  
  extractVariables(loaded.config)
  
  return {
    config: loaded.config,
    processedConfig: processed,
    templateVariables: Array.from(templateVariables),
  }
}

/**
 * Merge multiple configuration files
 */
export async function mergeConfigFiles(
  inputPaths: string[],
  outputPath: string
): Promise<void> {
  const configs: any[] = []
  
  for (const inputPath of inputPaths) {
    try {
      const content = await fs.readFile(inputPath, 'utf-8')
      const config = JSON.parse(content)
      configs.push(config)
    } catch (error) {
      console.warn(`Failed to load config from ${inputPath}:`, error)
    }
  }
  
  // Deep merge configs
  function deepMerge(target: any, source: any): any {
    const result = { ...target }
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          result[key] && 
          typeof result[key] === 'object' && 
          typeof source[key] === 'object' &&
          !Array.isArray(result[key]) &&
          !Array.isArray(source[key])
        ) {
          result[key] = deepMerge(result[key], source[key])
        } else {
          result[key] = source[key]
        }
      }
    }
    
    return result
  }
  
  const merged = configs.reduce((acc, config) => deepMerge(acc, config), {})
  
  await fs.writeFile(
    outputPath,
    JSON.stringify(merged, null, 2),
    'utf-8'
  )
}

/**
 * Extract configuration from existing components
 */
export async function extractConfigFromComponents(
  componentsDir: string
): Promise<Partial<ArchitectResumeConfig>> {
  const extracted: any = {
    portfolio: { projects: [] },
    experience: { items: [] },
    education: { items: [] },
    skills: { items: [] },
  }
  
  try {
    // This is a placeholder for component analysis
    // In a real implementation, you'd parse component files
    // and extract hardcoded data to suggest configuration values
    
    console.log(`Analyzing components in ${componentsDir}...`)
    // Component analysis logic would go here
    
  } catch (error) {
    console.warn('Failed to extract config from components:', error)
  }
  
  return extracted
}

/**
 * Configuration diff utility
 */
export function diffConfigs(
  oldConfig: ArchitectResumeConfig,
  newConfig: ArchitectResumeConfig
): {
  added: string[]
  modified: string[]
  removed: string[]
  details: Array<{
    path: string
    type: 'added' | 'modified' | 'removed'
    oldValue?: any
    newValue?: any
  }>
} {
  const changes = {
    added: [] as string[],
    modified: [] as string[],
    removed: [] as string[],
    details: [] as Array<{
      path: string
      type: 'added' | 'modified' | 'removed'
      oldValue?: any
      newValue?: any
    }>,
  }
  
  function compare(old: any, current: any, path: string[] = []): void {
    const currentPath = path.join('.')
    
    // Check for removed keys
    for (const key in old) {
      if (!(key in current)) {
        changes.removed.push(path.length > 0 ? `${currentPath}.${key}` : key)
        changes.details.push({
          path: path.length > 0 ? `${currentPath}.${key}` : key,
          type: 'removed',
          oldValue: old[key],
        })
      }
    }
    
    // Check for added and modified keys
    for (const key in current) {
      const newPath = [...path, key]
      const pathString = newPath.join('.')
      
      if (!(key in old)) {
        changes.added.push(pathString)
        changes.details.push({
          path: pathString,
          type: 'added',
          newValue: current[key],
        })
      } else if (
        typeof old[key] === 'object' && 
        typeof current[key] === 'object' &&
        old[key] !== null &&
        current[key] !== null &&
        !Array.isArray(old[key]) &&
        !Array.isArray(current[key])
      ) {
        compare(old[key], current[key], newPath)
      } else if (JSON.stringify(old[key]) !== JSON.stringify(current[key])) {
        changes.modified.push(pathString)
        changes.details.push({
          path: pathString,
          type: 'modified',
          oldValue: old[key],
          newValue: current[key],
        })
      }
    }
  }
  
  compare(oldConfig, newConfig)
  
  return changes
}

/**
 * Configuration backup utility
 */
export async function backupConfig(
  configPath: string,
  backupDir = 'config/backups'
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const configName = path.basename(configPath, path.extname(configPath))
  const backupPath = path.join(backupDir, `${configName}-${timestamp}.json`)
  
  // Ensure backup directory exists
  await fs.mkdir(backupDir, { recursive: true })
  
  // Copy configuration file
  const content = await fs.readFile(configPath, 'utf-8')
  await fs.writeFile(backupPath, content, 'utf-8')
  
  return backupPath
}

/**
 * CLI utilities
 */
export const CLI = {
  async validate(configPath: string): Promise<void> {
    console.log(`Validating configuration: ${configPath}`)
    
    const result = await validateConfigFile(configPath)
    
    if (result.isValid) {
      console.log('✅ Configuration is valid!')
    } else {
      console.log('❌ Configuration validation failed:')
      result.errors.forEach(error => console.log(`  - ${error}`))
    }
    
    if (result.warnings.length > 0) {
      console.log('⚠️ Warnings:')
      result.warnings.forEach(warning => console.log(`  - ${warning}`))
    }
  },
  
  async generate(outputPath: string): Promise<void> {
    console.log(`Generating configuration template: ${outputPath}`)
    
    await generateConfigTemplate(outputPath, true)
    
    console.log('✅ Configuration template generated!')
    console.log('Next steps:')
    console.log('1. Edit the generated file with your information')
    console.log('2. Copy config/.env.example to .env.local')
    console.log('3. Set your environment variables')
    console.log('4. Run npm run config:validate to check your configuration')
  },
  
  async preview(configSources?: string[]): Promise<void> {
    console.log('Previewing configuration with resolved template variables...')
    
    const sources: ConfigSource[] = configSources?.map(path => ({
      type: 'file' as const,
      path,
      priority: 10,
    })) || []
    
    const result = await previewConfiguration(sources.length > 0 ? sources : undefined)
    
    console.log('\n📝 Template Variables Found:')
    result.templateVariables.forEach(variable => console.log(`  - ${variable}`))
    
    console.log('\n🔍 Processed Configuration Preview:')
    console.log(JSON.stringify(result.processedConfig, null, 2))
  },
}