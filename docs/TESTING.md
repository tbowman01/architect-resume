# Testing Strategy and Guide

This document outlines the comprehensive testing strategy for the Architect Resume Portfolio, including testing methodologies, tools, and best practices.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Test Structure](#test-structure)
- [Unit Testing](#unit-testing)
- [Component Testing](#component-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Performance Testing](#performance-testing)
- [Test Coverage](#test-coverage)
- [Test Data Management](#test-data-management)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Testing Philosophy

Our testing strategy follows the **Testing Pyramid** principle:

```
        E2E Tests (Few)
       ╱                ╲
      ╱  Integration     ╲
     ╱      Tests         ╲
    ╱     (Some)          ╲
   ╱                       ╲
  ╱      Unit Tests        ╲
 ╱       (Many)            ╲
╱_________________________╲
```

### Testing Principles

- **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
- **Write Tests First**: Use Test-Driven Development (TDD) when possible
- **Keep Tests Simple**: Each test should verify one specific behavior
- **Make Tests Reliable**: Tests should be deterministic and not flaky
- **Fast Feedback**: Tests should run quickly to provide immediate feedback

## Testing Stack

### Core Testing Tools

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@playwright/test": "^1.40.0",
    "@storybook/react": "^7.5.0",
    "chromatic": "^7.6.0"
  }
}
```

### Testing Libraries

- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing utilities
- **Playwright**: End-to-end testing framework
- **Storybook**: Component development and testing
- **Chromatic**: Visual regression testing

## Test Structure

### Directory Structure

```
tests/
├── __mocks__/              # Mock files
│   ├── fileMock.js
│   └── styleMock.js
├── components/             # Component tests
│   ├── Contact.test.tsx
│   ├── Hero.test.tsx
│   ├── Navigation.test.tsx
│   ├── Portfolio.test.tsx
│   ├── Experience.test.tsx
│   ├── Skills.test.tsx
│   ├── Education.test.tsx
│   └── Footer.test.tsx
├── utils/                  # Utility function tests
│   └── utils.test.ts
├── integration/            # Integration tests
│   ├── contact-form.test.tsx
│   └── navigation.test.tsx
├── e2e/                   # End-to-end tests
│   ├── homepage.spec.ts
│   ├── contact.spec.ts
│   └── portfolio.spec.ts
└── fixtures/              # Test data
    ├── mockData.ts
    └── testUtils.tsx
```

### Test Configuration

#### `jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/*.stories.{js,jsx,ts,tsx}',
    '!app/**/index.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 10000,
}

module.exports = createJestConfig(customJestConfig)
```

#### `jest.setup.js`

```javascript
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    img: ({ children, ...props }) => <img {...props}>{children}</img>,
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock scrollTo
window.scrollTo = jest.fn()
```

## Unit Testing

Unit tests focus on testing individual functions and utilities in isolation.

### Utility Function Testing

```typescript
// tests/utils/utils.test.ts
import { cn, validateEmail, formatPhoneNumber } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('should merge classNames correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active')
    })

    it('should filter out falsy values', () => {
      expect(cn('base', null, undefined, false, 'valid')).toBe('base valid')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format US phone numbers correctly', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890')
    })

    it('should handle invalid phone numbers', () => {
      expect(formatPhoneNumber('invalid')).toBe('invalid')
      expect(formatPhoneNumber('')).toBe('')
    })
  })
})
```

### Custom Hook Testing

```typescript
// tests/hooks/useContactForm.test.ts
import { renderHook, act } from '@testing-library/react'
import { useContactForm } from '@/hooks/useContactForm'

describe('useContactForm', () => {
  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useContactForm())
    
    expect(result.current.formData).toEqual({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should update form data correctly', () => {
    const { result } = renderHook(() => useContactForm())
    
    act(() => {
      result.current.updateField('name', 'John Doe')
    })
    
    expect(result.current.formData.name).toBe('John Doe')
  })

  it('should validate form and return errors', () => {
    const { result } = renderHook(() => useContactForm())
    
    act(() => {
      result.current.validateForm()
    })
    
    expect(result.current.errors.name).toBeDefined()
    expect(result.current.errors.email).toBeDefined()
  })
})
```

## Component Testing

Component tests verify that React components render correctly and handle user interactions properly.

### Basic Component Testing

```typescript
// tests/components/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Hero from '@/app/components/Hero'

