# 🏛️ Architect Resume Template Setup Guide

Welcome to the Architect Resume Template! This guide will help you transform this template into your personal professional portfolio website.

## 🚀 Quick Start (5 minutes)

### Option 1: Automated Setup (Recommended)
```bash
# Run the interactive setup wizard
npm run setup

# Start the development server
npm run dev
```

### Option 2: Manual Setup
1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your information
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 Essential Configuration

### 1. Personal Information
Update these environment variables in `.env.local`:

```bash
# Your basic information
USER_NAME="Your Full Name"
USER_TITLE="Your Professional Title"
USER_BIO="Your professional bio and mission statement"

# Contact details
CONTACT_EMAIL="your.email@example.com"
CONTACT_PHONE="+1 (555) 123-4567"
CONTACT_LOCATION="Your City, State"

# Social media profiles
LINKEDIN_URL="https://linkedin.com/in/yourprofile"
INSTAGRAM_URL="https://instagram.com/yourprofile"
BEHANCE_URL="https://behance.net/yourprofile"
WEBSITE_URL="https://yourwebsite.com"
```

### 2. Branding & Theme
Customize the visual appearance:

```bash
# Color scheme
PRIMARY_COLOR="#8a7855"    # Main brand color
ACCENT_COLOR="#d4af37"     # Accent/highlight color

# Typography
HEADING_FONT="Playfair Display"  # Serif font for headings
BODY_FONT="Inter"                # Sans-serif font for body text
```

### 3. Feature Toggles
Enable or disable features:

```bash
ENABLE_BLOG=true         # Show blog section
ENABLE_CHATBOT=true      # Include AI chatbot
ENABLE_PORTFOLIO=true    # Display portfolio
ENABLE_TESTIMONIALS=true # Show testimonials
ENABLE_DARK_MODE=false   # Enable dark mode toggle
```

## 🎨 Content Customization

### 1. Replace Portfolio Projects
Edit `/app/components/Portfolio.tsx`:
- Update project data with your own work
- Replace project images in `/public/images/`
- Modify project descriptions and details

### 2. Update Professional Experience
Edit `/app/components/Experience.tsx`:
- Replace job positions with your career history
- Update company names, dates, and achievements
- Customize the experience timeline

### 3. Modify Skills & Education
Update your expertise in:
- `/app/components/Skills.tsx` - Technical skills and proficiencies
- `/app/components/Education.tsx` - Education, certifications, awards

### 4. Customize Blog Content
If you enabled the blog feature:
- Edit `/app/data/blog.ts` with your blog posts
- Replace sample content with your articles
- Update author information and categories

## 🖼️ Image Management

### Required Images
Replace these placeholder images with your own:

```
public/images/
├── hero-bg.jpg          # Homepage background
├── profile.jpg          # Your professional headshot
├── projects/
│   ├── project-1.jpg    # Portfolio project images
│   ├── project-2.jpg
│   └── ...
└── blog/
    ├── blog-1.jpg       # Blog post thumbnails
    └── ...
```

### Image Optimization Tips
- Use high-quality images (minimum 1200px wide)
- Optimize for web (JPEG for photos, PNG for graphics)
- Maintain consistent aspect ratios
- Include alt text for accessibility

## ⚙️ Advanced Configuration

### Custom Colors
Beyond the basic color variables, you can customize the full color palette in `/tailwind.config.ts`:

```typescript
colors: {
  architect: {
    50: '#f8f7f4',   // Lightest
    100: '#e8e5dd',
    // ... your custom color scale
    900: '#1b1811'   // Darkest
  }
}
```

### Font Customization
To use different fonts, update `/app/layout.tsx`:

```typescript
import { YourFont } from 'next/font/google'

const yourFont = YourFont({ 
  subsets: ['latin'],
  variable: '--font-your-font',
})
```

### Component Customization
Each component is modular and can be customized:
- Modify layouts in individual component files
- Update styling classes
- Add or remove sections as needed

## 🚀 Deployment

### GitHub Pages (Free)
1. Update your repository information:
   ```bash
   GITHUB_USERNAME="yourusername"
   GITHUB_REPO="your-portfolio"
   ```

2. Build and deploy:
   ```bash
   npm run build
   npm run export
   npm run deploy
   ```

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build && npm run export`
3. Set publish directory: `out`

## 🧪 Testing Your Setup

Before deploying, test your customizations:

```bash
# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Check for TypeScript errors
npm run type-check

# Lint code
npm run lint
```

## 🎯 Customization Checklist

- [ ] Updated personal information in `.env.local`
- [ ] Replaced placeholder images with your photos
- [ ] Customized portfolio projects
- [ ] Updated professional experience
- [ ] Modified skills and education sections
- [ ] Customized blog content (if enabled)
- [ ] Updated social media links
- [ ] Tested color scheme and branding
- [ ] Verified contact form functionality
- [ ] Tested responsive design on mobile
- [ ] Optimized images for web
- [ ] Set up deployment configuration
- [ ] Tested build process

## 🆘 Getting Help

### Common Issues

**Q: My changes aren't showing up**
A: Make sure you're editing the `.env.local` file and restart the development server.

**Q: Colors aren't updating**
A: Check that your color values are valid hex codes and restart the dev server.

**Q: Deployment fails**
A: Verify your GitHub repository settings and ensure all environment variables are set.

### Support Resources
- 📖 [Documentation](/docs/)
- 🐛 [Issues](https://github.com/architect-resume/template/issues)
- 💬 [Discussions](https://github.com/architect-resume/template/discussions)
- 📧 Email: template-support@example.com

## 🎉 Next Steps

Once you've customized your template:

1. **Test thoroughly** across different devices and browsers
2. **Optimize for SEO** by updating meta descriptions and titles
3. **Set up analytics** to track visitor engagement
4. **Create a maintenance schedule** to keep content updated
5. **Share your portfolio** with your professional network

---

**Congratulations!** You now have a professional, customized portfolio website. Keep your content fresh and showcase your best work to make a lasting impression on potential clients and employers.