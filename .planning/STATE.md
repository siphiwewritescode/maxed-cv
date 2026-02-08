# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-07)

**Core value:** Eliminate the friction of manual CV tailoring that causes talented South African professionals to lose momentum in a highly competitive job market, ensuring every applicant has the best possible chance of passing ATS filters and reaching human recruiters.
**Current focus:** Phase 3 - Master Profile Management

## Current Position

Phase: 3 of 6 (Master Profile Management)
Plan: 3 of 3 in current phase
Status: Phase complete
Last activity: 2026-02-08 — Completed 03-03-PLAN.md (Wizard Shell + Personal Info Step)

Progress: [██████████████] 100% (15/15 plans)

## Performance Metrics

**Velocity:**
- Total plans completed: 15
- Average duration: 4.3 min
- Total execution time: 2.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 1 | 4 | 28 min | 7 min |
| Phase 2 | 8 | 27.1 min | 3.4 min |
| Phase 3 | 3 | 17 min | 5.7 min |

**Recent Trend:**
- Last 5 plans: 2.6min, 6min, 7min, 4min
- Trend: Good (4.9min vs 4.3min average)

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
- **[02-06]** Rate limits: login (5/min), signup (3/min), resend-verification (1/5min), forgot-password (1/5min)
- **[02-06]** CustomThrottlerGuard uses user ID for authenticated, IP for anonymous (prevents NAT/VPN false positives)
- **[02-06]** Absolute session expiry (7-day default, 30-day remember me) alongside sliding expiration
- **[02-08]** Removed Remember Me feature entirely (all users get 7-day session)
- **[02-08]** Dashboard now shows full name (firstName + lastName) instead of just firstName
- **[02-08]** Maintained backward compatibility in LoginDto (rememberMe field optional but ignored)
- **[02-06]** Session tracking integrated into all auth flows (max 3 concurrent sessions)
- **[02-06]** Health endpoint skips throttling (monitoring needs unrestricted access)
- **[02-06]** Seed password Test@1234 (bcrypt work factor 13) enables auth flow testing
- **[02-09]** Logout always clears cookie (even if session.destroy or Redis fails) prevents stale session race conditions
- **[02-09]** Session tracking Redis operations wrapped in try-catch (auth flows continue if Redis down)
- **[02-09]** Frontend logout checks response status and always returns success (graceful error handling)
- **[03-01]** Order field (Int @default(0)) added to Skill, Education, Project, Certification for drag-drop reordering
- **[03-01]** Certification.credentialId optional (some certs have IDs, others don't)
- **[03-01]** Certification.issuer changed to required (core identifying information)
- **[03-01]** jobTitle DTO maps to position schema field (user-facing vs technical naming)
- **[03-01]** getProfile() auto-creates profile if doesn't exist using User table defaults
- **[03-01]** updateSkills uses transaction (deleteMany + createMany) for atomic replacement
- **[03-01]** All update/delete operations verify profileId.userId matches session user (ownership verification)
- **[03-01]** New items get order = max(existing.order) + 1 (auto-increment ordering)
- **[03-02]** shadcn/ui initialized with new-york style and CSS variables for theming
- **[03-02]** Tailwind CSS configured alongside existing inline styles (auth pages unaffected)
- **[03-02]** Static skills database with 90+ skills including SA-specific (POPIA, BBBEE, Labour Relations Act)
- **[03-02]** Skill alias normalization prevents fragmentation (js→JavaScript, k8s→Kubernetes)
- **[03-02]** Zod cross-field validation for date ranges using .refine()
- **[03-02]** Profile API client follows auth.ts pattern (credentials: 'include')
- **[03-03]** WizardContext loads profile data on mount and determines completed steps based on existing data
- **[03-03]** Steps marked complete based on data presence (personal info filled → step 1 complete, has experiences → step 2 complete)
- **[03-03]** Non-linear navigation allowed (users can click any step, don't need sequential completion)
- **[03-03]** Skip button on Personal Info step allows advancing without save
- **[03-03]** Success indicator shows briefly (800ms) before advancing to next step
- **[03-03]** Notice Period uses text input instead of select dropdown for flexibility

### Pending Todos

None yet.

### Blockers/Concerns

**[03-01]** Database migration pending
- Prisma schema updated with ordering fields (order Int @default(0)) and credentialId
- Migration not created yet (requires Docker services running)
- Action: Run `npx prisma migrate dev --name add_profile_ordering_fields` when Docker available
- Impact: Profile API endpoints will fail at runtime until migration runs (schema mismatch)

## Session Continuity

Last session: 2026-02-08 18:21 UTC
Stopped at: Completed 03-03-PLAN.md (Wizard Shell + Personal Info Step)
Resume file: None
