# Deployment Guide — Lightning Energy Dashboard

This guide covers deploying the Lightning Energy Dashboard to production.

## Prerequisites

- Node.js 18+ (20+ recommended)
- npm or pnpm
- MySQL database (TiDB or compatible)
- AWS S3 account (for file storage)
- Manus OAuth credentials

## Environment Variables

Create a `.env.production` file with:

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/lightning_energy

# Authentication
JWT_SECRET=your-secure-jwt-secret-key-min-32-chars
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://oauth.manus.cloud
VITE_OAUTH_PORTAL_URL=https://portal.manus.cloud

# Owner
OWNER_OPEN_ID=your-owner-open-id
OWNER_NAME=Your Name

# API
BUILT_IN_FORGE_API_URL=https://api.manus.cloud
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.cloud
VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=lightning-energy-storage

# Server
PORT=3000
NODE_ENV=production
```

## Local Testing

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run type check:**
   ```bash
   npm run check
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Start production server:**
   ```bash
   NODE_ENV=production npm start
   ```

The server will listen on the configured PORT (default: 3000).

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build
RUN npm run build

# Start server
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://root:password@db:3306/lightning_energy
      JWT_SECRET: ${JWT_SECRET}
      VITE_APP_ID: ${VITE_APP_ID}
      # ... other env vars
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: lightning_energy
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

## Deployment Platforms

### Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Note:** Vercel's serverless functions have a 12s timeout; this project requires a long-running process. Use Vercel's Node.js runtime or a dedicated server.

### AWS EC2

1. **Launch EC2 instance** (Ubuntu 22.04, t3.small or larger)

2. **SSH into instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install dependencies:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs npm mysql-client
   ```

4. **Clone repository:**
   ```bash
   git clone https://github.com/dais2026/lightning-energy-dashboard.git
   cd lightning-energy-dashboard
   ```

5. **Install npm dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

6. **Create .env.production file** with your secrets

7. **Build:**
   ```bash
   npm run build
   ```

8. **Set up PM2 for process management:**
   ```bash
   sudo npm install -g pm2
   pm2 start "npm start" --name "lightning-energy"
   pm2 startup
   pm2 save
   ```

9. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. **Enable HTTPS (Let's Encrypt):**
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Create new app
3. Set build command: `npm install --legacy-peer-deps && npm run build`
4. Set run command: `npm start`
5. Add environment variables
6. Deploy

### Heroku (Legacy - no longer free)

For reference if migrating from Heroku:

```bash
heroku create lightning-energy
heroku config:set JWT_SECRET=your-secret
heroku config:set DATABASE_URL=mysql://...
git push heroku main
```

## Database Setup

1. **Create database:**
   ```sql
   CREATE DATABASE lightning_energy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Run migrations:**
   ```bash
   npm run db:push
   ```

3. **Verify tables:**
   ```sql
   USE lightning_energy;
   SHOW TABLES;
   ```

## Monitoring & Logs

### Application Logs

```bash
# With PM2
pm2 logs lightning-energy

# Docker
docker logs container-id

# Direct
NODE_ENV=production npm start > app.log 2>&1 &
tail -f app.log
```

### Health Check

```bash
curl http://localhost:3000/
```

Expected response: HTTP 200 with HTML

### tRPC Health Endpoint

```bash
curl http://localhost:3000/api/trpc/system.health
```

## Performance Optimization

1. **Enable gzip compression:**
   ```javascript
   // In server/_core/index.ts
   import compression from 'compression';
   app.use(compression());
   ```

2. **Set up CDN for static assets:**
   - CloudFront (AWS)
   - Cloudflare
   - Bunny CDN

3. **Database connection pooling:**
   - Configure in DATABASE_URL connection string
   - Increase pool size for high traffic

4. **Enable Redis caching:**
   - Cache battery data
   - Session storage
   - File metadata

## Troubleshooting

### Port Already in Use

The server automatically finds an available port starting from 3000.

### Database Connection Error

- Verify DATABASE_URL is correct
- Check MySQL server is running
- Confirm credentials have database access

### OAuth Callback Failing

- Verify OAUTH_SERVER_URL is correct
- Confirm VITE_APP_ID is registered in OAuth provider
- Check callback URL is whitelisted

### S3 Upload Failures

- Verify AWS credentials
- Check bucket exists and policy allows PutObject
- Confirm AWS_REGION matches bucket region

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install --legacy-peer-deps
npm run build
```

## Security Checklist

- [ ] Environment variables are not committed
- [ ] JWT_SECRET is strong (32+ random characters)
- [ ] Database password is strong
- [ ] HTTPS/SSL is enabled
- [ ] OAuth redirect URI is whitelisted
- [ ] S3 bucket policy is restrictive
- [ ] Database backups are configured
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Secrets are rotated regularly

## Backup Strategy

1. **Database backups:**
   ```bash
   mysqldump -u user -p database_name > backup.sql
   ```

2. **S3 versioning:**
   - Enable in S3 bucket settings
   - Files are automatically versioned

3. **Code backups:**
   - GitHub is the primary backup
   - Regular branch backups recommended

## Rollback Procedure

1. **Identify working commit:**
   ```bash
   git log --oneline
   ```

2. **Rollback locally:**
   ```bash
   git checkout <commit-hash>
   npm install --legacy-peer-deps
   npm run build
   ```

3. **Test thoroughly**

4. **Push to production:**
   ```bash
   git push --force-with-lease
   npm start
   ```

## Support & Escalation

- **GitHub Issues:** Report bugs and feature requests
- **Email:** george.f@lightning-energy.com.au
- **Phone:** 0419 574 520

---

**Last Updated:** June 28, 2026
**Version:** 1.0.0
