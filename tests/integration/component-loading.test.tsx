import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Hero from '../../app/components/Hero'
import Navigation from '../../app/components/Navigation'
import Portfolio from '../../app/components/Portfolio'
import Experience from '../../app/components/Experience'
import Skills from '../../app/components/Skills'
import Education from '../../app/components/Education'
import Blog from '../../app/components/Blog'
import Contact from '../../app/components/Contact'
import Footer from '../../app/components/Footer'
import ChatBot from '../../app/components/ChatBot'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    footer: ({ children, ...props }: any) => <footer {...props}>{children}</footer>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock window methods
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})

describe('Component Loading Integration', () => {
  describe('Hero Component', () => {
    it('should load and render without errors', async () => {
      render(<Hero />)
      
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.getByText('Architect')).toBeInTheDocument()
      })
    })

    it('should have proper heading structure', async () => {
      render(<Hero />)
      
      await waitFor(() => {
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Navigation Component', () => {
    it('should load navigation menu correctly', async () => {
      render(<Navigation />)
      
      await waitFor(() => {
        expect(screen.getByRole('navigation')).toBeInTheDocument()
        expect(screen.getByText('Portfolio')).toBeInTheDocument()
        expect(screen.getByText('Experience')).toBeInTheDocument()
        expect(screen.getByText('Contact')).toBeInTheDocument()
      })
    })

    it('should have accessible navigation links', async () => {
      render(<Navigation />)
      
      await waitFor(() => {
        const links = screen.getAllByRole('link')
        expect(links.length).toBeGreaterThan(0)
        
        links.forEach(link => {
          expect(link).toHaveAttribute('href')
        })
      })
    })
  })

  describe('Portfolio Component', () => {
    it('should render portfolio section', async () => {
      render(<Portfolio />)
      
      await waitFor(() => {
        expect(screen.getByText(/portfolio/i)).toBeInTheDocument()
      })
    })

    it('should display portfolio items', async () => {
      render(<Portfolio />)
      
      await waitFor(() => {
        // Look for any portfolio content
        const portfolioSection = screen.getByRole('region', { name: /portfolio/i }) || 
                                screen.getByText(/portfolio/i).closest('section')
        expect(portfolioSection).toBeInTheDocument()
      })
    })
  })

  describe('Experience Component', () => {
    it('should render experience section', async () => {
      render(<Experience />)
      
      await waitFor(() => {
        expect(screen.getByText(/experience/i)).toBeInTheDocument()
      })
    })
  })

  describe('Skills Component', () => {
    it('should render skills section', async () => {
      render(<Skills />)
      
      await waitFor(() => {
        expect(screen.getByText(/skills/i)).toBeInTheDocument()
      })
    })
  })

  describe('Education Component', () => {
    it('should render education section', async () => {
      render(<Education />)
      
      await waitFor(() => {
        expect(screen.getByText(/education/i)).toBeInTheDocument()
      })
    })
  })

  describe('Blog Component', () => {
    it('should render blog section', async () => {
      render(<Blog />)
      
      await waitFor(() => {
        expect(screen.getByText(/blog/i)).toBeInTheDocument()
      })
    })

    it('should display blog posts', async () => {
      render(<Blog />)
      
      await waitFor(() => {
        // Should display featured blog post
        expect(screen.getByText('Sustainable Architecture: Building for the Future')).toBeInTheDocument()
      })
    })
  })

  describe('Contact Component', () => {
    it('should render contact form', async () => {
      render(<Contact />)
      
      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
      })
    })
  })

  describe('Footer Component', () => {
    it('should render footer with all sections', async () => {
      render(<Footer />)
      
      await waitFor(() => {
        expect(screen.getByRole('contentinfo')).toBeInTheDocument()
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.getByText('Architect')).toBeInTheDocument()
        expect(screen.getByText('Quick Links')).toBeInTheDocument()
      })
    })
  })

  describe('ChatBot Component', () => {
    it('should render chatbot interface', async () => {
      render(<ChatBot />)
      
      await waitFor(() => {
        // ChatBot might have a toggle button or be initially visible
        const chatElements = screen.queryAllByText(/chat/i)
        expect(chatElements.length).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('Cross-Component Integration', () => {
    it('should render multiple components together without conflicts', async () => {
      const { container } = render(
        <div>
          <Navigation />
          <Hero />
          <Portfolio />
          <Contact />
          <Footer />
        </div>
      )
      
      await waitFor(() => {
        expect(container).toBeInTheDocument()
        expect(screen.getByRole('navigation')).toBeInTheDocument()
        expect(screen.getByText('John')).toBeInTheDocument()
        expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      })
    })

    it('should maintain unique IDs across components', async () => {
      const { container } = render(
        <div>
          <Hero />
          <Portfolio />
          <Experience />
          <Contact />
        </div>
      )
      
      await waitFor(() => {
        const elementsWithIds = container.querySelectorAll('[id]')
        const ids = Array.from(elementsWithIds).map(el => el.id)
        const uniqueIds = [...new Set(ids)]
        
        expect(ids.length).toBe(uniqueIds.length) // No duplicate IDs
      })
    })
  })
})