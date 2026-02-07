---
phase: 02-authentication-security
plan: 05
subsystem: authentication
tags: [oauth, google, linkedin, passport, security]
dependencies:
  requires: ["02-02", "02-03"]
  provides: ["oauth-authentication", "google-login", "linkedin-login", "account-linking"]
  affects: ["frontend-authentication", "user-onboarding"]
tech-stack:
  added: ["passport-google-oauth20", "passport-linkedin-oauth2"]
  patterns: ["oauth-flow", "conditional-strategy-registration", "account-linking"]
key-files:
  created:
    - backend/src/auth/strategies/google.strategy.ts
    - backend/src/auth/strategies/linkedin.strategy.ts
    - backend/src/auth/guards/google-auth.guard.ts
    - backend/src/auth/guards/linkedin-auth.guard.ts
  modified:
    - backend/src/auth/auth.service.ts
    - backend/src/auth/auth.controller.ts
    - backend/src/auth/auth.module.ts
decisions:
  - id: oauth-conditional-registration
    choice: "Conditionally register OAuth strategies only when credentials are configured"
    rationale: "Development works without OAuth credentials, no crashes"
    alternatives: ["Always register strategies", "Separate development config"]
  - id: oauth-scopes
    choice: "LinkedIn uses 'openid', 'profile', 'email' scopes (newer API)"
    rationale: "Sign In with LinkedIn using OpenID Connect is the current standard"
    alternatives: ["Older r_emailaddress, r_liteprofile scopes"]
  - id: account-linking
    choice: "Link OAuth provider when email matches existing account"
    rationale: "Users can sign up with email/password, then use OAuth with same email"
    alternatives: ["Require manual linking", "Block OAuth if email exists"]
  - id: oauth-auto-verified
    choice: "OAuth users have emailVerified set immediately"
    rationale: "Google and LinkedIn verify emails, no need for our verification flow"
    alternatives: ["Require email verification after OAuth signup"]
metrics:
  duration: "3.3 min"
  completed: "2026-02-07"
---

# Phase 2 Plan 05: OAuth Integration Summary

**One-liner:** Google and LinkedIn OAuth login with state-based CSRF protection, automatic account linking by email, and conditional strategy registration.

## What Was Built

Implemented complete OAuth authentication flows for Google and LinkedIn:

1. **Google OAuth Strategy**
   - Passport strategy using `passport-google-oauth20`
   - CSRF protection via state parameter
   - Scopes: email, profile
   - GET /auth/google (initiates OAuth flow)
   - GET /auth/google/callback (handles OAuth callback)

2. **LinkedIn OAuth Strategy**
   - Passport strategy using `passport-linkedin-oauth2`
   - Uses modern OpenID Connect scopes (openid, profile, email)
   - GET /auth/linkedin (initiates OAuth flow)
   - GET /auth/linkedin/callback (handles OAuth callback)

3. **Account Linking Logic**
   - `findOrCreateOAuthUser` method handles three scenarios:
     - User exists with OAuth provider ID → return user
     - User exists with email → link OAuth provider to account
     - New user → create account with auto-verified email
   - Updates avatar on linking if not already set

4. **Conditional Strategy Registration**
   - Strategies only register if credentials are configured
   - App starts successfully without OAuth credentials (dev-friendly)

## Task Commits

| Task | Commit | Summary |
|------|--------|---------|
| Task 1: Create Google OAuth strategy and endpoints | `54ccf57` | GoogleStrategy with CSRF protection, findOrCreateOAuthUser method, conditional registration |
| Task 2: Create LinkedIn OAuth strategy and endpoints | `98d99f6` | LinkedInStrategy with OpenID Connect scopes, account linking, session regeneration |

## Verification Results

✓ Backend compiles with `npx tsc --noEmit`
✓ GET /auth/google exists
✓ GET /auth/google/callback exists
✓ GET /auth/linkedin exists
✓ GET /auth/linkedin/callback exists
✓ findOrCreateOAuthUser handles creation, linking, and return
✓ OAuth users auto-verified (emailVerified set)
✓ Session regenerated after OAuth callback (prevents fixation)
✓ Strategies conditionally registered (app works without credentials)

