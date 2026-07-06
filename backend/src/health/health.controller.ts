import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  MicroserviceHealthIndicator,
  HealthIndicatorFunction,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    const checks: HealthIndicatorFunction[] = [
      () => this.db.pingCheck('database', { timeout: 5000 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
    ];

    if (this.configService.get<string>('DISABLE_REDIS') !== 'true') {
      checks.push(() =>
        this.microservice.pingCheck('redis', {
          transport: Transport.REDIS,
          options: {
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
          },
        }),
      );
    }

    if (this.configService.get<string>('RABBITMQ_URL')) {
      checks.push(() =>
        this.microservice.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: [this.configService.get<string>('RABBITMQ_URL')],
          },
        }),
      );
    }

    return this.health.check(checks);
  }
}
