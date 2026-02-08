# Manual Testing Checklist for Maxed-CV

## Prerequisites
- [ ] Run `start.bat` to start all services
- [ ] Ensure browser is open at http://localhost:3000

---

## 1. Signup Page Tests (http://localhost:3000/signup)

### Password Visibility Toggle
- [ ] Navigate to signup page
- [ ] Enter first name, last name, email, and password
- [ ] **TEST: Click the eye icon next to password field**
  - [ ] Password should become visible (shows actual text)
  - [ ] Eye icon should change appearance
  - [ ] Click again - password should be hidden again
- [ ] Verify password field has right padding (40px) for the icon button

### Signup Flow
- [ ] Fill in all fields with valid data:
  - First Name: `Test`
  - Last Name: `User`
  - Email: `test@example.com`
  - Password: `password123` (min 8 characters)
- [ ] Click "Create account" button
- [ ] Should redirect to `/dashboard`
- [ ] Should auto-login after signup

### Validation Tests
- [ ] Try submitting with empty fields - should show HTML5 validation
- [ ] Try password with less than 8 characters - should show validation error
- [ ] Try invalid email format - should show validation error

---

## 2. Login Page Tests (http://localhost:3000/login)

### Password Visibility Toggle
- [ ] Navigate to login page
- [ ] Enter email and password
- [ ] **TEST: Click the eye icon next to password field**
  - [ ] Password should become visible
  - [ ] Eye icon should change
  - [ ] Click again - password should be hidden
- [ ] Verify icon positioning is correct

