# GitHub Secrets Setup

This document lists all required GitHub Secrets for CI/CD deployment.

## How to Add Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret below with the value from your production environment

## Required Secrets

### Application Configuration
- **NODE_ENV**: `production`
- **LOG_LEVEL**: `info` (or `debug`)

### Database
- **DATABASE_URL**: `mysql://username:password@host:port/database`
  - MySQL connection string with credentials
  - **NEVER share or commit this**

### Authentication & Security
- **JWT_SECRET**: Random 32+ character string
  - Generate: `openssl rand -base64 32`
  - **NEVER share or commit this**
- **OAUTH_SERVER_URL**: `https://oauth.example.com` (or your OAuth provider)

### File Storage (AWS S3)
- **AWS_ACCESS_KEY_ID**: Your AWS access key
  - Create IAM user with S3-only permissions
  - **NEVER share or commit this**
- **AWS_SECRET_ACCESS_KEY**: Your AWS secret key
  - **NEVER share or commit this**
- **AWS_REGION**: `us-east-1` (or your region)
- **AWS_BUCKET**: Your S3 bucket name (e.g., `lightning-energy-files`)

### Deployment (AWS CodeDeploy / GitHub Actions)
- **DEPLOY_HOST**: `ec2-instance.example.com` (if using EC2)
- **DEPLOY_USER**: `ubuntu` or `ec2-user`
- **DEPLOY_KEY**: SSH private key for deployment
  - Create new SSH key: `ssh-keygen -t rsa -b 4096 -f deploy_key`
  - Add public key to EC2 instance
  - Add private key as secret

### Monitoring & Analytics (Optional)
- **SENTRY_DSN**: Your Sentry project DSN for error tracking
- **DATADOG_API_KEY**: DataDog API key for metrics (if using DataDog)

### CI/CD (Optional)
- **SLACK_WEBHOOK**: Slack webhook for deployment notifications
- **EMAIL_NOTIFICATION**: Email for deployment alerts

## Example Values (Replace with Real Values)

```bash
NODE_ENV=production
LOG_LEVEL=info
DATABASE_URL=mysql://prod_user:SecurePassword123@db.example.com:3306/lightning_energy
JWT_SECRET=xK8mP2qL9vN5bH6gJ3wZ7xC4dF1eR8tY9
OAUTH_SERVER_URL=https://oauth.example.com
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_BUCKET=lightning-energy-prod-files
DEPLOY_HOST=ec2-18-200-100-50.compute-1.amazonaws.com
DEPLOY_USER=ubuntu
```

## Security Best Practices

1. **Never commit secrets** - Secrets should ONLY be in GitHub Secrets, not in code or .env files
2. **Use strong values** - Generate random strings for tokens and keys
3. **Rotate regularly** - Rotate secrets every 90 days or after team changes
4. **Limit permissions** - Create IAM users with minimal required permissions
5. **Audit access** - Review who has access to secrets
6. **Alert on changes** - Enable notifications for secret modifications

## Verification

To verify secrets are properly configured:

1. Check CI/CD workflow runs in Actions tab
2. Verify jobs passed: test, code-quality, security, deploy
3. Check GitHub Actions logs (only visible to repository admins)
4. Test deployment: `npm run build` locally, then deploy

## Troubleshooting

### "Secret not found" error in CI
- Verify secret name matches exactly (case-sensitive)
- Make sure workflow file uses `${{ secrets.SECRET_NAME }}`
- Re-save the secret if just added (sometimes needs refresh)

### Deployment fails with auth error
- Verify AWS/deployment credentials are correct
- Check SSH key has proper permissions (600)
- Ensure deployment host firewall allows SSH access

### Database connection fails in CI
- Verify DATABASE_URL is accessible from GitHub Actions
- May need to whitelist GitHub Actions IP addresses
- Check database user permissions

## Cleanup

When decommissioning the application:

1. Delete all secrets from GitHub
2. Rotate production credentials (database password, keys, etc.)
3. Disable IAM users used for deployment
4. Archive or delete backups
5. Update status page

---

Last Updated: 2026-06-28
