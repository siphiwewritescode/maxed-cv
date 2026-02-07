import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { validateEnv } from './config/env.validation';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Validate environment variables before starting
  const env = validateEnv();
  logger.log(`Starting application in ${env.NODE_ENV} mode`);

  const app = await NestFactory.create(AppModule);

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
