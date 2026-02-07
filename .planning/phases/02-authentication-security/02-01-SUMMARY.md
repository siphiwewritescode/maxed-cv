---
phase: 02
plan: 01
subsystem: authentication
completed: 2026-02-07
duration: 6min

requires:
  - phase: 01
    provides: ["NestJS backend", "Prisma ORM", "Docker infrastructure", "Redis service"]

provides:
  - "Auth dependencies installed (@nestjs/passport, passport, bcrypt, session management)"
  - "Prisma schema with OAuth fields (googleId, linkedinId, firstName, lastName, avatar)"
  - "VerificationToken and PasswordResetToken models"
  - "Session middleware with Redis store (connect-redis + ioredis)"
  - "Passport.js initialized and ready for strategies"
  - "Environment validation for auth-related variables"

affects:
  - phase: 02
    plans: ["02-02", "02-03", "02-04", "02-05", "02-06"]
    reason: "All subsequent auth plans depend on these foundational packages, schema, and middleware"

tech-stack:
  added:
    - "@nestjs/passport@11.0.5 - NestJS integration for Passport.js authentication"
    - "passport@0.7.0 - Authentication middleware for Node.js"
    - "passport-local@1.0.0 - Local username/password authentication strategy"
    - "passport-google-oauth20@2.0.0 - Google OAuth 2.0 authentication strategy"
    - "passport-linkedin-oauth2@2.0.0 - LinkedIn OAuth 2.0 authentication strategy"
    - "bcrypt@5.1.1 - Password hashing library"
    - "express-session@1.18.1 - Session middleware for Express"
    - "connect-redis@7.1.1 - Redis session store for connect/express-session"
    - "ioredis@5.4.2 - Redis client for Node.js"
    - "cookie-parser@1.4.7 - Cookie parsing middleware"
    - "@nestjs/throttler@6.2.1 - Rate limiting for NestJS"
    - "@nestjs-modules/mailer@2.0.2 - Email sending module for NestJS"
    - "nodemailer@6.9.17 - Email sending library"
    - "handlebars@4.7.8 - Templating engine for email templates"
    - "@nestjs/config@4.0.1 - Configuration module for NestJS"
  patterns:
    - "Session-based authentication with Redis persistence"
    - "Sliding session expiration (7-day default)"
    - "OAuth 2.0 integration ready (Google and LinkedIn)"
    - "Token-based email verification and password reset flows"
    - "Environment variable validation with Zod"

key-files:
  created: []
  modified:
    - backend/package.json
    - backend/package-lock.json
    - backend/prisma/schema.prisma
    - backend/src/main.ts
    - backend/src/config/env.validation.ts
    - backend/.env.example
    - docker-compose.yml

decisions:
  - id: AUTH-001
    title: "Use @nestjs/passport v11 for NestJS v11 compatibility"
    context: "Initial plan specified v10, but NestJS v11 requires @nestjs/passport v11"
    decision: "Install @nestjs/passport@11.0.5 instead of v10"
    rationale: "Peer dependency compatibility required for NestJS v11"
    alternatives: "Could downgrade NestJS to v10, but staying on latest is better for security and features"

  - id: AUTH-002
    title: "Use sliding session expiration (rolling: true)"
    context: "Session expiration strategy: fixed vs sliding"
    decision: "Enabled rolling: true for sliding expiration (resets on each request)"
    rationale: "Better UX - active users stay logged in, inactive users are logged out"
    alternatives: "Fixed expiration would require re-login after N days regardless of activity"

  - id: AUTH-003
    title: "Session duration: 7 days"
    context: "Balance between security and UX for session lifetime"
    decision: "Set maxAge to 7 days (7 * 24 * 60 * 60 * 1000)"
    rationale: "Standard for web apps - long enough for convenience, short enough for security"
    alternatives: "30 days (less secure), 1 day (annoying for users)"

  - id: AUTH-004
    title: "OAuth and email env vars are optional during development"
    context: "App should start without OAuth credentials configured"
    decision: "Made GOOGLE_CLIENT_ID, LINKEDIN_CLIENT_ID, EMAIL_USER optional in env validation"
    rationale: "Allows backend to start and be developed without requiring OAuth apps or email SMTP to be configured"
    alternatives: "Require all env vars - would block development until OAuth apps created"

tags: ["authentication", "oauth", "sessions", "redis", "passport", "prisma", "nestjs", "security"]
---

# Phase 02 Plan 01: Auth Foundation - Dependencies, Schema & Middleware Summary

