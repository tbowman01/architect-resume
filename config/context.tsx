/**
 * Configuration Context and Provider
 * React context for configuration management
 */

'use client'

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useMemo,
  ReactNode,
  useCallback,
} from 'react'
import { ArchitectResumeConfig } from './schema'
import { 
  ConfigurationManager, 
  getConfigManager, 
  ConfigChange,
  ConfigManagerOptions 
} from './manager'

export interface ConfigContextValue {
  config: ArchitectResumeConfig | null
  isLoading: boolean
  isLoaded: boolean
  error: string | null
  warnings: string[]
  loadTime: Date | null
  
  // Configuration methods
  get: <T = any>(path: string, defaultValue?: T) => T
  set: (path: string, value: any) => Promise<void>
  update: (updates: Partial<ArchitectResumeConfig>) => Promise<void>
  reload: () => Promise<void>
  
  // Feature flags and utilities
  isFeatureEnabled: (feature: keyof ArchitectResumeConfig['features']) => boolean
  getTheme: () => ArchitectResumeConfig['theme'] | null
  getSEO: () => ArchitectResumeConfig['seo'] | null
  getPersonal: () => ArchitectResumeConfig['personal'] | null
  
  // Change management
  onChange: (callback: (config: ArchitectResumeConfig) => void) => () => void
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export interface ConfigProviderProps {
  children: ReactNode
  options?: ConfigManagerOptions
  initialConfig?: Partial<ArchitectResumeConfig>
  onConfigChange?: (config: ArchitectResumeConfig, changes: ConfigChange[]) => void
  onError?: (error: string) => void
  fallbackConfig?: Partial<ArchitectResumeConfig>
}

/**
 * Configuration Provider Component
 */
export function ConfigProvider({
  children,
  options,
  initialConfig,
  onConfigChange,
  onError,
  fallbackConfig,
}: ConfigProviderProps) {
  const [config, setConfig] = useState<ArchitectResumeConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [loadTime, setLoadTime] = useState<Date | null>(null)
  const [changeListeners] = useState<Set<(config: ArchitectResumeConfig) => void>>(new Set())
  
  // Initialize configuration manager
  const configManager = useMemo(() => {
    return getConfigManager({
      enableCache: true,
      enableTemplates: true,
      enableValidation: false, // Skip validation in client for performance
      hotReload: process.env.NODE_ENV === 'development',
      ...options,
    })
  }, [options])
  
  // Initialize configuration
  useEffect(() => {
    let isMounted = true
    
    async function initializeConfig() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Apply initial config if provided
        if (initialConfig) {
          await configManager.updateConfig(initialConfig, { validate: false })
        }
        
        // Load configuration
        let loadedConfig
        if (configManager.isLoaded) {
          loadedConfig = configManager.loadedConfig
        } else {
          loadedConfig = await configManager.initialize()
        }
        
        if (isMounted) {
          setConfig(loadedConfig.config)
          setWarnings(loadedConfig.warnings)
          setLoadTime(loadedConfig.loadTime)
          setIsLoading(false)
          
          if (!loadedConfig.isValid && loadedConfig.errors.length > 0) {
            const errorMessage = `Configuration errors: ${loadedConfig.errors.join(', ')}`
            setError(errorMessage)
            onError?.(errorMessage)
          }
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load configuration'
          setError(errorMessage)
          setIsLoading(false)
          onError?.(errorMessage)
          
          // Use fallback config if available
          if (fallbackConfig) {
            setConfig(fallbackConfig as ArchitectResumeConfig)
          }
        }
      }
    }
    
    initializeConfig()
    
    return () => {
      isMounted = false
    }
  }, [configManager, initialConfig, onError, fallbackConfig])
  
  // Setup change listener
  useEffect(() => {
    const unsubscribe = configManager.onChange((newConfig, oldConfig, changes) => {
      setConfig(newConfig)
      setLoadTime(new Date())
      
      // Notify external listener
      onConfigChange?.(newConfig, changes)
      
      // Notify internal listeners
      changeListeners.forEach(listener => {
        try {
          listener(newConfig)
        } catch (err) {
          console.error('Error in config change listener:', err)
        }
      })
    })
    
    return unsubscribe
  }, [configManager, onConfigChange, changeListeners])
  
  // Configuration methods
  const get = useCallback(<T = any>(path: string, defaultValue?: T): T => {
    if (!configManager.isLoaded) return defaultValue as T
    return configManager.get(path, defaultValue)
  }, [configManager])
  
  const set = useCallback(async (path: string, value: any): Promise<void> => {
    try {
      await configManager.set(path, value, { validate: false })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set configuration'
      setError(errorMessage)
      onError?.(errorMessage)
      throw err
    }
  }, [configManager, onError])
  
  const update = useCallback(async (updates: Partial<ArchitectResumeConfig>): Promise<void> => {
    try {
      await configManager.updateConfig(updates, { validate: false })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update configuration'
      setError(errorMessage)
      onError?.(errorMessage)
      throw err
    }
  }, [configManager, onError])
  
  const reload = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const loadedConfig = await configManager.reload()
      setConfig(loadedConfig.config)
      setWarnings(loadedConfig.warnings)
      setLoadTime(loadedConfig.loadTime)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reload configuration'
      setError(errorMessage)
      setIsLoading(false)
      onError?.(errorMessage)
    }
  }, [configManager, onError])
  
  // Feature flag helper
  const isFeatureEnabled = useCallback((feature: keyof ArchitectResumeConfig['features']): boolean => {
    return config?.features?.[feature] ?? false
  }, [config])
  
  // Theme helper
  const getTheme = useCallback((): ArchitectResumeConfig['theme'] | null => {
    return config?.theme || null
  }, [config])
  
  // SEO helper
  const getSEO = useCallback((): ArchitectResumeConfig['seo'] | null => {
    return config?.seo || null
  }, [config])
  
  // Personal info helper
  const getPersonal = useCallback((): ArchitectResumeConfig['personal'] | null => {
    return config?.personal || null
  }, [config])
  
  // Change listener management
  const onChange = useCallback((callback: (config: ArchitectResumeConfig) => void): () => void => {
    changeListeners.add(callback)
    
    return () => {
      changeListeners.delete(callback)
    }
  }, [changeListeners])
  
  const contextValue: ConfigContextValue = useMemo(() => ({
    config,
    isLoading,
    isLoaded: config !== null && !isLoading,
    error,
    warnings,
    loadTime,
    
    // Methods
    get,
    set,
    update,
    reload,
    
    // Helpers
    isFeatureEnabled,
    getTheme,
    getSEO,
    getPersonal,
    
    // Change management
    onChange,
  }), [
    config,
    isLoading,
    error,
    warnings,
    loadTime,
    get,
    set,
    update,
    reload,
    isFeatureEnabled,
    getTheme,
    getSEO,
    getPersonal,
    onChange,
  ])
  
  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  )
}

