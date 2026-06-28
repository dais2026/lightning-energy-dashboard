# Security Guidelines

## Overview

This document outlines the security practices and considerations for the Lightning Energy Dashboard application. The project implements multiple layers of security to protect user data, prevent attacks, and ensure system integrity.

## Security Features

### 1. **Helmet.js - Security Headers**

The application uses Helmet.js to set HTTP security headers automatically:

- **Content-Security-Policy (CSP)**: Restricts resource loading to prevent XSS attacks
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Legacy XSS protection
- **Strict-Transport-Security**: Forces HTTPS connections

### 2. **Rate Limiting**

Rate limiting is implemented at multiple levels:

```
- General API: 100 requests per 15 minutes per IP
- Strict API: 30 POST/PUT/DELETE requests per 15 minutes
- File Uploads: 10 uploads per hour per IP
```

Exceeding limits returns HTTP 429 (Too Many Requests).

### 3. **Request Logging**

All HTTP requests are logged with pino-http:

- Request method, path, and status code
- Response time and size
- Remote IP address
- User agent
- Structured JSON logging for easy analysis

**Access logs in production**: Configure log aggregation service (ELK, Splunk, Datadog)

### 4. **CORS & Origin Validation**

CORS headers should be configured based on your domain:

```typescript
// Add to server/_core/index.ts if needed:
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
  credentials: true,
}));
```

### 5. **JWT Authentication**

- JWT tokens stored in httpOnly cookies (cannot be accessed by JavaScript)
- Tokens include expiration time
- Refresh token rotation for long sessions
- OAuth integration via Manus for secure authentication

### 6. **Input Validation & Sanitization**

Always validate and sanitize user input:

```typescript
// Use zod for schema validation (already in project)
import { z } from 'zod';

const uploadSchema = z.object({
  filename: z.string().min(1).max(255),
  filesize: z.number().positive().max(50 * 1024 * 1024),
});
```

### 7. **Database Security**

- Use parameterized queries (Drizzle ORM handles this)
- Never construct SQL queries with string concatenation
- Encrypt sensitive data at rest
- Use strong passwords for database access
- Restrict database access by IP

### 8. **Environment Variables**

**NEVER commit secrets to git**. Required environment variables:

```bash
# Authentication
JWT_SECRET=your-secret-key
OAUTH_SERVER_URL=https://oauth.example.com

# Database
DATABASE_URL=mysql://user:password@host:3306/db

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET=your-bucket-name

# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

Use a `.env.example` file to document required variables (included in git).

### 9. **HTTPS/TLS**

Always use HTTPS in production:

```bash
# Using Nginx with Let's Encrypt
sudo certbot certonly --standalone -d yourdomain.com
sudo nginx -s reload
```

### 10. **Security Headers Checklist**

- ✅ Content-Security-Policy
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### 11. **API Endpoint Security**

```typescript
// Protected routes example
app.post('/api/sensitive', (req, res) => {
  // 1. Check authentication
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  // 2. Check authorization
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  
  // 3. Validate input
  const { data } = uploadSchema.parse(req.body);
  
  // 4. Process safely
  res.json({ success: true });
});
```

### 12. **File Upload Security**

- ✅ Limit file size (currently 50MB max)
- ✅ Validate MIME types
- ✅ Scan for malware (optional: ClamAV integration)
- ✅ Store files outside web root
- ✅ Disable code execution in upload directory
- ✅ Use presigned URLs for file access

```nginx
# Nginx configuration for upload directory
location /uploads/ {
    # Disable script execution
    location ~ \.php$ { deny all; }
    location ~ \.js$ { deny all; }
    # Serve files directly
    alias /var/www/uploads/;
}
```

### 13. **Dependency Security**

Regularly audit dependencies for vulnerabilities:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (use with caution)
npm audit fix

# Check specific packages
npm list helmet express-rate-limit pino
```

Monitor security advisories:
- npm Security Advisories: https://www.npmjs.com/advisories
- Dependabot integration on GitHub
- GitHub Security tab for alerts

### 14. **Production Deployment Security**

Before deploying to production:

- [ ] Enable HTTPS/TLS with valid certificate
- [ ] Configure CORS properly
- [ ] Set environment variables securely
- [ ] Configure rate limiting thresholds
- [ ] Set up log aggregation
- [ ] Enable database encryption
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Run security audit: `npm audit`
- [ ] Review and test all security headers
- [ ] Document all security configurations
- [ ] Set up backup and disaster recovery
- [ ] Plan incident response procedures

### 15. **Health & Metrics Endpoints**

Health check and metrics endpoints are available:

```bash
# Health check
curl http://localhost:3000/health

# Metrics (basic info)
curl http://localhost:3000/metrics

# Restrict access in production:
app.use('/health', ipWhitelist(['127.0.0.1', 'monitoring-service']));
app.use('/metrics', ipWhitelist(['127.0.0.1', 'monitoring-service']));
```

### 16. **Monitoring & Logging**

Recommended monitoring tools:
- **Error Tracking**: Sentry, Rollbar, Bugsnag
- **Log Aggregation**: ELK Stack, Splunk, DataDog
- **APM**: New Relic, Datadog APM, Elastic APM
- **Uptime Monitoring**: Healthchecks.io, Pingdom, UptimeRobot

### 17. **Incident Response**

If a security incident occurs:

1. **Assess**: Determine the scope and severity
2. **Contain**: Stop the attack, revoke compromised tokens
3. **Eradicate**: Fix the vulnerability
4. **Recover**: Restore from backups if needed
5. **Document**: Create incident report
6. **Review**: Update security measures

## Security Headers Details

### Content-Security-Policy

Controls what resources can be loaded:

```
default-src 'self'              # Only allow same-origin by default
style-src 'self' 'unsafe-inline'  # Allow inline styles (for Tailwind)
script-src 'self' 'unsafe-eval'   # Allow scripts and eval (needed for React/Vite)
img-src 'self' data: https:        # Allow images from self, data URIs, HTTPS
```

### X-Frame-Options: DENY

Prevents the site from being embedded in iframes (prevents clickjacking).

### X-Content-Type-Options: nosniff

Prevents browsers from MIME-sniffing responses.

## Vulnerability Prevention

### SQL Injection
- ✅ Using Drizzle ORM with parameterized queries
- ✅ Never concatenate user input into SQL

### Cross-Site Scripting (XSS)
- ✅ React escapes JSX by default
- ✅ CSP headers restrict inline scripts
- ✅ Validate and sanitize all user input

### Cross-Site Request Forgery (CSRF)
- ✅ JWT tokens in httpOnly cookies
- ✅ tRPC validates request origin
- ✅ SameSite cookie attribute set

### Denial of Service (DoS)
- ✅ Rate limiting enabled
- ✅ Request size limits (50MB)
- ✅ Connection timeouts configured
- ✅ Health check endpoint for monitoring

## Further Reading

- [OWASP Top 10](https://owasp.org/Top10/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [npm Security Advisories](https://docs.npmjs.com/about-security-advisories)

## Security Contact

For security vulnerabilities, please email: security@yourdomain.com

**Do not open public issues for security vulnerabilities.**

---

**Last Updated**: 2026-06-28
**Version**: 1.0.0
