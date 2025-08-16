# API Documentation

This document provides comprehensive documentation for the API endpoints used in the Architect Resume Portfolio, including contact form submission, data endpoints, and integration guidelines.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Contact Form API](#contact-form-api)
- [Portfolio Data API](#portfolio-data-api)
- [Experience Data API](#experience-data-api)
- [Skills Data API](#skills-data-api)
- [Blog/News API](#blognews-api)
- [File Upload API](#file-upload-api)
- [Analytics API](#analytics-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Integration Examples](#integration-examples)
- [Testing API Endpoints](#testing-api-endpoints)

## Overview

The Architect Resume Portfolio API provides RESTful endpoints for managing contact forms, portfolio content, and dynamic data. All API endpoints are built using Next.js API routes and follow REST conventions.

### Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

### Response Format

All API responses follow a consistent JSON format:

```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    requestId: string
    version: string
  }
}
```

### Content Types

- Request: `application/json`
- Response: `application/json`
- File uploads: `multipart/form-data`

## Authentication

Currently, the portfolio API uses API key authentication for protected endpoints. Future versions may include JWT-based authentication.

### API Key Authentication

```typescript
// Include in request headers
headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
```

### Environment Variables

```bash
# .env.local
API_SECRET_KEY=your-secret-api-key
CONTACT_EMAIL=your-email@domain.com
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
```

## Contact Form API

### Submit Contact Form

Handles contact form submissions and sends email notifications.

#### Endpoint

```
POST /api/contact
```

#### Request Body

```typescript
interface ContactFormRequest {
  name: string          // Required, 1-100 characters
  email: string         // Required, valid email format
  subject: string       // Required, 1-200 characters
  message: string       // Required, 10-2000 characters
  phone?: string        // Optional, valid phone format
  company?: string      // Optional, 1-100 characters
  projectType?: string  // Optional, project category
  budget?: string       // Optional, budget range
}
```

#### Example Request

```bash
curl -X POST https://your-domain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I am interested in discussing a residential project with you.",
    "phone": "+1-555-123-4567",
    "company": "Doe Construction",
    "projectType": "Residential",
    "budget": "$100k-250k"
  }'
```

#### Response

```typescript
interface ContactFormResponse {
  success: boolean
  data: {
    id: string
    submittedAt: string
    status: 'sent' | 'queued' | 'failed'
  }
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "contact_123456789",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "status": "sent"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "requestId": "req_abc123",
    "version": "1.0"
  }
}
```

#### Implementation

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { rateLimit } from '@/lib/rateLimit'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000),
  phone: z.string().optional(),
  company: z.string().max(100).optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const { success } = await rateLimit(request)
    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.' 
          } 
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)
    
    // Generate unique ID
    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>New Contact Form Submission</h2>
        <p><strong>Contact ID:</strong> ${contactId}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
        ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
        
        <h3>Project Details</h3>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        ${validatedData.projectType ? `<p><strong>Project Type:</strong> ${validatedData.projectType}</p>` : ''}
        ${validatedData.budget ? `<p><strong>Budget:</strong> ${validatedData.budget}</p>` : ''}
        
        <h3>Message</h3>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${validatedData.message.replace(/\n/g, '<br>')}
        </p>
      </div>
    `

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `Portfolio Contact: ${validatedData.subject}`,
      html: emailHtml,
      replyTo: validatedData.email,
    })

    // Send confirmation email to sender
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: validatedData.email,
      subject: 'Thank you for your inquiry',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Thank you for reaching out!</h2>
          <p>Dear ${validatedData.name},</p>
          <p>I've received your inquiry and will get back to you within 24 hours.</p>
          <p><strong>Reference ID:</strong> ${contactId}</p>
          <p>Best regards,<br>Your Name</p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      data: {
        id: contactId,
        submittedAt: new Date().toISOString(),
        status: 'sent'
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: request.headers.get('x-request-id') || 'unknown',
        version: '1.0'
      }
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid form data',
            details: error.errors
          }
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    )
  }
}
```

## Portfolio Data API

### Get Portfolio Projects

Retrieves all portfolio projects with optional filtering and pagination.

#### Endpoint

```
GET /api/portfolio
```

#### Query Parameters

```typescript
interface PortfolioQuery {
  category?: string        // Filter by category
  limit?: number          // Number of items per page (default: 10)
  offset?: number         // Pagination offset (default: 0)
  featured?: boolean      // Show only featured projects
  sort?: 'date' | 'title' | 'category'  // Sort order
  order?: 'asc' | 'desc'  // Sort direction
}
```

#### Example Request

```bash
curl "https://your-domain.com/api/portfolio?category=residential&limit=5&featured=true"
```

#### Response

```typescript
interface PortfolioResponse {
  success: boolean
  data: {
    projects: Project[]
    pagination: {
      total: number
      limit: number
      offset: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

interface Project {
  id: number
  title: string
  category: string
  description: string
  longDescription: string
  year: string
  location: string
  area?: string
  client?: string
  budget?: string
  status: 'completed' | 'in-progress' | 'planned'
  featured: boolean
  images: {
    main: string
    gallery: string[]
    thumbnail: string
  }
  technologies: string[]
  awards?: string[]
  website?: string
  createdAt: string
  updatedAt: string
}
```

#### Implementation

```typescript
// app/api/portfolio/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getProjects } from '@/lib/data/projects'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const filters = {
      category: searchParams.get('category'),
      featured: searchParams.get('featured') === 'true',
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sort: searchParams.get('sort') || 'date',
      order: searchParams.get('order') || 'desc'
    }

    const result = await getProjects(filters)

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: request.headers.get('x-request-id') || 'unknown',
        version: '1.0'
      }
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch portfolio data'
        }
      },
      { status: 500 }
    )
  }
}
```

### Get Single Project

Retrieves detailed information for a specific project.

#### Endpoint

```
GET /api/portfolio/[id]
```

#### Example Request

```bash
curl "https://your-domain.com/api/portfolio/123"
```

#### Implementation

```typescript
// app/api/portfolio/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getProjectById } from '@/lib/data/projects'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getProjectById(parseInt(params.id))
    
    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Project not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch project'
        }
      },
      { status: 500 }
    )
  }
}
```

## Experience Data API

### Get Work Experience

Retrieves professional work experience data.

#### Endpoint

```
GET /api/experience
```

#### Response

```typescript
interface ExperienceResponse {
  success: boolean
  data: Experience[]
}

interface Experience {
  id: number
  company: string
  position: string
  startDate: string
  endDate?: string
  current: boolean
  location: string
  description: string
  achievements: string[]
  technologies: string[]
  projectCount?: number
  teamSize?: number
}
```

#### Implementation

```typescript
// app/api/experience/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getExperience } from '@/lib/data/experience'

export async function GET(request: NextRequest) {
  try {
    const experience = await getExperience()

    return NextResponse.json({
      success: true,
      data: experience,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch experience data'
        }
      },
      { status: 500 }
    )
  }
}
```

## Skills Data API

### Get Skills and Expertise

Retrieves categorized skills and proficiency levels.

#### Endpoint

```
GET /api/skills
```

#### Response

```typescript
interface SkillsResponse {
  success: boolean
  data: {
    categories: SkillCategory[]
    certifications: Certification[]
  }
}

interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

interface Skill {
  id: string
  name: string
  level: number  // 1-100
  yearsExperience: number
  description?: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
}
```

#### Implementation

```typescript
// app/api/skills/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSkills, getCertifications } from '@/lib/data/skills'

export async function GET(request: NextRequest) {
  try {
    const [skills, certifications] = await Promise.all([
      getSkills(),
      getCertifications()
    ])

    return NextResponse.json({
      success: true,
      data: {
        categories: skills,
        certifications
      }
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch skills data'
        }
      },
      { status: 500 }
    )
  }
}
```

## Blog/News API

### Get Blog Posts

Retrieves blog posts and news articles.

#### Endpoint

```
GET /api/blog
```

#### Query Parameters

```typescript
interface BlogQuery {
  category?: string
  limit?: number
  offset?: number
  published?: boolean
  sort?: 'date' | 'title'
  order?: 'asc' | 'desc'
}
```

#### Response

```typescript
interface BlogResponse {
  success: boolean
  data: {
    posts: BlogPost[]
    pagination: Pagination
  }
}

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  category: string
  tags: string[]
  image: string
  readTime: number
  featured: boolean
}
```

#### Implementation

```typescript
// app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/data/blog'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const filters = {
      category: searchParams.get('category'),
      published: searchParams.get('published') !== 'false',
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0'),
      sort: searchParams.get('sort') || 'date',
      order: searchParams.get('order') || 'desc'
    }

    const result = await getBlogPosts(filters)

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch blog posts'
        }
      },
      { status: 500 }
    )
  }
}
```

## File Upload API

### Upload Project Images

Handles file uploads for portfolio projects.

#### Endpoint

```
POST /api/upload
```

#### Request

```typescript
// FormData with files
const formData = new FormData()
formData.append('file', file)
formData.append('category', 'portfolio')
formData.append('projectId', '123')
```

#### Response

```typescript
interface UploadResponse {
  success: boolean
  data: {
    url: string
    filename: string
    size: number
    mimeType: string
    uploadedAt: string
  }
}
```

#### Implementation

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_FILE',
            message: 'No file provided'
          }
        },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'Only JPEG, PNG, and WebP files are allowed'
          }
        },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const uploadPath = path.join(process.cwd(), 'public/uploads', category, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(uploadPath, buffer)

    const fileUrl = `/uploads/${category}/${filename}`

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        filename,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: 'Failed to upload file'
        }
      },
      { status: 500 }
    )
  }
}
```

## Analytics API

### Track Page Views

Records page view analytics.

#### Endpoint

```
POST /api/analytics/pageview
```

#### Request Body

```typescript
interface PageViewRequest {
  page: string
  referrer?: string
  userAgent?: string
  timestamp: string
}
```

#### Implementation

```typescript
// app/api/analytics/pageview/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { trackPageView } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, referrer, userAgent, timestamp } = body

    // Track the page view
    await trackPageView({
      page,
      referrer,
      userAgent: userAgent || request.headers.get('user-agent'),
      ip: request.ip || request.headers.get('x-forwarded-for'),
      timestamp: timestamp || new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      data: { tracked: true }
    })

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TRACKING_ERROR',
          message: 'Failed to track page view'
        }
      },
      { status: 500 }
    )
  }
}
```

## Error Handling

### Error Response Format

All API errors follow a consistent format:

```typescript
interface APIError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    timestamp: string
    requestId: string
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Error Handler Middleware

