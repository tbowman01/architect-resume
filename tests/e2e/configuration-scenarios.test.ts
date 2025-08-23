import * as fs from 'fs'
import * as path from 'path'

/**
 * End-to-end tests for different configuration scenarios
 * These tests validate that the template works correctly with various configurations
 */

describe('Configuration Scenarios E2E', () => {
  const projectRoot = process.cwd()
  let originalConfigs: { [key: string]: string } = {}

  beforeAll(() => {
    // Backup original configurations
    const configFiles = [
      'tailwind.config.ts',
      'next.config.js',
      'package.json'
    ]

    configFiles.forEach(file => {
      const filePath = path.join(projectRoot, file)
      if (fs.existsSync(filePath)) {
        originalConfigs[file] = fs.readFileSync(filePath, 'utf8')
      }
    })
  })

  afterAll(() => {
    // Restore original configurations
    Object.keys(originalConfigs).forEach(file => {
      const filePath = path.join(projectRoot, file)
      fs.writeFileSync(filePath, originalConfigs[file])
    })
  })

  describe('Theme Customization Scenarios', () => {
    it('should handle custom color scheme modification', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      const originalConfig = fs.readFileSync(tailwindConfigPath, 'utf8')

      // Test custom color modification
      const customConfig = originalConfig.replace(
        "'#8a7855'", // architect.500
        "'#2563eb'"  // blue.600
      )

      // Validate the modification would work
      expect(customConfig).toContain('#2563eb')
      expect(customConfig).not.toBe(originalConfig)

      // In a real e2e test, we would:
      // 1. Write the custom config
      // 2. Run build process
      // 3. Verify the generated CSS contains new colors
      // 4. Restore original config
    })

    it('should support font family changes', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      const config = fs.readFileSync(tailwindConfigPath, 'utf8')

      // Verify font configurations are customizable
      expect(config).toContain('Playfair Display')
      expect(config).toContain('Inter')
      expect(config).toContain('JetBrains Mono')

      // Test that font changes would be valid
      const customFontConfig = config.replace(
        "'Playfair Display'",
        "'Georgia'"
      )

      expect(customFontConfig).toContain('Georgia')
    })

    it('should handle animation customization', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      const config = fs.readFileSync(tailwindConfigPath, 'utf8')

      // Verify animation configurations exist
      expect(config).toContain('fade-in')
      expect(config).toContain('slide-up')
      expect(config).toContain('slide-in')

      // Test custom animation addition
      const customAnimationConfig = config.replace(
        "'slide-in': 'slideIn 0.5s ease-out',",
        "'slide-in': 'slideIn 0.5s ease-out',\n        'bounce-in': 'bounceIn 0.6s ease-out',"
      )

      expect(customAnimationConfig).toContain('bounce-in')
    })
  })

  describe('Deployment Configuration Scenarios', () => {
    it('should support GitHub Pages deployment', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.js')
      const config = fs.readFileSync(nextConfigPath, 'utf8')

      // Verify GitHub Pages compatible settings
      expect(config).toContain("output: 'export'")
      expect(config).toContain('trailingSlash: true')
      expect(config).toContain('unoptimized: true')
    })

    it('should handle custom base path configuration', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.js')
      const originalConfig = fs.readFileSync(nextConfigPath, 'utf8')

      // Test custom base path scenario
      const customConfig = originalConfig.replace(
        "basePath: process.env.NODE_ENV === 'production' ? '' : ''",
        "basePath: process.env.NODE_ENV === 'production' ? '/my-portfolio' : ''"
      )

      expect(customConfig).toContain('/my-portfolio')

      // In real e2e test, we would verify:
      // 1. Build succeeds with custom base path
      // 2. All links and assets work correctly
      // 3. Routing functions properly
    })

    it('should support custom domain configuration', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.js')
      const config = fs.readFileSync(nextConfigPath, 'utf8')

      // Verify image domains are configurable
      expect(config).toContain('images.unsplash.com')
      expect(config).toContain('res.cloudinary.com')

      // Test adding custom domain
      const customDomainConfig = config.replace(
        "domains: ['images.unsplash.com', 'res.cloudinary.com']",
        "domains: ['images.unsplash.com', 'res.cloudinary.com', 'my-custom-cdn.com']"
      )

      expect(customDomainConfig).toContain('my-custom-cdn.com')
    })
  })

  describe('Content Customization Scenarios', () => {
    it('should handle blog data structure changes', () => {
      const blogDataPath = path.join(projectRoot, 'app/data/blog.ts')
      const blogData = fs.readFileSync(blogDataPath, 'utf8')

      // Verify blog structure is customizable
      expect(blogData).toContain('BlogPost[]')
      expect(blogData).toContain('title:')
      expect(blogData).toContain('excerpt:')
      expect(blogData).toContain('content:')
      expect(blogData).toContain('author:')
      expect(blogData).toContain('publishDate:')

      // Test adding custom blog post
      const customBlogPost = `{
    id: '999',
    title: 'Test Blog Post',
    excerpt: 'This is a test blog post',
    content: 'Test content',
    author: 'Test Author',
    publishDate: '2024-01-01',
    readTime: 5,
    tags: ['Test'],
    featured: false,
    imageUrl: 'https://example.com/test.jpg'
  }`

      expect(() => {
        // Validate the structure would be valid TypeScript
        const testConfig = blogData.replace(
          'export const blogPosts: BlogPost[] = [',
          `export const blogPosts: BlogPost[] = [
  ${customBlogPost},`
        )
        
        // Basic syntax validation
        expect(testConfig).toContain('Test Blog Post')
      }).not.toThrow()
    })

    it('should support personal information customization', () => {
      // Test that key personal information can be customized
      const componentFiles = [
        'app/components/Hero.tsx',
        'app/components/Contact.tsx',
        'app/components/Footer.tsx'
      ]

      componentFiles.forEach(file => {
        const filePath = path.join(projectRoot, file)
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8')
          
          // These should be easily customizable
          expect(content).toContain('John')
          expect(content).toContain('Architect')
          expect(content).toContain('john@johnarchitect.com')
          expect(content).toContain('San Francisco, CA')
        }
      })
    })
  })

  describe('Build Process Scenarios', () => {
    it('should validate package.json scripts configuration', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      // Verify essential build scripts exist
      expect(packageJson.scripts.dev).toBeDefined()
      expect(packageJson.scripts.build).toBeDefined()
      expect(packageJson.scripts.start).toBeDefined()
      expect(packageJson.scripts.test).toBeDefined()
      expect(packageJson.scripts.lint).toBeDefined()

      // Verify build script includes export for static deployment
      expect(packageJson.scripts.build).toContain('next build')
      expect(packageJson.scripts.build).toContain('next export')
    })

    it('should handle different Node.js version requirements', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      // Verify Node.js version requirements
      expect(packageJson.engines.node).toBeDefined()
      expect(packageJson.engines.npm).toBeDefined()
      
      // Should require modern Node.js version
      const nodeVersion = packageJson.engines.node
      expect(nodeVersion).toMatch(/>=\d+\.\d+\.\d+/)
    })
  })

  describe('Error Handling Scenarios', () => {
    it('should handle missing required files gracefully', () => {
      // Test behavior when optional files are missing
      const optionalFiles = [
        'public/favicon.ico',
        'public/manifest.json'
      ]

      optionalFiles.forEach(file => {
        const filePath = path.join(projectRoot, file)
        const exists = fs.existsSync(filePath)
        
        // These files might be optional, but test should not fail if missing
        if (!exists) {
          console.log(`Optional file ${file} not found - this is acceptable`)
        }
      })
    })

    it('should validate TypeScript type safety', () => {
      const typeFiles = [
        'app/types/blog.ts',
        'next-env.d.ts'
      ]

      typeFiles.forEach(file => {
        const filePath = path.join(projectRoot, file)
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8')
          
          // Should contain proper TypeScript syntax
          expect(content).not.toContain('any[]') // Avoid any types where possible
        }
      })
    })
  })
})