import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { EmailModule } from './email/email.module';
import { CustomThrottlerGuard } from './auth/guards/custom-throttler.guard';
import { AbsoluteSessionExpiryMiddleware } from './auth/middleware/absolute-session-expiry.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 60 seconds
        limit: 20, // 20 requests per minute (general)
      },
      {
        name: 'auth',
        ttl: 60000, // 60 seconds
        limit: 5, // 5 requests per minute for auth routes
      },
    ]),
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AbsoluteSessionExpiryMiddleware).forRoutes('*');
  }
}