JWT auth with refresh rotation using jose library - Actually implemented session-based auth with Redis store and Passport.js, OAuth fields in schema, and token models for verification/reset flows.

## What Was Built

This plan established the foundational authentication infrastructure for the entire auth system:

1. **Authentication Dependencies**
   - Installed 15+ auth-related npm packages including Passport.js ecosystem, bcrypt for password hashing, session management (express-session + connect-redis + ioredis), email sending (nodemailer + mailer module), rate limiting (@nestjs/throttler), and configuration management
   - All TypeScript type definitions installed for type safety
   - Verified all packages are importable and compatible with NestJS v11

2. **Prisma Schema Updates**
   - Extended User model with OAuth fields: `googleId`, `linkedinId`, `firstName`, `lastName`, `avatar`
   - Added two new models:
     - `VerificationToken` - for email verification flow (userId, token, expiresAt)
     - `PasswordResetToken` - for password reset flow (userId, token, expiresAt)
   - Added indexes for OAuth provider lookups and token queries
   - Maintained backward compatibility with existing `name` field while adding new `firstName`/`lastName` for OAuth profiles

3. **Session & Passport Middleware**
   - Configured cookie-parser middleware for session cookies
   - Created Redis client using ioredis connected to Redis service
   - Configured express-session with RedisStore for distributed session storage
   - Implemented sliding session expiration (7-day default, resets on each request)
   - Set secure cookie options: httpOnly, sameSite: lax, secure in production
   - Initialized Passport.js and session support (passport.initialize() + passport.session())

4. **Environment Validation**
   - Added `SESSION_SECRET` (required, min 32 characters) to env validation schema
   - Added optional OAuth env vars: GOOGLE_CLIENT_ID/SECRET, LINKEDIN_CLIENT_ID/SECRET with default callback URLs
   - Added optional email env vars: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM
   - Updated docker-compose.yml with SESSION_SECRET for local development
   - Updated .env.example with comprehensive documentation for all auth variables

## Task Commits

| Task | Description | Commit | Files Changed |
|------|-------------|--------|---------------|
| 1 | Install auth dependencies and update Prisma schema | 7c7ec22 | backend/package.json, backend/package-lock.json, backend/prisma/schema.prisma |
| 2 | Bootstrap session middleware and Passport | 638808d | backend/src/main.ts, backend/src/config/env.validation.ts, backend/.env.example, docker-compose.yml |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Updated @nestjs/passport version from v10 to v11**

- **Found during:** Task 1 dependency installation
- **Issue:** Plan specified @nestjs/passport@^10.0.0 but got peer dependency error with NestJS v11
- **Fix:** Checked npm registry, found v11 available, installed @nestjs/passport@^11.0.0 instead
- **Files modified:** backend/package.json
- **Commit:** 7c7ec22
- **Rationale:** Critical for compatibility - app won't build with v10 on NestJS v11

**2. [Rule 3 - Blocking] Fixed TypeScript import errors for CommonJS modules**

- **Found during:** Task 2 TypeScript compilation check
- **Issue:** express-session, cookie-parser, ioredis, connect-redis failed to compile with ESM import syntax
- **Fix:** Changed from `import * as session from 'express-session'` to `const session = require('express-session')` for CommonJS compatibility, and used `.default` for connect-redis
- **Files modified:** backend/src/main.ts
- **Commit:** 638808d (same commit as Task 2)
- **Rationale:** Blocked TypeScript compilation - these packages are CommonJS and don't support ESM imports properly in this context

**3. [Rule 2 - Missing Critical] Created .env file for Prisma validation**

- **Found during:** Task 1 Prisma schema validation
- **Issue:** `npx prisma validate` failed because DATABASE_URL env var not found
- **Fix:** Copied .env.example to .env to provide required env vars for validation
- **Files modified:** backend/.env (local, not committed - already in .gitignore)
- **Commit:** Not committed (local .env file)
- **Rationale:** Critical for running Prisma CLI commands during development

## Decisions Made

**AUTH-001: Use @nestjs/passport v11 for NestJS v11 compatibility**
- Context: Initial plan specified v10, but NestJS v11 requires @nestjs/passport v11
- Decision: Install @nestjs/passport@11.0.5 instead of v10
- Rationale: Peer dependency compatibility required for NestJS v11
- Alternatives: Could downgrade NestJS to v10, but staying on latest is better

**AUTH-002: Use sliding session expiration (rolling: true)**
- Context: Session expiration strategy: fixed vs sliding
- Decision: Enabled rolling: true for sliding expiration (resets on each request)
- Rationale: Better UX - active users stay logged in, inactive users are logged out
- Alternatives: Fixed expiration would require re-login after N days regardless of activity

