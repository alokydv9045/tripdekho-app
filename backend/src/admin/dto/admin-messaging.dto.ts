import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMessageTemplateDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
