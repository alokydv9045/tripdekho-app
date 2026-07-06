import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../entities/booking.entity';

class LeadGuestDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsOptional() dateOfBirth?: Date;
  @IsString() @IsOptional() nationality?: string;
}

class AdditionalGuestDto {
  @IsString() @IsNotEmpty() name: string;
  @IsOptional() dateOfBirth?: Date;
  @IsString() @IsOptional() relationship?: string;
}

class GuestDetailsDto {
  @ValidateNested()
  @Type(() => LeadGuestDto)
  @IsNotEmpty()
  leadGuest: LeadGuestDto;
  @ValidateNested({ each: true })
  @Type(() => AdditionalGuestDto)
  @IsOptional()
  additionalGuests?: AdditionalGuestDto[];
  @IsString() @IsOptional() specialRequests?: string;
}

export class CreateBookingDto {
  @IsString() @IsNotEmpty() tripId: string;
  @IsString() @IsNotEmpty() departureId: string;

  @IsNumber() @Min(1) numberOfGuests: number;

  @ValidateNested()
  @Type(() => GuestDetailsDto)
  @IsNotEmpty()
  guestDetails: GuestDetailsDto;

  @IsEnum(PaymentMethod) @IsOptional() paymentMethod?: PaymentMethod;

  @IsString() @IsOptional() promoCode?: string;

  @IsNumber() @Min(0) @IsOptional() pointsToRedeem?: number;
}
