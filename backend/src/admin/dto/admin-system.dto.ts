import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSystemSettingsDto {
  @IsOptional()
  @IsNumber()
  platformFeePercentage?: number;

  @IsOptional()
  @IsNumber()
  platformFeeAmount?: number;
}
