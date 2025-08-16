# 🏗️ Architect Portfolio Template

This repository serves as a template for creating professional architect portfolios.

## ✨ Features

- **Modern Design**: Clean, professional layout with Tailwind CSS
- **Blog System**: Built-in blog with rich content support
- **AI Chatbot**: Interactive chatbot for visitor engagement
- **Responsive**: Mobile-first design that works on all devices
- **Fast**: Optimized Next.js build with static site generation
- **SEO Ready**: Meta tags, structured data, and performance optimized

## 🚀 Quick Start

1. **Use this template**: Click "Use this template" button above
2. **Clone your new repo**: `git clone your-repo-url`
3. **Install dependencies**: `npm install`
4. **Start development**: `npm run dev`
5. **Customize content**: Edit files in `app/data/` directory

## 📁 Key Files to Customize

- `app/data/blog.ts` - Blog posts and portfolio content
- `app/layout.tsx` - Site metadata and titles
- `tailwind.config.ts` - Colors and design tokens
- `public/images/` - Replace with your images
- `app/components/` - Customize components as needed

## 🎨 Customization Guide

### Changing Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  architect: {
    50: '#your-color-50',
    // ... more shades
  }
}
```

### Adding Blog Posts
Edit `app/data/blog.ts`:
```typescript
export const blogPosts: BlogPost[] = [
  {
    id: 'your-post-id',
    title: 'Your Blog Post Title',
    // ... more properties
  }
]
```

### Customizing the Chatbot
Edit `app/components/ChatBot.tsx` to modify responses and behavior.

## 🚀 Deployment

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch - automatic deployment via workflow

### Other Platforms
- **Vercel**: Connect your GitHub repo
- **Netlify**: Import from Git
- **Custom**: Use `npm run build` and deploy `out/` folder

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 📦 What's Included

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Jest** for testing
- **ESLint** for code quality

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This template is available under the MIT License.

---

**Template Version**: 1.0.0  
**Last Updated**: 2024-12-15