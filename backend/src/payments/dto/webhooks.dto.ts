import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class RazorpayWebhookDto {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsObject()
  payload: any;

  @IsString()
  @IsOptional()
  signature?: string;
}

export class StripeWebhookDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsObject()
  data: any;
}
