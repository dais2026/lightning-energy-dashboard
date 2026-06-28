# Architecture Documentation

## System Overview

The Lightning Energy Dashboard is a full-stack web application for comparing and analyzing solar battery storage systems. It follows a modern React + Node.js + TypeScript architecture with end-to-end type safety.

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │          React 19 + Tailwind 4 Frontend              │   │
│  │  - Battery Dashboard (6 comparison charts)            │   │
│  │  - File Management UI                                │   │
│  │  - Authentication (Manus OAuth)                       │   │
│  └───────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────┘
             │ HTTPS (tRPC)
             ▼
┌─────────────────────────────────────────────────────────────┐
│               Express.js Server (Node.js)                    │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  Security & Monitoring Layer                          │   │
│  │  - Helmet.js (Security Headers)                       │   │
│  │  - Rate Limiting (100 req/15min)                      │   │
│  │  - Request Logging (pino-http)                        │   │
│  │  - Health Check (/health, /metrics)                   │   │
│  └───────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  tRPC Router Layer                                    │   │
│  │  - auth.me, auth.logout                              │   │
│  │  - files.list, files.upload, files.delete, etc.      │   │
│  │  - Protected procedures with JWT auth                │   │
│  └───────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────┘
             │
      ┌──────┴──────┬──────────────┬──────────────┐
      ▼             ▼              ▼              ▼
  ┌────────┐   ┌────────┐    ┌───────────┐  ┌────────┐
  │ MySQL  │   │ AWS S3 │    │ OAuth     │  │Logs    │
  │Database│   │Storage │    │Provider   │  │(pino)  │
  └────────┘   └────────┘    └───────────┘  └────────┘
