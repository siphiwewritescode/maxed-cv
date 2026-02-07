# Phase 2: Authentication & Security - Research

**Researched:** 2026-02-07
**Domain:** NestJS authentication with Passport, JWT/session management, OAuth (Google + LinkedIn), email verification, password reset
**Confidence:** HIGH

## Summary

This research investigates authentication and security implementation for NestJS + Next.js applications, focusing on session-based authentication with OAuth providers, email verification workflows, and password reset flows. The standard approach uses NestJS with Passport.js for strategy-based authentication, bcrypt or Argon2 for password hashing, Redis for session storage across multiple devices, and @nestjs/throttler for rate limiting.

Modern authentication in NestJS has matured around Passport strategies with support for local (email/password) and OAuth providers. For this phase, the key decision is session-based vs. JWT-based authentication. Given the requirements for multi-device session management (max 3 concurrent sessions) and the need to force logout on password reset, **session-based authentication with Redis storage** is the clear recommendation. This allows server-side session revocation, which is critical for security features like "logout all devices" and enforcing session limits.

The critical insight: **Don't confuse authentication library choice with session strategy**. Passport handles authentication (verifying credentials), while sessions/JWTs handle authorization (tracking logged-in state). For multi-device scenarios with forced logout capabilities, sessions stored in Redis provide control that JWT tokens cannot match without significant complexity (token blacklisting, refresh token rotation).

**Primary recommendation:** Use Passport.js with local strategy for email/password, passport-google-oauth20 for Google, passport-linkedin-oauth2 for LinkedIn, Redis session storage with express-session, bcrypt for password hashing (work factor 13-14), @nestjs/throttler for rate limiting, @nestjs-modules/mailer with Nodemailer for emails, and httpOnly cookies for session tokens. Implement sliding expiration with absolute maximum (7 days default, 30 days with "remember me", but max 30 days absolute). Use PKCE for OAuth flows and constant-time comparison for password reset tokens.

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Session handling & persistence:**
- Default session duration: 7 days
- "Remember me" checkbox at login extends session to 30 days
- Multi-device limit: Max 3 concurrent sessions (oldest logged out when 4th device logs in)
- Session refresh strategy: Claude's discretion (choose between sliding vs fixed expiration)

