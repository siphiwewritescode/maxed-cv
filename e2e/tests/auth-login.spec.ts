import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form with all fields', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Maxed-CV');
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible(); // Remember me
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should have password visibility toggle button', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page.locator('button[aria-label*="password"]');

    await expect(passwordInput).toBeVisible();
    await expect(toggleButton).toBeVisible();
  });

  test('should toggle password visibility when clicking eye icon', async ({ page }) => {
    const passwordField = page.locator('div:has(> input[type="password"]) input, div:has(> input[type="text"][required]) input').first();
    const toggleButton = page.locator('button[aria-label*="password"]');

    // Initially should be password type
    await expect(passwordField).toHaveAttribute('type', 'password');

    // Click toggle
    await toggleButton.click();

    // Should be text type
    await expect(passwordField).toHaveAttribute('type', 'text');

    // Click again
    await toggleButton.click();

    // Should be password type
    await expect(passwordField).toHaveAttribute('type', 'password');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    await page.getByRole('button', { name: /sign in/i }).click();

    // Should show error message
    await expect(page.locator('div[style*="background-color: #fee"]')).toBeVisible();
    await expect(page.locator('div[style*="background-color: #fee"]')).toContainText(/failed/i);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Login with Sipho's account
    await page.fill('input[type="email"]', 'sipho@example.com');
    await page.fill('input[type="password"]', 'password123');

    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Should show user content
    await expect(page.locator('body')).toContainText('Sipho');
  });

  test('should persist Remember Me checkbox state', async ({ page }) => {
    const rememberMeCheckbox = page.locator('input[type="checkbox"]');

    // Initially unchecked
    await expect(rememberMeCheckbox).not.toBeChecked();

    // Check it
    await rememberMeCheckbox.check();
    await expect(rememberMeCheckbox).toBeChecked();

    // Uncheck it
    await rememberMeCheckbox.uncheck();
    await expect(rememberMeCheckbox).not.toBeChecked();
  });

  test('should have forgot password link', async ({ page }) => {
    const forgotLink = page.getByRole('link', { name: /forgot password/i });
    await expect(forgotLink).toBeVisible();
    await expect(forgotLink).toHaveAttribute('href', '/reset-password');
  });

  test('should have signup link', async ({ page }) => {
    const signupLink = page.getByRole('link', { name: /sign up/i });
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute('href', '/signup');
  });

  test('should show OAuth login buttons', async ({ page }) => {
    await expect(page.getByText('Google')).toBeVisible();
    await expect(page.getByText('LinkedIn')).toBeVisible();
  });

  test('should not allow empty submission', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();

    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');

    await emailInput.fill('invalid-email');
    await page.fill('input[type="password"]', 'password123');

    await page.getByRole('button', { name: /sign in/i }).click();

    // HTML5 validation should catch invalid email
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });
});
