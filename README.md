# 🏛️ Architect Resume Template

A modern, professional portfolio template designed for architects, urban planners, interior designers, and other design professionals. Built with Next.js 15, TypeScript, and Tailwind CSS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/architect-resume/template)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/architect-resume/template)

## ✨ Features

- **🎨 Fully Customizable** - Easy configuration system with no code changes required
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices  
- **⚡ Performance Optimized** - Built with Next.js 15 and modern web standards
- **🔍 SEO Ready** - Dynamic meta tags, Open Graph, and structured data
- **📝 Blog System** - Built-in blog with markdown support (optional)
- **🤖 AI Chatbot** - Interactive assistant for visitor engagement (optional)
- **🎯 Portfolio Showcase** - Beautiful project galleries and case studies
- **📧 Contact Forms** - Integrated contact system with validation
- **🌙 Dark Mode** - Optional dark theme support
- **♿ Accessible** - WCAG 2.1 AA compliant
- **🚀 Easy Deployment** - One-click deploy to Vercel, Netlify, or GitHub Pages

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the template
git clone https://github.com/architect-resume/template.git my-portfolio
cd my-portfolio

# Install dependencies
npm install

# Run the setup wizard
npm run setup

# Start development server
npm run dev
```

### Option 2: Manual Setup

```bash
# Clone and install
git clone https://github.com/architect-resume/template.git my-portfolio
cd my-portfolio
npm install

# Configure your information
cp .env.example .env.local
# Edit .env.local with your details

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio!

## 📋 Configuration

### Environment Variables

Create a `.env.local` file with your information:

```bash
# Personal Information
USER_NAME="Your Full Name"
USER_TITLE="Your Professional Title"
USER_BIO="Your professional bio and mission statement"

# Contact Information  
CONTACT_EMAIL="your.email@example.com"
CONTACT_PHONE="+1 (555) 123-4567"
CONTACT_LOCATION="Your City, State"

# Social Media
LINKEDIN_URL="https://linkedin.com/in/yourprofile"
INSTAGRAM_URL="https://instagram.com/yourprofile"
BEHANCE_URL="https://behance.net/yourprofile"
WEBSITE_URL="https://yourwebsite.com"

# Customization
PRIMARY_COLOR="#8a7855"
ACCENT_COLOR="#d4af37"
ENABLE_BLOG=true
ENABLE_CHATBOT=true
```

### Advanced Configuration

Use `template.config.json` for advanced customization:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Title",
    "bio": "Your bio..."
  },
  "branding": {
    "colors": {
      "primary": "#8a7855",
      "accent": "#d4af37"
    }
  },
  "features": {
    "blog": true,
    "chatbot": true,
    "portfolio": true
  }
}
```

## 🎨 Customization Examples

### For Architects
```bash
USER_NAME="Sarah Chen"
USER_TITLE="Senior Architect & Sustainable Design Specialist"
PRIMARY_COLOR="#2d5a27"  # Forest green
ACCENT_COLOR="#8bc34a"   # Light green
```

### For Urban Planners  
```bash
USER_NAME="Marcus Rodriguez"
USER_TITLE="Urban Planner & Smart City Consultant"
PRIMARY_COLOR="#1e3a8a"  # Professional blue
ACCENT_COLOR="#3b82f6"   # Tech blue
```

### For Interior Designers
```bash
USER_NAME="Isabella Thompson"  
USER_TITLE="Interior Designer & Space Planning Expert"
PRIMARY_COLOR="#8b4513"  # Rich brown
ACCENT_COLOR="#daa520"   # Gold
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   │   ├── Hero.tsx      # Homepage hero section
│   │   ├── Portfolio.tsx  # Portfolio showcase
│   │   ├── Contact.tsx    # Contact form
│   │   └── ...
│   ├── data/             # Content data files
│   └── types/            # TypeScript definitions
├── config/               # Configuration system
├── docs/                 # Documentation
├── examples/             # Example configurations
├── public/               # Static assets
├── scripts/              # Setup and utility scripts
└── tests/                # Test suite
```

## 🔧 Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run test          # Run test suite
npm run setup         # Interactive setup wizard
npm run validate      # Validate configuration
npm run deploy        # Deploy to GitHub Pages
```

## 🎯 Content Management

### 1. Portfolio Projects
Edit `/app/components/Portfolio.tsx` to showcase your work:

```typescript
const projects = [
  {
    title: "Sustainable Office Complex",
    description: "LEED Platinum certified building...",
    image: "/images/projects/office-complex.jpg",
    category: "Commercial",
    // ... more project details
  }
]
```

### 2. Professional Experience
Update `/app/components/Experience.tsx` with your career history:

```typescript
const experience = [
  {
    company: "Architectural Firm",
    position: "Senior Architect", 
    period: "2020 - Present",
    achievements: ["Led 15+ major projects", "..."]
  }
]
```

### 3. Blog Content (Optional)
Manage blog posts in `/app/data/blog.ts`:

```typescript
export const blogPosts = [
  {
    title: "Sustainable Architecture Trends",
    content: "Content in markdown format...",
    publishDate: "2024-01-15",
    tags: ["Sustainability", "Innovation"]
  }
]
```

## 🚀 Deployment

### GitHub Pages (Free)

```bash
# Set up repository info
GITHUB_USERNAME="yourusername"  
GITHUB_REPO="your-portfolio"

# Deploy
npm run build
npm run export
npm run deploy
```

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/architect-resume/template)

1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/architect-resume/template)

1. Connect repository to Netlify
2. Set build command: `npm run build && npm run export`
3. Set publish directory: `out`

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Validate configuration
npm run validate

# Test build process
npm run build
```

## 📖 Documentation

- [📋 Setup Guide](docs/TEMPLATE_SETUP.md) - Detailed setup instructions
- [🎨 Examples](docs/EXAMPLES.md) - Configuration examples for different professions
- [🔧 Customization](docs/CUSTOMIZATION.md) - Advanced customization options
- [🚀 Deployment](docs/DEPLOYMENT.md) - Deployment guides
- [🧪 Testing](docs/TESTING.md) - Testing documentation
- [📊 Performance](docs/PERFORMANCE.md) - Performance optimization

## ✅ Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+  
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
git clone https://github.com/architect-resume/template.git
cd architect-resume-template
npm install
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/architect-resume/template/issues)
- 💬 [Discussions](https://github.com/architect-resume/template/discussions)
- 📧 Email: template-support@example.com

### Common Questions

**Q: Can I use this for commercial projects?**  
A: Yes! This template is MIT licensed and free for commercial use.

**Q: How do I change the color scheme?**  
A: Update the `PRIMARY_COLOR` and `ACCENT_COLOR` environment variables.

**Q: Can I remove the blog feature?**  
A: Yes, set `ENABLE_BLOG=false` in your environment variables.

**Q: Is this template SEO optimized?**  
A: Yes, it includes dynamic meta tags, structured data, and performance optimizations.

## 🏆 Showcase

Built amazing portfolios with this template? [Share your work](https://github.com/architect-resume/template/discussions/showcase) with the community!

## 🎉 What's Next?

After setting up your template:

1. 📝 **Customize your content** - Add your projects and experience
2. 🖼️ **Upload your images** - Replace placeholder images with your work  
3. 🎨 **Personalize the design** - Adjust colors and typography
4. 🚀 **Deploy your site** - Share your portfolio with the world
5. 📈 **Track performance** - Set up analytics and monitoring

---

**Made with ❤️ for the architecture and design community**

*Transform your professional presence with a portfolio that showcases your expertise and attracts your ideal clients.*