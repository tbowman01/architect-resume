import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Portfolio from '../../app/components/Portfolio'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    img: ({ children, ...props }: any) => <img {...props} alt={props.alt || 'test'} />,
  },
}))

describe('Portfolio Component', () => {
  beforeEach(() => {
    render(<Portfolio />)
  })

  it('should render portfolio section', () => {
    // Look for portfolio heading or section
    const portfolioElement = screen.getByText(/portfolio/i) || 
                             screen.getByRole('region', { name: /portfolio/i })
    expect(portfolioElement).toBeInTheDocument()
  })

  it('should have section heading', () => {
    const heading = screen.getByRole('heading', { name: /portfolio/i })
    expect(heading).toBeInTheDocument()
    
    // Should be h2 for semantic hierarchy
    expect(heading.tagName).toBe('H2')
  })

  it('should display portfolio projects', () => {
    // Look for project titles, descriptions, or images
    const projectElements = screen.getAllByText(/project|design|building|residential|commercial|architecture/i)
    expect(projectElements.length).toBeGreaterThan(0)
  })

  it('should have project images with proper alt text', () => {
    const images = screen.getAllByRole('img')
    
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
      const altText = img.getAttribute('alt')
      expect(altText).not.toBe('')
      expect(altText).not.toBe('test') // Not our mock alt text
    })
  })

  it('should display project information', () => {
    // Each project should have some descriptive text
    const textElements = screen.getAllByText(/\w{10,}/) // Words with 10+ characters
    expect(textElements.length).toBeGreaterThan(2) // At least some descriptive content
  })

  it('should have interactive elements for projects', () => {
    const buttons = screen.getAllByRole('button')
    const links = screen.getAllByRole('link')
    
    // Should have some way to interact with or view projects
    expect(buttons.length + links.length).toBeGreaterThan(0)
  })

  it('should handle project interactions', () => {
    const interactiveElements = [
      ...screen.getAllByRole('button'),
      ...screen.getAllByRole('link')
    ]

    interactiveElements.forEach(element => {
      expect(() => {
        fireEvent.click(element)
      }).not.toThrow()
      
      // If it's a link, should have href
      if (element.tagName === 'A') {
        expect(element).toHaveAttribute('href')
      }
    })
  })

  it('should have proper grid or layout structure', () => {
    const { container } = render(<Portfolio />)
    
    // Should use CSS Grid or Flexbox for layout
    const layoutElements = container.querySelectorAll(
      '[class*="grid"], [class*="flex"], [class*="columns"]'
    )
    expect(layoutElements.length).toBeGreaterThan(0)
  })

  it('should be responsive', () => {
    const { container } = render(<Portfolio />)
    
    // Should have responsive classes
    const responsiveElements = container.querySelectorAll(
      '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]'
    )
    expect(responsiveElements.length).toBeGreaterThan(0)
  })

  it('should have proper spacing and padding', () => {
    const { container } = render(<Portfolio />)
    
    // Should have spacing classes
    const spacingElements = container.querySelectorAll(
      '[class*="p-"], [class*="m-"], [class*="gap-"], [class*="space-"]'
    )
    expect(spacingElements.length).toBeGreaterThan(0)
  })

  it('should have project categories or filters if implemented', () => {
    // This is optional functionality, but check if present
    const categoryElements = screen.queryAllByText(/residential|commercial|industrial|public|all/i)
    const filterButtons = screen.queryAllByRole('button', { name: /filter|category/i })
    
    // If filters exist, they should be functional
    if (categoryElements.length > 0 || filterButtons.length > 0) {
      console.log('Portfolio filtering detected - testing interactions')
      
      filterButtons.forEach(button => {
        expect(() => {
          fireEvent.click(button)
        }).not.toThrow()
      })
    }
  })

  it('should have accessible navigation for projects', () => {
    // Check for keyboard navigation support
    const focusableElements = screen.getAllByRole('button')
      .concat(screen.getAllByRole('link'))
    
    focusableElements.forEach(element => {
      // Should be focusable
      expect(element).not.toHaveAttribute('tabindex', '-1')
      
      // Fire focus events to test keyboard navigation
      expect(() => {
        fireEvent.focus(element)
        fireEvent.blur(element)
      }).not.toThrow()
    })
  })

  it('should have project metadata', () => {
    // Look for dates, locations, or other project details
    const metadataElements = screen.queryAllByText(/\d{4}|location|client|area|sqft|completed/i)
    
    // This is optional, but good to have
    if (metadataElements.length > 0) {
      expect(metadataElements[0]).toBeInTheDocument()
      console.log(`Found ${metadataElements.length} metadata elements`)
    }
  })

  it('should handle loading states if dynamic', () => {
    // If portfolio loads data dynamically, should handle loading states
    const loadingElements = screen.queryAllByText(/loading|spinner/i)
    
    // This is optional for static portfolios
    if (loadingElements.length > 0) {
      expect(loadingElements[0]).toBeInTheDocument()
    }
  })

  it('should have proper image optimization attributes', () => {
    const images = screen.getAllByRole('img')
    
    images.forEach(img => {
      // Should have proper loading attributes for performance
      const loading = img.getAttribute('loading')
      if (loading) {
        expect(['lazy', 'eager']).toContain(loading)
      }
      
      // Should have proper src
      expect(img).toHaveAttribute('src')
      const src = img.getAttribute('src')
      expect(src).toBeTruthy()
      expect(src).not.toBe('')
    })
  })

  it('should have semantic structure for SEO', () => {
    const { container } = render(<Portfolio />)
    
    // Should use proper HTML5 semantic elements
    const semanticElements = container.querySelectorAll('section, article, header, figure')
    expect(semanticElements.length).toBeGreaterThan(0)
    
    // Should have proper heading hierarchy
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    expect(headings.length).toBeGreaterThan(0)
  })
})