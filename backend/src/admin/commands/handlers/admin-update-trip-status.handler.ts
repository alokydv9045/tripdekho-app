import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AdminUpdateTripStatusCommand } from '../admin-update-trip-status.command';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TripEntity, TripStatus } from '../../../entities/trip.entity';
import { Repository } from 'typeorm';

@CommandHandler(AdminUpdateTripStatusCommand)
export class AdminUpdateTripStatusHandler implements ICommandHandler<AdminUpdateTripStatusCommand> {
  constructor(
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,
  ) {}

  async execute(command: AdminUpdateTripStatusCommand) {
    const validStatuses = [
      'approved',
      'rejected',
      'pending_review',
      'published',
      'paused',
      'draft',
    ];
    if (!validStatuses.includes(command.status)) {
      throw new BadRequestException('Invalid status profile');
    }

    const trip = await this.tripRepo.findOne({ where: { id: command.tripId } });
    if (!trip) throw new NotFoundException('Trip not found');

    trip.status = command.status as TripStatus;

    if (command.status === 'rejected' && command.reason) {
      trip.rejectionReason = command.reason;
    }

    if (command.status === 'published' || command.status === 'approved') {
      trip.publishedAt = new Date();
      if (command.status === 'approved') {
        trip.status = TripStatus.PUBLISHED;
      }
    }

    await this.tripRepo.save(trip);

    return { success: true, tripId: trip.id, newStatus: trip.status };
  }
}
