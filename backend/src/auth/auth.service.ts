import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';

// Type for user without password hash
export type UserWithoutPassword = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