**AUTH-003: Session duration: 7 days**
- Context: Balance between security and UX for session lifetime
- Decision: Set maxAge to 7 days (7 * 24 * 60 * 60 * 1000)
- Rationale: Standard for web apps - long enough for convenience, short enough for security
- Alternatives: 30 days (less secure), 1 day (annoying for users)

**AUTH-004: OAuth and email env vars are optional during development**
- Context: App should start without OAuth credentials configured
- Decision: Made GOOGLE_CLIENT_ID, LINKEDIN_CLIENT_ID, EMAIL_USER optional in env validation
- Rationale: Allows backend to start and be developed without requiring OAuth apps or email SMTP to be configured
- Alternatives: Require all env vars - would block development until OAuth apps created

## Testing Evidence

### Unit Tests
N/A - This plan focused on infrastructure setup. Tests will be added in subsequent auth module plans.

### Integration Tests
N/A - Integration tests will be added once auth modules are implemented.

### Manual Verification

**Prisma Schema Validation:**
```bash
$ npx prisma validate
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
The schema at prisma\schema.prisma is valid 🚀
```

**Prisma Client Generation:**
```bash
$ npx prisma generate
✔ Generated Prisma Client (v5.22.0) to .\node_modules\@prisma\client in 113ms
```

**Package Import Verification:**
```bash
$ node -e "require('@nestjs/passport'); console.log('@nestjs/passport OK')"
@nestjs/passport OK

$ node -e "require('bcrypt'); console.log('bcrypt OK')"
bcrypt OK

$ node -e "require('ioredis'); console.log('ioredis OK')"
ioredis OK
```

**TypeScript Compilation:**
```bash
$ npx tsc --noEmit
# No output = successful compilation
```

**Environment Validation:**
```bash
$ npx ts-node -e "import('./src/config/env.validation').then(m => m.validateEnv())"
Environment validation failed:
{
  DATABASE_URL: { _errors: [ 'Required' ] },
  SESSION_SECRET: { _errors: [ 'Required' ] }
}
# Expected - validation correctly enforces required variables
```

## Known Issues/Limitations

1. **No database migration created yet**
   - The Prisma schema was updated but migration not run
   - Reason: Docker services need to be running for `prisma migrate dev`
   - Impact: Database schema doesn't reflect new fields until migration runs
   - Resolution: Next plan or manual step to run `npx prisma migrate dev`

2. **Passport strategies not implemented yet**
   - passport.initialize() and passport.session() are configured but no strategies exist
   - Impact: Authentication won't work until strategies are implemented in subsequent plans
   - Resolution: Plans 02-02 (Local Auth) and 02-03 (OAuth) will implement strategies

3. **Email sending not functional without SMTP credentials**
   - Email env vars are optional, so app starts without them
   - Impact: Email verification and password reset won't work until SMTP configured
   - Resolution: User must configure EMAIL_USER and EMAIL_PASSWORD in .env

## Next Phase Readiness

**Blockers for 02-02 (Local Auth Module):**
- None - all dependencies and infrastructure in place

**Blockers for 02-03 (OAuth Module):**
- None - passport-google-oauth20 and passport-linkedin-oauth2 installed

**Blockers for 02-04 (Email Verification):**
- None - VerificationToken model and nodemailer installed

**Blockers for 02-05 (Password Reset):**
- None - PasswordResetToken model and email infrastructure ready

**Blockers for 02-06 (Rate Limiting & Security):**
- None - @nestjs/throttler installed

**Outstanding items:**
1. Run Prisma migration when Docker services are available: `npx prisma migrate dev --name add_oauth_and_tokens`
2. Configure OAuth apps (Google and LinkedIn) and add client IDs/secrets to .env when implementing OAuth strategies
3. Configure SMTP credentials when implementing email features

## Self-Check: PASSED

All files listed in key-files.modified exist and contain expected changes:
- backend/package.json: Contains all auth dependencies
- backend/package-lock.json: Generated with dependency tree
- backend/prisma/schema.prisma: Contains OAuth fields and token models
- backend/src/main.ts: Contains session middleware and Passport initialization
- backend/src/config/env.validation.ts: Contains auth env var validation
- backend/.env.example: Contains all auth env vars with documentation
- docker-compose.yml: Contains SESSION_SECRET environment variable

All commits exist in git history:
- 7c7ec22: feat(02-01): install auth dependencies and update Prisma schema
- 638808d: feat(02-01): bootstrap session middleware and Passport
