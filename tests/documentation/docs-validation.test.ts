import * as fs from 'fs'
import * as path from 'path'

/**
 * Documentation validation tests for setup instructions and API
 */

describe('Documentation Validation Tests', () => {
  const projectRoot = process.cwd()

  describe('README Documentation', () => {
    it('should have comprehensive README.md file', () => {
      const readmePath = path.join(projectRoot, 'README.md')
      expect(fs.existsSync(readmePath)).toBe(true)

      const readmeContent = fs.readFileSync(readmePath, 'utf8')
      
      // Should have essential sections
      const requiredSections = [
        'features',
        'quick start',
        'installation',
        'development',
        'deployment'
      ]

      requiredSections.forEach(section => {
        const sectionRegex = new RegExp(section, 'i')
        expect(readmeContent).toMatch(sectionRegex)
        console.log(`README section "${section}" - Found ✓`)
      })

      // Should have proper length
      expect(readmeContent.length).toBeGreaterThan(500)
    })

    it('should have clear installation instructions', () => {
      const readmePath = path.join(projectRoot, 'README.md')
      const readmeContent = fs.readFileSync(readmePath, 'utf8')

      // Should contain npm/node commands
      const installationCommands = [
        'npm install',
        'npm run dev',
        'npm run build'
      ]

      installationCommands.forEach(command => {
        expect(readmeContent).toContain(command)
        console.log(`Installation command "${command}" - Found ✓`)
      })

      // Should mention Node.js requirements
      expect(readmeContent.toLowerCase()).toMatch(/node\.?js|node version|npm/)
    })

    it('should have customization instructions', () => {
      const readmePath = path.join(projectRoot, 'README.md')
      const readmeContent = fs.readFileSync(readmePath, 'utf8')

      const customizationKeywords = [
        'customiz',
        'colors',
        'fonts',
        'configuration',
        'tailwind'
      ]

      let foundCustomizationInstructions = 0
      customizationKeywords.forEach(keyword => {
        if (readmeContent.toLowerCase().includes(keyword)) {
          foundCustomizationInstructions++
        }
      })

      expect(foundCustomizationInstructions).toBeGreaterThan(2)
    })

    it('should have deployment instructions', () => {
      const readmePath = path.join(projectRoot, 'README.md')
      const readmeContent = fs.readFileSync(readmePath, 'utf8')

      const deploymentKeywords = [
        'github pages',
        'vercel',
        'netlify',
        'deployment',
        'deploy'
      ]

      let foundDeploymentInstructions = 0
      deploymentKeywords.forEach(keyword => {
        if (readmeContent.toLowerCase().includes(keyword)) {
          foundDeploymentInstructions++
        }
      })

      expect(foundDeploymentInstructions).toBeGreaterThan(1)
    })

    it('should have valid markdown syntax', () => {
      const readmePath = path.join(projectRoot, 'README.md')
      const readmeContent = fs.readFileSync(readmePath, 'utf8')

      // Basic markdown syntax checks
      const lines = readmeContent.split('\n')

      // Should have proper header structure
      const headers = lines.filter(line => line.startsWith('#'))
      expect(headers.length).toBeGreaterThan(3)

      // Headers should have space after #
      headers.forEach(header => {
        expect(header).toMatch(/^#+\s+/)
      })

      // Should have code blocks
      const codeBlocks = readmeContent.match(/```[\s\S]*?```/g) || []
      expect(codeBlocks.length).toBeGreaterThan(0)

      // Should have proper link syntax
      const links = readmeContent.match(/\[([^\]]+)\]\([^)]+\)/g) || []
      expect(links.length).toBeGreaterThan(0)

      console.log(`README: ${headers.length} headers, ${codeBlocks.length} code blocks, ${links.length} links`)
    })
  })

  describe('Additional Documentation', () => {
    it('should have template-specific documentation', () => {
      const templateInfoPath = path.join(projectRoot, 'TEMPLATE_INFO.md')
      
      if (fs.existsSync(templateInfoPath)) {
        const content = fs.readFileSync(templateInfoPath, 'utf8')
        expect(content.length).toBeGreaterThan(100)
        console.log('TEMPLATE_INFO.md - Found ✓')
      }
    })

    it('should have documentation directory structure', () => {
      const docsDir = path.join(projectRoot, 'docs')
      
      if (fs.existsSync(docsDir)) {
        const docFiles = fs.readdirSync(docsDir)
          .filter(file => file.endsWith('.md'))

        expect(docFiles.length).toBeGreaterThan(0)
        
        docFiles.forEach(file => {
          const filePath = path.join(docsDir, file)
          const content = fs.readFileSync(filePath, 'utf8')
          expect(content.length).toBeGreaterThan(50)
          console.log(`Documentation file ${file} - Valid ✓`)
        })
      }
    })

    it('should have component documentation', () => {
      const docsDir = path.join(projectRoot, 'docs')
      
      if (fs.existsSync(docsDir)) {
        const componentDocsPath = path.join(docsDir, 'COMPONENTS.md')
        
        if (fs.existsSync(componentDocsPath)) {
          const content = fs.readFileSync(componentDocsPath, 'utf8')
          
          // Should document major components
          const expectedComponents = [
            'Hero',
            'Navigation',
            'Portfolio',
            'Contact',
            'Footer'
          ]

          expectedComponents.forEach(component => {
            expect(content).toContain(component)
          })
          
          console.log('COMPONENTS.md - Found and validated ✓')
        }
      }
    })

    it('should have API documentation', () => {
      const docsDir = path.join(projectRoot, 'docs')
      
      if (fs.existsSync(docsDir)) {
        const apiDocsPath = path.join(docsDir, 'API.md')
        
        if (fs.existsSync(apiDocsPath)) {
          const content = fs.readFileSync(apiDocsPath, 'utf8')
          expect(content.length).toBeGreaterThan(100)
          console.log('API.md - Found ✓')
        }
      }
    })
  })

  describe('Code Documentation', () => {
    it('should have TypeScript type definitions documented', () => {
      const typesDir = path.join(projectRoot, 'app', 'types')
      
      if (fs.existsSync(typesDir)) {
        const typeFiles = fs.readdirSync(typesDir)
          .filter(file => file.endsWith('.ts'))

        typeFiles.forEach(file => {
          const filePath = path.join(typesDir, file)
          const content = fs.readFileSync(filePath, 'utf8')

          // Should have interface/type definitions
          expect(content).toMatch(/interface|type|enum/)
          
          // Should have comments for complex types
          const hasComments = content.includes('//') || content.includes('/**')
          if (content.length > 200) {
            expect(hasComments).toBe(true)
          }

          console.log(`Type definition ${file} - Valid ✓`)
        })
      }
    })

    it('should have component props documented', () => {
      const componentDir = path.join(projectRoot, 'app', 'components')
      const componentFiles = fs.readdirSync(componentDir)
        .filter(file => file.endsWith('.tsx'))

      let componentsWithPropsDocumentation = 0

      componentFiles.forEach(file => {
        const componentPath = path.join(componentDir, file)
        const content = fs.readFileSync(componentPath, 'utf8')

        // Check for props interface or type definitions
        if (content.includes('interface') || content.includes('type') || content.includes('Props')) {
          componentsWithPropsDocumentation++
        }

        // Should have some form of documentation
        const hasDocumentation = content.includes('//') || 
                                content.includes('/**') || 
                                content.includes('*')

        if (content.length > 500) { // Only for substantial components
          expect(hasDocumentation).toBe(true)
        }
      })

      console.log(`Components with props documentation: ${componentsWithPropsDocumentation}/${componentFiles.length}`)
    })
  })

  describe('Package.json Documentation', () => {
    it('should have proper package metadata', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      // Required metadata fields
      expect(packageJson.name).toBeDefined()
      expect(packageJson.version).toBeDefined()
      expect(packageJson.description).toBeDefined()
      expect(packageJson.keywords).toBeDefined()

      // Should have meaningful description
      expect(packageJson.description.length).toBeGreaterThan(10)

      // Should have relevant keywords
      expect(Array.isArray(packageJson.keywords)).toBe(true)
      expect(packageJson.keywords.length).toBeGreaterThan(2)

      // Should have repository information
      if (packageJson.repository) {
        expect(packageJson.repository.type).toBe('git')
        expect(packageJson.repository.url).toMatch(/^https?:\/\//)
      }

      console.log(`Package metadata: ${packageJson.name} v${packageJson.version}`)
    })

    it('should have proper script documentation', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      const scripts = packageJson.scripts
      expect(scripts).toBeDefined()

      // Essential scripts should exist
      const essentialScripts = ['dev', 'build', 'start', 'test', 'lint']
      essentialScripts.forEach(script => {
        expect(scripts[script]).toBeDefined()
        expect(typeof scripts[script]).toBe('string')
        expect(scripts[script].length).toBeGreaterThan(3)
        
        console.log(`Script "${script}": ${scripts[script]} ✓`)
      })
    })
  })

  describe('Configuration Documentation', () => {
    it('should have inline configuration documentation', () => {
      const configFiles = [
        'next.config.js',
        'tailwind.config.ts',
        'jest.config.js',
        'postcss.config.js'
      ]

      configFiles.forEach(configFile => {
        const configPath = path.join(projectRoot, configFile)
        
        if (fs.existsSync(configPath)) {
          const content = fs.readFileSync(configPath, 'utf8')
          
          // Should have some comments explaining configuration
          const hasComments = content.includes('//') || content.includes('/*')
          expect(hasComments).toBe(true)
          
          console.log(`Configuration ${configFile} - Has documentation ✓`)
        }
      })
    })

    it('should document environment requirements', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      // Should specify engine requirements
      if (packageJson.engines) {
        expect(packageJson.engines.node).toBeDefined()
        expect(packageJson.engines.npm).toBeDefined()
        
        console.log(`Engine requirements: Node ${packageJson.engines.node}, npm ${packageJson.engines.npm}`)
      }
    })
  })

  describe('Error Handling Documentation', () => {
    it('should document common issues and solutions', () => {
      const readmePath = path.join(projectRoot, 'README.md')
      const readmeContent = fs.readFileSync(readmePath, 'utf8')

      // Look for troubleshooting or common issues section
      const troubleshootingKeywords = [
        'troubleshoot',
        'common issues',
        'problems',
        'faq',
        'error'
      ]

      let hasTroubleshootingInfo = false
      troubleshootingKeywords.forEach(keyword => {
        if (readmeContent.toLowerCase().includes(keyword)) {
          hasTroubleshootingInfo = true
        }
      })

      // This is optional but recommended for templates
      if (hasTroubleshootingInfo) {
        console.log('Troubleshooting documentation - Found ✓')
      } else {
        console.log('Troubleshooting documentation - Not found (consider adding)')
      }
    })
  })
})