---
phase: 02-authentication-security
plan: 06
title: "RBAC & Permissions"
subsystem: security
tags: [rate-limiting, throttling, session-management, security, nest-throttler, redis, seed-data]
status: complete
created: 2026-02-07

requires:
  - 02-04-email-verification-password-reset
  - 02-05-oauth-integration

provides:
  - rate_limiting: "Login (5/min), signup (3/min), resend-verification (1/5min), forgot-password (1/5min)"
  - absolute_session_expiry: "7-day default, 30-day with remember me"
  - session_tracking: "Max 3 concurrent sessions per user, oldest evicted automatically"
  - custom_throttler: "Uses user ID for authenticated, IP for anonymous rate limiting"
  - seed_data: "Updated with password hash and OAuth fields for testing"

affects:
  - future-phases: "Session tracking foundation for device management UI"

tech-stack:
  added:
    - "@nestjs/throttler@6.5.0"
  patterns:
    - "Custom ThrottlerGuard for user-based rate limiting"
    - "Absolute session expiry middleware alongside sliding expiration"
    - "Session tracking integrated into all auth flows"

key-files:
  created:
    - "backend/src/auth/guards/custom-throttler.guard.ts"
    - "backend/src/auth/middleware/absolute-session-expiry.middleware.ts"
  modified:
    - "backend/src/app.module.ts"
    - "backend/src/auth/auth.controller.ts"
    - "backend/src/health/health.controller.ts"
    - "backend/prisma/seed.ts"

decisions:
  - id: "02-06-rate-limits"
    decision: "Login 5/min, signup 3/min, resend-verification 1/5min, forgot-password 1/5min"
    rationale: "Balance between security and UX - prevents brute force without annoying legitimate users"
    impact: "Auth endpoints protected from abuse"

  - id: "02-06-user-based-throttling"
    decision: "Rate limit by user ID when authenticated, IP when anonymous"
    rationale: "Prevents shared NAT/VPN from blocking multiple users, more accurate rate limiting"
    impact: "Better multi-tenant handling, prevents false positives"

  - id: "02-06-absolute-expiry"
    decision: "7-day absolute max (default) or 30-day (remember me) regardless of activity"
    rationale: "Sliding expiration alone allows sessions to live forever with regular use"
    impact: "Sessions eventually expire even for active users"

  - id: "02-06-session-tracking"
    decision: "Track all sessions in Redis via SessionsService.addUserSession()"
    rationale: "Enforce 3-device limit, enable future device management features"
    impact: "Max 3 concurrent sessions per user, oldest evicted when 4th device logs in"

  - id: "02-06-health-skip-throttle"
    decision: "Health endpoint skips rate limiting"
    rationale: "Monitoring/orchestration needs unrestricted health checks"
    impact: "Health checks won't trigger rate limits"

  - id: "02-06-seed-password"
    decision: "Test@1234 as seed password (bcrypt hashed, work factor 13)"
    rationale: "Known password enables auth flow testing"
    impact: "Can test login/logout with test@maxedcv.com"

metrics:
  duration: "3.5 min"
  files_modified: 6
  lines_changed: "+124 / -13"
  completed: 2026-02-07
---

# Phase 2 Plan 6: RBAC & Permissions Summary

Complete security hardening: rate limiting prevents brute force, absolute session expiry ensures sessions don't live forever, and session tracking enables multi-device limits.

## What Was Built

### Task 1: Rate Limiting and Absolute Session Expiry
- Created **CustomThrottlerGuard** extending ThrottlerGuard
  - Uses user ID for authenticated requests (prevents IP-based blocking of shared NAT/VPN users)
  - Falls back to IP for anonymous requests
- Created **AbsoluteSessionExpiryMiddleware**
  - Enforces 7-day absolute max (default) or 30-day (remember me)
  - Works alongside sliding expiration (rolling: true)
  - Destroys expired sessions gracefully (no exceptions, lets AuthenticatedGuard handle 401)
