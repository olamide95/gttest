import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors';
import { GenericExceptionFilter } from './common/filters';
import * as express from 'express';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for local development
 // In main.ts
app.enableCors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Accept, Authorization',
  credentials: true
});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new GenericExceptionFilter());
  
  // Configure request body size
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(express.json({ limit: '50mb' }));
  expressApp.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  await app.listen(PORT, '0.0.0.0'); // Listen on all network interfaces
  console.log(`Application is running on: http://localhost:${PORT}`);
}

bootstrap();