import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { format } from 'winston';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { CorrelationInterceptor } from './common/interceptors/correlation.interceptor';
import { UrlRewriteInterceptor } from './common/interceptors/url-rewrite.interceptor';
import helmet from 'helmet';

// OpenTelemetry Setup (must run before Nest bootstrap)
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const sdk = new NodeSDK({
  serviceName: 'tripdekho-backend',
  traceExporter: new OTLPTraceExporter({
    url:
      process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
      'http://localhost:4318/v1/traces',
  }),
  metricReader: new PrometheusExporter({ port: 9464 }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new winston.transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
    }),
  });

  try {
    const dataSource = app.get(DataSource);
    await dataSource.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    // Add the missing Razorpay columns that were recently added to codebase but missed in migration
    await dataSource.query(
      `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS "razorpayAccountId" character varying;`,
    );
    await dataSource.query(
      `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS "razorpayLinkedAccountStatus" character varying DEFAULT 'pending';`,
    );
    console.log('✅ Database schema verified and patched successfully.');
  } catch (error) {
    console.error('❌ Failed to patch database schema:', error.message);
  }

  app.setGlobalPrefix('api/v2');
  // CORS — allow frontend origins with credentials
  app.enableCors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'http://195.35.22.92:8080',
      'http://195.35.22.92',
      'http://tripdekho.in',
      'http://www.tripdekho.in',
      'https://tripdekho.in',
      'https://www.tripdekho.in',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'X-Correlation-ID',
    ],
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new UrlRewriteInterceptor(),
    new CorrelationInterceptor(),
  );

  // Graceful shutdown hooks for Kubernetes / Docker
  app.enableShutdownHooks();

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(
    `🚀 TripDekho Backend running on http://localhost:${port}/api/v2`,
  );
}
bootstrap();
