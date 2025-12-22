import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(name?: string): { message: string } {
    const greeting = name ? `Hello, ${name}!` : 'Hello, World!';
    return { message: greeting };
  }
}
