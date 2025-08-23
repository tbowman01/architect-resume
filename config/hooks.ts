/**
 * Configuration Hooks and Utilities
 * Additional React hooks and utility functions for configuration management
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useConfig } from './context'
import { ArchitectResumeConfig } from './schema'
import type { 
  PortfolioProject, 
  Experience, 
  Education, 
  Skill,
  BlogConfig 
} from './schema'

/**
 * Hook for portfolio configuration and data
 */
export function usePortfolio() {
  const { config, get, set } = useConfig()
  
  const portfolioConfig = useMemo(() => config?.portfolio, [config])
  const projects = useMemo(() => portfolioConfig?.projects || [], [portfolioConfig])
  
  const featuredProjects = useMemo(() => 
    projects.filter(project => project.featured),
    [projects]
  )
  
  const projectsByCategory = useMemo(() => {
    const grouped: Record<string, PortfolioProject[]> = {}
    projects.forEach(project => {
      if (!grouped[project.category]) {
        grouped[project.category] = []
      }
      grouped[project.category].push(project)
    })
    return grouped
  }, [projects])
  
  const categories = useMemo(() => 
    [...new Set(projects.map(p => p.category))].sort(),
    [projects]
  )
  
  const addProject = useCallback(async (project: PortfolioProject) => {
    const currentProjects = get<PortfolioProject[]>('portfolio.projects', [])
    await set('portfolio.projects', [...currentProjects, project])
  }, [get, set])
  
  const updateProject = useCallback(async (projectId: string, updates: Partial<PortfolioProject>) => {
    const currentProjects = get<PortfolioProject[]>('portfolio.projects', [])
    const updatedProjects = currentProjects.map(p => 
      p.id === projectId ? { ...p, ...updates } : p
    )
    await set('portfolio.projects', updatedProjects)
  }, [get, set])
  
  const removeProject = useCallback(async (projectId: string) => {
    const currentProjects = get<PortfolioProject[]>('portfolio.projects', [])
    const filteredProjects = currentProjects.filter(p => p.id !== projectId)
    await set('portfolio.projects', filteredProjects)
  }, [get, set])
  
  return {
    config: portfolioConfig,
    projects,
    featuredProjects,
    projectsByCategory,
    categories,
    addProject,
    updateProject,
    removeProject,
  }
}

/**
 * Hook for experience configuration and data
 */
export function useExperience() {
  const { config, get, set } = useConfig()
  
  const experienceConfig = useMemo(() => config?.experience, [config])
  const experiences = useMemo(() => experienceConfig?.items || [], [experienceConfig])
  
  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      // Current positions first
      if (a.current && !b.current) return -1
      if (!a.current && b.current) return 1
      
      // Then by start date (newest first)
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  }, [experiences])
  
  const currentExperiences = useMemo(() => 
    experiences.filter(exp => exp.current),
    [experiences]
  )
  
  const addExperience = useCallback(async (experience: Experience) => {
    const currentExperiences = get<Experience[]>('experience.items', [])
    await set('experience.items', [...currentExperiences, experience])
  }, [get, set])
  
  const updateExperience = useCallback(async (experienceId: string, updates: Partial<Experience>) => {
    const currentExperiences = get<Experience[]>('experience.items', [])
    const updatedExperiences = currentExperiences.map(exp => 
      exp.id === experienceId ? { ...exp, ...updates } : exp
    )
    await set('experience.items', updatedExperiences)
  }, [get, set])
  
  const removeExperience = useCallback(async (experienceId: string) => {
    const currentExperiences = get<Experience[]>('experience.items', [])
    const filteredExperiences = currentExperiences.filter(exp => exp.id !== experienceId)
    await set('experience.items', filteredExperiences)
  }, [get, set])
  
  return {
    config: experienceConfig,
    experiences,
    sortedExperiences,
    currentExperiences,
    addExperience,
    updateExperience,
    removeExperience,
  }
}

/**
 * Hook for education configuration and data
 */
