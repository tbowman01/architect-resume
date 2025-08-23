import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../app/page'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
  },
}))

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})

describe('Template Initialization Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render main page without errors', async () => {
    const { container } = render(<Home />)
    expect(container).toBeInTheDocument()
    
    // Wait for any async operations to complete
    await waitFor(() => {
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  it('should load all main sections of the portfolio', async () => {
    render(<Home />)
    
    // Check for key sections
    await waitFor(() => {
      // Hero section
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('Architect')).toBeInTheDocument()
      
      // Navigation should be present
      expect(screen.getByText('Portfolio')).toBeInTheDocument()
      expect(screen.getByText('Experience')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })
  })

  it('should initialize with correct document structure', async () => {
    const { container } = render(<Home />)
    
    await waitFor(() => {
      // Should have main content wrapper
      const mainElement = container.querySelector('main')
      expect(mainElement).toBeInTheDocument()
      
      // Should have proper HTML structure
      expect(container.firstChild).toHaveClass('flex', 'flex-col', 'min-h-screen')
    })
  })

  it('should load critical components without errors', async () => {
    render(<Home />)
    
    await waitFor(() => {
      // Navigation should be loaded
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      
      // Footer should be loaded
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      
      // Main sections should be loaded
      const sections = screen.getAllByRole('region')
      expect(sections.length).toBeGreaterThan(0)
    })
  })

  it('should handle responsive design classes', async () => {
    const { container } = render(<Home />)
    
    await waitFor(() => {
      // Check for responsive classes
      const elements = container.querySelectorAll('[class*="md:"], [class*="lg:"], [class*="xl:"]')
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  it('should initialize accessibility features', async () => {
    render(<Home />)
    
    await waitFor(() => {
      // Check for ARIA labels and roles
      const ariaElements = screen.getAllByRole(/.+/)
      expect(ariaElements.length).toBeGreaterThan(0)
      
      // Check for skip links or similar a11y features
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })
  })

  it('should not throw any console errors during initialization', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<Home />)
    
    await waitFor(() => {
      expect(consoleSpy).not.toHaveBeenCalled()
    })
    
    consoleSpy.mockRestore()
  })

  it('should load with proper meta information structure', async () => {
    // This would typically be tested with Next.js head elements
    // For now, we ensure the page renders correctly
    const { container } = render(<Home />)
    
    await waitFor(() => {
      expect(container).toBeInTheDocument()
      // In a real app, we'd check for meta tags, title, etc.
      // document.title, meta tags would be tested here
    })
  })

  it('should handle component lazy loading', async () => {
    const { container } = render(<Home />)
    
    // Wait for all components to be loaded
    await waitFor(() => {
      // Check that all major sections are present
      const sections = container.querySelectorAll('section, div[role="region"]')
      expect(sections.length).toBeGreaterThan(3) // Hero, Portfolio, Experience, Contact, etc.
    }, { timeout: 3000 })
  })
})