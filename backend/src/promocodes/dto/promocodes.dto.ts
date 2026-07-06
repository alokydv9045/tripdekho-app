import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class ApplyPromoCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  purchaseAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;
}
