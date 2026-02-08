import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class SessionsService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly logger = new Logger(SessionsService.name);
  private readonly MAX_SESSIONS = 3;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async addUserSession(userId: string, sessionId: string): Promise<void> {
    try {
      const setKey = `user:${userId}:sessions`;

      // Add the new session
      await this.redis.sadd(setKey, sessionId);

      // Check if we've exceeded the limit
      const sessionCount = await this.redis.scard(setKey);

      if (sessionCount > this.MAX_SESSIONS) {
        // Get all sessions
        const sessions = await this.redis.smembers(setKey);

        // Sort to get oldest (first in set - note: Redis sets are unordered,
        // but for simplicity we take the first member returned)
        const oldestSessionId = sessions[0];

        // Remove from user's session set
        await this.redis.srem(setKey, oldestSessionId);

        // Destroy the actual session data
        await this.redis.del(`sess:${oldestSessionId}`);

        this.logger.log(
          `Evicted oldest session ${oldestSessionId} for user ${userId} (max ${this.MAX_SESSIONS} sessions)`,
        );
      }
    } catch (err) {
      this.logger.error(
        `Failed to add/track session for user ${userId}: ${err.message}`,
      );
      // Don't throw - session will still work, just won't be tracked
      // This allows auth flow to continue even if Redis is temporarily down
    }
  }

  async removeUserSession(userId: string, sessionId: string): Promise<void> {
    try {
      const setKey = `user:${userId}:sessions`;
      await this.redis.srem(setKey, sessionId);
    } catch (err) {
      this.logger.error(
        `Failed to remove session tracking for user ${userId}: ${err.message}`,
      );
      // Don't throw - logout should proceed even if tracking cleanup fails
    }
  }

  async getUserSessions(userId: string): Promise<string[]> {
    const setKey = `user:${userId}:sessions`;
    return this.redis.smembers(setKey);
  }

  async removeAllUserSessions(userId: string): Promise<void> {
    try {
      const setKey = `user:${userId}:sessions`;

      // Get all session IDs
      const sessionIds = await this.redis.smembers(setKey);

      // Destroy each session
      for (const sessionId of sessionIds) {
        await this.redis.del(`sess:${sessionId}`);
      }

      // Clear the tracking set
      await this.redis.del(setKey);

      this.logger.log(
        `Removed all ${sessionIds.length} sessions for user ${userId}`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to remove all sessions for user ${userId}: ${err.message}`,
      );
      // Don't throw - operation should be considered complete even if Redis fails
    }
  }

  async getSessionCount(userId: string): Promise<number> {
    const setKey = `user:${userId}:sessions`;
    return this.redis.scard(setKey);
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }
}
