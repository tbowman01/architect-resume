import { blogPosts } from '../../app/data/blog'
import { BlogPost } from '../../app/types/blog'

/**
 * Data validation tests for blog posts and content structure
 */

describe('Data Validation Tests', () => {
  describe('Blog Posts Data Validation', () => {
    it('should have valid blog post structure', () => {
      expect(Array.isArray(blogPosts)).toBe(true)
      expect(blogPosts.length).toBeGreaterThan(0)

      blogPosts.forEach((post, index) => {
        expect(post).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          excerpt: expect.any(String),
          content: expect.any(String),
          author: expect.any(String),
          publishDate: expect.any(String),
          readTime: expect.any(Number),
          tags: expect.any(Array),
          featured: expect.any(Boolean)
        })

        console.log(`Blog post ${index + 1}: "${post.title}" - Structure valid ✓`)
      })
    })

    it('should have unique blog post IDs', () => {
      const ids = blogPosts.map(post => post.id)
      const uniqueIds = [...new Set(ids)]

      expect(ids.length).toBe(uniqueIds.length)
      
      if (ids.length !== uniqueIds.length) {
        const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
        console.error('Duplicate IDs found:', duplicates)
      }
    })

    it('should have reasonable content lengths', () => {
      blogPosts.forEach(post => {
        // Title should be meaningful but not too long
        expect(post.title.length).toBeGreaterThan(5)
        expect(post.title.length).toBeLessThan(100)

        // Excerpt should be a good summary
        expect(post.excerpt.length).toBeGreaterThan(20)
        expect(post.excerpt.length).toBeLessThan(200)

        // Content should be substantial
        expect(post.content.length).toBeGreaterThan(100)

        // Read time should be reasonable
        expect(post.readTime).toBeGreaterThan(0)
        expect(post.readTime).toBeLessThan(60) // Assume max 60 minutes

        console.log(`Post "${post.title}": Title(${post.title.length}), Excerpt(${post.excerpt.length}), Content(${post.content.length}), Read time(${post.readTime}min) ✓`)
      })
    })

    it('should have valid publish dates', () => {
      const currentDate = new Date()
      const futureLimit = new Date()
      futureLimit.setFullYear(currentDate.getFullYear() + 1)

      blogPosts.forEach(post => {
        // Should match YYYY-MM-DD format
        expect(post.publishDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)

        const publishDate = new Date(post.publishDate)
        
        // Should be a valid date
        expect(publishDate.toString()).not.toBe('Invalid Date')

        // Should not be too far in the future
        expect(publishDate.getTime()).toBeLessThan(futureLimit.getTime())

        // Should not be too far in the past (assuming no posts older than 10 years)
        const oldLimit = new Date()
        oldLimit.setFullYear(currentDate.getFullYear() - 10)
        expect(publishDate.getTime()).toBeGreaterThan(oldLimit.getTime())

        console.log(`Post "${post.title}": Publish date ${post.publishDate} - Valid ✓`)
      })
    })

    it('should have consistent author information', () => {
      const authors = [...new Set(blogPosts.map(post => post.author))]
      
      // Should have at least one author
      expect(authors.length).toBeGreaterThan(0)

      authors.forEach(author => {
        expect(typeof author).toBe('string')
        expect(author.length).toBeGreaterThan(2)
        expect(author.length).toBeLessThan(50)
      })

      console.log(`Found ${authors.length} unique author(s): ${authors.join(', ')}`)
    })

    it('should have valid and useful tags', () => {
      const allTags = blogPosts.flatMap(post => post.tags)
      const uniqueTags = [...new Set(allTags)]

      expect(uniqueTags.length).toBeGreaterThan(0)

      uniqueTags.forEach(tag => {
        expect(typeof tag).toBe('string')
        expect(tag.length).toBeGreaterThan(1)
        expect(tag.length).toBeLessThan(30)
        
        // Should not contain special characters that would break URLs
        expect(tag).not.toMatch(/[<>\/\\]/)
        
        // Should be properly capitalized (first letter uppercase)
        expect(tag[0]).toBe(tag[0].toUpperCase())
      })

      // Should have reasonable number of tags per post
      blogPosts.forEach(post => {
        expect(post.tags.length).toBeGreaterThan(0)
        expect(post.tags.length).toBeLessThan(10) // Not too many tags
      })

      console.log(`Found ${uniqueTags.length} unique tags: ${uniqueTags.join(', ')}`)
    })

    it('should have featured posts properly distributed', () => {
      const featuredPosts = blogPosts.filter(post => post.featured)
      const totalPosts = blogPosts.length

      // Should have at least one featured post
      expect(featuredPosts.length).toBeGreaterThan(0)

      // Should not have all posts as featured
      expect(featuredPosts.length).toBeLessThan(totalPosts)

      // Should not have too many featured posts (max 1/3 of total)
      expect(featuredPosts.length).toBeLessThanOrEqual(Math.ceil(totalPosts / 3))

      console.log(`Featured posts: ${featuredPosts.length}/${totalPosts}`)
    })

    it('should have proper image URLs when provided', () => {
      blogPosts.forEach(post => {
        if (post.imageUrl) {
          // Should be a valid URL format
          expect(post.imageUrl).toMatch(/^https?:\/\/.+/)
          
          // Should be from allowed domains (as per next.config.js)
          const allowedDomains = [
            'images.unsplash.com',
            'res.cloudinary.com'
          ]
          
          const isFromAllowedDomain = allowedDomains.some(domain => 
            post.imageUrl!.includes(domain)
          )
          
          if (!isFromAllowedDomain) {
            console.warn(`Image URL not from allowed domains: ${post.imageUrl}`)
          }

          console.log(`Post "${post.title}": Image URL - ${post.imageUrl} ✓`)
        }
      })
    })
  })

  describe('Content Quality Validation', () => {
    it('should have well-formatted markdown content', () => {
      blogPosts.forEach(post => {
        const { content } = post

        // Should contain proper markdown headers
        expect(content).toMatch(/^#\s+/m) // At least one main header

        // Should have proper paragraph structure
        const paragraphs = content.split('\n\n').filter(p => p.trim())
        expect(paragraphs.length).toBeGreaterThan(2) // At least 3 paragraphs/sections

        // Should not have excessive blank lines
        expect(content).not.toMatch(/\n\n\n\n/) // No more than 2 consecutive newlines

        // Should not have trailing whitespace
        const lines = content.split('\n')
        const linesWithTrailingSpace = lines.filter(line => line.endsWith(' '))
        expect(linesWithTrailingSpace.length).toBe(0)

        console.log(`Post "${post.title}": Content formatting - Valid ✓`)
      })
    })

    it('should have consistent writing style', () => {
      blogPosts.forEach(post => {
        const { content, excerpt } = post

        // Content should be longer than excerpt
        expect(content.length).toBeGreaterThan(excerpt.length)

        // Should not have placeholder text
        const placeholders = ['lorem ipsum', 'placeholder', 'todo', 'tbd', 'xxx']
        const contentLower = content.toLowerCase()
        const excerptLower = excerpt.toLowerCase()

        placeholders.forEach(placeholder => {
          expect(contentLower).not.toContain(placeholder)
          expect(excerptLower).not.toContain(placeholder)
        })

        // Should have proper sentence structure
        expect(content).toMatch(/[.!?]\s/) // Proper sentence endings

        console.log(`Post "${post.title}": Writing style - Valid ✓`)
      })
    })

    it('should have SEO-friendly content structure', () => {
      blogPosts.forEach(post => {
        // Title should be SEO-friendly
        expect(post.title).not.toMatch(/[<>]/g) // No HTML tags in title
        expect(post.title.length).toBeGreaterThan(10)
        expect(post.title.length).toBeLessThan(70) // Good for meta titles

        // Excerpt should be good for meta descriptions
        expect(post.excerpt.length).toBeGreaterThan(50)
        expect(post.excerpt.length).toBeLessThan(160) // Good for meta descriptions

        // Content should have good structure for SEO
        const headers = (post.content.match(/^#{1,6}\s+.+$/gm) || [])
        expect(headers.length).toBeGreaterThan(0) // Should have headers for structure

        console.log(`Post "${post.title}": SEO structure - Valid ✓`)
      })
    })
  })

  describe('TypeScript Interface Compliance', () => {
    it('should comply with BlogPost interface', () => {
      blogPosts.forEach(post => {
        // Test that the post matches the BlogPost interface structure
        const blogPost: BlogPost = post

        // Required fields check
        expect(blogPost.id).toBeDefined()
        expect(blogPost.title).toBeDefined()
        expect(blogPost.excerpt).toBeDefined()
        expect(blogPost.content).toBeDefined()
        expect(blogPost.author).toBeDefined()
        expect(blogPost.publishDate).toBeDefined()
        expect(blogPost.readTime).toBeDefined()
        expect(blogPost.tags).toBeDefined()
        expect(blogPost.featured).toBeDefined()

        // Type checks
        expect(typeof blogPost.id).toBe('string')
        expect(typeof blogPost.title).toBe('string')
        expect(typeof blogPost.excerpt).toBe('string')
        expect(typeof blogPost.content).toBe('string')
        expect(typeof blogPost.author).toBe('string')
        expect(typeof blogPost.publishDate).toBe('string')
        expect(typeof blogPost.readTime).toBe('number')
        expect(Array.isArray(blogPost.tags)).toBe(true)
        expect(typeof blogPost.featured).toBe('boolean')

        // Optional fields type check
        if (blogPost.imageUrl) {
          expect(typeof blogPost.imageUrl).toBe('string')
        }

        console.log(`Post "${post.title}": TypeScript compliance - Valid ✓`)
      })
    })
  })
})