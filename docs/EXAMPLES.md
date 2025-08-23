# 🎨 Template Configuration Examples

This document provides real-world examples of how to customize the Architect Resume Template for different professional roles and personal branding needs.

## 📁 Example Configurations

The `/examples` directory contains complete configuration files for different professional roles:

- `architect-config.json` - Sustainable architecture specialist
- `urban-planner-config.json` - Smart city consultant  
- `interior-designer-config.json` - Luxury interior designer

## 🏗️ Architect Example: Sarah Chen

**Professional Focus:** Sustainable Architecture & Green Design

### Key Configuration Highlights:

```json
{
  "personal": {
    "name": "Sarah Chen",
    "title": "Senior Architect & Sustainable Design Specialist",
    "tagline": "Designing Tomorrow's Sustainable World"
  },
  "branding": {
    "colors": {
      "primary": "#2d5a27",  // Forest green - eco-friendly theme
      "accent": "#8bc34a"    // Light green accent
    }
  },
  "features": {
    "blog": true,           // Sustainability articles
    "darkMode": true        // Eco-conscious dark mode
  }
}
```

### Visual Identity:
- **Color Palette:** Earth tones and greens reflecting environmental focus
- **Typography:** Classic serif headings with clean sans-serif body text
- **Content Focus:** LEED certifications, green building projects, sustainable materials

---

## 🏙️ Urban Planner Example: Marcus Rodriguez

**Professional Focus:** Smart Cities & Data-Driven Planning

### Key Configuration Highlights:

```json
{
  "personal": {
    "name": "Marcus Rodriguez",
    "title": "Urban Planner & Smart City Consultant",
    "tagline": "Building Smart Cities for Smart People"
  },
  "branding": {
    "colors": {
      "primary": "#1e3a8a",  // Professional blue
      "accent": "#3b82f6"    // Tech-focused bright blue
    }
  },
  "social": {
    "twitter": "https://twitter.com/smartcitymarc"  // Additional social platform
  }
}
```

### Visual Identity:
- **Color Palette:** Blues conveying trust, technology, and professionalism
- **Typography:** Modern sans-serif fonts reflecting tech-forward approach
- **Content Focus:** Smart infrastructure, data analytics, urban mobility solutions

---

## 🏠 Interior Designer Example: Isabella Thompson

**Professional Focus:** Luxury Residential Design

### Key Configuration Highlights:

```json
{
  "personal": {
    "name": "Isabella Thompson", 
    "title": "Interior Designer & Space Planning Expert",
    "tagline": "Transforming Spaces, Enhancing Lives"
  },
  "branding": {
    "colors": {
      "primary": "#8b4513",  // Rich brown - luxury wood tones
      "accent": "#daa520"    // Gold accent for luxury feel
    }
  },
  "features": {
    "chatbot": false,       // More personal, less automated approach
    "testimonials": true    // Client testimonials important for interior design
  }
}
```

### Visual Identity:
- **Color Palette:** Warm browns and golds suggesting luxury materials
- **Typography:** Elegant serif fonts for sophisticated appeal
- **Content Focus:** Residential projects, material sourcing, client transformations

---

## 🎯 Customization Strategies

### Color Psychology by Profession

| Profession | Primary Colors | Psychology | Examples |
|------------|----------------|------------|----------|
| **Sustainable Architect** | Greens, Earth tones | Environmental consciousness | `#2d5a27`, `#8bc34a` |
| **Corporate Architect** | Blues, Grays | Trust, professionalism | `#1e3a8a`, `#64748b` |
| **Residential Designer** | Warm browns, Golds | Luxury, comfort | `#8b4513`, `#daa520` |
| **Modern Architect** | Black, White, Orange | Innovation, minimalism | `#1f2937`, `#f97316` |
| **Landscape Architect** | Greens, Blues | Nature, water | `#059669`, `#0ea5e9` |

### Typography Combinations

#### Classic & Traditional
```json
{
  "fonts": {
    "heading": "Playfair Display",  // Elegant serif
    "body": "Source Sans Pro"      // Readable sans-serif
  }
}
```

