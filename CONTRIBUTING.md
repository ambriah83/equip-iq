# Contributing to EquipIQ

We love your input! We want to make contributing to EquipIQ as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Critical production fixes

### Pull Requests

1. Fork the repo and create your branch from `develop`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Code Style

### TypeScript/React Guidelines

- Use TypeScript for all new code
- Follow the existing code style (ESLint configuration)
- Use functional components with hooks
- Prefer composition over inheritance
- Use meaningful variable and function names

### File Organization

We use a feature-based architecture:

```
src/
├── features/           # Feature-specific code
│   ├── equipment/     # Equipment management
│   ├── locations/     # Location management
│   └── vendors/       # Vendor management
├── shared/            # Shared utilities and components
└── app/              # App-level configuration
```

### Component Guidelines

- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper error boundaries
- Follow the established naming conventions

### Import Organization

Organize imports in this order:
1. React and external libraries
2. Internal shared utilities
3. Feature-specific imports
4. Relative imports

```typescript
// External libraries
import React from 'react';
import { Button } from '@/components/ui/button';

// Shared utilities
import { useToast } from '@/shared/hooks/use-toast';

// Feature imports
import { useEquipment } from '../hooks/useEquipment';

// Relative imports
import './Component.css';
```

## Git Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

#### Scope
- `equipment`: Equipment management
- `locations`: Location management
- `vendors`: Vendor management
- `auth`: Authentication
- `ui`: User interface components
- `api`: API related changes

#### Examples
```
feat(equipment): add equipment status tracking

fix(locations): resolve location deletion bug

docs(readme): update installation instructions

refactor(vendors): extract vendor service logic
```

## Testing

### Unit Tests
- Write tests for all business logic
- Use React Testing Library for component tests
- Aim for >80% code coverage

### Integration Tests
- Test feature workflows end-to-end
- Mock external dependencies appropriately

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

## Setting Up Development Environment

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/ambriah83/equip-iq.git
cd equip-iq

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Documentation

- Update README.md for major changes
- Add JSDoc comments for complex functions
- Update CHANGELOG.md for all user-facing changes
- Include examples in documentation

## Code Review Process

1. All submissions require review
2. We use GitHub pull requests for this purpose
3. Reviewers will check for:
   - Code quality and style
   - Test coverage
   - Documentation updates
   - Breaking changes

## Community

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow our Code of Conduct

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

Feel free to open an issue or reach out to the maintainers if you have any questions about contributing!
