import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SessionsService } from '../sessions/sessions.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LinkedInAuthGuard } from './guards/linkedin-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private sessionsService: SessionsService,
  ) {}

  @Post('signup')
  @Throttle({ auth: { limit: 3, ttl: 60000 } }) // 3 signups per minute
  async signup(@Body() dto: SignupDto, @Req() req: Request) {
    const user = await this.authService.signup(dto);

    // Auto-login after signup using req.login
    return new Promise((resolve, reject) => {
      req.login(user, async (err) => {
        if (err) return reject(new InternalServerErrorException('Session error'));

        // Track session for multi-device limit enforcement
        await this.sessionsService.addUserSession(user.id, req.sessionID);

        resolve({
          message: 'Account created successfully',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        });
      });
    });
  }

  @Post('login')
  // @Throttle({ auth: { limit: 5, ttl: 60000 } }) // 5 login attempts per minute - DISABLED FOR DEV
  @SkipThrottle() // Skip rate limiting in development
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @CurrentUser() user: any,
  ) {
    // Check if account is deactivated
    if (user.deactivatedAt) {
      throw new InternalServerErrorException('This account has been deactivated. Please contact support if you believe this is an error.');
    }

    // Regenerate session to prevent session fixation
    return new Promise((resolve, reject) => {
      req.session.regenerate(async (err) => {
        if (err) return reject(new InternalServerErrorException('Session error'));

        // Re-serialize user after regeneration
        (req.session as any).passport = { user: user.id };

        // Set createdAt for absolute session expiry tracking
        (req.session as any).createdAt = Date.now();

        req.session.save(async (err) => {
          if (err) return reject(new InternalServerErrorException('Session error'));

          // Track session for multi-device limit enforcement (max 3 concurrent sessions)
          await this.sessionsService.addUserSession(user.id, req.sessionID);

          resolve({
            message: 'Login successful',
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          });
        });
      });
    });
  }

  @SkipThrottle() // No rate limit on logout
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    // Remove session from tracking before destroying
    const session = req.session as any;
    if (session?.passport?.user) {
      this.logger.log(`Logout initiated for user ${session.passport.user}, sessionID: ${req.sessionID}`);

      // Wrap removeUserSession in try-catch
      try {
        await this.sessionsService.removeUserSession(
          session.passport.user,
          req.sessionID,
        );
      } catch (err) {
        this.logger.warn(`Failed to remove session tracking for user ${session.passport.user}: ${err.message}`);
        // Continue with logout - tracking failure shouldn't block user logout
      }
    }

    req.session.destroy((err) => {
      if (err) {
        this.logger.error(`Session destroy failed: ${err.message}`);
        // Still clear cookie even if destroy failed
      }
      // ALWAYS clear cookie - this is critical for preventing stale session state
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      res.json({ message: 'Logged out successfully' });
    });
  }

  @SkipThrottle({ default: true, auth: true }) // Skip all throttlers - this is called very frequently
  @Get('me')
  @UseGuards(AuthenticatedGuard)
  async me(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified,
      avatar: user.avatar,
    };
  }

  @Post('deactivate')
  @UseGuards(AuthenticatedGuard)
  async deactivateAccount(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const session = req.session as any;

    this.logger.log(`Account deactivation initiated for user ${user.id}`);

    // Deactivate the account
    await this.authService['usersService'].deactivateAccount(user.id);

    // Send confirmation email
    await this.authService['emailService'].sendAccountDeactivatedEmail(
      user.email,
      user.firstName || user.name || 'User',
    );

    // Remove all user sessions
    try {
      await this.sessionsService.removeAllUserSessions(user.id);
    } catch (err) {
      this.logger.warn(`Failed to remove all sessions for user ${user.id}: ${err.message}`);
    }

    // Destroy current session and clear cookie
    req.session.destroy((err) => {
      if (err) {
        this.logger.error(`Session destroy failed during deactivation: ${err.message}`);
      }
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      res.json({
        message: 'Account deactivated successfully. A confirmation email has been sent.'
      });
    });
  }

  @Post('verify-email')
  async verifyEmail(
    @Body('token') token: string,
    @Req() req: Request,
  ) {
    // Verify the email
    const { userId } = await this.authService.verifyEmail(token);

    // Get the verified user
    const user = await this.authService['usersService'].findById(userId);

    if (!user) {
      throw new InternalServerErrorException('User not found after verification');
    }

    // Auto-login the user after email verification
    return new Promise((resolve, reject) => {
      req.login(user, async (err) => {
        if (err) return reject(new InternalServerErrorException('Session error'));

        // Track session for multi-device limit enforcement
        await this.sessionsService.addUserSession(user.id, req.sessionID);

        resolve({
          message: 'Email verified successfully',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: user.emailVerified,
          },
        });
      });
    });
  }

  @Post('resend-verification')
  @Throttle({ auth: { limit: 1, ttl: 300000 } }) // 1 per 5 minutes
  @UseGuards(AuthenticatedGuard)
  async resendVerification(@CurrentUser() user: any) {
    await this.authService.resendVerificationEmail(user.id, user.email);
    return { message: 'Verification email sent' };
  }

  @Post('forgot-password')
  @Throttle({ auth: { limit: 1, ttl: 300000 } }) // 1 per 5 minutes
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.sendPasswordResetEmail(dto.email);
    // Always return same message regardless of whether email exists (prevents user enumeration)
    return { message: 'If that email is registered, we sent a password reset link' };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    // Passport populates req.user after OAuth callback
    // Regenerate session for security
    const user = req.user;
    req.session.regenerate(async (err) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=session_error`);
      }
      (req.session as any).passport = { user: (user as any).id };
      (req.session as any).createdAt = Date.now();
      req.session.save(async (err) => {
        if (err) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=session_error`);
        }

        // Track session for multi-device limit enforcement
        await this.sessionsService.addUserSession((user as any).id, req.sessionID);

        // Redirect to frontend dashboard
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
      });
    });
  }

  @Get('linkedin')
  @UseGuards(LinkedInAuthGuard)
  async linkedinAuth() {
    // Guard redirects to LinkedIn
  }

  @Get('linkedin/callback')
  @UseGuards(LinkedInAuthGuard)
  async linkedinAuthCallback(@Req() req: Request, @Res() res: Response) {
    // Same session establishment pattern as Google callback
    const user = req.user;
    req.session.regenerate(async (err) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=session_error`);
      }
      (req.session as any).passport = { user: (user as any).id };
      (req.session as any).createdAt = Date.now();
      req.session.save(async (err) => {
        if (err) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=session_error`);
        }

        // Track session for multi-device limit enforcement
        await this.sessionsService.addUserSession((user as any).id, req.sessionID);

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
      });
    });
  }
}
