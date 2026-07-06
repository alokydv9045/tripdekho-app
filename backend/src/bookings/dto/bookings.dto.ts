import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;
}

export class ConfirmBookingDto {
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CalculatePriceDto {
  @IsString()
  @IsNotEmpty()
  tripId: string;

  @IsString()
  @IsNotEmpty()
  departureId: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfGuests: number;

  @IsNumber()
  @IsOptional()
  pointsToRedeem?: number;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
