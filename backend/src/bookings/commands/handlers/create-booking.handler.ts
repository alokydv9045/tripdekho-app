import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookingCommand } from '../create-booking.command';
import { IBookingRepository } from '../../ports/booking.repository.interface';
import { ITripRepository } from '../../../trips/ports/trip.repository.interface';
import {
  Inject,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import {
  BookingEntity,
  PaymentStatus,
  BookingStatus,
} from '../../../entities/booking.entity';
import { UserEntity } from '../../../entities/user.entity';
import { TripDateEntity } from '../../../entities/trip-date.entity';
import { RewardsService } from '../../../rewards/rewards.service';
import { TransactionSource } from '../../../entities/point-transaction.entity';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');

@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler implements ICommandHandler<CreateBookingCommand> {
  private razorpay: unknown;

  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
    @Inject(ITripRepository)
    private readonly tripRepository: ITripRepository,
    @InjectRepository(TripDateEntity)
    private readonly tripDateRepository: Repository<TripDateEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly rewardsService: RewardsService,
    private readonly configService: ConfigService,
  ) {
    if (this.configService.get<string>('RAZORPAY_KEY_ID') && this.configService.get<string>('RAZORPAY_KEY_SECRET')) {
      this.razorpay = new Razorpay({
        key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
        key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
      });
    }
  }

  async execute(command: CreateBookingCommand): Promise<BookingEntity> {
    const { userId, createBookingDto } = command;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const trip = await this.tripRepository.findById(createBookingDto.tripId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const departure = trip.dates?.find(
      (d) => d.id === createBookingDto.departureId,
    );
    if (!departure) {
      throw new NotFoundException('Departure date not found for this trip');
    }

    console.log('SEAT CHECK:', { available: departure.availableSeats, guests: createBookingDto.numberOfGuests, availableType: typeof departure.availableSeats, guestsType: typeof createBookingDto.numberOfGuests });
    if (Number(departure.availableSeats) < Number(createBookingDto.numberOfGuests)) {
      throw new BadRequestException('Not enough seats available');
    }

    // Pricing calculation dynamically loaded from Config (with defaults)
    const basePrice = departure.price * createBookingDto.numberOfGuests;
    const platformFee = 0; // We can extract this to a service later
    const serviceFee = 0;
    
    const taxRate = this.configService.get<number>('TAX_RATE', 0.05);
    const platformCommissionRate = this.configService.get<number>('PLATFORM_COMMISSION_RATE', 0.1);

    const taxes = basePrice * taxRate;
    let discount = 0;

    const pointsToRedeem = createBookingDto.pointsToRedeem;
    if (pointsToRedeem && pointsToRedeem > 0) {
      // 1 point = 1 INR
      discount = pointsToRedeem;
    }

    const totalPrice = Math.max(0, basePrice + platformFee + serviceFee + taxes - discount);
    const vendorAmount = basePrice * (1 - platformCommissionRate);

    // If points are being redeemed, deduct them now before finalizing
    if (pointsToRedeem && pointsToRedeem > 0) {
      // This will throw BadRequestException if balance is insufficient
      await this.rewardsService.deductPoints(
        userId,
        pointsToRedeem,
        TransactionSource.REDEMPTION,
        `Redeemed for booking of ${trip.title}`
      );
    }

    // Generate Booking Number
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
    const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
    const bookingNumber = `BK-${dateStr}-${randomStr}`;

    let razorpayOrderId = null;

    // Call Razorpay API for real order ID
    if (this.configService.get<string>('MOCK_PAYMENT') === 'true' || this.configService.get<string>('RAZORPAY_KEY_ID')?.includes('your_key')) {
      razorpayOrderId = `mock_order_${crypto.randomBytes(8).toString('hex')}`;
    } else if (this.razorpay) {
      try {
        const order = await (this.razorpay as any).orders.create({
          amount: Math.round(totalPrice * 100), // Amount in paise
          currency: 'INR',
          receipt: bookingNumber,
        });
        razorpayOrderId = order.id;
      } catch (err: any) {
        const errorMessage = err?.error?.description || err?.message || JSON.stringify(err);
        throw new InternalServerErrorException(
          `Razorpay Order Creation Failed: ${errorMessage}`,
        );
      }
    } else {
      throw new InternalServerErrorException(
        'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing in environment',
      );
    }

    const bookingData: Partial<BookingEntity> = {
      bookingNumber,
      trip,
      user,
      vendor: trip.vendor,
      departure,
      tripSnapshot: {
        title: trip.title,
        slug: trip.slug,
        duration: { days: trip.durationDays, nights: trip.durationNights },
        location: {
          city: trip.location?.city,
          country: trip.location?.country,
        },
        image: trip.media?.[0]?.url || '',
      },
      totalGuests: createBookingDto.numberOfGuests,
      guestDetails: createBookingDto.guestDetails,
      basePrice,
      platformFee,
      serviceFee,
      taxes,
      discount,
      totalPrice,
      vendorAmount,
      razorpayOrderId,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: createBookingDto.paymentMethod,
      status: BookingStatus.CONFIRMED,
    };

    const booking = await this.bookingRepository.create(bookingData);

    // Decrement inventory
    departure.availableSeats -= createBookingDto.numberOfGuests;
    departure.bookedSeats += createBookingDto.numberOfGuests;
    await this.tripDateRepository.save(departure);

    return booking;
  }
}
