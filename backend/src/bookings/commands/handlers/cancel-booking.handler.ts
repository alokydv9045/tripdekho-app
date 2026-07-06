import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelBookingCommand } from '../cancel-booking.command';
import { IBookingRepository } from '../../ports/booking.repository.interface';
import {
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripDateEntity } from '../../../entities/trip-date.entity';
import {
  BookingStatus,
  RefundStatus,
  PaymentStatus,
} from '../../../entities/booking.entity';

@CommandHandler(CancelBookingCommand)
export class CancelBookingHandler implements ICommandHandler<CancelBookingCommand> {
  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
    @InjectRepository(TripDateEntity)
    private readonly tripDateRepository: Repository<TripDateEntity>,
  ) {}

  async execute(command: CancelBookingCommand) {
    const booking = await this.bookingRepository.findById(command.bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.user.id !== command.userId) {
      throw new ForbiddenException('Not authorized');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancellationDate = new Date();

    if (booking.paymentStatus === PaymentStatus.PAID) {
      booking.refundAmount = booking.totalPrice * 0.5;
      booking.refundStatus = RefundStatus.PENDING;
    } else {
      booking.refundStatus = RefundStatus.NONE;
    }

    await this.bookingRepository.save(booking);

    if (booking.departure) {
      const departure = await this.tripDateRepository.findOne({
        where: { id: booking.departure.id },
      });
      if (departure) {
        departure.availableSeats += booking.totalGuests;
        departure.bookedSeats -= booking.totalGuests;
        await this.tripDateRepository.save(departure);
      }
    }

    return booking;
  }
}
