import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | object;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      
      if (typeof errorResponse === 'string') {
        message = errorResponse;
        error = exception.name;
      } else {
        message = (errorResponse as any).message || errorResponse;
        error = (errorResponse as any).error || exception.name;
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle TypeORM database errors
      status = HttpStatus.BAD_REQUEST;
      message = 'Database operation failed';
      error = 'DatabaseError';
      
      // Log the actual database error for debugging
      this.logger.error(`Database error: ${exception.message}`, exception.stack);
    } else {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'InternalServerError';
      
      // Log unexpected errors
      this.logger.error(`Unexpected error: ${exception}`, exception instanceof Error ? exception.stack : '');
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
    };

    // Log error details
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json(errorResponse);
  }
}