```typescript
// lib/errorHandler.ts
import { NextRequest, NextResponse } from 'next/server'

export function withErrorHandling(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      console.error('API Error:', error)
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred'
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: request.headers.get('x-request-id') || 'unknown'
          }
        },
        { status: 500 }
      )
    }
  }
}
```

## Rate Limiting

### Implementation

```typescript
// lib/rateLimit.ts
import { NextRequest } from 'next/server'

const rateLimitMap = new Map()

export async function rateLimit(request: NextRequest, limit = 10, window = 60000) {
  const identifier = request.ip || 'anonymous'
  const now = Date.now()
  const windowStart = now - window

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }

  const requests = rateLimitMap.get(identifier)
  const recentRequests = requests.filter((time: number) => time > windowStart)
  
  if (recentRequests.length >= limit) {
    return { success: false, resetTime: windowStart + window }
  }

  recentRequests.push(now)
  rateLimitMap.set(identifier, recentRequests)
  
  return { success: true, remaining: limit - recentRequests.length }
}
```

## Integration Examples

### Frontend Integration

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

class APIClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'API request failed')
    }

    return data.data
  }

  async submitContact(formData: ContactFormData) {
    return this.request<ContactFormResponse>('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
  }

  async getProjects(filters?: PortfolioQuery) {
    const params = new URLSearchParams(filters as any)
    return this.request<PortfolioResponse>(`/portfolio?${params}`)
  }

  async getProject(id: number) {
    return this.request<Project>(`/portfolio/${id}`)
  }
}