describe('Hero Component', () => {
  beforeEach(() => {
    render(<Hero />)
  })

  it('renders hero section with correct content', () => {
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/john smith/i)).toBeInTheDocument()
    expect(screen.getByText(/senior architect/i)).toBeInTheDocument()
  })

  it('displays call-to-action buttons', () => {
    expect(screen.getByRole('button', { name: /view my work/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /get in touch/i })).toBeInTheDocument()
  })

  it('shows achievement statistics', () => {
    expect(screen.getByText(/15\+/)).toBeInTheDocument()
    expect(screen.getByText(/years experience/i)).toBeInTheDocument()
    expect(screen.getByText(/100\+/)).toBeInTheDocument()
    expect(screen.getByText(/projects completed/i)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAttribute('id')
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).not.toHaveAttribute('aria-disabled', 'true')
    })
  })
})
```

### Interactive Component Testing

```typescript
// tests/components/Navigation.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Navigation from '@/app/components/Navigation'

describe('Navigation Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    render(<Navigation />)
  })

  it('renders navigation menu items', () => {
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /experience/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })

  it('toggles mobile menu when hamburger button is clicked', async () => {
    const menuButton = screen.getByRole('button', { name: /menu/i })
    
    // Mobile menu should be hidden initially
    expect(screen.queryByTestId('mobile-menu')).not.toBeVisible()
    
    // Click to open menu
    await user.click(menuButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('mobile-menu')).toBeVisible()
    })
    
    // Click to close menu
    await user.click(menuButton)
    
    await waitFor(() => {
      expect(screen.queryByTestId('mobile-menu')).not.toBeVisible()
    })
  })

  it('highlights active section in navigation', () => {
    // Mock IntersectionObserver for section detection
    const mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    })
    window.IntersectionObserver = mockIntersectionObserver

    const portfolioLink = screen.getByRole('link', { name: /portfolio/i })
    expect(portfolioLink).toHaveClass('text-accent-gold')
  })

  it('closes mobile menu when clicking outside', async () => {
    const menuButton = screen.getByRole('button', { name: /menu/i })
    
    // Open mobile menu
    await user.click(menuButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('mobile-menu')).toBeVisible()
    })
    
    // Click outside the menu
    fireEvent.click(document.body)
    
    await waitFor(() => {
      expect(screen.queryByTestId('mobile-menu')).not.toBeVisible()
    })
  })
})
```

### Form Component Testing

```typescript
// tests/components/Contact.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Contact from '@/app/components/Contact'

// Mock the contact form submission
const mockSubmit = jest.fn()
jest.mock('@/lib/api', () => ({
  submitContactForm: mockSubmit
}))

describe('Contact Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockSubmit.mockClear()
    render(<Contact />)
  })

  it('renders contact form with all required fields', () => {
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('displays validation errors for empty required fields', async () => {
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Subject is required')).toBeInTheDocument()
      expect(screen.getByText('Message is required')).toBeInTheDocument()
    })
  })

  it('validates email format correctly', async () => {
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  it('validates message minimum length', async () => {
    const messageInput = screen.getByLabelText(/message/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    await user.type(messageInput, 'short')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Message must be at least 10 characters long')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    mockSubmit.mockResolvedValueOnce({ success: true })

    // Fill out the form with valid data
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/subject/i), 'Project Inquiry')
    await user.type(screen.getByLabelText(/message/i), 'I would like to discuss a new project with you.')

    const submitButton = screen.getByRole('button', { name: /send message/i })
    await user.click(submitButton)

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText('Sending Message...')).toBeInTheDocument()
    })

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Message Sent Successfully!')).toBeInTheDocument()
    }, { timeout: 3000 })

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Project Inquiry',
      message: 'I would like to discuss a new project with you.'
    })
  })

  it('handles form submission errors gracefully', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('Network error'))

    // Fill out form with valid data
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/subject/i), 'Project Inquiry')
    await user.type(screen.getByLabelText(/message/i), 'I would like to discuss a new project.')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/error sending message/i)).toBeInTheDocument()
    })
  })

  it('clears error messages when user starts typing', async () => {
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    // Trigger validation error
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })
    
    // Start typing to clear error
    await user.type(emailInput, 'j')
    
    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
    })
  })
})
```

## Integration Testing

Integration tests verify that multiple components work together correctly.

```typescript
// tests/integration/contact-form.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ContactPage } from '@/pages/contact'