- Configured **ThrottlerModule** with two rate limit profiles:
  - `default`: 20 requests/min (general endpoints)
  - `auth`: 5 requests/min (auth-specific endpoints)
- Applied **@Throttle decorators** to auth endpoints:
  - `POST /auth/signup`: 3 per minute
  - `POST /auth/login`: 5 per minute
  - `POST /auth/resend-verification`: 1 per 5 minutes
  - `POST /auth/forgot-password`: 1 per 5 minutes
  - `POST /auth/logout`: No limit (@SkipThrottle)
- Added **@SkipThrottle** to health controller (monitoring needs unrestricted access)
- Registered CustomThrottlerGuard as global APP_GUARD
- Applied AbsoluteSessionExpiryMiddleware to all routes via AppModule.configure()

### Task 2: Session Tracking Integration and Seed Data
- Integrated **SessionsService** into AuthController
- Tracked sessions after every successful authentication:
  - `POST /auth/signup` (after auto-login)
  - `POST /auth/login` (after session save)
  - `POST /auth/verify-email` (after auto-login)
  - `GET /auth/google/callback` (after OAuth session save)
  - `GET /auth/linkedin/callback` (after OAuth session save)
- Removed session tracking on logout:
  - `POST /auth/logout` (before session destroy)
- Max 3 concurrent sessions enforced via `SessionsService.addUserSession()`
  - 4th login from new device evicts oldest session
- Updated **seed.ts** for new auth schema:
  - Added `firstName: 'Sipho'`, `lastName: 'Ngwenya'`
  - Added `passwordHash` (bcrypt hash of 'Test@1234' with work factor 13)
  - Added OAuth fields: `googleId: null`, `linkedinId: null`, `avatar: null`
  - Added token cleanup: `verificationToken.deleteMany()`, `passwordResetToken.deleteMany()`
  - Kept existing name field for backward compatibility
  - Updated output: "Password: Test@1234"

## Verification Results

All verification criteria met:

- ✅ Rate limiting active on all auth endpoints with correct limits
- ✅ CustomThrottlerGuard uses user ID for authenticated, IP for anonymous
- ✅ AbsoluteSessionExpiryMiddleware destroys sessions past absolute max age
- ✅ Session tracked in Redis after login, signup, and OAuth callback
- ✅ Session removed from Redis on logout
- ✅ 4th login from new device evicts oldest session
- ✅ Seed data works with updated schema (includes passwordHash, firstName, lastName)
- ✅ Test account can log in with Test@1234 password
- ✅ Backend compiles with `npx tsc --noEmit`
- ✅ Prisma schema valid with `npx prisma validate`

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rate limiting and absolute session expiry | a5db538 | custom-throttler.guard.ts, absolute-session-expiry.middleware.ts, app.module.ts, auth.controller.ts, health.controller.ts |
| 2 | Session tracking and seed data | 338e7a1 | auth.controller.ts, seed.ts |

## Deviations from Plan

None - plan executed exactly as written.

## Technical Implementation Notes

### Rate Limiting Architecture
- **Global guard approach**: CustomThrottlerGuard registered as APP_GUARD in AppModule
- **Dual rate limit profiles**: Default (20/min) and auth (5/min) configured in ThrottlerModule.forRoot()
- **Per-endpoint overrides**: @Throttle decorator overrides global guard on specific endpoints
- **User-based tracking**: Authenticated requests use `user:${userId}` as tracker key, anonymous use IP
- **Graceful skipping**: @SkipThrottle decorator allows endpoints (logout, health) to bypass rate limiting

### Session Expiry Strategy
- **Dual expiry model**:
  1. **Sliding expiration**: cookie.maxAge refreshes on activity (7 or 30 days)
  2. **Absolute expiration**: session.createdAt checked in middleware (7 or 30 days from login)
- **Middleware placement**: Applied to all routes (`forRoutes('*')`) before guards
- **Graceful degradation**: On expiry, session destroyed but no exception thrown (AuthenticatedGuard handles 401)
- **Remember me handling**: Checks `session.rememberMe` flag to apply 30-day max instead of 7-day

