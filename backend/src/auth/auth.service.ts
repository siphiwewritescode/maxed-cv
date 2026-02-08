import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { SessionsService } from '../sessions/sessions.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';

// Type for user without password hash
export type UserWithoutPassword = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private sessionsService: SessionsService,
    private prisma: PrismaService,
  ) {}

  /**
   * Validate user credentials for local strategy
   * Returns user without password hash if valid, null if invalid
   */
  async validateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);

    // Return null if user doesn't exist (don't reveal user doesn't exist)
    if (!user) return null;

    // Return null if user has no password hash (OAuth-only user)
    if (!user.passwordHash) return null;

    // Compare password with hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) return null;

    // Return user without passwordHash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Sign up a new user
   */
  async signup(dto: SignupDto): Promise<UserWithoutPassword> {
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      // If account is deactivated, reactivate it with new password
      if (existingUser.deactivatedAt) {
        // Hash new password
        const passwordHash = await this.hashPassword(dto.password);

        // Reactivate account: update password, clear deactivatedAt, update name, clear emailVerified
        const reactivatedUser = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            name: `${dto.firstName} ${dto.lastName}`,
            deactivatedAt: null,
            emailVerified: null, // Require re-verification for reactivated accounts
          },
        });

        // Send verification email for reactivated account
        await this.sendVerificationEmail(reactivatedUser.id, reactivatedUser.email);

        // Return user without passwordHash
        const { passwordHash: _, ...userWithoutPassword } = reactivatedUser;
        return userWithoutPassword;
      }

      // Account exists and is active - can't sign up with this email
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password with bcrypt (work factor 13 for 2026 security)
    const passwordHash = await this.hashPassword(dto.password);

    // Create user
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // Send verification email (user gets full access immediately, email is for verification only)
    await this.sendVerificationEmail(user.id, user.email);

    // Return user without passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Hash a password with bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 13);
  }

  /**
   * Send verification email with 24-hour token
   */
  async sendVerificationEmail(userId: string, email: string): Promise<void> {
    // Generate token (32 bytes = 64 hex characters)
    const token = randomBytes(32).toString('hex');

    // Hash token before storing (SHA-256)
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Delete any existing verification tokens for this user (prevent duplicates)
    await this.prisma.verificationToken.deleteMany({
      where: { userId },
    });

    // Store hashed token in database with 24-hour expiry
    await this.prisma.verificationToken.create({
      data: {
        userId,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Build verification URL (send unhashed token in email)
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;

    // Send email
    await this.emailService.sendVerificationEmail(email, verificationUrl);
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ userId: string }> {
    // Hash incoming token to compare with database
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Find token in database (must be valid and not expired)
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Mark email as verified
    await this.usersService.updateEmailVerified(
      verificationToken.userId,
      new Date(),
    );

    // Delete used token (one-time use)
    await this.prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { userId: verificationToken.userId };
  }

  /**
   * Resend verification email (for logged-in users)
   */
  async resendVerificationEmail(userId: string, email: string): Promise<void> {
    // Check if email is already verified
    const user = await this.usersService.findById(userId);
    if (user?.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Delete existing verification tokens
    await this.prisma.verificationToken.deleteMany({
      where: { userId },
    });

    // Send new verification email
    await this.sendVerificationEmail(userId, email);
  }

  /**
   * Send password reset email with 1-hour token
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    // Find user by email
    const user = await this.usersService.findByEmail(email);

    // If user not found, add artificial delay and return silently
    // This prevents user enumeration (don't reveal whether email exists)
    if (!user) {
      await new Promise((r) => setTimeout(r, 100));
      return;
    }

    // Delete any existing reset tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate token (32 bytes = 64 hex characters)
    const token = randomBytes(32).toString('hex');

    // Hash token before storing (SHA-256)
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Store hashed token in database with 1-hour expiry
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Build reset URL (send unhashed token in email)
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;

    // Send email
    await this.emailService.sendPasswordResetEmail(email, resetUrl);
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Hash incoming token to compare with database
    const hashedToken = createHash('sha256').update(token).digest('hex');

    // Find token in database (must be valid and not expired)
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

    // Update user password
    await this.usersService.updatePassword(resetToken.userId, passwordHash);

    // Delete used token (one-time use)
    await this.prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    // Invalidate ALL sessions (log out all devices when password is reset)
    await this.sessionsService.removeAllUserSessions(resetToken.userId);

    // Send notification email
    await this.emailService.sendPasswordChangedEmail(resetToken.user.email);
  }

  /**
   * Find or create OAuth user (handles both Google and LinkedIn)
   */
  async findOrCreateOAuthUser(data: {
    provider: 'google' | 'linkedin';
    providerId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }): Promise<UserWithoutPassword> {
    // 1. Check if user already exists with this OAuth provider ID
    let user;
    if (data.provider === 'google') {
      user = await this.usersService.findByGoogleId(data.providerId);
    } else {
      user = await this.usersService.findByLinkedInId(data.providerId);
    }
    if (user) {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    // 2. Check if user exists with this email (account linking)
    user = await this.usersService.findByEmail(data.email);
    if (user) {
      // Link OAuth provider to existing account
      await this.usersService.linkOAuthProvider(user.id, data.provider, data.providerId);
      // Update avatar if not set
      if (!user.avatar && data.avatar) {
        await this.prisma.user.update({ where: { id: user.id }, data: { avatar: data.avatar } });
      }
      const refreshedUser = await this.usersService.findById(user.id);
      return refreshedUser as UserWithoutPassword;
    }

    // 3. Create new user (OAuth users are auto-verified)
    const newUser = await this.usersService.create({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar,
      [data.provider === 'google' ? 'googleId' : 'linkedinId']: data.providerId,
      emailVerified: new Date(), // OAuth providers verify emails
    });

    const { passwordHash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
