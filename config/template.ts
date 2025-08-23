/**
 * Template Variable Replacement System
 * Handles dynamic variable replacement in configuration strings
 */

import { ArchitectResumeConfig } from './schema'
import { getRuntimeEnvironment } from './environment'

export interface TemplateContext {
  config: ArchitectResumeConfig
  env: Record<string, string | undefined>
  runtime: ReturnType<typeof getRuntimeEnvironment>
  custom?: Record<string, any>
}

/**
 * Template variable patterns
 */
const TEMPLATE_PATTERNS = {
  // {{variable}} - basic replacement
  BASIC: /\{\{\s*([^}]+)\s*\}\}/g,
  
  // ${variable} - shell-style replacement
  SHELL: /\$\{([^}]+)\}/g,
  
  // %variable% - Windows-style replacement
  WINDOWS: /%([^%]+)%/g,
  
  // [[variable]] - custom bracket style
  BRACKETS: /\[\[\s*([^]]+)\s*\]\]/g,
}

/**
 * Built-in template functions
 */
const TEMPLATE_FUNCTIONS = {
  uppercase: (value: string) => value.toUpperCase(),
  lowercase: (value: string) => value.toLowerCase(),
  capitalize: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
  camelCase: (value: string) => 
    value.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : ''),
  kebabCase: (value: string) => 
    value.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, ''),
  snakeCase: (value: string) => 
    value.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, ''),
  slugify: (value: string) =>
    value.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, ''),
  truncate: (value: string, length: number = 50) =>
    value.length > length ? value.substring(0, length) + '...' : value,
  date: (format?: string) => {
    const now = new Date()
    if (format === 'iso') return now.toISOString()
    if (format === 'short') return now.toLocaleDateString()
    if (format === 'long') return now.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    })
    return now.toString()
  },
  year: () => new Date().getFullYear().toString(),
  uuid: () => crypto.randomUUID?.() || Math.random().toString(36),
  random: (min: number = 0, max: number = 100) =>
    Math.floor(Math.random() * (max - min + 1)) + min,
}

/**
 * Get nested object property by dot notation path
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    const arrayMatch = key.match(/^([^[]+)\[(\d+)\]$/)
    if (arrayMatch) {
      const [, arrayKey, index] = arrayMatch
      return current?.[arrayKey]?.[parseInt(index)]
    }
    return current?.[key]
  }, obj)
}

/**
 * Parse template variable with optional function calls
 * Supports: variable, variable.property, variable|function, variable.property|function:arg
 */
function parseTemplateVariable(
  variable: string,
  context: TemplateContext
): string {
  const [path, ...functions] = variable.trim().split('|')
  
  // Get base value
  let value: any
  
  // Check different contexts for the variable
  if (path.startsWith('env.')) {
    value = context.env[path.substring(4)]
  } else if (path.startsWith('runtime.')) {
    value = getNestedValue(context.runtime, path.substring(8))
  } else if (path.startsWith('custom.')) {
    value = getNestedValue(context.custom, path.substring(7))
  } else {
    // Try config first, then custom, then env
    value = getNestedValue(context.config, path) ??
            getNestedValue(context.custom, path) ??
            context.env[path]
  }
  
  // Convert to string
  let result = value !== undefined && value !== null ? String(value) : ''
  
  // Apply functions
  for (const func of functions) {
    const [funcName, ...args] = func.split(':')
    const templateFunc = TEMPLATE_FUNCTIONS[funcName as keyof typeof TEMPLATE_FUNCTIONS]
    
    if (templateFunc) {
      if (args.length > 0) {
        // Pass additional arguments to function
        result = templateFunc(result, ...args.map(arg => {
          // Try to parse numeric arguments
          const num = Number(arg)
          return isNaN(num) ? arg : num
        }))
      } else {
        result = templateFunc(result)
      }
    }
  }
  
  return result
}

/**
 * Replace template variables in a string
 */
export function replaceTemplateVariables(
  template: string,
  context: TemplateContext,
  pattern: keyof typeof TEMPLATE_PATTERNS = 'BASIC'
): string {
  const regex = TEMPLATE_PATTERNS[pattern]
  
  return template.replace(regex, (match, variable) => {
    try {
      const result = parseTemplateVariable(variable, context)
      return result
    } catch (error) {
      console.warn(`Template variable replacement failed for "${variable}":`, error)
      return match // Return original if replacement fails
    }
  })
}

/**
 * Replace template variables in an object recursively
 */
export function replaceTemplateVariablesInObject<T>(
  obj: T,
  context: TemplateContext,
  pattern: keyof typeof TEMPLATE_PATTERNS = 'BASIC'
): T {
  if (typeof obj === 'string') {
    return replaceTemplateVariables(obj, context, pattern) as unknown as T
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => 
      replaceTemplateVariablesInObject(item, context, pattern)
    ) as unknown as T
  }
  
  if (obj && typeof obj === 'object') {
    const result = {} as T
    for (const [key, value] of Object.entries(obj)) {
      result[key as keyof T] = replaceTemplateVariablesInObject(value, context, pattern)
    }
    return result
  }
  
  return obj
}

