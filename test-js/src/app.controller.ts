import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('greetings')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Get a greeting message' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns a greeting message',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Hello, World!'
        }
      }
    }
  })
  @ApiQuery({ 
    name: 'name', 
    required: false, 
    description: 'Name to greet',
    example: 'John'
  })
  getHello(@Query('name') name?: string) {
    return this.appService.getHello(name);
  }
}
