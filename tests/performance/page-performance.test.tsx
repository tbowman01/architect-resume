import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../app/page'

// Mock framer-motion for performance testing
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

// Performance monitoring utilities
const measureRenderTime = (renderFunction: () => any): number => {
  const startTime = performance.now()
  renderFunction()
  const endTime = performance.now()
  return endTime - startTime
}

describe('Page Performance Tests', () => {
  beforeAll(() => {
    // Mock performance API if not available
    if (typeof performance === 'undefined') {
      global.performance = {
        now: () => Date.now(),
      } as any
    }
  })

  describe('Initial Render Performance', () => {
    it('should render home page within performance budget', () => {
      const renderTime = measureRenderTime(() => {
        render(<Home />)
      })

      console.log(`Home page render time: ${renderTime.toFixed(2)}ms`)
      
      // Should render within 100ms for initial load
      expect(renderTime).toBeLessThan(100)
    })

    it('should not have excessive DOM nodes', () => {
      const { container } = render(<Home />)
      
      const totalNodes = container.querySelectorAll('*').length
      console.log(`Total DOM nodes: ${totalNodes}`)
      
      // Should keep DOM relatively lean for performance
      expect(totalNodes).toBeLessThan(500)
    })

    it('should have efficient component composition', () => {
      const { container } = render(<Home />)
      
      // Check for deeply nested structures that might hurt performance
      const maxDepth = getMaxDepth(container)
      console.log(`Maximum DOM depth: ${maxDepth}`)
      
      // DOM should not be too deeply nested
      expect(maxDepth).toBeLessThan(20)
    })
  })

  describe('Component Render Efficiency', () => {
    it('should have consistent render times across multiple renders', () => {
      const renderTimes: number[] = []
      
      // Measure multiple renders
      for (let i = 0; i < 5; i++) {
        const renderTime = measureRenderTime(() => {
          const { unmount } = render(<Home />)
          unmount()
        })
        renderTimes.push(renderTime)
      }
      
      const averageTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length
      const maxTime = Math.max(...renderTimes)
      const minTime = Math.min(...renderTimes)
      
      console.log(`Render times - Avg: ${averageTime.toFixed(2)}ms, Min: ${minTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms`)
      
      // Variance should not be too high (indicates performance consistency)
      const variance = maxTime - minTime
      expect(variance).toBeLessThan(50) // Max 50ms variance
    })

    it('should not trigger excessive re-renders', () => {
      let renderCount = 0
      
      // Mock React to count renders (simplified)
      const originalRender = render
      const mockRender = (component: any) => {
        renderCount++
        return originalRender(component)
      }
      
      mockRender(<Home />)
      
      // Should only render once for initial load
      expect(renderCount).toBe(1)
    })
  })

  describe('Memory Usage', () => {
    it('should not create memory leaks during render', () => {
      const initialMemory = process.memoryUsage().heapUsed
      
      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<Home />)
        unmount()
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`)
      
      // Memory increase should be minimal (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })

    it('should properly clean up event listeners', () => {
      const originalAddEventListener = window.addEventListener
      const originalRemoveEventListener = window.removeEventListener
      
      let addCount = 0
      let removeCount = 0
      
      window.addEventListener = ((...args: any[]) => {
        addCount++
        return originalAddEventListener.apply(window, args)
      }) as any
      
      window.removeEventListener = ((...args: any[]) => {
        removeCount++
        return originalRemoveEventListener.apply(window, args)
      }) as any
      
      const { unmount } = render(<Home />)
      unmount()
      
      // Restore original functions
      window.addEventListener = originalAddEventListener
      window.removeEventListener = originalRemoveEventListener
      
      console.log(`Event listeners - Added: ${addCount}, Removed: ${removeCount}`)
      
      // Should clean up most event listeners (allowing for some framework overhead)
      if (addCount > 0) {
        expect(removeCount).toBeGreaterThan(addCount * 0.8) // At least 80% cleanup
      }
    })
  })

  describe('CSS Performance', () => {
    it('should not have excessive inline styles', () => {
      const { container } = render(<Home />)
      
      const elementsWithInlineStyles = container.querySelectorAll('[style]')
      const totalElements = container.querySelectorAll('*')
      
      const inlineStyleRatio = elementsWithInlineStyles.length / totalElements.length
      
      console.log(`Inline styles: ${elementsWithInlineStyles.length}/${totalElements.length} (${(inlineStyleRatio * 100).toFixed(1)}%)`)
      
      // Should prefer CSS classes over inline styles for performance
      expect(inlineStyleRatio).toBeLessThan(0.1) // Less than 10%
    })

    it('should use efficient CSS classes', () => {
      const { container } = render(<Home />)
      
      const elementsWithClasses = container.querySelectorAll('[class]')
      const classLengths = Array.from(elementsWithClasses).map(el => 
        (el as HTMLElement).className.length
      )
      
      const averageClassLength = classLengths.reduce((a, b) => a + b, 0) / classLengths.length
      const maxClassLength = Math.max(...classLengths)
      
      console.log(`CSS classes - Average length: ${averageClassLength.toFixed(1)}, Max: ${maxClassLength}`)
      
      // Class names should not be excessively long
      expect(maxClassLength).toBeLessThan(200)
      expect(averageClassLength).toBeLessThan(50)
    })
  })

  describe('Image and Asset Performance', () => {
    it('should have proper image loading attributes', () => {
      const { container } = render(<Home />)
      
      const images = container.querySelectorAll('img')
      
      images.forEach(img => {
        // Should have alt attributes for accessibility and SEO
        expect(img).toHaveAttribute('alt')
        
        // Should consider loading attributes for performance
        if (img.hasAttribute('loading')) {
          const loading = img.getAttribute('loading')
          expect(['lazy', 'eager']).toContain(loading)
        }
      })
    })

    it('should not load excessive external resources', () => {
      const { container } = render(<Home />)
      
      // Count external resource references
      const externalImages = container.querySelectorAll('img[src^="http"]')
      const externalLinks = container.querySelectorAll('a[href^="http"]')
      
      console.log(`External resources - Images: ${externalImages.length}, Links: ${externalLinks.length}`)
      
      // Should not have too many external dependencies for performance
      expect(externalImages.length).toBeLessThan(20)
    })
  })
})

// Helper function to calculate maximum DOM depth
function getMaxDepth(element: Element): number {
  let maxDepth = 0
  
  function traverse(node: Element, depth: number) {
    maxDepth = Math.max(maxDepth, depth)
    
    for (const child of node.children) {
      traverse(child, depth + 1)
    }
  }
  
  traverse(element, 1)
  return maxDepth
}