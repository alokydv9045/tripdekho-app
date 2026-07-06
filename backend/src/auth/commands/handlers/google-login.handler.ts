import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleLoginCommand } from '../google-login.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@CommandHandler(GoogleLoginCommand)
export class GoogleLoginHandler implements ICommandHandler<GoogleLoginCommand> {
  private readonly logger = new Logger(GoogleLoginHandler.name);
  private readonly oauth2Client: OAuth2Client;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.oauth2Client = new OAuth2Client(clientId);
  }

  async execute(command: GoogleLoginCommand) {
    try {
      const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: command.token,
        audience: clientId,
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new HttpException(
          'Invalid Google token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const email = payload.email;
      const name = payload.name || 'Google User';

      let user = await this.userRepo.findOne({ where: { email } });

      if (!user) {
        const randomPassword = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(randomPassword, salt);

        user = this.userRepo.create({
          email,
          name,
          role: UserRole.CUSTOMER,
          isEmailVerified: true,
          passwordHash,
        });

        await this.userRepo.save(user);
      }

      const token = this.jwtService.sign(
        { sub: user.id, email: user.email, role: user.role },
        { expiresIn: '30d' },
      );
      const refreshToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '90d' },
      );

      // Remove sensitive fields before returning
      const { passwordHash: _ph, mfaSecret: _mfa, ...safeUser } = user as UserEntity & { passwordHash: string; mfaSecret: string };

      return {
        success: true,
        data: {
          user: safeUser,
          token,
          refreshToken,
        },
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error('Google login failed', err.stack);
      throw new HttpException(
        err.message || 'Google authentication failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
