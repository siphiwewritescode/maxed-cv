import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { SessionsModule } from '../sessions/sessions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './strategies/session.serializer';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    UsersModule,
    EmailModule,
    SessionsModule,
    PrismaModule,
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
