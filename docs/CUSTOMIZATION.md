# Customization Guide

This comprehensive guide will walk you through personalizing the Architect Resume Portfolio to showcase your unique professional brand and portfolio.

## Table of Contents

- [Quick Start Customization](#quick-start-customization)
- [Personal Information](#personal-information)
- [Visual Design](#visual-design)
- [Content Customization](#content-customization)
- [Portfolio Projects](#portfolio-projects)
- [Contact Information](#contact-information)
- [Advanced Customization](#advanced-customization)
- [Adding New Sections](#adding-new-sections)
- [Performance Optimization](#performance-optimization)
- [SEO Customization](#seo-customization)

## Quick Start Customization

### 5-Minute Setup Checklist

Complete these essential customizations to make the portfolio yours:

1. **Personal Details** (2 minutes)
   - [ ] Update name and title in `Hero.tsx`
   - [ ] Replace contact information in `Contact.tsx`
   - [ ] Update social media links

2. **Profile Content** (3 minutes)
   - [ ] Replace placeholder text with your bio
   - [ ] Update achievement statistics
   - [ ] Customize call-to-action buttons

### Essential File Locations

```
app/components/
├── Hero.tsx          # Name, title, bio, CTA buttons
├── Contact.tsx       # Contact info, email, phone, social links
├── Portfolio.tsx     # Project showcase
├── Experience.tsx    # Work history
├── Skills.tsx        # Technical skills
└── Education.tsx     # Academic background
```

## Personal Information

### Hero Section Customization

Edit `app/components/Hero.tsx` to update your primary information:

```typescript
// app/components/Hero.tsx
export default function Hero() {
  const personalInfo = {
    name: "Your Full Name",
    title: "Your Professional Title", // e.g., "Senior Architect & Urban Designer"
    bio: "Your professional summary here. This should be 2-3 sentences that capture your expertise and passion.",
    yearsExperience: 15, // Update with your actual experience
    projectsCompleted: 100, // Update with your project count
    awardsReceived: 5, // Optional: number of awards/recognition
  }

  const ctaButtons = [
    {
      text: "View My Work",
      href: "#portfolio",
      primary: true
    },
    {
      text: "Download CV", // Optional: link to your CV
      href: "/path-to-your-cv.pdf",
      primary: false
    }
  ]

  // ... rest of component
}
```

### Profile Image Setup

1. **Add Your Photo**
   ```bash
   # Add your professional headshot to the public folder
   public/images/profile-photo.jpg
   ```

2. **Update Image References**
   ```typescript
   // In Hero.tsx
   <Image
     src="/images/profile-photo.jpg"
     alt="Your Name - Professional Headshot"
     width={400}
     height={400}
     className="rounded-full"
   />
   ```

### Achievement Statistics

Customize the statistics that appear in your hero section:

```typescript
const achievements = [
  {
    number: "15+",
    label: "Years Experience",
    description: "In architectural design and project management"
  },
  {
    number: "150+",
    label: "Projects Completed",
    description: "Residential, commercial, and public buildings"
  },
  {
    number: "25+",
    label: "Awards Received",
    description: "Industry recognition and design excellence"
  },
  {
    number: "5M+",
    label: "Sq Ft Designed",
    description: "Total area of completed projects"
  }
]
```

## Visual Design

### Color Scheme Customization

The portfolio uses a sophisticated architect-themed color palette. Customize colors in `tailwind.config.ts`:

```typescript
// tailwind.config.ts
const config: Config = {
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        architect: {
          50: '#f8f7f4',   // Very light cream
          100: '#e8e5dd',  // Light cream
          200: '#d1cabb',  // Warm beige
          300: '#b9ae99',  // Medium beige
          400: '#a19377',  // Warm brown
          500: '#8a7855',  // Main brand color
          600: '#6e6044',  // Dark brown
          700: '#524833',  // Very dark brown
          800: '#373022',  // Almost black brown
          900: '#1b1811',  // Deep black brown
        },
        // Accent colors
        accent: {
          gold: '#d4af37',    // Classic gold
          copper: '#b87333',  // Warm copper
          // Add your custom accent colors
          blue: '#2563eb',    // Professional blue
          green: '#059669',   // Success green
        }
      }
    }
  }
}
```

### Typography Customization

Update fonts to match your personal brand:

```typescript
// tailwind.config.ts
fontFamily: {
  'serif': ['Playfair Display', 'serif'],      // Elegant serif for headings
  'sans': ['Inter', 'system-ui', 'sans-serif'], // Clean sans-serif for body
  'mono': ['JetBrains Mono', 'monospace'],      // Technical text
  // Add custom fonts
  'brand': ['Your Custom Font', 'serif'],       // Your signature font
}
```

### Adding Custom Fonts

1. **Google Fonts (Recommended)**
   ```typescript
   // app/layout.tsx
   import { Inter, Playfair_Display, Your_Custom_Font } from 'next/font/google'

   const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
   const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
   const customFont = Your_Custom_Font({ subsets: ['latin'], variable: '--font-custom' })

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en" className={`${inter.variable} ${playfair.variable} ${customFont.variable}`}>
         {/* ... */}
       </html>
     )
   }
   ```

2. **Local Fonts**
   ```typescript
   // app/layout.tsx
   import localFont from 'next/font/local'

   const customFont = localFont({
     src: [
       {
         path: '../public/fonts/CustomFont-Regular.woff2',
         weight: '400',
         style: 'normal',
       },
       {
         path: '../public/fonts/CustomFont-Bold.woff2',
         weight: '700',
         style: 'normal',
       },
     ],
     variable: '--font-custom'
   })
   ```

### Layout and Spacing

Customize section spacing and layout:

```typescript
// Global spacing utilities in globals.css
.section-padding {
  @apply py-20 lg:py-24; /* Adjust section padding */
}

.container-padding {
  @apply px-4 sm:px-6 lg:px-8; /* Adjust container padding */
}

.section-title {
  @apply text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-architect-800 mb-6;
}
```

## Content Customization

### Professional Summary

Update your professional narrative throughout the components:

```typescript
// app/components/Hero.tsx
const professionalSummary = {
  headline: "Transforming Ideas into Architectural Excellence",
  description: `With over ${personalInfo.yearsExperience} years of experience in architectural design,
    I specialize in creating sustainable, innovative spaces that blend functionality with aesthetic beauty.
    My work spans residential, commercial, and public projects, each crafted with attention to detail
    and environmental consciousness.`,
  specialties: [
    "Sustainable Design",
    "Urban Planning", 
    "Historic Restoration",
    "Commercial Architecture"
  ]
}
```

### Mission Statement

Add a personal mission or philosophy section:

```typescript
// app/components/About.tsx (create new component)
const missionStatement = {
  title: "Design Philosophy",
  statement: "I believe architecture should not only shelter and inspire but also contribute positively to our environment and communities. Every project is an opportunity to create spaces that enhance human experience while respecting our planet.",
  principles: [
    {
      title: "Sustainability First",
      description: "Every design decision considers environmental impact and long-term sustainability."
    },
    {
      title: "Human-Centered Design",
      description: "Spaces should serve the people who use them, promoting well-being and productivity."
    },
    {
      title: "Contextual Sensitivity",
      description: "New constructions should harmonize with their surroundings and local culture."
    }
  ]
}
```

## Portfolio Projects

### Adding Your Projects

Replace the example projects with your actual work in `app/components/Portfolio.tsx`:

```typescript
// app/components/Portfolio.tsx
const projects = [
  {
    id: 1,
    title: "Your Project Name",
    category: "Residential", // or "Commercial", "Public", "Urban Planning"
    year: "2023",
    location: "City, State/Country",
    area: "5,000 sq ft", // Optional
    description: "Brief description of the project, your role, and key achievements.",
    longDescription: `Detailed description for modal view. Include:
      - Project objectives and challenges
      - Your design approach and solutions
      - Materials and technologies used
      - Awards or recognition received
      - Client testimonials (if available)`,
    image: "/images/projects/project-1-main.jpg",
    images: [
      "/images/projects/project-1-1.jpg",
      "/images/projects/project-1-2.jpg",
      "/images/projects/project-1-3.jpg"
    ],
    technologies: ["BIM", "Sustainable Design", "LEED Certification"],
    awards: ["Architecture Excellence Award 2023"], // Optional
    client: "Client Name", // Optional
    budget: "$2.5M", // Optional
    status: "Completed", // or "In Progress", "Under Construction"
    website: "https://project-website.com", // Optional
    featured: true // Show in featured projects
  },
  // Add more projects...
]
```

### Project Categories

Customize project categories to match your portfolio:

```typescript
const projectCategories = [
  { id: 'all', name: 'All Projects', count: projects.length },
  { id: 'residential', name: 'Residential', count: residentialCount },
  { id: 'commercial', name: 'Commercial', count: commercialCount },
  { id: 'public', name: 'Public Buildings', count: publicCount },
  { id: 'urban', name: 'Urban Planning', count: urbanCount },
  { id: 'renovation', name: 'Renovations', count: renovationCount },
  // Add custom categories
  { id: 'sustainable', name: 'Sustainable Design', count: sustainableCount },
  { id: 'historic', name: 'Historic Preservation', count: historicCount }
]
```

### Image Management

1. **Organize Project Images**
   ```
   public/images/projects/
   ├── project-1/
   │   ├── main.jpg          # Primary image
   │   ├── exterior-1.jpg
   │   ├── exterior-2.jpg
   │   ├── interior-1.jpg
   │   └── detail-1.jpg
   ├── project-2/
   │   └── ...
   ```

2. **Image Optimization**
   ```typescript
   // Use Next.js Image component for optimization
   <Image
     src="/images/projects/project-1/main.jpg"
     alt="Project Name - Main View"
     width={800}
     height={600}
     quality={85}
     placeholder="blur"
     blurDataURL="data:image/jpeg;base64,..." // Generate blur placeholder
   />
   ```

3. **Responsive Images**
   ```typescript
   <Image
     src="/images/projects/project-1/main.jpg"
     alt="Project Name"
     fill
     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
     className="object-cover"
   />
   ```

## Contact Information

### Contact Details

Update your contact information in `app/components/Contact.tsx`:

```typescript
// app/components/Contact.tsx
const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'your.email@domain.com',
    href: 'mailto:your.email@domain.com'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Your City, State',
    href: 'https://maps.google.com/?q=Your+City,+State'
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Mon-Fri 9AM-6PM EST', // Update timezone
    href: null
  },
  {
    icon: Calendar,
    label: 'Schedule Meeting',
    value: 'Book Consultation',
    href: 'https://calendly.com/yourname' // Optional: add booking link
  }
]
```

### Social Media Links

Update your professional social media profiles:

```typescript
const socialLinks = [
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/yourprofile',
    color: 'hover:text-blue-600'
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://instagram.com/yourprofile',
    color: 'hover:text-pink-600'
  },
  {
    icon: Twitter, // or X
    label: 'Twitter',
    href: 'https://twitter.com/yourhandle',
    color: 'hover:text-blue-400'
  },
  {
    icon: Globe,
    label: 'Portfolio Website',
    href: 'https://yourwebsite.com',
    color: 'hover:text-architect-600'
  },
  // Add professional platforms
  {
    icon: ExternalLink,
    label: 'Behance',
    href: 'https://behance.net/yourprofile',
    color: 'hover:text-blue-500'
  },
  {
    icon: ExternalLink,
    label: 'ArchDaily',
    href: 'https://archdaily.com/office/yourprofile',
    color: 'hover:text-orange-500'
  }
]
```

### Contact Form Integration

Set up a working contact form:

1. **EmailJS Integration** (Recommended for client-side)
   ```bash
   npm install @emailjs/browser
   ```

   ```typescript
   // lib/emailjs.ts
   import emailjs from '@emailjs/browser'

   export const sendEmail = async (formData: ContactFormData) => {
     try {
       const result = await emailjs.send(
         'YOUR_SERVICE_ID',
         'YOUR_TEMPLATE_ID',
         formData,
         'YOUR_PUBLIC_KEY'
       )
       return { success: true, data: result }
     } catch (error) {
       return { success: false, error }
     }
   }
   ```

2. **Netlify Forms** (For Netlify hosting)
   ```typescript
   // In Contact.tsx form element
   <form 
     name="contact" 
     method="POST" 
     data-netlify="true"
     onSubmit={handleSubmit}
   >
     <input type="hidden" name="form-name" value="contact" />
     {/* form fields */}
   </form>
   ```

3. **Custom API Route** (Next.js API)
   ```typescript
   // app/api/contact/route.ts
   import { NextRequest, NextResponse } from 'next/server'
   import nodemailer from 'nodemailer'

   export async function POST(request: NextRequest) {
     const { name, email, subject, message } = await request.json()

     // Configure your email service
     const transporter = nodemailer.createTransporter({
       // Your email configuration
     })

     try {
       await transporter.sendMail({
         from: process.env.SMTP_FROM,
         to: process.env.CONTACT_EMAIL,
         subject: `Portfolio Contact: ${subject}`,
         html: `
           <h2>New Contact Form Submission</h2>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Subject:</strong> ${subject}</p>
           <p><strong>Message:</strong> ${message}</p>
         `
       })

       return NextResponse.json({ success: true })
     } catch (error) {
       return NextResponse.json({ success: false, error: error.message }, { status: 500 })
     }
   }
   ```

## Advanced Customization

### Adding Animation Variants

Create custom Framer Motion animations:

```typescript
// lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

// Custom hover animations
export const hoverGrow = {
  whileHover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  whileTap: { scale: 0.95 }
}
```

### Custom Components

Create reusable components for your portfolio:

```typescript
// app/components/ui/ProjectCard.tsx
interface ProjectCardProps {
  project: Project
  onClick: () => void
  featured?: boolean
}

export default function ProjectCard({ project, onClick, featured = false }: ProjectCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={hoverGrow.whileHover}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-white shadow-lg",
        featured && "md:col-span-2 md:row-span-2"
      )}
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-accent-gold">
            {project.category}
          </span>
          <span className="text-sm text-architect-600">
            {project.year}
          </span>
        </div>
        
        <h3 className="text-xl font-serif font-bold text-architect-800 mb-2">
          {project.title}
        </h3>
        
        <p className="text-architect-600 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
        
        {project.awards && project.awards.length > 0 && (
          <div className="flex items-center text-accent-gold text-sm">
            <Award className="w-4 h-4 mr-1" />
            <span>Award Winner</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
```

### Dark Mode Support

Add dark mode functionality:

```typescript
// app/providers/ThemeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme
    if (stored) {
      setTheme(stored)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

Update Tailwind config for dark mode:

```typescript
// tailwind.config.ts
const config: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Add dark mode variants
        dark: {
          50: '#1a1a1a',
          100: '#2d2d2d',
          200: '#404040',
          300: '#525252',
          400: '#666666',
          500: '#7a7a7a',
          600: '#8e8e8e',
          700: '#a2a2a2',
          800: '#b6b6b6',
          900: '#cacaca',
        }
      }
    }
  }
}
```

## Adding New Sections

### Creating a Testimonials Section

```typescript
// app/components/Testimonials.tsx
interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  image?: string
  rating: number
  project?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Client Name",
    role: "CEO",
    company: "Company Name",
    content: "Working with [Your Name] was an exceptional experience. Their attention to detail and innovative design solutions exceeded our expectations.",
    image: "/images/testimonials/client-1.jpg",
    rating: 5,
    project: "Office Complex Renovation"
  }
  // Add more testimonials
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-architect-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-architect-800 mb-4">
            Client Testimonials
          </h2>
          <p className="text-xl text-architect-600 max-w-3xl mx-auto">
            Hear what clients say about working with me
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-architect-700 mb-6 italic">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex items-center">
                {testimonial.image && (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                )}
                <div>
                  <div className="font-medium text-architect-800">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-architect-600">
                    {testimonial.role}, {testimonial.company}
                  </div>
                  {testimonial.project && (
                    <div className="text-xs text-accent-gold">
                      Project: {testimonial.project}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Adding a Blog/News Section

```typescript
// app/components/Blog.tsx
interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  publishedAt: string
  category: string
  readTime: number
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Sustainable Architecture: The Future of Building Design",
    excerpt: "Exploring how sustainable practices are reshaping modern architecture and creating environmentally conscious spaces.",
    content: "Full blog post content...",
    image: "/images/blog/sustainable-architecture.jpg",
    author: "Your Name",
    publishedAt: "2024-01-15",
    category: "Sustainability",
    readTime: 5,
    slug: "sustainable-architecture-future-building-design"
  }
  // Add more posts
]

export default function Blog() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-architect-800 mb-4">
            Latest Insights
          </h2>
          <p className="text-xl text-architect-600 max-w-3xl mx-auto">
            Thoughts on architecture, design trends, and industry insights
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-accent-gold">
                    {post.category}
                  </span>
                  <span className="text-sm text-architect-600">
                    {post.readTime} min read
                  </span>
                </div>
                
                <h3 className="text-xl font-serif font-bold text-architect-800 mb-3">
                  {post.title}
                </h3>
                
                <p className="text-architect-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-architect-600">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-accent-gold hover:text-accent-copper transition-colors font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-architect-800 text-white rounded-full hover:bg-architect-700 transition-colors"
          >
            View All Posts
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

## Performance Optimization

### Image Optimization Strategy

```typescript
// lib/imageOptimization.ts
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  width: number,
  height: number
) => ({
  src,
  alt,
  width,
  height,
  quality: 85,
  placeholder: 'blur' as const,
  blurDataURL: generateBlurDataURL(width, height),
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
})

export const generateBlurDataURL = (width: number, height: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, width, height)
  }
  return canvas.toDataURL()
}
```

### Lazy Loading Components

```typescript
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic'

const Portfolio = dynamic(() => import('./Portfolio'), {
  loading: () => <div className="animate-pulse bg-architect-100 h-96 rounded-lg" />
})

const Contact = dynamic(() => import('./Contact'), {
  loading: () => <div className="animate-pulse bg-architect-100 h-96 rounded-lg" />
})
```

## SEO Customization

### Meta Tags Configuration

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Your Name - Architect Portfolio',
    template: '%s | Your Name - Architect'
  },
  description: 'Experienced architect specializing in sustainable design, residential and commercial projects. View my portfolio of innovative architectural solutions.',
  keywords: [
    'architect',
    'architectural design',
    'sustainable architecture',
    'residential design',
    'commercial architecture',
    'your location',
    'your specialties'
  ],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourwebsite.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourwebsite.com',
    title: 'Your Name - Architect Portfolio',
    description: 'Experienced architect specializing in sustainable design and innovative architectural solutions.',
    siteName: 'Your Name - Architect',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Your Name - Architect Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name - Architect Portfolio',
    description: 'Experienced architect specializing in sustainable design and innovative architectural solutions.',
    images: ['/images/twitter-image.jpg'],
    creator: '@yourtwitterhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

### Structured Data

```typescript
// app/components/StructuredData.tsx
export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Your Name",
    "jobTitle": "Architect",
    "description": "Experienced architect specializing in sustainable design and innovative architectural solutions.",
    "url": "https://yourwebsite.com",
    "image": "https://yourwebsite.com/images/profile-photo.jpg",
    "email": "your.email@domain.com",
    "telephone": "+1-555-123-4567",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Your City",
      "addressRegion": "Your State",
      "addressCountry": "Your Country"
    },
    "sameAs": [
      "https://linkedin.com/in/yourprofile",
      "https://instagram.com/yourprofile",
      "https://behance.net/yourprofile"
    ],
    "knowsAbout": [
      "Architectural Design",
      "Sustainable Architecture",
      "Urban Planning",
      "Building Information Modeling",
      "LEED Certification"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Your University"
    },
    "memberOf": {
      "@type": "Organization",
      "name": "American Institute of Architects"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
```

This comprehensive customization guide provides everything you need to personalize the Architect Resume Portfolio and make it truly represent your professional brand and expertise. Remember to test all customizations thoroughly and maintain consistency across all sections of your portfolio.