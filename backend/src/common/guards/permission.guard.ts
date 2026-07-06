import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { UserEntity, UserRole } from '../../entities/user.entity';
import { Request } from 'express';

interface AuthenticatedUser {
  id?: string;
  sub?: string;
  role?: UserRole;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const user = request.user;

    if (!user) return false;

    // Super Admin bypass
    if (user.role === UserRole.SUPER_ADMIN) return true;

    const userRepo = this.dataSource.getRepository(UserEntity);
    const dbUser = await userRepo.findOne({
      where: { id: user.sub ?? user.id },
      relations: {
        roleEntity: {
          permissions: {
            permission: true,
          },
        },
      },
    });

    if (!dbUser || !dbUser.roleEntity || !dbUser.roleEntity.isActive) {
      return false;
    }

    const userPerms = dbUser.roleEntity.permissions.map(
      (rp) => `${rp.permission.module}:${rp.permission.action}`,
    );

    return requiredPermissions.every((rp) => userPerms.includes(rp));
  }
}
