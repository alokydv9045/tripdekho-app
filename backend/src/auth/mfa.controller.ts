import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Controller('auth/mfa')
export class MfaController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('generate')
  async generate(@Req() req: any) {
    const user = await this.userRepo.findOne({
      where: { id: req.user.sub || req.user.id },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'TripDekho', secret);

    user.mfaSecret = secret;
    await this.userRepo.save(user);

    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    return {
      message:
        'MFA setup initialized. Scan the QR code with your authenticator app.',
      qrCode: qrCodeDataUrl,
      secret,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('enable')
  async enable(@Req() req: any, @Body('token') token: string) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.mfaSecret')
      .where('user.id = :id', { id: req.user.sub || req.user.id })
      .getOne();

    if (!user || !user.mfaSecret)
      throw new UnauthorizedException('MFA not initiated');

    const isValid = authenticator.verify({
      token,
      secret: user.mfaSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA token');
    }

    user.isMfaEnabled = true;
    await this.userRepo.save(user);

    return { message: 'MFA successfully enabled' };
  }

  @Post('verify')
  async verify(
    @Body('tempToken') tempToken: string,
    @Body('token') token: string,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(tempToken);
      if (!payload.mfaPending)
        throw new UnauthorizedException('Invalid temp token');

      const user = await this.userRepo
        .createQueryBuilder('user')
        .addSelect('user.mfaSecret')
        .where('user.id = :id', { id: payload.sub })
        .getOne();

      if (!user || !user.isMfaEnabled)
        throw new UnauthorizedException('MFA not enabled on this account');

      const isValid = authenticator.verify({
        token,
        secret: user.mfaSecret,
      });

      if (!isValid) {
        throw new UnauthorizedException('Invalid MFA token');
      }

      const fullPayload = { sub: user.id, email: user.email, role: user.role };
      return {
        access_token: await this.jwtService.signAsync(fullPayload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('MFA Verification failed');
    }
  }
}
