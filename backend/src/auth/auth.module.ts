import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { MfaController } from './mfa.controller';
import { UserEntity } from '../entities/user.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { GlobalSettingEntity } from '../entities/global-setting.entity';
import { IUserRepository } from './ports/user.repository.interface';
import { UserRepository } from './adapters/user.repository';
import { RegisterUserHandler } from './commands/handlers/register.handler';
import { LoginUserHandler } from './commands/handlers/login.handler';
import { GoogleLoginHandler } from './commands/handlers/google-login.handler';
import { JwtStrategy } from './jwt.strategy';
import { NotificationsModule } from '../notifications/notifications.module';

const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  GoogleLoginHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity, VendorEntity, GlobalSettingEntity]),
    PassportModule,
    NotificationsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super-secret'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController, MfaController],
  providers: [
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    JwtStrategy,
    ...CommandHandlers,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
