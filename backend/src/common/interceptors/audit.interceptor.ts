import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { AuditLogEntity } from '../../entities/audit-log.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, ip, user } = req;

    // We only log state-changing requests to avoid bloating with every GET request
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(async () => {
          try {
            // Scrub sensitive data from body
            const sanitizedBody = { ...body };
            if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
            if (sanitizedBody.oldPassword) sanitizedBody.oldPassword = '[REDACTED]';
            if (sanitizedBody.newPassword) sanitizedBody.newPassword = '[REDACTED]';
            if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';

            const auditRepo = this.dataSource.getRepository(AuditLogEntity);
            const auditLog = auditRepo.create({
              event: `API_CALL: ${method} ${url}`,
              type: 'api',
              details: JSON.stringify({ body: sanitizedBody }),
              ipAddress: ip,
              moduleName: context.getClass().name,
              user: user ? ({ id: user.id } as any) : undefined,
            });

            await auditRepo.save(auditLog);
          } catch (error) {
            console.error('Failed to save API audit log', error);
          }
        }),
      );
    }

    return next.handle();
  }
}
