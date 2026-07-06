import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { AuthGuard } from '@nestjs/passport';
import { ItineraryParamsDto, GenerateRouteMapDto, GenerateTripImageDto, GenerateTripDetailsDto } from './dto/ai.dto';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('generate')
  async generateItinerary(@Body() body: ItineraryParamsDto) {
    const data = await this.openAIService.generateItinerary(body);
    return { success: true, data };
  }

  @Post('generate-map')
  async generateRouteMap(@Body() body: GenerateRouteMapDto) {
    const url = await this.openAIService.generateRouteMap(body.locations, body.title);
    return { success: true, data: { url } };
  }

  @Post('generate-trip-image')
  async generateTripImage(@Body() body: GenerateTripImageDto) {
    const url = await this.openAIService.generateTripImage(body.title, body.destination, body.vibe || 'scenic');
    return { success: true, data: { url } };
  }

  @Post('generate-trip-details')
  async generateTripDetails(@Body() body: GenerateTripDetailsDto) {
    const data = await this.openAIService.generateTripDetails(body.title, body.destination);
    return { success: true, data };
  }
}
