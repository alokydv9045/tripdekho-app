import { IsString, IsOptional, IsNumber, IsBoolean, IsNotEmpty, Min, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reach?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  conversions?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}

export class FeatureTripDto {
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;
}
