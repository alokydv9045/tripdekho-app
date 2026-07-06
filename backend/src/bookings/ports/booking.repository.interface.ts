import { BookingEntity } from '../../entities/booking.entity';

export const IBookingRepository = Symbol('IBookingRepository');

export interface IBookingRepository {
  create(data: Partial<BookingEntity>): Promise<BookingEntity>;
  findById(id: string): Promise<BookingEntity | null>;
  findByBookingNumber(bookingNumber: string): Promise<BookingEntity | null>;
  save(booking: BookingEntity): Promise<BookingEntity>;
  findUserBookings(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<[BookingEntity[], number]>;
}
