# Architect Resume Portfolio

A modern, responsive portfolio website for architects built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern Stack**: Built with Next.js 15, React 18, TypeScript, and Tailwind CSS
- **Smooth Animations**: Professional animations using Framer Motion
- **Portfolio Showcase**: Interactive project gallery with filtering and detailed views
- **Professional Timeline**: Visual career progression with expandable details
- **Skills Visualization**: Animated skill meters and categorized expertise
- **Contact Form**: Functional contact form with validation
- **SEO Optimized**: Full metadata and OpenGraph support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd architect-resume
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
architect-resume/
├── app/
│   ├── components/       # React components
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── Education.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript types
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── public/              # Static assets
├── tests/              # Test files
└── config/             # Configuration files
```

## 🎯 Components

### Hero Section
- Professional introduction with name and title
- Call-to-action buttons
- Achievement statistics

### Portfolio
- Grid layout with project cards
- Category filtering (Residential, Commercial, Urban Planning, Public)
- Modal views with detailed project information
- High-quality architectural imagery

### Experience Timeline
- Visual timeline of career progression
- Expandable sections for detailed role descriptions
- Achievement highlights
- Professional growth indicators

### Skills
- Categorized skill sections (Design, Technical, Software, Management)
- Animated progress bars
- Professional certifications
- Visual skill meters

### Education
- Academic qualifications
- Professional certifications
- Awards and recognition
- Continuing education

### Contact
- Contact form with validation
- Social media links
- Contact information
- Office hours

## 🛠️ Technologies

- **Framework**: Next.js 15.0.0
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.0
- **Animations**: Framer Motion 11.0.0
- **Icons**: Lucide React
- **UI Components**: Radix UI
- **TypeScript**: 5.x
- **Testing**: Jest & React Testing Library

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Color Palette

The design uses a sophisticated architect-themed color palette:

- **Primary**: Architect browns and grays
- **Accent**: Gold (#d4af37) and Copper (#b87333)
- **Background**: Subtle gradients from architect-50 to white
- **Typography**: High contrast for readability

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npx vercel
```

## 📝 Customization

### Update Personal Information

Edit the content in each component file to add your personal information:

1. `Hero.tsx` - Update name, title, and bio
2. `Portfolio.tsx` - Add your projects
3. `Experience.tsx` - Update work history
4. `Skills.tsx` - Customize skills and levels
5. `Education.tsx` - Add your education
6. `Contact.tsx` - Update contact information

### Styling

Modify the Tailwind configuration in `tailwind.config.ts` to customize:
- Colors
- Fonts
- Animations
- Spacing

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📄 License

MIT License - feel free to use this template for your portfolio!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the GitHub repository.