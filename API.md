# API Documentation

## Overview

The Lightning Energy Dashboard uses **tRPC** for end-to-end type-safe API communication. All API endpoints are defined in `server/routers.ts` and are automatically type-safe on both server and client.

## Base URL

- **Development**: `http://localhost:3001/api/trpc`
- **Production**: `https://yourdomain.com/api/trpc`

## Authentication

All API calls use **JWT tokens** stored in httpOnly cookies. Authentication is handled automatically by tRPC. For protected procedures, use:

```typescript
// Client-side (automatic)
import { trpc } from '@/lib/trpc';

// Only authenticated users can call
const result = await trpc.auth.me.query();
```

## Available Endpoints

### Authentication Module (`auth.*`)

#### `auth.me`
Get current authenticated user information.

**Type**: Query (GET)
**Authentication**: Required
**Response**:
```json
{
  "id": "user123",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Example**:
```typescript
const user = await trpc.auth.me.query();
console.log(user.email);
```

#### `auth.logout`
Logout current user and invalidate JWT token.

**Type**: Mutation (POST)
**Authentication**: Required
**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Example**:
```typescript
const result = await trpc.auth.logout.mutate();
```

### File Management Module (`files.*`)

#### `files.list`
List all files uploaded by current user.

**Type**: Query (GET)
**Authentication**: Required
**Query Parameters**: None
**Response**:
```json
[
  {
    "id": "file123",
    "filename": "battery-specs.pdf",
    "filesize": 1024000,
    "mimeType": "application/pdf",
    "uploadedAt": "2024-01-20T14:22:00Z",
    "url": "https://s3.amazonaws.com/..."
  }
]
```

**Example**:
```typescript
const files = await trpc.files.list.query();
files.forEach(file => {
  console.log(`${file.filename} (${file.filesize} bytes)`);
});
```

#### `files.upload`
Upload a new file to S3 storage.

**Type**: Mutation (POST)
**Authentication**: Required
**Request Body**:
```typescript
{
  filename: string;      // Max 255 chars
  fileData: string;      // Base64 encoded file content
  mimeType?: string;     // Optional MIME type
}
```

**Response**:
```json
{
  "id": "file456",
  "filename": "invoice.pdf",
  "filesize": 512000,
  "mimeType": "application/pdf",
  "url": "https://s3.amazonaws.com/...",
  "uploadedAt": "2024-01-20T15:00:00Z"
}
```

**Example**:
```typescript
const file = await trpc.files.upload.mutate({
  filename: 'document.pdf',
  fileData: base64EncodedContent,
  mimeType: 'application/pdf'
});
console.log(`File uploaded: ${file.url}`);
```

**Limits**:
- Max file size: 50MB
- Max uploads per hour: 10 (rate limited)
- Supported formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, ZIP

#### `files.update`
Update file metadata (currently only filename).

**Type**: Mutation (POST)
**Authentication**: Required
**Request Body**:
```typescript
{
  fileId: string;        // File ID to update
  filename: string;      // New filename
}
```

**Response**:
```json
{
  "id": "file456",
  "filename": "updated-document.pdf",
  "uploadedAt": "2024-01-20T15:00:00Z"
}
```

**Example**:
```typescript
const updated = await trpc.files.update.mutate({
  fileId: 'file456',
  filename: 'new-name.pdf'
});
```

#### `files.delete`
Delete a file from storage and database.

**Type**: Mutation (DELETE)
**Authentication**: Required
**Request Body**:
```typescript
{
  fileId: string;  // File ID to delete
}
```

**Response**:
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

**Example**:
```typescript
const result = await trpc.files.delete.mutate({
  fileId: 'file456'
});
```

## Health & Monitoring Endpoints

These endpoints don't require authentication and are public.

### GET `/health`
System health check.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T15:30:45Z",
  "uptime": 3600,
  "environment": "production"
}
```

### GET `/metrics`
System metrics and resource usage.

**Response**:
```json
{
  "memory": {
    "heapUsed": "128MB",
    "heapTotal": "512MB",
    "external": "32MB"
  },
  "uptime": 3600,
  "timestamp": "2024-01-20T15:30:45Z"
}
```

## Rate Limiting

Rate limits are applied per IP address:

- **General API**: 100 requests per 15 minutes
- **POST/PUT/DELETE**: 30 requests per 15 minutes
- **File Uploads**: 10 uploads per hour

When rate limit is exceeded, the API returns:

```json
{
  "status": 429,
  "message": "Too many requests from this IP, please try again later."
}
```

Response headers include:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Unix timestamp when limit resets

## Error Handling

All API errors follow this format:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "User must be logged in"
  }
}
```

### Common Error Codes

- **UNAUTHORIZED**: Authentication required or expired
- **FORBIDDEN**: User lacks permission for this action
- **BAD_REQUEST**: Invalid request parameters
- **NOT_FOUND**: Resource not found
- **CONFLICT**: Resource already exists
- **RATE_LIMITED**: Too many requests (HTTP 429)
- **INTERNAL_SERVER_ERROR**: Server error

## Response Headers

All API responses include these security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## Examples

### Complete File Upload Example

```typescript
import { trpc } from '@/lib/trpc';

async function uploadFile(file: File) {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    
    // Upload via tRPC
    const result = await trpc.files.upload.mutate({
      filename: file.name,
      fileData: base64,
      mimeType: file.type
    });
    
    console.log('File uploaded:', result.url);
    return result;
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

### Complete Authentication Example

```typescript
import { trpc } from '@/lib/trpc';

async function checkAuth() {
  try {
    const user = await trpc.auth.me.query();
    console.log('Logged in as:', user.email);
    return user;
  } catch (error) {
    console.log('Not authenticated');
    return null;
  }
}

async function handleLogout() {
  try {
    await trpc.auth.logout.mutate();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error.message);
  }
}
```

## Pagination

Currently, list endpoints return all results. For future pagination support, the API will include:

```typescript
{
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

## Versioning

The API uses tRPC which provides automatic backward compatibility. No version header is required.

## Webhooks

Currently, the API does not support webhooks. Contact support for webhook requirements.

## Rate Limiting Strategy

Implement exponential backoff for client retries:

```typescript
async function retryWithBackoff(fn: () => Promise<T>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        // Wait 2^i seconds before retry
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}
```

## CORS

CORS is configured to allow requests from:

- **Development**: `http://localhost:3001`
- **Production**: Your domain (configure in environment)

To add more allowed origins, set environment variable:

```bash
ALLOWED_ORIGINS=https://domain1.com,https://domain2.com
```

## SSL/TLS

In production, all API calls must use HTTPS. Self-signed certificates are not supported for production.

## Analytics

API usage is logged and can be analyzed:

- **Request count**: Available via `/metrics` endpoint
- **Error rates**: Check application logs
- **Response times**: Included in structured logs
- **User activity**: File uploads, authentication events

## Support

For API issues or questions:

1. Check this documentation
2. Review error messages and logs
3. Contact support: api-support@yourdomain.com

---

**Last Updated**: 2026-06-28
**API Version**: 1.0.0
**tRPC Version**: ^10.x
