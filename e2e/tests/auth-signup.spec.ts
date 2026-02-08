import { test, expect } from '@playwright/test';

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should display signup form with all fields', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Maxed-CV');
    await expect(page.locator('input[type="text"]').first()).toBeVisible(); // First name
    await expect(page.locator('input[type="text"]').nth(1)).toBeVisible(); // Last name
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('should have password visibility toggle button', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page.locator('button[aria-label*="password"]');

    // Password field should exist
    await expect(passwordInput).toBeVisible();

    // Toggle button should exist
    await expect(toggleButton).toBeVisible();
  });

  test('should toggle password visibility when clicking eye icon', async ({ page }) => {
    const passwordField = page.locator('div:has(> input[type="password"]) input, div:has(> input[type="text"][required][minlength="8"]) input').first();
    const toggleButton = page.locator('button[aria-label*="password"]');

    // Initially should be password type
    await expect(passwordField).toHaveAttribute('type', 'password');

    // Click toggle button
    await toggleButton.click();

    // Should now be text type (visible)
    await expect(passwordField).toHaveAttribute('type', 'text');

    // Click again to hide
    await toggleButton.click();

    // Should be password type again
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('should show validation for short password', async ({ page }) => {
    await page.locator('input[type="text"]').first().fill('John');
    await page.locator('input[type="text"]').nth(1).fill('Doe');
    await page.fill('input[type="email"]', 'john@example.com');

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('short');

    // Try to submit
    await page.getByRole('button', { name: /create account/i }).click();

    // HTML5 validation should prevent submission
    const validationMessage = await passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should show OAuth login buttons', async ({ page }) => {
    await expect(page.getByText('Google')).toBeVisible();
    await expect(page.getByText('LinkedIn')).toBeVisible();
  });

  test('should have link to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /sign in/i });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('should successfully signup with valid data', async ({ page, context }) => {
    // Generate unique email
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;

    // Fill form
    await page.locator('input[type="text"]').first().fill('Test');
    await page.locator('input[type="text"]').nth(1).fill('User');
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill('password123');

    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Should be logged in (check for user content or dashboard elements)
    // Adjust this based on your actual dashboard content
    await expect(page.locator('body')).toContainText('Test'); // User's first name should appear
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Try to signup with an existing email (use sipho's email)
    await page.locator('input[type="text"]').first().fill('Test');
    await page.locator('input[type="text"]').nth(1).fill('User');
    await page.locator('input[type="email"]').fill('sipho@example.com');
    await page.locator('input[type="password"]').fill('password123');

    await page.getByRole('button', { name: /create account/i }).click();

    // Should show error message
    await expect(page.locator('div[style*="background-color: #fee"]')).toContainText(/email/i);
  });
});
