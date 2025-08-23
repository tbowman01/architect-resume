/**
 * Configuration System Entry Point
 * Main exports for the architect-resume configuration system
 */

// Core exports
export * from './types'
export * from './schema'
export * from './environment'
export * from './template'
export * from './loader'
export * from './manager'

// React exports
export * from './context'
export * from './hooks'

// Convenience exports
export { 
  getConfigManager, 
  initializeConfig, 
  getConfig,
  ConfigUtils 
} from './manager'

export {
  useConfig,
  useConfigValue,
  useFeatureFlag,
  useTheme,
  useSEO,
  usePersonal,
  ConfigProvider,
  ConfigLoader
} from './context'

export {
  usePortfolio,
  useExperience,
  useEducation,
  useSkills,
  useBlog,
  useContact,
  useChatbot,
  useAnalytics,
  useThemeCustomization
} from './hooks'

// Default configuration loader for Next.js
export async function loadDefaultConfig() {
  const { ConfigPresets } = await import('./loader')
  const { getRuntimeEnvironment } = await import('./environment')
  
  const runtime = getRuntimeEnvironment()
  
  if (runtime.isProduction) {
    return ConfigPresets.production()
  } else if (runtime.isDevelopment) {
    return ConfigPresets.development()
  } else {
    return ConfigPresets.test()
  }
}