export function useEducation() {
  const { config, get, set } = useConfig()
  
  const educationConfig = useMemo(() => config?.education, [config])
  const educations = useMemo(() => educationConfig?.items || [], [educationConfig])
  
  const sortedEducations = useMemo(() => {
    return [...educations].sort((a, b) => {
      // Current programs first
      if (a.current && !b.current) return -1
      if (!a.current && b.current) return 1
      
      // Then by start date (newest first)
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  }, [educations])
  
  const currentEducations = useMemo(() => 
    educations.filter(edu => edu.current),
    [educations]
  )
  
  const addEducation = useCallback(async (education: Education) => {
    const currentEducations = get<Education[]>('education.items', [])
    await set('education.items', [...currentEducations, education])
  }, [get, set])
  
  const updateEducation = useCallback(async (educationId: string, updates: Partial<Education>) => {
    const currentEducations = get<Education[]>('education.items', [])
    const updatedEducations = currentEducations.map(edu => 
      edu.id === educationId ? { ...edu, ...updates } : edu
    )
    await set('education.items', updatedEducations)
  }, [get, set])
  
  const removeEducation = useCallback(async (educationId: string) => {
    const currentEducations = get<Education[]>('education.items', [])
    const filteredEducations = currentEducations.filter(edu => edu.id !== educationId)
    await set('education.items', filteredEducations)
  }, [get, set])
  
  return {
    config: educationConfig,
    educations,
    sortedEducations,
    currentEducations,
    addEducation,
    updateEducation,
    removeEducation,
  }
}

/**
 * Hook for skills configuration and data
 */
export function useSkills() {
  const { config, get, set } = useConfig()
  
  const skillsConfig = useMemo(() => config?.skills, [config])
  const skills = useMemo(() => skillsConfig?.items || [], [skillsConfig])
  
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {}
    skills.forEach(skill => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = []
      }
      grouped[skill.category].push(skill)
    })
    
    // Sort skills within categories by level (highest first)
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => b.level - a.level)
    })
    
    return grouped
  }, [skills])
  
  const categories = useMemo(() => 
    [...new Set(skills.map(s => s.category))].sort(),
    [skills]
  )
  
  const topSkills = useMemo(() => 
    [...skills].sort((a, b) => b.level - a.level).slice(0, 10),
    [skills]
  )
  
  const addSkill = useCallback(async (skill: Skill) => {
    const currentSkills = get<Skill[]>('skills.items', [])
    await set('skills.items', [...currentSkills, skill])
  }, [get, set])
  
  const updateSkill = useCallback(async (skillName: string, updates: Partial<Skill>) => {
    const currentSkills = get<Skill[]>('skills.items', [])
    const updatedSkills = currentSkills.map(skill => 
      skill.name === skillName ? { ...skill, ...updates } : skill
    )
    await set('skills.items', updatedSkills)
  }, [get, set])
  
  const removeSkill = useCallback(async (skillName: string) => {
    const currentSkills = get<Skill[]>('skills.items', [])
    const filteredSkills = currentSkills.filter(skill => skill.name !== skillName)
    await set('skills.items', filteredSkills)
  }, [get, set])
  
  return {
    config: skillsConfig,
    skills,
    skillsByCategory,
    categories,
    topSkills,
    addSkill,
    updateSkill,
    removeSkill,
  }
}

/**
 * Hook for blog configuration
 */
export function useBlog() {
  const { config } = useConfig()
  
  const blogConfig = useMemo(() => config?.blog, [config])
  
  return {
    config: blogConfig,
    isEnabled: blogConfig?.enabled ?? false,
  }
}

/**
 * Hook for contact configuration
 */
export function useContact() {
  const { config } = useConfig()
  
  const contactConfig = useMemo(() => config?.contact, [config])
  
  return {
    config: contactConfig,
    isEnabled: contactConfig?.enabled ?? false,
    showForm: contactConfig?.showForm ?? false,
    showEmail: contactConfig?.showEmail ?? false,
    showPhone: contactConfig?.showPhone ?? false,
    showSocial: contactConfig?.showSocial ?? false,
    mapEnabled: contactConfig?.mapEnabled ?? false,
  }
}

/**
 * Hook for chatbot configuration
 */
export function useChatbot() {
  const { config } = useConfig()
  
  const chatbotConfig = useMemo(() => config?.chatbot, [config])
  
  return {
    config: chatbotConfig,
    isEnabled: chatbotConfig?.enabled ?? false,
  }
}

/**
 * Hook for analytics configuration
 */
export function useAnalytics() {
  const { config, isFeatureEnabled } = useConfig()
  
  const analyticsConfig = useMemo(() => config?.analytics, [config])
  const isEnabled = isFeatureEnabled('analytics')
  
  return {
    config: analyticsConfig,
    isEnabled,
    googleAnalytics: analyticsConfig?.googleAnalytics,
    googleTagManager: analyticsConfig?.googleTagManager,
    hotjar: analyticsConfig?.hotjar,
  }
}

/**
 * Hook for theme customization
 */
