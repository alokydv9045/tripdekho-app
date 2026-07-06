import {
  Controller,
  Get,
  Param,
  Put,
  Patch,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripEntity, TripStatus } from '../../entities/trip.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import {
  UpdateTripDto,
  ForceUpdateTripDto,
  UpdateTripStatusDto,
} from '../dto/admin-trips.dto';

@Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.OPERATIONS_ADMIN)
@Controller('admin/trips')
export class AdminTripsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,
  ) {}

  @Get()
  async getTrips(@Query() query: Record<string, unknown>) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const queryBuilder = this.tripRepo
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.vendor', 'vendor')
      .leftJoinAndSelect('trip.price', 'price')
      .leftJoinAndSelect('trip.location', 'location')
      .orderBy('trip.createdAt', 'DESC');

    if (query.status && typeof query.status === 'string') {
      queryBuilder.andWhere('trip.status = :status', { status: query.status });
    }

    if (query.category && typeof query.category === 'string') {
      queryBuilder.andWhere('trip.category LIKE :category', {
        category: `%${query.category}%`,
      });
    }

    if (query.search && typeof query.search === 'string') {
      queryBuilder.andWhere(
        '(trip.title ILIKE :search OR vendor.businessName ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [trips, total] = await queryBuilder.getManyAndCount();

    return { success: true, data: { trips, total, page, limit } };
  }

  @Get('audit')
  async auditTrips() {
    const defectiveTrips = await this.tripRepo.find({
      where: { status: TripStatus.REJECTED },
    });
    return {
      success: true,
      data: { count: defectiveTrips.length, defectiveTrips },
    };
  }

  @Patch(':id')
  async updateTrip(@Param('id') id: string, @Body() tripData: UpdateTripDto) {
    const trip = await this.tripRepo.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');
    await this.tripRepo.update(id, tripData as Partial<TripEntity>);
    const updated = await this.tripRepo.findOne({ where: { id } });
    return {
      success: true,
      data: { success: true, data: updated },
    };
  }

  @Put(':id/force-admin')
  async forceUpdateTrip(
    @Param('id') id: string,
    @Body() tripData: any, // Use any because ForceUpdateTripDto might not match nested price
  ) {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: { price: true },
    });
    if (!trip) throw new NotFoundException('Trip not found');

    if (tripData.price && typeof tripData.price.amount === 'number') {
      if (trip.price) {
        trip.price.amount = tripData.price.amount;
      } else {
        trip.price = { amount: tripData.price.amount, currency: 'INR' } as any;
      }
      delete tripData.price;
    } else if (tripData.price && typeof tripData.price.basePrice === 'number') {
      // Handle the case where the frontend mistakenly sends basePrice
      if (trip.price) {
        trip.price.amount = tripData.price.basePrice;
      } else {
        trip.price = {
          amount: tripData.price.basePrice,
          currency: 'INR',
        } as any;
      }
      delete tripData.price;
    }

    Object.assign(trip, tripData);
    await this.tripRepo.save(trip);

    const updated = await this.tripRepo.findOne({
      where: { id },
      relations: { price: true },
    });
    return { success: true, data: { trip: updated } };
  }

  @Patch(':id/status')
  async updateTripStatus(
    @Param('id') id: string,
    @Body() body: UpdateTripStatusDto,
  ) {
    const trip = await this.tripRepo.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');
    await this.tripRepo.update(id, { status: body.status });
    return { success: true, data: { success: true } };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTrip(@Param('id') id: string) {
    const trip = await this.tripRepo.findOne({ where: { id } });
    if (!trip) throw new NotFoundException('Trip not found');
    await this.tripRepo.softDelete(id);
    return { success: true, data: { success: true } };
  }
}
