import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';
import { Request, Response } from 'express';

@Injectable()
export class CorrelationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { correlationId?: string }>();
    const headers = request.headers as Record<string, string | string[] | undefined>;
    const correlationId =
      (headers['x-correlation-id'] as string) || crypto.randomUUID();

    request.correlationId = correlationId;

    const response = context.switchToHttp().getResponse<Response>();
    response.setHeader('X-Correlation-ID', correlationId);

    return next.handle();
  }
}
