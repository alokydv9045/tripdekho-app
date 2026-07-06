import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from '../../entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateUserDto, UpdateUserDto } from '../dto/admin-users.dto';
import * as bcrypt from 'bcryptjs';

@Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  @Get()
  async getAllUsers(@Query() query: Record<string, unknown>, @Req() req: any) {
    const currentUser = req.user;
    const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const { role, isVerified, isActive, search } = query;

    const queryBuilder = this.userRepo.createQueryBuilder('user');

    // Super admin can see plain text passwords
    if (isSuperAdmin) {
      queryBuilder.addSelect('user.plainTextPassword');
    }

    if (role) {
      if (role === 'super_admin') {
        queryBuilder.andWhere('user.role IN (:...adminRoles)', {
          adminRoles: [
            UserRole.SUPER_ADMIN,
            UserRole.TECH_ADMIN,
            UserRole.PLATFORM_ADMIN,
            UserRole.FINANCE_ADMIN,
            UserRole.GROWTH_ADMIN,
            UserRole.SUPPORT_ADMIN,
            UserRole.OPERATIONS_ADMIN,
            UserRole.ONBOARDING_ADMIN,
            UserRole.CONTENT_ADMIN,
          ],
        });
      } else {
        queryBuilder.andWhere('user.role = :role', { role });
      }
    }

    if (isVerified !== undefined && isVerified !== '') {
      queryBuilder.andWhere('user.isEmailVerified = :isVerified', { isVerified: isVerified === 'true' });
    }

    if (isActive !== undefined && isActive !== '') {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive: isActive === 'true' });
    }

    if (search) {
      queryBuilder.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
    }

    queryBuilder.skip((page - 1) * limit)
                .take(limit)
                .orderBy('user.createdAt', 'DESC');

    const [users, total] = await queryBuilder.getManyAndCount();
    return { success: true, data: { users, total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Req() req: any) {
    const currentUser = req.user;
    const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

    const queryBuilder = this.userRepo.createQueryBuilder('user')
      .where('user.id = :id', { id });

    if (isSuperAdmin) {
      queryBuilder.addSelect('user.plainTextPassword');
    }

    const user = await queryBuilder.getOne();
    if (!user) throw new NotFoundException('User not found');
    return { success: true, data: { user, stats: {} } };
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    const { password, isVerified, ...otherData } = userData;

    const existingUser = await this.userRepo.findOne({ where: { email: otherData.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password if provided, otherwise create a random one
    const plainPassword = password || Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(plainPassword, 12);

    const newUser = this.userRepo.create({
      ...otherData,
      passwordHash,
      plainTextPassword: plainPassword,
      isEmailVerified: isVerified || false,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
    });

    const savedUser = await this.userRepo.save(newUser);
    return { success: true, data: { user: savedUser } };
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updateData: Partial<UserEntity> = {};

    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    if (userData.role !== undefined) updateData.role = userData.role as UserRole;

    if (userData.password) {
      updateData.passwordHash = await bcrypt.hash(userData.password, 12);
      (updateData as any).plainTextPassword = userData.password;
    }

    if (userData.isVerified !== undefined) {
      updateData.isEmailVerified = userData.isVerified;
    }

    if (userData.isActive !== undefined) {
      updateData.isActive = userData.isActive;
    }

    await this.userRepo.update(id, updateData);
    const updatedUser = await this.userRepo.findOne({ where: { id } });

    return { success: true, data: { user: updatedUser } };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.delete(id);
    return { success: true, data: { success: true } };
  }
}
