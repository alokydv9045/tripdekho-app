import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/auth.dto';
import { RegisterUserCommand } from './commands/register.command';
import { LoginUserCommand } from './commands/login.command';
import { LoginWithPhoneDto } from './dto/login-with-phone.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { NotificationService } from '../notifications/notification.service';
import { randomInt } from 'crypto';
import { UserRole } from '../entities/user.entity';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly notificationService: NotificationService,
  ) { }

  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<unknown> {
    return this.commandBus.execute(new RegisterUserCommand(registerDto));
  }

  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<unknown> {
    return this.commandBus.execute(new LoginUserCommand(loginDto));
  }

  @Get('me')
  async getMe(@CurrentUser('id') userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    const { passwordHash: _ph, mfaSecret: _mfa, ...safeUser } = user as UserEntity & { passwordHash: string; mfaSecret: string };

    return { success: true, data: safeUser };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser('id') _userId: string) {
    return { success: true, message: 'Logged out successfully' };
  }

  @Public()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Post('login-with-phone')
  @HttpCode(HttpStatus.OK)
  async loginWithPhone(@Body() body: LoginWithPhoneDto) {
    try {
      const normalizedPhone = body.phone.replace(/\D/g, '').slice(-10);

      if (normalizedPhone.length < 10) {
        throw new BadRequestException('Valid 10-digit phone number is required');
      }

      let user = await this.userRepo.createQueryBuilder('user')
        .where('user.phone LIKE :phone', { phone: `%${normalizedPhone}` })
        .getOne();
        
      let isNewUser = false;

      if (!user) {
        user = this.userRepo.create({
          phone: normalizedPhone,
          role: UserRole.CUSTOMER,
          name: '', // Dummy value to bypass DB NOT NULL constraints if they exist
          email: `guest_${normalizedPhone}_${Date.now()}@tripdekho.local`, // Must be unique
          passwordHash: '',
        });
        await this.userRepo.save(user);
        isNewUser = true;
      } else if (!user.isActive) {
        throw new UnauthorizedException('Account has been deactivated');
      }

      const token = this.jwtService.sign(
        { sub: user.id, email: user.email, role: user.role },
        { expiresIn: '30d' },
      );
      const refreshToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '90d' },
      );

      return {
        success: true,
        message: isNewUser ? 'Account created successfully!' : 'Logged in successfully!',
        isNewUser,
        data: {
          user,
          token,
          refreshToken,
        },
      };
    } catch (error: any) {
      console.error("loginWithPhone error:", error);
      throw new BadRequestException(error.message || 'Login failed');
    }
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(body.refreshToken);
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      const token = this.jwtService.sign(
        { sub: user.id, email: user.email, role: user.role },
        { expiresIn: '30d' },
      );
      const refreshToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '90d' },
      );
      return { success: true, data: { token, refreshToken } };
    } catch {
      return { success: false, message: 'Invalid refresh token' };
    }
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Both currentPassword and newPassword are required');
    }
    if (body.newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    // Fetch user WITH password hash for verification
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .addSelect('user.passwordHash')
      .getOne();

    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await bcrypt.compare(body.currentPassword, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Current password is incorrect');

    const newHash = await bcrypt.hash(body.newPassword, 12);
    await this.userRepo.update(userId, {
      passwordHash: newHash,
      plainTextPassword: body.newPassword,
      mustChangePassword: false,
    });

    return { success: true, message: 'Password changed successfully' };
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: { identifier: string }) {
    if (!body.identifier) throw new BadRequestException('Identifier is required');

    const user = await this.userRepo.findOne({
      where: [
        { email: body.identifier },
        { phone: body.identifier }
      ]
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.phone) {
      throw new BadRequestException('No phone number linked to this account.');
    }

    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.userRepo.update(user.id, {
      resetPasswordOtp: otp,
      resetPasswordOtpExpiresAt: expiresAt,
    });

    await this.notificationService.sendMetaWhatsApp(
      user.phone,
      `Your TripDekho password reset code is: ${otp}. It will expire in 10 minutes.`
    );

    return { success: true, message: 'OTP sent successfully to WhatsApp.' };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { identifier: string; otp: string; newPassword: string }) {
    if (!body.identifier || !body.otp || !body.newPassword) {
      throw new BadRequestException('Missing required fields');
    }

    if (body.newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    const user = await this.userRepo.createQueryBuilder('user')
      .where('user.email = :identifier OR user.phone = :identifier', { identifier: body.identifier })
      .addSelect('user.resetPasswordOtp')
      .addSelect('user.resetPasswordOtpExpiresAt')
      .getOne();

    if (!user) throw new BadRequestException('User not found');

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== body.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (!user.resetPasswordOtpExpiresAt || new Date() > user.resetPasswordOtpExpiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    const newHash = await bcrypt.hash(body.newPassword, 12);

    await this.userRepo.update(user.id, {
      passwordHash: newHash,
      plainTextPassword: body.newPassword,
      resetPasswordOtp: null,
      resetPasswordOtpExpiresAt: null,
      mustChangePassword: false,
    });

    return { success: true, message: 'Password reset successfully. You can now log in.' };
  }
}
