# Phase 2: Authentication & Security - Context

**Gathered:** 2026-02-07
**Status:** Ready for planning

<domain>
## Phase Boundary

User account creation, login, session management, email verification, password reset, and access control. Users can create accounts with email/password or OAuth (Google/LinkedIn), verify their email, manage sessions across devices, and recover forgotten passwords.

</domain>

<decisions>
## Implementation Decisions

### Session handling & persistence
- Default session duration: 7 days
- "Remember me" checkbox at login extends session to 30 days
- Multi-device limit: Max 3 concurrent sessions (oldest logged out when 4th device logs in)
- Session refresh strategy: Claude's discretion (choose between sliding vs fixed expiration)

### Email verification flow
- Pre-verification access: Full access to app (show verification banner but don't block features)
- Verification link expiry: 24 hours
- Resend verification email: Yes, rate-limited to once per 5 minutes
- Post-verification behavior: Auto-login user and redirect to dashboard/profile

### Password reset experience
- Reset link expiry: 1 hour (short-lived for security)
- Session invalidation: Yes, log out all devices when password is reset
- Security notifications: Send "Your password was changed" email after successful reset
- Rate limiting: Max 1 reset email per 5 minutes to prevent abuse

### Authentication methods
- Support email/password + Google OAuth + LinkedIn OAuth
- All three methods available from v1 launch

### Password requirements
- Standard strength: Minimum 8 characters, no other complexity requirements
- Simple and user-friendly approach

### Claude's Discretion
- Auth page layout style (modern, professional design)
- Error messaging approach (balance security and UX)
- Session refresh implementation (sliding vs fixed expiration)
- Loading states and transitions
- OAuth button styling and placement
- Form validation timing and feedback
- Redirect logic after login/signup

</decisions>

<specifics>
## Specific Ideas

- LinkedIn OAuth makes particular sense for a CV platform (users likely have LinkedIn accounts with professional data)
- Keep password requirements simple to reduce signup friction — this is a CV tool, not a banking app
- Full access before email verification reduces abandonment (users can start building their profile immediately)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-authentication-security*
*Context gathered: 2026-02-07*
