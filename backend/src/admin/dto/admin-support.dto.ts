import { IsString, IsOptional } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}

export class AddTicketMessageDto {
  @IsString()
  text: string;
}
