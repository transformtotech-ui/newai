import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './services/logger.service';
import { DatabaseService } from './services/database.service';

/**
 * Bootstrap function - Entry point of the application
 * Demonstrates:
 * - Creating NestJS application
 * - Accessing services from the DI container
 * - Manual service initialization
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get services from DI container
  const logger = app.get(LoggerService);
  const database = app.get(DatabaseService);

  logger.setContext('Bootstrap');
  logger.log('Application starting...');

  // Initialize database connection
  database.connect({
    host: 'localhost',
    port: 5432,
    database: 'nestjs_demo',
  });
  logger.log('Database connected: ' + database.getConnection());

  const port = 3000;
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log('Try these endpoints:');
  logger.log(`  GET  http://localhost:${port}/`);
  logger.log(`  GET  http://localhost:${port}/health`);
  logger.log(`  GET  http://localhost:${port}/users`);
  logger.log(`  GET  http://localhost:${port}/users/1`);
  logger.log(`  POST http://localhost:${port}/users (body: {"name": "...", "email": "..."})`);
}

bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});