export function useThemeCustomization() {
  const { getTheme, set, get } = useConfig()
  const theme = getTheme()
  
  const updateThemeColor = useCallback(async (
    colorKey: keyof NonNullable<ReturnType<typeof getTheme>>,
    color: string
  ) => {
    await set(`theme.${colorKey}`, color)
  }, [set])
  
  const updateFont = useCallback(async (
    fontKey: keyof NonNullable<ReturnType<typeof getTheme>>['fonts'],
    font: string
  ) => {
    await set(`theme.fonts.${fontKey}`, font)
  }, [set])
  
  const resetTheme = useCallback(async () => {
    const defaultTheme = {
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
    }
    await set('theme', defaultTheme)
  }, [set])
  
  return {
    theme,
    updateThemeColor,
    updateFont,
    resetTheme,
  }
}

/**
 * Hook for responsive configuration values
 */
export function useResponsiveConfig<T>(
  desktopPath: string,
  mobilePath?: string,
  defaultValue?: T
): T {
  const { get } = useConfig()
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return useMemo(() => {
    const path = isMobile && mobilePath ? mobilePath : desktopPath
    return get<T>(path, defaultValue)
  }, [get, desktopPath, mobilePath, defaultValue, isMobile])
}

/**
 * Hook for configuration validation
 */
export function useConfigValidation() {
  const { config, warnings, error } = useConfig()
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  }>({ isValid: true, errors: [], warnings: [] })
  
  useEffect(() => {
    async function validateConfig() {
      if (!config) return
      
      try {
        const { validateConfig: validate } = await import('./schema')
        const result = validate(config)
        
        setValidationResult({
          isValid: result.success,
          errors: result.error?.issues.map(issue => 
            `${issue.path.join('.')}: ${issue.message}`
          ) || [],
          warnings,
        })
      } catch (err) {
        setValidationResult({
          isValid: false,
          errors: [err instanceof Error ? err.message : 'Validation failed'],
          warnings,
        })
      }
    }
    
    validateConfig()
  }, [config, warnings])
  
  return {
    ...validationResult,
    hasError: !!error,
    errorMessage: error,
  }
}

/**
 * Hook for configuration persistence
 */
export function useConfigPersistence() {
  const { config, get, set } = useConfig()
  
  const exportConfig = useCallback(() => {
    if (!config) return null
    
    const configCopy = JSON.parse(JSON.stringify(config))
    
    // Remove sensitive data
    delete configCopy.analytics?.googleAnalytics
    delete configCopy.chatbot?.apiEndpoint
    
    return configCopy
  }, [config])
  
  const importConfig = useCallback(async (importedConfig: Partial<ArchitectResumeConfig>) => {
    try {
      const { validateConfig } = await import('./schema')
      const validation = validateConfig(importedConfig)
      
      if (!validation.success) {
        throw new Error('Invalid configuration format')
      }
      
      // Merge with existing config
      const currentConfig = get('', {})
      const mergedConfig = { ...currentConfig, ...importedConfig }
      
      await set('', mergedConfig)
    } catch (error) {
      throw new Error(`Failed to import configuration: ${error}`)
    }
  }, [get, set])
  
  const downloadConfig = useCallback(() => {
    const exported = exportConfig()
    if (!exported) return
    
    const blob = new Blob([JSON.stringify(exported, null, 2)], {
      type: 'application/json',
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'architect-resume-config.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [exportConfig])
  
  return {
    exportConfig,
    importConfig,
    downloadConfig,
  }
}

/**
 * Hook for configuration history/undo
 */
export function useConfigHistory() {
  const { config, set } = useConfig()
  const [history, setHistory] = useState<ArchitectResumeConfig[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  
  // Save current config to history when it changes
  useEffect(() => {
    if (config && JSON.stringify(config) !== JSON.stringify(history[currentIndex])) {
      const newHistory = history.slice(0, currentIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(config)))
      
      // Limit history to last 50 changes
      const limitedHistory = newHistory.slice(-50)
      
      setHistory(limitedHistory)
      setCurrentIndex(limitedHistory.length - 1)
    }
  }, [config, history, currentIndex])
  
  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1
  
  const undo = useCallback(async () => {
    if (!canUndo) return
    
    const previousConfig = history[currentIndex - 1]
    await set('', previousConfig)
    setCurrentIndex(currentIndex - 1)
  }, [canUndo, history, currentIndex, set])
  
  const redo = useCallback(async () => {
    if (!canRedo) return
    
    const nextConfig = history[currentIndex + 1]
    await set('', nextConfig)
    setCurrentIndex(currentIndex + 1)
  }, [canRedo, history, currentIndex, set])
  
  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
  }, [])
  
  return {
    canUndo,
    canRedo,
    undo,
    redo,
    clearHistory,
    historyLength: history.length,
  }
}