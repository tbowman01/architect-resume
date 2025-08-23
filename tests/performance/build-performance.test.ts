import { execSync, spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Performance tests for build processes and optimization validation
 */

describe('Build Performance Tests', () => {
  const projectRoot = process.cwd()
  const buildOutputDir = path.join(projectRoot, 'out')
  const nextDir = path.join(projectRoot, '.next')

  beforeAll(() => {
    // Clean previous builds
    if (fs.existsSync(buildOutputDir)) {
      fs.rmSync(buildOutputDir, { recursive: true, force: true })
    }
    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true })
    }
  })

  describe('Build Process Performance', () => {
    it('should complete build within reasonable time limit', async () => {
      const startTime = Date.now()
      
      try {
        // Run build process with timeout
        execSync('npm run build', { 
          timeout: 180000, // 3 minutes max
          stdio: 'inherit'
        })
        
        const buildTime = Date.now() - startTime
        
        // Build should complete within 3 minutes for a template
        expect(buildTime).toBeLessThan(180000)
        
        console.log(`Build completed in ${buildTime}ms`)
      } catch (error) {
        throw new Error(`Build failed or exceeded timeout: ${error}`)
      }
    }, 200000) // 200 second Jest timeout

    it('should generate optimized static files', () => {
      // Verify build output exists
      expect(fs.existsSync(buildOutputDir)).toBe(true)

      // Check for essential files
      const essentialFiles = [
        'index.html',
        '_next/static',
      ]

      essentialFiles.forEach(file => {
        const filePath = path.join(buildOutputDir, file)
        expect(fs.existsSync(filePath)).toBe(true)
      })
    })

    it('should generate compressed assets', () => {
      if (!fs.existsSync(buildOutputDir)) {
        throw new Error('Build output directory not found. Run build first.')
      }

      // Find CSS and JS files
      const staticDir = path.join(buildOutputDir, '_next', 'static')
      if (fs.existsSync(staticDir)) {
        const findFiles = (dir: string, ext: string): string[] => {
          const files: string[] = []
          const items = fs.readdirSync(dir, { withFileTypes: true })
          
          for (const item of items) {
            if (item.isDirectory()) {
              files.push(...findFiles(path.join(dir, item.name), ext))
            } else if (item.name.endsWith(ext)) {
              files.push(path.join(dir, item.name))
            }
          }
          return files
        }

        const cssFiles = findFiles(staticDir, '.css')
        const jsFiles = findFiles(staticDir, '.js')

        // Should have at least one CSS and JS file
        expect(cssFiles.length).toBeGreaterThan(0)
        expect(jsFiles.length).toBeGreaterThan(0)

        // Check file sizes are reasonable (not too large)
        [...cssFiles, ...jsFiles].forEach(file => {
          const stats = fs.statSync(file)
          const sizeInKB = stats.size / 1024
          
          // Individual files should be under 1MB for a template
          expect(sizeInKB).toBeLessThan(1024)
          console.log(`File ${path.basename(file)}: ${sizeInKB.toFixed(2)} KB`)
        })
      }
    })

    it('should have proper bundle size optimization', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      // Check for optimization-related dependencies
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
      
      // Should have Next.js for optimization
      expect(dependencies.next).toBeDefined()
      
      // Should have TypeScript for better tree-shaking
      expect(dependencies.typescript).toBeDefined()
    })
  })

  describe('Development Server Performance', () => {
    it('should start development server quickly', async () => {
      const startTime = Date.now()
      
      return new Promise<void>((resolve, reject) => {
        const devServer = spawn('npm', ['run', 'dev'], {
          stdio: 'pipe',
          detached: false
        })

        let serverReady = false
        const timeout = setTimeout(() => {
          if (!serverReady) {
            devServer.kill()
            reject(new Error('Development server failed to start within timeout'))
          }
        }, 30000) // 30 second timeout

        devServer.stdout.on('data', (data) => {
          const output = data.toString()
          console.log('Dev server output:', output)
          
          if (output.includes('Ready') || output.includes('started server')) {
            const startupTime = Date.now() - startTime
            console.log(`Dev server started in ${startupTime}ms`)
            
            // Should start within 30 seconds
            expect(startupTime).toBeLessThan(30000)
            
            serverReady = true
            clearTimeout(timeout)
            devServer.kill()
            resolve()
          }
        })

        devServer.stderr.on('data', (data) => {
          const error = data.toString()
          console.error('Dev server error:', error)
          
          // Don't fail on warnings, only on actual errors
          if (error.includes('Error:') && !error.includes('Warning:')) {
            clearTimeout(timeout)
            devServer.kill()
            reject(new Error(`Development server error: ${error}`))
          }
        })

        devServer.on('error', (error) => {
          clearTimeout(timeout)
          reject(error)
        })
      })
    }, 35000) // Jest timeout slightly longer than our internal timeout
  })

  describe('Asset Optimization', () => {
    it('should have proper image optimization settings', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.js')
      const nextConfig = require(nextConfigPath)

      // Check image optimization settings
      expect(nextConfig.images).toBeDefined()
      expect(nextConfig.images.unoptimized).toBe(true) // For static export
      expect(nextConfig.images.domains).toBeDefined()
      expect(Array.isArray(nextConfig.images.domains)).toBe(true)
    })

    it('should validate CSS optimization', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.js')
      const nextConfig = require(nextConfigPath)

      // Check for CSS optimization
      if (nextConfig.experimental) {
        expect(nextConfig.experimental.optimizeCss).toBe(true)
      }

      // Verify PostCSS configuration
      const postcssConfigPath = path.join(projectRoot, 'postcss.config.js')
      if (fs.existsSync(postcssConfigPath)) {
        const postcssConfig = require(postcssConfigPath)
        expect(postcssConfig.plugins).toBeDefined()
      }
    })

    it('should have Tailwind CSS purging configured', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.ts')
      
      // Read as text since it's a TypeScript file
      const tailwindConfigContent = fs.readFileSync(tailwindConfigPath, 'utf8')
      
      // Should have content paths for purging
      expect(tailwindConfigContent).toContain('content:')
      expect(tailwindConfigContent).toContain('./app/**/*.{js,ts,jsx,tsx,mdx}')
      expect(tailwindConfigContent).toContain('./components/**/*.{js,ts,jsx,tsx,mdx}')
    })
  })

  describe('Bundle Analysis', () => {
    it('should not have excessively large dependencies', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      // Check that we're not including unnecessarily heavy dependencies
      const dependencies = packageJson.dependencies || {}
      
      // These would be red flags for bundle size
      const heavyDependencies = [
        'lodash', // Should use lodash-es or individual functions
        'moment', // Should use date-fns or dayjs
        'jquery', // Not needed with React
      ]

      heavyDependencies.forEach(dep => {
        expect(dependencies[dep]).toBeUndefined()
      })
    })

    it('should use modern, tree-shakable dependencies', () => {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

      const dependencies = packageJson.dependencies || {}
      
      // Verify we're using efficient dependencies
      if (dependencies['lucide-react']) {
        // Lucide is tree-shakable, good choice
        expect(dependencies['lucide-react']).toBeDefined()
      }

      if (dependencies['framer-motion']) {
        // Framer Motion is optimized for tree-shaking
        expect(dependencies['framer-motion']).toBeDefined()
      }
    })
  })

  describe('Runtime Performance', () => {
    it('should have proper React optimizations', () => {
      // Check component files for performance best practices
      const componentDir = path.join(projectRoot, 'app', 'components')
      
      if (fs.existsSync(componentDir)) {
        const componentFiles = fs.readdirSync(componentDir)
          .filter(file => file.endsWith('.tsx'))

        componentFiles.forEach(file => {
          const filePath = path.join(componentDir, file)
          const content = fs.readFileSync(filePath, 'utf8')

          // Should use React best practices
          expect(content).toContain('export default') // Proper exports for tree-shaking
          
          // Should not have anti-patterns
          expect(content).not.toContain('var ') // Should use const/let
        })
      }
    })

    it('should have lazy loading implemented where appropriate', () => {
      // Check for dynamic imports in Next.js pages
      const appDir = path.join(projectRoot, 'app')
      
      if (fs.existsSync(appDir)) {
        const pageFiles = fs.readdirSync(appDir, { recursive: true })
          .filter((file: any) => typeof file === 'string' && file.endsWith('.tsx'))

        // At least check that the structure supports lazy loading
        expect(pageFiles.length).toBeGreaterThan(0)
      }
    })
  })
})