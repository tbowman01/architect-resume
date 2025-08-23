# Configuration System

A powerful, type-safe configuration system for the architect-resume template.

## Features

- 🎯 **Type-safe configuration** with TypeScript and Zod validation
- 🔧 **Environment variable support** with fallbacks
- 📝 **Template variables** with dynamic replacement
- 🔄 **Multi-source loading** (files, URLs, environment)
- ⚡ **Hot reload** in development
- ⚛️ **React integration** with hooks and context
- 🏗️ **Build-time optimization**

## Quick Start

1. **Generate configuration:**
```bash
npm run config:generate config/my-config.json
```

2. **Set up environment variables:**
```bash
cp config/.env.example .env.local
```

3. **Validate configuration:**
```bash
npm run config:validate config/my-config.json
```

4. **Preview processed configuration:**
```bash
npm run config:preview
```

## File Structure

```
config/
├── types.ts                    # TypeScript interfaces
├── schema.ts                   # Zod validation schemas
├── environment.ts              # Environment variable handling
├── template.ts                 # Template variable system
├── loader.ts                   # Configuration loading
├── manager.ts                  # Configuration management
├── context.tsx                 # React context provider
├── hooks.ts                    # React hooks
├── utils.ts                    # CLI utilities
├── index.ts                    # Main exports
├── architect-resume.json       # Base configuration
├── architect-resume.dev.json   # Development overrides
├── architect-resume.prod.json  # Production overrides
└── .env.example               # Environment variables template
```

## Usage

### React Components

```tsx
import { useConfig, usePortfolio, useFeatureFlag } from '@/config'

function MyComponent() {
  const { config } = useConfig()
  const { projects, featuredProjects } = usePortfolio()
  const blogEnabled = useFeatureFlag('blog')
  
  return (
    <div>
      <h1>{config.personal.name}</h1>
      {blogEnabled && <BlogComponent />}
      {featuredProjects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

### Build-time Configuration

```tsx
import { ConfigUtils } from '@/config'

export async function generateMetadata() {
  const config = await ConfigUtils.getBuildTimeConfig()
  
  return {
    title: config.seo.title,
    description: config.seo.description,
  }
}
```

### Template Variables

```json
{
  "seo": {
    "title": "{{personal.name}} - {{personal.title}}",
    "description": "{{personal.bio|truncate:155}}",
    "url": "{{env.NEXT_PUBLIC_SITE_URL}}"
  }
}
```

## Configuration Schema

See [types.ts](./types.ts) for the complete TypeScript interfaces and [schema.ts](./schema.ts) for validation schemas.

Key sections:
- `personal` - Personal information and contact details
- `portfolio` - Project portfolio configuration
- `experience` - Work experience data
- `education` - Educational background
- `skills` - Technical and soft skills
- `theme` - Visual design customization
- `features` - Feature flags and toggles
- `seo` - Search engine optimization
- `analytics` - Analytics integration
- `deployment` - Platform-specific settings

## Environment Variables

Copy `config/.env.example` to `.env.local` and customize:

```env
# Required
NEXT_PUBLIC_SITE_URL=https://yoursite.com

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
CONTACT_FORM_ENDPOINT=https://formspree.io/f/your-form
OPENAI_API_KEY=sk-your-openai-key
```

## CLI Commands

```bash
# Validate configuration
npm run config:validate config/architect-resume.json

# Generate configuration template
npm run config:generate config/my-config.json

# Preview configuration with resolved variables
npm run config:preview
```

## Advanced Usage

### Custom Configuration Sources

```typescript
import { loadConfiguration } from '@/config'

const config = await loadConfiguration([
  { type: 'url', url: 'https://api.example.com/config' },
  { type: 'file', path: 'custom.json' },
  { type: 'env' },
])
```

### Configuration Management

```typescript
import { ConfigurationManager } from '@/config'

const manager = new ConfigurationManager({
  sources: [/* custom sources */],
  enableHotReload: true,
})

await manager.initialize()

// Listen for changes
manager.onChange((newConfig, oldConfig, changes) => {
  console.log('Configuration updated:', changes)
})

// Update configuration
await manager.set('theme.primaryColor', '#ff0000')
```

### Template Functions

Available template functions:
- `uppercase` - Convert to uppercase
- `lowercase` - Convert to lowercase  
- `capitalize` - Capitalize first letter
- `slugify` - Create URL-friendly slug
- `truncate:length` - Truncate text
- `date:format` - Format date
- `year` - Current year

Example:
```json
{
  "title": "{{personal.name|capitalize}} - {{personal.title|uppercase}}",
  "slug": "{{personal.name|slugify}}",
  "copyright": "© {{date:year}} {{personal.name}}"
}
```

## Migration Guide

### From Static Configuration

1. **Extract current values** to configuration files
2. **Replace hardcoded values** with configuration hooks:

```tsx
// Before
const title = "John Architect - Portfolio"

// After
const { config } = useConfig()
const title = `${config.personal.name} - Portfolio`
```

3. **Update components** to use configuration:

```tsx
// Before
<Contact email="john@example.com" />

// After
const { getPersonal } = useConfig()
const personal = getPersonal()
<Contact email={personal.email} />
```

### From Environment Variables Only

Move environment-dependent values to configuration files and use environment variables for sensitive data only.

## TypeScript Integration

The configuration system is fully typed. Enable strict type checking:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Testing

```typescript
import { ConfigPresets } from '@/config'

// Load test configuration
const config = await ConfigPresets.test()

// Mock configuration in tests
const mockConfig = {
  personal: { name: 'Test User' },
  features: { blog: false },
}
```

## Performance

- **Build-time optimization** - Configuration processed at build time
- **Client-side caching** - Efficient runtime configuration access
- **Hot reload** - Development-only feature for configuration changes
- **Lazy loading** - Configuration loaded only when needed

## Troubleshooting

### Common Issues

1. **Configuration not loading**
   - Check file paths and JSON syntax
   - Verify environment variables
   - Check browser/server console for errors

2. **Template variables not resolving**
   - Verify variable names and syntax
   - Check context availability
   - Review template function names

3. **Type errors**
   - Run `npm run type-check`
   - Update configuration to match schema
   - Check for missing required fields

4. **Validation failures**
   - Review validation error messages
   - Check Zod schemas in `schema.ts`
   - Ensure all required fields are present

### Debug Mode

Set environment variable for detailed logging:
```bash
DEBUG=config:* npm run dev
```

## Contributing

1. **Add new configuration fields** in `types.ts`
2. **Update validation schemas** in `schema.ts`
3. **Add default values** in `loader.ts`
4. **Create React hooks** if needed in `hooks.ts`
5. **Update documentation** and examples
6. **Add tests** for new functionality

## License

Same as the main project license.