/**
 * Hook to use configuration context
 */
export function useConfig(): ConfigContextValue {
  const context = useContext(ConfigContext)
  
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  
  return context
}

/**
 * Hook to use a specific configuration value
 */
export function useConfigValue<T = any>(
  path: string,
  defaultValue?: T
): [T, (value: T) => Promise<void>] {
  const { get, set } = useConfig()
  
  const value = useMemo(() => get<T>(path, defaultValue), [get, path, defaultValue])
  
  const setValue = useCallback(async (newValue: T) => {
    await set(path, newValue)
  }, [set, path])
  
  return [value, setValue]
}

/**
 * Hook to use feature flags
 */
export function useFeatureFlag(feature: keyof ArchitectResumeConfig['features']): boolean {
  const { isFeatureEnabled } = useConfig()
  return useMemo(() => isFeatureEnabled(feature), [isFeatureEnabled, feature])
}

/**
 * Hook to use theme configuration
 */
export function useTheme(): ArchitectResumeConfig['theme'] | null {
  const { getTheme } = useConfig()
  return useMemo(() => getTheme(), [getTheme])
}

/**
 * Hook to use SEO configuration
 */
export function useSEO(): ArchitectResumeConfig['seo'] | null {
  const { getSEO } = useConfig()
  return useMemo(() => getSEO(), [getSEO])
}

/**
 * Hook to use personal information
 */
export function usePersonal(): ArchitectResumeConfig['personal'] | null {
  const { getPersonal } = useConfig()
  return useMemo(() => getPersonal(), [getPersonal])
}

/**
 * Hook to listen for configuration changes
 */
export function useConfigChanges(
  callback: (config: ArchitectResumeConfig) => void
): void {
  const { onChange } = useConfig()
  
  useEffect(() => {
    return onChange(callback)
  }, [onChange, callback])
}

/**
 * Higher-order component to provide configuration
 */
export function withConfig<P extends object>(
  WrappedComponent: React.ComponentType<P & { config: ArchitectResumeConfig }>
) {
  return function ConfiguredComponent(props: P) {
    const { config } = useConfig()
    
    if (!config) {
      return null // or a loading component
    }
    
    return <WrappedComponent {...props} config={config} />
  }
}

/**
 * Configuration loading component
 */
export interface ConfigLoaderProps {
  loading?: ReactNode
  error?: (error: string) => ReactNode
  children: ReactNode
}

export function ConfigLoader({ loading, error, children }: ConfigLoaderProps) {
  const { isLoading, error: configError, isLoaded } = useConfig()
  
  if (isLoading) {
    return <>{loading || <div>Loading configuration...</div>}</>
  }
  
  if (configError) {
    return <>{error?.(configError) || <div>Configuration error: {configError}</div>}</>
  }
  
  if (!isLoaded) {
    return <>{loading || <div>Loading configuration...</div>}</>
  }
  
  return <>{children}</>
}