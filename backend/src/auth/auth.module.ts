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
import { GoogleStrategy } from './strategies/google.strategy';

// Conditionally register OAuth strategies
const optionalProviders = [];
if (process.env.GOOGLE_CLIENT_ID) {
  optionalProviders.push(GoogleStrategy);
}

@Module({
  imports: [
    PassportModule.register({ session: true }),
    UsersModule,
    EmailModule,
    SessionsModule,
    PrismaModule,
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, ...optionalProviders],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
