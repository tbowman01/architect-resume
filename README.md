# 🏗️ Architect Portfolio Template

[![Deploy to GitHub Pages](https://github.com/tbowman01/architect-resume/actions/workflows/github-pages.yml/badge.svg)](https://github.com/tbowman01/architect-resume/actions/workflows/github-pages.yml)
[![Release](https://github.com/tbowman01/architect-resume/actions/workflows/release.yml/badge.svg)](https://github.com/tbowman01/architect-resume/actions/workflows/release.yml)
[![Node.js Version](https://img.shields.io/badge/node-22.x-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, professional architect portfolio template built with Next.js 15, featuring a blog system and AI chatbot. Perfect for architects, designers, and creative professionals.

## ✨ Features

- **🎨 Modern Design**: Clean, professional layout with Tailwind CSS
- **📱 Fully Responsive**: Mobile-first design that works on all devices
- **📝 Blog System**: Built-in blog with rich content support and featured posts
- **🤖 AI Chatbot**: Interactive chatbot for visitor engagement
- **⚡ Performance**: Optimized Next.js build with static site generation
- **🔍 SEO Ready**: Meta tags, structured data, and performance optimized
- **🚀 GitHub Pages**: Automated deployment to GitHub Pages
- **🏷️ Version Management**: Semantic release with automated versioning
- **🔧 Developer Experience**: TypeScript, ESLint, Jest, and automated workflows

## 🚀 Quick Start

### Using as Template

1. **Click "Use this template"** above or [click here](https://github.com/tbowman01/architect-resume/generate)
2. **Name your repository** and create it
3. **Clone your new repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

### Local Development

1. **Install dependencies** (requires Node.js 22+):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## 📁 Customization Guide

### 1. Personal Information

Edit `app/data/blog.ts` to update:
- Personal details (name, title, contact info)
- Portfolio projects
- Blog posts
- Skills and experience

### 2. Design & Branding

Edit `tailwind.config.ts` to customize:
- Color scheme
- Fonts
- Spacing and layout

```typescript
colors: {
  architect: {
    50: '#f8f7f4',   // Light background
    500: '#8a7855',  // Primary color
    900: '#1b1811',  // Dark text
  }
}
```

### 3. Content

- **Images**: Replace files in `public/images/`
- **Blog Posts**: Add/edit posts in `app/data/blog.ts`
- **Metadata**: Update `app/layout.tsx` for SEO
- **Chatbot**: Customize responses in `app/components/ChatBot.tsx`

### 4. Deployment

#### GitHub Pages (Recommended)
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch - automatic deployment!

#### Other Platforms
- **Vercel**: Connect your GitHub repo
- **Netlify**: Import from Git
- **Custom**: Use `npm run build` and deploy `out/` folder

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm test
npm run test:watch
npm run test:coverage
```

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **Icons**: Lucide React
- **Testing**: Jest + Testing Library
- **Code Quality**: ESLint + TypeScript ESLint

## 🤖 GitHub Automation

This template includes comprehensive GitHub automation:

### 🏷️ Issue Management
- **Templates**: Bug reports, feature requests, template help
- **Labels**: Automatic labeling system with 25+ predefined labels
- **Triage**: Daily automated triage at 3 AM UTC
- **Stale**: Automatic cleanup of inactive issues

### 🚀 CI/CD
- **GitHub Pages**: Automatic deployment on push to main
- **Release Management**: Semantic versioning with automated releases
- **Testing**: Automated testing on pull requests
- **Code Quality**: ESLint and type checking

### 📋 Pull Requests
- **Template**: Structured PR template with checklists
- **Auto-labeling**: Based on changed files
- **Preview**: Build preview for all PRs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/tbowman01/architect-resume/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tbowman01/architect-resume/discussions)
- **Template Help**: Use the "Template Request" issue template

## 🌟 Showcase

Using this template? We'd love to see what you've built! Open an issue with the "showcase" label to share your portfolio.

---

**Made with ❤️ by the community**  
**Template Version**: 1.0.0  
**Last Updated**: December 2024