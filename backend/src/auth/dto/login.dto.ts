import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;

  @IsOptional()
  @IsBoolean()
  isAdminLogin?: boolean;
}
