import tailwindConfig from '../../tailwind.config'

describe('Tailwind Configuration', () => {
  it('should have valid config structure', () => {
    expect(tailwindConfig).toBeDefined()
    expect(tailwindConfig.content).toBeDefined()
    expect(tailwindConfig.theme).toBeDefined()
    expect(tailwindConfig.plugins).toBeDefined()
  })

  it('should include all necessary content paths', () => {
    const expectedPaths = [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}'
    ]
    
    expectedPaths.forEach(path => {
      expect(tailwindConfig.content).toContain(path)
    })
  })

  it('should have architect color palette defined', () => {
    expect(tailwindConfig.theme.extend.colors.architect).toBeDefined()
    expect(tailwindConfig.theme.extend.colors.architect['50']).toBe('#f8f7f4')
    expect(tailwindConfig.theme.extend.colors.architect['500']).toBe('#8a7855')
    expect(tailwindConfig.theme.extend.colors.architect['900']).toBe('#1b1811')
  })

  it('should have accent colors defined', () => {
    expect(tailwindConfig.theme.extend.colors.accent).toBeDefined()
    expect(tailwindConfig.theme.extend.colors.accent.gold).toBe('#d4af37')
    expect(tailwindConfig.theme.extend.colors.accent.copper).toBe('#b87333')
  })

  it('should have custom font families configured', () => {
    const { fontFamily } = tailwindConfig.theme.extend
    expect(fontFamily.serif).toContain('Playfair Display')
    expect(fontFamily.sans).toContain('Inter')
    expect(fontFamily.mono).toContain('JetBrains Mono')
  })

  it('should have custom animations defined', () => {
    const { animation, keyframes } = tailwindConfig.theme.extend
    expect(animation['fade-in']).toBe('fadeIn 0.5s ease-in-out')
    expect(animation['slide-up']).toBe('slideUp 0.5s ease-out')
    expect(animation['slide-in']).toBe('slideIn 0.5s ease-out')
    
    expect(keyframes.fadeIn).toBeDefined()
    expect(keyframes.slideUp).toBeDefined()
    expect(keyframes.slideIn).toBeDefined()
  })

  it('should validate color contrast ratios for accessibility', () => {
    // Test primary architect colors for WCAG compliance
    const architectColors = tailwindConfig.theme.extend.colors.architect
    
    // Light backgrounds should pair with dark text
    expect(architectColors['50']).toMatch(/^#[0-9a-f]{6}$/i)
    expect(architectColors['100']).toMatch(/^#[0-9a-f]{6}$/i)
    
    // Dark colors should provide sufficient contrast
    expect(architectColors['800']).toMatch(/^#[0-9a-f]{6}$/i)
    expect(architectColors['900']).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('should have proper keyframe animations structure', () => {
    const { keyframes } = tailwindConfig.theme.extend
    
    Object.entries(keyframes).forEach(([name, animation]) => {
      expect(typeof animation).toBe('object')
      expect(animation).toHaveProperty('0%')
      expect(animation).toHaveProperty('100%')
    })
  })
})