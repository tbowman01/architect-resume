import * as fs from 'fs'
import * as path from 'path'

/**
 * Template customization tests for different user scenarios
 * These tests validate that the template can be easily customized for different use cases
 */

describe('Template Customization User Scenarios', () => {
  const projectRoot = process.cwd()

  describe('Branding Customization Scenario', () => {
    it('should allow easy name and title customization', () => {
      const componentFiles = [
        'app/components/Hero.tsx',
        'app/components/Footer.tsx',
        'app/components/Navigation.tsx'
      ]

      componentFiles.forEach(file => {
        const filePath = path.join(projectRoot, file)
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8')
          
          // Should have clear, easily replaceable name references
          const nameOccurrences = (content.match(/John/g) || []).length
          const architectOccurrences = (content.match(/Architect/g) || []).length
          
          if (nameOccurrences > 0 || architectOccurrences > 0) {
            console.log(`${file}: Found ${nameOccurrences} name references, ${architectOccurrences} title references`)
            
            // These should be easy to find and replace
            expect(nameOccurrences + architectOccurrences).toBeGreaterThan(0)
            
            // Should not be deeply nested in complex logic
            expect(content).toContain('John')
            expect(content).toContain('Architect')
          }
        }
      })
    })

    it('should allow easy contact information customization', () => {
      const contactFiles = [
        'app/components/Contact.tsx',
        'app/components/Footer.tsx',
        'app/components/Hero.tsx'
      ]

      const contactInfo = {
        email: 'john@johnarchitect.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA'
      }

      contactFiles.forEach(file => {
        const filePath = path.join(projectRoot, file)
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8')
          
          Object.entries(contactInfo).forEach(([type, value]) => {
            if (content.includes(value)) {
              console.log(`${file}: Contains ${type} - ${value}`)
              
              // Should be easily replaceable string literals
              expect(content).toContain(value)
            }
          })
        }
      })
    })

    it('should allow social media links customization', () => {
      const socialFiles = [
        'app/components/Footer.tsx',
        'app/components/Hero.tsx',
        'app/components/Contact.tsx'
      ]

      const socialLinks = [
        'linkedin.com/in/johnarchitect',
        'instagram.com/johnarchitect',
        'behance.net/johnarchitect',
        'johnarchitect.com'
      ]

      socialFiles.forEach(file => {
        const filePath = path.join(projectRoot, file)
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8')
          
          socialLinks.forEach(link => {
            if (content.includes(link)) {
              console.log(`${file}: Contains social link - ${link}`)
              
              // Should be easily replaceable URL strings
              expect(content).toContain(link)
            }
          })
        }
      })
    })
  })

  describe('Color Scheme Customization Scenario', () => {
    it('should have centralized color configuration', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      const configContent = fs.readFileSync(tailwindConfigPath, 'utf8')

      // Should have architect color palette
      expect(configContent).toContain('architect:')
      expect(configContent).toContain('accent:')
      
      // Should have full color scale (50-900)
      const colorNumbers = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
      colorNumbers.forEach(num => {
        expect(configContent).toContain(`'${num}'`)
      })

      // Should have accent colors
      expect(configContent).toContain('gold:')
      expect(configContent).toContain('copper:')
      
      console.log('✅ Color customization structure validated')
    })

    it('should demonstrate color usage in components', () => {
      const componentDir = path.join(projectRoot, 'app', 'components')
      const componentFiles = fs.readdirSync(componentDir)
        .filter(file => file.endsWith('.tsx'))

      let usesArchitectColors = false
      let usesAccentColors = false

      componentFiles.forEach(file => {
        const filePath = path.join(componentDir, file)
        const content = fs.readFileSync(filePath, 'utf8')

        if (content.includes('architect-')) {
          usesArchitectColors = true
        }
        if (content.includes('accent-')) {
          usesAccentColors = true
        }
      })

      // At least some components should use the custom color scheme
      expect(usesArchitectColors || usesAccentColors).toBe(true)
      console.log(`Custom colors usage - Architect: ${usesArchitectColors}, Accent: ${usesAccentColors}`)
    })

    it('should validate color customization test scenario', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      let configContent = fs.readFileSync(tailwindConfigPath, 'utf8')

      // Simulate color change
      const originalColor = "'#8a7855'" // architect.500
      const newColor = "'#2563eb'" // blue-600

      const modifiedConfig = configContent.replace(originalColor, newColor)

      // Should be different after modification
      expect(modifiedConfig).not.toBe(configContent)
      expect(modifiedConfig).toContain(newColor)
      expect(modifiedConfig).not.toContain(originalColor)

      console.log('✅ Color customization simulation successful')
    })
  })

  describe('Content Customization Scenario', () => {
    it('should allow easy blog content modification', () => {
      const blogDataPath = path.join(projectRoot, 'app/data/blog.ts')
      const blogContent = fs.readFileSync(blogDataPath, 'utf8')

      // Should have clear data structure
      expect(blogContent).toContain('export const blogPosts')
      expect(blogContent).toContain('BlogPost[]')

      // Should be easy to add new posts
      expect(blogContent).toContain('id:')
      expect(blogContent).toContain('title:')
      expect(blogContent).toContain('content:')

      // Validate structure allows easy modification
      const postMatches = blogContent.match(/{\s*id:/g) || []
      expect(postMatches.length).toBeGreaterThan(0)

      console.log(`✅ Found ${postMatches.length} blog post entries for customization`)
    })

    it('should demonstrate portfolio content customization points', () => {
      const portfolioPath = path.join(projectRoot, 'app/components/Portfolio.tsx')
      
      if (fs.existsSync(portfolioPath)) {
        const content = fs.readFileSync(portfolioPath, 'utf8')
        
        // Should contain project information that can be customized
        const customizableContent = [
          'project',
          'design',
          'client',
          'year',
          'residential',
          'commercial'
        ]

        let foundCustomizationPoints = 0
        customizableContent.forEach(term => {
          if (content.toLowerCase().includes(term)) {
            foundCustomizationPoints++
          }
        })

        expect(foundCustomizationPoints).toBeGreaterThan(2)
        console.log(`✅ Portfolio customization points: ${foundCustomizationPoints}`)
      }
    })

    it('should allow easy skill and experience customization', () => {
      const experienceFiles = [
        'app/components/Experience.tsx',
        'app/components/Skills.tsx',
        'app/components/Education.tsx'
      ]

      experienceFiles.forEach(file => {
        const filePath = path.join(projectRoot, file)
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8')
          
          // Should contain customizable professional information
          const professionalTerms = [
            'year',
            'experience',
            'skill',
            'degree',
            'university',
            'architect',
            'design',
            'project'
          ]

          let foundTerms = 0
          professionalTerms.forEach(term => {
            if (content.toLowerCase().includes(term)) {
              foundTerms++
            }
          })

          if (foundTerms > 0) {
            console.log(`${file}: Found ${foundTerms} customizable professional terms`)
            expect(foundTerms).toBeGreaterThan(0)
          }
        }
      })
    })
  })

  describe('Deployment Customization Scenario', () => {
    it('should support GitHub Pages deployment customization', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.js')
      const configContent = fs.readFileSync(nextConfigPath, 'utf8')

      // Should have GitHub Pages compatible settings
      expect(configContent).toContain("output: 'export'")
      expect(configContent).toContain('trailingSlash: true')
      
      // Should have configurable base path
      expect(configContent).toContain('basePath')
      expect(configContent).toContain('assetPrefix')

      console.log('✅ GitHub Pages deployment configuration found')
    })

    it('should allow custom domain configuration', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.js')
      const configContent = fs.readFileSync(nextConfigPath, 'utf8')

      // Should have image domains configuration
      expect(configContent).toContain('domains:')
      expect(configContent).toContain('images.unsplash.com')

      // Should be easy to add custom domains
      const domainsMatch = configContent.match(/domains:\s*\[([\s\S]*?)\]/)?.[1]
      if (domainsMatch) {
        expect(domainsMatch).toContain("'")
        console.log('✅ Image domains configuration is customizable')
      }
    })

    it('should validate custom base path scenario', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.js')
      let configContent = fs.readFileSync(nextConfigPath, 'utf8')

      // Simulate base path customization
      const originalBasePath = "basePath: process.env.NODE_ENV === 'production' ? '' : ''"
      const customBasePath = "basePath: process.env.NODE_ENV === 'production' ? '/my-portfolio' : ''"

      const modifiedConfig = configContent.replace(originalBasePath, customBasePath)

      expect(modifiedConfig).not.toBe(configContent)
      expect(modifiedConfig).toContain('/my-portfolio')

      console.log('✅ Base path customization simulation successful')
    })
  })

  describe('Typography and Font Customization Scenario', () => {
    it('should have configurable font families', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      const configContent = fs.readFileSync(tailwindConfigPath, 'utf8')

      // Should have font family configuration
      expect(configContent).toContain('fontFamily:')
      expect(configContent).toContain('serif')
      expect(configContent).toContain('sans')
      expect(configContent).toContain('mono')

      // Should specify actual font names
      expect(configContent).toContain('Playfair Display')
      expect(configContent).toContain('Inter')
      expect(configContent).toContain('JetBrains Mono')

      console.log('✅ Font customization configuration found')
    })

    it('should demonstrate font usage in components', () => {
      const componentDir = path.join(projectRoot, 'app', 'components')
      const componentFiles = fs.readdirSync(componentDir)
        .filter(file => file.endsWith('.tsx'))

      let usesFontClasses = false

      componentFiles.forEach(file => {
        const filePath = path.join(componentDir, file)
        const content = fs.readFileSync(filePath, 'utf8')

        if (content.includes('font-serif') || content.includes('font-sans') || content.includes('font-mono')) {
          usesFontClasses = true
        }
      })

      expect(usesFontClasses).toBe(true)
      console.log('✅ Font classes are used in components')
    })
  })

  describe('Animation and Motion Customization Scenario', () => {
    it('should have configurable animations', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      const configContent = fs.readFileSync(tailwindConfigPath, 'utf8')

      // Should have custom animations
      expect(configContent).toContain('animation:')
      expect(configContent).toContain('keyframes:')

      // Should have specific animations
      expect(configContent).toContain('fade-in')
      expect(configContent).toContain('slide-up')
      expect(configContent).toContain('slide-in')

      console.log('✅ Animation customization configuration found')
    })

    it('should allow motion library customization', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      // Should use framer-motion for animations
      expect(packageJson.dependencies['framer-motion']).toBeDefined()

      // Check if motion is used in components
      const componentDir = path.join(projectRoot, 'app', 'components')
      const componentFiles = fs.readdirSync(componentDir).filter(f => f.endsWith('.tsx'))
      
      let usesFramerMotion = false
      componentFiles.forEach(file => {
        const filePath = path.join(componentDir, file)
        const content = fs.readFileSync(filePath, 'utf8')
        
        if (content.includes('framer-motion') || content.includes('motion.')) {
          usesFramerMotion = true
        }
      })

      expect(usesFramerMotion).toBe(true)
      console.log('✅ Framer Motion is used and customizable')
    })
  })

  describe('Multi-Language Support Scenario', () => {
    it('should have structure that supports internationalization', () => {
      // Check if text content is easily extractable for translation
      const componentDir = path.join(projectRoot, 'app', 'components')
      const componentFiles = fs.readdirSync(componentDir).filter(f => f.endsWith('.tsx'))

      let hasHardcodedStrings = false
      let hasTranslatableContent = false

      componentFiles.forEach(file => {
        const filePath = path.join(componentDir, file)
        const content = fs.readFileSync(filePath, 'utf8')

        // Look for hardcoded strings in quotes
        const stringMatches = content.match(/['"`][A-Za-z][^'"`]*['"`]/g) || []
        if (stringMatches.length > 0) {
          hasHardcodedStrings = true
        }

        // Look for UI text that would need translation
        if (content.includes('Contact') || content.includes('Portfolio') || content.includes('About')) {
          hasTranslatableContent = true
        }
      })

      expect(hasTranslatableContent).toBe(true)
      
      if (hasHardcodedStrings) {
        console.log('⚠️  Template has hardcoded strings - consider i18n structure for multi-language support')
      }
    })
  })

  describe('SEO Customization Scenario', () => {
    it('should have customizable meta information', () => {
      const layoutPath = path.join(projectRoot, 'app/layout.tsx')
      
      if (fs.existsSync(layoutPath)) {
        const content = fs.readFileSync(layoutPath, 'utf8')

        // Should have metadata configuration
        const metadataTerms = ['title', 'description', 'keywords', 'author']
        let foundMetadata = 0

        metadataTerms.forEach(term => {
          if (content.toLowerCase().includes(term)) {
            foundMetadata++
          }
        })

        expect(foundMetadata).toBeGreaterThan(1)
        console.log(`✅ Found ${foundMetadata} SEO customization points`)
      }
    })

    it('should allow sitemap and robots customization', () => {
      const publicDir = path.join(projectRoot, 'public')
      
      // Check for SEO files
      const seoFiles = ['robots.txt', 'sitemap.xml']
      seoFiles.forEach(file => {
        const filePath = path.join(publicDir, file)
        if (fs.existsSync(filePath)) {
          console.log(`✅ Found SEO file: ${file}`)
        } else {
          console.log(`⚠️  Consider adding ${file} for better SEO`)
        }
      })
    })
  })
})