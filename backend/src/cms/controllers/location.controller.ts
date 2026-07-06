import { Controller, Post, Body } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { ReverseGeocodeDto } from '../dto/cms.dto';

@Controller('location')
export class LocationController {
  @Public()
  @Post('reverse-geocode')
  async reverseGeocode(@Body() body: ReverseGeocodeDto) {
    // Return Delhi as a mock city
    return {
      success: true,
      data: {
        city: 'Delhi',
        latitude: body.latitude,
        longitude: body.longitude,
      },
    };
  }
}
