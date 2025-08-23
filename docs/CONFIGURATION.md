# Configuration System Documentation

The architect-resume template includes a comprehensive configuration system that allows easy customization of all aspects of your portfolio without touching the code.

## Overview

The configuration system provides:

- **Type-safe configuration** with TypeScript interfaces and Zod validation
- **Environment variable support** with fallbacks and validation
- **Template variable replacement** for dynamic content
- **Multi-source configuration loading** (files, environment, defaults)
- **Build-time and runtime configuration** merging
- **Hot reload support** in development
- **React hooks and context** for accessing configuration

## Quick Start

1. **Copy the example configuration:**
```bash
cp config/architect-resume.json config/architect-resume.local.json
```

2. **Set up environment variables:**
```bash
cp config/.env.example .env.local
```

3. **Customize your information:**
Edit `config/architect-resume.local.json` with your personal details.

## Configuration Files

### Main Configuration File
`config/architect-resume.json` - The base configuration file with template variables.

### Environment-Specific Files
- `config/architect-resume.dev.json` - Development overrides
- `config/architect-resume.prod.json` - Production overrides
- `config/architect-resume.local.json` - Local overrides (git-ignored)

### Environment Variables
`.env.local` - Environment variables (copy from `config/.env.example`)

## Configuration Structure

```typescript
interface ArchitectResumeConfig {
  personal: PersonalInfo           // Your basic information
  social: SocialLinks             // Social media links
  seo: SEOConfig                  // SEO settings
  theme: ThemeConfig              // Visual theme
  features: FeatureFlags          // Enable/disable features
  portfolio: PortfolioConfig      // Portfolio settings and projects
  experience: ExperienceConfig    // Work experience
  education: EducationConfig      // Education background
  skills: SkillsConfig            // Skills and competencies
  blog: BlogConfig                // Blog settings
  contact: ContactConfig          // Contact information
  chatbot: ChatbotConfig          // AI chatbot settings
  analytics: AnalyticsConfig      // Analytics integration
  deployment: DeploymentConfig    // Deployment settings
  build: BuildConfig              // Build optimization
}
```

## Template Variables

The configuration system supports template variables for dynamic content:

### Basic Syntax
```json
{
  "title": "{{personal.name}} - {{personal.title}}"
}
```

### Template Functions
```json
{
  "description": "{{personal.bio|truncate:155}}",
  "slug": "{{personal.name|slugify}}",
  "year": "{{date:year}}"
}
```

### Available Functions
- `uppercase` - Convert to uppercase
- `lowercase` - Convert to lowercase
- `capitalize` - Capitalize first letter
- `camelCase` - Convert to camelCase
- `kebabCase` - Convert to kebab-case
- `snakeCase` - Convert to snake_case
- `slugify` - Create URL-friendly slug
- `truncate:length` - Truncate to specified length
- `date:format` - Format current date
- `year` - Current year
- `uuid` - Generate UUID
- `random:min:max` - Random number

### Context Variables
- `personal.*` - Personal information
- `env.*` - Environment variables
- `runtime.*` - Runtime information
- `custom.*` - Custom variables

## Using Configuration in React

### Basic Usage
```tsx
import { useConfig } from '@/config'

function MyComponent() {
  const { config } = useConfig()
  
  return <h1>{config.personal.name}</h1>
}
```

### Feature Flags
```tsx
import { useFeatureFlag } from '@/config'

function OptionalFeature() {
  const isEnabled = useFeatureFlag('blog')
  
  if (!isEnabled) return null
  
  return <BlogComponent />
}
```

