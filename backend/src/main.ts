import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { validateEnv } from './config/env.validation';
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Validate environment variables before starting
  const env = validateEnv();
  logger.log(`Starting application in ${env.NODE_ENV} mode`);

  const app = await NestFactory.create(AppModule);

  // Cookie parser middleware
  app.use(cookieParser());

  // Redis client for session store
  const redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  });

  // Session middleware with Redis store
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      rolling: true, // Sliding expiration for better UX
      cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    }),
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Enable CORS
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(env.PORT);
  logger.log(`Application is running on: http://localhost:${env.PORT}`);
  logger.log(`Health check available at: http://localhost:${env.PORT}/health`);
}

bootstrap();
