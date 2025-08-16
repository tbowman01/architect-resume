import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from '../../app/components/Footer'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
}))

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
})

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />)
  })

  it('renders brand section with architect name', () => {
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Architect')).toBeInTheDocument()
  })

  it('displays quick navigation links', () => {
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('displays professional affiliations', () => {
    expect(screen.getByText('Professional Affiliations')).toBeInTheDocument()
    expect(screen.getByText('American Institute of Architects (AIA)')).toBeInTheDocument()
    expect(screen.getByText('LEED Accredited Professional')).toBeInTheDocument()
    expect(screen.getByText('National Council of Architectural Registration')).toBeInTheDocument()
    expect(screen.getByText('Sustainable Design Collective')).toBeInTheDocument()
  })

  it('displays contact information', () => {
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
    expect(screen.getAllByText('john@johnarchitect.com')).toHaveLength(1)
    expect(screen.getAllByText('+1 (555) 123-4567')).toHaveLength(1)
    expect(screen.getAllByText('San Francisco, CA')).toHaveLength(1)
    expect(screen.getAllByText('Mon-Fri 9AM-6PM PST')).toHaveLength(1)
  })

  it('displays copyright information with current year', () => {
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} John Architect. All rights reserved.`)).toBeInTheDocument()
  })

  it('has working back to top button', () => {
    const backToTopButtons = screen.getAllByRole('button', { name: /back to top/i })
    const backToTopButton = backToTopButtons[0] // Use the first one
    
    fireEvent.click(backToTopButton)
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
  })

  it('displays social media links with correct attributes', () => {
    const linkedinLink = screen.getByLabelText('LinkedIn')
    const instagramLink = screen.getByLabelText('Instagram')
    const behanceLink = screen.getByLabelText('Behance')
    const portfolioLink = screen.getByLabelText('Portfolio')

    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/johnarchitect')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')

    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/johnarchitect')
    expect(behanceLink).toHaveAttribute('href', 'https://behance.net/johnarchitect')
    expect(portfolioLink).toHaveAttribute('href', 'https://johnarchitect.com')
  })

  it('has proper navigation links with anchors', () => {
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '#home')
    expect(screen.getByText('Portfolio').closest('a')).toHaveAttribute('href', '#portfolio')
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '#contact')
  })
})