```

## Directory Structure

```
lightning-energy-dashboard/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── ui/                  # shadcn/ui components (60+)
│   │   │   ├── charts/              # Custom chart components
│   │   │   └── layout/              # Layout components
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.tsx             # Main dashboard (743 lines)
│   │   │   ├── NotFound.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── batteryData.ts       # Battery specs (44 KB, 819 lines)
│   │   │   ├── trpc.ts              # tRPC client setup
│   │   │   └── utils.ts
│   │   ├── App.tsx                  # Main app component
│   │   ├── index.css                # Global styles & design tokens
│   │   └── main.tsx                 # Entry point
│   ├── public/                      # Static assets
│   │   ├── index.html               # HTML template
│   │   ├── favicon.ico
│   │   └── ...
│   └── tsconfig.json
│
├── server/                          # Node.js Backend
│   ├── _core/
│   │   ├── index.ts                 # Server entry point (170 lines)
│   │   │   - Helmet.js middleware
│   │   │   - Rate limiting
│   │   │   - Health/metrics endpoints
│   │   │   - Vite dev server setup
│   │   ├── context.ts               # tRPC context creation
│   │   ├── trpc.ts                  # tRPC instance
│   │   ├── oauth.ts                 # OAuth routes
│   │   ├── storage.ts               # S3 file upload
│   │   ├── heartbeat.ts             # Server monitoring
│   │   └── ... (15 other modules)
│   ├── routers.ts                   # tRPC routes (113 lines)
│   │   - auth.me, auth.logout
│   │   - files.list, upload, delete, update
│   ├── db.ts                        # Database helpers
│   ├── index.ts                     # Static file server
│   ├── *.test.ts                    # Unit tests
│   └── storage.ts                   # File storage logic
│
├── drizzle/                         # Database Schema
│   └── schema.ts                    # MySQL table definitions
│       - users (13 fields)
│       - files (9 fields)
│
├── tests/                           # Test Suite
│   └── e2e/
│       └── dashboard.spec.ts        # Playwright E2E tests
│
├── .github/
│   ├── workflows/
│   │   └── ci.yml                   # GitHub Actions CI/CD
│   └── SECRETS_TEMPLATE.md          # GitHub Secrets guide
│
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite bundler config
├── vitest.config.ts                 # Vitest config
├── playwright.config.ts             # Playwright E2E config
├── drizzle.config.ts                # Drizzle ORM config
│
├── DEPLOYMENT.md                    # Deployment guide
├── SECURITY.md                      # Security guidelines
├── API.md                           # API documentation
└── ARCHITECTURE.md                  # This file
```

## Technology Stack

### Frontend
- **React 19**: Latest UI framework with compiler optimizations
- **Tailwind CSS 4**: Utility-first CSS with native CSS variables
- **TypeScript**: Full type safety
- **shadcn/ui**: 60+ accessible UI components built on Radix UI
- **Recharts**: Data visualization library
- **tRPC Client**: Type-safe API integration
- **React Router**: Client-side routing

### Backend
- **Node.js**: JavaScript runtime (LTS versions supported)
- **Express.js**: Web framework
- **TypeScript**: Full type safety
- **tRPC**: Type-safe API layer
- **Drizzle ORM**: Database ORM with type safety
- **Helmet.js**: Security middleware
- **express-rate-limit**: Rate limiting
- **pino**: Structured logging

### Database
- **MySQL 8.0+**: Relational database
- **Drizzle Kit**: Database migrations

### Storage
- **AWS S3**: File storage with presigned URLs

### Authentication
- **Manus OAuth**: Third-party OAuth provider
- **JWT**: Session tokens in httpOnly cookies

### Testing
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

### DevTools
- **Vite**: Fast build tool for development and production
- **esbuild**: Server bundle optimization
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## Data Flow

### Authentication Flow
```
1. User clicks "Login with Manus"
2. OAuth provider issues JWT token
3. Token stored in httpOnly cookie (secure, auto-sent)
4. Client requests protected endpoint
5. Server validates JWT from cookie
6. Request proceeds with user context
```

### File Upload Flow
```
1. User selects file in browser
2. File converted to base64
3. tRPC sends: { filename, fileData, mimeType }
4. Server validates and stores metadata in DB
5. Server uploads to S3 with presigned URL
6. S3 returns presigned URL for downloads
7. Response: { id, filename, url, uploadedAt }
```

### Battery Data Flow
```
1. Frontend imports batteryData.ts (44 KB)
2. React renders 6 comparison charts
3. Charts use Recharts for visualization
4. Charts are fully responsive
5. No API call needed (data is hardcoded)
```

## Security Architecture

### Request Flow Security
```
Request
  ↓
Helmet.js (security headers)
  ↓
Rate Limiting (prevent DoS)
  ↓
Request Logging (pino-http)
  ↓
JWT Authentication (if protected)
  ↓
Input Validation
  ↓
tRPC Procedure Handler
  ↓
Response with Security Headers
```

### Rate Limiting Layers
1. **General**: 100 requests/15 minutes per IP
2. **API Strict**: 30 POST/PUT/DELETE per 15 minutes
3. **File Uploads**: 10 uploads/hour

### Security Headers
- `Content-Security-Policy`: Restrict resource loading
- `X-Frame-Options: DENY`: Prevent clickjacking
- `X-Content-Type-Options: nosniff`: Prevent MIME sniffing
- `X-XSS-Protection`: Legacy XSS protection

## Performance Optimizations

### Frontend
- Code splitting with Vite
- Tree-shaking for unused code
- CSS variable system (Tailwind 4)
- Lazy loading of components
- Image optimization

### Backend
- Connection pooling (Drizzle)
- Request caching headers
- Gzip compression
- Static file serving

### Bundle Size
- Production: 931 KB gzipped
- 2,330 modules included
- React 19 optimizations

## Database Schema

### users table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  oauth_id VARCHAR(255),
  created_at TIMESTAMP,
  -- 9 other fields
);
```

### files table
```sql
CREATE TABLE files (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) FOREIGN KEY,
  filename VARCHAR(255),
  filesize INT,
  mime_type VARCHAR(100),
  s3_url VARCHAR(2048),
  uploaded_at TIMESTAMP,
  -- 2 other fields
);
```

