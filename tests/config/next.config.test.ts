import nextConfig from '../../next.config.js'

describe('Next.js Configuration', () => {
  it('should have valid config structure', () => {
    expect(nextConfig).toBeDefined()
    expect(typeof nextConfig).toBe('object')
  })

  it('should be configured for static export', () => {
    expect(nextConfig.output).toBe('export')
    expect(nextConfig.trailingSlash).toBe(true)
    expect(nextConfig.skipTrailingSlashRedirect).toBe(true)
  })

  it('should have proper image configuration', () => {
    expect(nextConfig.images).toBeDefined()
    expect(nextConfig.images.unoptimized).toBe(true)
    expect(nextConfig.images.domains).toContain('images.unsplash.com')
    expect(nextConfig.images.domains).toContain('res.cloudinary.com')
  })

  it('should have experimental optimizations enabled', () => {
    expect(nextConfig.experimental).toBeDefined()
    expect(nextConfig.experimental.optimizeCss).toBe(true)
  })

  it('should handle deployment paths correctly', () => {
    const originalEnv = process.env.NODE_ENV
    
    // Test development environment
    process.env.NODE_ENV = 'development'
    expect(nextConfig.basePath).toBe('')
    expect(nextConfig.assetPrefix).toBe('')
    
    // Test production environment
    process.env.NODE_ENV = 'production'
    expect(nextConfig.basePath).toBe('')
    expect(nextConfig.assetPrefix).toBe('')
    
    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })

  it('should be compatible with static site deployment', () => {
    // Verify configurations required for GitHub Pages
    expect(nextConfig.output).toBe('export')
    expect(nextConfig.images.unoptimized).toBe(true)
    expect(nextConfig.trailingSlash).toBe(true)
  })

  it('should validate image domains for security', () => {
    const allowedDomains = nextConfig.images.domains
    
    allowedDomains.forEach(domain => {
      // Should not contain suspicious patterns
      expect(domain).not.toContain('localhost')
      expect(domain).not.toContain('127.0.0.1')
      expect(domain).not.toMatch(/\d+\.\d+\.\d+\.\d+/) // No IP addresses
    })
  })
})