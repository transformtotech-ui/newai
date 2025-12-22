import { Injectable, Scope } from '@nestjs/common';

/**
 * Request-scoped service - Demonstrates transient/request scope
 * A new instance is created for each request
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private requestId: string;
  private timestamp: Date;

  constructor() {
    this.requestId = Math.random().toString(36).substring(7);
    this.timestamp = new Date();
  }

  getRequestId(): string {
    return this.requestId;
  }

  getTimestamp(): Date {
    return this.timestamp;
  }

  getInfo(): string {
    return `Request ID: ${this.requestId}, Timestamp: ${this.timestamp.toISOString()}`;
  }
}
