import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TripCategory, TripDifficulty } from '../../entities/trip.entity';
import { PriceType } from '../../entities/trip-price.entity';

class TripLocationDto {
  @IsString() @IsOptional() id?: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsOptional() state?: string;
  @IsString() @IsNotEmpty() country: string;
  @IsString() @IsOptional() address?: string;
  @IsNumber() @IsOptional() lat?: number;
  @IsNumber() @IsOptional() lng?: number;
  @IsString() @IsOptional() startLocation?: string;
  @IsString() @IsOptional() endLocation?: string;
  @IsArray() @IsOptional() @IsString({ each: true }) pickupLocations?: string[];
}

class TripPriceDto {
  @IsString() @IsOptional() id?: string;
  @IsNumber() @Min(0) amount: number;
  @IsString() @IsOptional() currency?: string;
  @IsNumber() @IsOptional() originalPrice?: number;
  @IsEnum(PriceType) @IsOptional() priceType?: PriceType;
  @IsArray() @IsOptional() occupancyOptions?: Array<{ type: string; price: number; originalPrice?: number }>;
}

class TripDateDto {
  @IsString() @IsOptional() id?: string;
  @IsDateString() startDate: Date;
  @IsDateString() endDate: Date;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) totalSeats: number;
}

class TripItineraryDto {
  @IsString() @IsOptional() id?: string;
  @IsNumber() @Min(1) dayNumber: number;
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() accommodation?: string;
  @IsOptional() meals?: { breakfast: boolean; lunch: boolean; dinner: boolean };
  @IsArray() @IsOptional() activities?: Array<{
    title: string;
    time?: string;
    description?: string;
    location?: string;
  }>;
}

export class CreateTripDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsOptional() shortDescription?: string;
  @IsString() @IsOptional() description?: string;
  @IsArray() @IsString({ each: true }) category: string[];
  @IsEnum(TripDifficulty) @IsOptional() difficulty?: TripDifficulty;

  @IsNumber() @Min(1) durationDays: number;
  @IsNumber() @Min(0) durationNights: number;
  @IsNumber() @Min(1) @IsOptional() minGroupSize?: number;
  @IsNumber() @Min(1) @IsOptional() maxGroupSize?: number;

  @IsArray() @IsOptional() @IsString({ each: true }) highlights?: string[];
  @IsArray() @IsOptional() @IsString({ each: true }) inclusions?: string[];
  @IsArray() @IsOptional() @IsString({ each: true }) exclusions?: string[];
  @IsArray() @IsOptional() @IsString({ each: true }) requirements?: string[];
  @IsArray() @IsOptional() @IsString({ each: true }) thingsToCarry?: string[];
  @IsArray() @IsOptional() @IsString({ each: true }) tags?: string[];

  @IsString() @IsOptional() importantNote?: string;
  @IsArray() @IsOptional() @IsString({ each: true }) pickupLocations?: string[];
  @IsArray() @IsOptional() @IsString({ each: true }) travelingLocations?: string[];
  @IsOptional() thumbnail?: { url: string };
  @IsOptional() routeMapImage?: { url: string };
  @IsOptional() isCustomizable?: boolean;
  @IsString() @IsOptional() contactWhatsApp?: string;

  @ValidateNested()
  @Type(() => TripLocationDto)
  @IsNotEmpty()
  location: TripLocationDto;
  @ValidateNested() @Type(() => TripPriceDto) @IsNotEmpty() price: TripPriceDto;
  @ValidateNested({ each: true })
  @Type(() => TripDateDto)
  @IsArray()
  @IsOptional()
  dates?: TripDateDto[];
  @ValidateNested({ each: true })
  @Type(() => TripItineraryDto)
  @IsArray()
  @IsOptional()
  itinerary?: TripItineraryDto[];
}
