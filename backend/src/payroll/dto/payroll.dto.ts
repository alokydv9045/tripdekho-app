import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class ProcessPayrollDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  bookingId?: string;
}