// Mock API endpoint
jest.mock('@/lib/api', () => ({
  submitContactForm: jest.fn()
}))

describe('Contact Form Integration', () => {
  const user = userEvent.setup()

  it('completes full contact form workflow', async () => {
    const { submitContactForm } = require('@/lib/api')
    submitContactForm.mockResolvedValueOnce({ success: true, id: '12345' })

    render(<ContactPage />)

    // Fill out the entire form
    await user.type(screen.getByLabelText(/full name/i), 'Jane Smith')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/subject/i), 'Commercial Project Inquiry')
    await user.type(screen.getByLabelText(/message/i), 'I am interested in discussing a commercial building project. The project involves a 10-story office complex in downtown.')

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }))

    // Verify loading state
    await waitFor(() => {
      expect(screen.getByText(/sending/i)).toBeInTheDocument()
    })

    // Verify success state
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })

    // Verify form was submitted with correct data
    expect(submitContactForm).toHaveBeenCalledWith({
      name: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'Commercial Project Inquiry',
      message: 'I am interested in discussing a commercial building project. The project involves a 10-story office complex in downtown.'
    })

    // Verify form is reset
    expect(screen.getByLabelText(/full name/i)).toHaveValue('')
    expect(screen.getByLabelText(/email/i)).toHaveValue('')
  })
})
```

## End-to-End Testing

E2E tests verify complete user workflows in a real browser environment using Playwright.

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E Test Examples

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/john smith.*architect/i)
    
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /experienced architect/i)
  })

  test('loads all sections correctly', async ({ page }) => {
    await expect(page.locator('#hero')).toBeVisible()
    await expect(page.locator('#portfolio')).toBeVisible()
    await expect(page.locator('#experience')).toBeVisible()
    await expect(page.locator('#skills')).toBeVisible()
    await expect(page.locator('#education')).toBeVisible()
    await expect(page.locator('#contact')).toBeVisible()
  })

  test('navigation menu works correctly', async ({ page }) => {
    // Test desktop navigation
    await page.locator('nav a[href="#portfolio"]').click()
    await expect(page.locator('#portfolio')).toBeInViewport()

    await page.locator('nav a[href="#contact"]').click()
    await expect(page.locator('#contact')).toBeInViewport()
  })

  test('mobile navigation works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Open mobile menu
    await page.locator('[data-testid="mobile-menu-button"]').click()
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Navigate to section
    await page.locator('[data-testid="mobile-menu"] a[href="#portfolio"]').click()
    await expect(page.locator('#portfolio')).toBeInViewport()
    await expect(page.locator('[data-testid="mobile-menu"]')).not.toBeVisible()
  })

  test('hero CTA buttons work', async ({ page }) => {
    await page.locator('button:has-text("View My Work")').click()
    await expect(page.locator('#portfolio')).toBeInViewport()

    await page.locator('button:has-text("Get in Touch")').click()
    await expect(page.locator('#contact')).toBeInViewport()
  })
})
```

