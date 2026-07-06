import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminDeleteVendorCommand } from '../admin-delete-vendor.command';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorEntity } from '../../../entities/vendor.entity';
import { TripEntity, TripStatus } from '../../../entities/trip.entity';
import { Repository } from 'typeorm';

@CommandHandler(AdminDeleteVendorCommand)
export class AdminDeleteVendorHandler implements ICommandHandler<AdminDeleteVendorCommand> {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,
  ) {}

  async execute(command: AdminDeleteVendorCommand) {
    const vendor = await this.vendorRepo.findOne({
      where: { id: command.targetVendorId },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');

    vendor.isDeleted = true;
    await this.vendorRepo.save(vendor);

    await this.tripRepo.update(
      { vendor: { id: vendor.id } },
      { isDeleted: true, status: TripStatus.PAUSED },
    );

    return { success: true };
  }
}
