# Deployment Guide

This comprehensive guide covers deployment options for the Architect Resume Portfolio across multiple platforms and hosting providers.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Configuration](#environment-configuration)
- [Vercel Deployment](#vercel-deployment)
- [Netlify Deployment](#netlify-deployment)
- [AWS Deployment](#aws-deployment)
- [Self-Hosting](#self-hosting)
- [Docker Deployment](#docker-deployment)
- [CI/CD Pipelines](#cicd-pipelines)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

### Code Quality Checks

```bash
# Run all quality checks
npm run lint
npm run type-check
npm run test
npm run build

# Check bundle size
npm run analyze  # If analyze script is available
```

### Production Build Verification

```bash
# Create production build
npm run build

# Test production build locally
npm start

# Verify all pages load correctly
# Check console for any errors
# Test contact form functionality
# Verify responsive design on multiple devices
```

### Content Review

- [ ] Update personal information in all components
- [ ] Replace placeholder images with actual portfolio images
- [ ] Update contact information and social media links
- [ ] Review and proofread all text content
- [ ] Verify all external links work correctly
- [ ] Test contact form submission

### SEO and Meta Tags

- [ ] Update meta descriptions
- [ ] Set appropriate page titles
- [ ] Configure Open Graph tags
- [ ] Add structured data markup
- [ ] Submit sitemap to search engines

## Environment Configuration

### Environment Variables

Create appropriate environment files for different deployment stages:

#### `.env.local` (Development)
```bash
# Development environment
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=john@johnarchitect.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=

# Contact form (if using external service)
CONTACT_FORM_ENDPOINT=
CONTACT_FORM_API_KEY=

# Optional: Database configuration
DATABASE_URL=
```

#### `.env.production` (Production)
```bash
# Production environment
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=your-actual-email@domain.com
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Contact form service
CONTACT_FORM_ENDPOINT=https://api.emailservice.com/send
CONTACT_FORM_API_KEY=your-api-key

# Content Delivery Network
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
```

### Build Configuration

#### `next.config.js` Production Configuration
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'yourdomain.com'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true,
  },
  
  // Compression
  compress: true,
  
  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ],
  
  // Redirects
  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ],
}

module.exports = nextConfig
```

## Vercel Deployment

Vercel is the recommended deployment platform for Next.js applications.

### Automatic Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Push your code to GitHub/GitLab/Bitbucket
   git add .
   git commit -m "feat: prepare for deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Configure build settings (usually auto-detected)
   - Add environment variables
   - Deploy

3. **Automatic Deployments**
   - Every push to main branch triggers production deployment
   - Pull requests create preview deployments
   - Zero-downtime deployments

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add CONTACT_FORM_API_KEY production
```

### Vercel Configuration

Create `vercel.json` for advanced configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/contact.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    }
  ]
}
```

### Custom Domain Setup

1. **Add Domain in Vercel Dashboard**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

## Netlify Deployment

### Continuous Deployment

1. **Connect Repository**
   - Visit [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your Git provider
   - Select repository

2. **Build Configuration**
   ```yaml
   # netlify.toml
   [build]
     publish = ".next"
     command = "npm run build"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[headers]]
     for = "/_next/static/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"
   
   [[headers]]
     for = "/images/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000"
   
   [[redirects]]
     from = "/home"
     to = "/"
     status = 301
   ```

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --dir=.next --prod
```

### Netlify Features

- **Form Handling**: Built-in form processing
- **Edge Functions**: Serverless functions at the edge
- **Split Testing**: A/B testing capabilities
- **Large Media**: Git LFS alternative

```html
<!-- Contact form with Netlify handling -->
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <!-- form fields -->
</form>
```

## AWS Deployment

### AWS Amplify

1. **Setup Amplify**
   ```bash
   # Install Amplify CLI
   npm install -g @aws-amplify/cli
   
   # Configure Amplify
   amplify configure
   
   # Initialize project
   amplify init
   ```

2. **Deploy to Amplify**
   ```bash
   # Add hosting
   amplify add hosting
   
   # Deploy
   amplify publish
   ```

3. **Amplify Configuration**
   ```yaml
   # amplify.yml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

### AWS S3 + CloudFront

1. **Build and Export**
   ```bash
   # Add export script to package.json
   "scripts": {
     "export": "next build && next export"
   }
   
   # Build static files
   npm run export
   ```

2. **S3 Bucket Setup**
   ```bash
   # Create S3 bucket
   aws s3 mb s3://your-portfolio-bucket
   
   # Enable static website hosting
   aws s3 website s3://your-portfolio-bucket \
     --index-document index.html \
     --error-document 404.html
   
   # Upload files
   aws s3 sync out/ s3://your-portfolio-bucket --delete
   ```

3. **CloudFront Distribution**
   ```json
   {
     "CallerReference": "portfolio-distribution",
     "DefaultRootObject": "index.html",
     "Origins": [
       {
         "Id": "S3-your-portfolio-bucket",
         "DomainName": "your-portfolio-bucket.s3.amazonaws.com",
         "S3OriginConfig": {
           "OriginAccessIdentity": ""
         }
       }
     ],
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-your-portfolio-bucket",
       "ViewerProtocolPolicy": "redirect-to-https",
       "Compress": true,
       "ForwardedValues": {
         "QueryString": false,
         "Cookies": {
           "Forward": "none"
         }
       }
     }
   }
   ```

### AWS EC2 (Self-Managed)

1. **EC2 Instance Setup**
   ```bash
   # Connect to EC2 instance
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/architect-resume.git
   cd architect-resume
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "portfolio" -- start
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/portfolio
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Self-Hosting

### VPS Deployment

