// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );
  await app.listen(3001); // Changed to 3001 to avoid conflict with frontend
  console.log(`🚀 Backend is running on http://localhost:3001`);
}
bootstrap();
