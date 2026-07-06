import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the controller already returned a formatted response, return it
        if (data && data.success !== undefined && data.data !== undefined) {
          return data;
        }

        return {
          success: true,
          data: data?.data || data,
          message: data?.message || 'Request successful',
          meta: data?.meta,
        };
      }),
    );
  }
}
