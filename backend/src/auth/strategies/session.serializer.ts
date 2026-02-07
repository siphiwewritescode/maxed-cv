import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: Function): void {
    // Store only user ID in session (prevents session bloat)
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: Function): Promise<void> {
    // Fetch user by ID (excludes passwordHash)
    const user = await this.usersService.findById(userId);
    done(null, user);
  }
}
