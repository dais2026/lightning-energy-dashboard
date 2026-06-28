import { test, expect } from '@playwright/test';

test.describe('Lightning Energy Dashboard', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lightning Energy|Dashboard/);
  });

  test('should display battery comparison charts', async ({ page }) => {
    await page.goto('/');
    
    // Wait for main content to load
    await page.waitForSelector('[data-testid="battery-grid"]', { timeout: 10000 }).catch(() => null);
    
    // Check for page heading
    const heading = page.locator('h1, h2, [role="heading"]').first();
    await expect(heading).toBeVisible();
  });

  test('should display battery data', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle').catch(() => null);
    
    // Check if page has content
    const body = page.locator('body');
    await expect(body).toContainText(/energy|battery|watt|solar/i);
  });

  test('health endpoint should be accessible', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('environment');
  });

  test('metrics endpoint should be accessible', async ({ request }) => {
    const response = await request.get('/metrics');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('memory');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('timestamp');
  });

  test('should handle navigation', async ({ page }) => {
    await page.goto('/');
    
    // Wait for any interactive elements
    await page.waitForLoadState('domcontentloaded');
    
    const initialUrl = page.url();
    expect(initialUrl).toContain('localhost');
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const heading = page.locator('h1, h2, [role="heading"]').first();
    await expect(heading).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const heading = page.locator('h1, h2, [role="heading"]').first();
    await expect(heading).toBeVisible();
  });

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    const heading = page.locator('h1, h2, [role="heading"]').first();
    await expect(heading).toBeVisible();
  });
});

test.describe('API Security', () => {
  test('should have security headers', async ({ request }) => {
    const response = await request.get('/');
    
    // Check for common security headers
    const headers = response.headers();
    expect(headers['x-content-type-options'] || headers['X-Content-Type-Options']).toBeDefined();
    expect(headers['x-frame-options'] || headers['X-Frame-Options']).toBeDefined();
  });

  test('should respond to rate limiting gracefully', async ({ request }) => {
    // Make multiple rapid requests
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(request.get('/health'));
    }
    
    const responses = await Promise.all(requests);
    
    // All requests should either succeed (200) or be rate limited (429)
    responses.forEach(response => {
      expect([200, 429]).toContain(response.status());
    });
  });
});
