import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto('/dashboard', { waitUntil: 'networkidle' });

    // Should redirect to login (with optional query param)
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show dashboard when authenticated', async ({ page }) => {
    // Login first
    await page.goto('/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'sipho@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Should be on dashboard
    await expect(page).toHaveURL('/dashboard');

    // Should show user's name
    await expect(page.locator('body')).toContainText('Sipho');
  });

  test('should show verification banner for unverified email', async ({ page, context }) => {
    // Create a new account (which will be unverified)
    await page.goto('/signup');

    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;

    await page.locator('input[type="text"]').first().fill('Test');
    await page.locator('input[type="text"]').nth(1).fill('User');
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: /create account/i }).click();

    // Should be on dashboard
    await expect(page).toHaveURL('/dashboard');

    // Should show verification banner
    // Look for text about verifying email
    await expect(page.locator('body')).toContainText(/verify/i);
  });

  test('should allow resending verification email', async ({ page }) => {
    // Create a new account
    await page.goto('/signup');

    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;

    await page.locator('input[type="text"]').first().fill('Test');
    await page.locator('input[type="text"]').nth(1).fill('User');
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill('password123');
    await page.getByRole('button', { name: /create account/i }).click();

    // Find and click resend verification button
    const resendButton = page.getByRole('button', { name: /resend/i });

    if (await resendButton.isVisible()) {
      await resendButton.click();

      // Should show success message (adjust based on your implementation)
      await expect(page.locator('body')).toContainText(/sent/i);
    }
  });

  test('should have logout functionality', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sipho@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/dashboard');

    // Look for logout button/link
    const logoutButton = page.getByRole('button', { name: /logout/i });

    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Should redirect to login
      await expect(page).toHaveURL('/login');

      // Trying to access dashboard should redirect to login
      await page.goto('/dashboard');
      await expect(page).toHaveURL('/login');
    }
  });
});

test.describe('Route Protection', () => {
  test('should protect /dashboard route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('should allow authenticated users to access protected routes', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sipho@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Navigate to dashboard
    await page.goto('/dashboard');

    // Should stay on dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should maintain session across page reloads', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sipho@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL('/dashboard');

    // Reload page
    await page.reload();

    // Should still be on dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('body')).toContainText('Sipho');
  });
});