### Login Flow
- [ ] Enter valid credentials (use Sipho's account or one you created)
  - Email: `sipho@example.com`
  - Password: [the test password]
- [ ] Click "Sign in" button
- [ ] Should redirect to `/dashboard`
- [ ] Session should be created

### Remember Me
- [ ] Login with "Remember me" checked
- [ ] Verify session persists (check if you stay logged in after closing/reopening browser)

### Invalid Login
- [ ] Try login with wrong password - should show error message
- [ ] Try login with non-existent email - should show error message
- [ ] Verify error messages don't reveal if email exists (security)

### Navigation Links
- [ ] Click "Sign up" link - should go to `/signup`
- [ ] Click "Forgot password?" link - should go to `/reset-password`

### OAuth Buttons
- [ ] Verify Google login button exists and is clickable
- [ ] Verify LinkedIn login button exists and is clickable
- [ ] (Note: These won't work without OAuth configuration, but buttons should be present)

---

## 3. Dashboard Tests (http://localhost:3000/dashboard)

### Route Protection
- [ ] **TEST: Open dashboard without being logged in**
  - Open incognito/private window
  - Navigate to http://localhost:3000/dashboard
  - Should redirect to `/login` automatically
  - Verify middleware is protecting the route

### Email Verification Banner
- [ ] Login with unverified account
- [ ] Should see yellow/warning banner at top of dashboard
- [ ] Banner should say "Please verify your email address"
- [ ] Click "Resend verification email" button
- [ ] Should see success message

### Authenticated Dashboard Access
- [ ] Login with valid account
- [ ] Should see dashboard content
- [ ] Should see user's first name and last name displayed
- [ ] Should see logout button or option

---

## 4. Email Verification Tests

### Verification Email
- [ ] Sign up with a new account using your real email
- [ ] Check your email inbox
- [ ] Should receive "Verify your Maxed-CV account" email
- [ ] Email should have:
  - [ ] Maxed-CV branding (blue header)
  - [ ] "Verify Email" button
  - [ ] 24-hour expiry notice
  - [ ] Professional formatting

### Verification Flow
- [ ] Click "Verify Email" button in email
- [ ] Should redirect to application
- [ ] Should show success message
- [ ] Email verification banner should disappear from dashboard
- [ ] User's emailVerified field should be set in database

---

## 5. Password Reset Tests (http://localhost:3000/reset-password)

### Request Reset
- [ ] Navigate to password reset page
- [ ] Enter valid email address
- [ ] Click submit
- [ ] Should show success message (even if email doesn't exist - prevents enumeration)

### Reset Email
- [ ] Check email inbox
- [ ] Should receive "Reset your Maxed-CV password" email
- [ ] Email should have:
  - [ ] Maxed-CV branding
  - [ ] "Reset Password" button
  - [ ] 60-minute expiry notice

### Complete Reset
- [ ] Click reset link in email
- [ ] Should open reset password page with token
- [ ] Enter new password (min 8 characters)
- [ ] Click submit
- [ ] Should show success message
- [ ] Should be able to login with new password
- [ ] All existing sessions should be invalidated

---

## 6. Session Management Tests

### Multi-Device Limit
- [ ] Login from first browser (or browser profile)
- [ ] Login from second browser/profile
- [ ] Login from third browser/profile
- [ ] Try logging in from fourth browser/profile
- [ ] Should work (max 3 concurrent sessions per user)
- [ ] Oldest session should be invalidated

### Session Expiry
- [ ] Login without "Remember me"
- [ ] Wait 24 hours (or manually expire session in Redis)
- [ ] Try accessing protected route
- [ ] Should redirect to login

### Logout
- [ ] Login to account
- [ ] Click logout
- [ ] Should redirect to login page
- [ ] Session should be destroyed
- [ ] Cannot access protected routes without logging in again

---

## 7. Backend API Tests

### Health Check
- [ ] Navigate to http://localhost:3001/health
- [ ] Should return JSON: `{"status":"ok","info":{"database":{"status":"up"}},...}`

### Auth Endpoints
Test with tools like Postman or curl:

```bash
# Test signup
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","rememberMe":false}' \
  -c cookies.txt

# Test /auth/me
curl http://localhost:3001/auth/me -b cookies.txt

# Test logout
curl -X POST http://localhost:3001/auth/logout -b cookies.txt
```

---

## 8. Security Tests

### XSS Prevention
- [ ] Try entering `<script>alert('xss')</script>` in input fields
- [ ] Should be sanitized/escaped

### SQL Injection
- [ ] Try entering `' OR '1'='1` in email field
- [ ] Should not cause errors or bypass auth

### CSRF Protection
- [ ] Verify forms have CSRF tokens (if implemented)
- [ ] Verify session cookies have proper flags

### Rate Limiting
- [ ] Try 6+ rapid login attempts
- [ ] Should be rate-limited after 5 attempts (per config)

---

## 9. Responsive Design Tests

- [ ] Test on mobile viewport (375px width)
  - [ ] Signup form should be readable
  - [ ] Login form should be readable
  - [ ] Password toggle button should be accessible
  - [ ] Buttons should be large enough to tap

- [ ] Test on tablet viewport (768px width)
- [ ] Test on desktop viewport (1920px width)

---

## 10. Browser Compatibility Tests

Test in multiple browsers:
- [ ] Google Chrome
- [ ] Mozilla Firefox
- [ ] Microsoft Edge
- [ ] Safari (if on Mac)

---

## Test Results Summary

| Test Category | Pass | Fail | Notes |
|--------------|------|------|-------|
| Signup Page | ☐ | ☐ | |
| Login Page | ☐ | ☐ | |
| Dashboard | ☐ | ☐ | |
| Email Verification | ☐ | ☐ | |
| Password Reset | ☐ | ☐ | |
| Session Management | ☐ | ☐ | |
| Backend API | ☐ | ☐ | |
| Security | ☐ | ☐ | |
| Responsive Design | ☐ | ☐ | |
| Browser Compatibility | ☐ | ☐ | |

---

## Found Issues

List any bugs or issues found during testing:

1.
2.
3.

---

## Notes

- All password visibility toggles use eye emoji icons (👁️ and 👁️‍🗨️)
- Email service uses Resend API
- Sessions stored in Redis
- Database is PostgreSQL
- Rate limiting is enabled on auth routes