#### Modern & Tech-Forward  
```json
{
  "fonts": {
    "heading": "Montserrat",       // Geometric sans-serif
    "body": "Open Sans"           // Clean, modern
  }
}
```

#### Luxury & Sophisticated
```json
{
  "fonts": {
    "heading": "Crimson Text",     // Refined serif
    "body": "Lato"                // Humanist sans-serif
  }
}
```

### Feature Selection Guide

| Feature | Best For | When to Enable |
|---------|----------|----------------|
| **Blog** | Thought leaders, educators | Share expertise, SEO benefits |
| **Chatbot** | Tech-savvy professionals | High-volume inquiries, modern approach |
| **Portfolio** | All visual professionals | Showcase work (essential) |
| **Testimonials** | Service providers | Build trust with social proof |
| **Dark Mode** | Tech/sustainable focus | Modern audience, accessibility |

## 🚀 Implementation Steps

### 1. Choose Your Base Example
```bash
# Copy an example configuration
cp examples/architect-config.json template.config.json

# Or start with the basic template
cp template.config.json my-config.json
```

### 2. Customize Your Configuration
Edit the JSON file with your specific information:
- Update personal details
- Choose appropriate colors
- Select relevant features
- Customize content sections

### 3. Apply Your Configuration
```bash
# Use the setup script
npm run setup

# Or manually update environment variables
cp .env.example .env.local
# Edit .env.local with your values
```

### 4. Test Your Customization
```bash
# Start development server
npm run dev

# Open http://localhost:3000 to preview
```

## 🎨 Advanced Customization Examples

### Multi-Brand Configuration
For professionals with multiple specialties:

```json
{
  "personal": {
    "name": "Alex Rivera",
    "title": "Architect & Urban Designer",
    "bio": "Bridging architecture and urban planning to create cohesive, sustainable communities."
  },
  "branding": {
    "colors": {
      "primary": "#4c5c68",    // Neutral professional gray
      "accent": "#06b6d4"      // Versatile cyan
    }
  },
  "content": {
    "hero": {
      "description": "Combining architectural vision with urban planning expertise for comprehensive design solutions."
    }
  }
}
```

### Minimalist Configuration
For those preferring understated elegance:

```json
{
  "branding": {
    "colors": {
      "primary": "#1f2937",    // Deep charcoal
      "accent": "#6b7280"      // Subtle gray accent
    },
    "fonts": {
      "heading": "Inter",      // Same font for consistency
      "body": "Inter"
    }
  },
  "features": {
    "chatbot": false,
    "blog": false,           // Focus only on portfolio
    "testimonials": false
  }
}
```

### Bold & Creative Configuration
For innovative, forward-thinking professionals:

```json
{
  "branding": {
    "colors": {
      "primary": "#dc2626",    // Bold red
      "accent": "#f59e0b"      // Vibrant orange
    },
    "fonts": {
      "heading": "Space Grotesk",  // Modern, distinctive
      "body": "Inter"
    }
  },
  "features": {
    "darkMode": true,
    "chatbot": true,
    "blog": true
  }
}
```

## 💡 Pro Tips

### Color Harmony
- Use tools like [Coolors.co](https://coolors.co) to generate harmonious palettes
- Test colors for accessibility with sufficient contrast ratios
- Consider your target audience's cultural color associations

### Content Strategy
- **Architects:** Focus on design process, sustainability, technical expertise
- **Planners:** Emphasize data analysis, community engagement, policy knowledge  
- **Designers:** Highlight style evolution, client relationships, trend awareness

### Professional Photography
- Use high-quality project photos with consistent lighting
- Include process shots and behind-the-scenes content
- Maintain consistent image ratios and styling

### SEO Optimization
- Include location-based keywords in your bio
- Use descriptive project titles and alt text
- Create location-specific pages if serving multiple markets

---

**Need inspiration?** Browse the example configurations and adapt them to match your unique professional brand and target audience!