### Specific Hooks
```tsx
import { usePortfolio, useTheme } from '@/config'

function Portfolio() {
  const { projects, featuredProjects } = usePortfolio()
  const theme = useTheme()
  
  return (
    <div style={{ color: theme?.primaryColor }}>
      {featuredProjects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

## Environment Variables

### Required Variables
- `NODE_ENV` - Environment (development/production)
- `NEXT_PUBLIC_SITE_URL` - Your site URL

### Optional Variables
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `CONTACT_FORM_ENDPOINT` - Form submission endpoint
- `OPENAI_API_KEY` - For AI chatbot functionality
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For maps integration

### Environment-Specific Defaults

#### Development
- Analytics disabled
- Image optimization disabled
- Hot reload enabled
- Validation warnings shown

#### Production
- Analytics enabled
- Full optimization enabled
- Caching enabled
- Error reporting

## Customization Examples

### Personal Information
```json
{
  "personal": {
    "name": "Jane Smith",
    "title": "Sustainable Architect",
    "email": "jane@example.com",
    "location": "San Francisco, CA",
    "bio": "Award-winning architect specializing in eco-friendly design..."
  }
}
```

### Portfolio Projects
```json
{
  "portfolio": {
    "projects": [
      {
        "id": "eco-building",
        "title": "Eco-Friendly Office Complex",
        "description": "LEED Platinum certified office building...",
        "category": "Commercial",
        "year": 2024,
        "featured": true,
        "imageUrl": "https://example.com/project1.jpg",
        "technologies": ["Revit", "AutoCAD", "SketchUp"]
      }
    ]
  }
}
```

### Theme Customization
```json
{
  "theme": {
    "primaryColor": "#2c5530",
    "secondaryColor": "#8bc34a",
    "accentColor": "#4caf50",
    "fonts": {
      "primary": "Roboto",
      "secondary": "Merriweather"
    }
  }
}
```

### Feature Toggles
```json
{
  "features": {
    "blog": true,
    "chatbot": false,
    "contact": true,
    "darkMode": true,
    "animations": true
  }
}
```

## Validation and Error Handling

The configuration system includes comprehensive validation:

### Schema Validation
All configuration is validated against TypeScript schemas using Zod.

### Environment Validation
Environment variables are validated and type-checked.

### Runtime Checks
Configuration is validated at runtime with helpful error messages.

### Error Recovery
Fallback configurations ensure the site works even with invalid config.

## Advanced Usage

### Custom Configuration Sources
```typescript
import { loadConfiguration } from '@/config'

const config = await loadConfiguration([
  { type: 'url', url: 'https://api.example.com/config', priority: 10 },
  { type: 'file', path: 'custom-config.json', priority: 20 },
])
```

### Configuration Hot Reload
```typescript
import { useConfigChanges } from '@/config'

function Component() {
  useConfigChanges((newConfig) => {
    console.log('Configuration updated:', newConfig)
  })
}
```

### Build-Time Configuration
```typescript
import { ConfigUtils } from '@/config'

// In Next.js API route or build script
const config = await ConfigUtils.getBuildTimeConfig()
```

## Deployment

### Vercel
Set environment variables in the Vercel dashboard or use `vercel env`.

### Netlify
Add environment variables in the Netlify dashboard or `netlify.toml`.

### GitHub Pages
Use repository secrets for environment variables.

### Self-Hosted
Create `.env.production` file with your variables.

## Troubleshooting

### Common Issues

1. **Configuration not loading:**
   - Check file paths in config sources
   - Verify JSON syntax in config files
   - Check console for validation errors

2. **Template variables not working:**
   - Verify template syntax `{{variable}}`
   - Check variable exists in context
   - Review function names and parameters

3. **Environment variables not available:**
   - Ensure client variables have `NEXT_PUBLIC_` prefix
   - Check `.env.local` file exists
   - Restart development server after adding variables

4. **Type errors:**
   - Run `npm run type-check` to validate types
   - Check configuration matches schema
   - Update types if extending configuration

### Debug Mode
Set `DEBUG=config:*` environment variable to enable debug logging.

### Validation Errors
Check browser console or server logs for detailed validation error messages.

## Migration from Static Configuration

1. **Extract current values** to configuration files
2. **Replace hardcoded values** with configuration hooks
3. **Update components** to use `useConfig()` hook
4. **Test configuration** with different environments

## Best Practices

1. **Use environment-specific files** for different deployment stages
2. **Keep sensitive data** in environment variables only
3. **Validate configuration** in CI/CD pipeline
4. **Use feature flags** for gradual rollouts
5. **Document custom configuration** fields
6. **Version control** configuration files (except `.local.json`)
7. **Test configuration changes** in development first
8. **Use TypeScript** for type safety

## Contributing

When adding new configuration options:

1. Update the TypeScript interfaces in `config/types.ts`
2. Add Zod validation schemas in `config/schema.ts`
3. Update default configuration in `config/loader.ts`
4. Add React hooks if needed in `config/hooks.ts`
5. Update documentation and examples
6. Add tests for new functionality

## API Reference

See the TypeScript interfaces in `config/types.ts` for complete API documentation.

For more examples, check the `config/` directory and existing components that use configuration.