import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/user.controller';
import { LoggerService } from './services/logger.service';
import { DatabaseService, DatabaseConfig } from './services/database.service';
import { UserService } from './services/user.service';
import { RequestContextService } from './services/request-context.service';

/**
 * Custom provider examples demonstrating different provider types
 */
const databaseConfigProvider = {
  provide: 'DATABASE_CONFIG',
  useValue: {
    host: 'localhost',
    port: 5432,
    database: 'nestjs_demo',
  } as DatabaseConfig,
};

const databaseFactoryProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: (config: DatabaseConfig) => {
    return `Factory Connection: ${config.host}:${config.port}/${config.database}`;
  },
  inject: ['DATABASE_CONFIG'],
};

/**
 * App Module - Root module demonstrating provider registration
 * Shows different ways to register providers:
 * - Class providers (most common)
 * - Value providers (for constants/config)
 * - Factory providers (for dynamic initialization)
 */
@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
  ],
  providers: [
    // Standard class providers
    LoggerService,
    DatabaseService,
    UserService,
    RequestContextService,
    
    // Custom providers
    databaseConfigProvider,
    databaseFactoryProvider,
  ],
})
export class AppModule {}
