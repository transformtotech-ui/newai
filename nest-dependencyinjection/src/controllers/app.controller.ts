import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { LoggerService } from '../services/logger.service';

/**
 * App Controller - Basic controller demonstrating DI
 */
@Controller()
export class AppController {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('AppController');
  }

  @Get()
  getHello(): object {
    this.logger.log('Hello endpoint called');
    return {
      message: 'Welcome to NestJS Dependency Injection Demo',
      database: this.database.getConnection(),
      endpoints: {
        users: '/users',
        health: '/health',
      },
    };
  }

  @Get('health')
  getHealth(): object {
    this.logger.log('Health check');
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: this.database.getConnection(),
    };
  }
}
