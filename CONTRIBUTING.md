# Contributing to Lightning Energy Dashboard

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Summary

- Be respectful and inclusive
- Welcome newcomers and help them succeed
- Report inappropriate behavior to maintainers
- Focus on what is best for the community

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x LTS
- npm 9.x or higher
- Git 2.40+
- MySQL 8.0+ (for database features)
- AWS account (for S3 storage testing)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/lightning-energy-dashboard.git
   cd lightning-energy-dashboard
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/dais2026/lightning-energy-dashboard.git
   ```

## Development Setup

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Environment Setup

Create `.env.local` for development:

```bash
# Copy the example
cp .env.example .env.local

# Update with your local values
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://user:password@localhost:3306/test_db
JWT_SECRET=dev-secret-key-change-in-production
OAUTH_SERVER_URL=http://localhost:3000/oauth
AWS_REGION=us-east-1
```

### Database Setup

```bash
npm run db:push
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### Verify Setup

```bash
npm run check    # TypeScript type checking
npm run test     # Unit tests
npm run test:e2e # E2E tests (with dev server running)
```

## Making Changes

### Create a Feature Branch

Always create a new branch for your changes:

```bash
# Update main branch
git fetch upstream
git rebase upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions
- `refactor/` - Code refactoring
- `perf/` - Performance improvements
- `security/` - Security fixes
- `chore/` - Build, deps, tooling

Examples:
- `feature/battery-comparison-charts`
- `fix/rate-limit-bypass`
- `docs/deployment-guide`
- `test/file-upload-tests`

### Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**: feat, fix, docs, style, refactor, perf, test, chore, ci, security
**Scope**: Optional - area of codebase (e.g., auth, files, api, ui)
**Subject**: Imperative, present tense ("add" not "added")

**Examples:**
```bash
git commit -m "feat(auth): add session refresh mechanism"
git commit -m "fix(files): prevent simultaneous uploads"
git commit -m "docs(api): add rate limiting documentation"
git commit -m "test(charts): add responsive viewport tests"
git commit -m "perf(bundle): optimize chunk sizes"
```

## Testing

### Unit Tests

Run unit tests:

```bash
npm run test              # Run tests
npm run test -- --watch  # Watch mode
npm run test:coverage    # Coverage report
```

### E2E Tests

Run end-to-end tests:

```bash
npm run test:e2e         # Headless mode
npm run test:e2e:ui      # Interactive UI
npm run test:e2e:debug   # Debug mode
```

### Coverage Requirements

Maintain minimum coverage:
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

Check coverage:

```bash
npm run test:coverage
# View coverage report
open coverage/index.html
```

### Test Best Practices

```typescript
// ✓ Good: Clear test names, focused scope
test('should validate email format', () => {
  expect(validateEmail('invalid')).toBe(false);
  expect(validateEmail('user@example.com')).toBe(true);
});

// ✗ Bad: Vague names, testing too much
test('email works', () => {
  expect(validateEmail('test@test.com')).toBe(true);
  expect(uploadFile('file.pdf')).toBeDefined();
  expect(authenticateUser('pass')).toBe(true);
});
```

### Adding New Tests

When adding features:

1. Write tests first (TDD) or alongside code
2. Test happy path and error cases
3. Test edge cases
4. Mock external dependencies
5. Keep tests focused and independent

## Submitting Changes

### Before You Submit

1. Update your branch:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Run all checks:
   ```bash
   npm run check           # Type check
   npm run format          # Format code
   npm run test            # Unit tests
   npm run test:e2e        # E2E tests (dev server must be running)
   npm run build           # Production build
   ```

3. All checks must pass before submitting

### Create Pull Request

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to GitHub and create a Pull Request
3. Fill in the PR template completely
4. Reference related issues (Closes #123)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Security fix

## Related Issues
Closes #(issue number)

## Changes
- Change 1
- Change 2

## Testing
- [ ] Unit tests added
- [ ] E2E tests added
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Tests pass (npm run test)
- [ ] Build successful (npm run build)
```

### Review Process

- At least one maintainer review required
- All discussions must be resolved
- CI/CD pipeline must pass
- No merge conflicts

