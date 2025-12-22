import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UserService, User } from '../services/user.service';
import { RequestContextService } from '../services/request-context.service';

/**
 * User Controller - Demonstrates dependency injection in controllers
 * Shows how controllers receive services through constructor injection
 */
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Get()
  getAllUsers(): User[] {
    console.log('Request Info:', this.requestContext.getInfo());
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): User | undefined {
    console.log('Request Info:', this.requestContext.getInfo());
    return this.userService.findById(Number(id));
  }

  @Post()
  createUser(@Body() body: { name: string; email: string }): User {
    console.log('Request Info:', this.requestContext.getInfo());
    return this.userService.create(body.name, body.email);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): { success: boolean } {
    console.log('Request Info:', this.requestContext.getInfo());
    const success = this.userService.delete(Number(id));
    return { success };
  }
}
