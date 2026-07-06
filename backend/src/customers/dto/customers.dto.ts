import { IsString, IsNotEmpty, IsOptional, MaxLength, IsObject } from 'class-validator';

export class UpdateCustomerProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  nickname?: string;

  @IsOptional()
  dateOfBirth?: string | Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsObject()
  @IsOptional()
  location?: Record<string, any>;
}

export class DeleteAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  reason?: string;
}
