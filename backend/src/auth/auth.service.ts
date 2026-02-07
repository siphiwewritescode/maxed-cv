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
}
