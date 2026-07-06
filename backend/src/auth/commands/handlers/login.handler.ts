import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from '../login.command';
import { IUserRepository } from '../../ports/user.repository.interface';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../../entities/user.entity';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginUserCommand) {
    const { email, password } = command.loginDto;

    const user = email.includes('@')
      ? await this.userRepository.findByEmail(email)
      : await this.userRepository.findByPhone(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    const isAdmin =
      user.role === UserRole.ADMIN ||
      user.role === UserRole.SUPER_ADMIN ||
      (user.role as string).includes('admin');

    if (command.loginDto.isAdminLogin && !isAdmin) {
      throw new UnauthorizedException(
        'Access denied. Administrator privileges required.',
      );
    }

    if (user.isMfaEnabled) {
      const tempPayload = { sub: user.id, mfaPending: true };
      return {
        mfaRequired: true,
        tempToken: await this.jwtService.signAsync(tempPayload, {
          expiresIn: '5m',
        }),
      };
    }

    // Remove the forced elevation hack. Users should log in with their actual roles.
    const payloadRole = user.role;
    const payload = { sub: user.id, email: user.email, role: payloadRole };

    const token = await this.jwtService.signAsync(payload, { expiresIn: '30d' });
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '90d' },
    );

    return {
      success: true,
      data: {
        token,
        access_token: token,
        refreshToken,
        mustChangePassword: (user as any).mustChangePassword || false,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: payloadRole,
          avatar: (user as any).avatar || null,
          phone: user.phone || null,
          nickname: (user as any).nickname || null,
          dateOfBirth: (user as any).dateOfBirth || null,
          gender: (user as any).gender || null,
          location: (user as any).location || null,
          mustChangePassword: (user as any).mustChangePassword || false,
        },
      },
    };
  }
}
