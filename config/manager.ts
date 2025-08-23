/**
 * Configuration Manager
 * Handles build-time and runtime configuration merging and management
 */

import { ArchitectResumeConfig } from './schema'
import { loadConfiguration, ConfigPresets, ConfigSource, LoadedConfig } from './loader'
import { getRuntimeEnvironment, getEnvironmentDefaults } from './environment'
import { createTemplateContext, processConfigurationTemplates } from './template'

export interface ConfigManagerOptions {
  sources?: ConfigSource[]
  enableCache?: boolean
  enableTemplates?: boolean
  enableValidation?: boolean
  customVariables?: Record<string, any>
  hotReload?: boolean
}

export interface ConfigUpdateOptions {
  merge?: boolean
  processTemplates?: boolean
  validate?: boolean
  notify?: boolean
}

export type ConfigChangeListener = (
  newConfig: ArchitectResumeConfig,
  oldConfig: ArchitectResumeConfig,
  changes: ConfigChange[]
) => void

export interface ConfigChange {
  path: string[]
  oldValue: any
  newValue: any
  type: 'added' | 'modified' | 'removed'
}

/**
 * Configuration Manager Class
 */
export class ConfigurationManager {
  private _config: ArchitectResumeConfig | null = null
  private _loadedConfig: LoadedConfig | null = null
  private _listeners: ConfigChangeListener[] = []
  private _watchCleanup: (() => void) | null = null
  private _options: Required<ConfigManagerOptions>
  
  constructor(options: ConfigManagerOptions = {}) {
    this._options = {
      sources: options.sources || [],
      enableCache: options.enableCache ?? true,
      enableTemplates: options.enableTemplates ?? true,
      enableValidation: options.enableValidation ?? true,
      customVariables: options.customVariables || {},
      hotReload: options.hotReload ?? false,
    }
  }
  
  /**
   * Initialize the configuration manager
   */
  async initialize(): Promise<LoadedConfig> {
    const runtime = getRuntimeEnvironment()
    
    // Choose appropriate preset based on environment
    let loadedConfig: LoadedConfig
    
    if (this._options.sources.length > 0) {
      // Use custom sources
      loadedConfig = await loadConfiguration(this._options.sources, {
        processTemplates: this._options.enableTemplates,
        customVars: {
          ...this._options.customVariables,
          runtime,
        },
        validateSchema: this._options.enableValidation,
      })
    } else {
      // Use environment-specific presets
      if (runtime.isProduction) {
        loadedConfig = await ConfigPresets.production()
      } else if (runtime.isDevelopment) {
        loadedConfig = await ConfigPresets.development()
      } else {
        loadedConfig = await ConfigPresets.test()
      }
    }
    
    // Apply environment-specific defaults
    const envDefaults = getEnvironmentDefaults()
    loadedConfig.config = this.mergeConfigs(envDefaults, loadedConfig.config)
    
    this._loadedConfig = loadedConfig
    this._config = loadedConfig.config
    
    // Setup hot reload if enabled and in development
    if (this._options.hotReload && runtime.isDevelopment) {
      this.enableHotReload()
    }
    
    return loadedConfig
  }
  
  /**
   * Get current configuration
   */
  get config(): ArchitectResumeConfig {
    if (!this._config) {
      throw new Error('Configuration not initialized. Call initialize() first.')
    }
    return this._config
  }
  
  /**
   * Get loaded configuration metadata
   */
  get loadedConfig(): LoadedConfig {
    if (!this._loadedConfig) {
      throw new Error('Configuration not initialized. Call initialize() first.')
    }
    return this._loadedConfig
  }
  
  /**
   * Check if configuration is loaded
   */
  get isLoaded(): boolean {
    return this._config !== null
  }
  
