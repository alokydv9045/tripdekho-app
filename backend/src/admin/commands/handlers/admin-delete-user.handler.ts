import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminDeleteUserCommand } from '../admin-delete-user.command';
import { Inject, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../auth/ports/user.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorEntity } from '../../../entities/vendor.entity';
import { TripEntity, TripStatus } from '../../../entities/trip.entity';
import { UserRole } from '../../../entities/user.entity';
import { Repository } from 'typeorm';

@CommandHandler(AdminDeleteUserCommand)
export class AdminDeleteUserHandler implements ICommandHandler<AdminDeleteUserCommand> {
  constructor(
    @Inject(IUserRepository) private readonly userRepo: IUserRepository,
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,
  ) {}

  async execute(command: AdminDeleteUserCommand) {
    const user = await this.userRepo.findById(command.targetUserId);
    if (!user) throw new NotFoundException('User not found');

    user.isDeleted = true;
    user.isActive = false;
    await this.userRepo.save(user);

    if (user.role === UserRole.VENDOR || user.role === UserRole.SUPER_ADMIN) {
      const vendor = await this.vendorRepo.findOne({
        where: { user: { id: user.id } },
      });
      if (vendor) {
        vendor.isDeleted = true;
        await this.vendorRepo.save(vendor);

        // Soft delete all their trips
        await this.tripRepo.update(
          { vendor: { id: vendor.id } },
          { isDeleted: true, status: TripStatus.PAUSED },
        );
      }
    }

    return { success: true };
  }
}
