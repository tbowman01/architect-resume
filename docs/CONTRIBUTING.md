# Contributing to Architect Resume Portfolio

Thank you for your interest in contributing to the Architect Resume Portfolio! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Templates](#issue-templates)
- [Commit Message Format](#commit-message-format)
- [Architecture Guidelines](#architecture-guidelines)

## Code of Conduct

This project adheres to a code of conduct to ensure a welcoming environment for all contributors. Please be respectful, constructive, and collaborative.

### Expected Behavior

- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended with the following extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

### Environment Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/architect-resume.git
   cd architect-resume
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Setup**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

## Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements
- `chore/description` - Maintenance tasks

### Example Branch Names

```bash
feature/contact-form-validation
fix/mobile-navigation-issue
docs/api-documentation-update
refactor/component-structure
test/contact-component-coverage
chore/dependency-updates
```

## Code Standards

### TypeScript Guidelines

- **Strict TypeScript**: All code must be written in TypeScript with strict mode enabled
- **Type Definitions**: Prefer interfaces over types for object shapes
- **Explicit Return Types**: Always specify return types for functions
- **No Any Types**: Avoid `any` type; use proper typing or `unknown`

```typescript
// ✅ Good
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const submitForm = async (data: ContactFormData): Promise<boolean> => {
  // Implementation
  return true;
}

// ❌ Bad
const submitForm = async (data: any) => {
  // Implementation
}
```

### React Component Guidelines

- **Functional Components**: Use functional components with hooks
- **Component Props**: Always type component props with interfaces
- **Default Props**: Use default parameters instead of defaultProps
- **Event Handlers**: Properly type event handlers

```typescript
// ✅ Good
interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  variant = 'primary',
  children
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};
```

### CSS and Styling Guidelines

- **Tailwind CSS**: Use Tailwind utility classes for styling
- **Custom Styles**: Minimal custom CSS in `globals.css`
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Color Palette**: Use the defined architect color scheme
- **Component Variants**: Use consistent spacing and sizing

```typescript
// ✅ Good - Tailwind classes
<div className="bg-architect-50 p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-serif font-bold text-architect-800 mb-4">
    Section Title
  </h2>
</div>

// ❌ Bad - Inline styles
<div style={{backgroundColor: '#f8f7f4', padding: '24px'}}>
  <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>
    Section Title
  </h2>
</div>
```

### File Organization

```
app/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   ├── forms/           # Form-related components
│   └── layout/          # Layout components
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── styles/              # Global styles
```

### Import Organization

```typescript
// 1. React and Next.js imports
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';

// 2. Third-party libraries
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';

// 3. Internal components
import Button from '@/components/ui/Button';
import ContactForm from '@/components/forms/ContactForm';

// 4. Utilities and types
import { validateEmail } from '@/lib/utils';
import type { ContactFormData } from '@/types/forms';
```

## Testing Requirements

### Test Coverage Requirements

- **Minimum Coverage**: 80% overall code coverage
- **Component Testing**: All components must have comprehensive tests
- **Unit Testing**: All utility functions must be tested
- **Integration Testing**: Key user flows must be tested

### Testing Guidelines

```typescript
// Component test example
describe('ContactForm', () => {
  beforeEach(() => {
    render(<ContactForm />);
  });

  it('should render all required form fields', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });
});
```

### Required Tests Before PR

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Type checking
npm run type-check

# Build verification
npm run build
```

## Pull Request Process

### Before Creating a PR

1. **Update from main branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run quality checks**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   npm run build
   ```

3. **Update documentation** if needed

### PR Title Format

```
type(scope): brief description

Examples:
feat(contact): add form validation
fix(navigation): resolve mobile menu issue
docs(readme): update installation instructions
refactor(components): reorganize file structure
```

### PR Description Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one review required
3. **Testing**: Manual testing in development environment
4. **Documentation**: Updated if applicable
5. **Merge**: Squash and merge after approval

## Issue Templates

### Bug Report Template

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
- Device: [e.g. iPhone6]

**Additional Context**
Add any other context about the problem here.
```

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Commit Message Format

### Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat(contact): add email validation to contact form

fix(navigation): resolve mobile menu toggle issue

docs(api): update contact form endpoint documentation

style(components): format code according to prettier rules

refactor(utils): extract email validation logic to utility function

test(contact): add comprehensive tests for contact form

chore(deps): update react to version 18.3.1
```

## Architecture Guidelines

### Component Architecture

- **Single Responsibility**: Each component should have one clear purpose
- **Composition over Inheritance**: Favor composition patterns
- **Props Interface**: Well-defined and documented props
- **Error Boundaries**: Implement error boundaries for critical components

### State Management

- **Local State**: Use `useState` for component-specific state
- **Form State**: Use controlled components for forms
- **Global State**: Consider context for shared state
- **Server State**: Use appropriate data fetching patterns

### Performance Considerations

- **Code Splitting**: Implement dynamic imports for large components
- **Image Optimization**: Use Next.js Image component
- **Bundle Analysis**: Regular bundle size monitoring
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` appropriately

### Accessibility

- **Semantic HTML**: Use appropriate HTML elements
- **ARIA Labels**: Provide accessible labels and descriptions
- **Keyboard Navigation**: Ensure full keyboard accessibility
- **Color Contrast**: Maintain WCAG AA compliance
- **Screen Readers**: Test with screen reader software

## Development Tools

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker",
    "gruntfuggly.todo-tree"
  ]
}
```

### Git Hooks

We use Husky for git hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## Questions and Support

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and ideas
- **Email**: For security-related issues

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes for significant contributions
- GitHub contributors graph

Thank you for contributing to the Architect Resume Portfolio!