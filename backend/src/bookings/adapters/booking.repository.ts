import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { IBookingRepository } from '../ports/booking.repository.interface';

@Injectable()
export class BookingRepository implements IBookingRepository {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
  ) {}

  async create(data: Partial<BookingEntity>): Promise<BookingEntity> {
    const booking = this.bookingRepo.create(data);
    return this.bookingRepo.save(booking);
  }

  async findById(id: string): Promise<BookingEntity | null> {
    return this.bookingRepo.findOne({
      where: { id },
      relations: { trip: true, user: true, vendor: true, departure: true },
    });
  }

  async findByBookingNumber(
    bookingNumber: string,
  ): Promise<BookingEntity | null> {
    return this.bookingRepo.findOne({
      where: { bookingNumber },
      relations: { trip: true, user: true, vendor: true, departure: true },
    });
  }

  async save(booking: BookingEntity): Promise<BookingEntity> {
    return this.bookingRepo.save(booking);
  }

  async findUserBookings(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<[BookingEntity[], number]> {
    return this.bookingRepo.findAndCount({
      where: { user: { id: userId } },
      relations: { trip: true, vendor: true },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }
}
