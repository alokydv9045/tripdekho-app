import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';

export class ItineraryParamsDto {
  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  @Min(1)
  days: number;

  @IsString()
  @IsNotEmpty()
  budget: string;

  @IsArray()
  @IsString({ each: true })
  interests: string[];
}

export class GenerateRouteMapDto {
  @IsArray()
  @IsString({ each: true })
  locations: string[];

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class GenerateTripImageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsString()
  @IsOptional()
  vibe?: string;
}

export class GenerateTripDetailsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  destination?: string;
}