1. **Server Requirements**
   - **OS**: Ubuntu 20.04 LTS or later
   - **RAM**: Minimum 1GB, recommended 2GB+
   - **Storage**: 10GB+ available space
   - **CPU**: 1 vCPU minimum

2. **Initial Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install additional tools
   sudo apt install -y git nginx certbot python3-certbot-nginx
   
   # Create application user
   sudo adduser portfolio
   sudo usermod -aG sudo portfolio
   ```

3. **Application Deployment**
   ```bash
   # Switch to application user
   sudo su - portfolio
   
   # Clone and setup application
   git clone https://github.com/yourusername/architect-resume.git
   cd architect-resume
   npm install
   npm run build
   
   # Install PM2 globally
   sudo npm install -g pm2
   
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'architect-portfolio',
       script: 'npm',
       args: 'start',
       cwd: '/home/portfolio/architect-resume',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   EOF
   
   # Start application
   pm2 start ecosystem.config.js
   pm2 startup
   pm2 save
   ```

4. **SSL Certificate Setup**
   ```bash
   # Obtain SSL certificate
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   
   # Auto-renewal
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Shared Hosting

For shared hosting providers that support Node.js:

1. **Build Static Version**
   ```bash
   # Install next-export
   npm install --save-dev next-export
   
   # Add to package.json
   "scripts": {
     "export": "next build && next export"
   }
   
   # Generate static files
   npm run export
   ```

2. **Upload Files**
   - Upload contents of `out/` folder to your hosting provider
   - Configure your domain to point to the upload directory

## Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage Dockerfile for production
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  portfolio:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portfolio.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.portfolio.tls.certresolver=letsencrypt"

  traefik:
    image: traefik:v2.8
    command:
      - --api.dashboard=true
      - --providers.docker=true
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.email=your-email@domain.com
      - --certificatesresolvers.letsencrypt.acme.storage=/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./acme.json:/acme.json
    restart: unless-stopped
```

### Kubernetes Deployment

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: architect-portfolio
spec:
  replicas: 3
  selector:
    matchLabels:
      app: architect-portfolio
  template:
    metadata:
      labels:
        app: architect-portfolio
    spec:
      containers:
      - name: portfolio
        image: your-registry/architect-portfolio:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXT_PUBLIC_SITE_URL
          value: "https://yourdomain.com"
---
apiVersion: v1
kind: Service
metadata:
  name: architect-portfolio-service
spec:
  selector:
    app: architect-portfolio
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## CI/CD Pipelines

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run lint
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Build
      run: npm run build

  deploy-vercel:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'

  deploy-aws:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build and export
      run: |
        npm run build
        npm run export
    
    - name: Deploy to S3
      run: aws s3 sync out/ s3://${{ secrets.S3_BUCKET }} --delete
    
    - name: Invalidate CloudFront
      run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:$NODE_VERSION
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run test
    - npm run lint
    - npm run type-check
    - npm run build

deploy_production:
  stage: deploy
  image: node:$NODE_VERSION
  only:
    - main
  script:
    - npm ci
    - npm run build
    - npm run export
    # Deploy to your hosting provider
  artifacts:
    paths:
      - out/
    expire_in: 1 week
```

## Performance Optimization

### Build Optimization

```javascript
// next.config.js optimizations
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }
    
    return config
  },
}
```

### Image Optimization

```typescript
// Optimize images for production
import Image from 'next/image'

const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    quality={85}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A2p5hJV1qDGVaOwMUo6wUBP/Z"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    {...props}
  />
)
```

### Caching Strategy

```javascript
// Service Worker for caching (if using PWA)
const CACHE_NAME = 'architect-portfolio-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/images/hero-bg.jpg'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})
```

## Monitoring and Analytics

### Google Analytics 4

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_location: url,
  })
}

export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
```

### Error Monitoring with Sentry

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

### Performance Monitoring

```typescript
// lib/performance.ts
export const reportWebVitals = (metric: any) => {
  if (metric.label === 'web-vital') {
    // Log to analytics service
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    })
  }
}
```

### Uptime Monitoring

Set up monitoring with services like:
- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Comprehensive monitoring
- **StatusCake**: Website monitoring
- **New Relic**: Application performance monitoring

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Working**
   - Ensure variables start with `NEXT_PUBLIC_` for client-side access
   - Check variable names are exactly as defined
   - Restart development server after adding variables

3. **Image Loading Issues**
   - Verify image domains are added to `next.config.js`
   - Check image paths are correct
   - Ensure images are optimized and not too large

4. **CSS Not Loading**
   - Verify Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Ensure build process includes CSS compilation

5. **404 Errors on Refresh**
   - Configure server for SPA routing
   - Add proper rewrites in hosting configuration
   - Ensure all routes are properly defined

### Performance Issues

1. **Slow Loading Times**
   ```bash
   # Analyze bundle size
   npm run build
   npx @next/bundle-analyzer
   
   # Check for large dependencies
   npm ls --depth=0
   ```

2. **Poor Core Web Vitals**
   - Optimize images with proper sizing and compression
   - Implement code splitting
   - Reduce unused JavaScript
   - Optimize font loading

### Security Considerations

1. **Security Headers**
   ```javascript
   // next.config.js
   headers: async () => [
     {
       source: '/(.*)',
       headers: [
         {
           key: 'X-Frame-Options',
           value: 'DENY',
         },
         {
           key: 'Content-Security-Policy',
           value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
         }
       ],
     },
   ]
   ```

2. **Environment Variables Security**
   - Never commit sensitive environment variables
   - Use platform-specific secret management
   - Regularly rotate API keys and tokens

3. **Dependencies Security**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Fix issues
   npm audit fix
   
   # Update dependencies
   npm update
   ```

This deployment guide provides comprehensive instructions for deploying your Architect Resume Portfolio across multiple platforms. Choose the deployment method that best fits your needs and technical requirements.