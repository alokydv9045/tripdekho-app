import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
  Max,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @IsNotEmpty()
  tripId: string;

  @IsUUID()
  @IsOptional()
  bookingId?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  comment: string;
}

export class RespondToReviewDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  response: string;
}