```typescript
// tests/e2e/contact.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact')
  })

  test('submits contact form successfully', async ({ page }) => {
    // Fill out form
    await page.fill('[data-testid="contact-name"]', 'Test User')
    await page.fill('[data-testid="contact-email"]', 'test@example.com')
    await page.fill('[data-testid="contact-subject"]', 'Test Project')
    await page.fill('[data-testid="contact-message"]', 'This is a test message for the contact form.')

    // Submit form
    await page.click('button[type="submit"]')

    // Verify loading state
    await expect(page.locator('text=Sending Message')).toBeVisible()

    // Verify success message
    await expect(page.locator('text=Message Sent Successfully')).toBeVisible({ timeout: 10000 })
  })

  test('shows validation errors for empty fields', async ({ page }) => {
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Subject is required')).toBeVisible()
    await expect(page.locator('text=Message is required')).toBeVisible()
  })

  test('validates email format', async ({ page }) => {
    await page.fill('[data-testid="contact-email"]', 'invalid-email')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
  })

  test('contact information is displayed correctly', async ({ page }) => {
    await expect(page.locator('text=john@johnarchitect.com')).toBeVisible()
    await expect(page.locator('text=+1 (555) 123-4567')).toBeVisible()
    await expect(page.locator('text=San Francisco, CA')).toBeVisible()
  })
})
```

```typescript
// tests/e2e/portfolio.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Portfolio Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#portfolio')
  })

  test('displays portfolio projects', async ({ page }) => {
    await expect(page.locator('[data-testid="portfolio-grid"]')).toBeVisible()
    
    const projectCards = page.locator('[data-testid="project-card"]')
    await expect(projectCards).toHaveCount(6) // Assuming 6 projects
  })

  test('filters projects by category', async ({ page }) => {
    // Test "All" filter
    await page.click('[data-testid="filter-all"]')
    const allProjects = page.locator('[data-testid="project-card"]')
    await expect(allProjects).toHaveCount(6)

    // Test "Residential" filter
    await page.click('[data-testid="filter-residential"]')
    const residentialProjects = page.locator('[data-testid="project-card"]')
    await expect(residentialProjects).toHaveCount(2) // Assuming 2 residential projects
  })

  test('opens project modal on click', async ({ page }) => {
    await page.click('[data-testid="project-card"]:first-child')
    
    await expect(page.locator('[data-testid="project-modal"]')).toBeVisible()
    await expect(page.locator('[data-testid="project-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="project-description"]')).toBeVisible()
  })

  test('closes project modal', async ({ page }) => {
    // Open modal
    await page.click('[data-testid="project-card"]:first-child')
    await expect(page.locator('[data-testid="project-modal"]')).toBeVisible()

    // Close with close button
    await page.click('[data-testid="modal-close"]')
    await expect(page.locator('[data-testid="project-modal"]')).not.toBeVisible()

    // Open modal again
    await page.click('[data-testid="project-card"]:first-child')
    
    // Close with escape key
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-testid="project-modal"]')).not.toBeVisible()
  })
})
```

## Visual Regression Testing

Visual regression testing ensures UI components look correct across different browsers and screen sizes.

### Storybook Integration

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react'

const config: StorybookConfig = {
  stories: ['../app/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}

export default config
```

### Component Stories

```typescript
// app/components/Hero.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import Hero from './Hero'

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}
```

### Chromatic Configuration

```javascript
// .github/workflows/chromatic.yml
name: 'Chromatic'

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  chromatic-deployment:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Publish to Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

## Performance Testing

### Lighthouse CI

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      startServerCommand: 'npm start',
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://your-lhci-server.com',
    },
  },
}
```

### Web Vitals Testing

```typescript
// tests/performance/web-vitals.test.ts
import { test, expect } from '@playwright/test'

test.describe('Web Vitals', () => {
  test('has good Core Web Vitals scores', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load completely
    await page.waitForLoadState('networkidle')

    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })

    expect(lcp).toBeLessThan(2500) // LCP should be less than 2.5s

    // Measure First Input Delay (FID) simulation
    await page.click('button')
    
    // Measure Cumulative Layout Shift (CLS)
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          resolve(clsValue)
        }).observe({ entryTypes: ['layout-shift'] })
        
        // Trigger some layout shifts for testing
        setTimeout(() => resolve(clsValue), 1000)
      })
    })

    expect(cls).toBeLessThan(0.1) // CLS should be less than 0.1
  })
})
```

## Test Coverage

### Coverage Configuration

```javascript
// jest.config.js (coverage section)
module.exports = {
  // ... other config
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/*.stories.{js,jsx,ts,tsx}',
    '!app/**/index.{js,jsx,ts,tsx}',
    '!app/layout.tsx', // Exclude Next.js app layout
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './app/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
}
```

### Running Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/lcov-report/index.html

# Coverage with specific threshold
npm run test -- --coverage --coverageThreshold='{"global":{"branches":85}}'
```

