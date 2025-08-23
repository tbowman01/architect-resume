import * as fs from 'fs'
import * as path from 'path'
import { blogPosts } from '../../app/data/blog'

/**
 * Validation tests for generated templates and customization options
 */

describe('Template Validation Tests', () => {
  const projectRoot = process.cwd()

  describe('File Structure Validation', () => {
    it('should have all required template files', () => {
      const requiredFiles = [
        'package.json',
        'next.config.js',
        'tailwind.config.ts',
        'tsconfig.json',
        'app/page.tsx',
        'app/layout.tsx',
        'app/globals.css',
      ]

      requiredFiles.forEach(file => {
        const filePath = path.join(projectRoot, file)
        expect(fs.existsSync(filePath)).toBe(true)
        
        if (!fs.existsSync(filePath)) {
          console.error(`Missing required file: ${file}`)
        }
      })
    })

    it('should have proper component structure', () => {
      const componentDir = path.join(projectRoot, 'app', 'components')
      expect(fs.existsSync(componentDir)).toBe(true)

      const expectedComponents = [
        'Hero.tsx',
        'Navigation.tsx',
        'Portfolio.tsx',
        'Experience.tsx',
        'Skills.tsx',
        'Education.tsx',
        'Contact.tsx',
        'Footer.tsx',
        'Blog.tsx',
        'ChatBot.tsx'
      ]

      expectedComponents.forEach(component => {
        const componentPath = path.join(componentDir, component)
        expect(fs.existsSync(componentPath)).toBe(true)
      })
    })

    it('should have test directory structure', () => {
      const testDir = path.join(projectRoot, 'tests')
      expect(fs.existsSync(testDir)).toBe(true)

      const expectedTestDirs = [
        'components',
        'config',
        'integration',
        'e2e',
        'performance',
        'validation'
      ]

      expectedTestDirs.forEach(dir => {
        const dirPath = path.join(testDir, dir)
        expect(fs.existsSync(dirPath)).toBe(true)
      })
    })
  })

  describe('Configuration Validation', () => {
    it('should have valid package.json structure', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      // Required fields
      expect(packageJson.name).toBeDefined()
      expect(packageJson.version).toBeDefined()
      expect(packageJson.scripts).toBeDefined()
      expect(packageJson.dependencies).toBeDefined()
      expect(packageJson.devDependencies).toBeDefined()

      // Required scripts
      const requiredScripts = ['dev', 'build', 'start', 'lint', 'test']
      requiredScripts.forEach(script => {
        expect(packageJson.scripts[script]).toBeDefined()
      })

      // Required dependencies
      expect(packageJson.dependencies.next).toBeDefined()
      expect(packageJson.dependencies.react).toBeDefined()
      expect(packageJson.dependencies['react-dom']).toBeDefined()

      // Required dev dependencies
      expect(packageJson.devDependencies.typescript).toBeDefined()
      expect(packageJson.devDependencies['@types/react']).toBeDefined()
      expect(packageJson.devDependencies.jest).toBeDefined()
    })

    it('should have valid TypeScript configuration', () => {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json')
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))

      expect(tsconfig.compilerOptions).toBeDefined()
      expect(tsconfig.include).toBeDefined()
      expect(tsconfig.exclude).toBeDefined()

      // Essential compiler options
      expect(tsconfig.compilerOptions.strict).toBe(true)
      expect(tsconfig.compilerOptions.target).toBeDefined()
      expect(tsconfig.compilerOptions.module || tsconfig.compilerOptions.moduleResolution).toBeDefined()
    })

    it('should have valid Next.js configuration', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.js')
      const nextConfig = require(nextConfigPath)

      expect(nextConfig).toBeDefined()
      expect(typeof nextConfig).toBe('object')

      // Static export configuration for template
      expect(nextConfig.output).toBe('export')
      expect(nextConfig.trailingSlash).toBe(true)
      expect(nextConfig.images.unoptimized).toBe(true)
    })

    it('should have valid Tailwind configuration', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      const configContent = fs.readFileSync(tailwindConfigPath, 'utf8')

      // Basic structure validation
      expect(configContent).toContain('content:')
      expect(configContent).toContain('theme:')
      expect(configContent).toContain('./app/**/*.{js,ts,jsx,tsx,mdx}')

      // Custom colors validation
      expect(configContent).toContain('architect:')
      expect(configContent).toContain('accent:')
    })
  })

  describe('Content Structure Validation', () => {
    it('should have valid blog data structure', () => {
      expect(Array.isArray(blogPosts)).toBe(true)
      expect(blogPosts.length).toBeGreaterThan(0)

      blogPosts.forEach((post, index) => {
        // Required fields
        expect(post.id).toBeDefined()
        expect(post.title).toBeDefined()
        expect(post.excerpt).toBeDefined()
        expect(post.content).toBeDefined()
        expect(post.author).toBeDefined()
        expect(post.publishDate).toBeDefined()
        expect(post.readTime).toBeDefined()
        expect(post.tags).toBeDefined()
        expect(post.featured).toBeDefined()

        // Type validation
        expect(typeof post.id).toBe('string')
        expect(typeof post.title).toBe('string')
        expect(typeof post.excerpt).toBe('string')
        expect(typeof post.content).toBe('string')
        expect(typeof post.author).toBe('string')
        expect(typeof post.publishDate).toBe('string')
        expect(typeof post.readTime).toBe('number')
        expect(Array.isArray(post.tags)).toBe(true)
        expect(typeof post.featured).toBe('boolean')

        // Content validation
        expect(post.title.length).toBeGreaterThan(5)
        expect(post.excerpt.length).toBeGreaterThan(10)
        expect(post.content.length).toBeGreaterThan(50)
        expect(post.readTime).toBeGreaterThan(0)
        expect(post.tags.length).toBeGreaterThan(0)

        // Date format validation (basic)
        expect(post.publishDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

        console.log(`Blog post ${index + 1} "${post.title}" - Valid ✓`)
      })
    })

    it('should have at least one featured blog post', () => {
      const featuredPosts = blogPosts.filter(post => post.featured)
      expect(featuredPosts.length).toBeGreaterThan(0)
    })

    it('should have proper tag structure', () => {
      const allTags = blogPosts.flatMap(post => post.tags)
      const uniqueTags = [...new Set(allTags)]

      expect(uniqueTags.length).toBeGreaterThan(0)
      expect(uniqueTags.length).toBeLessThanOrEqual(allTags.length)

      uniqueTags.forEach(tag => {
        expect(typeof tag).toBe('string')
        expect(tag.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Component Validation', () => {
    it('should have valid React component exports', () => {
      const componentDir = path.join(projectRoot, 'app', 'components')
      const componentFiles = fs.readdirSync(componentDir)
        .filter(file => file.endsWith('.tsx'))

      componentFiles.forEach(file => {
        const componentPath = path.join(componentDir, file)
        const content = fs.readFileSync(componentPath, 'utf8')

        // Should have React import
        expect(content).toMatch(/import.*React|'react'/)

        // Should have default export
        expect(content).toMatch(/export default/)

        // Should be a functional component
        expect(content).toMatch(/function|const.*=.*=>|function.*\(/)

        // Should return JSX
        expect(content).toContain('return')
        expect(content).toMatch(/<[A-Za-z]/)

        console.log(`Component ${file} - Valid ✓`)
      })
    })

    it('should have proper TypeScript types', () => {
      const typesDir = path.join(projectRoot, 'app', 'types')
      
      if (fs.existsSync(typesDir)) {
        const typeFiles = fs.readdirSync(typesDir)
          .filter(file => file.endsWith('.ts'))

        typeFiles.forEach(file => {
          const typePath = path.join(typesDir, file)
          const content = fs.readFileSync(typePath, 'utf8')

          // Should have proper TypeScript exports
          expect(content).toMatch(/export.*(interface|type|enum)/)

          console.log(`Type file ${file} - Valid ✓`)
        })
      }
    })

    it('should have accessible markup', () => {
      const componentDir = path.join(projectRoot, 'app', 'components')
      const componentFiles = fs.readdirSync(componentDir)
        .filter(file => file.endsWith('.tsx'))

      const accessibilityPatterns = [
        /aria-label/,
        /aria-labelledby/,
        /role=/,
        /alt=/,
        /<h[1-6]/,
        /<nav/,
        /<main/,
        /<section/,
        /<article/
      ]

      let hasAccessibilityFeatures = false

      componentFiles.forEach(file => {
        const componentPath = path.join(componentDir, file)
        const content = fs.readFileSync(componentPath, 'utf8')

        accessibilityPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            hasAccessibilityFeatures = true
          }
        })
      })

      expect(hasAccessibilityFeatures).toBe(true)
    })
  })

  describe('Asset Validation', () => {
    it('should have required static assets', () => {
      const publicDir = path.join(projectRoot, 'public')
      expect(fs.existsSync(publicDir)).toBe(true)

      const imageDir = path.join(publicDir, 'images')
      if (fs.existsSync(imageDir)) {
        const images = fs.readdirSync(imageDir)
        console.log(`Found ${images.length} images in public/images/`)
      }
    })

    it('should have proper favicon structure', () => {
      const publicDir = path.join(projectRoot, 'public')
      const faviconFiles = [
        'favicon.ico',
        'favicon.svg',
        'apple-touch-icon.png'
      ]

      faviconFiles.forEach(file => {
        const filePath = path.join(publicDir, file)
        if (fs.existsSync(filePath)) {
          console.log(`Found favicon: ${file} ✓`)
        }
      })
    })
  })

  describe('Template Customization Validation', () => {
    it('should have customizable configuration points', () => {
      // Check that key customization points are easily identifiable
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8')

      // Color customization points
      expect(tailwindConfig).toContain('architect:')
      expect(tailwindConfig).toContain('accent:')

      // Font customization points
      expect(tailwindConfig).toContain('fontFamily:')
    })

    it('should have proper documentation for customization', () => {
      const readmePath = path.join(projectRoot, 'README.md')
      
      if (fs.existsSync(readmePath)) {
        const readme = fs.readFileSync(readmePath, 'utf8')

        // Should contain customization guidance
        const customizationKeywords = [
          'customiz',
          'configuration',
          'template',
          'colors',
          'fonts'
        ]

        let hasCustomizationDocs = false
        customizationKeywords.forEach(keyword => {
          if (readme.toLowerCase().includes(keyword)) {
            hasCustomizationDocs = true
          }
        })

        expect(hasCustomizationDocs).toBe(true)
      }
    })
  })
})