import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
  Res,
} from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../common/decorators/public.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  VerifyPaymentDto,
  CalculatePriceDto,
  SendMessageDto,
} from './dto/bookings.dto';
import { CreateBookingCommand } from './commands/create-booking.command';
import { CalculatePriceQuery } from './queries/calculate-price.query';
import { ConfirmPaymentCommand } from './commands/confirm-payment.command';
import { CancelBookingCommand } from './commands/cancel-booking.command';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from '../entities/booking.entity';
import { TripEntity } from '../entities/trip.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';
import { Repository } from 'typeorm';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
  ) {}

  @Post()
  async createBooking(
    @CurrentUser('id') userId: string,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<unknown> {
    return this.commandBus.execute(
      new CreateBookingCommand(userId, createBookingDto),
    );
  }

  // Fixed: frontend calls POST /bookings/calculate (not calculate-price)
  @Public()
  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculatePrice(
    @CurrentUser('id') userId: string | undefined,
    @Body() body: CalculatePriceDto,
  ) {
    return this.queryBus.execute(
      new CalculatePriceQuery(
        body.tripId,
        body.departureId,
        body.numberOfGuests,
        userId,
        body.pointsToRedeem,
      ),
    );
  }

  @Get('my-bookings')
  async getMyBookings(
    @CurrentUser('id') userId: string,
    @Query() query: Record<string, unknown>,
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const [bookings, total] = await this.bookingRepo.findAndCount({
      where: { user: { id: userId } },
      relations: {
        trip: { location: true, vendor: { user: true } },
        departure: true,
        vendor: { user: true },
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Lazy Evaluation: Automatically mark past confirmed bookings as completed
    let needsSave = false;
    const now = new Date();
    for (const booking of bookings) {
      if (booking.status === 'confirmed' && booking.departure?.endDate) {
        if (new Date(booking.departure.endDate) < now) {
          booking.status = 'completed' as any;
          needsSave = true;
        }
      }
    }

    if (needsSave) {
      await this.bookingRepo.save(
        bookings.filter((b) => b.status === 'completed'),
      );
    }

    return {
      success: true,
      data: { bookings, total, page, totalPages: Math.ceil(total / limit) },
    };
  }

  @Get(':id')
  async getBookingById(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const booking = await this.bookingRepo.findOne({
      where: { id, user: { id: userId } },
      relations: { trip: true, vendor: { user: true }, departure: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    let avgRating = 0;
    if (booking.vendor) {
      const trips = await this.bookingRepo.manager.find(TripEntity, {
        where: { vendor: { id: booking.vendor.id } },
        select: { id: true },
      });
      const tripIds = trips.map((t) => t.id);

      if (tripIds.length > 0) {
        const ratingResult = await this.bookingRepo.manager
          .createQueryBuilder(ReviewEntity, 'review')
          .where('review.trip_id IN (:...tripIds)', { tripIds })
          .andWhere('review.status = :status', { status: 'approved' })
          .select('AVG(review.rating)', 'avg')
          .getRawOne();
        avgRating = parseFloat(ratingResult?.avg) || 0;
      }
      (booking.vendor as any).avgRating = Math.round(avgRating * 10) / 10;
    }

    return { success: true, data: booking };
  }

  @Post(':id/confirm-payment')
  @HttpCode(HttpStatus.OK)
  async confirmPayment(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: VerifyPaymentDto,
  ) {
    return this.commandBus.execute(
      new ConfirmPaymentCommand(
        userId,
        id,
        body.razorpayPaymentId,
        body.razorpaySignature,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async cancelBookingDelete(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<unknown> {
    return this.commandBus.execute(new CancelBookingCommand(userId, id));
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelBookingPost(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<unknown> {
    return this.commandBus.execute(new CancelBookingCommand(userId, id));
  }

  @Patch(':id')
  async updateBooking(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateBookingDto,
  ) {
    await this.bookingRepo.update({ id, user: { id: userId } }, data);
    const updated = await this.bookingRepo.findOne({
      where: { id },
      relations: { trip: true },
    });
    return { success: true, data: updated };
  }

  @Post(':id/request-refund')
  @HttpCode(HttpStatus.OK)
  async requestRefund(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    await this.bookingRepo.update(
      { id, user: { id: userId } },
      { refundStatus: 'requested' as BookingEntity['refundStatus'] },
    );
    return { success: true, message: 'Refund requested successfully' };
  }

  @Get(':id/invoice')
  downloadInvoice(@CurrentUser('id') _userId: string, @Param('id') id: string) {
    const invoiceUrl = `/api/v2/bookings/${id}/receipt-pdf`;
    return {
      success: true,
      data: { url: invoiceUrl },
      message: 'Invoice generated successfully',
    };
  }

  @Public()
  @Get(':id/receipt-pdf')
  async getReceiptPdf(@Param('id') id: string, @Res() res: ExpressResponse) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: {
        trip: true,
        vendor: { user: true },
        user: true,
        departure: true,
      },
    });

    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${booking.bookingNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #fbbf24; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 900; color: #111; letter-spacing: 2px; }
          .logo span { color: #fbbf24; }
          .invoice-details { text-align: right; }
          .row { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .box { background: #f9fafb; padding: 20px; border-radius: 12px; width: 48%; }
          table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
          th { background: #f9fafb; font-weight: 800; text-transform: uppercase; font-size: 12px; color: #666; }
          .total { font-size: 20px; font-weight: 900; }
          .footer { margin-top: 50px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">TRIP<span>DEKHO</span></div>
          <div class="invoice-details">
            <h2 style="margin:0 0 5px 0;">PAYMENT RECEIPT</h2>
            <p style="margin:0; color:#666;">Booking Ref: <strong>${booking.bookingNumber}</strong></p>
            <p style="margin:0; color:#666;">Date: ${new Date(booking.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div class="row">
          <div class="box">
            <h3 style="margin-top:0; font-size: 12px; text-transform: uppercase; color:#888;">Billed To:</h3>
            <p style="font-weight: bold; margin: 5px 0;">${booking.user.name}</p>
            <p style="margin: 0; color: #555;">${booking.user.email && !booking.user.email.includes('guest_') ? booking.user.email : 'Phone Authenticated'}</p>
          </div>
          <div class="box">
            <h3 style="margin-top:0; font-size: 12px; text-transform: uppercase; color:#888;">Trip Details:</h3>
            <p style="font-weight: bold; margin: 5px 0;">${booking.trip?.title}</p>
            <p style="margin: 0; color: #555;">Status: <strong>${booking.paymentStatus.toUpperCase()}</strong></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Guests</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>${booking.trip?.title}</strong><br/>
                <span style="font-size:12px; color:#666;">Travel Date: ${booking.departure?.startDate ? new Date(booking.departure.startDate).toLocaleDateString() : 'TBD'}</span>
              </td>
              <td>${booking.totalGuests}</td>
              <td>₹${Number(booking.basePrice).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: right; color: #666;">Platform Fee</td>
              <td>₹${Number(booking.platformFee).toLocaleString('en-IN')}</td>
            </tr>
            ${
              booking.discount
                ? `
            <tr>
              <td colspan="2" style="text-align: right; color: #d97706;">Discount Applied</td>
              <td style="color: #d97706;">-₹${Number(booking.discount).toLocaleString('en-IN')}</td>
            </tr>
            `
                : ''
            }
            <tr>
              <td colspan="2" style="text-align: right;" class="total">Total Paid</td>
              <td class="total">₹${Number(booking.totalPrice).toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Thank you for booking with TripDekho. For any queries, contact support@tripdekho.com</p>
          <p>Razorpay Transaction ID: ${booking.razorpayPaymentId || 'N/A'}</p>
        </div>
        <script>
          // Auto-print prompt
          window.onload = () => { setTimeout(() => window.print(), 500); }
        </script>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Invoice_${booking.bookingNumber}.html"`,
    );
    return res.send(html);
  }

  @Post(':id/message')
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: SendMessageDto,
  ) {
    return { success: true, message: 'Message sent' };
  }

  @Get(':id/messages')
  getMessages(
    @CurrentUser('id') _userId: string,
    @Param('id') _id: string,
    @Query() _query: Record<string, unknown>,
  ) {
    return { success: true, data: [] };
  }
}
