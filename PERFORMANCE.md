# Performance Optimization Guide

## Overview

This guide covers performance optimization strategies for the Lightning Energy Dashboard, including frontend, backend, and infrastructure considerations.

## Frontend Performance

### Bundle Size Analysis

Current bundle metrics:
- **Gzipped Size**: 931 KB
- **Total Modules**: 2,330
- **Entry Point Size**: ~400 KB (before gzip)

Check bundle size:

```bash
npm run build
# Output shows: dist/index.js (X KB) and dist/index.css (Y KB)
```

### Core Web Vitals

Monitor key performance metrics:

**Largest Contentful Paint (LCP)**
- Target: < 2.5s
- Optimize: Image loading, JavaScript parsing

**First Input Delay (FID) / Interaction to Next Paint (INP)**
- Target: < 100ms
- Optimize: Event listeners, long tasks

**Cumulative Layout Shift (CLS)**
- Target: < 0.1
- Optimize: Reserved space, animations

### Image Optimization

```typescript
// ✓ Use optimized images
<img 
  src="/images/battery.webp"
  alt="Battery comparison"
  loading="lazy"
  width={800}
  height={600}
/>

// ✗ Don't use large unoptimized images
<img src="/images/battery.png" />
```

### Code Splitting Strategy

```typescript
// ✓ Lazy load non-critical components
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Charts = lazy(() => import('./components/Charts'));

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminPanel />
    </Suspense>
  );
}

// ✗ Don't import everything at top level
import AdminPanel from './pages/AdminPanel';
```

### Caching Strategies

#### Client-Side Caching
```typescript
// Cache API responses
const cache = new Map();

function getCachedData(key: string) {
  if (cache.has(key)) {
    const cached = cache.get(key);
    if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.data;
    }
  }
  return null;
}
```

#### HTTP Caching Headers
```
Cache-Control: public, max-age=3600
Cache-Control: private, max-age=60
ETag: "abc123"
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT
```

### Component Performance

```typescript
// ✓ Memoize expensive components
const BatteryCard = memo(function BatteryCard({ battery }: Props) {
  return <div>{battery.name}</div>;
});

// ✓ Use useCallback for stable functions
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

// ✓ Use useMemo for expensive calculations
const sortedBatteries = useMemo(() => {
  return batteries.sort((a, b) => b.capacity - a.capacity);
}, [batteries]);

// ✗ Don't recalculate on every render
const sorted = batteries.sort((a, b) => b.capacity - a.capacity);
```

### React 19 Optimizations

Leverage React 19 compiler optimizations:

```typescript
// ✓ React 19 automatically optimizes
function Dashboard({ batteries }: Props) {
  const [search, setSearch] = useState('');
  
  // React 19 compiler automatically memoizes this
  const filtered = batteries.filter(b => 
    b.name.includes(search)
  );
  
  return <BatteryList items={filtered} />;
}

// React 19 handles this automatically - no need for useMemo/useCallback
```

### Recharts Optimization

```typescript
// ✓ Optimize chart rendering
<ResponsiveContainer width="100%" height={400}>
  <BarChart 
    data={batteries}
    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Legend />
    <Bar dataKey="capacity" fill="#00EAD3" />
  </BarChart>
</ResponsiveContainer>

// ✗ Don't render large datasets without pagination
const chartData = allBatteries.map(b => ({ ...b }));
<BarChart data={chartData} />
```

## Backend Performance

### Database Optimization

#### Connection Pooling

```typescript
// Already configured in Drizzle
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = drizzle(poolConnection);
```

#### Query Optimization

```typescript
// ✓ Use indexes for frequent queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_file_user_id ON files(user_id);

// ✓ Select only needed columns
const user = await db.select({
  id: users.id,
  email: users.email,
  name: users.name,
}).from(users).where(eq(users.id, userId));

// ✗ Don't select all columns if not needed
const user = await db.select().from(users).where(...);
```

#### Query Monitoring

```typescript
// Monitor slow queries
const startTime = Date.now();
const result = await query();
const duration = Date.now() - startTime;

if (duration > 1000) {
  console.warn(`Slow query (${duration}ms):`, query);
}
```

### API Response Optimization

#### Compression

Express middleware automatically gzip compresses responses > 1KB.

```typescript
app.use(compression({
  threshold: 1000,  // Only compress if > 1KB
  level: 6,         // Compression level (1-9)
}));
```

#### Pagination

For large datasets, implement pagination:

```typescript
interface PaginationParams {
  page: number;      // 1-indexed
  pageSize: number;  // Items per page
}

const paginate = (items: T[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  };
};
```

### Rate Limiting Performance

Current configuration:
- General: 100 req/15min per IP
- API: 30 POST per 15min per IP
- File uploads: 10/hour per IP

Adjust thresholds based on usage patterns:

```typescript
// Monitor rate limit hits
app.use((req, res, next) => {
  if (res.statusCode === 429) {
    console.warn(`Rate limit hit: ${req.ip}`);
  }
  next();
});
```