## Environment Variables

### Development
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://user:pass@localhost:3306/dev_db
```

### Production
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://prod_user:secure_pass@db.host:3306/prod_db
JWT_SECRET=random_32_char_string
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
LOG_LEVEL=info
```

## Deployment Architecture

### Local Development
```
npm run dev
  ↓
Vite Dev Server (http://localhost:5173)
  ↓
Express Server (http://localhost:3001)
  ↓
Hot Module Replacement (HMR) enabled
```

### Production (AWS EC2)
```
GitHub Actions CI/CD
  ↓
npm run build (Vite + esbuild)
  ↓
Docker build (optional)
  ↓
Deploy to EC2 (or AWS App Runner)
  ↓
Nginx reverse proxy
  ↓
SSL/TLS (Let's Encrypt)
  ↓
PM2 process manager
```

## API Architecture

### tRPC Router Structure
```typescript
appRouter
├── auth
│   ├── me (query)
│   └── logout (mutation)
└── files
    ├── list (query)
    ├── upload (mutation)
    ├── update (mutation)
    └── delete (mutation)
```

### HTTP Endpoints
```
POST /api/trpc/auth.me
POST /api/trpc/auth.logout
POST /api/trpc/files.list
POST /api/trpc/files.upload
POST /api/trpc/files.update
POST /api/trpc/files.delete
GET  /health (public)
GET  /metrics (public)
```

## Scaling Considerations

### Database
- Use read replicas for scaling
- Configure connection pooling
- Add database indexes for common queries
- Monitor slow query log

### File Storage
- S3 is infinitely scalable
- Consider CloudFront CDN for downloads
- Use lifecycle policies for old files

### Application Server
- Use horizontal scaling with load balancer
- Stateless server design (cookies handle state)
- Session replication not needed (JWT)

### Monitoring
- Set up log aggregation (ELK, Splunk)
- Enable application monitoring (New Relic, DataDog)
- Configure alerts for errors and performance

## Future Architecture Improvements

1. **Caching Layer**: Redis for session caching
2. **Message Queue**: Bull/RabbitMQ for async tasks
3. **GraphQL**: Consider GraphQL for complex queries
4. **Microservices**: Separate auth, files, data services
5. **Kubernetes**: Docker + Kubernetes for orchestration
6. **Monitoring**: Prometheus + Grafana for metrics
7. **Logging**: ELK Stack for centralized logging
8. **CDN**: CloudFront/Cloudflare for static assets

## Development Workflow

```
1. Feature branch from main
   git checkout -b feature/new-feature
   
2. Make changes
   - Follow TypeScript best practices
   - Add tests for new functionality
   - Update documentation
   
3. Run local validation
   npm run check    # Type check
   npm run test     # Unit tests
   npm run test:e2e # E2E tests
   npm run build    # Production build
   
4. Commit with conventional commits
   git commit -m "feat: add new feature"
   
5. Push and create pull request
   git push origin feature/new-feature
   
6. GitHub Actions runs CI/CD pipeline
   - Tests on Node 18.x and 20.x
   - Type checking
   - Security scanning
   
7. Code review and merge
   git merge --squash feature/new-feature
   
8. Main branch is automatically deployed
```

## Monitoring & Observability

### Health Checks
- `/health` endpoint for uptime monitoring
- `/metrics` for resource usage tracking

### Logging
- Structured JSON logs with pino
- Log levels: info, warn, error, debug
- Request/response timing

### Performance Monitoring
- Application Performance Monitoring (APM)
- Database query performance
- API endpoint response times
- Frontend metrics (Core Web Vitals)

## Disaster Recovery

### Backup Strategy
- Database backups every 6 hours
- S3 file versioning enabled
- Point-in-time recovery capability

### Recovery Procedures
1. Restore database from backup
2. Restore S3 files from version history
3. Redeploy application from git
4. Run database migrations
5. Verify system health

---

**Last Updated**: 2026-06-28
**Architecture Version**: 1.0.0
