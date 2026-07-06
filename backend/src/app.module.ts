import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalSettingEntity } from './entities/global-setting.entity';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { MaintenanceInterceptor } from './common/interceptors/maintenance.interceptor';
import { DatabaseAuditSubscriber } from './common/subscribers/database-audit.subscriber';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { VendorBankAccountEntity } from './entities/vendor-bank-account.entity';
import { CampaignEntity } from './entities/campaign.entity';
import { AuthModule } from './auth/auth.module';
import { VendorsModule } from './vendors/vendors.module';
import { TripsModule } from './trips/trips.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { PromocodesModule } from './promocodes/promocodes.module';
import { CmsModule } from './cms/cms.module';
import { EventsModule } from './events/events.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';
import { KycModule } from './kyc/kyc.module';
import { ComplianceModule } from './compliance/compliance.module';
import { AiModule } from './ai/ai.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
// ContentModule removed — was an empty placeholder with no controllers or providers
import { SupportModule } from './support/support.module';
import { PayrollModule } from './payroll/payroll.module';
import { ContactsModule } from './contacts/contacts.module';
import { CustomersModule } from './customers/customers.module';
import { ApplicationsModule } from './applications/applications.module';
import { ReferralsModule } from './referrals/referrals.module';
import { RewardsModule } from './rewards/rewards.module';
import { CareersModule } from './careers/careers.module';
import { StorageModule } from './storage/storage.module';
import { MediaModule } from './media/media.module';
import { ChatModule } from './chat/chat.module';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(5001),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('7d'),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbType = configService.get<string>('DB_TYPE', 'postgres');
        const baseConfig = {
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
      logging: true, // Enabled to allow table creation
        };

        if (dbType === 'better-sqlite3') {
          return {
            type: 'better-sqlite3' as any,
            database: './dev.db',
            ...baseConfig,
          } as TypeOrmModuleOptions;
        }

        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          schema: 'tripdekho',
          extra: {
            ...(configService.get<string>('DB_SSL') === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
            max: 20, // Connection pool size
            statement_timeout: 30000, logging: true, // 30 seconds
          },
          ...baseConfig,
        } as TypeOrmModuleOptions;
      },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('THROTTLER_TTL', 60000),
            limit: configService.get<number>('THROTTLER_LIMIT', 10000),
          },
        ],
      }),
    }),
    EventEmitterModule.forRoot({
      global: true,
      wildcard: true,
    }),
    AuthModule,
    VendorsModule,
    TripsModule,
    BookingsModule,
    PaymentsModule,
    AdminModule,
    PromocodesModule,
    CmsModule,
    EventsModule,
    NotificationsModule,
    HealthModule,
    KycModule,
    ComplianceModule,
    AiModule,
    ReviewsModule,
    WishlistModule,

    SupportModule,
    PayrollModule,
    ContactsModule,
    CustomersModule,
    ApplicationsModule,
    ReferralsModule,
    RewardsModule,
    CareersModule,
    StorageModule,
    MediaModule,
    ChatModule,
    ActivityModule,
    TypeOrmModule.forFeature([GlobalSettingEntity]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MaintenanceInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    DatabaseAuditSubscriber,
  ],
})
export class AppModule {}
