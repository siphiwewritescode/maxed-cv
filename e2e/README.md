# Maxed-CV End-to-End Testing

This directory contains comprehensive end-to-end tests for the Maxed-CV application.

## 🎯 Testing Options

You have **three ways** to test your application:

### 1. **Manual Testing** (Recommended to start)
- Use `../MANUAL_TEST_CHECKLIST.md`
- Step-by-step testing guide
- Best for understanding all features
- No setup required

### 2. **Automated Playwright Tests** (This directory)
- Automated browser testing
- Run tests with a single command
- Get detailed reports

### 3. **Playwright MCP** (Advanced)
- Let Claude control the browser directly
- Interactive testing through conversation
- See `../playwright-mcp-setup.md` for setup

---

## 🚀 Quick Start (Automated Tests)

### 1. Install Dependencies

```bash
cd e2e
npm install
npx playwright install
```

### 2. Start Your Application

In a separate terminal:
```bash
cd ..
start.bat
```

Wait for services to be ready (about 30 seconds).

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests and see the browser
npm run test:headed

# Run tests in interactive UI mode
npm run test:ui

# Run tests in a specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Debug a specific test
npm run test:debug

# View last test report
npm run report
```

---

## 📁 Test Files

### `tests/auth-signup.spec.ts`
Tests signup functionality:
- ✅ Password visibility toggle
- ✅ Form validation
- ✅ Successful registration
- ✅ Duplicate email handling
- ✅ OAuth button presence

### `tests/auth-login.spec.ts`
Tests login functionality:
- ✅ Password visibility toggle
- ✅ Valid/invalid credentials
- ✅ Remember me checkbox
- ✅ Form validation
- ✅ Navigation links

### `tests/dashboard.spec.ts`
Tests dashboard and protection:
- ✅ Route protection (redirects when not logged in)
- ✅ Email verification banner
- ✅ Session persistence
- ✅ Logout functionality

---

## 🎨 Test Reports

After running tests, view the HTML report:

```bash
npm run report
```

This opens an interactive report showing:
- ✅ Passed/failed tests
- 📸 Screenshots of failures
- 🎬 Traces for debugging
- ⏱️ Performance metrics

---

## 🔧 Configuration

### `playwright.config.ts`

Key settings:
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Screenshots**: Taken on failure
- **Traces**: Recorded on retry
- **Retries**: 2 retries in CI, 0 locally

### Environment Variables

Create `.env` file in this directory if needed:

```env
BASE_URL=http://localhost:3000
API_URL=http://localhost:3001
TEST_USER_EMAIL=sipho@example.com
TEST_USER_PASSWORD=password123
```

---

## ✍️ Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/your-page');
  });

  test('should do something', async ({ page }) => {
    // Your test code
    await page.click('button');
    await expect(page.locator('h1')).toContainText('Expected');
  });
});
```

### Useful Commands

```typescript
// Navigation
await page.goto('/path');
await page.goBack();
await page.reload();

// Interactions
await page.click('button');
await page.fill('input[type="email"]', 'email@example.com');
await page.check('input[type="checkbox"]');
await page.selectOption('select', 'value');

// Assertions
await expect(page).toHaveURL('/expected-path');
await expect(page.locator('h1')).toBeVisible();
await expect(page.locator('h1')).toContainText('text');
await expect(page.locator('input')).toHaveAttribute('type', 'password');
await expect(page.locator('input')).toHaveValue('value');

// Waiting
await page.waitForURL('/path');
await page.waitForSelector('div.loaded');
await page.waitForLoadState('networkidle');
```

### Generate Tests with Codegen

Record tests by interacting with your app:

```bash
npm run codegen
```

This opens a browser where you can:
1. Click around your app
2. Playwright generates test code automatically
3. Copy the generated code to your test files

---

## 🐛 Debugging Tests

### Debug Mode

```bash
npm run test:debug
```

Opens Playwright Inspector where you can:
- Step through tests
- See page screenshots
- Inspect DOM
- View console logs

### VS Code Debugging

Install the [Playwright VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for:
- Run tests from editor
- Set breakpoints
- Debug directly in VS Code

### Headed Mode

See the browser while tests run:

```bash
npm run test:headed
```

### Slow Motion

Add to your test:

```typescript
test('slow test', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // Wait 1 second
});
```

---

## 📊 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - name: Install dependencies
        run: |
          npm ci
          cd e2e && npm ci
          npx playwright install --with-deps
      - name: Start services
        run: docker-compose up -d
      - name: Run tests
        run: cd e2e && npm test
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: e2e/playwright-report/
```

---

## 📝 Best Practices

### 1. **Use Data Test IDs**

Add to your components:
```jsx
<button data-testid="submit-button">Submit</button>
```

Use in tests:
```typescript
await page.getByTestId('submit-button').click();
```

### 2. **Clean Up Test Data**

Use `test.afterEach()` to clean up:
```typescript
test.afterEach(async ({ page, context }) => {
  // Delete test user
  await context.clearCookies();
});
```

### 3. **Use Page Object Model**

Create helper classes for complex pages:

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// In tests:
const loginPage = new LoginPage(page);
await loginPage.login('user@example.com', 'password');
```

### 4. **Parallel Execution**

Tests run in parallel by default. For tests that must run sequentially:

```typescript
test.describe.serial('Sequential tests', () => {
  // These tests run one after another
});
```

---

## 🔍 Common Issues

### Tests Timing Out

Increase timeout in config:
```typescript
timeout: 30000, // 30 seconds per test
```

### Services Not Starting

1. Check if Docker is running: `docker ps`
2. Start manually: `cd .. && start.bat`
3. Wait 30 seconds before running tests

### Tests Failing Intermittently

Add explicit waits:
```typescript
await page.waitForLoadState('networkidle');
await page.waitForSelector('[data-testid="loaded"]');
```

### Port Already in Use

Kill processes on ports 3000/3001:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use stop.bat then start.bat
```

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

---

## 🎯 Next Steps

1. ✅ Run manual tests from `MANUAL_TEST_CHECKLIST.md`
2. ✅ Install and run automated tests (`npm install && npm test`)
3. ✅ Review test reports (`npm run report`)
4. ✅ Add more tests for new features
5. ✅ Set up Playwright MCP for Claude-driven testing (optional)

Happy testing! 🚀