/**
 * Create template context from configuration and environment
 */
export function createTemplateContext(
  config: ArchitectResumeConfig,
  customVars: Record<string, any> = {}
): TemplateContext {
  return {
    config,
    env: process.env,
    runtime: getRuntimeEnvironment(),
    custom: {
      currentYear: new Date().getFullYear(),
      buildTime: new Date().toISOString(),
      timestamp: Date.now(),
      ...customVars,
    },
  }
}

/**
 * Process configuration with template replacement
 */
export function processConfigurationTemplates(
  config: ArchitectResumeConfig,
  customVars: Record<string, any> = {},
  pattern: keyof typeof TEMPLATE_PATTERNS = 'BASIC'
): ArchitectResumeConfig {
  const context = createTemplateContext(config, customVars)
  return replaceTemplateVariablesInObject(config, context, pattern)
}

/**
 * Validate template string for syntax errors
 */
export function validateTemplateString(
  template: string,
  pattern: keyof typeof TEMPLATE_PATTERNS = 'BASIC'
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const regex = TEMPLATE_PATTERNS[pattern]
  
  let match
  while ((match = regex.exec(template)) !== null) {
    const variable = match[1].trim()
    
    if (!variable) {
      errors.push(`Empty template variable at position ${match.index}`)
      continue
    }
    
    // Check for invalid characters
    if (variable.includes('{{') || variable.includes('}}')) {
      errors.push(`Nested template variables not allowed: ${variable}`)
    }
    
    // Validate function calls
    const [, ...functions] = variable.split('|')
    for (const func of functions) {
      const [funcName] = func.split(':')
      if (!(funcName in TEMPLATE_FUNCTIONS)) {
        errors.push(`Unknown template function: ${funcName}`)
      }
    }
  }
  
  // Reset regex
  regex.lastIndex = 0
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Extract template variables from a string
 */
export function extractTemplateVariables(
  template: string,
  pattern: keyof typeof TEMPLATE_PATTERNS = 'BASIC'
): string[] {
  const variables: string[] = []
  const regex = TEMPLATE_PATTERNS[pattern]
  
  let match
  while ((match = regex.exec(template)) !== null) {
    variables.push(match[1].trim())
  }
  
  // Reset regex
  regex.lastIndex = 0
  
  return [...new Set(variables)] // Remove duplicates
}

/**
 * Preview template with sample data
 */
export function previewTemplate(
  template: string,
  sampleConfig: Partial<ArchitectResumeConfig>,
  customVars: Record<string, any> = {},
  pattern: keyof typeof TEMPLATE_PATTERNS = 'BASIC'
): string {
  // Create a mock context with sample data
  const mockContext: TemplateContext = {
    config: {
      personal: { name: 'John Doe', title: 'Architect', email: 'john@example.com' },
      ...sampleConfig,
    } as ArchitectResumeConfig,
    env: {
      NODE_ENV: 'development',
      SITE_URL: 'https://example.com',
      ...process.env,
    },
    runtime: {
      isClient: false,
      isServer: true,
      isDevelopment: true,
      isStaging: false,
      isProduction: false,
      buildTime: new Date().toISOString(),
      version: '1.0.0',
    },
    custom: {
      currentYear: new Date().getFullYear(),
      buildTime: new Date().toISOString(),
      ...customVars,
    },
  }
  
  return replaceTemplateVariables(template, mockContext, pattern)
}

/**
 * Template processing utilities for common use cases
 */
export const TemplateUtils = {
  /**
   * Process SEO meta tags with template variables
   */
  processSEOMeta(seo: any, context: TemplateContext) {
    return {
      ...seo,
      title: replaceTemplateVariables(seo.title || '', context),
      description: replaceTemplateVariables(seo.description || '', context),
      keywords: seo.keywords?.map((keyword: string) => 
        replaceTemplateVariables(keyword, context)
      ),
    }
  },
  
  /**
   * Process email templates
   */
  processEmailTemplate(template: string, context: TemplateContext & { 
    form?: Record<string, any> 
  }) {
    const emailContext = {
      ...context,
      custom: {
        ...context.custom,
        form: context.form || {},
      },
    }
    return replaceTemplateVariables(template, emailContext)
  },
  
  /**
   * Process chatbot responses
   */
  processChatbotResponses(
    responses: Record<string, string[]>,
    context: TemplateContext
  ) {
    const processed: Record<string, string[]> = {}
    for (const [key, responseList] of Object.entries(responses)) {
      processed[key] = responseList.map(response =>
        replaceTemplateVariables(response, context)
      )
    }
    return processed
  },
}