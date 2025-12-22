import { Injectable } from '@nestjs/common';

/**
 * Database Configuration Interface
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
}

/**
 * Database Service - Demonstrates dependency on LoggerService
 * Shows constructor injection pattern
 */
@Injectable()
export class DatabaseService {
  private connection: string;

  constructor() {
    // Simulated database connection
    this.connection = 'Not connected';
  }

  connect(config: DatabaseConfig): void {
    this.connection = `Connected to ${config.database} at ${config.host}:${config.port}`;
  }

  getConnection(): string {
    return this.connection;
  }

  query(sql: string): any[] {
    // Simulated query execution
    return [
      { id: 1, name: 'Sample Data' },
      { id: 2, name: 'Another Record' }
    ];
  }
}
