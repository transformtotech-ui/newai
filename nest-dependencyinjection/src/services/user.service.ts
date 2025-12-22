import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { DatabaseService } from './database.service';

export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * User Service - Demonstrates multiple dependencies
 * Shows how a service can depend on other services
 */
@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  constructor(
    private readonly logger: LoggerService,
    private readonly database: DatabaseService,
  ) {
    this.logger.setContext('UserService');
    this.logger.log('UserService initialized');
  }

  findAll(): User[] {
    this.logger.log('Finding all users');
    // In a real app, this would use database.query()
    return this.users;
  }

  findById(id: number): User | undefined {
    this.logger.log(`Finding user with id: ${id}`);
    const user = this.users.find(u => u.id === id);
    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
    }
    return user;
  }

  create(name: string, email: string): User {
    const newUser: User = {
      id: this.users.length + 1,
      name,
      email,
    };
    this.users.push(newUser);
    this.logger.log(`Created user: ${name}`);
    return newUser;
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index > -1) {
      this.users.splice(index, 1);
      this.logger.log(`Deleted user with id: ${id}`);
      return true;
    }
    this.logger.warn(`Cannot delete - user with id ${id} not found`);
    return false;
  }
}