**Email verification flow:**
- Pre-verification access: Full access to app (show verification banner but don't block features)
- Verification link expiry: 24 hours
- Resend verification email: Yes, rate-limited to once per 5 minutes
- Post-verification behavior: Auto-login user and redirect to dashboard/profile

**Password reset experience:**
- Reset link expiry: 1 hour (short-lived for security)
- Session invalidation: Yes, log out all devices when password is reset
- Security notifications: Send "Your password was changed" email after successful reset
- Rate limiting: Max 1 reset email per 5 minutes to prevent abuse

**Authentication methods:**
- Support email/password + Google OAuth + LinkedIn OAuth
- All three methods available from v1 launch

**Password requirements:**
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

### Specific Context

- LinkedIn OAuth makes particular sense for a CV platform (users likely have LinkedIn accounts with professional data)
- Keep password requirements simple to reduce signup friction — this is a CV tool, not a banking app
- Full access before email verification reduces abandonment (users can start building their profile immediately)

## Standard Stack

The established libraries/tools for NestJS authentication.

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @nestjs/passport | 10+ | Passport integration | Official NestJS wrapper for Passport.js, strategy-based auth |
| passport | 0.7+ | Authentication middleware | De facto Node.js auth standard, 500+ strategies, battle-tested |
| passport-local | 1.0+ | Email/password strategy | Standard for credential-based authentication |
| passport-google-oauth20 | 2.0+ | Google OAuth strategy | Official Passport strategy for Google Sign-In |
| passport-linkedin-oauth2 | 2.0+ | LinkedIn OAuth strategy | Maintained by Auth0, works with lite profile API |
| bcrypt | 5.1+ | Password hashing | Industry standard, widely audited, configurable work factor |
| express-session | 1.18+ | Session management | Standard Express session middleware, Redis-compatible |
| connect-redis | 7+ | Redis session store | Official Redis store for express-session |
| ioredis | 5+ | Redis client | High-performance Redis client for session storage |
| @nestjs/throttler | 6+ | Rate limiting | Official NestJS rate limiting, supports multiple strategies |
| @nestjs-modules/mailer | 2+ | Email sending | Official mailer module, Nodemailer + template support |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| nodemailer | 6+ | Email transport | Required - SMTP email sending (works with Gmail, SendGrid, etc.) |
| handlebars | 4+ | Email templates | Required - Template emails (verification, password reset) |
| @types/passport | 1.0+ | TypeScript types | Required - Type safety for Passport strategies |
| @types/passport-local | 1.0+ | TypeScript types | Required - Local strategy types |
| @types/express-session | 1.18+ | TypeScript types | Required - Session types |
| cookie-parser | 1.4+ | Cookie parsing | Required - Parse session cookies |
| crypto | Built-in | Token generation | Required - Generate secure reset tokens with crypto.randomBytes |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Sessions + Redis | JWT + refresh tokens | JWTs are stateless but require complex blacklisting for multi-device logout; sessions provide server-side control |
| bcrypt | Argon2 | Argon2 is more secure (memory-hard) but harder to install (C++ bindings); bcrypt with work factor 13-14 is sufficient for 2026 |
| Nodemailer | SendGrid API client | SendGrid requires API key and paid account; Nodemailer works with any SMTP (Gmail, Outlook, local) |
| @nestjs/throttler | express-rate-limit | @nestjs/throttler integrates with NestJS guards and decorators; express-rate-limit is lower level |
| Passport | NextAuth.js | NextAuth is Next.js-specific; Passport works with any Node framework and has 500+ strategies |
| connect-redis | ioredis Session Store | connect-redis is official and simpler; custom ioredis store requires more setup |

**Installation (Backend):**
```bash
# Authentication core
npm install @nestjs/passport@^10.0.0 passport@^0.7.0
npm install passport-local@^1.0.0 passport-google-oauth20@^2.0.0 passport-linkedin-oauth2@^2.0.0
npm install -D @types/passport@^1.0.0 @types/passport-local@^1.0.0

# Password hashing
npm install bcrypt@^5.1.0
npm install -D @types/bcrypt@^5.0.0

# Session management
npm install express-session@^1.18.0 connect-redis@^7.0.0 ioredis@^5.0.0
npm install -D @types/express-session@^1.18.0

# Cookie parsing
npm install cookie-parser@^1.4.0
npm install -D @types/cookie-parser@^1.4.0

# Rate limiting
npm install @nestjs/throttler@^6.0.0

# Email sending
npm install @nestjs-modules/mailer@^2.0.0 nodemailer@^6.0.0 handlebars@^4.0.0
npm install -D @types/nodemailer@^6.0.0
```

**Installation (Frontend):**
```bash
# No auth-specific dependencies needed
# Authentication state managed via session cookie (httpOnly)
# API calls use fetch with credentials: 'include'
```

## Architecture Patterns

### Recommended Project Structure

```
backend/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts           # Login, signup, logout, OAuth callbacks
│   ├── auth.service.ts               # Business logic
│   ├── strategies/
│   │   ├── local.strategy.ts         # Email/password validation
│   │   ├── google.strategy.ts        # Google OAuth
│   │   ├── linkedin.strategy.ts      # LinkedIn OAuth
│   │   └── session.serializer.ts     # Session serialization
│   ├── guards/
│   │   ├── local-auth.guard.ts       # Login guard
│   │   ├── google-auth.guard.ts      # Google OAuth guard
│   │   ├── linkedin-auth.guard.ts    # LinkedIn OAuth guard
│   │   └── authenticated.guard.ts    # Protect routes requiring login
│   ├── decorators/
│   │   └── current-user.decorator.ts # Extract user from session
│   └── dto/
│       ├── signup.dto.ts
│       ├── login.dto.ts
│       └── reset-password.dto.ts
├── email/
│   ├── email.module.ts
│   ├── email.service.ts              # Send verification, reset emails
│   └── templates/
│       ├── verification.hbs          # Email verification template
│       ├── password-reset.hbs        # Password reset template
│       └── password-changed.hbs      # Password changed notification
├── users/
│   ├── users.module.ts
│   ├── users.service.ts              # User CRUD, password hashing
│   └── entities/
│       └── user.entity.ts            # User model (from Prisma)
└── sessions/
    ├── sessions.module.ts
    ├── sessions.service.ts           # Session management, device limits
    └── redis-session.config.ts       # Redis session configuration

frontend/app/
├── (auth)/                           # Route group for auth pages
│   ├── login/
│   │   └── page.tsx                  # Login page with OAuth buttons
│   ├── signup/
│   │   └── page.tsx                  # Signup page
│   ├── reset-password/
│   │   └── page.tsx                  # Request reset link
│   └── reset-password/[token]/
│       └── page.tsx                  # Set new password
├── verify-email/[token]/
│   └── page.tsx                      # Email verification page
└── lib/
    ├── auth.ts                       # Auth API calls
    └── session.ts                    # Session state management (optional)
```

### Pattern 1: Passport Local Strategy for Email/Password

**What:** Use Passport local strategy to validate email and password credentials. Hash passwords with bcrypt.

**When to use:** Always for email/password authentication. This is the standard Passport pattern.

**Example:**
```typescript
// Source: NestJS Passport documentation + security best practices
// backend/src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Use 'email' instead of 'username'
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      // Generic error message to prevent user enumeration
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}

// backend/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null; // User not found
    }

    // Constant-time comparison via bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null; // Invalid password
    }

    // Don't return password hash
    const { passwordHash, ...result } = user;
    return result;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 13; // Work factor 13-14 for 2026 security
    return bcrypt.hash(password, saltRounds);
  }
}
```

### Pattern 2: OAuth Strategies (Google + LinkedIn)

**What:** Use Passport OAuth strategies for social login. Handle account linking if email already exists.

**When to use:** All OAuth providers. Pattern is consistent across Google, LinkedIn, etc.

**Example:**
```typescript
// Source: Passport Google OAuth20 + NestJS integration guides
// backend/src/auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      passReqToCallback: true,
      state: true, // CSRF protection via state parameter
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    // Find or create user
    const user = await this.authService.findOrCreateOAuthUser({
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos[0]?.value,
      emailVerified: true, // Google verifies emails
    });

    done(null, user);
  }
}

// backend/src/auth/strategies/linkedin.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.get<string>('LINKEDIN_CALLBACK_URL'),
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: true, // CSRF protection
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { id, name, emails } = profile;

    const user = await this.authService.findOrCreateOAuthUser({
      provider: 'linkedin',
      providerId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      emailVerified: true, // LinkedIn verifies emails
    });

    done(null, user);
  }
}
```

### Pattern 3: Session-Based Authentication with Redis

**What:** Store sessions in Redis with multi-device support. Implement session limits per user.

**When to use:** Always for this project. Enables server-side session revocation and device management.

**Example:**
```typescript
// Source: NestJS session management + Redis best practices
// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Redis client for sessions
  const redisClient = createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  });
  await redisClient.connect();

  // Session configuration
  app.use(cookieParser());
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,        // Prevent XSS access to cookie
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'lax',       // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days default
      },
    }),
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3001);
}

bootstrap();

// backend/src/sessions/sessions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class SessionsService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getUserSessions(userId: string): Promise<string[]> {
    // Get all session IDs for this user
    return this.redis.smembers(`user:${userId}:sessions`);
  }

  async addUserSession(userId: string, sessionId: string): Promise<void> {
    // Add session to user's set
    await this.redis.sadd(`user:${userId}:sessions`, sessionId);

    // Enforce max 3 concurrent sessions
    const sessions = await this.getUserSessions(userId);
    if (sessions.length > 3) {
      // Remove oldest session (first in set)
      const oldestSessionId = sessions[0];
      await this.removeUserSession(userId, oldestSessionId);
      // Delete the actual session
      await this.redis.del(`sess:${oldestSessionId}`);
    }
  }

  async removeUserSession(userId: string, sessionId: string): Promise<void> {
    await this.redis.srem(`user:${userId}:sessions`, sessionId);
  }

  async removeAllUserSessions(userId: string): Promise<void> {
    const sessions = await this.getUserSessions(userId);

    // Delete all session data
    for (const sessionId of sessions) {
      await this.redis.del(`sess:${sessionId}`);
    }

    // Clear session set
    await this.redis.del(`user:${userId}:sessions`);
  }
}
```

### Pattern 4: Email Verification with Time-Limited Tokens

**What:** Generate secure tokens for email verification, store in database with expiry, send via email.

**When to use:** Always for email verification. Critical for security.

**Example:**
```typescript
// Source: Security best practices + NestJS email verification patterns
// backend/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    // Generate cryptographically secure token
    const token = randomBytes(32).toString('hex');

    // Hash token before storing (prevents token theft if DB compromised)
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Store hashed token with 24-hour expiry
    await this.prisma.verificationToken.create({
      data: {
        userId,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send unhashed token in email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    await this.emailService.sendVerificationEmail(email, verificationUrl);
  }

  async verifyEmail(token: string): Promise<boolean> {
    // Hash incoming token for comparison
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Find token in database
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: { gt: new Date() }, // Not expired
      },
    });

    if (!verificationToken) {
      return false; // Invalid or expired token
    }

    // Mark email as verified
    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await this.prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return true;
  }
}
```

### Pattern 5: Password Reset with Constant-Time Comparison

**What:** Generate secure reset tokens, validate with constant-time comparison to prevent timing attacks.

**When to use:** Always for password reset. Critical security requirement.

**Example:**
```typescript
// Source: OWASP password reset best practices
// backend/src/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private sessionsService: SessionsService,
  ) {}

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Don't reveal if user exists (prevent user enumeration)
    if (!user) {
      // Still appear to send email (timing attack prevention)
      await new Promise(resolve => setTimeout(resolve, 100));
      return;
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Store token with 1-hour expiry
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await this.emailService.sendPasswordResetEmail(email, resetUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 13);

    // Update password
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    // Delete used token
    await this.prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    // Invalidate all sessions (log out all devices)
    await this.sessionsService.removeAllUserSessions(resetToken.userId);

    // Send notification email
    await this.emailService.sendPasswordChangedEmail(resetToken.user.email);
  }
}
```

### Pattern 6: Rate Limiting with @nestjs/throttler

**What:** Apply rate limits to sensitive endpoints (login, signup, password reset) to prevent abuse.

**When to use:** Always for authentication endpoints and email-sending routes.

**Example:**
```typescript
// Source: NestJS Throttler documentation
// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,  // 60 seconds
        limit: 10,   // 10 requests per minute
      },
      {
        name: 'auth',
        ttl: 60000,  // 60 seconds
        limit: 5,    // 5 requests per minute for auth routes
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Apply globally
    },
  ],
})
export class AppModule {}

// backend/src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Throttle({ auth: { limit: 3, ttl: 60000 } }) // 3 signups per minute
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @Throttle({ auth: { limit: 5, ttl: 60000 } }) // 5 login attempts per minute
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('resend-verification')
  @Throttle({ auth: { limit: 1, ttl: 300000 } }) // Once per 5 minutes
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.sendVerificationEmail(body.email);
  }

  @Post('forgot-password')
  @Throttle({ auth: { limit: 1, ttl: 300000 } }) // Once per 5 minutes
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.sendPasswordResetEmail(body.email);
  }

  @SkipThrottle() // No rate limit on logout
  @Post('logout')
  async logout() {
    return this.authService.logout();
  }
}
```

### Pattern 7: Sliding Session Expiration with Absolute Maximum

**What:** Extend session expiry on each request (sliding) but enforce absolute maximum lifetime.

**When to use:** Recommended for this project. Balances UX (don't force logout during active use) with security (limit stolen token lifespan).

**Example:**
```typescript
// Source: Session security best practices
// backend/src/main.ts
import * as session from 'express-session';
import RedisStore from 'connect-redis';

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiry on each request (sliding expiration)
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days sliding (30 days with "remember me")
    },
  }),
);

// backend/src/auth/middleware/absolute-session-expiry.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AbsoluteSessionExpiryMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user) {
      const createdAt = req.session.createdAt || Date.now();
      const maxAge = req.session.rememberMe
        ? 30 * 24 * 60 * 60 * 1000  // 30 days absolute max with "remember me"
        : 7 * 24 * 60 * 60 * 1000;  // 7 days absolute max default

      if (Date.now() - createdAt > maxAge) {
        // Session exceeded absolute maximum lifetime
        req.session.destroy((err) => {
          if (err) console.error('Session destroy error:', err);
        });
        throw new UnauthorizedException('Session expired');
      }
    }
    next();
  }
}
```

### Anti-Patterns to Avoid

- **Storing JWTs in localStorage:** Vulnerable to XSS attacks. Use httpOnly cookies for session tokens.

- **Revealing if email exists during password reset:** Enables user enumeration. Always show "If that email exists, we sent a reset link" regardless of whether email is in database.

- **Using simple string comparison for tokens:** Vulnerable to timing attacks. Use `crypto.timingSafeEqual()` or bcrypt comparison.

- **Not hashing tokens before storing in database:** If database is compromised, attacker can use unhashed tokens. Hash with SHA-256 before storing.

- **Allowing unlimited password reset requests:** Enables email flooding attacks. Rate limit to 1 per 5 minutes.

- **Not invalidating sessions on password change:** Stolen sessions remain valid after password reset. Always clear all sessions on password change.

- **OAuth without state parameter:** Vulnerable to CSRF attacks. Always enable state parameter in OAuth strategies.

- **Blocking unverified users from accessing app:** Increases abandonment. Show verification banner but allow full access.

- **Complex password requirements:** Reduces user adoption for minimal security gain. Minimum 8 characters is sufficient for non-banking apps.

- **Not using httpOnly cookies:** JavaScript can access session tokens, enabling XSS attacks. Always set httpOnly: true.

- **Running without CSRF protection:** Session-based auth needs CSRF tokens or SameSite cookie policy. Use `sameSite: 'lax'` at minimum.

## Don't Hand-Roll

Problems that look simple but have existing solutions.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password hashing | Custom hashing functions | bcrypt (or Argon2) | Handles salt generation, constant-time comparison, configurable work factor, widely audited |
| Secure token generation | Math.random() or custom logic | crypto.randomBytes() | Cryptographically secure randomness, prevents token prediction |
| OAuth implementation | Manual OAuth flow | Passport OAuth strategies | Handles state parameter, token exchange, profile fetching, PKCE support |
| Session storage | In-memory sessions | Redis with connect-redis | Survives server restarts, scales horizontally, supports multi-device management |
| Rate limiting | Custom request counting | @nestjs/throttler | Distributed rate limiting, multiple strategies, guard integration, storage options (Redis) |
| Email sending | Raw nodemailer setup | @nestjs-modules/mailer | Template support (Handlebars, Pug), retry logic, testability, configuration management |
| Token comparison | `===` operator | crypto.timingSafeEqual() | Constant-time comparison prevents timing attacks on sensitive tokens |
| Session management | Manual session tracking | express-session | Cookie handling, session serialization, store abstraction, security defaults |
| CSRF protection | Custom token generation | SameSite cookies or csurf | Standard mitigation, browser support, easy configuration |
| Multi-device session limits | Custom session cleanup | Redis sets + session store | Atomic operations, efficient lookups, handles race conditions |

**Key insight:** Authentication is security-critical. In 2026, hand-rolling crypto or session logic is dangerous. Use battle-tested libraries that have been audited and handle edge cases you haven't considered (timing attacks, race conditions, token prediction).

## Common Pitfalls

### Pitfall 1: User Enumeration via Different Response Times

**What goes wrong:** Login/password reset endpoints respond faster when email doesn't exist, allowing attackers to enumerate valid user accounts.

**Why it happens:** Database queries for non-existent users are faster than bcrypt password comparisons for existing users. Attackers measure response times to determine if email exists.

**How to avoid:**
- Always perform the same operations regardless of whether user exists
- Use constant-time comparison functions (`crypto.timingSafeEqual`, `bcrypt.compare`)
- Add artificial delay if user not found to match bcrypt timing
- Use generic error messages: "Invalid credentials" (not "User not found")
- For password reset, always show "Email sent if account exists" message

**Warning signs:**
- Login responds in 50ms for invalid email, 300ms for invalid password
- Password reset returns different messages for existing vs. non-existing emails
- Automated scripts successfully enumerate valid user accounts

### Pitfall 2: Session Fixation Attacks

**What goes wrong:** Attacker provides session ID before login, then hijacks session after victim logs in using that ID.

**Why it happens:** Session ID isn't regenerated after authentication state changes (login, privilege escalation).

**How to avoid:**
- Regenerate session ID after successful login: `req.session.regenerate()`
- Regenerate session ID after OAuth callback
- Set `resave: false` and `saveUninitialized: false` in session config
- Use `secure: true` and `httpOnly: true` on cookies
- Set `sameSite: 'lax'` or `'strict'` to prevent CSRF

**Warning signs:**
- Same session ID before and after login
- Session hijacking reports from users
- CSRF attacks succeeding despite session-based auth

**Example fix:**
```typescript
// backend/src/auth/auth.controller.ts
@Post('login')
async login(@Req() req, @Body() loginDto: LoginDto) {
  const user = await this.authService.validateUser(loginDto.email, loginDto.password);

  // Regenerate session ID after authentication
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.user = user;
      req.session.save((err) => {
        if (err) return reject(err);
        resolve({ message: 'Login successful' });
      });
    });
  });
}
```

### Pitfall 3: OAuth State Parameter Not Validated

**What goes wrong:** Attacker tricks victim into authenticating to attacker's OAuth session, then hijacks the account.

**Why it happens:** OAuth callback doesn't validate state parameter, allowing CSRF attacks on OAuth flow.

**How to avoid:**
- Always set `state: true` in OAuth strategy configuration
- Passport automatically generates and validates state parameter
- Store state in session and verify on callback
- Use PKCE for additional security (especially for mobile/SPA apps)

**Warning signs:**
- OAuth callback accepts requests without state parameter
- Users report unauthorized account linking
- OAuth flow works without session cookies

**Example:**
```typescript
// backend/src/auth/strategies/google.strategy.ts
super({
  clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
  clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
  callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
  scope: ['email', 'profile'],
  state: true, // CRITICAL: Enable state parameter for CSRF protection
  // For public clients (mobile/SPA), also use PKCE:
  // pkce: true,
  // codeChallengeMethod: 'S256',
});
```

### Pitfall 4: Not Invalidating Sessions on Password Change

**What goes wrong:** User changes password but existing sessions (on other devices) remain valid, allowing attackers to maintain access.

**Why it happens:** Password change only updates password hash in database, doesn't touch session storage.

**How to avoid:**
- Delete all user sessions from Redis on password change
- Track session IDs per user in Redis sets
- Force re-authentication after password change
- Send "password changed" email notification

**Warning signs:**
- Users report continued unauthorized access after password change
- Sessions persist indefinitely across password resets
- Security audit flags session management issues

**Example:**
```typescript
// backend/src/auth/auth.service.ts
async changePassword(userId: string, newPassword: string): Promise<void> {
  // Update password
  const passwordHash = await bcrypt.hash(newPassword, 13);
  await this.prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  // CRITICAL: Invalidate all sessions
  await this.sessionsService.removeAllUserSessions(userId);

  // Send notification
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  await this.emailService.sendPasswordChangedEmail(user.email);
}
```

### Pitfall 5: Storing Session Secrets in Code

**What goes wrong:** Session secret hardcoded or committed to git, allowing attackers to forge session cookies.

**Why it happens:** Developer uses placeholder secret and forgets to replace with environment variable.

**How to avoid:**
- Always use environment variable: `process.env.SESSION_SECRET`
- Generate cryptographically secure secret: `openssl rand -base64 32`
- Never commit .env files
- Validate SESSION_SECRET exists at startup with Zod
- Use different secrets for dev/staging/production

**Warning signs:**
- Session secret in git history
- Same session secret across environments
- Session secret is short or predictable (e.g., "secret", "keyboard cat")

**Example:**
```typescript
// backend/src/config/env.validation.ts
import { z } from 'zod';

const envSchema = z.object({
  SESSION_SECRET: z.string().min(32), // Enforce minimum 32 characters
  GOOGLE_CLIENT_SECRET: z.string(),
  LINKEDIN_CLIENT_SECRET: z.string(),
  // ...other secrets
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('SESSION_SECRET must be at least 32 characters');
  }
  return result.data;
}
```

### Pitfall 6: Email Verification Token Not Expiring

**What goes wrong:** Verification tokens remain valid forever, allowing delayed account takeover if email is later compromised.

**Why it happens:** Token expiry not checked on verification, or tokens never deleted after use.

**How to avoid:**
- Store `expiresAt` timestamp with token (24 hours for verification, 1 hour for password reset)
- Check expiry before accepting token: `WHERE expiresAt > NOW()`
- Delete token after successful use (one-time use only)
- Allow resending verification email (rate-limited)

**Warning signs:**
- Old verification links (months old) still work
- Tokens accumulate in database without cleanup
- Security audit flags token management

**Example:**
```typescript
// backend/src/auth/auth.service.ts
async verifyEmail(token: string): Promise<boolean> {
  const hashedToken = createHash('sha256').update(token).digest('hex');

  const verificationToken = await this.prisma.verificationToken.findFirst({
    where: {
      token: hashedToken,
      expiresAt: { gt: new Date() }, // CRITICAL: Check expiry
    },
  });

  if (!verificationToken) {
    throw new BadRequestException('Invalid or expired verification token');
  }

  // Mark email as verified
  await this.prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: new Date() },
  });

  // CRITICAL: Delete token after use (one-time use)
  await this.prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  });

  return true;
}
```

### Pitfall 7: Rate Limiting by IP Only (VPN/NAT Issues)

**What goes wrong:** Legitimate users behind same NAT/VPN get rate limited together. Attackers bypass limits by rotating IPs.

**Why it happens:** Rate limiting uses only IP address as identifier, ignoring user sessions or device fingerprints.

**How to avoid:**
- Combine IP address + user ID for authenticated requests
- Use more lenient limits for unauthenticated endpoints
- Implement progressive rate limiting (stricter after N failures)
- Consider device fingerprinting for sensitive operations
- Allow manual rate limit overrides for specific IPs (corporate networks)

**Warning signs:**
- Users in office buildings report "too many requests" errors
- VPN users can't sign up
- Attackers easily bypass limits by changing IPs
- Legitimate traffic blocked by aggressive rate limiting

**Example:**
```typescript
// backend/src/auth/guards/custom-throttler.guard.ts
import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use user ID if authenticated, fall back to IP
    if (req.session?.user?.id) {
      return `user:${req.session.user.id}`;
    }
    return req.ip; // Fallback to IP for anonymous requests
  }
}
```

### Pitfall 8: OAuth Token Stored but Never Refreshed

**What goes wrong:** OAuth access token expires, breaking integrations. User forced to re-authenticate.

**Why it happens:** Access token saved during OAuth callback but no refresh logic implemented.

**How to avoid:**
- Store refresh token (if provided by OAuth provider) in database
- Implement token refresh logic before API calls
- Handle token expiry errors gracefully
- Set up background job to refresh tokens before expiry
- Note: For this project, OAuth only used for authentication (one-time), not ongoing API access, so refresh token not needed

**Warning signs:**
- OAuth-authenticated users logged out unexpectedly
- Google/LinkedIn integrations break after 1 hour
- Errors like "invalid_token" or "token_expired"

**Recommendation for this project:** Don't store OAuth access/refresh tokens. Use OAuth only for initial authentication, then rely on session cookies. If future features need Google/LinkedIn API access, implement proper token refresh then.

## Code Examples

Verified patterns from official sources.

### Protected Route with Authenticated Guard

```typescript
// Source: NestJS Guards documentation
// backend/src/auth/guards/authenticated.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.session?.user) {
      throw new UnauthorizedException('You must be logged in');
    }

    return true;
  }
}

// Usage in controller
// backend/src/profile/profile.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('profile')
@UseGuards(AuthenticatedGuard) // Protect all routes in this controller
export class ProfileController {
  @Get()
  getProfile(@CurrentUser() user: any) {
    return { user };
  }
}

// backend/src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.session.user;
  },
);
```

### Email Template with Handlebars

```typescript
// Source: @nestjs-modules/mailer documentation
// backend/src/email/email.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('EMAIL_HOST'),
          port: config.get('EMAIL_PORT'),
          secure: false, // true for 465, false for other ports
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"Maxed-CV" <noreply@maxedcv.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

// backend/src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(email: string, verificationUrl: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your Maxed-CV account',
      template: './verification', // templates/verification.hbs
      context: {
        verificationUrl,
        expiryHours: 24,
      },
    });
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your Maxed-CV password',
      template: './password-reset', // templates/password-reset.hbs
      context: {
        resetUrl,
        expiryMinutes: 60,
      },
    });
  }

  async sendPasswordChangedEmail(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Maxed-CV password was changed',
      template: './password-changed', // templates/password-changed.hbs
      context: {
        changeTime: new Date().toLocaleString(),
      },
    });
  }
}
```

### Prisma Schema for Authentication

```prisma
// Source: Prisma best practices + authentication schema patterns
// backend/prisma/schema.prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?   // Nullable for OAuth-only users
  firstName     String?
  lastName      String?
  avatar        String?
  emailVerified DateTime? // null = not verified

  // OAuth fields
  googleId      String?   @unique
  linkedinId    String?   @unique

  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  verificationTokens  VerificationToken[]
  passwordResetTokens PasswordResetToken[]
  masterProfile       MasterProfile?

  @@index([email])
  @@index([googleId])
  @@index([linkedinId])
}

model VerificationToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique // SHA-256 hashed token
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token, expiresAt])
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique // SHA-256 hashed token
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token, expiresAt])
}
```

### Next.js Auth API Client

```typescript
// Source: Next.js + TypeScript best practices
// frontend/lib/auth.ts
class AuthAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL!;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      credentials: 'include', // Send cookies (session)
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  async signup(email: string, password: string, firstName: string, lastName: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async requestPasswordReset(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async verifyEmail(token: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerification() {
    return this.request('/auth/resend-verification', { method: 'POST' });
  }

  // OAuth redirects (handled server-side)
  getGoogleLoginUrl() {
    return `${this.baseUrl}/auth/google`;
  }

  getLinkedInLoginUrl() {
    return `${this.baseUrl}/auth/linkedin`;
  }
}

export const authAPI = new AuthAPI();
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JWT tokens for web apps | Sessions with httpOnly cookies | 2021-2023 shift | Better XSS protection, simpler logout, server-side revocation |
| Bcrypt work factor 10-11 | Bcrypt work factor 13-14 | 2024-2026 hardware improvements | Maintains security against faster GPUs/ASICs |
| OAuth 2.0 without PKCE | OAuth 2.1 with mandatory PKCE | OAuth 2.1 draft 2023, RFC 9700 Jan 2026 | Prevents authorization code interception attacks |
| Passport.js version 0.4-0.5 | Passport.js 0.7+ | 2023 | Better TypeScript support, modern async/await patterns |
| NextAuth.js for backend auth | Passport.js with NestJS | 2024-2025 ecosystem maturity | NextAuth couples auth to Next.js; Passport more flexible for backend APIs |
| express-session without Redis | express-session + Redis | 2020+ | Horizontal scaling, multi-device session management |
| Manual rate limiting | @nestjs/throttler | NestJS 8+ (2021) | Built-in guards, Redis storage, easier configuration |
| Argon2 widespread recommendation | Bcrypt still dominant | Ongoing debate | Argon2 more secure but harder to install; bcrypt with higher work factor is pragmatic |
| Plain text password reset tokens | Hashed tokens with crypto.timingSafeEqual | 2022+ security hardening | Prevents timing attacks and database compromise exploitation |

**Deprecated/outdated:**

- **JWT in localStorage:** XSS vulnerability. Use httpOnly cookies.
- **OAuth 2.0 without state parameter:** CSRF vulnerability. Always enable state.
- **Passport.js serialize/deserialize with full user object:** Session bloat. Store only user ID, fetch user on each request.
- **express-rate-limit for NestJS:** Use @nestjs/throttler for better integration.
- **Nodemailer without templates:** Hard to maintain emails. Use @nestjs-modules/mailer with Handlebars.
- **Password complexity requirements (uppercase, number, symbol):** Reduced security (predictable patterns), poor UX. Use minimum length (10-12 characters) instead.

## Open Questions

Things that couldn't be fully resolved.

### 1. Argon2 vs. Bcrypt for Password Hashing

**What we know:**
- Argon2 is technically superior (memory-hard, won Password Hashing Competition 2015)
- Bcrypt is easier to install (pure JavaScript versions exist, no C++ compilation)
- Bcrypt with work factor 13-14 is secure for 2026 standards
- Argon2 requires native dependencies, can complicate Docker builds

**What's unclear:** Is Argon2's security advantage worth the installation complexity for a CV app (not banking/government)?

**Recommendation:** Use bcrypt with work factor 13 for Phase 2. The installation simplicity and wide ecosystem support outweigh Argon2's marginal security improvement for this use case. If storing highly sensitive data in future phases, reconsider Argon2.

### 2. Session Storage: Redis vs. Database

**What we know:**
- Redis provides fast session lookups (sub-millisecond)
- Database sessions (PostgreSQL) provide ACID guarantees
- connect-redis is the standard Redis session store
- Multi-device session tracking is easier with Redis sets

**What's unclear:** Does adding Redis dependency add operational complexity for small-scale self-hosted deployment?

**Recommendation:** Use Redis for Phase 2 as planned. Multi-device session limits (max 3 concurrent) require atomic operations that Redis handles well. PostgreSQL would require transaction locking. Redis is already in stack for BullMQ (job queues), so no new dependency.

### 3. Email Service Provider for Production

**What we know:**
- Nodemailer supports any SMTP provider (Gmail, SendGrid, Mailgun, AWS SES)
- Gmail free tier has sending limits (100 emails/day)
- SendGrid/Mailgun have free tiers (100 emails/day for SendGrid, 5000/month for Mailgun)
- Self-hosted SMTP is possible but high spam risk

**What's unclear:** Which email provider best balances cost, deliverability, and setup complexity for initial launch?

**Recommendation:** Start with Gmail SMTP for Phase 2 development (free, easy setup). Switch to SendGrid or Mailgun before production launch (better deliverability, monitoring, higher limits). Document in .env.example that EMAIL_HOST can be swapped without code changes.

### 4. CSRF Protection Strategy

**What we know:**
- SameSite cookies provide CSRF protection for modern browsers
- csurf package provides traditional CSRF tokens
- NestJS doesn't have official CSRF module
- OAuth flows already use state parameter (CSRF protection)

**What's unclear:** Is `sameSite: 'lax'` sufficient CSRF protection, or should we add csurf package?

**Recommendation:** Use `sameSite: 'lax'` on session cookies for Phase 2. This provides CSRF protection for modern browsers (95%+ support in 2026). Add csurf package only if security audit requires it or supporting legacy browsers.

### 5. Email Verification: Block Access vs. Banner

**What we know:** User decision is full access with banner (no blocking)

**What's unclear:** Should certain sensitive operations (e.g., delete account, change email) require verified email?

**Recommendation:** For Phase 2, follow user decision strictly (no blocking). In Phase 3+, consider requiring verification only for destructive operations (delete account, change password). Document in security review.

## Sources

### Primary (HIGH confidence)

- [NestJS Authentication Documentation](https://docs.nestjs.com/security/authentication) - Official auth guide
- [NestJS Rate Limiting Documentation](https://docs.nestjs.com/security/rate-limiting) - Official throttler guide
- [Passport.js Documentation](https://www.passportjs.org/) - Strategy-based authentication
- [Passport Local Strategy](https://www.passportjs.org/packages/passport-local/) - Official local strategy
- [Passport Google OAuth20](https://www.passportjs.org/packages/passport-google-oauth20/) - Official Google strategy
- [Passport LinkedIn OAuth2](https://www.passportjs.org/packages/passport-linkedin-oauth2/) - Auth0-maintained LinkedIn strategy
- [@nestjs/throttler GitHub](https://github.com/nestjs/throttler) - Official NestJS rate limiter
- [express-session Documentation](https://github.com/expressjs/session) - Official session middleware
- [connect-redis Documentation](https://github.com/tj/connect-redis) - Official Redis session store
- [bcrypt npm package](https://www.npmjs.com/package/bcrypt) - Industry standard password hashing
- [OAuth 2.1 RFC 9700 (Jan 2026)](https://oauth.net/2.1/) - Latest OAuth security practices

### Secondary (MEDIUM confidence, verified with multiple sources)

- [NestJS Auth: Sessions vs JWTs (The Real Tradeoffs) - Medium, Jan 2026](https://medium.com/@bhagyarana80/nestjs-auth-sessions-vs-jwts-the-real-tradeoffs-ca5950bbeb58) - Recent comparison
- [Setting Up Sessions with NestJS, Passport, and Redis - DEV Community](https://dev.to/nestjs/setting-up-sessions-with-nestjs-passport-and-redis-210) - Session setup guide
- [PKCE Downgrade Attacks: Why OAuth 2.1 is No Longer Optional - Medium, Jan 2026](https://medium.com/@instatunnel/pkce-downgrade-attacks-why-oauth-2-1-is-no-longer-optional-887731326f24) - OAuth 2.1 security
- [Password Hashing Guide 2025: Argon2 vs Bcrypt vs Scrypt vs PBKDF2](https://guptadeepak.com/the-complete-guide-to-password-hashing-argon2-vs-bcrypt-vs-scrypt-vs-pbkdf2-2026/) - Algorithm comparison
- [Session Timeout Best Practices - Descope](https://www.descope.com/learn/post/session-timeout-best-practices) - Sliding vs fixed expiration
- [JWT Storage 101: How to keep your tokens secure - WorkOS](https://workos.com/blog/secure-jwt-storage) - Token storage security
- [Password Reset Best Practices - Authgear](https://www.authgear.com/post/authentication-security-password-reset-best-practices-and-more) - Reset flow security
- [How Weak Password Reset Flows Turn "Forgot Password?" Into Full Account Takeover - Medium, Jan 2026](https://medium.com/@MuhammedAsfan/how-weak-password-reset-flows-turn-forgot-password-into-full-account-takeover-dc95508cdfe8) - Security vulnerabilities
- [Rate Limiting in NestJS: A Complete Guide - Medium](https://syedalihamzaofficial.medium.com/rate-limiting-in-nestjs-a-complete-guide-with-examples-49fb5c340bb8) - Throttler implementation
- [Mastering Session Management with NestJS and Redis - DEV Community](https://dev.to/es404020/mastering-session-management-with-nestjs-and-redis-a-comprehensive-guide-1a6h) - Redis session patterns

### Tertiary (LOW confidence, community sources)

- [Implementing Google OAuth in NestJS using Passport - DEV Community](https://dev.to/chukwutosin_/implement-google-oauth-in-nestjs-using-passport-1j3k) - OAuth setup example
- [Building Secure JWT Auth in NestJS: Argon2, Redis Blacklisting - DEV Community](https://dev.to/david_essien/building-secure-jwt-auth-in-nestjs-argon2-redis-blacklisting-and-token-rotation-3gl9) - JWT alternative patterns
- [Mocking JWT Authentication in End-to-End Tests with NestJS](https://copyprogramming.com/howto/nestjs-mock-jwt-authentication-in-e2e-tests) - Testing patterns
- [LinkedIn Login using Node JS and passport - LoginRadius Blog](https://www.loginradius.com/blog/engineering/linkedin-login-using-node-passport) - LinkedIn OAuth tutorial

## Metadata

**Confidence breakdown:**

- **Standard stack (Passport, bcrypt, Redis sessions):** HIGH - Official NestJS documentation, Passport.js official strategies
- **OAuth implementation patterns:** HIGH - Passport official strategies, OAuth 2.1 RFC 9700 (Jan 2026)
- **Password hashing (bcrypt work factor 13-14):** HIGH - Multiple 2025-2026 security guides agree
- **Session management with Redis:** HIGH - Official connect-redis and express-session documentation
- **Rate limiting with @nestjs/throttler:** HIGH - Official NestJS package, comprehensive documentation
- **Email verification/password reset patterns:** MEDIUM - Multiple sources agree on security patterns, no single standard
- **Sliding vs fixed session expiration:** MEDIUM - Best practices documented but implementation varies
- **Email service provider choice:** LOW - Depends on production requirements not yet defined

**Research date:** 2026-02-07

**Valid until:** 2026-03-07 (30 days) - Authentication libraries are mature. OAuth 2.1 standard finalized Jan 2026. Bcrypt work factor recommendations may increase in 6-12 months as hardware improves.

---

**Research complete.** Ready for planning phase. All user constraints documented and standard patterns identified.
