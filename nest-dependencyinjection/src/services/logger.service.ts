import { Injectable, Scope } from '@nestjs/common';

/**
 * Logger Service - Demonstrates singleton scope (default)
 * This service will be shared across the entire application
 */
@Injectable()
export class LoggerService {
  private context: string = 'Application';

  setContext(context: string) {
    this.context = context;
  }

  log(message: string) {
    console.log(`[${this.context}] ${new Date().toISOString()} - ${message}`);
  }

  error(message: string, trace?: string) {
    console.error(`[${this.context}] ${new Date().toISOString()} - ERROR: ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string) {
    console.warn(`[${this.context}] ${new Date().toISOString()} - WARN: ${message}`);
  }
}