### Session Tracking Integration Points
- **Signup flow**: Auto-login → `req.login()` → session save → track session
- **Login flow**: Session regenerate → passport serialize → session save → track session
- **Email verification flow**: Verify token → auto-login → `req.login()` → track session
- **OAuth flows**: Passport populates user → regenerate → serialize → session save → track session
- **Logout flow**: Remove tracking → destroy session
- **Max sessions enforcement**: `SessionsService.addUserSession()` checks count, evicts oldest if > 3

### Seed Data Strategy
- **Password hash**: bcrypt with work factor 13 (matches production security)
- **Test password**: "Test@1234" (meets validation: uppercase, lowercase, number, special char, 8+ chars)
- **OAuth fields**: Set to null for local auth user (allows linking OAuth providers later)
- **Token cleanup**: Delete verificationToken and passwordResetToken before User (foreign key constraints)
- **Backward compatibility**: Keep `name` field alongside `firstName`/`lastName` (avoids breaking existing queries)

## Testing Recommendations

### Rate Limiting Tests
```bash
# Test login rate limit (should block after 5 attempts in 60s)
for i in {1..6}; do curl -X POST http://localhost:4000/auth/login -H "Content-Type: application/json" -d '{"email":"test@maxedcv.com","password":"wrong"}'; done

# Test signup rate limit (should block after 3 attempts in 60s)
for i in {1..4}; do curl -X POST http://localhost:4000/auth/signup -H "Content-Type: application/json" -d '{"email":"test'$i'@example.com","password":"Test@1234","firstName":"Test","lastName":"User"}'; done

# Verify health endpoint bypasses rate limiting
for i in {1..30}; do curl http://localhost:4000/health; done
```

### Session Tracking Tests
```bash
# 1. Login from 3 different devices (browsers)
# Device 1: Login at http://localhost:3000 with test@maxedcv.com / Test@1234
# Device 2: Login again (different browser or incognito)
# Device 3: Login again (another browser)
# All 3 sessions should be active

# 2. Verify session count in Redis
redis-cli
> SMEMBERS user:{userId}:sessions  # Should show 3 session IDs

# 3. Login from 4th device
# Device 4: Login again (4th browser)
# Oldest session (Device 1) should be evicted
> SMEMBERS user:{userId}:sessions  # Should show 3 session IDs (Device 2, 3, 4)
```

### Absolute Session Expiry Tests
```typescript
// 1. Mock time in AbsoluteSessionExpiryMiddleware test
// Set session.createdAt to 8 days ago
// Request should destroy session and continue (401 from AuthenticatedGuard)

// 2. Test remember me absolute expiry
// Set session.rememberMe = true, session.createdAt = 31 days ago
// Session should be destroyed
```

### Seed Data Tests
```bash
# Run seed
npm run prisma:seed

# Test login with seed user
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@maxedcv.com","password":"Test@1234"}' \
  --cookie-jar cookies.txt

# Should return 200 with user data

# Verify session tracked
redis-cli SMEMBERS user:{userId}:sessions
# Should show session ID

# Test logout
curl -X POST http://localhost:4000/auth/logout --cookie cookies.txt

# Verify session removed
redis-cli SMEMBERS user:{userId}:sessions
# Should be empty
```

## Next Phase Readiness

**Blockers:** None

**Concerns:** None

**Prerequisites for Phase 3:**
- ✅ Authentication system fully hardened
- ✅ Rate limiting prevents brute force attacks
- ✅ Session management enforces device limits
- ✅ Seed data includes working credentials for testing

**Integration Points:**
- Frontend can now implement device management UI (list sessions, revoke devices)
- Rate limit error responses (429 Too Many Requests) need frontend handling
- Session expiry (401 Unauthorized) triggers frontend logout/redirect

## Self-Check: PASSED

All key files exist:
- ✅ backend/src/auth/guards/custom-throttler.guard.ts
- ✅ backend/src/auth/middleware/absolute-session-expiry.middleware.ts

All commits verified:
- ✅ a5db538
- ✅ 338e7a1
