import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalSettingEntity } from '../../entities/global-setting.entity';

@Injectable()
export class MaintenanceInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(GlobalSettingEntity)
    private readonly globalSettingRepo: Repository<GlobalSettingEntity>,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    // Ignore internal metrics/health endpoints if any
    if (request.url.includes('/health') || request.url.includes('/metrics')) {
      return next.handle();
    }

    const settings = await this.globalSettingRepo.findOne({ where: { configName: 'default' } });
    
    if (settings?.isMaintenanceMode) {
      // Check if user is authenticated and is an admin
      const user = request.user;
      const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'tech_admin');
      
      // If user is trying to access admin login or is an admin, allow it
      const isAdminLogin = request.url.includes('/auth/login') && request.body?.email?.includes('admin');

      if (!isAdmin && !isAdminLogin) {
        throw new ServiceUnavailableException({
          statusCode: 503,
          message: 'Service is currently under maintenance.',
          error: 'MAINTENANCE_MODE'
        });
      }
    }

    return next.handle();
  }
}
