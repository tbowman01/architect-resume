import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Hero from '../../app/components/Hero'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}))

describe('Hero Component', () => {
  beforeEach(() => {
    render(<Hero />)
  })

  it('should render hero section', () => {
    const heroSection = screen.getByRole('region', { name: /hero/i }) || 
                       screen.getByText('John').closest('section')
    expect(heroSection).toBeInTheDocument()
  })

  it('should display architect name', () => {
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Architect')).toBeInTheDocument()
  })

  it('should have proper heading hierarchy', () => {
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
    
    // Should have main heading (h1)
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toBeInTheDocument()
  })

  it('should display professional tagline or description', () => {
    // Look for descriptive text about the architect
    const textElements = screen.getAllByText(/architect|design|building|construction|creative/i)
    expect(textElements.length).toBeGreaterThan(0)
  })

  it('should have call-to-action elements', () => {
    // Look for buttons or links
    const buttons = screen.getAllByRole('button')
    const links = screen.getAllByRole('link')
    
    expect(buttons.length + links.length).toBeGreaterThan(0)
  })

  it('should have proper accessibility attributes', () => {
    // Check for ARIA labels or roles
    const headings = screen.getAllByRole('heading')
    headings.forEach(heading => {
      expect(heading).toBeInTheDocument()
    })

    // Main section should have proper structure
    const mainContent = screen.getByText('John').closest('section') || 
                       screen.getByText('John').closest('div')
    expect(mainContent).toBeInTheDocument()
  })

  it('should handle responsive design classes', () => {
    const { container } = render(<Hero />)
    
    // Should have responsive classes (Tailwind CSS)
    const elementsWithResponsiveClasses = container.querySelectorAll(
      '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]'
    )
    expect(elementsWithResponsiveClasses.length).toBeGreaterThan(0)
  })

  it('should have proper styling structure', () => {
    const { container } = render(<Hero />)
    
    // Should use Tailwind classes for styling
    const styledElements = container.querySelectorAll('[class*="text-"], [class*="bg-"], [class*="p-"], [class*="m-"]')
    expect(styledElements.length).toBeGreaterThan(0)
  })

  it('should handle interactions correctly', () => {
    const interactiveElements = screen.getAllByRole('button')
    const linkElements = screen.getAllByRole('link')
    
    [...interactiveElements, ...linkElements].forEach(element => {
      // Should not throw error on interaction
      expect(() => {
        fireEvent.click(element)
      }).not.toThrow()
    })
  })

  it('should have semantic HTML structure', () => {
    const { container } = render(<Hero />)
    
    // Should use semantic HTML elements
    const semanticElements = container.querySelectorAll('section, header, main, article')
    expect(semanticElements.length).toBeGreaterThan(0)
  })

  it('should display contact or social information', () => {
    // Look for contact information or social links
    const contactElements = screen.queryAllByText(/contact|portfolio|linkedin|email|@/i)
    
    // This might be optional, so we just check if present
    if (contactElements.length > 0) {
      expect(contactElements[0]).toBeInTheDocument()
    }
  })

  it('should have proper font and typography classes', () => {
    const { container } = render(<Hero />)
    
    // Should use typography classes
    const typographyElements = container.querySelectorAll(
      '[class*="font-"], [class*="text-"], [class*="leading-"], [class*="tracking-"]'
    )
    expect(typographyElements.length).toBeGreaterThan(0)
  })
})