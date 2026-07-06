import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { GlobalSettingEntity } from '../entities/global-setting.entity';
import { IsUUID, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

interface JwtPayload {
  sub?: string;
  id?: string;
  email?: string;
  role?: string;
  mfaPending?: boolean;
}

class JwtPayloadDto {
  @IsUUID('4', { message: 'Invalid token format' })
  id: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(GlobalSettingEntity)
    private globalSettingRepository: Repository<GlobalSettingEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token: string | null = null;
          if (request?.cookies) {
            token =
              (request.cookies as Record<string, string>)['token'] ?? null;
          }
          if (!token && request.headers.authorization) {
            token = request.headers.authorization.split(' ')[1] ?? null;
          }
          if (!token) {
            return null;
          }

          try {
            // Very strict validation: The token must ONLY contain valid base64url characters and two dots.
            if (
              !/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token)
            ) {
              return null;
            }
            return token;
          } catch (e) {
            return null;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super-secret'),
    });
  }

  async validate(payload: any) {
    try {
      const userId = payload.sub;
      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Check for global lockdown
      const globalSettings = await this.globalSettingRepository.findOne({
        where: { configName: 'default' },
      });
      if (globalSettings?.lockdownTimestamp) {
        const tokenIat = payload.iat ? new Date(payload.iat * 1000) : null;
        if (tokenIat && tokenIat < globalSettings.lockdownTimestamp) {
          // If the user is an admin, allow them to bypass the lockdown
          if (
            user.role !== 'admin' &&
            user.role !== 'super_admin' &&
            user.role !== 'tech_admin'
          ) {
            throw new UnauthorizedException(
              'Session invalidated due to security lockdown',
            );
          }
        }
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid token');
    }
  }
}
