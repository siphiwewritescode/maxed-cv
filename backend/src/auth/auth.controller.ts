import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Req() req: Request) {
    const user = await this.authService.signup(dto);

    // Auto-login after signup using req.login
    return new Promise((resolve, reject) => {
      req.login(user, (err) => {
        if (err) return reject(new InternalServerErrorException('Session error'));
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
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @CurrentUser() user: any,
  ) {
    // Regenerate session to prevent session fixation
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) return reject(new InternalServerErrorException('Session error'));

        // Re-serialize user after regeneration
        (req.session as any).passport = { user: user.id };

        // Set rememberMe flag and createdAt for tracking
        (req.session as any).rememberMe = loginDto.rememberMe;
        (req.session as any).createdAt = Date.now();

        // Extend cookie maxAge for rememberMe
        if (loginDto.rememberMe) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        }

        req.session.save((err) => {
          if (err) return reject(new InternalServerErrorException('Session error'));
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

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  }

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
      req.login(user, (err) => {
        if (err) return reject(new InternalServerErrorException('Session error'));
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
  @UseGuards(AuthenticatedGuard)
  async resendVerification(@CurrentUser() user: any) {
    await this.authService.resendVerificationEmail(user.id, user.email);
    return { message: 'Verification email sent' };
  }

  @Post('forgot-password')
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
    req.session.regenerate((err) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=session_error`);
      }
      (req.session as any).passport = { user: (user as any).id };
      (req.session as any).createdAt = Date.now();
      req.session.save((err) => {
        if (err) {
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=session_error`);
        }
        // Redirect to frontend dashboard
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
      });
    });
  }
}
