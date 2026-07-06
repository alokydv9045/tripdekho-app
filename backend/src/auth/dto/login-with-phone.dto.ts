import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginWithPhoneDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  phone: string;
}
