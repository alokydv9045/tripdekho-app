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
  BadRequestException,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from '../../entities/vendor.entity';
import { UserEntity, UserRole } from '../../entities/user.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CreateVendorDto,
  UpdateVendorDto,
  RejectVendorDto,
} from '../dto/admin-vendors.dto';
import * as bcrypt from 'bcryptjs';

@Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.ONBOARDING_ADMIN)
@Controller('admin/vendors')
export class AdminVendorsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  @Get()
  async getAllVendors(
    @Query() query: Record<string, unknown>,
    @Req() req: any,
  ) {
    const currentUser = req.user;
    const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    let qb = this.vendorRepo
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.user', 'user')
      .where('vendor.isDeleted = :isDeleted', { isDeleted: false });

    if (query.status && typeof query.status === 'string') {
      if (query.status === 'approved') {
        qb = qb.andWhere('vendor.verificationStatus IN (:...statuses)', {
          statuses: ['approved', 'verified'],
        });
      } else {
        qb = qb.andWhere('vendor.verificationStatus = :status', {
          status: query.status,
        });
      }
    }

    if (query.search && typeof query.search === 'string') {
      qb = qb.andWhere(
        '(vendor.businessName ILIKE :search OR vendor.contactEmail ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb = qb
      .orderBy('vendor.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (isSuperAdmin) {
      qb.addSelect('user.plainTextPassword');
    }

    const [vendors, total] = await qb.getManyAndCount();

    return { success: true, data: { vendors, total, page, limit } };
  }

  @Get(':id')
  async getVendor(@Param('id') id: string, @Req() req: any) {
    const currentUser = req.user;
    const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

    const qb = this.vendorRepo
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.user', 'user')
      .where('vendor.id = :id', { id });

    if (isSuperAdmin) {
      qb.addSelect('user.plainTextPassword');
    }

    const vendor = await qb.getOne();

    if (!vendor) throw new NotFoundException('Vendor not found');
    return { success: true, data: { vendor, stats: {} } };
  }

  @Patch(':id/approve')
  async approveVendor(@Param('id') id: string) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    await this.vendorRepo.update(id, { verificationStatus: 'approved' });
    return { success: true, data: { success: true } };
  }

  @Patch(':id/verify-kyc')
  async verifyKYC(@Param('id') id: string) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    await this.vendorRepo.update(id, { kycStatus: 'verified' });
    return { success: true, data: { success: true } };
  }

  @Patch(':id/reject-kyc')
  async rejectKYC(@Param('id') id: string) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    await this.vendorRepo.update(id, { kycStatus: 'rejected' });
    return { success: true, data: { success: true } };
  }

  @Post()
  async createVendor(@Body() vendorData: CreateVendorDto) {
    if (!vendorData.contactEmail) {
      throw new BadRequestException('Contact email is required');
    }

    let user = await this.userRepo.findOne({
      where: { email: vendorData.contactEmail },
    });

    if (!user) {
      if (!vendorData.password)
        throw new BadRequestException('Password is required');
      const passwordHash = await bcrypt.hash(vendorData.password, 12);

      const newUser = this.userRepo.create({
        email: vendorData.contactEmail,
        name: vendorData.businessName || 'Vendor Account',
        role: UserRole.VENDOR,
        passwordHash,
        plainTextPassword: vendorData.password,
        isEmailVerified: true,
        mustChangePassword: true,
      });
      user = await this.userRepo.save(newUser);
    }

    // Check if a vendor profile already exists for this user
    const existingVendor = await this.vendorRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (existingVendor) {
      throw new BadRequestException(
        'A vendor profile already exists for this email address',
      );
    }

    // Destructure password out — it's not a VendorEntity field
    const { password: _pw, ...vendorFields } = vendorData;

    const newVendor = this.vendorRepo.create({
      ...vendorFields,
      user: user,
      verificationStatus: vendorData.verificationStatus || 'approved',
      kycStatus: vendorData.kycStatus || 'pending',
    });

    const savedVendor = await this.vendorRepo.save(newVendor);

    return {
      success: true,
      data: { user, vendor: savedVendor },
    };
  }

  @Patch(':id/reject')
  async rejectVendor(@Param('id') id: string, @Body() _body: RejectVendorDto) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    await this.vendorRepo.update(id, { verificationStatus: 'rejected' });
    return { success: true, data: { success: true } };
  }

  @Patch(':id')
  async updateVendor(
    @Param('id') id: string,
    @Body() vendorData: UpdateVendorDto,
  ) {
    const vendor = await this.vendorRepo.findOne({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    await this.vendorRepo.update(id, vendorData);
    const updated = await this.vendorRepo.findOne({ where: { id } });
    return { success: true, data: { vendor: updated } };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteVendor(@Param('id') id: string) {
    const vendor = await this.vendorRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');

    await this.vendorRepo.softDelete(id);
    if (vendor.user) {
      await this.userRepo.softDelete(vendor.user.id);
    }

    return { success: true, data: { success: true } };
  }
}