  /**
   * Get configuration value by path
   */
  get<T = any>(path: string, defaultValue?: T): T {
    const keys = path.split('.')
    let current: any = this.config
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return defaultValue as T
      }
    }
    
    return current as T
  }
  
  /**
   * Set configuration value by path
   */
  async set(
    path: string,
    value: any,
    options: ConfigUpdateOptions = {}
  ): Promise<void> {
    if (!this._config) {
      throw new Error('Configuration not initialized')
    }
    
    const {
      merge = false,
      processTemplates = this._options.enableTemplates,
      validate = this._options.enableValidation,
      notify = true,
    } = options
    
    const oldConfig = JSON.parse(JSON.stringify(this._config))
    const keys = path.split('.')
    let current: any = this._config
    
    // Navigate to the parent of the target key
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!(key in current)) {
        current[key] = {}
      }
      current = current[key]
    }
    
    // Set the value
    const finalKey = keys[keys.length - 1]
    if (merge && typeof current[finalKey] === 'object' && typeof value === 'object') {
      current[finalKey] = this.mergeConfigs(current[finalKey], value)
    } else {
      current[finalKey] = value
    }
    
    // Process templates if enabled
    if (processTemplates) {
      const context = createTemplateContext(this._config, this._options.customVariables)
      this._config = processConfigurationTemplates(this._config, context.custom)
    }
    
    // Validate if enabled
    if (validate) {
      const { validateConfig } = await import('./schema')
      const validation = validateConfig(this._config)
      if (!validation.success) {
        // Revert changes on validation failure
        this._config = oldConfig
        throw new Error(`Configuration validation failed: ${validation.error?.issues[0]?.message}`)
      }
      this._config = validation.data!
    }
    
    // Notify listeners
    if (notify) {
      const changes = this.detectChanges(oldConfig, this._config)
      this.notifyListeners(this._config, oldConfig, changes)
    }
  }
  
  /**
   * Update entire configuration
   */
  async updateConfig(
    newConfig: Partial<ArchitectResumeConfig>,
    options: ConfigUpdateOptions = {}
  ): Promise<void> {
    if (!this._config) {
      throw new Error('Configuration not initialized')
    }
    
    const {
      merge = true,
      processTemplates = this._options.enableTemplates,
      validate = this._options.enableValidation,
      notify = true,
    } = options
    
    const oldConfig = JSON.parse(JSON.stringify(this._config))
    
    // Update configuration
    if (merge) {
      this._config = this.mergeConfigs(this._config, newConfig)
    } else {
      this._config = { ...this._config, ...newConfig }
    }
    
    // Process templates if enabled
    if (processTemplates) {
      const context = createTemplateContext(this._config, this._options.customVariables)
      this._config = processConfigurationTemplates(this._config, context.custom)
    }
    
    // Validate if enabled
    if (validate) {
      const { validateConfig } = await import('./schema')
      const validation = validateConfig(this._config)
      if (!validation.success) {
        // Revert changes on validation failure
        this._config = oldConfig
        throw new Error(`Configuration validation failed: ${validation.error?.issues[0]?.message}`)
      }
      this._config = validation.data!
    }
    
    // Notify listeners
    if (notify) {
      const changes = this.detectChanges(oldConfig, this._config)
      this.notifyListeners(this._config, oldConfig, changes)
    }
  }
  
  /**
   * Reload configuration from sources
   */
  async reload(): Promise<LoadedConfig> {
    const loadedConfig = await this.initialize()
    
    if (this._config) {
      const oldConfig = JSON.parse(JSON.stringify(this._config))
      const changes = this.detectChanges(oldConfig, this._config)
      this.notifyListeners(this._config, oldConfig, changes)
    }
    
    return loadedConfig
  }
  
  /**
   * Add configuration change listener
   */
  onChange(listener: ConfigChangeListener): () => void {
    this._listeners.push(listener)
    
    // Return unsubscribe function
    return () => {
      const index = this._listeners.indexOf(listener)
      if (index > -1) {
        this._listeners.splice(index, 1)
      }
    }
  }
  
  /**
   * Enable hot reload for development
   */
  private enableHotReload(): void {
    if (this._watchCleanup) {
      this._watchCleanup()
    }
    
    const { watchConfiguration } = require('./loader')
    
    this._watchCleanup = watchConfiguration(
      this._options.sources,
      async (newLoadedConfig: LoadedConfig) => {
        const oldConfig = this._config ? JSON.parse(JSON.stringify(this._config)) : null
        
        this._loadedConfig = newLoadedConfig
        this._config = newLoadedConfig.config
        
        if (oldConfig) {
          const changes = this.detectChanges(oldConfig, this._config)
          this.notifyListeners(this._config, oldConfig, changes)
        }
      }
    )
  }
  
  /**
   * Disable hot reload
   */
  disableHotReload(): void {
    if (this._watchCleanup) {
      this._watchCleanup()
      this._watchCleanup = null
    }
  }
  
  /**
   * Merge configuration objects deeply
   */
  private mergeConfigs(...configs: any[]): any {
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
   * Detect changes between old and new configuration
   */
  private detectChanges(
    oldConfig: ArchitectResumeConfig,
    newConfig: ArchitectResumeConfig,
    path: string[] = []
  ): ConfigChange[] {
    const changes: ConfigChange[] = []
    
    // Check for modified/removed properties in old config
    for (const key in oldConfig) {
      const oldValue = (oldConfig as any)[key]
      const newValue = (newConfig as any)[key]
      const currentPath = [...path, key]
      
      if (!(key in newConfig)) {
        // Property was removed
        changes.push({
          path: currentPath,
          oldValue,
          newValue: undefined,
          type: 'removed',
        })
      } else if (typeof oldValue === 'object' && typeof newValue === 'object' && 
                 oldValue !== null && newValue !== null && 
                 !Array.isArray(oldValue) && !Array.isArray(newValue)) {
        // Recursively check nested objects
        changes.push(...this.detectChanges(oldValue, newValue, currentPath))
      } else if (oldValue !== newValue) {
        // Property was modified
        changes.push({
          path: currentPath,
          oldValue,
          newValue,
          type: 'modified',
        })
      }
    }
    
    // Check for added properties in new config
    for (const key in newConfig) {
      if (!(key in oldConfig)) {
        const currentPath = [...path, key]
        changes.push({
          path: currentPath,
          oldValue: undefined,
          newValue: (newConfig as any)[key],
          type: 'added',
        })
      }
    }
    
    return changes
  }
  
  /**
   * Notify all listeners of configuration changes
   */
  private notifyListeners(
    newConfig: ArchitectResumeConfig,
    oldConfig: ArchitectResumeConfig,
    changes: ConfigChange[]
  ): void {
    if (changes.length === 0) return
    
    for (const listener of this._listeners) {
      try {
        listener(newConfig, oldConfig, changes)
      } catch (error) {
        console.error('Error in configuration change listener:', error)
      }
    }
  }
  
  /**
   * Export configuration for serialization
   */
  export(): {
    config: ArchitectResumeConfig
    metadata: {
      loadTime: Date
      sources: ConfigSource[]
      isValid: boolean
      errors: string[]
      warnings: string[]
    }
  } {
    if (!this._loadedConfig) {
      throw new Error('Configuration not initialized')
    }
    
    return {
      config: JSON.parse(JSON.stringify(this._config)),
      metadata: {
        loadTime: this._loadedConfig.loadTime,
        sources: this._loadedConfig.sources,
        isValid: this._loadedConfig.isValid,
        errors: this._loadedConfig.errors,
        warnings: this._loadedConfig.warnings,
      },
    }
  }
  
  /**
   * Cleanup resources
   */
  destroy(): void {
    this.disableHotReload()
    this._listeners = []
    this._config = null
    this._loadedConfig = null
  }
}

