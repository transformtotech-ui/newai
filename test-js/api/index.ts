import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

const express = require('express');
const server = express();

let isAppInitialized = false;
let nestApp: INestApplication;

async function bootstrap() {
  if (isAppInitialized) {
    return;
  }

  try {
    const expressAdapter = new ExpressAdapter(server);
    
    nestApp = await NestFactory.create(
      AppModule,
      expressAdapter,
      { 
        logger: ['error', 'warn', 'log'],
        bodyParser: true,
      }
    );

    // Enable CORS
    nestApp.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('NestJS API with Swagger documentation and PostgreSQL')
      .setVersion('1.0')
      .addTag('greetings')
      .addTag('users')
      .build();
    
    const document = SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('api', nestApp, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'NestJS API Documentation',
    });

    await nestApp.init();
    
    isAppInitialized = true;
    console.log('NestJS application initialized successfully');
  } catch (error) {
    console.error('Error initializing NestJS app:', error);
    isAppInitialized = false;
    throw error;
  }
}

// Initialize the app
bootstrap().catch(err => {
  console.error('Bootstrap error:', err);
});

// For Vercel serverless function
export default async (req, res) => {
  try {
    if (!isAppInitialized) {
      await bootstrap();
    }
    return server(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error?.message || 'Unknown error'
    });
  }
};