## Code Style

### TypeScript/JavaScript

```typescript
// ✓ Use TypeScript for type safety
interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

// ✓ Use const by default
const MAX_RETRIES = 3;
const processData = (input: string) => {
  // implementation
};

// ✗ Avoid var, use explicit types
var x = 5;
let data = processData('test');

// ✓ Use meaningful names
const isValidEmail = (email: string): boolean => {
  // implementation
};

// ✗ Avoid abbreviations
const isVE = (e: string): boolean => {};
```

### React Components

```typescript
// ✓ Functional components with hooks
export function BatteryCard({ battery }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      {/* content */}
    </div>
  );
}

// ✗ Avoid class components
class BatteryCard extends React.Component {}

// ✓ Use TypeScript for props
interface BatteryCardProps {
  battery: Battery;
  onSelect?: (id: string) => void;
}

export function BatteryCard({ battery, onSelect }: BatteryCardProps) {
  // implementation
}
```

### CSS/Tailwind

```tsx
// ✓ Use Tailwind classes
<div className="flex items-center justify-between gap-4 p-6 rounded-lg bg-gray-50">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
</div>

// ✗ Avoid inline styles
<div style={{ display: 'flex', gap: '16px', padding: '24px' }}>

// ✓ Use custom CSS only when necessary
<div className="custom-animation">
```

### File Organization

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── charts/          # Chart components
│   └── layout/          # Layout components
├── pages/               # Page components
├── lib/                 # Utilities and helpers
└── styles/              # Global styles
```

## Documentation

### Update Documentation

When making changes that affect:
- API endpoints → Update `API.md`
- Architecture → Update `ARCHITECTURE.md`
- Security → Update `SECURITY.md`
- Deployment → Update `DEPLOYMENT.md`
- Configuration → Update `.env.example`

### Code Comments

Add comments for:
- Complex algorithms
- Non-obvious design decisions
- Workarounds or hacks
- Important side effects

```typescript
// ✓ Helpful comment
// Retry with exponential backoff to handle rate limiting
const delayMs = Math.pow(2, attempt) * 1000;
await sleep(delayMs);

// ✗ Redundant comment
// Increment counter
counter++;
```

### Commit Messages

Write clear, descriptive commit messages:

```bash
✓ "fix(api): handle 429 rate limit responses correctly"
✓ "feat(ui): add dark mode toggle to dashboard"
✓ "docs(security): add OWASP guidelines section"

✗ "fixes stuff"
✗ "update"
✗ "temp"
```

## Reporting Issues

### Security Issues

**Do not** open public issues for security vulnerabilities.

Email: security@yourdomain.com with:
- Description of vulnerability
- Steps to reproduce
- Impact assessment
- Suggested fix (if any)

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Node version, browser)
- Screenshots or error logs

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Examples or mockups (if applicable)

### Issue Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Do this
2. Then this
3. Result: unexpected behavior

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: macOS/Linux/Windows
- Node: 18.x/20.x
- Browser: Chrome/Firefox/Safari

## Screenshots or Logs
```

## Additional Notes

### Performance Considerations

When adding features:
- Check bundle size impact: `npm run build`
- Test with dev tools throttling
- Measure Core Web Vitals
- Profile with Chrome DevTools

### Security Considerations

When adding features:
- Validate all user input
- Use parameterized queries
- Avoid hardcoding secrets
- Run security audit: `npm audit`
- Check for XSS vulnerabilities

### Database Changes

When modifying database schema:
- Create migration with Drizzle
- Test migration up and down
- Update documentation
- Handle backwards compatibility

### Dependency Changes

When updating dependencies:
- Run security audit: `npm audit`
- Test thoroughly
- Document breaking changes
- Update package.json comments

## Getting Help

- **Documentation**: Read ARCHITECTURE.md, API.md, SECURITY.md
- **Issues**: Search existing issues for solutions
- **Discussions**: Start a discussion for questions
- **Email**: maintainers@yourdomain.com

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to the Lightning Energy Dashboard! 🚀

---

**Last Updated**: 2026-06-28
**Version**: 1.0.0