/**
 * Global configuration manager instance
 */
let globalConfigManager: ConfigurationManager | null = null

/**
 * Get or create global configuration manager
 */
export function getConfigManager(options?: ConfigManagerOptions): ConfigurationManager {
  if (!globalConfigManager) {
    globalConfigManager = new ConfigurationManager(options)
  }
  return globalConfigManager
}

/**
 * Initialize global configuration manager
 */
export async function initializeConfig(options?: ConfigManagerOptions): Promise<LoadedConfig> {
  const manager = getConfigManager(options)
  return await manager.initialize()
}

/**
 * Get configuration from global manager
 */
export function getConfig(): ArchitectResumeConfig {
  const manager = getConfigManager()
  return manager.config
}

/**
 * Utility functions for build-time vs runtime configuration
 */
export const ConfigUtils = {
  /**
   * Get build-time configuration
   * This runs during the Next.js build process
   */
  async getBuildTimeConfig(options?: ConfigManagerOptions): Promise<ArchitectResumeConfig> {
    const manager = new ConfigurationManager({
      enableCache: false, // Don't cache during build
      enableTemplates: true,
      enableValidation: true,
      ...options,
    })
    
    const loaded = await manager.initialize()
    return loaded.config
  },
  
  /**
   * Get runtime configuration
   * This runs in the browser or server during runtime
   */
  async getRuntimeConfig(options?: ConfigManagerOptions): Promise<ArchitectResumeConfig> {
    const manager = getConfigManager({
      enableCache: true, // Cache in runtime
      enableTemplates: true,
      enableValidation: false, // Skip validation in runtime for performance
      hotReload: process.env.NODE_ENV === 'development',
      ...options,
    })
    
    if (!manager.isLoaded) {
      await manager.initialize()
    }
    
    return manager.config
  },
  
  /**
   * Create configuration for specific environment
   */
  async getEnvironmentConfig(
    environment: 'development' | 'staging' | 'production',
    options?: ConfigManagerOptions
  ): Promise<ArchitectResumeConfig> {
    const sources: ConfigSource[] = [
      { type: 'default', priority: 0 },
      { type: 'file', path: 'config/architect-resume.json', priority: 10 },
      { type: 'file', path: `config/architect-resume.${environment}.json`, priority: 20 },
      { type: 'env', priority: 30 },
    ]
    
    const manager = new ConfigurationManager({
      sources,
      enableCache: environment === 'production',
      enableTemplates: true,
      enableValidation: true,
      customVariables: { environment },
      ...options,
    })
    
    const loaded = await manager.initialize()
    return loaded.config
  },
}