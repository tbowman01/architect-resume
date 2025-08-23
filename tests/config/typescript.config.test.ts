import * as fs from 'fs'
import * as path from 'path'

describe('TypeScript Configuration', () => {
  let tsConfig: any

  beforeAll(() => {
    const configPath = path.join(process.cwd(), 'tsconfig.json')
    const configContent = fs.readFileSync(configPath, 'utf8')
    tsConfig = JSON.parse(configContent)
  })

  it('should have valid tsconfig.json structure', () => {
    expect(tsConfig).toBeDefined()
    expect(tsConfig.compilerOptions).toBeDefined()
    expect(tsConfig.include).toBeDefined()
    expect(tsConfig.exclude).toBeDefined()
  })

  it('should have strict type checking enabled', () => {
    const { compilerOptions } = tsConfig
    expect(compilerOptions.strict).toBe(true)
    expect(compilerOptions.noImplicitAny).toBe(true)
    expect(compilerOptions.strictNullChecks).toBe(true)
  })

  it('should be configured for Next.js', () => {
    const { compilerOptions } = tsConfig
    expect(compilerOptions.target).toBe('es5')
    expect(compilerOptions.lib).toContain('dom')
    expect(compilerOptions.lib).toContain('dom.iterable')
    expect(compilerOptions.lib).toContain('es6')
    expect(compilerOptions.allowJs).toBe(true)
    expect(compilerOptions.skipLibCheck).toBe(true)
    expect(compilerOptions.esModuleInterop).toBe(true)
    expect(compilerOptions.allowSyntheticDefaultImports).toBe(true)
    expect(compilerOptions.forceConsistentCasingInFileNames).toBe(true)
    expect(compilerOptions.moduleResolution).toBe('node')
    expect(compilerOptions.resolveJsonModule).toBe(true)
    expect(compilerOptions.isolatedModules).toBe(true)
    expect(compilerOptions.noEmit).toBe(true)
  })

  it('should include proper paths for compilation', () => {
    expect(tsConfig.include).toContain('next-env.d.ts')
    expect(tsConfig.include).toContain('**/*.ts')
    expect(tsConfig.include).toContain('**/*.tsx')
  })

  it('should exclude unnecessary directories', () => {
    expect(tsConfig.exclude).toContain('node_modules')
  })

  it('should have proper path mapping if configured', () => {
    const { compilerOptions } = tsConfig
    if (compilerOptions.paths) {
      // Check if @ alias is properly configured
      expect(compilerOptions.baseUrl).toBeDefined()
      if (compilerOptions.paths['@/*']) {
        expect(compilerOptions.paths['@/*']).toContain('./*')
      }
    }
  })

  it('should support JSX for React', () => {
    const { compilerOptions } = tsConfig
    expect(compilerOptions.jsx).toBe('preserve')
  })

  it('should have incremental compilation enabled', () => {
    const { compilerOptions } = tsConfig
    expect(compilerOptions.incremental).toBe(true)
  })
})