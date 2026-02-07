# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-07)

**Core value:** Eliminate the friction of manual CV tailoring that causes talented South African professionals to lose momentum in a highly competitive job market, ensuring every applicant has the best possible chance of passing ATS filters and reaching human recruiters.
**Current focus:** Phase 2 - Authentication & Security

## Current Position

Phase: 2 of 6 (Authentication & Security)
Plan: 5 of 6 in current phase
Status: In progress
Last activity: 2026-02-07 — Completed 02-05-PLAN.md (OAuth Integration)

Progress: [████████░░] 80%

## Performance Metrics

**Velocity:**
- Total plans completed: 9
- Average duration: 4.6 min
- Total execution time: 1.4 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 1 | 4 | 28 min | 7 min |
| Phase 2 | 5 | 18 min | 3.6 min |

**Recent Trend:**
- Last 5 plans: 4min, 2min, 3min, 3min
- Trend: Excellent (2.8min vs 4.6min average)

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- NestJS + Next.js stack chosen for type safety, SEO, and developer experience
- Gemini as primary AI provider for generous free tier during validation
- Self-hosting with Docker to eliminate hosting costs during development
- SA-specific features (notice period, SA English, privacy) as core differentiator
- **[01-01]** Prisma 5.22 chosen over 7.x for stable schema syntax (no breaking changes)
- **[01-01]** Custom PrismaHealthIndicator for database health checks (terminus doesn't provide built-in)
- **[01-01]** Zod for environment validation (type-safe, descriptive errors)
- **[01-02]** Next.js standalone output mode for Docker deployment
- **[01-02]** System font stack for faster initial load (no custom fonts)
- **[01-02]** Inline styles for landing page (UI library deferred)
- **[01-03]** Docker Compose v2 format (no version field) for modern Docker CLI
- **[01-03]** Named volumes for node_modules to avoid performance issues with bind mounts
- **[01-03]** :delegated flag on bind mounts for better macOS/Windows performance
- **[01-03]** PostgreSQL healthcheck so backend waits for database readiness
- **[01-04]** Manual SA-themed seed data instead of Faker.js for authentic SA context
- **[01-04]** Idempotent seed script with deleteMany in reverse dependency order
- **[01-04]** CI pipeline with --passWithNoTests flag (tests added in Phase 2+)
- **[01-04]** Comprehensive README documenting full workflow from setup to seeding
- **[02-01]** @nestjs/passport v11 for NestJS v11 compatibility (not v10)
- **[02-01]** Sliding session expiration (rolling: true) for better UX
- **[02-01]** 7-day session duration balancing security and convenience
- **[02-01]** OAuth and email env vars optional to allow dev without external services
- **[02-02]** Session stores only user ID (not full object) for fresh data and smaller session size
- **[02-02]** Session regeneration after login prevents session fixation attacks
- **[02-02]** rememberMe extends cookie maxAge from 7 days to 30 days per user preference
- **[02-02]** Generic "Invalid credentials" error prevents user enumeration
- **[02-03]** Max 3 concurrent sessions enforced (oldest evicted when 4th device logs in)
- **[02-03]** Email failures log warning without crashing (dev without SMTP works)
- **[02-03]** SA locale (en-ZA) for password change timestamps
- **[02-04]** Email verification tokens expire after 24 hours (balance convenience and security)
- **[02-04]** Password reset tokens expire after 1 hour (shorter window reduces attack surface)
- **[02-04]** SHA-256 hashing for tokens (faster than bcrypt, sufficient for random tokens)
- **[02-04]** Artificial delay for non-existent emails prevents user enumeration
- **[02-04]** All sessions invalidated on password reset (security best practice)
- **[02-04]** Auto-login after email verification (better UX)
- **[02-05]** OAuth strategies conditionally registered (app works without credentials)
- **[02-05]** LinkedIn uses openid/profile/email scopes (newer Sign In with LinkedIn API)
- **[02-05]** Account linking by email when OAuth email matches existing user
- **[02-05]** OAuth users auto-verified (Google/LinkedIn verify emails)

### Pending Todos

None yet.

### Blockers/Concerns

**[02-01]** Database migration pending
- Prisma schema updated with OAuth fields and token models
- Migration not created yet (requires Docker services running)
- Action: Run `npx prisma migrate dev --name add_oauth_and_tokens` when Docker available
- Impact: Schema changes not applied to database until migration runs

## Session Continuity

Last session: 2026-02-07 18:10 UTC
Stopped at: Completed 02-05-PLAN.md (OAuth Integration)
Resume file: None