export const apiClient = new APIClient()
```

### React Hook Integration

```typescript
// hooks/useAPI.ts
import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/api'

export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitForm = useCallback(async (formData: ContactFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await apiClient.submitContact(formData)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { submitForm, isSubmitting, error }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = useCallback(async (filters?: PortfolioQuery) => {
    setLoading(true)
    try {
      const data = await apiClient.getProjects(filters)
      setProjects(data.projects)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  return { projects, loading, fetchProjects }
}
```

## Testing API Endpoints

### Jest Testing

```typescript
// __tests__/api/contact.test.ts
import { POST } from '@/app/api/contact/route'
import { NextRequest } from 'next/server'

describe('/api/contact', () => {
  it('should submit contact form successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters.'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.id).toBeDefined()
  })

  it('should validate required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'invalid-email',
        subject: '',
        message: 'short'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error.code).toBe('VALIDATION_ERROR')
  })
})
```

### Postman Collection

```json
{
  "info": {
    "name": "Architect Portfolio API",
    "description": "API endpoints for the architect portfolio"
  },
  "item": [
    {
      "name": "Submit Contact Form",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"subject\": \"Project Inquiry\",\n  \"message\": \"I am interested in discussing a new project.\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/contact",
          "host": ["{{baseUrl}}"],
          "path": ["api", "contact"]
        }
      }
    },
    {
      "name": "Get Portfolio Projects",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/api/portfolio?category=residential&limit=5",
          "host": ["{{baseUrl}}"],
          "path": ["api", "portfolio"],
          "query": [
            {
              "key": "category",
              "value": "residential"
            },
            {
              "key": "limit",
              "value": "5"
            }
          ]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

This comprehensive API documentation provides all the information needed to integrate with and extend the Architect Resume Portfolio API endpoints.