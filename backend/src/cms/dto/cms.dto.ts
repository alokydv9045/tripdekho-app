import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsUrl,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateVibeVideoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  instagramUrl?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}

export class UpdateVibeVideoDto extends PartialType(CreateVibeVideoDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  order: number;
}

export class ReorderVibeVideosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orders: OrderItemDto[];
}

export class CreateVlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  instagramUrl?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateVlogDto extends PartialType(CreateVlogDto) {}

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  readTime?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}

export class CreateDestinationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  country?: string;
}

export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {}

export class ReverseGeocodeDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class UpdateGlobalSettingsDto {
  @IsString()
  @IsOptional()
  brandPhone?: string;

  @IsString()
  @IsOptional()
  brandEmail?: string;

  @IsString()
  @IsOptional()
  brandDescription?: string;

  @IsString()
  @IsOptional()
  brandAddress?: string;

  @IsString()
  @IsOptional()
  whatsappNumber?: string;

  @IsString()
  @IsOptional()
  operationTiming?: string;

  @IsBoolean()
  @IsOptional()
  isMaintenanceMode?: boolean;

  @IsString()
  @IsOptional()
  maintenanceMessage?: string;

  @IsBoolean()
  @IsOptional()
  alertActive?: boolean;

  @IsString()
  @IsOptional()
  alertMessage?: string;

  @IsString()
  @IsOptional()
  alertType?: string;

  @IsArray()
  @IsOptional()
  creatorSpotlight?: any[];

  @IsString()
  @IsOptional()
  vlogTrailerUrl?: string;

  @IsObject()
  @IsOptional()
  socialLinks?: Record<string, string>;
}
