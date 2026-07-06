import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  businessName: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  verificationStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  kycStatus?: string;
}

export class UpdateVendorDto extends PartialType(CreateVendorDto) {}

export class RejectVendorDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}
