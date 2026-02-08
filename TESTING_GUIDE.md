# 🧪 Complete Testing Guide for Maxed-CV

This guide covers **both manual and automated testing** for your application.

---

## 📋 What's Been Set Up

### ✅ Manual Testing
- **`MANUAL_TEST_CHECKLIST.md`** - Comprehensive manual test checklist
  - Step-by-step testing instructions
  - Covers all features (signup, login, dashboard, email, etc.)
  - Includes API testing with curl examples

### ✅ Automated Playwright Tests
- **`e2e/`** directory with full test suite
  - `tests/auth-signup.spec.ts` - Signup page tests
  - `tests/auth-login.spec.ts` - Login page tests
  - `tests/dashboard.spec.ts` - Dashboard & route protection tests
  - Full configuration in `playwright.config.ts`

### ✅ Playwright MCP Setup Guide
- **`playwright-mcp-setup.md`** - Instructions for Claude-driven testing
  - Let Claude control the browser directly
  - Interactive testing through conversation

---

## 🚀 Quick Start

### Option 1: Manual Testing (5 minutes)

1. **Start services**:
   ```bash
   start.bat
   ```

2. **Open checklist**:
   - Open `MANUAL_TEST_CHECKLIST.md`
   - Follow each section step-by-step
   - Check off items as you test

3. **Test in browser**:
   - Navigate to http://localhost:3000
   - Test signup, login, password toggles, etc.

### Option 2: Automated Tests (10 minutes setup, 2 minutes to run)

1. **Install Playwright**:
   ```bash
   cd e2e
   npm install
   npx playwright install
   ```

2. **Start services** (separate terminal):
   ```bash
   cd ..
   start.bat
   ```

3. **Run tests**:
   ```bash
   cd e2e
   npm test
   ```

4. **View report**:
   ```bash
   npm run report
   ```

### Option 3: Playwright MCP (Advanced)

1. **Follow setup guide**:
   - See `playwright-mcp-setup.md`
   - Configure MCP in Claude Code settings
   - Restart Claude Code

2. **Ask Claude to test**:
   - "Test the signup page with Playwright"
   - "Check if password visibility toggle works"
   - "Run all authentication tests"

---

## 🎯 What to Test

### 🔐 Authentication Features

#### Signup Page
- [ ] Password visibility toggle works
- [ ] Form validation (email, password length)
- [ ] Successful account creation
- [ ] Duplicate email handling
- [ ] Auto-login after signup
- [ ] Redirect to dashboard

#### Login Page
- [ ] Password visibility toggle works
- [ ] Valid credentials login
- [ ] Invalid credentials error
- [ ] Remember me checkbox
- [ ] Forgot password link
- [ ] OAuth buttons present

#### Dashboard
- [ ] Route protection (redirects when logged out)
- [ ] Email verification banner (for unverified users)
- [ ] User information displayed
- [ ] Session persists on reload

### 📧 Email Features
- [ ] Verification email sent (check Resend dashboard)
- [ ] Password reset email sent
- [ ] Email templates have Maxed-CV branding
- [ ] Links in emails work

### 🔒 Security
- [ ] Routes protected by authentication
- [ ] Sessions expire correctly
- [ ] Rate limiting works (5 attempts then throttled)
- [ ] XSS/SQL injection prevented

---

## 📊 Test Results

### Manual Testing
Fill out the table in `MANUAL_TEST_CHECKLIST.md` as you test.

### Automated Testing
After running `npm test` in `e2e/`:

```bash
npm run report
```

This shows:
- ✅ Total passed/failed
- 📸 Screenshots of failures
- 🎬 Video traces
- ⏱️ Performance metrics

---

## 🐛 Troubleshooting

### Services Not Running

**Problem**: Tests fail with "connection refused"

**Solution**:
```bash
# Check if Docker is running
docker ps

# Start services
start.bat

# Wait 30 seconds, then run tests
```

### Tests Timing Out

**Problem**: Tests take too long and timeout

**Solution**:
- Ensure services are fully started
- Check if ports 3000 and 3001 are accessible
- Increase timeout in `playwright.config.ts`

### Password Toggle Not Working

**Problem**: Can't find toggle button in tests

**Solution**:
- Check if password field is visible first
- Look for button with `aria-label` containing "password"
- Update selector in test file if HTML changed

### Playwright Not Installed

**Problem**: `@playwright/test` not found

**Solution**:
```bash
cd e2e
npm install
npx playwright install
```

---

## 📝 Writing More Tests

### 1. Add Test File

Create `e2e/tests/your-feature.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Your Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/your-page');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### 2. Run Specific Test

```bash
npx playwright test your-feature.spec.ts
```

### 3. Generate Tests

Use codegen to record tests:

```bash
npm run codegen
```

---

## 🎓 Learning Resources

### Playwright Docs
- [Getting Started](https://playwright.dev/docs/intro)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Manual Testing
- Software Testing Fundamentals
- Exploratory Testing Techniques
- Test Case Writing

---

## ✅ Recommended Testing Workflow

### For New Features

1. **Write manual test cases** in checklist
2. **Test manually** to understand behavior
3. **Write automated tests** based on manual tests
4. **Run automated tests** before commits
5. **Review reports** and fix failures

### For Bug Fixes

1. **Reproduce manually** using checklist
2. **Write failing test** that catches the bug
3. **Fix the bug**
4. **Verify test passes**
5. **Run full test suite**

### For Releases

1. **Run full manual checklist**
2. **Run all automated tests** in all browsers
3. **Review test reports**
4. **Fix any failures**
5. **Document any known issues**

---

## 🎯 Current Test Coverage

| Feature | Manual Checklist | Automated Tests |
|---------|-----------------|-----------------|
| Signup Page | ✅ | ✅ |
| Login Page | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Route Protection | ✅ | ✅ |
| Password Toggle | ✅ | ✅ |
| Email Verification | ✅ | ⚠️ Partial |
| Password Reset | ✅ | ❌ Todo |
| Session Management | ✅ | ⚠️ Partial |
| OAuth | ✅ | ❌ Todo |

**Legend**: ✅ Complete | ⚠️ Partial | ❌ Not done

---

## 🚀 Next Steps

1. **Run manual tests** using `MANUAL_TEST_CHECKLIST.md`
2. **Set up automated tests**:
   ```bash
   cd e2e && npm install && npx playwright install
   ```
3. **Run test suite**:
   ```bash
   npm test
   ```
4. **Review results**:
   ```bash
   npm run report
   ```
5. **(Optional) Set up Playwright MCP** following `playwright-mcp-setup.md`

---

## 💡 Tips

- **Test early and often** - Don't wait until the end
- **Start with manual testing** - Understand behavior first
- **Automate repetitive tests** - Save time on regression testing
- **Keep tests simple** - One assertion per test is fine
- **Use descriptive test names** - Makes failures easier to understand
- **Run tests before commits** - Catch issues early

---

## 📞 Need Help?

- Check `e2e/README.md` for detailed Playwright docs
- See `playwright-mcp-setup.md` for MCP setup
- Review test files in `e2e/tests/` for examples

Happy Testing! 🎉
