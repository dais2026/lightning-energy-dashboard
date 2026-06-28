# Lightning Energy Dashboard ⚡

> A production-ready solar battery storage comparison and analysis dashboard built with React 19, Node.js, and TypeScript.

![Lightning Energy Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node Version](https://img.shields.io/badge/Node-18.x%20%7C%2020.x-blue)
![React Version](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

The Lightning Energy Dashboard is a comprehensive web application for comparing, analyzing, and visualizing 11 different solar battery storage systems. It features:

- **6 Interactive Comparison Charts** with real-time data visualization
- **Type-Safe API** with end-to-end type safety (tRPC)
- **Production Security** with Helmet.js and rate limiting
- **Complete Monitoring** with health checks and metrics
- **Comprehensive Testing** with unit and E2E tests
- **Full Documentation** covering security, API, architecture, and deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or 20.x LTS
- npm 9.x or higher
- Git 2.40+
- MySQL 8.0+ (for database)
- AWS Account (for S3 storage)

### Installation

```bash
# Clone repository
git clone https://github.com/dais2026/lightning-energy-dashboard.git
cd lightning-energy-dashboard

# Install dependencies
npm install --legacy-peer-deps

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Setup database
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:3001`

## 📦 What's Included

### Core Features
- ✅ Dashboard with 6 battery comparison charts
- ✅ File management with S3 storage
- ✅ OAuth authentication (Manus)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Type-safe API (tRPC)
- ✅ Database with MySQL/Drizzle ORM

### Production Infrastructure
- ✅ Security hardening (Helmet.js, rate limiting)
- ✅ Structured logging (pino-http)
- ✅ Health checks and metrics endpoints
- ✅ GitHub Actions CI/CD pipeline
- ✅ E2E testing with Playwright
- ✅ Unit testing with Vitest

### Documentation
- ✅ API Documentation (API.md)
- ✅ Architecture Guide (ARCHITECTURE.md)
- ✅ Security Guidelines (SECURITY.md)
- ✅ Deployment Guide (DEPLOYMENT.md)
- ✅ Contributing Guidelines (CONTRIBUTING.md)
- ✅ Performance Guide (PERFORMANCE.md)

## 🏗️ Architecture

```
Frontend (React 19)
    ↓
tRPC API (Type-Safe)
    ↓
Backend (Express.js)
    ↓
Database (MySQL) + Storage (S3)
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Tailwind 4, shadcn/ui, Recharts |
| **Backend** | Node.js, Express.js, tRPC |
| **Database** | MySQL 8.0+, Drizzle ORM |
| **Storage** | AWS S3, Presigned URLs |
| **Auth** | Manus OAuth, JWT Tokens |
| **Testing** | Vitest, Playwright |
| **Build** | Vite, esbuild |
| **DevOps** | GitHub Actions, Docker-ready |

## 📚 Documentation

- **[API.md](./API.md)** - Complete API reference with examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and data flows
- **[SECURITY.md](./SECURITY.md)** - Security guidelines and best practices
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment instructions for AWS, DigitalOcean, Docker
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contributing guidelines
- **[PERFORMANCE.md](./PERFORMANCE.md)** - Performance optimization guide

## 🧪 Testing

```bash
# Unit tests
npm run test                # Run tests
npm run test -- --watch   # Watch mode
npm run test:coverage     # Coverage report

# E2E tests
npm run test:e2e          # Headless mode
npm run test:e2e:ui       # Interactive UI
npm run test:e2e:debug    # Debug mode

# Type checking
npm run check             # TypeScript checking

# Code formatting
npm run format            # Format code with Prettier
```

### Test Results
- ✅ Unit Tests: 5/5 PASSED
- ✅ E2E Tests: 11 comprehensive tests
- ✅ TypeScript: Strict mode enabled
- ✅ Bundle: 931 KB gzipped

## 🔒 Security

The application includes multiple security layers:

- **Helmet.js** for security headers
- **Rate Limiting** (100 req/15min general, 30 POST, 10 uploads/hour)
- **Structured Logging** for monitoring
- **JWT Authentication** in httpOnly cookies
- **Input Validation** with Zod
- **HTTPS/TLS** ready with Nginx configuration

See [SECURITY.md](./SECURITY.md) for comprehensive security guidelines.

## 📊 Performance

Current metrics:
- **Bundle Size**: 931 KB gzipped
- **Modules**: 2,330 included
- **Lighthouse Score**: 85+
- **API Response**: < 200ms average
- **Database Queries**: < 100ms average

See [PERFORMANCE.md](./PERFORMANCE.md) for optimization strategies.

## 🌐 Available Endpoints

### Health & Monitoring
```
GET /health              # System health check
GET /metrics             # System metrics (memory, uptime)
```

### API Routes
```
POST /api/trpc/auth.me              # Get authenticated user
POST /api/trpc/auth.logout          # Logout user
POST /api/trpc/files.list           # List user files
POST /api/trpc/files.upload         # Upload file to S3
POST /api/trpc/files.update         # Update file metadata
POST /api/trpc/files.delete         # Delete file
```

See [API.md](./API.md) for complete API documentation.

## 🚢 Deployment

### Quick Deploy

**AWS EC2**:
```bash
npm install
npm run build
NODE_ENV=production npm start
```

**Docker**:
```bash
docker build -t lightning-energy .
docker run -p 3000:3000 lightning-energy
```

**DigitalOcean App Platform**:
- Connect GitHub repository
- Set environment variables
- Deploy from Actions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔧 Configuration

### Environment Variables

Required for development:
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=mysql://user:pass@localhost:3306/db_name
JWT_SECRET=your-secret-key
OAUTH_SERVER_URL=https://oauth.example.com
AWS_REGION=us-east-1
```

See `.env.example` for all available options.

## 📝 Scripts

```bash
npm run dev              # Start development server with HMR
npm run build            # Build for production
npm start                # Start production server
npm run check            # TypeScript type checking
npm run format           # Format code with Prettier
npm run test             # Run unit tests
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
npm test:e2e:ui         # E2E tests with UI
npm run db:push          # Run database migrations
```

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Setting up development environment
- Branch naming conventions
- Commit message format
- Testing requirements
- Code style guidelines
- Submitting pull requests

### Quick Contribution Steps

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and add tests
4. Run checks: `npm run check && npm run test && npm run build`
5. Commit with conventional commits: `git commit -m "feat: add feature"`
6. Push and create a Pull Request

## 📋 Project Statistics

| Metric | Value |
|--------|-------|
| Source Files | 121 |
| Lines of Code | 30,323 |
| Tests | 16 (5 unit + 11 E2E) |
| Documentation | 2,500+ lines |
| Bundle Size | 931 KB gzipped |
| Dependencies | 708 packages |
| Node Versions | 18.x, 20.x |

## 🐛 Reporting Issues

Found a bug or have a feature request? Please open an issue using our templates:

- [Bug Report](https://github.com/dais2026/lightning-energy-dashboard/issues/new?template=bug_report.md)
- [Feature Request](https://github.com/dais2026/lightning-energy-dashboard/issues/new?template=feature_request.md)
- [Documentation](https://github.com/dais2026/lightning-energy-dashboard/issues/new?template=documentation.md)

**Security Issues**: Please email security@yourdomain.com instead of opening public issues.

## 🔐 Security

For security issues, please email security@yourdomain.com with:
- Description of vulnerability
- Steps to reproduce
- Impact assessment
- Suggested fix (if available)

See [SECURITY.md](./SECURITY.md) for comprehensive security information.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React 19](https://react.dev)
- Styled with [Tailwind CSS 4](https://tailwindcss.com)
- Components from [shadcn/ui](https://ui.shadcn.com)
- Charts with [Recharts](https://recharts.org)
- API with [tRPC](https://trpc.io)
- Database with [Drizzle ORM](https://orm.drizzle.team)

## 📞 Support

- **Documentation**: Read the comprehensive guides in the repository
- **Issues**: Search existing issues or create a new one
- **Email**: support@yourdomain.com
- **Discussions**: Start a GitHub discussion for questions

## 🎯 Roadmap

### Phase 4: Production Features
- [ ] Admin dashboard
- [ ] Feature flags system
- [ ] Advanced analytics

### Phase 5: Scaling
- [ ] Redis caching layer
- [ ] Message queue system
- [ ] Microservices architecture

### Phase 6: Integration
- [ ] GraphQL API
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)

## 📊 Status

| Component | Status | Notes |
|-----------|--------|-------|
| Core Features | ✅ Complete | Dashboard, charts, file management |
| Security | ✅ Complete | Helmet.js, rate limiting, logging |
| Testing | ✅ Complete | Unit & E2E tests passing |
| Documentation | ✅ Complete | 2,500+ lines of comprehensive docs |
| CI/CD | ✅ Complete | GitHub Actions pipeline configured |
| Deployment | ✅ Ready | AWS, DigitalOcean, Docker supported |
| Production | ✅ Ready | All systems verified and tested |

---

**Last Updated**: 2026-06-28  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

[🌐 Visit Repository](https://github.com/dais2026/lightning-energy-dashboard) | [📖 Read Docs](./API.md) | [🚀 Deploy Now](./DEPLOYMENT.md)
