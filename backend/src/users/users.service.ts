import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find user by email (includes passwordHash for authentication)
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID (excludes passwordHash for security)
   */
  async findById(id: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    // Exclude passwordHash from return value
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find user by Google OAuth ID
   */
  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  /**
   * Find user by LinkedIn OAuth ID
   */
  async findByLinkedInId(linkedinId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { linkedinId },
    });
  }

  /**
   * Create a new user
   */
  async create(data: {
    email: string;
    passwordHash?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    googleId?: string;
    linkedinId?: string;
    avatar?: string;
    emailVerified?: Date | null;
  }): Promise<User> {
    // Generate name from firstName + lastName if not provided
    const name =
      data.name ||
      (data.firstName && data.lastName
        ? `${data.firstName} ${data.lastName}`
        : undefined);

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        name,
        googleId: data.googleId,
        linkedinId: data.linkedinId,
        avatar: data.avatar,
        emailVerified: data.emailVerified,
      },
    });
  }

  /**
   * Mark email as verified
   */
  async updateEmailVerified(userId: string, date: Date): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: date },
    });
  }

  /**
   * Update user's password hash
   */
  async updatePassword(userId: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  /**
   * Link OAuth provider to existing user
   */
  async linkOAuthProvider(
    userId: string,
    provider: 'google' | 'linkedin',
    providerId: string,
  ): Promise<User> {
    const updateData =
      provider === 'google'
        ? { googleId: providerId }
        : { linkedinId: providerId };

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }
}
