import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingEntity } from '../../entities/booking.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { UpdateBookingStatusDto } from '../dto/admin-bookings.dto';

@Roles(UserRole.SUPER_ADMIN, UserRole.OPERATIONS_ADMIN)
@Controller('admin/bookings')
export class AdminBookingsController {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
  ) {}

  @Get()
  async getBookings(@Query() query: Record<string, unknown>) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const queryBuilder = this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.trip', 'trip')
      .orderBy('booking.createdAt', 'DESC');

    if (query.status && typeof query.status === 'string') {
      queryBuilder.andWhere('booking.status = :status', {
        status: query.status,
      });
    }

    if (query.search && typeof query.search === 'string') {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search OR booking.bookingNumber ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [bookings, total] = await queryBuilder.getManyAndCount();
    return { success: true, data: { bookings, total, page, limit } };
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateBookingStatusDto,
  ) {
    await this.bookingRepo.update(id, { status: body.status });
    return { success: true, data: { id, status: body.status } };
  }
}