## Decisions Made

**1. Conditional Strategy Registration**
- Strategies only load if GOOGLE_CLIENT_ID or LINKEDIN_CLIENT_ID are set
- Prevents crashes in development without OAuth credentials
- Uses dynamic provider array in auth.module.ts

**2. LinkedIn Scopes**
- Using `openid`, `profile`, `email` (newer Sign In with LinkedIn API)
- Older `r_emailaddress`, `r_liteprofile` deprecated

**3. Account Linking Strategy**
- Email match triggers automatic OAuth provider linking
- User signs up with email/password, can later use OAuth with same email
- Single account regardless of auth method

**4. OAuth Auto-Verification**
- OAuth users have `emailVerified` set immediately
- Google and LinkedIn verify emails during OAuth flow
- No need for our email verification flow

## Deviations from Plan

None - plan executed exactly as written.

## Security Considerations

1. **CSRF Protection**: Both strategies use `state: true` parameter
2. **Session Regeneration**: Sessions regenerated after OAuth callback (prevents fixation)
3. **Token Security**: OAuth tokens handled by Passport, not stored
4. **Account Linking**: Email-based linking assumes OAuth provider verified email

## Next Phase Readiness

**Blockers:** None

**Concerns:**
1. OAuth credentials needed for full testing (user setup required)
2. Frontend OAuth buttons not yet implemented (Phase 3)
3. No tests for OAuth flows yet (testing deferred to later phase)

**Ready for:**
- Frontend OAuth button implementation
- User testing with real Google/LinkedIn accounts
- Session management across OAuth login sessions

## Performance Notes

- OAuth strategies lazy-load (only if credentials configured)
- Conditional registration keeps module load time minimal
- Account linking adds one extra DB query on OAuth login

## Files Changed

**Created (4 files):**
- `backend/src/auth/strategies/google.strategy.ts` - Google OAuth Passport strategy
- `backend/src/auth/strategies/linkedin.strategy.ts` - LinkedIn OAuth Passport strategy
- `backend/src/auth/guards/google-auth.guard.ts` - Google OAuth auth guard
- `backend/src/auth/guards/linkedin-auth.guard.ts` - LinkedIn OAuth auth guard

**Modified (3 files):**
- `backend/src/auth/auth.service.ts` - Added findOrCreateOAuthUser method
- `backend/src/auth/auth.controller.ts` - Added OAuth endpoints (Google, LinkedIn)
- `backend/src/auth/auth.module.ts` - Conditional OAuth strategy registration

## Integration Points

**Upstream Dependencies:**
- Uses UsersService.findByGoogleId, findByLinkedInId, linkOAuthProvider
- Uses session infrastructure from 02-02
- Uses PrismaService for avatar updates

**Downstream Consumers:**
- Frontend will call GET /auth/google, GET /auth/linkedin
- Session middleware will handle OAuth users same as email/password users

## Testing Notes

**Manual Testing Required:**
1. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
2. Configure Google Cloud Console OAuth redirect URI
3. Visit GET /auth/google → should redirect to Google Sign-In
4. After Google authorization → should redirect to frontend /dashboard
5. Repeat for LinkedIn

**Automated Testing (future):**
- Mock OAuth profile responses
- Test findOrCreateOAuthUser scenarios (new user, existing email, existing OAuth ID)
- Test session establishment after OAuth callback


## Self-Check: PASSED

All created files verified:
- backend/src/auth/strategies/google.strategy.ts
- backend/src/auth/strategies/linkedin.strategy.ts
- backend/src/auth/guards/google-auth.guard.ts
- backend/src/auth/guards/linkedin-auth.guard.ts

All commits verified:
- 54ccf57 (Task 1 - Google OAuth)
- 98d99f6 (Task 2 - LinkedIn OAuth)