## Test Data Management

### Mock Data Factory

```typescript
// tests/fixtures/mockData.ts
export interface MockProject {
  id: string
  title: string
  category: string
  description: string
  image: string
  technologies: string[]
}

export const createMockProject = (overrides: Partial<MockProject> = {}): MockProject => ({
  id: '1',
  title: 'Modern Residential Complex',
  category: 'Residential',
  description: 'A contemporary 50-unit residential complex featuring sustainable design principles.',
  image: '/images/project-1.jpg',
  technologies: ['Sustainable Design', 'BIM', 'LEED Certification'],
  ...overrides,
})

export const createMockProjects = (count: number): MockProject[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockProject({
      id: (index + 1).toString(),
      title: `Project ${index + 1}`,
    })
  )
}

export const mockContactFormData = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I am interested in discussing a new project with you.',
}
```

### Test Utilities

```typescript
// tests/fixtures/testUtils.tsx
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
}

// Mock window.scrollTo
export const mockScrollTo = () => {
  global.scrollTo = jest.fn()
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))
```

## Continuous Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run type-check

    - name: Run unit tests
      run: npm run test:coverage

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

    - name: Build application
      run: npm run build

  e2e:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright browsers
      run: npx playwright install --with-deps

    - name: Run Playwright tests
      run: npx playwright test

    - name: Upload Playwright report
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Best Practices

### Test Organization

1. **Group Related Tests**: Use `describe` blocks to group related test cases
2. **Clear Test Names**: Use descriptive test names that explain the expected behavior
3. **Single Assertion**: Each test should verify one specific behavior
4. **Setup and Teardown**: Use `beforeEach` and `afterEach` for test setup and cleanup

### Test Writing Guidelines

```typescript
// ✅ Good test structure
describe('ContactForm', () => {
  beforeEach(() => {
    render(<ContactForm />)
  })

  it('should display validation error when email is empty', () => {
    // Arrange - already done in beforeEach

    // Act
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    // Assert
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })
})

// ❌ Bad test structure
test('contact form', () => {
  render(<ContactForm />)
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByText('Email is required')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText(/email/), { target: { value: 'test' } })
  expect(screen.getByText('Invalid email')).toBeInTheDocument()
})
```

### Accessibility Testing

```typescript
// Example accessibility test
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should not have accessibility violations', async () => {
  const { container } = render(<ContactForm />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Performance Testing Best Practices

1. **Test Critical User Paths**: Focus on important user workflows
2. **Set Realistic Thresholds**: Use reasonable performance budgets
3. **Test on Different Devices**: Include mobile and desktop testing
4. **Monitor Trends**: Track performance metrics over time

## Troubleshooting

### Common Test Issues

1. **Async Operations Not Waiting**
   ```typescript
   // ❌ Wrong
   fireEvent.click(button)
   expect(screen.getByText('Loading')).toBeInTheDocument()

   // ✅ Correct
   fireEvent.click(button)
   await waitFor(() => {
     expect(screen.getByText('Loading')).toBeInTheDocument()
   })
   ```

2. **Mock Not Working**
   ```typescript
   // Ensure mocks are properly cleared
   beforeEach(() => {
     jest.clearAllMocks()
   })
   ```

3. **Tests Failing in CI but Passing Locally**
   - Check for timing issues with `waitFor`
   - Ensure all dependencies are available in CI
   - Verify environment variables are set correctly

### Debugging Tests

```typescript
// Add debug helpers
import { screen } from '@testing-library/react'

// Log current DOM state
screen.debug()

// Log specific element
screen.debug(screen.getByRole('button'))

// Use data-testid for reliable element selection
<button data-testid="submit-button">Submit</button>

// Query by test ID
screen.getByTestId('submit-button')
```

This comprehensive testing guide provides everything needed to maintain high-quality code with thorough test coverage across all aspects of the application.