## Infrastructure Performance

### Server Deployment

#### Environment Setup

```bash
# Production environment
NODE_ENV=production
LOG_LEVEL=warn  # Reduce logging overhead

# Database
DATABASE_URL=...  # Use connection pooling

# Server
PORT=3000
NODE_OPTIONS=--max-old-space-size=512  # Memory limit
```

#### Process Management (PM2)

```bash
# Install PM2
npm install -g pm2

# Start with clustering
pm2 start npm --name "lightning-energy" -- start -- \
  -i max           # Max cluster instances
  --max-memory-restart 512M \
  --merge-logs

# Monitor
pm2 monit
pm2 logs
```

#### Reverse Proxy (Nginx)

```nginx
upstream app {
  server localhost:3001;
  server localhost:3002;
  server localhost:3003;
}

server {
  listen 80;
  server_name yourdomain.com;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
  gzip_min_length 1000;

  # Caching
  location ~* \.(js|css|png|jpg|gif|ico|svg|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
  }

  # API routes
  location /api/trpc {
    proxy_pass http://app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
  }

  # Static files
  location / {
    proxy_pass http://app;
    proxy_buffering off;
  }
}
```

### Database Performance

#### AWS RDS Optimization

```bash
# Check slow query log
SELECT * FROM mysql.slow_log;

# Monitor performance
SELECT * FROM information_schema.PROCESSLIST;

# Check table statistics
ANALYZE TABLE users;
ANALYZE TABLE files;
```

#### Backup Strategy

```bash
# Daily backups
mysqldump -u user -p database > backup_$(date +%Y%m%d).sql

# Or use AWS RDS automated backups
# Configure: 7-day retention, daily snapshots
```

### S3 Performance

#### CloudFront CDN

```typescript
// Use CloudFront for presigned URLs
const cloudFrontUrl = `https://d123.cloudfront.net/file.pdf`;

// S3 presigned URLs (1-hour expiry)
const s3Url = s3.getSignedUrl('getObject', {
  Bucket: 'lightning-energy-files',
  Key: 'path/to/file.pdf',
  Expires: 3600, // 1 hour
});
```

#### S3 Optimization

```typescript
// Use multipart uploads for large files
const uploadFile = async (file: Buffer) => {
  const params = {
    Bucket: 'lightning-energy-files',
    Key: `uploads/${Date.now()}_${file.name}`,
    Body: file,
    ContentType: file.type,
  };
  
  // Enables multipart upload for large files
  return await s3Client.send(new PutObjectCommand(params));
};
```

## Monitoring Performance

### Application Metrics

```typescript
// Track endpoint response times
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  
  next();
});
```

### Tools for Monitoring

**Frontend**:
- Chrome DevTools Performance tab
- Lighthouse CI
- Web Vitals reporting

**Backend**:
- Application Performance Monitoring (APM)
  - New Relic
  - DataDog
  - Elastic APM
- Log aggregation
  - ELK Stack
  - Splunk
  - CloudWatch

**Infrastructure**:
- Uptime monitoring
  - Healthchecks.io
  - Pingdom
- Resource monitoring
  - CloudWatch (AWS)
  - DigitalOcean Monitoring
  - Prometheus + Grafana

## Performance Checklist

### Before Deploying

- [ ] Bundle size analyzed (<1MB gzipped)
- [ ] Lighthouse score checked (90+)
- [ ] Core Web Vitals measured
- [ ] Database indexes created
- [ ] Cache headers configured
- [ ] Compression enabled
- [ ] CDN configured (optional)
- [ ] Security headers set
- [ ] Rate limiting tested
- [ ] Load testing completed

### Production Monitoring

- [ ] Uptime monitoring enabled
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled
- [ ] Logs aggregated
- [ ] Alerts configured
- [ ] Daily backups scheduled
- [ ] Health checks passing

## Load Testing

Test application under load:

```bash
# Using Apache Bench
ab -n 10000 -c 100 http://localhost:3001/

# Using wrk
wrk -t12 -c400 -d30s http://localhost:3001/

# Using k6
k6 run load-test.js
```

## Performance Goals

| Metric | Current | Target |
|--------|---------|--------|
| Lighthouse Score | 85+ | 95+ |
| LCP | < 2.5s | < 2.0s |
| FID | < 100ms | < 50ms |
| CLS | < 0.1 | < 0.05 |
| Bundle Size | 931 KB | 800 KB |
| API Response | < 200ms | < 100ms |
| Database Query | < 100ms | < 50ms |

## Further Reading

- [Web.dev Performance Guide](https://web.dev/performance/)
- [React Performance](https://react.dev/reference/react/memo)
- [Node.js Performance](https://nodejs.org/en/docs/guides/nodejs-performance-hooks/)
- [Express Performance](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

**Last Updated**: 2026-06-28
**Version**: 1.0.0
