import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyVendorKycCommand } from '../verify-vendor-kyc.command';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorEntity } from '../../../entities/vendor.entity';
import { Repository } from 'typeorm';

@CommandHandler(VerifyVendorKycCommand)
export class VerifyVendorKycHandler implements ICommandHandler<VerifyVendorKycCommand> {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
  ) {}

  async execute(command: VerifyVendorKycCommand) {
    const vendor = await this.vendorRepo.findOne({
      where: { id: command.vendorId },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');

    vendor.kycStatus = 'Verified';
    vendor.verifiedAt = new Date();
    await this.vendorRepo.save(vendor);

    return { success: true, vendorId: vendor.id };
  }
}
