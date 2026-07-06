import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApproveVendorCommand } from '../approve-vendor.command';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorEntity } from '../../../entities/vendor.entity';
import { UserEntity, UserRole } from '../../../entities/user.entity';
import { Repository } from 'typeorm';

@CommandHandler(ApproveVendorCommand)
export class ApproveVendorHandler implements ICommandHandler<ApproveVendorCommand> {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async execute(command: ApproveVendorCommand) {
    const vendor = await this.vendorRepo.findOne({
      where: { id: command.vendorId },
      relations: { user: true },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');

    vendor.verificationStatus = 'approved';
    await this.vendorRepo.save(vendor);

    if (vendor.user && vendor.user.role === UserRole.CUSTOMER) {
      vendor.user.role = UserRole.VENDOR;
      await this.userRepo.save(vendor.user);
    }

    return { success: true, vendorId: vendor.id };
  }
}
